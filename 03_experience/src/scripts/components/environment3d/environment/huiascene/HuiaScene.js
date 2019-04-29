import * as THREE from 'three';
import HuiaBird from './HuiaBird';
import Lines from './Lines';
import HUDElements from './HUDElements';
import Feathers from './Feathers';
// import Smoke from './Smoke';
import Globals from '../../../../core/Globals';
import SoundsLoader from '../../../../loaders/SoundsLoader';
import GPUParticleSystem from '../particlesscene/particlesystem/GPUParticleSystem.js';




export default class HuiaScene extends THREE.Scene {

  get camera () {
    return this._camera;
  }
  set camera (camera){
    this._camera = camera;
  }

  constructor (){
    super();
    GPUParticleSystem(THREE);

    //0x0f0f24
    // this.background = new THREE.Color(0xff000000, 0);
    this._camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this._camera.layers.enable(5);
    this._camera.layers.enable(8);
    this._camera.layers.enable(10);
    this.cameraContainer = new THREE.Object3D();
    this.add(this.cameraContainer);
    this.cameraContainer.add(this._camera);
    window.camera = this._camera;


    this.lightRight = new THREE.SpotLight();
    this.cameraContainer.add(this.lightRight);
    this.lightRight.position.x = 5;
    this.lightRight.position.z = 5 - 16;
    this.lightRight.position.y = 5;
    this.lightRight.intensity = 5;
    this.lightRight.distance = 9;
    this.lightRight.penumbra = 1;
    this.lightRight.color = new THREE.Color(0x20befc);
    this.lightRight.lookAt(new THREE.Vector3(0,0,0));
    window.lightRight = this.lightRight;


    this.lightFront = new THREE.SpotLight();
    this.lightFront.color = new THREE.Color(0xfdc987);
    this.lightFront.position.x = 0;
    this.lightFront.position.y = 5;
    this.lightFront.position.z = 9 - 16;
    this.lightFront.distance = 10;
    this.lightFront.intensity = 4;
    this.lightFront.decay = 1.0;
    this.lightFront.lookAt(new THREE.Vector3(0,0,0))
    this.cameraContainer.add(this.lightFront);
    window.lightFront = this.lightFront;


    this.lightLeft = new THREE.SpotLight();
    this.cameraContainer.add(this.lightLeft);
    this.lightLeft.position.x = -13;
    this.lightLeft.position.y = -1;
    this.lightLeft.position.z = -4 - 16;
    this.lightLeft.intensity = 2.5;
    this.lightLeft.color = new THREE.Color(0xed6d76);
    this.lightLeft.lookAt(new THREE.Vector3(0,0,0));
    window.lightLeft = this.lightLeft;

    this.lightTop = new THREE.SpotLight(0xffffff);
    this.lightTop.position.y = 10;
    this.lightTop.position.z = -16;
    this.lightTop.castShadow = true;
    this.lightTop.lookAt(new THREE.Vector3(0,0,0));
    this.cameraContainer.add(this.lightTop);
    window.lightTop = this.lightTop;

    this.floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(20,10,1), new THREE.MeshBasicMaterial({color : 0x000000, map : ContentLoader.DATA_HUIA_3D_TEXTURES["floor"]}));
    this.floor.rotation.x = -90 * Math.PI/180;
    this.floor.position.y = -1;
    this.floor.position.x = -5;
    this.floor.material.transparent = true;
    this.floor.material.opacity = 0.1;
    this.add(this.floor);
    window.floor = this.floor;

    this.ambientLight = new THREE.AmbientLight({color : new THREE.Color(0xffffff)});
    this.add(this.ambientLight);
    this.ambientLight.intensity = 0;
    window.ambientLight = this.ambientLight;

    if(!window.MOBILE_DETECT.mobile()){
      this.lines = new Lines();
      this.lines.position.z = -20;
      this.cameraContainer.add(this.lines);


    }

    //


    this.shadow = new THREE.Mesh(new THREE.PlaneBufferGeometry(100,100,32),new THREE.ShadowMaterial());
    this.shadow.position.y = 0;
    this.shadow.material.opacity = 0.5;
    this.shadow.rotation.x = -90 * Math.PI/180;
    this.add(this.shadow);
    this.shadow.receiveShadow = true;


