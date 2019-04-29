import * as THREE from 'three';
import JDLoader from '../../environment3d/environment/loaders/JDLoader';
import Sun from './Sun';
import ContentLoader from '../../../loaders/ContentLoader';
import Globals from '../../../core/Globals';
import ImageHelper from '../../../helpers/ImageHelper';
import WaterMaterial from './WaterMaterial';
//import Trees from "./trees";

export default class Island extends THREE.Object3D{
  constructor (scale) {
    super ();
    JDLoader(THREE);
    WaterMaterial(THREE);
    ImageHelper.setImageAltitude(ContentLoader.DATA_EXPERIENCE_TEXTURES.heightmap);

    this.modelScale = (scale/10);
    this.loader = new THREE.JDLoader();
    this.parseModel(this.loader.parse(ContentLoader.DATA_ISLAND));

    // if(!Globals.DEBUG){
    this.createSun();
    this.createSkybox();
    // }
    this.createTrees();
    this.createBoat();
  }


  createBoat() {
    var self = this;
    new THREE.ObjectLoader().parse(ContentLoader.DATA_BOAT, function(data){
      self.boat = data.children[0];
      self.boat.position.x = -70000;
      self.boat.position.z = 200000;
      self.boat.position.y = 600;
      self.boat.rotation.z = -45 * Math.PI/180;
      self.boat.rotation.y = 10 * Math.PI/180;
      self.boat.scale.multiplyScalar(5);
      self.add(self.boat);

      TweenMax.to(self.boat.position, 3, {y : 500, ease : Linear.easeNone, yoyo : true, repeat : -1});
      TweenMax.to(self.boat.rotation, 3, {x : self.boat.rotation.x-0.1, ease : Linear.easeNone, yoyo : true, repeat : -1});
      TweenMax.to(self.boat.rotation, 3.2, {y : self.boat.rotation.y+0.15, ease : Linear.easeNone, yoyo : true, repeat : -1});
      // TweenMax.to(self.boat.rotation, 1.4, {z : 0.3, ease : Linear.easeNone, yoyo : true, repeat : -1});
    });
  }

  createSkybox() {
    this.cubeTexture = new THREE.CubeTexture([]);
    this.cubeTexture.images.push(ContentLoader.DATA_EXPERIENCE_TEXTURES["sky1"]);
    this.cubeTexture.images.push(ContentLoader.DATA_EXPERIENCE_TEXTURES["sky2"]);
    this.cubeTexture.images.push(ContentLoader.DATA_EXPERIENCE_TEXTURES["sky3"]);
    this.cubeTexture.images.push(ContentLoader.DATA_EXPERIENCE_TEXTURES["sky4"]);
    this.cubeTexture.images.push(ContentLoader.DATA_EXPERIENCE_TEXTURES["sky5"]);
    this.cubeTexture.images.push(ContentLoader.DATA_EXPERIENCE_TEXTURES["sky6"]);
    this.cubeTexture.format = THREE.RGBFormat;
    this.cubeTexture.needsUpdate = true;
    this.cubeTexture.magFilter = THREE.LinearFilter;
    this.cubeTexture.minFilter = THREE.LinearFilter;
    this.cubeTexture.generateMipmaps = false;

    var aShader = THREE.ShaderLib['cube'];
    aShader.uniforms['tCube'].value = this.cubeTexture;

    var aSkyBoxMaterial = new THREE.ShaderMaterial({
      fragmentShader: aShader.fragmentShader,
      vertexShader: aShader.vertexShader,
      uniforms: aShader.uniforms,
      depthWrite: false,
      side: THREE.BackSide
    });

    var aSkybox = new THREE.Mesh(
      new THREE.BoxGeometry(1000000, 1000000, 1000000),
      aSkyBoxMaterial
    );

    this.add(aSkybox);
  }


  createTrees () {
    this.trees = new Trees(this);
    this.add(this.trees);
  }


