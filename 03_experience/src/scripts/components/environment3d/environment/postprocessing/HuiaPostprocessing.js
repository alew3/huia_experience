import * as THREE from 'three';
import CopyShader from './CopyShader';
import EffectComposer from './EffectComposer';
import ShaderPass from './ShaderPass';
import RenderPass from './RenderPass';
import MaskPass from './MaskPass';
import ClearPass from './ClearPass';
import SoundsLoader from '../../../../loaders/SoundsLoader';
// import OutlinePass from "./OutlinePass";
// import GlitchPass from './glitch/GlitchPass';
// import DigitalGlitch from './glitch/DigitalGlitch';
import BadTVShader from './glitch/BadTVShader';
import RGBShiftShader from './glitch/RGBShiftShader';
import HorizontalBlurShader from './gaussianblur/HorizontalBlurShader';
import VerticalBlurShader from './gaussianblur/VerticalBlurShader';
// import StaticShader from './glitch/FilmShader';
import fxaa from 'three-shader-fxaa';


export default class HuiaPostprocessing {

  constructor(scene, renderer, camera, bird, ignoreFlick){
    CopyShader(THREE);
    EffectComposer(THREE);
    ShaderPass(THREE);
    RenderPass(THREE);
    ClearPass(THREE);
    MaskPass(THREE);
    // OutlinePass(THREE);
    HorizontalBlurShader(THREE);
    VerticalBlurShader(THREE);
    // DigitalGlitch(THREE);
    // GlitchPass(THREE);
    BadTVShader(THREE);
    RGBShiftShader(THREE);
    // FilmShader(THREE);
    // StaticShader(THREE);

    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
    this.bird = bird;

    this.createPostprocessing();
    this.ignoreFlick = ignoreFlick;
    this.renderPostprocessing = this.renderPostprocessing.bind(this);
    this.setSize = this.setSize.bind(this);
  }

  setSize(w,h){
    this.fxaaPass.uniforms.resolution.value.set(w,h);
    this.composer.setSize(w,h);
  }

  createPostprocessing() {
    this.composer = new THREE.EffectComposer( this.renderer );
    this.renderPass = new THREE.RenderPass( this.scene, this.camera ) ;

    if(!this.ignoreFlick){
      this.badTVPass = new THREE.ShaderPass( THREE.BadTVShader );
      this.rgbPass = new THREE.ShaderPass( THREE.RGBShiftShader );
    }
    this.clearMaskPass = new THREE.ClearPass();
    this.maskPass = new THREE.MaskPass(this.scene, this.camera);
    this.copyPass = new THREE.ShaderPass( THREE.CopyShader );
    this.horizontalPass = new THREE.ShaderPass( THREE.HorizontalBlurShader );
    this.verticalPass = new THREE.ShaderPass( THREE.VerticalBlurShader );
    this.fxaaPass = new THREE.ShaderPass(fxaa());
    this.fxaaPass.uniforms.resolution.value.set(window.innerWidth,window.innerHeight);
    // this.outlinePass = new THREE.OutlinePass(window.devicePixelRatio,this.scene, this.camera, this.bird);

    // this.composer.addPass( this.clearMaskPass );
    // this.composer.addPass( this.maskPass );
    this.renderPass.clearColor = 0xffffff;
    this.renderPass.clearAlpha = 0;


    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.horizontalPass);
    this.composer.addPass(this.verticalPass);

    // if(this.ignoreFlick){
      this.composer.addPass( this.badTVPass );
  		this.composer.addPass( this.rgbPass );
    // }
    // this.composer.addPass( this.outlinePass );
    this.composer.addPass( this.fxaaPass );
		this.composer.addPass( this.copyPass );
    window.postprocessing = this;
    this.copyPass.material.transparent = true;
    this.copyPass.material.blending = THREE.CustomBlending;
    this.copyPass.material.blendSrc = THREE.OneFactor;
    this.copyPass.renderToScreen = true;

