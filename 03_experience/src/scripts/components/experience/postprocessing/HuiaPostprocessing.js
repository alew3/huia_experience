import * as THREE from 'three';
import CopyShader from './CopyShader';
import EffectComposer from './EffectComposer';
import ShaderPass from './ShaderPass';
import RenderPass from './RenderPass';
import MaskPass from './MaskPass';
import ClearPass from './ClearPass';
import HorizontalBlurShader from './gaussianblur/HorizontalBlurShader';
import VerticalBlurShader from './gaussianblur/VerticalBlurShader';
import BokehShader from "./BokehShader";
import ShaderExtras from "./ShaderExtrasTerrain";
// import StaticShader from './glitch/FilmShader';
import fxaa from 'three-shader-fxaa';


export default class HuiaPostprocessing {

  constructor(scene, renderer, camera, ignoreFlick){
    CopyShader(THREE);
    EffectComposer(THREE);
    ShaderPass(THREE);
    ClearPass(THREE);
    MaskPass(THREE);
    HorizontalBlurShader(THREE);
    VerticalBlurShader(THREE);
    ShaderExtras(THREE);

    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;

    this.createPostprocessing();
    this.ignoreFlick = ignoreFlick;
    this.renderPostprocessing = this.renderPostprocessing.bind(this);
    this.setSize = this.setSize.bind(this);
  }

  setSize(w,h){
    this.fxaaPass.uniforms.resolution.value.set(w/2,h/2);
    this.composer.setSize(w,h);
  }

  createPostprocessing() {
    this.composer = new THREE.EffectComposer( this.renderer );
    this.renderPass = new THREE.RenderPass( this.scene, this.camera ) ;

    // this.clearMaskPass = new THREE.ClearPass();
    // this.maskPass = new THREE.MaskPass(this.scene, this.camera);
    this.copyPass = new THREE.ShaderPass( THREE.CopyShader );
    this.horizontalPass = new THREE.ShaderPass( THREE.ShaderExtras[ "horizontalTiltShift" ] );
    this.verticalPass = new THREE.ShaderPass( THREE.ShaderExtras[ "verticalTiltShift" ] );
	  this.bleachBypass = new THREE.ShaderPass( THREE.ShaderExtras[ "bleachbypass" ] );
	  this.vignettePass = new THREE.ShaderPass( THREE.ShaderExtras[ "vignette" ] );
    this.fxaaPass = new THREE.ShaderPass(fxaa());
    this.fxaaPass.uniforms.resolution.value.set(window.innerWidth/2,window.innerHeight/2);


    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.verticalPass);
    this.composer.addPass(this.horizontalPass);
    this.composer.addPass(this.vignettePass);
    this.composer.addPass(this.bleachBypass);


    this.composer.addPass( this.fxaaPass );
		this.composer.addPass( this.copyPass );


    window.postprocessing = this;
    this.copyPass.renderToScreen = true;
    var bluriness = 4;
    this.horizontalPass.uniforms[ 'h' ].value = bluriness / window.innerWidth;
    this.verticalPass.uniforms[ 'v' ].value = bluriness / window.innerHeight;
    this.horizontalPass.uniforms[ 'r' ].value = this.verticalPass.uniforms[ 'r' ].value = 0.3;
    this.vignettePass.uniforms[ 'tDiffuse' ].value = 0.5;
    this.vignettePass.uniforms[ 'offset' ].value = 1.2;
    this.vignettePass.uniforms[ 'darkness' ].value = 1;
    this.bleachBypass.uniforms[ 'opacity' ].value = 0.3;
    // TweenMax.to(this, Math.random()*7, {onComplete:this.randomizeRGB, onCompleteScope:this});
    // TweenMax.to(this, Math.random()*7, {onComplete:this.randomizeBadTV, onCompleteScope:this, overwrite:false});
  }


  renderPostprocessing(tick){
    this.composer.render();
  }
}