    this.createBird();

    this.cameraContainer.position.y = 5;
    this.cameraContainer.position.z = 16;
    this.cameraContainer.position.x = -2.5;

    this.setSize = this.setSize.bind(this);
    this.entranceAnimation = this.entranceAnimation.bind(this);

    this.updateDelta = this.updateDelta.bind(this);
    window.cameraContainer = this.cameraContainer;



    lightTop.penumbra = lightLeft.penumbra = lightRight.penumbra = lightFront.penumbra = 1;

    // this.rectLight = new THREE.RectAreaLight(0xffffff, 100,1,1);
    // this.add(this.rectLight);
    // window.rectLight = this.rectLight;
    //
    // this.rectHelper = new THREE.RectAreaLightHelper(this.rectLight);
    // this.cameraContainer.add(this.rectHelper);
    // window.rectHelper = this.rectHelper;


    var textureLoader = new THREE.TextureLoader();
    this.particlesOptions = {
      positionRandomness: 50,
      color: 0x0a0a14,
      colorRandomness: 0,
      velocityRandomness : 0.1,
      velocity : new THREE.Vector3(0.01,0.1,0),
      position : new THREE.Vector3(-2,0,0),
      smoothPosition:true,
      turbulence: 0.1,
      lifetime: 0,
      blending : THREE.NoBlending,
      size: 4*(2/window.devicePixelRatio),
      tex : "particle1.png",
      sizeRandomness: 1
    };

    this.particlesOptions2 = {
      positionRandomness: 100,
      color: 0xffffff,
      colorRandomness: 0,
      velocityRandomness : 0,
      velocity : new THREE.Vector3(0,-0.1,0),
      position : new THREE.Vector3(0,2,0),
      turbulence: 0.01,
      lifetime: 0,
      blending : THREE.AdditiveBlending,
      size: 30*(2/window.devicePixelRatio),
      sizeRandomness: 2
    };

    // this.particleSystem = new THREE.GPUParticleSystem({
    //   maxParticles: 25000,
    //   tex : "particle2.png"
    // });
    this.particleSystem2 = new THREE.GPUParticleSystem({
      maxParticles: 2500,
      tex : "particle3.png",
      blending : THREE.AdditiveBlending
    });
    // this.add(this.particleSystem);
    this.add(this.particleSystem2);
    this.emmitLoopParticles();
    window.particleSystem = this.particleSystem;


    this.hudElements = new HUDElements();
    this.hudElements.layers.set(10);
    this.add(this.hudElements);
    //
    // this.feathers = new Feathers();
    // this.add(this.feathers);


    if(Globals.SHOW_INTRO && !Globals.DEBUG)
      this.flyFromBackground(Globals.ENTRANCE_DURATION, Globals.ENTRANCE_DELAY/2);
    else
      this.bird.playAnimation(0,false);