  createSun() {
    this.sunLight = new THREE.DirectionalLight( 0xFDB813, 1 );
		// this.sunLight.color.setHSL( 0.1, 1, 0.95 );
		this.sunLight.position.set( 0, 0.5, 1 );
		this.sunLight.position.z = 50000;
    this.sunLight.position.y = 15000;
    this.sunLight.intensity = 1;
    this.sunLight.lookAt(new THREE.Vector3(0,0,0));
    // this.sunLight.castShadow = true;
    // this.sunLight.shadow.camera.right     =  500000;
    // this.sunLight.shadow.camera.left     = -500000;
    // this.sunLight.shadow.camera.top      =  500000;
    // this.sunLight.shadow.camera.bottom   = -500000;
    // // this.sunLight.shadowDarkness = 0.5;
    // this.castShadow = true;
    // this.receiveShadow = true;
    this.add(this.sunLight);

    window.sunLight = this.sunLight;
  }


  createLensFlare () {
    // return;

    // if(Globals.DEBUG) return;
    this.textureFlare0 = ContentLoader.DATA_EXPERIENCE_TEXTURES.lensflare0;
		this.textureFlare2 = ContentLoader.DATA_EXPERIENCE_TEXTURES.lensflare2;
		this.textureFlare3 = ContentLoader.DATA_EXPERIENCE_TEXTURES.lensflare3;

    // this.addLight( 0.55, 0.9, 0.5, 500000, 0, -100000 );
		this.addLight( 0.995, 0.8, 0.5,    0, 140000, 1000000 );
		// this.addLight( 0.995, 0.5, 0.9, 0, 500000, -100000 );
  }

  addLight( h, s, l, x, y, z ) {

		var light = new THREE.PointLight( 0xffffff, 1.5, 2000 );
		light.color.setHSL( h, s, l );
		light.position.set( x, y, z );
		this.add( light );

		var flareColor = new THREE.Color( 0xffffff );
		flareColor.setHSL( h, s, l + 0.5 );

		var lensFlare = new THREE.LensFlare( this.textureFlare0, 600, 0.0, THREE.AdditiveBlending, flareColor );
    //
		lensFlare.add( this.textureFlare2, 512, 0.0, THREE.AdditiveBlending );
		lensFlare.add( this.textureFlare2, 512, 0.0, THREE.AdditiveBlending );
		lensFlare.add( this.textureFlare2, 512, 0.0, THREE.AdditiveBlending );
    //
		lensFlare.add( this.textureFlare3, 60, 0.6, THREE.AdditiveBlending );
		lensFlare.add( this.textureFlare3, 70, 0.7, THREE.AdditiveBlending );
		lensFlare.add( this.textureFlare3, 120, 0.9, THREE.AdditiveBlending );
		lensFlare.add( this.textureFlare3, 70, 1.0, THREE.AdditiveBlending );
    //
		lensFlare.customUpdateCallback = this.lensFlareUpdateCallback;
		lensFlare.position.copy( light.position );
    //
		this.add( lensFlare );
	}

  getRaycastPosition(vector, direction){
    if(!this.raycaster)
      this.raycaster = new THREE.Raycaster();

    this.raycaster.set(vector, direction.normalize());
    var intersects = this.raycaster.intersectObject(this.islandMesh, false);
    var posy = 1800;
    if (intersects.length > 0) {
        var index = intersects[0].faceIndex;
        var pixel = ImageHelper.getPixelColor(intersects[0].uv.x,1-intersects[0].uv.y);
        return pixel;
    }else{
      return 0;
    }
  }

  lensFlareUpdateCallback( object ) {

		var f, fl = object.lensFlares.length;
		var flare;
		var vecX = -object.positionScreen.x * 2;
		var vecY = -object.positionScreen.y * 2;


		for( f = 0; f < fl; f++ ) {

			flare = object.lensFlares[ f ];

			flare.x = object.positionScreen.x + vecX * flare.distance;
			flare.y = object.positionScreen.y + vecY * flare.distance;

			flare.rotation = 0;

		}

		object.lensFlares[ 2 ].y += 0.025;
		object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad( 45 );

	}


