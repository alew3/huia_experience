import * as THREE from 'three';
import JDLoader from "../loaders/JDLoader";
import ContentHelper from '../../../../loaders/ContentLoader';

export default class Feathers extends THREE.Object3D {

  constructor(){
    super();
    JDLoader(THREE);

    this.featherMaterial = new THREE.MeshPhongMaterial({
      map : ContentLoader.DATA_HUIA_3D_TEXTURES["feather-diffuse"],
      normalMap : ContentLoader.DATA_HUIA_3D_TEXTURES["feather-normalmap"],
      alphaMap : ContentLoader.DATA_HUIA_3D_TEXTURES["feather-alphamap"],
      specularMap : ContentLoader.DATA_HUIA_3D_TEXTURES["feather-roughness"],
      bumpMap : ContentLoader.DATA_HUIA_3D_TEXTURES["feather-roughness"],
      specular : new THREE.Color(0x101114),
      side : THREE.DoubleSide,
      transparent : true,
      // opacity : 0.5,
      shading : THREE.SmoothShading
    });


    this.loader = new THREE.JDLoader();
    var data = this.loader.parse(ContentLoader.DATA_MODEL_FEATHER);
    data.geometries[1].applyMatrix( new THREE.Matrix4().makeTranslation( 10, -6, 4 ) );
    this.baseMesh = new THREE.Mesh(data.geometries[1], this.featherMaterial);
    this.baseMesh.scale.x = this.baseMesh.scale.y = this.baseMesh.scale.z = 0.3;
    var container = new THREE.Object3D();
    // this.add(container);
    container.add(this.baseMesh);
    this.container = container;


    this.container.position.x = -5;
    this.container.position.y = 4;

    for(var i = 0; i < 3; i++){
      var el = this.container.clone();
      el.rotation.z = (Math.random()*360)*Math.PI/180;
      el.rotation.x = -90*Math.PI/180;
      el.position.x = -5 - (i%3)*5;
      // el.position.y = 2 + (Math.floor(i/3) * 7);
      el.position.y = 0;
      // el.position.z += -8;
      // el.position.z = -4 + (Math.floor(i/2) * 8);
      el.position.x += -1 + Math.random()*2;
      // el.position.y += -1 + Math.random()*2;
      this.add(el);
    }
  }

}
