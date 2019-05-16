import * as THREE from 'three';
import HuiaPostprocessing from './postprocessing/HuiaPostprocessing';

import HuiaScene from './huiascene/HuiaScene';
import BackgroundScene from './backgroundscene/BackgroundScene';
import ParticlesScene from './particlesscene/ParticlesScene';
import Globals from '../../../core/Globals';
import UserGesturesManager from './UserGesturesManager';
import {GPUMonitor,GPUMonitorMode} from '../../../core/GPUMonitor';
import SoundsLoader from "../../../loaders/SoundsLoader";

import JDLoader from './loaders/JDLoader';



export default class Environment {

  constructor(canvas){
    JDLoader(THREE);
    this.canvas = canvas;
    // create renderer and clock
    this.clock = new THREE.Clock();
    window.threeClock = this.clock;

    this.quality = (window.MOBILE_DETECT.mobile()) ? 2 : 1;

    this.tick = 0;
    this.renderer = new THREE.WebGLRenderer({canvas : canvas, premultipliedAlpha : true, alpha : true, antialias : false});
    this.renderer.setPixelRatio(window.devicePixelRatio * 0.75);
    this.renderer.setClearColor(0x05040e);
    window.renderer = this.renderer;

    this.renderer.autoClear = false;
    this.renderer.setSize(window.innerWidth,window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowCameraNear = 3;
    this.renderer.shadowCameraFov = 50;
    this.renderer.shadowMap.renderReverseSided = false;
    this.renderer.shadowMapBias = 0.0039;
    this.renderer.shadowMapDarkness = 0.5;
    this.renderer.shadowMapSoft = false;
    this.renderer.shadowMapWidth = 512;
    this.renderer.shadowMapHeight = 512;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // scenes
    this.backgroundScene = new BackgroundScene();
    this.huiaScene = new HuiaScene();
    window.huiaScene = this.huiaScene;


    
    
    // if(!window.MOBILE_DETECT.mobile()){
      this.createPostprocessing();
      this.particlesScene = new ParticlesScene();
    // }

    this.particlesEnabled = true;
    this.postProcessingEnabled = true;


    // making some methods public
    this.destroy = this.destroy.bind(this);
    this.emmitParticles = this.emmitParticles.bind(this);
    this.entranceAnimation = this.entranceAnimation.bind(this);

    this.onResizeWindow();

    this.gpuMonitor = new GPUMonitor(2);
    this.entranceAnimation();

    this.gesturesManager = new UserGesturesManager(this);
    window.addEventListener('resize', this.onResizeWindow.bind(this));
    this.render();


    SoundsLoader.playSound("ambientloop", true, 0.2, 1);
    SoundsLoader.playSound("ambientinternalloop", true, 0, 1);
  }

  setBlur(b,animated){
    this.postprocessing.setBlur(b,animated);
    this.huiaScene.setLightsForce(b,animated);
    SoundsLoader.setBlurSound(b,animated);

    if(b){
      this.gesturesManager.disable();
      this.blurred = b;
      window.qualityEnabled = false;

      if(window.qualityControlUi)
        window.qualityControlUi.disableQuality();
      this.setQuality(5,false);
    }else{
      this.setQuality(this.gpuMonitor.suggestedQuality,false);
      this.blurred = b;
      window.qualityEnabled = true;

      if(window.qualityControlUi)
        window.qualityControlUi.enableQuality();
      this.gesturesManager.enable();
    }
  }

  land () {
    this.huiaScene.land();
  }


  flyToExperience () {
    // this.particlesEnabled = false;
    // this.postProcessingEnabled = false;
    this.huiaScene.flyToExperience();

    TweenMax.to(this.canvas, 0.5, {opacity : 0, delay : 1.5, ease : Linear.easeNone, onComplete:this.flyToPreloader, onCompleteScope:this});
  }

  flyToPreloader () {
    this.particlesEnabled = false;
    this.postProcessingEnabled = false;
    this.huiaScene.setPreloadingScene();
    this.backgroundScene.setPreloadingScene();
    TweenMax.to(this.canvas, 1, {opacity : 1, delay : 1, ease : Linear.easeNone});
  }

  setQuality(value, internal){
    this.quality = value;

    if(internal){
      if(window.qualityControlUi){
        window.qualityControlUi.updateQualityIndicator(this.quality);
      }
    }
    // this.renderer.antialias = value;
    if(value > 2){
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.onResizeWindow();
    }else{
      this.renderer.setPixelRatio(window.devicePixelRatio/1.5);
      this.onResizeWindow();
    }
  }


  onResizeWindow(evt){
    var divider = this.quality;

    if(window.MOBILE_DETECT.mobile()){
      this.renderer.setSize( window.innerWidth/divider, window.innerHeight/divider );
      TweenMax.set(this.renderer.domElement, {transformOrigin : "0px 0px", scaleX : divider, scaleY : divider});
    }else{
      this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    if(this.huiaScene)
      this.huiaScene.setSize(window.innerWidth/divider,window.innerHeight/divider);

    if(this.particlesScene)
      this.particlesScene.setSize(window.innerWidth/divider,window.innerHeight/divider);

    if(this.postprocessing)
      this.postprocessing.setSize(window.innerWidth/divider, window.innerHeight/divider);
  }

  entranceAnimation() {
    // if(this.huiaScene)
    //   this.huiaScene.entranceAnimation();
    TweenMax.to(this, 2, {onComplete:this.startGPUCounter.bind(this)});
  }

  startGPUCounter () {
    if(window.MOBILE_DETECT.mobile()) return;

    this.gpuMonitor.addEventListener('change', this.onChangeSuggestedQuality.bind(this));
    this.gpuMonitor.start();
  }


  createPostprocessing() {
    this.postprocessing = new HuiaPostprocessing(this.huiaScene, this.renderer, this.huiaScene.camera, this.huiaScene.bird);
  }

  emmitParticles (options,quantity){
    this.particlesScene.emmitParticles(options,quantity);
  }


  showBackgroundProject(background,color){
    this.particlesScene.showBackgroundProject(background,color);
  }

  hideBackgroundProject(){
    this.particlesScene.hideBackgroundProject();
  }


  destroy() {
    window.cancelAnimationFrame(this.requestId);
    this.requestId = null;
    this.destroyed = true;
    if(this.gui){
      this.gui.destroy();
    }

    // for(var i = this.scene.children.length-1; i >= 0; i--){
    //   this.scene.remove(this.scene.children[i]);
    // }
    this.renderer.clear();
    window.removeEventListener('resize', this.onResizeWindow.bind(this));
  }


  render() {
    var delta = this.clock.getDelta();
    // console.log(delta);
    this.tick += delta;
    if(this.mixer){
      this.mixer.update(delta);
    }

    if(this.huiaScene)
      this.huiaScene.updateDelta(delta, this.tick);


    if(this.particlesScene && this.particlesEnabled)
      this.particlesScene.update(this.tick);

    this.renderer.clear();                     // clear buffers


    if(this.backgroundScene)
      this.renderer.render(this.backgroundScene, this.huiaScene.camera);

    if(this.fireScene)
      this.renderer.render(this.fireScene, this.huiaScene.camera);

    this.renderer.clearDepth();

    if(this.postProcessingEnabled)
      this.postprocessing.renderPostprocessing(this.tick);
    else
      this.renderer.render(this.huiaScene, this.huiaScene.camera);

    this.renderer.clearDepth();

    if(this.particlesScene && this.particlesEnabled)
      this.renderer.render( this.particlesScene, this.particlesScene.camera );

    if(!this.destroyed)
    this.requestId = window.requestAnimationFrame(this.render.bind(this));



    this.huiaScene.updateBird();
    //console.log("update renders");
  }

  onChangeSuggestedQuality(quality){
    if(this.blurred)
      return;

    this.setQuality(this.gpuMonitor.suggestedQuality, true);
  }
}
