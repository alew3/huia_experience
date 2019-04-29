import * as THREE from 'three';

export default class Trees extends THREE.Object3D {

  constructor (island) {
    super();
    this.island = island;

    this.leafsMaterial = new THREE.MeshLambertMaterial({
      map : ContentLoader.DATA_EXPERIENCE_TEXTURES["tree-leaf-diffuse"],
      shading : THREE.SmoothShading,
      transparent : true,
      alphaTest : 0.5,
      side : THREE.DoubleSide
    });

    this.coconutMaterial = new THREE.MeshLambertMaterial({
      map : ContentLoader.DATA_EXPERIENCE_TEXTURES["coconuttree-diffuse"],
      shading : THREE.SmoothShading,
      transparent : true,
      side : THREE.DoubleSide,
      alphaTest : 0.5,
    });


    this.baseCoconutTree = new THREE.Object3D();
    this.basePlane1 = new THREE.Mesh(new THREE.PlaneBufferGeometry(1,1.8,1,1), this.coconutMaterial);
    this.basePlane2 = new THREE.Mesh(new THREE.PlaneBufferGeometry(1,1.8,1,1), this.coconutMaterial);
    this.basePlane2.rotation.y = -90 * Math.PI/180;
    this.basePlane2.position.y = this.basePlane1.position.y = 0.9;
    this.baseCoconutTree.add(this.basePlane2);
    this.baseCoconutTree.add(this.basePlane1);
    this.baseCoconutTree.rotation.y = -45 * Math.PI/180;
    this.baseCoconutTree.scale.x = this.baseCoconutTree.scale.y = this.baseCoconutTree.scale.z = 1500;

    this.baseLeafs = new THREE.Object3D();
    this.baseLeafs1 = new THREE.Mesh(new THREE.PlaneBufferGeometry(1,1.8,1,1), this.leafsMaterial);
    this.baseLeafs2 = new THREE.Mesh(new THREE.PlaneBufferGeometry(1,1.8,1,1), this.leafsMaterial);
    this.baseLeafs2.rotation.y = -90 * Math.PI/180;
    this.baseLeafs2.position.y = this.basePlane1.position.y = 0.9;
    this.baseLeafs.add(this.baseLeafs2);
    this.baseLeafs.add(this.baseLeafs1);
    this.baseLeafs.rotation.y = -45 * Math.PI/180;
    this.baseLeafs.scale.x = this.baseLeafs.scale.y = this.baseLeafs.scale.z = 500;



    // first, distribute at the beaches..
    for(var i = 0; i < 30; i++){
      var coconutTree = this.baseCoconutTree.clone();
      coconutTree.position.x = -30000;
      coconutTree.position.z = 30000 - i * 700;
      coconutTree.position.x += -2000 + Math.random()*4000;
      coconutTree.position.z += -500 + Math.random()*1000;
      coconutTree.rotation.x = -0.2 + Math.random()*0.4;
      coconutTree.rotation.y = -0.2 + Math.random()*0.4;
      coconutTree.rotation.z = -0.2 + Math.random()*0.4;
      coconutTree.scale.multiplyScalar(0.5 + (Math.random()*1));

      coconutTree.position.y = this.island.getRaycastPosition(coconutTree.position, coconutTree.position.clone())*10;
      this.add(coconutTree);
    }

    for(var i = 0; i < 5; i++){
      var coconutTree = this.baseCoconutTree.clone();
      coconutTree.position.x = -20000;
      coconutTree.position.z = 59000;
      coconutTree.position.x += -500 + Math.random()*1000;
      coconutTree.position.z += -500 + Math.random()*1000;
      coconutTree.rotation.x = -0.2 + Math.random()*0.4;
      coconutTree.rotation.y = -0.2 + Math.random()*0.4;
      coconutTree.rotation.z = -0.2 + Math.random()*0.4;
      coconutTree.scale.multiplyScalar(0.5 + (Math.random()*1));

      coconutTree.position.y = this.island.getRaycastPosition(coconutTree.position, coconutTree.position.clone())*10;
      this.add(coconutTree);
    }

    // for(var i = 0; i < 500; i++){
    //   var coconutTree = this.baseLeafs.clone();
    //   coconutTree.position.x = -30000 + Math.random()*60000;
    //   coconutTree.position.z = -20000 + Math.random()*40000;
    //   coconutTree.scale.multiplyScalar(0.5 + (Math.random()*1));
    //   coconutTree.rotation.x = -0.2 + Math.random()*0.4;
    //   coconutTree.rotation.y = -0.2 + Math.random()*0.4;
    //   coconutTree.rotation.z = -0.2 + Math.random()*0.4;
    //   coconutTree.position.y = this.island.getRaycastPosition(coconutTree.position, coconutTree.position.clone())*25;
    //   this.add(coconutTree);
    // }

  }
}