    //this.cameraContainer.add(bird.pointLight);
    this.cameraContainer.add(bird.pointLightDirectional);
  }

  emmitLoopParticles() {
    // for(var i = 0; i < 1500; i++)
    //   this.particleSystem.spawnParticle(this.particlesOptions);
    for(var i = 0; i < 30; i++){
      this.particleSystem2.spawnParticle(this.particlesOptions2);
    }
    TweenMax.to(this, 1, {onComplete:this.emmitLoopParticles, onCompleteScope : this});
  }



  setLightsForce(b, animated){
    if(b){
      var force = 5;
      TweenMax.to(this.lightTop, (animated) ? 1 : 0, {intensity : 1/force});
      TweenMax.to(this.lightLeft, (animated) ? 1 : 0, {intensity : 2.5/force});
      TweenMax.to(this.lightRight, (animated) ? 1 : 0, {intensity : 5/force});
      TweenMax.to(this.lightFront, (animated) ? 1 : 0, {intensity : 4/force});
      TweenMax.to(this.cameraContainer.position, (animated) ? 2 : 0, {z : 21, ease : Quad.easeInOut, onComplete:this.updateLookAt.bind(this)});
    }else{
      TweenMax.to(this.lightTop, (animated) ? 1 : 0, {intensity : 1});
      TweenMax.to(this.lightLeft, (animated) ? 1 : 0, {intensity : 2.5});
      TweenMax.to(this.lightRight, (animated) ? 1 : 0, {intensity : 5});
      TweenMax.to(this.lightFront, (animated) ? 1 : 0, {intensity : 4});
      TweenMax.to(this.cameraContainer.position, (animated) ? 2 : 0, {z : 16, ease : Quad.easeInOut, onComplete:this.updateLookAt.bind(this)});
    }
  }



  dramatic() {
    console.log("dramatic anim ....");
    TweenMax.set(this.shadow.material, {opacity : 0.5});
    TweenMax.to(this.shadow.material, 0.5, {opacity:0, yoyo : true, repeat : 1, delay:0.3, ease : Circ.easeOut});
    this.bird.playAnimation(14,false);
  }

  hadouken() {
    console.log("hadouken anim .... ESCIROT ERRADO");
    //TweenMax.set(this.shadow.material, {opacity : 0.5});
    //TweenMax.to(this.shadow.material, 0.5, {opacity:0, yoyo : true, repeat : 1, delay:0.3, ease : Circ.easeOut});
    this.bird.playAnimation(15,false);
  }

  backpack() {
    console.log("backpack anim ....");
    //TweenMax.set(this.shadow.material, {opacity : 0.5});
    //TweenMax.to(this.shadow.material, 0.5, {opacity:0, yoyo : true, repeat : 1, delay:0.3, ease : Circ.easeOut});
    this.bird.playAnimation(16,false);
  }

  moonwalk() {
    console.log("moonwalk anim ....");
    //TweenMax.set(this.shadow.material, {opacity : 0.5});
    //TweenMax.to(this.shadow.material, 0.5, {opacity:0, yoyo : true, repeat : 1, delay:0.3, ease : Circ.easeOut});
    this.bird.playAnimation(17,false);
  }

  // piscada() {
  //   console.log("blink anim ....");
  //   //TweenMax.set(this.shadow.material, {opacity : 0.5});
  //   //TweenMax.to(this.shadow.material, 0.5, {opacity:0, yoyo : true, repeat : 1, delay:0.3, ease : Circ.easeOut});
  //   this.bird.playAnimation(18,false);
  // }

  shortJump() {
    console.log("jump....");
    TweenMax.set(this.shadow.material, {opacity : 0.5});
    TweenMax.to(this.shadow.material, 0.5, {opacity:0, yoyo : true, repeat : 1, delay:0.3, ease : Circ.easeOut});
    this.bird.playAnimation(7,false);
  }

  longJump(){
    TweenMax.set(this.shadow.material, {opacity : 0.5});
    TweenMax.to(this.shadow.material, 0.5, {opacity:0, yoyo : true, delay:0.3, repeat : 1, repeatDelay:0.6, ease : Circ.easeOut});
    // TweenMax.to(this.camera.position, 0.5, {y : 8, yoyo : true, repeat : 1, delay:0.3, onUpdate:this.updateLookAt.bind(this),repeatDelay:0.6, ease : Quad.easeOut});
    this.bird.playAnimation(8,false);
  }

  underArm() {
    this.environment.huiaScene.bird.playAnimation(11,false);
  }

  jumping360 () {
    this.bird.jumping360();
  }


  fly(direct){
    this.bird.fly(direct);
    var time = direct ? 0 : 1;
    // TweenMax.to(this.ambientLight, time*1.5, {intensity : 0.7, delay : time});
    TweenMax.to(this.bird.rotation, time, {x : -0.3, ease : Quad.easeInOut});
    TweenMax.to(this.lightFront.position, time*1.5, {y : 6.5, ease : Quad.easeOut});
    this.flyDirect = direct;

    if(direct){
      this.cameraContainer.position.x = -8;
      this.cameraContainer.position.y = 10;
      this.updateLookAt();
      TweenMax.to(this.cameraContainer.position, 5, {x : -2, onUpdate:this.updateLookAt.bind(this),y : 13.5, z : 15});
    }
    else{
      SoundsLoader.playSound("fly", false, 0.5, 0);
      TweenMax.to(this.cameraContainer.position, time*2, {y : 13.5, x : -2, z : (direct) ? 15 : 20, onUpdate:this.updateLookAt.bind(this), delay : time*0.6, ease : Quint.easeOut});
      TweenMax.to(this._camera.position, time*2, {z : -5, delay : time*0.6, ease : Quint.easeOut});
      TweenMax.to(this.lightRight.position, time*2,{y : 13.5});
      TweenMax.to(this.lightFront.position, time*2,{y : 13.5});
      TweenMax.to(this.lightLeft.position, time*2,{y : 12.5});
      TweenMax.to(this.lightTop.position, time*2,{y : 18.5});
      TweenMax.to(this.lightTop, time*2,{intensity : 1.5});
    }

    TweenMax.to(this.shadow.material, time, {opacity:0, ease : Quint.easeIn});
    TweenMax.to(this.floor.material, time, {opacity:0, ease : Quint.easeIn});
  }

  flyToExperience () {
    this.bird.mouseBlocked = true;
    this.mouseBlocked = true;
    var time = 1;
    this.bird.fly();
    TweenMax.to(this.cameraContainer.position, time*2, {y : 13.5, x : -2, z : 30, onUpdate:this.updateLookAt.bind(this), delay : time*0.6, ease : Quint.easeOut});
    TweenMax.to(this._camera.position, time*2, {z : 0, y : 0, x : 0, delay : time*0.6, ease : Quint.easeOut});
    TweenMax.to(this.lightRight.position, time*2,{y : 13.5});
    TweenMax.to(this.lightFront.position, time*2,{y : 13.5});
    TweenMax.to(this.lightLeft.position, time*2,{y : 12.5});
    TweenMax.to(this.lightTop.position, time*2,{y : 18.5});
    TweenMax.to(this.lightTop, time*2,{intensity : 0});
    TweenMax.to(this.shadow.material, time, {opacity:0, ease : Quint.easeIn});
    TweenMax.to(this.floor.material, time, {opacity:0, ease : Quint.easeIn});
    TweenMax.to(this.bird.position, time * 2, {x : -20, z : 17, ease : Quint.easeIn});
  }

  setPreloadingScene () {
    this.particleSystem2.dispose();
    // this.particleSystem.dispose();
    this.remove(this.particleSystem);
    this.remove(this.particleSystem2);

    this.hudElements.dispose();
    this.remove(this.hudElements);

    this.lines.dispose();
    this.remove(this.lines);

    this.hudElements = null;
    this.lines = null;

    TweenMax.killTweensOf(this.floor.material);
    TweenMax.killTweensOf(this.bird.position);
    TweenMax.killTweensOf(this.bird.rotation);
    TweenMax.killTweensOf(this.cameraContainer.rotation);
    TweenMax.killTweensOf(this.cameraContainer.position);
    TweenMax.set(this.floor.material, {opacity:0});
    TweenMax.set(this.shadow.material, {opacity:0});
    TweenMax.set(this.bird.position, {x : 0, y : 0, z : -40});
    TweenMax.set(this.bird.rotation, {x : 0, y : -Math.PI, z : 0});
    TweenMax.set(this.cameraContainer.position, { x : 0, y : 54, z : 0});
    TweenMax.set(this.cameraContainer.rotation, { x : -0.6, y : 0, z : 0});
    TweenMax.killTweensOf(this.lightLeft.position);
    TweenMax.killTweensOf(this.lightRight.position);
    TweenMax.killTweensOf(this.lightFront.position);
    TweenMax.set(this.lightLeft.position, {x : -30, y : -10, z : -40});
    TweenMax.set(this.lightRight.position, {x : 30, y : -20, z : -40});
    TweenMax.set(this.lightFront.position, {x : 0, y : -30, z : -40});

    TweenMax.fromTo(this.cameraContainer.position, 5, {z : -25, y : 40}, {z : 0, y : 50, ease : Linear.easeNone});

    this.startPreloadingLoop();
    // TweenMax.from(this.bird.position, 1, {z : -10, ease : Linear.easeNone, onComplete:this.startPreloadingLoop, onCompleteScope:this});
    this.isInPreloader = true;
    this.bird.rotation.x = -0.4;
    this.bird.playAnimation(5,true);
  }

  startPreloadingLoop () {
    var time = 3;
    TweenMax.to(this.bird.position, time, {x : -10, ease : Quad.easeOut});
    TweenMax.to(this.bird.rotation, time, {z : 0.3, y : -(Math.PI+0.1), ease : Quad.easeOut});

    TweenMax.to(this.bird.position, time*4, {z : -50, yoyo : true, repeat : -1, ease : Quad.easeInOut});

    TweenMax.to(this.bird.position, time*2, {x : 10, ease : Quad.easeInOut, delay : time, yoyo : true, repeat : -1});
    TweenMax.to(this.bird.rotation, time*2, {z : -0.3, y : -(Math.PI-0.1), ease : Quad.easeInOut, delay : time, yoyo : true, repeat : -1});
  }

  flyFromBackground (duration, delay) {
    duration = duration || 2;
    this.shadow.material.opacity = 0;
    this.bird.flyFromBackground(duration,delay);
    TweenMax.to(this.shadow.material, 0.5, {opacity:0.5, delay:duration+delay});
  }


  land() {
    this.bird.land();
    SoundsLoader.playSound("land", false, 0.5, 0);
    TweenMax.killTweensOf(this.ambientLight);
    TweenMax.killTweensOf(this.cameraContainer.position);

    TweenMax.to(this.ambientLight, 0.3, {intensity : 0});
    TweenMax.to(this.lightFront.position, 1.5, {y : 5, ease : Quad.easeOut});
    TweenMax.to(this.cameraContainer.position, 3, {y : 5, x : -2.5, z : 16, onUpdate:this.updateLookAt.bind(this), ease : Quint.easeOut});
    TweenMax.to(this._camera.position, 3, {z : 0, ease : Quint.easeOut});
    TweenMax.to(this.shadow.material, 1.5, {opacity:0.5, ease : Quad.easeOut});
    TweenMax.to(this.floor.material, 1.5, {opacity:0.1, ease : Quad.easeOut});

    TweenMax.to(this.lightRight.position, 1,{y : 5});
    TweenMax.to(this.lightFront.position, 1,{y : 5});
    TweenMax.to(this.lightLeft.position, 1,{y : -1});
    TweenMax.to(this.lightTop.position, 1,{y : 10});
    TweenMax.to(this.lightTop, 1,{intensity : 1});

    TweenMax.killTweensOf(this.bird);
    TweenMax.to(this.bird.position, 1.5, {z : 0, x : 0, y : 0, ease : Quint.easeOut});
    TweenMax.to(this.bird.rotation, 1.5, {z : 0, x : 0, ease : Quint.easeOut});
  }

  initBirdLoop () {
    TweenMax.to(this.bird.position, 6, {z : -10, x : -7, y : 3, ease : Linear.easeNone, yoyo : true, repeat : -1});
    TweenMax.to(this.bird.rotation, 6, {z : -0.4, ease : Linear.easeNone, yoyo : true, repeat : -1});
  }

  entranceAnimation(){
    TweenMax.to(this.cameraContainer.position, 3, {y : 5, x : 0, ease : Quad.easeInOut});
  }

  updateDelta(delta, tick){
    this.bird.updateMixers(delta);

    if(this.particleSystem){
      this.particleSystem.update(tick);
      this.particleSystem2.update(tick);
    }
  }

  setSize(w,h){
    this._camera.aspect = w/h;
    this._camera.updateProjectionMatrix();
  }

  setMouseCoef(coefx,coefy){
    if(this.mouseBlocked) return;

    this.bird.setMouseCoef(coefx,coefy);
    this._camera.lookAt(this.bird);
    // if(!this.bird.mouseBlocked)
    TweenMax.to(this._camera.position, 5, {x : coefx, y : -coefy/2, onUpdate:this.updateLookAt.bind(this),ease : Quad.easeOut});

    //DESEMPENHO tentar tirar
    TweenMax.to(bird.pointLight.position, .1, {x : coefx, y : -coefy/2, ease : Quad.easeOut});
    TweenMax.to(bird.pointLightDirectional.position, .1, {x : coefx, y : -coefy/2, ease : Quad.easeOut});
  }

  updateLookAt () {
    this._camera.lookAt(this.bird);
  }



  createBird () {
    this.bird = new HuiaBird();
    this.bird.castShadow = true;
    window.bird = this.bird;
    this.add(this.bird);
  }

  updateBird(){
    this.bird.updateShaders();
  }
}
