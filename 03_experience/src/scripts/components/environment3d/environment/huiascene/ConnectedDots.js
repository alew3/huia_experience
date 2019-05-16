import * as THREE from 'three';

export default class ConnectedDots extends THREE.Object3D {
  constructor () {
    super();

    var distance = 1 + Math.random()*1;
    this.distance = distance;

    this.basicMaterial = new THREE.LineBasicMaterial({color: 0xffffff, linewidth:3});
    this.basicMaterial.opacity = 0.15;
    this.basicMaterial.transparent = true;
    this.basicGeometry = new THREE.Geometry();
    this.basicGeometry.vertices.push(new THREE.Vector3( 0, 0, 0 ),new THREE.Vector3( distance, 0, 0 ));

    this.bulletMaterial = new THREE.MeshBasicMaterial({map : ContentLoader.DATA_HUIA_3D_TEXTURES["particle2"]});
    this.bulletMaterial.opacity = 0.5;
    this.bulletMaterial.transparent = true;
    this.planeGeometry = new THREE.PlaneBufferGeometry(0.1,0.1,1);
    this.dot1 = new THREE.Mesh(this.planeGeometry, this.bulletMaterial);
    this.add(this.dot1);

    this.dot2 = new THREE.Mesh(this.planeGeometry, this.bulletMaterial);
    this.dot2.position.x = distance + 0.2;
    this.add(this.dot2);

    var line = new THREE.Line(this.basicGeometry, this.basicMaterial);
    this.line = line;
    this.add(line);

    this.rotation.z = (Math.random()*360) / Math.PI;
    // this.rotation.x = (Math.random()*360) / Math.PI;
    // this.position.z = 3;
    this.line.position.x = 0.2;
    // TweenMax.to(line.position, 2, {x : 2, ease : Quint.easeInOut, yoyo : true, repeat : 1});
    // TweenMax.to(line.scale, 1, {x : 0.05, ease : Quint.easeOut, delay : 1, overwrite:false});
    // TweenMax.to(line, 1, {x : 1, ease : Quint.easeIn});
    // TweenMax.to(this.basicGeometry.vertices[1], 1, {x : 2});
    this.dot2.visible = false;
    this.direction = 12;
  }

  dispose () {
    TweenMax.killTweensOf(this);
    TweenMax.killTweensOf(this.line.scale);
    TweenMax.killTweensOf(this.line.position);
    TweenMax.killTweensOf(this.dot1.scale);
    TweenMax.killTweensOf(this.dot2.scale);

    this.basicMaterial.dispose();
    this.basicMaterial = null;

    this.bulletMaterial.dispose();
    this.bulletMaterial = null;
  }


  iniAnimations () {
    var pos = this.position.y;
    TweenMax.to(this.position, 2, {y : pos - 0.2 + Math.random()*0.4, x : this.position.x - 0.3 + Math.random()*0.6, ease : Linear.easeNone, yoyo:true, repeat : -1});
    TweenMax.to(this.position, 1.5, {x : this.position.x - 0.2 + Math.random()*0.4, ease : Quint.easeInOut, yoyo:true, repeat : -1, overwrite:false});
    this.line.visible = false;
    this.animateLoop();
  }

  animateLoop () {
    this.line.visible = false;
    var rand = Math.random() * 8;
    if(this.direction == 12){
      TweenMax.fromTo(this.line.scale, this.distance/3, {x : 0.001}, {x : 1, ease : Quint.easeIn, delay : rand, onStart:this.showLine, onStartParams:[this.line, this.dot2]});
      TweenMax.fromTo(this.line.position, this.distance/3, {x : 0.2}, {x : this.distance, ease : Quint.easeOut, delay : rand+this.distance/2, onComplete:this.hideLine, onCompleteParams:[this.line, this.dot1]});
      TweenMax.fromTo(this.line.scale, this.distance/3, {x : 1}, {x : 0.001, ease : Quint.easeOut, delay : rand+this.distance/2});
      TweenMax.fromTo(this.dot1.scale, this.distance/4, {x : 1, y : 1, z : 1}, {x : 0.001, y : 0.001, z : 0.001, ease : Quint.easeIn, delay:rand+this.distance/4});
      TweenMax.fromTo(this.dot2.scale, this.distance/4, {x : 0.0001, y : 0.001, z : 0.001}, {x : 1, y : 1, z : 1, ease : Quint.easeOut, delay : rand+this.distance/3});

      this.direction = 21;
    }else{
      TweenMax.fromTo(this.line.scale, this.distance/3, {x : 0.001}, {x : 1, ease : Quint.easeIn, delay : rand, onStart:this.showLine, onStartParams:[this.line, this.dot1]});
      TweenMax.fromTo(this.line.position, this.distance/3, {x : this.distance}, {x : 0.2, ease : Quint.easeIn, delay : rand});
      TweenMax.fromTo(this.line.scale, this.distance/3, {x : 1}, {x : 0.001, ease : Quint.easeOut, delay : rand+this.distance/2, onComplete:this.hideLine, onCompleteParams:[this.line, this.dot2]});
      TweenMax.fromTo(this.dot2.scale, this.distance/4, {x : 1, y : 1, z : 1}, {x : 0.001, y : 0.001, z : 0.001, ease : Quint.easeIn, delay:rand+this.distance/4});
      TweenMax.fromTo(this.dot1.scale, this.distance/4, {x : 0.0001, y : 0.001, z : 0.001}, {x : 1, y : 1, z : 1, ease : Quint.easeOut, delay : rand+this.distance/3});
      this.direction = 12;
    }


    TweenMax.to(this, rand + this.distance + Math.random()*4, {onComplete:this.animateLoop.bind(this)});
  }

  showLine(line, dot){
    line.visible = true;
    dot.visible = true;
  }

  hideLine(line,dot){
    line.visible = false;
    dot.visible = false;
  }
}