    this.badTVPass.uniforms[ 'distortion' ].value = 0; //3.0
		this.badTVPass.uniforms[ 'distortion2' ].value = 0; //1.0
		this.badTVPass.uniforms[ 'speed' ].value = 0; // 0.3
		this.badTVPass.uniforms[ 'rollSpeed' ].value = 0;
		this.badTVPass.uniforms[ 'time' ].value = 0;

    this.horizontalPass.uniforms['h'].value = 0;
    this.verticalPass.uniforms['v'].value = 0;

    this.rgbPass.uniforms['amount'].value = 0; // 0.005
    this.rgbPass.uniforms['angle'].value = 0;

    TweenMax.to(this, Math.random()*7, {onComplete:this.randomizeRGB, onCompleteScope:this});
    TweenMax.to(this, Math.random()*7, {onComplete:this.randomizeBadTV, onCompleteScope:this, overwrite:false});
  }

  setBlur(b, animated){
    TweenMax.to(this.horizontalPass.uniforms['h'], (animated) ? 1 : 0, {value : b ? 1/512 : 0, ease : Linear.easeNone});
    TweenMax.to(this.verticalPass.uniforms['v'], (animated) ? 1 : 0, {value : b ? 1/512 : 0, ease : Linear.easeNone});
  }


  randomizeRGB() {
    this.rgbPass.uniforms['angle'].value = 0;
    this.rgbPass.uniforms['amount'].value = 0;
    var t = 0.05 + Math.random()*0.1;
    var val = 0.005+(Math.random()*0.003);

    if(val > 0.007){
      var num = (2+Math.round(Math.random()*3));
      if(num == 4) num = 5;

      if(!window.environment3d.blurred)
        SoundsLoader.playSound("glitch"+num, false, 0.15, 0);
    }

    TweenMax.to(this.rgbPass.uniforms['amount'], t, {value : val, ease : Linear.easeNone, yoyo : true, repeat : 1});
    TweenMax.to(this.rgbPass.uniforms['angle'], t, {value : Math.random()*((90*Math.PI)/180), ease : Linear.easeNone, yoyo : true, repeat : 1});


    TweenMax.to(this, Math.random()*7, {onComplete:this.randomizeRGB, onCompleteScope:this, overwrite:false});
  }

  randomizeBadTV () {
    this.badTVPass.uniforms[ 'distortion'].value = 0; //3.0
		this.badTVPass.uniforms[ 'distortion2' ].value = 0; //1.0
		this.badTVPass.uniforms[ 'speed' ].value = 0; // 0.3
		this.badTVPass.uniforms[ 'rollSpeed' ].value = 0;
		this.badTVPass.uniforms[ 'time' ].value = 0;
    var val = Math.random()*1.5;
    var val2 = Math.random()*0.5;

    if(val > 0.2)
    {
      var num = (2+Math.round(Math.random()*3));
      if(num == 4) num = 5;

      if(!window.environment3d.blurred)
        SoundsLoader.playSound("glitch"+num, false, 0.15, 0);
    }



    var t = 0.5 + Math.random()*0.4;
    TweenMax.to(this.badTVPass.uniforms['distortion'], t, {value : val, ease : Linear.easeNone, yoyo : true, repeat : 1});
    TweenMax.to(this.badTVPass.uniforms['distortion2'], t, {value : val2, ease : Linear.easeNone, yoyo : true, repeat : 1});
    TweenMax.to(this.badTVPass.uniforms['speed'], t, {value : Math.random()*0.3, ease : Linear.easeNone, yoyo : true, repeat : 1});
    // TweenMax.to(this.badTVPass.uniforms['rollSpeed'], t*0.5, {value : Math.random()*0.001, ease : Linear.easeNone, yoyo : true, repeat : 1});
    TweenMax.to(this, Math.random()*7, {onComplete:this.randomizeBadTV, onCompleteScope:this, overwrite:false});
  }



  renderPostprocessing(tick){
    this.badTVPass.uniforms['time'].value = tick;
    this.composer.render();
  }
}
