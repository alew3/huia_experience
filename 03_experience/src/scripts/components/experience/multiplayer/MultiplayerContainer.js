import * as THREE from 'three';
import ExperienceBird from '../bird/ExperienceBird';
import THREEEnvironmentHelper from "../../../helpers/THREEEnvironmentHelper";


export default class MultiplayerContainer extends THREE.Object3D {
  constructor (connectionId, scene, birdBase, namesContainer) {
    super ();
    this.connectionId = connectionId;
    this.birdBase = birdBase;
    this.birds = {};
    this.birdNames = {};
    this.namesContainer = namesContainer;
    this.materialBird = birdBase.huiaMaterial;
    // this.materialBird = new THREE.MeshBasicMaterial({color : 0xff0000, skinned : true});
  }


  updateMixers (delta) {
    for(var s in this.birds){
      if(this.birds[s] && s != this.connectionId){
        this.birds[s].children[0].updateMixer(delta);
      }
    }
  }

  addBird(userData){
    if(userData.id == this.connectionId)
      return;

    var container = new THREE.Object3D();
    var bird = new ExperienceBird(this.materialBird);
    container.add(bird);
    this.add(container);

    bird.position.x = bird.position.y = bird.position.z = 0;
    bird.scale.x = bird.scale.y = bird.scale.z = (0.8 * 10);

    this.birds[userData.id] = container;
    console.log("add bird! " + userData.id);
    this.createBirdName(userData);
  }

  createBirdName(data){
    var container = document.createElement('div');
    container.classList.add('experience-user-name');
    var elName = document.createElement('h2');
    elName.innerText = data.userName;
    container.appendChild(elName);

    if(data.userCountry){
      var flag = document.createElement("img");
      flag.src = "/static/images/flags-iso-3166/"+data.userCountry.toLowerCase()+".svg";
      container.append(flag);
    }

    // if(data.userCity){
      var elCity = document.createElement("h3");
      elCity.innerText = (data.userCity) ? data.userCity : "----";
      container.appendChild(elCity);
    // }

    var distanceElement = document.createElement("span");
    distanceElement.innerText = "--mi";
    container.appendChild(distanceElement);

    this.namesContainer.appendChild(container);
    this.birdNames[data.id] = container;
    // var pos = THREEEnvironmentHelper.toScreenPosition(this.bird, this.camera, this.renderer);
    // pos.x *= this.divider;
    // pos.y *= this.divider;
    // pos.x /= window.devicePixelRatio;
    // pos.y /= window.devicePixelRatio;
    // TweenMax.set(this.userName, {x : pos.x, y : pos.y});
  }


  removeBird(id){
    this.remove(this.birds[id]);
    this.namesContainer.removeChild(this.birdNames[id]);

    //this.birds.splice(id, 1);
    delete this.birds[id];
    delete this.birdNames[id];
    console.log("removed bird! " + id);
  }


  updateBirdTransform(bird, bposition, brotation, name){
      bird.visible = true;

      if(bposition == undefined || bird.position == undefined ) return;

      var distance = THREEEnvironmentHelper.getDistance(bposition, bird.position);
      TweenMax.to(bird.position, distance/1500, {x : bposition.x, y : bposition.y, z : bposition.z, ease : Linear.easeNone});
      TweenMax.to(bird.rotation, 0.3, {x : brotation.x, y : brotation.y + (180 * Math.PI/180), z : brotation.z, ease : Linear.easeNone});

      var num = distance;
      // name.getElementsByTagName("span")[0].innerText = (num/1000).toFixed(2).toString() + "mi";
      var pos = THREEEnvironmentHelper.toScreenPosition(bird, window.experience.camera, window.experience.renderer);
      pos.x *= window.experience.divider;
      pos.y *= window.experience.divider;
      pos.x /= window.devicePixelRatio;
      pos.y /= window.devicePixelRatio;
      pos.x = pos.x;
      pos.y = pos.y - 30;
      pos.x = Math.max(pos.x, 0);
      pos.y = Math.max(pos.y, 0);
      pos.x = Math.min(pos.x, window.innerWidth-name.getBoundingClientRect().width-50);
      pos.y = Math.min(pos.y, window.innerHeight-name.getBoundingClientRect().height-50);

      if(!window.experience.frustum.containsPoint(bposition)){
        if(pos.x < window.innerWidth/2){
          pos.x = 0;
        }else{
          pos.x = window.innerWidth-name.getBoundingClientRect().width-50;
        }
      }

      TweenMax.to(name, 1,{x : pos.x, y : pos.y, scaleX : 0.8, scaleY : 0.8, ease : Quint.easeOut});



      var distanceBetweenBirds = THREEEnvironmentHelper.getDistance(bposition, this.birdBase.parent.position);
      if(isNaN(distanceBetweenBirds)){
        name.getElementsByTagName("span")[0].innerText = "";
        TweenMax.set(name, {scaleX : 0.5, scaleY : 0.5, opacity : 0.5});
      }else{
        name.getElementsByTagName("span")[0].innerText = (distanceBetweenBirds/50000).toFixed(2).toString() + "mi";
        var scale = 1-((distanceBetweenBirds / 50000) * 0.5);
        scale = Math.min(1,scale);
        scale = Math.max(0.5,scale);
        var op = scale;
        TweenMax.to(name, 0.3, {scaleX : scale, scaleY : scale, opacity : op, ease : Quint.easeOut, overwrite:false});
        // TweenMax.to(name.getElementsByTagName("span")[0], 0.3, {scaleX : 2-scale, scaleY : 2-scale, transformOrigin:"0% 0%", ease : Quint.easeOut});
      }
  }


  updateBirds (arrData) {
    for(var i = 0; i < arrData.length; i++){
      var id = arrData[i].userData.id;
      if(id == this.connectionId)
        continue;

      if(this.birds[id] == null || this.birds[id] == undefined){
        this.addBird(arrData[i].userData);
      }

      this.updateBirdTransform(this.birds[id], arrData[i].position, arrData[i].rotation, this.birdNames[id]);
    }
    // console.log(" update birds : ");
  }
}