  createWater(renderer, camera, scene){

    // Create the water effect
    // return;
    this.waterTexture = ContentLoader.DATA_EXPERIENCE_TEXTURES["water-normals"];
    this.waterTexture.wrapS = this.waterTexture.wrapT = THREE.RepeatWrapping;

    this.scene = scene;
    this.camera = camera;

		this.msWater = new THREE.Water(renderer, camera, scene, {
			textureWidth: 512,
			textureHeight: 512,
			waterNormals: this.waterTexture,
			alpha: 	0.90,
			sunDirection: this.sunLight.position.normalize(),
			sunColor: 0xffffff,
			waterColor: 0x2b3614,
			distortionScale: 300.0
		});

    this.msWater.material.transparent = true;
    window.msWater = this.msWater;
    this.meshMirror = new THREE.Mesh(new THREE.PlaneBufferGeometry(8000000, 8000000, 10, 10), this.msWater.material);
    // this.meshMirror = new THREE.Mesh(new THREE.PlaneBufferGeometry(90000, 90000, 700, 700), this.msWater.material);
    this.meshMirror.add(this.msWater);
		this.meshMirror.rotation.x = - Math.PI * 0.5;
    this.add(this.meshMirror);
    this.meshMirror.position.y = 550;
    // TweenMax.to(this.meshMirror.position, 3, {y : 680, ease : Linear.easeNone, yoyo : true, repeat : -1});


    this.add(this.msWater);

    // this.foamMaterial = new THREE.MeshBasicMaterial({map : ContentLoader.DATA_EXPERIENCE_TEXTURES["water-foam"], transparent:true, opacity : 0.3, alphaTest : 0.1});
    // this.foam = new THREE.Mesh(new THREE.PlaneBufferGeometry(60000, 60000, 10, 10), this.foamMaterial);
    // this.foam.position.x = 60000;
    // this.foam.rotation.x = - Math.PI * 0.5;
    // this.foam.position.y = 1100
    // this.add(this.foam);
    // window.foam = this.foam;
    // window.foamMaterial = this.foamMaterial;
    // this.foam.position.y = 560;
    // TweenMax.to(this.foam.position, 3, {y : 690, ease : Linear.easeNone, yoyo : true, repeat : -1});

  }

