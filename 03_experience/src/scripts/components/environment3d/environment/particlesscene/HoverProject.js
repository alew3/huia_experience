  import * as THREE from 'three';


export default class HoverProject extends THREE.Mesh {
  constructor (camera){
    super();

    this.lateBuild = this.lateBuild.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }



  lateBuild(camera){
    this.camera = camera;
    this.geometry = new THREE.PlaneBufferGeometry(1,1,3);
    this.material = new THREE.MeshBasicMaterial({color : new THREE.Color(0x000000)});
    this.material.transparent = true;
    this.updateDimensions();
  }


  show(background, color){
    this.updateDimensions();
    var f = false;
    if(background)
    {
      this.material.color = new THREE.Color(0x202020);
      var self = this;

      if(background.filename.indexOf(".mp4") == -1){
        this.imageProject = new THREE.TextureLoader();
        this.imageProject.setCrossOrigin("anonymous");
        f = true;
        this.imageProject.load( window.API_URL.replace("api/","") + 'upload/' + background.filename,
        function(texture){
          texture.generateMipmaps = false;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.format = THREE.RGBFormat;
          texture.needsUpdate = true;
          self.material.map = texture;
          self.material.needsUpdate = true;
          }
        );
      }else{
        this.video = document.createElement('video');
        this.video.volume = 0;
        this.video.loop = true;
        f = true;
        // document.body.appendChild(video);
        this.video.src = window.API_URL.replace("api/","") + 'upload/' + background.filename;
        this.video.crossOrigin = '';
        this.video.load();

        if (this.video.paused){
          this.video.play();
        }


        var texture = new THREE.VideoTexture( this.video );
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;
        this.material.map = texture;
        this.material.needsUpdate = true;
      }
      // this.planeDetailProject.material.map = this.imageProject;

    }else{
      this.material.color = new THREE.Color(0x404040);
      this.material.map = null;
      this.material.needsUpdate = true;
      f = false;
    }

    TweenMax.killTweensOf(this.material);
    TweenMax.fromTo(this.material, 1, {opacity : 0}, {opacity:f ? 1 : 0, ease : Linear.easeNone});
  }


  hide(){
    if(this.video){
      this.video.pause();
      delete this.video;
      this.video = null;
    }

    TweenMax.killTweensOf(this.material);
    TweenMax.to(this.material, 0.5, {opacity : 0});
  }

  updateDimensions (){
    var vector = new THREE.Vector3();
    vector.set(1,-1,0.5);
    vector.unproject( this.camera );
    var dir = vector.sub( this.camera.position ).normalize();
    var distance = - (this.camera.position.z+5) / dir.z;
    var pos = this.camera.position.clone().add( dir.multiplyScalar( distance ) );
    this.scale.set(Math.abs(pos.y*1.77*2), Math.abs(pos.y*2),1);
    this.position.z = -3;
  }
}
