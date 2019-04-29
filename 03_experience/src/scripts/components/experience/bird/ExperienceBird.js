import * as THREE from 'three';
import JDLoader from '../../environment3d/environment/loaders/JDLoader';
import ContentLoader from '../../../loaders/ContentLoader';


export default class ExperienceBird extends THREE.Object3D {
  constructor (hdMat) {
    super();
    JDLoader(THREE);
    this.INI_ROT_Y = (180*Math.PI)/180;
    this.huiaMaterial = hdMat;
    this.loader = new THREE.JDLoader();
    var self = this;
    this.parseModel(this.loader.parse(ContentLoader.DATA_HUIA_LOW_POLY));
  }

  startGlide () {
    if(this.mixerBlocked) return;
    this.mixerBlocked = true;
    this.mixer.update(0.32 - this.mixer.time);
  }

  stopGlide () {
    if(!this.mixerBlocked) return;
    this.mixerBlocked = false;
    // this.planeVortice2.visible = this.planeVortice1.visible = false;
  }

  updateMixer(delta){
    if(this.mixer && !this.mixerBlocked){
      this.mixer.update(delta);
    }
  }

  parseModel(data){
    var skeleton;
    if(!this.huiaMaterial){
      this.huiaMaterial = new THREE.MeshLambertMaterial({
        map : ContentLoader.DATA_EXPERIENCE_TEXTURES["huia-low-diffuse"],
        // alphaMap : ContentLoader.DATA_HUIA_3D_TEXTURES["huia-low-diffuse"],
        // normalMap : ContentLoader.DATA_HUIA_3D_TEXTURES["huia-low-roughness"],
        // specular : new THREE.Color(0x101114),
        skinning : true,
        // side : THREE.DoubleSide,
        // wireframe : true,
        transparent : true,
        side : THREE.DoubleSide,
        shading : THREE.SmoothShading
      });
    }

    this.container = new THREE.Object3D();
    this.container.frustumCulled = false;
    this.frustumCulled = false;
    this.add(this.container);

    this.rotation.y = this.INI_ROT_Y;
    for (var i = 0; i < data.geometries.length; i++)
    {
        var mesh = new THREE.SkinnedMesh(data.geometries[i]);
        mesh.frustumCulled = false;
        var skeleton;

        if(i == 0)
        {
          skeleton = mesh.skeleton;
        }else{
          mesh.skeleton = skeleton;
        }

        if(!window.MOBILE_DETECT.mobile())
          mesh.castShadow = true;

        this.container.add(mesh);
        mesh.material = this.huiaMaterial;

        if(i == 0){
            var mixer = new THREE.AnimationMixer(mesh);
            this.mixer = mixer;
            // this.mixer.addEventListener('finished', this.onFinishedAnimation.bind(this));
            this.animations = [];
            for(var q = 0; q < mesh.geometry.animations.length; q++){
              var anim = mixer.clipAction(mesh.geometry.animations[q]);
              anim.setDuration(1);
              this.animations.push(anim);
              anim.play();
            }
        }
    }
  }
}
