import * as THREE from 'three';



export default class Lines extends THREE.Object3D {


  constructor () {
    super();

    this.basicMaterial = new THREE.LineBasicMaterial({color: 0xffffff, linewidth:3});
    this.basicMaterial.opacity = 0.15;
    this.basicMaterial.transparent = true;
    this.basicGeometry = new THREE.Geometry();
    this.basicGeometry.vertices.push(new THREE.Vector3( 0, 0, 0 ),new THREE.Vector3( 10, 0, 0 ));
    this.lines = [];

    TweenMax.to(this, 3, {onComplete:this.createLine, onCompleteScope:this});
    this.createLine();
  }


  createLine(){
    TweenMax.to(this, 3, {onComplete:this.createLine, onCompleteScope:this});

    if(this.lines.length == 3)
      return;

    var lineContainer = new THREE.Object3D();
    var line = new THREE.Line(this.basicGeometry, this.basicMaterial);
    lineContainer.add(line);
    this.add(lineContainer);
    this.lines.push(lineContainer);
    line.scale.x = 0;
    line.position.x = -30;

    lineContainer.rotation.z = -30 + Math.random()*60;
    lineContainer.position.z = Math.random()*-10;
    var lifeTime = 8 + Math.random()*5;
    TweenMax.to(line.scale, lifeTime/3, {x : 1, ease : Quint.easeIn});
    TweenMax.to(line.position, lifeTime, {x : 10, ease : Linear.easeOut, overwrite:false, delay:lifeTime/3});
    TweenMax.to(line.position, lifeTime/3, {x : 30, ease : Quint.easeOut, overwrite:false, delay:(lifeTime/3)*2});
    TweenMax.to(line.scale, lifeTime/3, {x : 0, ease : Quint.easeOut, overwrite:false, delay:(lifeTime/3)*2, onComplete:this.destroyLine, onCompleteScope:this, onCompleteParams:[lineContainer]});
  }

  dispose () {
    TweenMax.killTweensOf(this);
    
    for(var i = this.lines.length-1; i >= 0; i--){
      this.destroyLine(this.lines[i]);
    }
  }

  destroyLine(el){
    TweenMax.killTweensOf(el.scale);
    TweenMax.killTweensOf(el.position);
    this.remove(el);
    this.lines.splice(this.lines.indexOf(el),1);
  }
}
