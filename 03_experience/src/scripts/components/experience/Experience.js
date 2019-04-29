import * as THREE from 'three';
import ExperienceBird from './bird/ExperienceBird';
import Island from './island/Island';
import HuiaPostprocessing from "./postprocessing/HuiaPostprocessing";
import Multiplayer from './multiplayer/Multiplayer';
import Globals from "../../core/Globals";
import THREEEnvironmentHelper from "../../helpers/THREEEnvironmentHelper";
import ImageHelper from "../../helpers/ImageHelper";

export default class Experience {

  constructor(canvas, namesContainer){
    window.experience = this;
    this.canvas = canvas;
    this.namesContainer = namesContainer;
    this.namesContainer.style.opacity = 0;
    this.SCALE = 5;

    this.DEBUG = false;
    this.INI_CAMERA_Y = 28 * this.SCALE;
    this.INI_CAMERA_Z = (window.MOBILE_DETECT.mobile() ? 40 * this.SCALE : 60* this.SCALE);
    // this.FOG_COLOR = 0xc6cbff;
    // this.FOG_COLOR = 0xf7905e;
    this.FOG_COLOR = 0x7392cb;
    this.SPEED = {forward : 75};
    this.INI_ROT_Y = (180 * Math.PI/180);
    this.SCREEN_WIDTH = window.innerWidth;
    this.SCREEN_HEIGHT = window.innerHeight;
    this.INI_ALTITUDE;
    this.verticalBlocked = false;
    this.finRotationY = this.INI_ROT_Y;
    this.mouseX = 0;
    this.MIN_ALTITUDE = 1800;
    this.MAX_ALTITUDE = 40000;

    this.refMouseMove = this.onDocumentMouseMove.bind(this);
    this.refWindowResize = this.onWindowResize.bind(this);

    this.tick = 0;
    this.createTHREEInstance();
    this.createAmbientLight();
    this.createIsland();
    this.createBird();
    this.createListeners();

    if(!window.MOBILE_DETECT.mobile()){
      this.createPostprocessing();
    }
    this.createBirdName();
    this.createMultiplayer();
    this.animate();

    if(window.qualityControlUi){
      window.qualityControlUi.changeColor("#ffffff");
    }
    // window.ignoreMovement = true;
    // this.cameraAndObjectContainer.position.z = -100000;
    // this.cameraAndObjectContainer.position.x = -80000;
    // this.cameraAndObjectContainer.position.y = this.INI_ALTITUDE * 8;
    // bird.startGlide();
    // TweenMax.to(this.cameraAndObjectContainer.position, 7, {bezier:[{x : -30000, z : -90000, y : this.INI_ALTITUDE*4},{x : -40000, z : -30000, y : this.INI_ALTITUDE*2}, {x : -30000, z : 0, y : this.INI_ALTITUDE}], ease : Quad.easeInOut});
  }

  firstAnimation () {
    // TweenMax.to(this.postprocessing.horizontalPass.uniforms['h'], 1, {value : 0.1/512});
    // TweenMax.to(this.postprocessing.verticalPass.uniforms['v'], 1, {value : 0.1/512});
  }

  destroy () {
    document.removeEventListener( 'mousemove', this.refMouseMove );
    window.removeEventListener('devicemotion', this.refMouseMove);
    window.removeEventListener( 'resize', this.refWindowResize);
    this.render = null;

    this.island = null;
    this.bird = null;

    this.multiplayer.destroy();
    this.multiplayer = null;

    this.destroyed = true;
    this.disposeHierarchy (this.scene, this.disposeNode);
  }

  disposeNode (node)
  {
      if (node instanceof THREE.Mesh)
      {
          if (node.geometry)
          {
              node.geometry.dispose ();
          }

          if (node.material)
          {
                  if (node.material.map)          node.material.map.dispose ();
                  if (node.material.lightMap)     node.material.lightMap.dispose ();
                  if (node.material.bumpMap)      node.material.bumpMap.dispose ();
                  if (node.material.normalMap)    node.material.normalMap.dispose ();
                  if (node.material.specularMap)  node.material.specularMap.dispose ();
                  if (node.material.envMap)       node.material.envMap.dispose ();

                  node.material.dispose ();   // disposes any programs associated with the material
          }
      }
  }   // disposeNode

