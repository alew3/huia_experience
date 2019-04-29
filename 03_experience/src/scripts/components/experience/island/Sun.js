import * as THREE from 'three';

export default class Sun extends THREE.Object3D {
  constructor () {
    super();

    this.sunLight = new THREE.DirectionalLight( 0xFDB813, 1 );
		// this.sunLight.color.setHSL( 0.1, 1, 0.95 );
		this.sunLight.position.set( 0, 0, 1 );
		this.sunLight.position.multiplyScalar( 50000 );
    this.sunLight.lookAt(new THREE.Vector3(0,0,0));
    this.castShadow = true;
    this.add(this.sunLight);

    this.sunPlane = new THREE.Mesh(new THREE.PlaneGeometry(100,100,1), new THREE.MeshBasicMaterial({color : 0xff0000}));
    this.sunPlane.position.z = 0;
    this.add(this.sunPlane);
  }
}
