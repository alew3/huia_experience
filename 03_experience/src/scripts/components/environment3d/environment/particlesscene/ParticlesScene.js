import * as THREE from 'three';
import GPUParticleSystem from './particlesystem/GPUParticleSystem.js';
import HoverProject from './HoverProject';


export default class ParticlesScene extends THREE.Scene {

  get camera () {
    return this._camera;
  }

  set camera(camera) {
    this._camera = camera;
  }

  constructor () {
    super ();
    GPUParticleSystem(THREE);


    this.particleSystem = new THREE.GPUParticleSystem({
      maxParticles: 25000,
      tex : "particle2.png"
    });

    this._camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this._camera.position.z = 20;

    // if(window.MOBILE_DETECT.mobile())
    //   this.background = new THREE.Color(0xff0000);

    this.hoverProject = new HoverProject();
    this.add(this.hoverProject);
    this.hoverProject.visible = false;
    this.hoverProject.lateBuild(this._camera);

    this.add(this.particleSystem);


    this.particlesOptions = {
			positionRandomness: 50,
			velocityRandomness: 0,
			color: 0xffffff,
			colorRandomness: 0,
      velocityRandomness:0.2,
      velocity : new THREE.Vector3(0.005,-0.015,0),
      position : new THREE.Vector3(0,0,1),
			turbulence: 0,
			lifetime: 100,
      tex : "particle4.png",
      blending : THREE.NormalBlending,
			size: 7*(2/window.devicePixelRatio),
			sizeRandomness: 1
		};

    this.particlesOptions2 = {
			positionRandomness: 100,
			velocityRandomness: 0,
			color: 0xffffff,
			colorRandomness: 0,
      velocityRandomness:0.01,
      velocity : new THREE.Vector3(0.2,-0.03,0),
      position : new THREE.Vector3(0,0,10),
			turbulence: 0,
			lifetime: 100,
      tex : "particle3.png",
			size: 2*(2/window.devicePixelRatio),
			sizeRandomness: 1
		};



    this.update = this._updateSystem.bind(this);
    this.emmitParticles = this.emmitParticles.bind(this);
    this.showBackgroundProject = this.showBackgroundProject.bind(this);
    this.hideBackgroundProject = this.hideBackgroundProject.bind(this);
    this.setSize = this.setSize.bind(this);



    // this.emmitLoopParticles();
  }

  setSize(w,h){
    this._camera.aspect = w/h;
    this._camera.updateProjectionMatrix();
  }

  emmitLoopParticles() {
    this.emmitParticles(this.particlesOptions, 15);
    // this.emmitParticles(this.particlesOptions2, 10);
    TweenMax.to(this, 1, {onComplete:this.emmitLoopParticles, onCompleteScope : this});
  }

  emmitParticles(options,quantity){
    if(!options.velocity){
      options.velocity = new THREE.Vector3();
    }

    if(!options.position){
      var vector = new THREE.Vector3();
      vector.set(
      ( options.position2d.x / window.innerWidth ) * 2 - 1,
      - ( options.position2d.y / window.innerHeight ) * 2 + 1,
      0.5 );
      vector.unproject( this._camera );
      var dir = vector.sub( this._camera.position ).normalize();
      var distance = - this._camera.position.z / dir.z;
      var pos = this._camera.position.clone().add( dir.multiplyScalar( distance ) );
      options.position = pos;
    }

    quantity = quantity || 100;

    for(var i = 0; i < quantity; i++)
      this.particleSystem.spawnParticle(options);
  }



  showBackgroundProject(background,color){
    this.hoverProject.visible = true;
    this.hoverProject.show(background,color);
  }



  hideBackgroundProject () {
    this.hoverProject.hide();
  }

  _updateSystem(tick){
    this.particleSystem.update(tick);
  }
}