  disposeHierarchy (node, callback)
  {
      for (var i = node.children.length - 1; i >= 0; i--)
      {
          var child = node.children[i];
          this.disposeHierarchy (child, callback);
          callback (child);
      }
  }


  createMultiplayer () {
    this.multiplayer = new Multiplayer(this.scene, this.bird, this.namesContainer);
  }


  createBirdName () {
    var container = document.createElement('div');
    container.classList.add('experience-user-name');
    var elName = document.createElement('h2');
    elName.innerText = Globals.USER_DATA.userName;
    container.appendChild(elName);

    if(Globals.USER_DATA.userCountry){
      var flag = document.createElement("img");
      flag.src = "/static/images/flags-iso-3166/"+Globals.USER_DATA.userCountry.toLowerCase()+".svg";
      container.append(flag);
    }

    if(Globals.USER_DATA.userCity){
      var elCity = document.createElement("h3");
      elCity.innerText = Globals.USER_DATA.userCity;
      container.appendChild(elCity);
    }

    this.userName = container;
    this.namesContainer.appendChild(container);

    var pos = THREEEnvironmentHelper.toScreenPosition(this.bird, this.camera, this.renderer);
    pos.x *= this.divider;
    pos.y *= this.divider;
    pos.x /= window.devicePixelRatio;
    pos.y /= window.devicePixelRatio;
    TweenMax.set(this.userName, {x : pos.x, y : pos.y});
  }

  createListeners(){
    if(!window.MOBILE_DETECT.mobile()){
      document.addEventListener( 'mousemove', this.refMouseMove, false );
    }else{
      window.addEventListener('devicemotion', this.refMouseMove, false);
    }
    // document.addEventListener( 'mousedown', onMouseDown, false );
    // document.addEventListener( 'mouseup', onMouseUp, false );
    window.addEventListener( 'resize', this.refWindowResize, false );
    this.onWindowResize();
  }




  createTHREEInstance () {
    this.renderer = new THREE.WebGLRenderer({canvas : this.canvas, antialias : true, alpha : false, logarithmicDepthBuffer : false});
  	this.renderer.setPixelRatio( window.devicePixelRatio );
  	this.renderer.setClearColor(this.FOG_COLOR);
  	this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.renderer.gammaInput = true;
		this.renderer.gammaOutput = true;

    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    // this.scene.fog = new THREE.Fog( this.FOG_COLOR, 50000,90000 );
    // this.scene.fog = new THREE.Fog( 0xFDB813, 400000,500000 );
    this.INI_ALTITUDE = (800* this.SCALE);
    // container
    this.cameraAndObjectContainer = new THREE.Object3D();
    this.scene.add(this.cameraAndObjectContainer);
    window.cameraAndObjectContainer = this.cameraAndObjectContainer;
    // camera
    this.camera = new THREE.PerspectiveCamera( 40, this.SCREEN_WIDTH / this.SCREEN_HEIGHT, 100, 500000 * this.SCALE );
  	this.cameraAndObjectContainer.add(this.camera);
  	this.cameraAndObjectContainer.position.y = this.INI_ALTITUDE;
  	this.camera.position.z = this.INI_CAMERA_Z;
  	this.camera.position.y = this.INI_CAMERA_Y;
    this.cameraAndObjectContainer.rotation.y = this.INI_ROT_Y;

    this.cameraAndObjectContainer.position.z = 0;
    this.cameraAndObjectContainer.position.x = -50000;

    this.frustum = new THREE.Frustum();
    // window.ignoreMovement = true;
    // this.plane = new THREE.Mesh(new THREE.PlaneGeometry(300000,300000,1));
    // this.plane.rotation.x = -90 * Math.PI/180;
    // this.scene.add(this.plane);
  }

  createAmbientLight () {
    this.ambientLight = new THREE.AmbientLight( 0xf1f1f1, 1 );
    this.ambientLight.position.set( 0, 10000, 0 );
    this.scene.add( this.ambientLight );
  }

  createPostprocessing () {
    this.postprocessing = new HuiaPostprocessing(this.scene, this.renderer, this.camera, true);
  }

  createBird(){
    this.bird = new ExperienceBird();
    this.bird.scale.x = this.bird.scale.y = this.bird.scale.z = (0.8 * this.SCALE);
    this.bird.castShadow = true;
    this.cameraAndObjectContainer.add( this.bird );
		this.camera.lookAt(this.bird);
    this.cameraLookAt();

    window.bird = this.bird;
  }

