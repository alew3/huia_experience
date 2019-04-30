import * as THREE from 'three';
//import SceneUtils from '../../../../helpers/SceneUtils';
import JDLoader from "../loaders/JDLoader";
import Globals from "../../../../core/Globals";
import MathHelper from "../../../../helpers/MathHelper";
import SoundsLoader from "../../../../loaders/SoundsLoader";
import '../../../../vendors/CustomEase';
import WireframeShader from '../postprocessing/wireframe/WireframeShader';
//import MeshCustomMaterial2 from '../postprocessing/wireframe/WMaterial';

import ContentHelper from '../../../../loaders/ContentLoader';
import JSZip from 'jszip';
import SimplifyModifier from './SimplifyModifier';
import JSZipUtils from 'jszip-utils';
import VerticalBlurShader from '../postprocessing/gaussianblur/VerticalBlurShader';

export default class HuiaBird extends THREE.Object3D {
  constructor(){
    super();
    JDLoader(THREE);
    SimplifyModifier(THREE);

    this.startTime = 0;
    this.mousemovementTimer = 0;
    this.mousemovementTimerMaxFrames = 25;
    this.mousemovementTimerEffectStartFrames = 15;

    this.walkingDuration = 0.66;

    this.durations =    [5.6, 2.06, 1, 1, 1.56, 1.56, 0.93, 2, 2.8, 0.25, 2, 1.5, 3,3.86,8.96,2.86, 4.4, 5.33 ];
    // this.durations = [5.6, 2.06, 1, 1, 10.56, 1.56, 0.93, 2, 2.8,0.25,2,0.25,this.walkingDuration*0.37,this.walkingDuration,this.walkingDuration*1.33];
    this.animations = [];
    this.lookingDirection = "left";


    //animated wireframe shader
    this.animatedWireframe = new WireframeShader();
    this.animatedWireframe.transparent =  true;
    this.animatedWireframe.wireframe = true;
    this.animatedWireframe.skinning = true;
    this.animatedWireframe.needsUpdate = true;
    this.animatedWireframeMaterial = new THREE.ShaderMaterial(this.animatedWireframe);


    this.huiaMaterial = new THREE.MeshPhongMaterial({
      map : ContentLoader.DATA_HUIA_3D_TEXTURES["huia-diffuse"],
      // roughnessMap : ContentLoader.DATA_HUIA_3D_TEXTURES["huia-roughness"],
      specularMap : ContentLoader.DATA_HUIA_3D_TEXTURES["huia-specular"],
      normalMap : ContentLoader.DATA_HUIA_3D_TEXTURES["huia-normalmap"],
      specular : new THREE.Color(0x101114),
      skinning : true,
      side : THREE.DoubleSide,
      transparent : true,
      //opacity:0.0,
      shading : THREE.SmoothShading
    });

    this.huiaMaterial2 = new THREE.MeshPhongMaterial({
      map : ContentLoader.DATA_HUIA_3D_TEXTURES["huia-diffuse"],
      // roughnessMap : ContentLoader.DATA_HUIA_3D_TEXTURES["huia-roughness"],
      specularMap : ContentLoader.DATA_HUIA_3D_TEXTURES["huia-specular"],
      normalMap : ContentLoader.DATA_HUIA_3D_TEXTURES["huia-normalmap"],
      specular : new THREE.Color(0x101114),
      skinning : true,
      side : THREE.DoubleSide,
      transparent : true,
      //opacity:0.0,
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
      opacity:0.0,
      alphaTest : 0.3,
      shading : THREE.SmoothShading
    });

    if(this.animatedWireframe2==null || this.animatedWireframe2==undefined){
      this.animatedWireframe2 = new WireframeShader();

      //console.log("Wireframe shader is here>\n" , this.animatedWireframe2);
    }
    this.wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      wireframe : true,
      skinning : true,
      wireframeLinewidth: 1,
      normalMap: null,
      bumpMap: null,
      map: null,
      side: THREE.BackSide,
      needsUpdate: true,
      shading: THREE.FlatShading
      //shading : null
      //color: new THREE.Color (0xffffff)

      //transparent : true,
      //alphaTest : 0.3,
      //fragmentShader:this.animatedWireframe2.fragmentShader,
      //shading : this.animatedWireframe2
    });

    //this.myShader1 =  new WireframeShader(THREE);
    //this.mYMaterial = new THREE.ShaderMaterial(this.myShader1);
    //this.mYMaterial = new THREE.ShaderMaterial(WireframeShader(THREE));

    this.eyeMaterial = new THREE.MeshPhongMaterial({
      map : ContentLoader.DATA_HUIA_3D_TEXTURES["eye-ball"],
      side : THREE.DoubleSide,
      transparent : false,
      skinning : true,
      shading : THREE.SmoothShading
    });


    this.loadJD();
    // this.loadDancer();


    // var zip = new JSZip();
    // window.zip = zip;
    window.huiaMaterial = this.huiaMaterial;
    window.plumesMaterial = this.plumesMaterial;
    window.tailMaterial = this.tailMaterial;





    //2,11,7 cabeca size 1,1
    // pe esquerdo
    /*    this.positions = [{x : 6, y : 2.49, z : 7.69}];
    this.sizes = [{width : 0.5, height : 1}];
    this.rotations = [{x : -0.79, y : -0.1, z : 0}];*/
    // pe direito
    /*    this.positions = [{x : 4, y : 2.49, z : 7.69}];
    this.sizes = [{width : 0.5, height : 1}];
    this.rotations = [{x : -0.79, y : -0.1, z : 0}];*/
    // barriga
    /*    this.positions = [{x : 6, y : 7, z : 9}];
    this.sizes = [{width : 0.45, height : 0.7}];
    this.rotations = [{x : 0, y : 0, z : 0.4}];*/
    // rabo
    /*    this.positions = [{x : 8.59, y : 5.49, z : 7.69}];
    this.sizes = [{width : 0.3, height : 0.5}];
    this.rotations = [{x : 0, y : 0, z : 0}];*/

    // cabeca, barriga, pe esquerdo, asa, pe direito, rabo
    this.positions = [{x : 3, y : 10, z : 10}, {x : 5, y : 7, z : 9.5},{x : 6.5, y : 2.49, z : 7.69}, {x : 4.89, y : 8, z : 5.2},{x : 3, y : 2.49, z : 7.69}, {x : 7.89, y : 5.49, z : 7.9}];
    this.sizes = [{width : 1, height : 0.5}, {width : 0.45, height : 0.7},{width : 0.5, height : 1},{width : 0.7, height : 0.7},{width : 0.5, height : 1},{width : 0.5, height : 0.5}];
    this.rotations = [{x : 0, y : 0, z : 0}, {x : 0, y : 0, z : 0.4},{x : -0.79, y : -0.1, z : 0},{x : 0, y : 0, z : 0.6},{x : -0.79, y : -0.1, z : 0},{x : 0, y : 0, z : 0}];
    this.planes = [];
    for(var i =0 ; i < this.positions.length; i++){
      var position = this.positions[i];
      var size = this.sizes[i];
      var rotation = this.rotations[i];
      var geom = new THREE.PlaneGeometry(5*size.width,5*size.height);
      var mat = new THREE.MeshBasicMaterial({transparent : true, opacity : 0});
      var plane = new THREE.Mesh(geom, mat);
      plane.position.x = position.x;
      plane.position.y = position.y;
      plane.position.z = position.z;
      plane.rotation.x = rotation.x;
      plane.rotation.y = rotation.y;
      plane.rotation.z = rotation.z;
      plane.rotation.y = 45 * Math.PI/180;
      this.add(plane);
      window.plane = plane;
      plane.name = "hover"+i;

      this.planes.push(plane);
    }

    window.planes = this.planes;

    this.rotation.y = -45 * Math.PI/180;

    this.pointLight = new THREE.SpotLight( 0x8C6EE5, 1, 100 );
    this.pointLight.intensity = 0;
    this.pointLight.angle = 0.15;
    this.pointLight.penumbra = 1;
    this.pointLight.decay = 13;
    this.pointLight.distance = 30;

    this.pointLight.hide = true;
    //
    this.pointLightDirectional = new THREE.SpotLight( 0xffffff, 1, 100 );
    this.pointLightDirectional.intensity = 0;
    this.pointLightDirectional.angle = 0.2;
    this.pointLightDirectional.penumbra = 1;
    this.pointLightDirectional.decay = 6;
    this.pointLightDirectional.distance = 25;

    this.pointLightDirectional.hide = true;


    this.targetMouse = new THREE.Object3D();
    // this.add(this.targetMouse);

    window.pointDirectional = this.pointLightDirectional;
    window.point = this.pointLight;
    /* ADD CARTOLA */
    // this.eyeLeft.add(this.cartola);
    // this.cartola.position.set(-0.5 , 0.2, -0.5);
    // this.cartola.scale.set(0.8,0.8,0.8);
    // this.cartola.material =  new THREE.MultiMaterial([this.eyeMaterial]); 
  }

  updateMixers(delta) {
    // this.lightHelper.update();
    this.delta = delta;
    if(!this.mixer) return;
    if(this.blockMixers) return;
    this.mixer.update(delta);
  }

  loadJD() {
    this.animations = [];

    this.scale.x = this.scale.y = this.scale.z = 0.7;
    this.position.y = 0;

    if(!window.MOBILE_DETECT.mobile())
    this.castShadow = true;

    this.blockMixers = true;

    this.loader = new THREE.JDLoader();
    var data = this.loader.parse(ContentLoader.DATA_MODEL_HUIA);
    var modifier = new THREE.SimplifyModifier();

    /** LOAD CARTOLA */
    // var prop = this.loader.parse(ContentLoader.DATA_MODEL_CARTOLA);
    // this.cartola = new THREE.SkinnedMesh(prop.geometries[0]);

    this.neckBone = null;
    this.neckBone2 = null;
    this.headBone = null;
    this.spine1Bone =null;
    this.spine2Bone =null;
    this.spine3Bone =null;
    this.leftWingBones = [];
    this.rightWingBones = [];
    var skeleton;

    var wire = new THREE.MeshStandardMaterial({
      wireframe : true,
      shading : THREE.SmoothShading
    });

    this.overs = new THREE.Object3D();
    // this.add(thgis.overs);

    this.wireModel = null;
    this.wireContainer = new THREE.Object3D();

    for (var i = 0; i < data.geometries.length; i++)
    {
      var mesh = new THREE.SkinnedMesh(data.geometries[i]);
      mesh.frustumCulled = false;
      if(i == 0)
      {
        skeleton = mesh.skeleton;
      }else{
        mesh.skeleton = skeleton;
      }


      mesh.castShadow = true;

      var isOver = false;
      var isBodyMaterial= false;
      // console.log(mesh.geometry.name);

      //
      // mesh.visible = false;
      if(mesh.geometry.name.indexOf("plumes") > -1){
        mesh.material = this.plumesMaterial;
      }else if(mesh.geometry.name.indexOf("body") > -1){
        mesh.material = this.huiaMaterial;
        this.materialBody = mesh.material;


        isBodyMaterial = true;

        //acabei usando a mesma forma de clonar que tinhamos testado aquele dia.
        //eu tinha tentado usar MultiMaterial e coisas do tipo e nao bombou.
        // mas se tu souber como pode ser uma boa tentar usar multimaterial ou algo do tipo. sei la quem sabe tenha alguma otimização a mais
        this.wireModel = mesh.clone();
        this.wireModel.skeleton = skeleton;
        this.wireModel.material = this.animatedWireframeMaterial;
        this.wireContainer.add(this.wireModel);
        this.add(this.wireContainer);
        window.wireContainer = this.wireContainer;

      }else if(mesh.geometry.name.indexOf("tongue") > -1){
        mesh.material = this.huiaMaterial;
      }else if(mesh.geometry.name.indexOf("eye") > -1){
        mesh.material = this.eyeMaterial;
        // mesh.visible = true;
      }else if(mesh.geometry.name.indexOf("CTRL") > -1){
        window.part = mesh;
        mesh.material = this.wireframeMaterial;
        isOver = true;
        // mesh.visible = true;
      }else{
        mesh.material = this.tailMaterial;
      }


      // {
      //   uniforms: params[ i ][ 1 ],
      //   vertexShader: document.getElementById( 'vertexShader' ).textContent,
      //   fragmentShader: document.getElementById( params[ i ][ 0 ] ).textContent
      // }


      //animatedWireframe["skinning"] = true;

      if(isBodyMaterial){
        var materials = [];
        materials.push(this.animatedWireframeMaterial);
        materials.push(this.huiaMaterial2);

        var myMultiMaterisl = new THREE.MultiMaterial( materials );
        //mesh.material = materials;
        //  mesh.material = this.animatedWireframeMaterial;
        //console.log(" Material body shader uniforms: "  , mesh.material);

      }



      //mesh.material = this.wireframeMaterial;

      if(!isOver){
        this.add(mesh);
      }else{
        this.overs.add(mesh);
      }

      window.overs = this.overs;

      if(i == 0){
        for(var q = 0; q < skeleton.bones.length; q++){
          skeleton.bones[q].inirotation = {x : skeleton.bones[q].rotation.x, y : skeleton.bones[q].rotation.y, z : skeleton.bones[q].rotation.z};
          skeleton.bones[q].iniposition = skeleton.bones[q].position;
          var name = skeleton.bones[q].name.toLowerCase();
          // console.log(name);

          if(name.indexOf("head") > -1){
            this.headBone = skeleton.bones[q];
          }else if(name.indexOf("neck_01") > -1){
            this.neckBone = skeleton.bones[q];
          }else if(name.indexOf("neck_02") > -1){
            this.neckBone2 = skeleton.bones[q];
          }else if(name.indexOf("spine_01") > -1){
            this.spine1Bone = skeleton.bones[q];
          }else if(name.indexOf("spine_02") > -1){
            this.spine2Bone = skeleton.bones[q];
          }else if(name.indexOf("spine_03") > -1){
            this.spine3Bone = skeleton.bones[q];
          }else if(name.indexOf("eye_left") > -1){
            this.eyeLeft = skeleton.bones[q];
          }else if(name.indexOf("eye_right") > -1){
            this.eyeRight = skeleton.bones[q];
          }else if(name.indexOf("eyelid_left") > -1){
            this.eyeLidLeft = skeleton.bones[q];
          }else if(name.indexOf("eyelid_right") > -1){
            this.eyeLidRight = skeleton.bones[q];
          }else if(name.indexOf("b_beak") > -1){
            this.bottomBeak = skeleton.bones[q];
          }else if(name.indexOf("bone_l_wing") > -1){
            this.leftWingBones.push(skeleton.bones[q]);
          }else if(name.indexOf("bone_r_wing") > -1){
            this.rightWingBones.push(skeleton.bones[q]);
          }else if(name.indexOf("t_beack") > -1){
            this.topBeak = skeleton.bones[q];
          }
        }

        var mixer = new THREE.AnimationMixer(mesh);
        this.mixer = mixer;
        // this.mixer.addEventListener('finished', this.onFinishedAnimation.bind(this));
        this.animations = [];
        for(var q = 0; q < mesh.geometry.animations.length; q++){
          var anim = mixer.clipAction(mesh.geometry.animations[q]);
          anim.setDuration(this.durations[q]);
          anim.effectiveWeight = 0;
          anim.setEffectiveWeight(0);

          if(q == 0 || q == 5){
            anim.setLoop(THREE.LoopRepeat);
          }else{
            anim.setLoop(THREE.LoopOnce);
            anim.noLoop = true;
            anim.clampWhenFinished = true;
          }
          this.animations.push(anim);
        }

        window.animations = this.animations;
      }



      window.bottomBeak = this.bottomBeak;
      window.topBeak = this.topBeak;
    }

    this.bones = skeleton;
    this.bones.bonesByName = [];
    for(var q = 0; q < skeleton.bones.length; q++){
      this.bones.bonesByName[skeleton.bones[q].name] = skeleton.bones[q];
    }
    window.bones = this.bones;
    // this.bones = skeleton;

    if(!Globals.SHOW_INTRO){
      this.playAnimation(0, false);
      this.mixer.update(0);
    }

    this.blinkEyes();
    this.openMouth();
    this.moveNeck();
    this.shakeTail();

    //
  }

  playAnimation(index, crossfade, time){
    var nextAnim = this.animations[index];

    TweenMax.killTweensOf(this.bones.bonesByName.CTRL_pelvis.rotation);
    TweenMax.killTweensOf(this.bones.bonesByName.CTRL_pelvis.position);
    TweenMax.killTweensOf(this.bones.bonesByName.Bone_C_Tail_01.rotation);
    TweenMax.killTweensOf(this.bones.bonesByName.Bone_R_Tail_01.rotation);
    TweenMax.killTweensOf(this.bones.bonesByName.Bone_L_Tail_01.rotation);
    TweenMax.killTweensOf(this.bones.bonesByName.Bone_neck_01.rotation);
    TweenMax.killTweensOf(this.bones.bonesByName.Bone_neck_02.rotation);

    TweenMax.set(this.bones.bonesByName.CTRL_pelvis.rotation, {y : 0.3794});
    TweenMax.set(this.bones.bonesByName.CTRL_pelvis.position, {x : -0.4738});
    TweenMax.set(this.bones.bonesByName.Bone_C_Tail_01.position, {y : 0});
    TweenMax.set(this.bones.bonesByName.Bone_R_Tail_01.position, {y : 0});
    TweenMax.set(this.bones.bonesByName.Bone_L_Tail_01.position, {y : 0});

    if(index != 0){
      this.mouseBlocked = true;
    }

    this.blockMixers = (index == 0);

    if(!crossfade){
      nextAnim.setEffectiveWeight(1);
      nextAnim.effectiveWeight = 1;
      nextAnim.time = 0;
      nextAnim.play();
      this.currentAnimation = nextAnim;

      for(var i = 0; i < this.animations.length; i++){
        if(i != index){
          this.animations[i].stop();
          this.animations[i].effectiveWeight = 0;
          this.animations[i].setEffectiveWeight(0);
        }
      }

      if(index != 0 && index != 5){
        TweenMax.killTweensOf(this.mixer);
        TweenMax.to(this.mixer, this.durations[index], {onComplete:this.endAnim.bind(this)});
      }else{
        this.mixer.update(0);
      }
    }else{
      TweenMax.to(this.currentAnimation, time, {effectiveWeight : 0, onUpdate:this.setAnimationWeight, onUpdateParams:[this.currentAnimation], ease : Linear.easeNone});
      nextAnim.enabled = true;
      nextAnim.play();
      TweenMax.to(nextAnim, time, {effectiveWeight : 1, onUpdate:this.setAnimationWeight, onUpdateParams:[nextAnim], ease : Linear.easeNone});
      this.currentAnimation.crossFadeTo(nextAnim, time, true);
      this.currentAnimation = nextAnim;
    }
  }

  endAnim () {
    this.currentAnimation.stop();
    var index = this.animations.indexOf(this.currentAnimation);
    if(index == 4){
      this.flying = true;
      this.playAnimation(5,false);

      SoundsLoader.playSound("flyingloop", true, 0.3);
      // }else if(index == 12){
      //   this.playAnimation(13,false);
    }else if(index != 18){
      this.playAnimation(0,false);
      this.mixer.update(0);
      this.mouseBlocked = false;
      this.shakeTail();
      this.moveNeck();
    }
  }

  reactClick(posx){
    var dir = "left";
    if(posx > window.innerWidth*0.7){
      dir = "right";
    }

    var rotateTime = 0.1;

    if(dir == this.lookingDirection) return;

    if(dir == "right"){
      TweenMax.to(this.rotation, rotateTime, {y : -30 * Math.PI/180, ease : Quad.easeInOut});
      TweenMax.to(this.position, rotateTime/2, {y : 0.2, ease : Quad.easeOut, yoyo:true, repeat : 1, onComplete:this.endRotate.bind(this)});
    }else{
      TweenMax.to(this.rotation, rotateTime, {y : -45 * Math.PI/180, ease : Quad.easeInOut});
      TweenMax.to(this.position, rotateTime/2, {y : 0.2, ease : Quad.easeOut, yoyo:true, repeat : 1, onComplete:this.endRotate.bind(this)});
    }
   
    this.lookingDirection = dir;
  }


  fly(direct){
    this.mouseBlocked = true;
    var rot = 0.3794;
    this.flyDirect = direct;
    if(!direct)
    {
      this.playAnimation(4,false);
    }
    else
    {
      // TweenMax.from(this.position, 5, {x : 10});
      this.playAnimation(5,false);
    }
  }

  jumpToSide() {
    this.mouseBlocked = true;
    this.playAnimation(12,false);
    // TweenMax.to(this.position, this.walkingDuration*4.54, {x : -20, z : 20, ease : Linear.easeNone, onComplete:this.stopWalk.bind(this)});
  }

  lookBack (){
    this.mouseBlocked = true;
    this.playAnimation(13,false);
  }

  // stopWalk () {
  //
  //   TweenMax.set(this.position, {x : 30, z : -25});
  //   TweenMax.to(this.position, this.walkingDuration*4.54, {x : 0, z : 0, ease : Linear.easeNone, onComplete:this.reallyStopWalk.bind(this)})
  // }



  endJumping360 () {
    TweenMax.killTweensOf(this.rotation);
    TweenMax.set(this.rotation, {y : MathHelper.radiusToPI(-45)});
    this.position.x = 0;
    this.playAnimation(0,false);
    this.mouseBlocked = false;
  }

  flyFromBackground (duration,del) {
    this.mouseBlocked = true;
    this.playAnimation(5,false);
    TweenMax.set(this.position, {x : -20, z : -30, y : -8});
    // this.rotation.z = 45 * Math.PI/180;
    duration = duration || 2;
    SoundsLoader.playSound("flyingloop", true, 0.3, 2);
    this.rotation.y = 90 * Math.PI/180;
    TweenMax.to(this.position, duration, {bezier:[{x : 25, z : -15, y : -4}, {x : 0, z : 0, y : 0}], ease : Quad.easeOut, delay:del});
    TweenMax.to(this.rotation, duration, {bezier:[{y : -1, z : 10*Math.PI/180}, {y : -45*Math.PI/180, z : 0}], delay:del, ease : Quad.easeOut, onComplete:this.land.bind(this)});
  }

  reallyStopWalk () {
    this.playAnimation(14,false);
  }

  land(){
    SoundsLoader.stopLoop("flyingloop");
    this.flying = false;
    this.playAnimation(6,false);
  }


  setAnimationWeight(anim){
    anim.setEffectiveWeight(anim.effectiveWeight);
  }

  blinkEyes () {
    var del = 1 + Math.random()*0.5;
    TweenMax.to(this.eyeLidRight.rotation, 0.3, {x : -2.1415, yoyo : true, repeat : 1, ease : Quint.easeIn, delay : del});
    TweenMax.to(this.eyeLidLeft.rotation, 0.3, {y : 3.0655, z : -0.4292, yoyo : true, repeat : 1, ease : Quint.easeIn, delay : del, onComplete:this.blinkEyes.bind(this)});
  }

  openMouth () {
    var del = 5 + Math.random() * 5;
    TweenMax.to(this.bottomBeak.rotation, 0.3, {y : -0.01, yoyo:true, ease : Quint.easeOut, onStart:()=>{
      var rand = 1 + Math.round(Math.random()*4); SoundsLoader.playSound("sing"+rand, false, 0.5, 0);
    }, repeat : 1, delay:del, repeatDelay:1, onComplete:this.openMouth.bind(this)});
  }

  shakeTail () {

    var del = 1 + Math.random() * 5;
    var num = Math.random()*0.2;
    var rot = 0.3794 - num;
    // var rot = 0.3794;
    var reptDel = 1 + Math.random()*2;

    if(!this.blockMixers){
      TweenMax.to(this.bones.bonesByName.CTRL_pelvis.rotation, 0.1, {ease : Back.easeOut, repeat : 1, delay:del, repeatDelay:reptDel, onComplete:this.shakeTail.bind(this), overwrite:false});
      return;
    }

    TweenMax.killTweensOf(this.bones.bonesByName.CTRL_pelvis.rotation);
    TweenMax.killTweensOf(this.bones.bonesByName.CTRL_pelvis.position);
    TweenMax.set(this.bones.bonesByName.CTRL_pelvis.position, {x : -0.4738});
    TweenMax.set(this.bones.bonesByName.CTRL_pelvis.rotation, {y : 0.3794});
    TweenMax.to(this.bones.bonesByName.CTRL_pelvis.rotation, 0.1, {y : rot, yoyo:true, ease : Quad.easeOut, repeat : 1, delay:del, repeatDelay:reptDel, onComplete:this.shakeTail.bind(this), overwrite:false});
    // TweenMax.to(this.bones.bonesByName.CTRL_pelvis.position, 0.1, {x : -0.4738+(rot*2), yoyo:true, ease : Quad.easeOut, repeat : 1, delay:del, repeatDelay:reptDel});
    TweenMax.to(this.bones.bonesByName.Bone_C_Tail_01.rotation, 0.2, {y : num*5, ease : Back.easeOut, delay:del});
    TweenMax.to(this.bones.bonesByName.Bone_R_Tail_01.rotation, 0.2, {y : num*5, ease : Back.easeOut, delay:del});
    TweenMax.to(this.bones.bonesByName.Bone_L_Tail_01.rotation, 0.2, {y : num*5, ease : Back.easeOut, delay:del});
    TweenMax.to(this.bones.bonesByName.Bone_C_Tail_01.rotation, 0.2, {y : 0, ease : Back.easeOut, delay:del+reptDel+0.2, overwrite:false});
    TweenMax.to(this.bones.bonesByName.Bone_R_Tail_01.rotation, 0.2, {y : 0, ease : Back.easeOut, delay:del+reptDel+0.2, overwrite:false});
    TweenMax.to(this.bones.bonesByName.Bone_L_Tail_01.rotation, 0.2, {y : 0, ease : Back.easeOut, delay:del+reptDel+0.2, overwrite:false});
  }

  moveNeck () {
    var rand = -0.5 * Math.random()*1;
    return;
    if(this.mouseBlocked) return;
    TweenMax.to(this.bones.bonesByName.Bone_neck_01.rotation, 0.1, {z : rand});
    TweenMax.to(this.bones.bonesByName.Bone_neck_02.rotation, 0.1, {z : rand});
    // TweenMax.to(this.bones.bonesByName.Bone_spine_03.rotation, 0.1, {z : rand});
    TweenMax.to(this, 3 + Math.random()*3, {onComplete:this.moveNeck.bind(this)});

    if(!this.blockMixers){
      return;
    }

    TweenMax.to(this.bones.bonesByName.Bone_neck_01.rotation, 0.1, {z : 0, delay : 0.6, overwrite:false});
    TweenMax.to(this.bones.bonesByName.Bone_neck_02.rotation, 0.1, {z : 0, delay : 0.6, overwrite:false});
    // TweenMax.to(this.bones.bonesByName.Bone_spine_03.rotation, 0.1, {z : 0, delay : 0.6, overwrite:false});

  }


  setMouseCoef(coefx,coefy, noanim, ignore){
    if(this.mouseBlocked && !ignore) return;
    if(noanim){
      dur = 0;
      TweenMax.set(this.bones.bonesByName.Bone_neck_01.rotation, {y : 0.39-(this.coefy*0.1)});
      TweenMax.set(this.bones.bonesByName.Bone_neck_02.position, {x : 1.53-(this.coefy*0.1)});
      TweenMax.set(this.bones.bonesByName.Bone_spine_03.rotation, {z : (-this.coefx*0.1)});
      TweenMax.set(this.bones.bonesByName.Bone_spine_02.rotation, {z : (-this.coefx*0.1)});
      TweenMax.set(this.bones.bonesByName.Bone_spine_01.rotation, {z : (-this.coefx*0.1)});
      TweenMax.set(this.bones.bonesByName.CTRL_pelvis.rotation, {z : (-this.coefx*0.05), z : -coefx*0.05, overwrite:false});
      TweenMax.set(this.bones.bonesByName.Bone_HEAD.rotation, {x : Math.PI+(this.coefx*0.8), y : -1.4602+(this.coefy*0.2)});
    }

    this.coefx = coefx;
    this.coefy = coefy;

    if(Math.max(coefx, coefy)>.07){
      this.mousemovementTimer = this.mousemovementTimerMaxFrames;
    }


    if(this.lookingDirection == "left")
    coefx += 0.4;
    else
    coefx += 0.1;

    coefy += 0.3;

    var dur = (noanim ? 0 : 0.2);
    dur = 0.2;
    TweenMax.to(this.bones.bonesByName.Bone_neck_01.rotation, {y : 0.39-(coefy*0.1)});
    TweenMax.to(this.bones.bonesByName.Bone_neck_02.position, dur, {x : 1.53-(coefy*0.1)});
    TweenMax.to(this.bones.bonesByName.Bone_spine_03.rotation, dur*2, {z : (-coefx*0.1)});
    TweenMax.to(this.bones.bonesByName.Bone_spine_02.rotation, dur*2, {z : (-coefx*0.1)});
    TweenMax.to(this.bones.bonesByName.Bone_spine_01.rotation, dur*2, {z : (-coefx*0.1)});
    TweenMax.to(this.bones.bonesByName.CTRL_pelvis.rotation, dur*2, {z : (-coefx*0.05), z : -coefx*0.05, overwrite:false});
    TweenMax.to(this.bones.bonesByName.Bone_HEAD.rotation, dur, {x : Math.PI+(coefx*0.8), y : -1.4602+(coefy*0.2)});
    // TweenMax.to(this.bones.bonesByName.Bone_HEAD.position, dur, {x : Math.PI+(coefx*0.8), y : -1.4602+(coefy*0.2)});
  }

  checkRotation(dir){
    if(this.mouseBlocked) return;

    if(dir != this.lookingDirection){
      this.mouseBlocked = true;
      // TweenMax.killTweensOf(this.bones.bonesByName.CTRL_pelvis.rotation);
      // TweenMax.killTweensOf(this.bones.bonesByName.CTRL_pelvis.position);
      // TweenMax.killTweensOf(this.bones.bonesByName.Bone_C_Tail_01.rotation);
      // TweenMax.killTweensOf(this.bones.bonesByName.Bone_R_Tail_01.rotation);
      // TweenMax.killTweensOf(this.bones.bonesByName.Bone_L_Tail_01.rotation);
      // TweenMax.killTweensOf(this.bones.bonesByName.Bone_neck_01.rotation);
      // TweenMax.killTweensOf(this.bones.bonesByName.Bone_neck_02.rotation);


    }
  }

  endRotate() {
    this.mouseBlocked = false;
    this.shakeTail();
    this.moveNeck();
  }


  getBirdMouseOverPosX(mouseX, mouseY){


    var mouseYPositionToLegs = .10;
    var mouseYPositionToHead = .15;
    var deslocX = 0;

    if(mouseY<-mouseYPositionToLegs){
      deslocX = (this.pointLight.position.y+mouseYPositionToLegs)*12;
    }else if(mouseY>mouseYPositionToHead){
      deslocX = (this.pointLight.position.y-mouseYPositionToHead)*18;
    }

    return 2.2+(18.0*mouseX)+deslocX;
  }


  updateShaders(){

    //aqui eu atualizo os valores do shader de wireframe animado
    var elapsedMilliseconds = Date.now() - this.startTime;
    var elapsedSeconds = elapsedMilliseconds/1000;


    //seto os valores das uniformes de tempo
    var sinToSet = (Math.abs(Math.sin(elapsedSeconds))*.8)+.2;
    var sinToSet2 = (Math.abs(Math.sin(elapsedSeconds*2.0))*.8)+.2;
    var sinToSet3 = (Math.abs(Math.sin(elapsedSeconds*5.0)));
    this.animatedWireframe.uniforms.timeLowFrequency.value = sinToSet;
    this.animatedWireframe.uniforms.timeLowFrequency.needsUpdate = true;
    this.animatedWireframe.uniforms.timeMidFrequency.value = sinToSet2;
    this.animatedWireframe.uniforms.timeMidFrequency.needsUpdate = true;
    this.animatedWireframe.uniforms.timeHighFrequency.value = sinToSet3;
    this.animatedWireframe.uniforms.timeHighFrequency.needsUpdate = true;
    this.animatedWireframe.uniforms.currentTimeValue.value = elapsedSeconds*1.0;
    this.animatedWireframe.uniforms.currentTimeValue.needsUpdate = true;

    //o needsUpdate = true é uma coisa da propria ThreeJS, precisa aplicar para cada valor sempre


    //aqui eu coloco um valor de teste automatico para a posicao do mouse perto do passaro
    //na versao valendo precisa ver como pegar a posicao do mouse em transformar em valor válido que
    //funcione com o shader nos intervalos de valoe esperados
    var sinToLightPos = Math.sin(elapsedSeconds*.5);
    var sinToLightPosFaster = Math.sin(elapsedSeconds*1.0);


    //coloca o valor de multiplicador de tempo
    this.animatedWireframe.uniforms.dimmEffect.value = 0.5;
    this.animatedWireframe.uniforms.dimmEffect.needsUpdate = true;
    if(this.mousemovementTimer<this.mousemovementTimerEffectStartFrames){
      this.animatedWireframe.uniforms.dimmEffect.value = (this.mousemovementTimer/this.mousemovementTimerEffectStartFrames)*.5;
      this.animatedWireframe.uniforms.dimmEffect.needsUpdate = true;
    }

    this.mousemovementTimer--;

    if(this.mousemovementTimer<0){
      this.mousemovementTimer = 0;
    }


    //this.animatedWireframe.uniforms.lightPosition.value.x = 0.7+(0.3*sinToLightPos);
    //this.animatedWireframe.uniforms.lightPosition.value.y = 3.8+(3.0*(sinToLightPos));

    // this.animatedWireframe.uniforms.lightPosition.value.x = 0.7+(1.0*this.pointLight.position.x);
    // this.animatedWireframe.uniforms.lightPosition.value.y = 3.8+(1.0*(this.pointLight.position.y));
    // this.animatedWireframe.uniforms.lightPosition.value.z = 3.0+(5.0*sinToLightPos);

    this.animatedWireframe.uniforms.lightPosition.value.x = 0.0+(0.3);
    this.animatedWireframe.uniforms.lightPosition.value.y = this.getBirdMouseOverPosX(this.pointLight.position.x, this.pointLight.position.y);
    this.animatedWireframe.uniforms.lightPosition.value.z = 5.0+(15.0*this.pointLight.position.y);
    this.animatedWireframe.uniforms.lightPosition.needsUpdate = true;


    //console.log("point lD: " , this.pointLightDirectional.position);
    //console.log("point l: " + this.pointLight.position.x);

  } 

}