  update (delta) {
    if(!this.msWater) return;
    this.msWater.material.uniforms.time.value += 1.0 / 60.0;
    this.msWater.render();

    this.mapRiverAnimation.update(delta*15);
    this.specularMapAnimation.update(delta*15);
    this.normalMapAnimation.update(delta*15);
  }
  parseModel(data){
    this.container = new THREE.Object3D();
    this.add(this.container);

    this.castShadow = true;
    this.receiveShadow = true;
    this.container.castShadow = this.container.receiveShadow = true;

    this.islandMaterial = new THREE.MeshLambertMaterial({
      map : ContentLoader.DATA_EXPERIENCE_TEXTURES["island-diffuse"],
      // alphaMap : ContentLoader.DATA_EXPERIENCE_TEXTURES["island-alpha"],
      transparent : false,
      alphaTest : 0.5,
      side : THREE.DoubleSide,
      specularMap : ContentLoader.DATA_EXPERIENCE_TEXTURES["island-roughness"],
      // emissive : new THREE.Color(1,1,1),
      shading : THREE.SmoothShading,
      // emissiveIntensity : 0.01
    });

    this.riverMaterial = new THREE.MeshLambertMaterial({
      map : ContentLoader.DATA_EXPERIENCE_TEXTURES["river-diffuse"],
      specularMap : ContentLoader.DATA_EXPERIENCE_TEXTURES["river-specular"],
      normalMap : ContentLoader.DATA_EXPERIENCE_TEXTURES["river-normals"],
      emissive : new THREE.Color(0.95,0.95,0.95),
      opacity:0.8,
      alphaTest:0.5,
      transparent:true,
      emissiveIntensity : 0.1
    });

    this.mapRiverAnimation = new TextureAnimator(ContentLoader.DATA_EXPERIENCE_TEXTURES["river-diffuse"], 1,10,10,1);
    this.specularMapAnimation = new TextureAnimator(ContentLoader.DATA_EXPERIENCE_TEXTURES["river-specular"], 1,10,10,1);
    this.normalMapAnimation = new TextureAnimator(ContentLoader.DATA_EXPERIENCE_TEXTURES["river-normals"], 1,10,10,1);

    window.islandMaterial = this.islandMaterial;
    for(var i = 0 ; i < data.geometries.length; i++){
      if(data.geometries[i].name != "ocean"){
        var mesh = new THREE.Mesh(data.geometries[i]);
        this.container.add(mesh);

        if(data.geometries[i].name == "island"){
          mesh.material = this.islandMaterial;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          this.islandMesh = mesh;
          this.createPositionArray(data.geometries[i].attributes.position);
        }else if(data.geometries[i].name == "river"){
          mesh.material = this.riverMaterial;
        }

        mesh.castShadow = mesh.receiveShadow = true;
      }
    }

    this.container.scale.x = this.container.scale.y = this.container.scale.z = 17000;
    this.islandSize = new THREE.Box3().setFromObject( this.container );
    this.centerPoint = {};
    this.centerPoint.x = this.islandSize.min.x + ((this.islandSize.max.x - this.islandSize.min.x)/2);
    this.centerPoint.z = this.islandSize.min.z + ((this.islandSize.max.z - this.islandSize.min.z)/2);

    this.sizeHalf = {};
    this.sizeHalf.x = ((this.islandSize.max.x - this.islandSize.min.x)/2);
    this.sizeHalf.z = ((this.islandSize.max.z - this.islandSize.min.z)/2);
  }

  createPositionArray(attribute){
    this.arrPositions = [];
    for(var i = 0; i < attribute.count; i++){
      var posx = Math.round(attribute.array[i*3] * 17000);
      var posy = Math.round(attribute.array[(i*3)+1] * 17000);
      var posz = Math.round(attribute.array[(i*3)+2] * 17000);

      if(!this.arrPositions[posx]){
        this.arrPositions[posx] = [];
      }

      this.arrPositions[posx][posz] = posy;
    }
  }

}


class TextureAnimator
{
  constructor(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration){
  	// note: texture passed by reference, will be updated by the update function.

  	this.tilesHorizontal = tilesHoriz;
  	this.tilesVertical = tilesVert;
  	// how many images does this spritesheet contain?
  	//  usually equals tilesHoriz * tilesVert, but not necessarily,
  	//  if there at blank tiles at the bottom of the spritesheet.
  	this.numberOfTiles = numTiles;
  	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  	texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

  	// how long should each image be displayed?
  	this.tileDisplayDuration = tileDispDuration;

  	// how long has the current image been displayed?
  	this.currentDisplayTime = 0;

  	// which image is currently being displayed?
  	this.currentTile = 0;

  	this.update = function( milliSec )
  	{
  		this.currentDisplayTime += milliSec;
  		while (this.currentDisplayTime > this.tileDisplayDuration)
  		{
  			this.currentDisplayTime -= this.tileDisplayDuration;
  			this.currentTile++;
  			if (this.currentTile == this.numberOfTiles)
  				this.currentTile = 0;
  			var currentColumn = this.currentTile % this.tilesHorizontal;
  			texture.offset.x = currentColumn / this.tilesHorizontal;
  			var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
  			texture.offset.y = currentRow / this.tilesVertical;
  		}
  	};
  }
}