  createSun() {
    this.sun = new Sun();
    this.scene.add(this.sun);
  }

  createIsland () {
    this.island = new Island(this.SCALE);
    this.scene.add(this.island);
    window.island = this.island;
    this.island.receiveShadow = true;
    this.island.castShadow = true;

    this.island.createWater(this.renderer, this.camera, this.scene);
    this.island.createLensFlare();
  }

  render() {
  	var delta = this.clock.getDelta();
    this.bird.updateMixer(delta);

    if(this.multiplayer){
      if(this.multiplayer.container){
        this.multiplayer.container.updateMixers(delta);
      }
    }
    this.tick += delta;
    if(this.island)
      this.island.update(delta);
    // if(multiplayer){
    //   multiplayer.updateMixers(delta);
    // }
  	this.renderer.clear();
    if(this.postprocessing){
      this.postprocessing.renderPostprocessing(this.tick);
    }else{
  	   this.renderer.render( this.scene, this.camera );
     }
  }

  cameraLookAt(){
    if(!this.bird) return;

  	var pos = this.bird.position.clone();
  	pos.y += 400/ this.SCALE;
  	this.camera.lookAt(pos);
  }

  animate() {
    if(!this.bird)
      return;

  	this.id = window.requestAnimationFrame( this.animate.bind(this) );
    this.render();
    this.positeBird();
  }

  rotateBird(){
    if(!this.bird) return;
  	this.bird.rotation.z = -(this.bird.rotation.y-this.bird.INI_ROT_Y)*1.5;
  }

  positeBird(){
    if(!this.bird){
      return;
    }
    this.finRotationY = this.finRotationY - ((this.mouseX/300)*Math.PI)/180;
    this.cameraAndObjectContainer.rotation.y += ((this.finRotationY-this.cameraAndObjectContainer.rotation.y)*0.05);



    if(!window.ignoreMovement){
      this.cameraAndObjectContainer.position.x -= (this.SPEED.forward * Math.sin(this.cameraAndObjectContainer.rotation.y));
      this.cameraAndObjectContainer.position.z -= (this.SPEED.forward * Math.cos(this.cameraAndObjectContainer.rotation.y));
      this.cameraAndObjectContainer.position.y += (this.SPEED.forward * Math.sin(this.bird.rotation.x));

      // if(Math.abs(this.cameraAndObjectContainer.position.x+70000) < 10000 &&
      //     Math.abs(this.cameraAndObjectContainer.position.z-200000) < 10000){
      //       this.SPEED.forward = 15;
      //     }else{
      this.SPEED.forward = 75;
          // }

      if(this.cameraAndObjectContainer.position.y < this.MIN_ALTITUDE){
        this.cameraAndObjectContainer.position.y = this.MIN_ALTITUDE;
        TweenMax.to(this.bird.rotation, 4, {x : 0, onUpdate:this.rotateBird, ease : Back.easeOut, onUpdateScope:this});
        this.bird.stopGlide();
      }if(this.cameraAndObjectContainer.position.y > this.MAX_ALTITUDE){
        this.cameraAndObjectContainer.position.y = this.MAX_ALTITUDE;
        TweenMax.to(this.bird.rotation, 4, {x : 0, onUpdate:this.rotateBird, ease : Back.easeOut, onUpdateScope:this});
      }
    }

    if(this.cameraAndObjectContainer.position.x < -350000){
      this.cameraAndObjectContainer.position.x += 5000;
    }else if(this.cameraAndObjectContainer.position.x > 350000){
      this.cameraAndObjectContainer.position.x -= 5000;
    }else if(this.cameraAndObjectContainer.position.z > 350000){
      this.cameraAndObjectContainer.position.z -= 5000;
    }else if(this.cameraAndObjectContainer.position.z < -350000){
      this.cameraAndObjectContainer.position.z += 5000;
    }

    // first, try intersects to below
    var raycast = this.island.getRaycastPosition(this.cameraAndObjectContainer.position, new THREE.Vector3(this.cameraAndObjectContainer.position.x, this.cameraAndObjectContainer.position.y+30000, this.cameraAndObjectContainer.position.z));
    if (raycast > 0) {
        this.cameraAndObjectContainer.position.y = raycast * 40;
    }

    this.frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( this.camera.projectionMatrix, this.camera.matrixWorldInverse ) )

