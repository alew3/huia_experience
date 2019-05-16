import * as THREE from 'three';
import ContentLoader from "../../../../loaders/ContentLoader";
import ConnectedDots from './ConnectedDots';


export default class HUDElements extends THREE.Object3D{
  constructor () {
    super();
    this.elements = [];
    this.dottedPoints = [];
    this.circleMaterial = new THREE.MeshBasicMaterial({map : ContentLoader.DATA_HUIA_3D_TEXTURES["outline-circle"]});
    this.circleMaterial.transparent = true;

    this.arrowMaterial = new THREE.LineBasicMaterial({color : 0xffffff});
    this.arrowMaterial.opacity = 0.5;
    this.arrowMaterial.transparent = true;
    // this.lineMaterial.wireframe = true;
    // this.lineMaterial.transparent = true;
    this.arrowGeometry = new THREE.CircleGeometry(0.15,1);
    this.circleGeometry = new THREE.PlaneBufferGeometry(0.25,0.25,1);
    // this.circleGeometry.vertices.shift();


    for(var i = 0; i < 30; i++){
      var dot = new ConnectedDots();
      dot.position.x = -25 + (i%10)*5;
      dot.position.x -= 2.5;
      dot.position.x += Math.random()*5;
      dot.position.y = 1 + Math.floor(i/10) * 5;
      dot.position.y -= 0.5;
      dot.position.y += Math.random();
      this.add(dot);
      this.dottedPoints.push(dot);
      dot.iniAnimations();
    }

    this.spawnElement();
  }

  spawnElement () {

    var type = Math.random() * 10;
    var num = Math.random();

    if(num < 0.5)
      this.createCircle();
    else
      this.createArrow();
    // TweenMax.from(mesh.scale, 2, {x : 2, y : 2, z : 2, ease : Quint.easeOut, delay : 1, overwrite:false});
    // TweenMax.from(mesh.material, 2, {opacity:0, ease : Quint.easeOut, delay : 1, overwrite:false})

    TweenMax.to(this, Math.random(), {onComplete:this.spawnElement.bind(this)});
  }

  dispose () {
    TweenMax.killTweensOf(this);

    for(var i = 0; i < this.elements.length; i++){
      TweenMax.killTweensOf(this.elements[i]);
      TweenMax.killTweensOf(this.elements[i].scale);
      TweenMax.killTweensOf(this.elements[i].material);
      TweenMax.killTweensOf(this.elements[i].position);
      this.remove(this.elements[i]);
    }

    for(var i = 0; i < this.dottedPoints.length; i++){
      this.dottedPoints[i].dispose();
      this.remove(this.dottedPoints[i]);
    }

    this.dottedPoints = null;
    this.elements = null;
  }

  createCircle () {
    var mesh = new THREE.Mesh(this.circleGeometry, this.circleMaterial.clone());
    var py = -1.5 + Math.random()*7;
    mesh.material.opacity = 0.1 + Math.random()*0.4;
    mesh.position.x = -20 + Math.random()*40;
    mesh.position.y = py;
    mesh.position.z = Math.random()*-10;
    this.add(mesh);
    this.elements.push(mesh);
    TweenMax.from(mesh.scale, 1, {x : 0.1, y : 0.1, z : 0.1, ease : Quint.easeOut});
    TweenMax.to(mesh.scale, 1, {x : 1.5, y : 1.5, z : 1.5, ease : Quint.easeIn, delay : 1, overwrite:false});
    TweenMax.to(mesh.material, 1, {opacity : 0, overwrite:false, ease : Quint.easeIn, delay : 1, onComplete:this.removeElement.bind(this), onCompleteParams:[mesh]});
  }

  createArrow () {
    var mesh = new THREE.Mesh(this.arrowGeometry, this.arrowMaterial.clone());
    var angle = (Math.random()*180) * Math.PI/180;
    var posx = -20 + Math.random()*40;
    var posy = -1.5 + Math.random()*7;
    var posz = -5 + Math.random()*-10;
    mesh.material.opacity = 0.1 + Math.random()*0.3;
    mesh.position.x = posx;
    mesh.position.y = posy;
    mesh.position.z = posz;
    mesh.rotation.z = angle;
    this.add(mesh);
    this.elements.push(mesh);

    var num = 2+Math.random()*4;
    var finx = posx + Math.cos(angle)*num;
    var finy = posy + Math.sin(angle)*num;
    TweenMax.to(mesh.position, num, {bezier:[{x : posx + (((finx-posx)/2)*Math.random()),y : posy + ((finy-posy)/2)}, {x : finx, y : finy}], ease : Quint.easeInOut});
    TweenMax.from(mesh.scale, num/4, {x : 0.1, y : 0.1, z : 0.1, ease : Quint.easeOut});
    TweenMax.to(mesh.scale, num/8, {x : 0.1, y : 0.1, z : 0.1, ease : Quint.easeOut, delay : num/2, overwrite:false, onComplete:this.removeElement.bind(this), onCompleteParams:[mesh]});
  }

  removeElement(mesh){
    this.elements.splice(this.elements.indexOf(mesh),1);
    mesh.material.dispose();
    this.remove(mesh);
  }
}
