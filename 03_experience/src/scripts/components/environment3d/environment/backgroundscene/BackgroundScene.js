import * as THREE from 'three';
import ContentLoader from '../../../../loaders/ContentLoader'

export default class BackgroundScene extends THREE.Scene{
  constructor() {
    super();

    this.backgroundMaterial = new THREE.MeshPhongMaterial();
    this.backgroundMaterial.color = new THREE.Color(0x0a0a14);
    this.backgroundMaterial.opacity = 1;
    this.backgroundMaterial.transparent = false;


    this.backgroundMaterial = new THREE.MeshStandardMaterial({map : ContentLoader.DATA_HUIA_3D_TEXTURES.background, transparent : true});

    this.backgroundMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(45,40,1), this.backgroundMaterial);
    this.backgroundMesh.position.z = -20;
    this.backgroundMesh.layers.set(5);
    this.add(this.backgroundMesh);

    // this.backgroundPointLight = new THREE.SpotLight();
    // this.backgroundPointLight.color = new THREE.Color(0x191923);
    // this.backgroundPointLight.intensity = 4.5;
    // this.backgroundPointLight.position.z = 54;
    // this.backgroundPointLight.position.x = -5;
    // this.backgroundPointLight.position.y = 5;
    // this.backgroundPointLight.rotation.x = 90 * Math.PI/180;
    // this.backgroundPointLight.layers.set(5);
    // this.add(this.backgroundPointLight);

    this.backgroundAmbientLight = new THREE.AmbientLight();
    this.backgroundAmbientLight.intensity = 1.5;
    this.add(this.backgroundAmbientLight);

    this.backgroundMesh.frustumCulled = false;


    window.backgroundPointLight = this.backgroundPointLight;
    window.backgroundMesh = this.backgroundMesh;
    window.backgroundScene = this;
  }


  setPreloadingScene () {
    this.backgroundMesh.position.y = 38;
    this.backgroundMesh.scale.x = this.backgroundMesh.scale.y = this.backgroundMesh.scale.z = 0.56;

    this.backgroundMaterial.opacity  = 0;
    TweenMax.fromTo(this.backgroundMaterial, 2, {opacity : 0}, {opacity : 1, delay : 3});
  }
}