    var pos = THREEEnvironmentHelper.toScreenPosition(this.bird, this.camera, this.renderer);
    pos.x *= this.divider;
    pos.y *= this.divider;
    pos.x /= window.devicePixelRatio;
    pos.y /= window.devicePixelRatio;

    TweenMax.to(this.userName, 1,{x : pos.x+150, y : pos.y-80, ease : Quint.easeOut});
    var rot = this.bird.rotation.x;
    TweenMax.to(this.camera.position, 10/this.SPEED.forward, {y : this.INI_CAMERA_Y - (rot * 30 * this.SCALE), ease : Quint.easeOut, onUpdate:this.cameraLookAt, onUpdateScope:this });

    this.multiplayer.sendUserPosition({x : this.cameraAndObjectContainer.position.x, y : this.cameraAndObjectContainer.position.y, z : this.cameraAndObjectContainer.position.z},
                                      {x : this.bird.rotation.x, y : this.cameraAndObjectContainer.rotation.y + this.bird.rotation.y, z : this.cameraAndObjectContainer.rotation.z + this.bird.rotation.z});
  }

  onWindowResize() {
    var divider = 1;
    this.divider = divider;
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(window.devicePixelRatio/divider);
    // this.renderer.sortObjects = false;
    this.renderer.setSize( window.innerWidth/divider, window.innerHeight/divider );

    if(this.postprocessing)
      this.postprocessing.setSize( window.innerWidth/divider, window.innerHeight/divider );
  }

  onDocumentMouseMove( event ) {
    if(window.ignoreMovement) return;
    if(window.MOBILE_DETECT.mobile()){
      this.mouseX = (event.accelerationIncludingGravity.y / 9);

      TweenMax.to(this.camera.rotation, 0.5, { _z : -((this.mouseX*30)*Math.PI)/180, ease : Quint.easeOut });
      this.mouseX *= this.windowHalfX;
    }else{
      this.mouseX = ( event.clientX - this.windowHalfX ) / 2;
    }

    this.mouseY = (( event.clientY - (window.innerHeight * 0.7) ) / (window.innerHeight*0.3));
    if(this.mouseY < 0){
      this.mouseY /= 2.33;
    }

    var numx = ((this.mouseY*40)*Math.PI)/180;
    var numy = (-(this.mouseX/10)*Math.PI)/180;

    if(this.mouseY > 0.6){
      this.bird.startGlide();
    }else{
      this.bird.stopGlide();
    }

    if(this.bird){

      // if(this.verticalBlocked){
      //   TweenMax.to(this.bird.rotation, 4, {y : this.INI_ROT_Y+(numy), /*x : -numx,*/ onUpdate:this.rotateBird, ease : Back.easeOut, onUpdateScope:this});
      // }else{
        if(this.cameraAndObjectContainer.position.y <= this.MIN_ALTITUDE && numx > 0){
          numx = 0;
        }
        else if(this.cameraAndObjectContainer.position.y >= this.MAX_ALTITUDE && numx < 0){
          numx = 0;
        }

        if(this.postprocessing)
          TweenMax.to(this.postprocessing.horizontalPass.uniforms['h'], 1, {value : numy/500});

        TweenMax.to(this.bird.rotation, 4, {y : this.INI_ROT_Y+(numy), x : -numx, onUpdate:this.rotateBird, ease : Back.easeOut, onUpdateScope:this});
      // }
      TweenMax.to(this.camera.rotation, 6, {z : (-this.mouseX/this.windowHalfX)*10, ease : Quint.easeOut, onUpdate:this.cameraLookAt, onUpdateScope:this});
      TweenMax.to(this.camera.position, 6, {z : this.INI_CAMERA_Z+Math.abs(this.mouseX),ease : Quint.easeOut});
      TweenMax.to(this.bird.position, 6, {x : this.mouseX/10, ease : Quint.easeOut});

      var num = (10 * Math.PI)/180;
      this.finRotationX = -this.mouseX/1000;
      this.finRotationX = Math.min(num,this.finRotationX);
      this.finRotationX = Math.max(-num,this.finRotationX);
    }
  }
}
