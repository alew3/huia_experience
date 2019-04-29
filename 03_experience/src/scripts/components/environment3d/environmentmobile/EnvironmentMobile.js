import * as THREE from 'three';
import JDLoader from '../environment/loaders/JDLoader';
import ContentLoader from '../../../loaders/ContentLoader';
import GPUParticleSystem from '../environment/particlesscene/particlesystem/GPUParticleSystem';

export default class Environment3dMobile {
  constructor (canvas) {
    JDLoader(THREE);
    GPUParticleSystem(THREE);

    this.canvas = canvas;
    this.clock = new THREE.Clock();
    this.tick = 0;

    this.createScene(canvas);
    this.createBird();
    this.createParticles();
    this.onResizeWindow();

    // this.inirotx = this.bones.bonesByName.Bone_HEAD.rotation.x;
    // this.iniroty = this.bones.bonesByName.Bone_HEAD.rotation.y;
    // this.iniMouseX = window.innerWidth/10;
    // this.iniMouseY = window.innerWidth/10;
    this.rotateNeckByMouse(0,0, 0);
    window.environment3d = this;
    this.render();

    // TweenMax.fromTo(this.bird.position, 1, {x : 5}, {x : 1.4, delay : 1, ease : Quint.easeOut});
  }

  entranceAnimation () {

  }

  hideBackgroundProject () {

  }

  showBackgroundProject () {

  }

  setBlur (b) {
    if(b){
      TweenMax.to(this.canvas, 0.5, {opacity : 0.1});
      this.paused = true;
    }else{
      this.paused = false;
      TweenMax.to(this.canvas, 0.5, {opacity : 1});
      this.render();
    }
  }


  flyToExperience () {
    this.paused = true;
    TweenMax.to(this.canvas, 0.5, {opacity : 0});
  }


  destroy () {

  }

  hideToExperience () {

  }


  emmitParticles(options,quantity){
    if(!options.velocity){
      options.velocity = new THREE.Vector3();
    }

    if(options.position2d){
      var vector = new THREE.Vector3();
      vector.set(
      ( options.position2d.x / window.innerWidth ) * 2 - 1,
      - ( options.position2d.y / window.innerHeight ) * 2 + 1,
      0.5 );
      vector.unproject( this.camera );
      var dir = vector.sub( this.cameraContainer.position ).normalize();
      var distance = - this.cameraContainer.position.z / dir.z;
      var pos = this.cameraContainer.position.clone().add( dir.multiplyScalar( distance ) );
      options.position = pos;
    }

    quantity = 10;

    for(var i = 0; i < quantity; i++)
      this.particleSystem.spawnParticle(options);
  }

  createScene (canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({canvas : canvas, antialias : false, alpha : true, transparent : true});
    this.renderer.setPixelRatio(window.devicePixelRatio * 0.75);
    // this.renderer.setClearColor(0x0a0a14);
    this.renderer.setSize(window.innerWidth,window.innerHeight);

    this.scene = new THREE.Scene();
    this.cameraContainer = new THREE.Object3D();
    this.scene.add(this.cameraContainer);
    this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.cameraContainer.position.z = 14;
    this.cameraContainer.position.y = 13;
    this.cameraContainer.position.x = -1;
    // this.cameraContainer.position.x = 10;
    // this.cameraContainer.rotation.y = 0.3;
    this.cameraContainer.add(this.camera);
    window.cameraContainer = this.cameraContainer;
    this.canvas.addEventListener('touchstart', this.onDownTouch.bind(this));
    this.canvas.addEventListener('touchend', this.onUpTouch.bind(this));


    TweenMax.to(this.cameraContainer.position, 1.4, {x : -2, z : 22, ease : Quint.easeOut});
    TweenMax.to(this.cameraContainer.position, 1.8, {y : 11.5, ease : Quad.easeOut});
  }


  createParticles () {
    this.particleSystem = new THREE.GPUParticleSystem({
      maxParticles: 3000,
      tex : "particle3.png",
      blending : THREE.AdditiveBlending
    });

    this.particlesOptions = {
      positionRandomness: 2,
      color: 0xffffff,
      colorRandomness: 0,
      velocityRandomness : 0.3,
      velocity : new THREE.Vector3(0.01,0.1,0),
      smoothPosition:true,
      turbulence: 0.1,
      lifetime: 20,
      blending : THREE.AdditiveBlending,
      size: 3,
      tex : "particle1.png",
      sizeRandomness: 1
    };

    this.scene.add(this.particleSystem);
  }

