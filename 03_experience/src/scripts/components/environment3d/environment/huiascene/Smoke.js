import * as THREE from 'three';


export default class Smoke extends THREE.Object3D {
  constructor () {
    super ();

    this.material = new THREE.MeshBasicMaterial({
      map : ContentLoader.DATA_HUIA_3D_TEXTURES["smoke"],
      color : new THREE.Color(0xffffff),
      transparent : true,
      opacity : 0.1,
      shading : THREE.FlatShading
    });

    for(var i =0 ; i < 30; i++){
      var plane = new THREE.Mesh(new THREE.PlaneGeometry(20,20,1));

      plane.position.x = -40 + (Math.floor(i%5)*15);
      plane.position.x += (i%2)*6;
      plane.position.x += -2 + Math.random()*4;
      plane.position.z = -30 - (i%2)*10;
      plane.position.y = 2 + (i%2)*10;
      plane.position.y += Math.random()*8;
      plane.rotation.z = -90 * Math.PI/180;
      plane.position.z += -2 + Math.random()*4;

      plane.material = this.material;
      this.add(plane);

      var num = (Math.random() < .5) ? -Math.random()*8 : Math.random()*8;
      TweenMax.to(plane.position, 10, {x : plane.position.x + num, yoyo : true, repeat : -1});
      // TweenMax.to(plane.position, rand*3, {y : plane.position.y + ((Math.random()> 0.5) ?rand/3 : -rand/5), yoyo:true, ease : Linear.easeInOut, repeat : -1});
      // TweenMax.to(plane.rotation, rand*3, {z : plane.rotation.z + ((Math.random()> 0.5) ?rand/3 : -rand/3), yoyo:true, ease : Linear.easeNone, yoyo : true, repeat : -1});
      // TweenMax.to(plane.scale, rand*2, {x : 0, y : 0, z : 0, delay:rand*13, ease : Linear.easeNone, repeat : -1, repeatDelay : rand*13});
    }
  }
}