  onDownTouch(evt){
    evt.preventDefault();
    this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this));

    this.inirotx = this.bones.bonesByName.Bone_HEAD.rotation.x;
    this.iniroty = this.bones.bonesByName.Bone_HEAD.rotation.y;
    this.iniMouseX = evt.touches[0].clientX;
    this.iniMouseY = evt.touches[0].clientY;

    this.rotateNeckByMouse(evt.touches[0].clientX, evt.touches[0].clientY);
    this.particlesOptions.position2d = {x : evt.touches[0].clientX, y : evt.touches[0].clientY};
    // this.emmitParticles(this.particlesOptions);
  }

  onTouchMove(evt){
    evt.preventDefault();
    this.rotateNeckByMouse(evt.touches[0].clientX, evt.touches[0].clientY);
    this.particlesOptions.position2d = {x : evt.touches[0].clientX, y : evt.touches[0].clientY};
    // this.emmitParticles(this.particlesOptions);
  }

  onUpTouch(evt){
    evt.preventDefault();
    this.canvas.removeEventListener('touchmove', this.onTouchMove.bind(this));
  }

  rotateNeckByMouse(posx, posy, time){
    var coefx = (posx - this.iniMouseX) / 50;
    var coefy = (posy - this.iniMouseY) / 200;

    var finRotX = this.inirotx + (coefx * 0.3);
    var finRotY = this.iniroty + coefy * 0.3;

    finRotX = Math.min(finRotX, 3.5835);
    finRotX = Math.max(finRotX, 2.8176);

    finRotY = Math.max(finRotY, -2.2252);
    finRotY = Math.min(finRotY, -0.9663);


    if(time != 0){
      var time = 1;
    }else{
      var time = time;
      finRotX = 2.892090157781469;
      finRotY = -1.7585750230038533;
    }

    var finPosY = this.iniHEADPosition.y + (finRotX - this.iniHEADRotation.x);
    TweenMax.to(this.bird.position, time, {x : -1.4 + finRotX, y : 0.4-finRotY, ease : Quint.easeOut});
    TweenMax.to(this.birdBody.geometry.vertices[0], time, {x : -3.29 + (finRotX - 2.8176)*1.1, y : 6.59 - (finRotY + 1.9252)*1, onUpdate:this.updateVertices, onUpdateScope:this, ease : Quint.easeOut});
    TweenMax.to(this.birdBody.geometry.vertices[1], time, {x : (finRotX - 2.8176)*1.1, y : 6.59 - (finRotY + 1.9252)*1.8, ease : Quint.easeOut});
    TweenMax.to(this.birdBody.geometry.vertices[3], time, {x : -3.29 + (finRotX - 2.8176)*0.6, y : -(finRotY + 1.9252)*0.4, ease : Quint.easeOut});
    TweenMax.to(this.birdBody.geometry.vertices[4], time, {x : (finRotX - 2.8176)*0.6, y : -(finRotY + 1.9252)*0.4, ease : Quint.easeOut});

    // TweenMax.to(this.bones.bonesByName.SceneRoot.rotation, time, {x : (finRotX-2.8176)/15, ease : Quint.easeOut});
    TweenMax.to(this.bones.bonesByName.Bone_HEAD.rotation, time, {x : finRotX, y : finRotY, ease : Quint.easeOut});
    TweenMax.to(this.bones.bonesByName.Bone_neck_01.rotation, time, {x : this.bones.bonesByName.Bone_neck_01.iniRotation.x + (finRotX/100), y : this.bones.bonesByName.Bone_neck_01.iniRotation.y + (finRotY/100), ease : Quint.easeOut});
    TweenMax.to(this.bones.bonesByName.Bone_neck_02.rotation, time, {x : this.bones.bonesByName.Bone_neck_02.iniRotation.x + (finRotX/100), y : this.bones.bonesByName.Bone_neck_02.iniRotation.y + (finRotY/100), ease : Quint.easeOut});
  }

  updateVertices () {
    this.birdBody.geometry.verticesNeedUpdate = true;
  }

  createBird () {
    this.bird = new THREE.Object3D();
    this.bird.rotation.y = -0.4;
    this.bird.position.x = 1.4;
    // this.bird.rotation.y = -1;
    window.bird = this.bird;
    this.scene.add(this.bird);

    this.loader = new THREE.JDLoader();
    var data = this.loader.parse(ContentLoader.DATA_MODEL_HUIA);

    this.huiaMaterial = new THREE.MeshPhongMaterial({
      map : ContentLoader.DATA_HUIA_3D_TEXTURES["huia-diffuse"],
      // roughnessMap : ContentLoader.DATA_HUIA_3D_TEXTURES["huia-roughness"],
      specularMap : ContentLoader.DATA_HUIA_3D_TEXTURES["huia-specular"],
      normalMap : ContentLoader.DATA_HUIA_3D_TEXTURES["huia-normalmap"],
      specular : new THREE.Color(0x101114),
      skinning : true,
      side : THREE.DoubleSide,
      transparent : true,
      shading : THREE.SmoothShading
    });
    window.huiaMaterial = this.huiaMaterial;

    this.tailMaterial = new THREE.MeshPhongMaterial({
      map : ContentLoader.DATA_HUIA_3D_TEXTURES["feather-diffuse"],
      normalMap : ContentLoader.DATA_HUIA_3D_TEXTURES["feather-normalmap"],
      alphaMap : ContentLoader.DATA_HUIA_3D_TEXTURES["feather-alphamap"],
      specularMap : ContentLoader.DATA_HUIA_3D_TEXTURES["feather-roughness"],
      bumpMap : ContentLoader.DATA_HUIA_3D_TEXTURES["feather-roughness"],
      specular : new THREE.Color(0x101114),
      skinning : true,
      side : THREE.DoubleSide,
      transparent : true,
      alphaTest : 0.3,
      shading : THREE.SmoothShading
    });

    this.plumesMaterial = new THREE.MeshPhongMaterial({
      map : ContentLoader.DATA_HUIA_3D_TEXTURES["feather-diffuse"],
      normalMap : ContentLoader.DATA_HUIA_3D_TEXTURES["feather-normalmap"],
      alphaMap : ContentLoader.DATA_HUIA_3D_TEXTURES["feather-alphamap-plumes"],
      specularMap : ContentLoader.DATA_HUIA_3D_TEXTURES["feather-roughness"],
      bumpMap : ContentLoader.DATA_HUIA_3D_TEXTURES["feather-roughness"],
      specular : new THREE.Color(0x101114),
      skinning : true,
      side : THREE.DoubleSide,
      transparent : true,
      alphaTest : 0.3,
      shading : THREE.SmoothShading
    });


    this.bodyMaterial = new THREE.MeshBasicMaterial({
      map : ContentLoader.DATA_HUIA_3D_TEXTURES["body"],
      side : THREE.DoubleSide,
      transparent : true,
      alphaTest : 0.5,
      alphaMap : ContentLoader.DATA_HUIA_3D_TEXTURES["body-alpha"],
      shading : THREE.SmoothShading
    });

    var s = 6.6;
    this.birdBody = new THREE.Mesh(new THREE.PlaneGeometry(s,s * 2,2,2),this.bodyMaterial);
    this.birdBody.position.x = 0.9;
    this.birdBody.position.y = 8.6;
    this.birdBody.position.z = 8;
    this.birdBody.iniPosition = {x : 0.95, y : 6.3999, z : 8};
    this.scene.add(this.birdBody);
    window.birdBody = this.birdBody;


    this.eyeMaterial = new THREE.MeshPhongMaterial({
      map : ContentLoader.DATA_HUIA_3D_TEXTURES["eye-ball"],
      side : THREE.DoubleSide,
      transparent : true,
      skinning : true,
      shading : THREE.SmoothShading
    });

    this.lightLeft = new THREE.SpotLight();
    this.cameraContainer.add(this.lightLeft);
    this.lightLeft.position.x = -13;
    this.lightLeft.position.y = -1;
    this.lightLeft.position.z = 4;
    this.lightLeft.intensity = 1;
    this.lightLeft.color = new THREE.Color(0xed6d76);
    this.lightLeft.lookAt(new THREE.Vector3(0,0,0));

    this.lightRight = new THREE.SpotLight();
    this.cameraContainer.add(this.lightRight);
    this.lightRight.position.x = 3;
    this.lightRight.position.z = 4;
    this.lightRight.position.y = 0;
    this.lightRight.intensity = 1;
    this.lightRight.color = new THREE.Color(0x20befc);
    this.lightRight.lookAt(new THREE.Vector3(0,0,0));

    this.lightFront = new THREE.SpotLight();
    this.lightFront.color = new THREE.Color(0xfdc987);
    this.lightFront.position.x = 0;
    this.lightFront.position.y = 0;
    this.lightFront.position.z = 3;
    this.lightFront.distance = 10;
    this.lightFront.intensity = 1;
    this.lightFront.decay = 1.0;
    this.lightFront.lookAt(new THREE.Vector3(0,0,0))
    this.cameraContainer.add(this.lightFront);

    this.lightTop = new THREE.SpotLight(0xffffff);
    this.lightTop.position.y = 10;
    this.lightTop.position.z = 0;
    this.lightTop.castShadow = true;
    this.lightTop.lookAt(new THREE.Vector3(0,0,0));
    this.cameraContainer.add(this.lightTop);


    // this.lightTop.intensity = this.lightFront.intensity = this.lightRight.intensity = this.lightLeft.intensity = 0;
    //
    //
    // TweenMax.to([this.lightTop, this.lightFront, this.lightRight, this.lightLeft], 0.8, {intensity : 1});

    for(var i = 0; i < data.geometries.length; i++){
      var mesh = new THREE.SkinnedMesh(data.geometries[i], this.huiaMaterial);
      this.bird.add(mesh);
      mesh.frustumCulled = false;

      if(mesh.geometry.name.indexOf("plumes") > -1){
        mesh.material = this.plumesMaterial;
      }else if(mesh.geometry.name.indexOf("body") > -1){
        mesh.material = this.huiaMaterial;
      }else if(mesh.geometry.name.indexOf("tongue") > -1){
        mesh.material = this.huiaMaterial;
      }else if(mesh.geometry.name.indexOf("eye") > -1){
        mesh.material = this.eyeMaterial;
        // mesh.visible = true;
      }else{
        mesh.material = this.tailMaterial;
      }

        if(i == 0){
          this.skeleton = mesh.skeleton;
          var mixer = new THREE.AnimationMixer(mesh);
          this.mixer = mixer;
          var anim = this.mixer.clipAction(mesh.geometry.animations[0]);
          anim.setDuration(0);
          // anim.setLoop(THREE.);
          window.anim = anim;
          anim.play();
        }else{
          mesh.skeleton = this.skeleton;
        }
    }

    // this.ambientLight = new THREE.AmbientLight({color : 0x000000});
    // this.ambientLight.intensity = 100;
    // this.scene.add(this.ambientLight);

    // TweenMax.from(this.bird.position, 4, {z : -80});



    this.bones = this.skeleton;
    this.bones.bonesByName = [];
    for(var q = 0; q < this.skeleton.bones.length; q++){
      this.bones.bonesByName[this.skeleton.bones[q].name] = this.skeleton.bones[q];
      this.bones.bonesByName[this.skeleton.bones[q].name].iniRotation = {x : this.skeleton.bones[q].rotation.x, y : this.skeleton.bones[q].rotation.y, z : this.skeleton.bones[q].rotation.z};
      this.bones.bonesByName[this.skeleton.bones[q].name].iniPosition = {x : this.skeleton.bones[q].position.x, y : this.skeleton.bones[q].position.y, z : this.skeleton.bones[q].position.z};
    }
    window.bones = this.bones;
    this.iniHEADPosition = this.bones.bonesByName.Bone_HEAD.position;
    this.iniHEADRotation = this.bones.bonesByName.Bone_HEAD.rotation;
    // this.iniNeckPosition = this.bones.bonesByName.Bone_head01.position;
    // this.iniNeckRotation = this.bones.bonesByName.Bone_head01.rotation;

    this.blinkEyes();
    this.openMouth();
    // this.cameraContainer.lookAt(this.bird.position);
  }

  blinkEyes () {
    var del = 1 + Math.random()*0.5;
    TweenMax.to(this.bones.bonesByName.huia_eyelid_right.rotation, 0.3, {x : -2.4415, y : 1.9655, z : 1.4707, yoyo : true, repeat : 1, ease : Quint.easeIn, delay : del});
    TweenMax.to(this.bones.bonesByName.huia_eyelid_left.rotation, 0.3, {y : 3.0655, z : -0.4292, yoyo : true, repeat : 1, ease : Quint.easeIn, delay : del, onComplete:this.blinkEyes.bind(this)});
  }

  openMouth () {
    var del = 5 + Math.random() * 5;
    TweenMax.to(this.bones.bonesByName.Bone_B_Beak.rotation, 0.3, {y : -0.01, yoyo:true, ease : Quint.easeOut, repeat : 1, delay:del, repeatDelay:1, onComplete:this.openMouth.bind(this)});
  }

  onResizeWindow(evt){
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.camera.aspect = window.innerWidth/window.innerHeight;
    this.camera.updateProjectionMatrix();


    this.render();
  }

  render() {
    var delta = this.clock.getDelta();
    this.tick += delta;
    // this.particleSystem.update(this.tick);
    this.mixer.update(delta);
    this.renderer.render(this.scene, this.camera);

    if(!this.paused)
      this.requestId = window.requestAnimationFrame(this.render.bind(this));
  }
}
