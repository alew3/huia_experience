<template>
  <div id="app">
    <Preloader v-if="!preloaded && !isCrawler()" ref="preloader"></Preloader>
    <div class="app-container" v-if="preloaded">
      <div id="info" style='display:none'>
      </div>
      <div id="loading">
          Loading the model...
      </div>
      <div id='main' style='display:none'>
        <video id="video" playsinline style=" -moz-transform: scaleX(-1);
        -o-transform: scaleX(-1);
        -webkit-transform: scaleX(-1);
        transform: scaleX(-1);
        display: none;
        ">
      </video>
      </div>
      <canvas id="output"/>
      <div id="predictions"></div>
      <div id="icons" style="z-index:1000;"></div>
      <div id="layer">
        <select id="layers">
        </select>

        <div id="visualize">
        </div>
      </div>

      <div id="last_moves" style='position:relative;z-index:1000;border:1px solid white:float:right;color:white'></div>
      <Environment3d ref="environment3d" v-if="isDesktopEnvironment()"/>
      <!--<Environment3dMobile ref="environment3dmobile" v-if="isMobileEnvironment()"/>-->
      <IntroLogo v-on:endAnim="onEndIntroLogo" v-if="preloaded && !introCompleted"/>
      <router-view v-if="introCompleted"/>
     <!-- <div class="mobile-gradient" v-if="introCompleted && isMobile() && !experience"/>
      <div class="mobile-gradient-bottom" v-if="introCompleted && isMobile() && !experience"/> -->
      <!--<MainMenu v-if="introCompleted && !isMobile() && !experience"/>
      <MainMenuMobile v-if="introCompleted && isMobile() && !experience"/>-->
      <!--<SectionTitle v-if="introCompleted && !experience"/>-->
      <QualityAndSoundUI ref="qualitysound" v-if="introCompleted && !isMobile()" v-on:dragQualityChanged="onDragQualityChanged"/>
    </div>
    <div class="rotate-layer" v-if="isMobile()"><div class="gradient"></div><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><g><path d="M27.252,71.997H7.48c-0.198,0-0.359-0.161-0.359-0.36V24.602c0-0.199,0.161-0.36,0.359-0.36h26.531   c0.199,0,0.36,0.161,0.36,0.36V51.57h1.889V19.206c0-2.186-1.772-3.957-3.958-3.957h-0.904c-0.057-0.123-0.18-0.21-0.325-0.21   h-3.447c-0.145,0-0.268,0.087-0.325,0.21H9.1c-2.186,0-3.958,1.771-3.958,3.957v5.112c-0.123,0.058-0.209,0.18-0.209,0.325v1.308   c0,0.145,0.086,0.268,0.209,0.324v1.521c-0.123,0.057-0.209,0.18-0.209,0.325v1.308c0,0.144,0.086,0.267,0.209,0.324v47.161   c0,2.186,1.772,3.957,3.958,3.957h18.152V71.997z M20.582,17.797c0.332,0,0.599,0.268,0.599,0.599c0,0.332-0.268,0.6-0.599,0.6   c-0.331,0-0.6-0.269-0.6-0.6C19.982,18.065,20.25,17.797,20.582,17.797z M18.483,20.615h4.497c0.199,0,0.359,0.161,0.359,0.359   c0,0.198-0.161,0.359-0.359,0.359h-4.497c-0.198,0-0.36-0.161-0.36-0.359C18.123,20.775,18.285,20.615,18.483,20.615z    M20.941,79.37c-1.719,0-3.117-1.397-3.117-3.116s1.398-3.117,3.117-3.117c1.72,0,3.118,1.398,3.118,3.117   S22.661,79.37,20.941,79.37z"></path><path d="M20.956,73.826c-1.322,0-2.398,1.076-2.398,2.397c0,1.323,1.076,2.397,2.398,2.397c1.323,0,2.398-1.074,2.398-2.397   C23.354,74.902,22.278,73.826,20.956,73.826z"></path><path d="M33.667,66.631c-1.322,0-2.398,1.076-2.398,2.397c0,1.323,1.076,2.399,2.398,2.399s2.398-1.076,2.398-2.399   C36.064,67.707,34.989,66.631,33.667,66.631z"></path><path d="M94.672,75.391V57.188c0-2.187-1.77-3.957-3.958-3.957h-5.112c-0.055-0.124-0.179-0.21-0.324-0.21H83.97   c-0.144,0-0.268,0.086-0.322,0.21h-1.522c-0.057-0.124-0.181-0.21-0.326-0.21h-1.306c-0.146,0-0.268,0.086-0.324,0.21H33.007   c-2.186,0-3.957,1.771-3.957,3.957v23.203c0,2.187,1.771,3.957,3.957,3.957h57.707c2.188,0,3.958-1.771,3.958-3.957v-0.904   c0.123-0.057,0.21-0.179,0.21-0.325v-3.447C94.882,75.569,94.795,75.447,94.672,75.391z M33.667,72.146   c-1.719,0-3.118-1.397-3.118-3.118c0-1.718,1.399-3.118,3.118-3.118s3.118,1.4,3.118,3.118   C36.784,70.749,35.386,72.146,33.667,72.146z M85.68,82.1c0,0.199-0.163,0.359-0.361,0.359H38.283c-0.199,0-0.359-0.16-0.359-0.359   V55.568c0-0.199,0.161-0.359,0.359-0.359h47.035c0.198,0,0.361,0.16,0.361,0.359V82.1z M89.306,71.068   c0,0.197-0.161,0.359-0.359,0.359s-0.359-0.162-0.359-0.359v-4.497c0-0.199,0.161-0.36,0.359-0.36s0.359,0.161,0.359,0.36V71.068z    M91.523,69.268c-0.33,0-0.6-0.267-0.6-0.598s0.27-0.6,0.6-0.6c0.332,0,0.601,0.269,0.601,0.6S91.855,69.268,91.523,69.268z"></path><path d="M44.382,27.092l-1.828,1.692c9.584,0.961,14.145,6.547,16.289,11.157c2.386,5.135,2.343,10.049,2.343,10.256l-0.008,0.53   H59.74l0.008-0.549c0.004-0.046,0.031-4.835-2.231-9.674c-2.84-6.068-7.858-9.515-14.925-10.268l1.604,1.73l-2.07-0.079   l-2.344-2.53l2.53-2.345L44.382,27.092z"></path> </g></svg><p>Please, rotate your device.</p></div>
  </div>

</template>

<script>
import ContentLoader from "./loaders/ContentLoader";
import SoundsLoader from "./loaders/SoundsLoader";
import Preloader from './components/preloader/Preloader';
import MainMenu from './components/misc/MainMenu';
import MainMenuMobile from './components/misc/MainMenuMobile';
import QualityAndSoundUI from './components/misc/QualityAndSoundUI';
import IntroLogo from './components/misc/IntroLogo';
import SectionTitle from './components/misc/SectionTitle';
import Environment3d from './components/environment3d/Environment3d';
import Environment3dMobile from './components/environment3d/Environment3dMobile';
import LanguageHelper from "./helpers/LanguageHelper";
import Globals from "./core/Globals";
import './vendors/DrawSVGPlugin.js';

// ========================== video & pose detection
import * as posenet from '@tensorflow-models/posenet';
import $ from 'jquery';
import dat from 'dat.gui';
import Stats from 'stats.js';
import {drawBoundingBox, drawKeypoints, drawSkeleton, drawPoint, rescale} from './vendors/demo_util';
import { EventBus } from './core/event-bus.js';

let scale = 2.232;
const videoWidth = 640/scale;
const videoHeight = 500/scale;
rescale(scale);

const stats = new Stats();
let lastPredict = new Date();
const hiddenCanvas = document.createElement('canvas');
let ctxH = hiddenCanvas.getContext('2d');
ctxH.imageSmoothingEnabled = false;
hiddenCanvas.width = videoWidth;
hiddenCanvas.height = videoHeight;
let canvas;
let ctx;
let last_moves = [];
let customMobilenet;

// huia tf model
import * as tf from '@tensorflow/tfjs';
import { activation } from '@tensorflow/tfjs-layers/dist/exports_layers';
// pose model 
const MODEL_HUIA_URL = 'http://localhost:8181/static/tfjs_poses/model.json';
const POSE_CLASSES = {
  0: 'backpack',
  1: 'dramatic',
  2: 'fly',
  3: 'moonwalk',
  4: 'normal',
  5: 'hadouken',
  6: 'underarm',
  7: 'wings',
  }
const IMAGE_SIZE = 224; 
const TOPK_PREDICTIONS = Object.keys(POSE_CLASSES).length;



navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// =======================  end pose info

export default {
  // registering
  name: 'app',
  components : {
    'Preloader' : Preloader,
    'MainMenu' : MainMenu,
    'MainMenuMobile' : MainMenuMobile,
    'IntroLogo' : IntroLogo,
    'SectionTitle' : SectionTitle,
    'Environment3d' : Environment3d,
    'Environment3dMobile' : Environment3dMobile,
    'QualityAndSoundUI' : QualityAndSoundUI,
  },
  data (){
    return {
      preloaded : false,
      introCompleted : false,
      experience : false
    }
  },
  methods : {
    onEndIntroLogo () {
      // this.introCompleted = true;
      if(this.$refs.environment3d)
        this.$refs.environment3d.land();
      TweenMax.to(this, 1, {onComplete:this.setIntro.bind(this)});
    },
    setIntro () {
      SoundsLoader.startWindowEvents();
      this.introCompleted = true;
    },
    fadeOut(el,done){
      TweenMax.to(el, 0.5, {opacity : 0, onComplete:done});
    },
    onDragQualityChanged () {
      window.environment3d.setQuality(this.$refs.qualitysound.quality);
    },
    isCrawler () {
      return window.IS_CRAWLER;
    },
    isDesktopEnvironment (){
      return !window.MOBILE_DETECT.mobile() && !window.IS_CRAWLER;
    },
    isMobileEnvironment(){
      return window.MOBILE_DETECT.mobile() && !window.IS_CRAWLER;
    },
    isMobile () {
      return window.MOBILE_DETECT.mobile();
    },
    onCrawlerLoaded(){
      if(ContentLoader.PROGRESS == 100){
        ContentLoader.setMetaTags(this.$router.currentRoute.path);
        this.introCompleted =true;
        this.preloaded = true;
      }
    },
    onCrawlerProgress(){
      if(ContentLoader.PROGRESS == 100){
        ContentLoader.setMetaTags(this.$router.currentRoute.path);
        this.introCompleted = true;
        this.preloaded = true;
      }
    }
  },
  // lifecycle methods
  created () {
  },
  mounted () {
    LanguageHelper.initialize();
    window.app = this;
    if(window.MOBILE_DETECT.mobile()){
      TweenMax.ticker.fps(60);
    }
    var self = this;
    if(window.IS_CRAWLER){
      ContentLoader.preloadSite(this.onCrawlerProgress,this.onCrawlerLoaded);
      return;
    }
    this.$refs.preloader.$on('preloaderComplete', ()=>{
      this.preloaded = true;
      if(!Globals.SHOW_INTRO){
        SoundsLoader.startWindowEvents();
        this.introCompleted = true;
      }
      // start pose detection
      bindPage();
    }); }
}

/* =================== custom pose net ========== */
// posenet
function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
  return isAndroid() || isiOS();
}



const loadCustomMobilenet = async () => {

  //status('Loading model...');
  console.log('loading model: ', MODEL_HUIA_URL);
  
  customMobilenet = await tf.loadLayersModel(MODEL_HUIA_URL); //, {strict:false});

  const selLay = $('#layers');
  customMobilenet.layers.forEach((layer)=> {
    if (layer.layers!=null) {
      layer.layers.forEach((nestedLayer) => {
      const option = document.createElement('option');
      option.value = nestedLayer.name;
      option.innerText = nestedLayer.name;
      selLay.append(option);
      });
    } else {
      const option = document.createElement('option');
      option.value = layer.name;
      option.innerText = layer.name;
      selLay.append(option);
    }

  })

 // Warmup the model. This isn't necessary, but makes the first prediction
 // faster. Call `dispose` to release the WebGL memory allocated for the return
 // value of `predict`.
 //customMobilenet.predict(tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3])).dispose();

  predict(hiddenCanvas);

};




/**
 * Loads a the camera to be used in the demo
 *
 */
async function setupCamera() {

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available');
  }

  const video = document.getElementById('video');
  video.width = videoWidth;
  video.height = videoHeight;

  // search for my webcam and use it if available;
  let deviceId;
    // List cameras id and microphones.
    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
      devices.forEach(function(device) {
        if (device.kind=="videoinput") {
          console.log(device.kind + ": " + device.label +
                    " id = " + device.deviceId);
                    if (device.label.includes("BRIO")) {
                        deviceId = device.deviceId;
                        console.log(`DeviceID: ${deviceId} Name: ${device.label}`);
                      }
                  }
      });
    })

  const mobile = isMobile();
  const stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': {
      // my external webcam id, it  will use another if it doesn't exist
      deviceId: deviceId,
      facingMode: 'user',
      width: mobile ? undefined : videoWidth,
      height: mobile ? undefined : videoHeight,
    },
  });
  video.srcObject = stream;
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function loadVideo() {
  const video = await setupCamera();
  video.play();

  return video;
}

const guiState = {
  algorithm: 'multi-pose',
  input: {
    customMobilenetArchitecture: '0.75',
    outputStride: 16,
    imageScaleFactor: 1,
  },
  singlePoseDetection: {
    minPoseConfidence: 0.1,
    minPartConfidence: 0.5,
  },
  multiPoseDetection: {
     maxPoseDetections: 5,
      minPoseConfidence: 0.40,
      minPartConfidence: 0.04,
      nmsRadius: 10.0,
  },
  output: {
    showVideo: true,
    showSkeleton: true,
    showPoints: true,
    showBoundingBox: false,
  },
  net: null,
};

/**
 * Sets up dat.gui controller on the top-right of the window
 */
function setupGui(cameras, net) {
  guiState.net = net;

  if (cameras.length > 0) {
    guiState.camera = cameras[0].deviceId;
  }

  const gui = new dat.GUI({width: 300, closed: true });
  gui.hide();
  

  // The single-pose algorithm is faster and simpler but requires only one
  // person to be in the frame or results will be innaccurate. Multi-pose works
  // for more than 1 person
  const algorithmController =
      gui.add(guiState, 'algorithm', ['single-pose', 'multi-pose']);

  // The input parameters have the most effect on accuracy and speed of the
  // network
  let input = gui.addFolder('Input');
  // Architecture: there are a few PoseNet models varying in size and
  // accuracy. 1.01 is the largest, but will be the slowest. 0.50 is the
  // fastest, but least accurate.
  const architectureController = input.add(
      guiState.input, 'customMobilenetArchitecture',
      ['1.01', '1.00', '0.75', '0.50']);
  // Output stride:  Internally, this parameter affects the height and width of
  // the layers in the neural network. The lower the value of the output stride
  // the higher the accuracy but slower the speed, the higher the value the
  // faster the speed but lower the accuracy.
  input.add(guiState.input, 'outputStride', [8, 16, 32]);
  // Image scale factor: What to scale the image by before feeding it through
  // the network.
  input.add(guiState.input, 'imageScaleFactor').min(0.2).max(1.0);
  input.open();

  // Pose confidence: the overall confidence in the estimation of a person's
  // pose (i.e. a person detected in a frame)
  // Min part confidence: the confidence that a particular estimated keypoint
  // position is accurate (i.e. the elbow's position)
  let single = gui.addFolder('Single Pose Detection');
  single.add(guiState.singlePoseDetection, 'minPoseConfidence', 0.0, 1.0);
  single.add(guiState.singlePoseDetection, 'minPartConfidence', 0.0, 1.0);

  let multi = gui.addFolder('Multi Pose Detection');
  multi.add(guiState.multiPoseDetection, 'maxPoseDetections')
      .min(1)
      .max(20)
      .step(1);
  multi.add(guiState.multiPoseDetection, 'minPoseConfidence', 0.0, 1.0);
  multi.add(guiState.multiPoseDetection, 'minPartConfidence', 0.0, 1.0);
  // nms Radius: controls the minimum distance between poses that are returned
  // defaults to 20, which is probably fine for most use cases
  multi.add(guiState.multiPoseDetection, 'nmsRadius').min(0.0).max(40.0);
  multi.open();

  let output = gui.addFolder('Output');
  output.add(guiState.output, 'showVideo');
  output.add(guiState.output, 'showSkeleton');
  output.add(guiState.output, 'showPoints');
  output.add(guiState.output, 'showBoundingBox');
  output.open();


  architectureController.onChange(function(architecture) {
    guiState.changeToArchitecture = architecture;
  });

  algorithmController.onChange(function(value) {
    switch (guiState.algorithm) {
      case 'single-pose':
        multi.close();
        single.open();
        break;
      case 'multi-pose':
        single.close();
        multi.open();
        break;
    }
  });
}

/**
 * Sets up a frames per second panel on the top-left of the window
 */
function setupFPS() {
  stats.showPanel(0);  // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);
}

function poseClicked(posename) {
  EventBus.$emit('pose-activation', posename);
}

function setupProbability() {
  // setup poses and progress bars;
  Object.values(POSE_CLASSES).forEach((pose_name)=>{

    var aElm = document.createElement("a");
    aElm.href = "#";    

    var iElm = document.createElement("img");
    iElm.width = 640/5;
    iElm.width = 500/5;
    iElm.src = "/static/images/poses/" + pose_name + ".png";
    iElm.align="middle";
    iElm.id = "img_" + pose_name;
    iElm.className = "poseimg";
    aElm.append(iElm);

 

    $("#icons").append(aElm);

    var s1Elm = document.createElement("span");
    s1Elm.innerText = pose_name;
    s1Elm.id = "span_" + pose_name;
    s1Elm.className = "poselabel";
    $("#icons").append(s1Elm);

    var pElm = document.createElement("progress");
    pElm.max = 1;
    pElm.value = 0;
    pElm.id = "progress_" + pose_name;
    $("#icons").append(pElm);

    var s2Elm = document.createElement("span");
    s2Elm.innerText = "0";
    s2Elm.id = "prob_" + pose_name;
    s2Elm.className = "poseprob";
    $("#icons").append(s2Elm);

    $("#img_" + pose_name).on("click",()=> {
      EventBus.$emit('pose-activation', pose_name);
    })
  })

  }

/**
 * Feeds an image to posenet to estimate poses - this is where the magic
 * happens. This function loops with a requestAnimationFrame method.
 */
function detectPoseInRealTime(video, net) {

canvas = document.getElementById('output');
ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;



  // since images are being fed from a webcam
  const flipHorizontal = true;

  canvas.width = videoWidth;
  canvas.height = videoHeight;

  async function poseDetectionFrame() {
    if (guiState.changeToArchitecture) {
      // Important to purge variables and free up GPU memory
      guiState.net.dispose();

      // Load the PoseNet model weights for either the 0.50, 0.75, 1.00, or 1.01
      // version
      guiState.net = await posenet.load(+guiState.changeToArchitecture);

      guiState.changeToArchitecture = null;
    }

    // Begin monitoring code for frames per second
    stats.begin();

    // Scale an image down to a certain factor. Too large of an image will slow
    // down the GPU
    const imageScaleFactor = guiState.input.imageScaleFactor;
    const outputStride = +guiState.input.outputStride;

    //var classifier = await model.execute(tf.fromPixels(video));
    //console.log(classifier);
    //ctx.drawText(classifier,100,100,"black");

    let poses = [];
    let minPoseConfidence;
    let minPartConfidence;
    switch (guiState.algorithm) {
      case 'single-pose':
        const pose = await guiState.net.estimateSinglePose(
            video, imageScaleFactor, flipHorizontal, outputStride);
        poses.push(pose);

        minPoseConfidence = +guiState.singlePoseDetection.minPoseConfidence;
        minPartConfidence = +guiState.singlePoseDetection.minPartConfidence;
        break;
      case 'multi-pose':
        poses = await guiState.net.estimateMultiplePoses(
            video, imageScaleFactor, flipHorizontal, outputStride,
            guiState.multiPoseDetection.maxPoseDetections,
            guiState.multiPoseDetection.minPartConfidence,
            guiState.multiPoseDetection.nmsRadius);

        minPoseConfidence = +guiState.multiPoseDetection.minPoseConfidence;
        minPartConfidence = +guiState.multiPoseDetection.minPartConfidence;
        break;
    }

    // clear hidden canvas before redrawing
    ctxH.clearRect(0, 0, videoWidth, videoHeight);
    ctx.clearRect(0, 0, videoWidth, videoHeight);

    //let grey = tf.mul(tf.browser.fromPixels(video).toFloat(),tf.tensor1d([0.2989, 0.5870, 0.1140],'float32').toInt());
    // let grey = tf.browser.fromPixels(video,1); //.reshape([224,224,2]).toInt();
    // tf.browser.toPixels(grey,canvas);

        //console.log("img", img.print());
    // console.log("convert to GRAY");
    // let grey = tf.mul(img,tf.tensor1d([0.2989, 0.5870, 0.1140],'float32'));
    // console.log("grey",grey.print());
    // tf.browser.toPixels(grey, ctx).then(() => {
    //   //console.log("ok");
    //   grey.dispose()
    // })
    // .catch((err) => {
    //   // Handle any error that occurred in any of the previous
    //   // promises in the chain.
    //   console.log("error converting",err);
    // });;

    if (guiState.output.showVideo) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-videoWidth, 0);
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      ctx.restore();
    }

    // For each pose (i.e. person) detected in an image, loop through the poses
    // and draw the resulting skeleton and keypoints if over certain confidence
    // scores

    // if (poses.length>0)
    //    poses = [poses[0]]; //getMainPose(poses);

    let segments = 0;
    poses.forEach(({score, keypoints}) => {
      if (score >= minPoseConfidence) {
          
        //debugger
        let nose      = keypoints[0].position;
        let leftEye   = keypoints[1].position;
        let rightEye  = keypoints[2].position;
        let leftEar   = keypoints[3].position;
        let rightEar  = keypoints[4].position;

        let leftWrist  = keypoints[9].position;
        let rightWrist  = keypoints[10].position;

        const rotation_threshold = 10; // mais de 10% = rosto rotacionado

        // desenha onde o mouse vai ficar
        //drawPoint(ctx, y * scale, x * scale, 3, color);
        // calcula posição do mouse


        // na horizontal
        const boundingBox = posenet.getBoundingBox(keypoints);

        let headsize  = Math.abs(leftEar.x-rightEar.x);
        let mousex    = (Math.abs(rightEar.x-rightEye.x+headsize*0.05) / (headsize/2)) * videoWidth;
        
        if (mousex < 0) {
          mousex = 1;
        } else if (mousex > videoWidth) {
          mousex = videoWidth - 1;
        }

        // na vertical
        let mousey = nose.y; 
        if (nose.y<leftEar.y) {
          mousey = nose.y - ((Math.abs(leftEar.y-nose.y)/(headsize/2)) * (videoHeight/2));
        } else {
          mousey = nose.y + ((Math.abs(leftEar.y-nose.y)/(headsize/2)) * (videoHeight/2));
        }
        

        if (mousey < 0) {
          mousey = 1;
        } else if (mousey > videoHeight) {
          mousey = videoHeight - 1;
        }

        // move huias head
        let head = { "x":mousex, "y":mousey}
        EventBus.$emit('move-head', head);

        // if (leftWrist.y<70 && rightWrist.y<70) {
        //   // espera 2s até pular de novo
        //   if (Date.now()-lastAnimation>2000) {
        //     lastAnimation = Date.now();
        //     EventBus.$emit('jump');
        //   }
        // }
        // drawPoint(ctx, parseInt(mousey), parseInt(mousex), 3, 'red');
        

        if (guiState.output.showPoints) {
          drawKeypoints(keypoints, minPartConfidence, ctxH);
        }
        if (guiState.output.showSkeleton) {
         segments = drawSkeleton(keypoints, minPartConfidence, ctxH);
        }
        // if (guiState.output.showBoundingBox) {
        //   drawBoundingBox(keypoints, ctxH);
        // }
      }
    });

    // copy hidden canvas to webcam overlay and skeleton image
    //ctxH.globalAlpha = 1;
    ctx.drawImage(ctxH.canvas,0,0);

    // only predict when we have at least 8 body parts on screen and every 200ms
    //console.log("elapsed time since last predict", new Date() - lastPredict);
    if (!false && !environment3d.huiaScene.bird.mouseBlocked && (segments >= 8) && ((new Date() - lastPredict)>100)) {
      console.log("predicting..");
      
      realTimePredict();
      lastPredict = Date.now();
    }

    // End monitoring code for frames per second
    stats.end();

    requestAnimationFrame(poseDetectionFrame);
  }

  poseDetectionFrame();
}

// olho central
function getMainPose(poses) {
  var mainPose = [];
  var width = 0.0;
  poses.forEach((pose) => { 
    //console.log(pose.keypoints);
    var leftShoulderX  = parseFloat(pose.keypoints[5].position.x);
    var rightShoulderX = parseFloat(pose.keypoints[6].position.x);
    var newW = Math.abs(rightShoulderX-leftShoulderX);
   // console.log(newW);
    if (width<newW)
    {
      width = newW;
      mainPose = pose;
    }
  });
  return [mainPose];
}

/**
 * Kicks off the demo by loading the posenet model, finding and loading
 * available camera devices, and setting off the detectPoseInRealTime function.
 */
export async function bindPage() {
  // Load the PoseNet model weights with architecture 0.75
  const net = await posenet.load(0.75);
  //const model = await tf.loadLayersModel(MODEL_URL);

  document.getElementById('loading').style.display = 'none';
  document.getElementById('main').style.display = 'block';

  let video;

  try {
    video = await loadVideo();
  } catch (e) {
    let info = document.getElementById('info');
    info.textContent = 'this browser does not support video capture,' +
        'or this device does not have a camera';
    info.style.display = 'block';
    throw e;
  }


  loadCustomMobilenet();
  setupGui([], net);
  setupFPS();
  setupProbability();


  detectPoseInRealTime(video, net);
}

/**
 * Given an image element, makes a prediction through customMobilenet returning the
 * probabilities of the top K classes.
 */
async function predict(imgElement) {
  console.log('Predicting...' + imgElement);

  let tempCanvas = document.createElement('canvas');
  let ctxT = tempCanvas.getContext('2d');
  tempCanvas.width = IMAGE_SIZE;
  tempCanvas.height = IMAGE_SIZE;
  ctxT.imageSmoothingEnabled = true;
  ctxT.imageSmoothingQuality = "high";
  ctxT.drawImage(imgElement,0,0,IMAGE_SIZE,IMAGE_SIZE);

  // The first start time includes the time it takes to extract the image
  // from the HTML and preprocess it, in additon to the predict() call.
  const startTime1 = performance.now();
  // The second start time excludes the extraction and preprocessing and
  // includes only the predict() call.
  let startTime2;
  const logits = tf.tidy(() => {
    // tf.browser.fromPixels() returns a Tensor from an image element.
    const img = tf.browser.fromPixels(tempCanvas).toFloat();

    // Normalize the image from [0, 255] to [-1, 1].
    const offset = tf.scalar(127.5);
    const normalized = img.sub(offset).div(offset);

    //console.log(normalized);

    // Reshape to a single-element batch so we can pass it to predict.
    const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 3]);

    startTime2 = performance.now();
    // Make a prediction through customMobilenet.
    let preds = customMobilenet.predict(batched);
    return preds;
  });

  // Convert logits to probabilities and class names.
  const classes = await getTopKClasses(logits, TOPK_PREDICTIONS);
  const totalTime1 = performance.now() - startTime1;
  const totalTime2 = performance.now() - startTime2;

  // update progress bars
  classes.forEach((c) => {
    //$('#progress_' + c.className).val(c.probability);
    TweenMax.to($('#progress_' + c.className),0.05,{value:c.probability.toFixed(0)});
    // TweenMax.to($('#prob_' + c.className),0.05,{innerText:c.probability.toFixed(3)});
    $('#prob_' + c.className).text(c.probability.toFixed(3));
  });


  // status(`Done in ${Math.floor(totalTime1)} ms ` +
  //     `(not including preprocessing: ${Math.floor(totalTime2)} ms)`);


  //console.log("top probability:", classes[0].probability);
  // Show the classes in the DOM.
  // var prob = 'Probabilities: <BR/>';
  // for (let i = 0; i < classes.length-1; i++) {
  //   if (classes[i].probability>=0.85) {
  //     prob+= "<span style='color:red;font-size:90px'>"
  //     prob+= classes[i].className + " : " + classes[i].probability + "</span> <br/>";
  //   } else {
  //     prob+= classes[i].className + " : " + classes[i].probability + " <br/>";
  //   }
  // }
  let prob = "";
  
  // se probbilidade > .93 bota no array de moves
  if (classes[0].probability>=0.93) {
        last_moves.unshift(classes[0].className);
        var strMoves = "";
        last_moves.forEach ( (move) => {
          var d = new Date();
          strMoves += d.getSeconds() + " - " +move + "<br/>";
        });
        $('#last_moves').html(strMoves);
        let lastPose = classes[0].className;
        // se os ultimos 3 moves foram o mesmo, dispara
        if ((last_moves[0]==lastPose && last_moves[1]==lastPose && last_moves[2]==lastPose) && (new Date() - lastPredict)<1000) {
          prob+= "<span style='color:red;font-size:90px'>"
          prob+= classes[0].className + " : " + classes[0].probability.toFixed(3) + "</span> <br/>";
          $('#predictions').html(prob);
          // emit animation
          console.log("Activate animation: ", classes[0].className);
          EventBus.$emit('pose-activation', classes[0].className);

        } else {
          $('#predictions').html('');
        }
   }
  //console.log(classes);
  
}

/**
 * Computes the probabilities of the topK classes given logits by computing
 * softmax to get probabilities and then sorting the probabilities.
 * @param logits Tensor representing the logits from customMobilenet.
 * @param topK The number of top predictions to show.
 */
export async function getTopKClasses(logits, topK) {
  const values = await logits.data();

  const valuesAndIndices = [];
  for (let i = 0; i < values.length; i++) {
    valuesAndIndices.push({value: values[i], index: i});
  }
  valuesAndIndices.sort((a, b) => {
    return b.value - a.value;
  });
  const topkValues = new Float32Array(topK);
  const topkIndices = new Int32Array(topK);
  for (let i = 0; i < topK; i++) {
    topkValues[i] = valuesAndIndices[i].value;
    topkIndices[i] = valuesAndIndices[i].index;
  }

  const topClassesAndProbs = [];
  for (let i = 0; i < topkIndices.length; i++) {
    topClassesAndProbs.push({
      className: POSE_CLASSES[topkIndices[i]],
      probability: topkValues[i]
    })
  }
  return topClassesAndProbs;
}

// predict
async function realTimePredict() {
  // testa se tem numero minimo de pontos p/ predict
  await predict(hiddenCanvas);
  //await activationVisualization(hiddenCanvas)
}

// async function activationVisualization(hiddenCanvas) {
//   const layerId = $("layers").prop("selectedIndex");
//   activationShape = customMobilenet.layers[layerId].output.shape.slice(1);
//   console.log(activationShape);  

//   const shapes      = models.map(model => model.outputs[0].shape.slice(1))
//   const collageDims = shapes.map(shape => toSquareish(shape[2]))

//  const channelNormalize = false;
//   tf.tidy(() => {
//       // Feed the input through the model.
//       let activation = customMobilenet.layers[layerId].predict(hiddenCanvas.expandDims(0)).squeeze();

//       // // Normalize within each channel if the checkbox is checked.
//       // if (channelNormalize) {
//       //   // Global pool so we compute normalization params for each channel.
//       //   const strides = 1; // Doesn't matter
//       //   const pad = 0;
//       //   const maxpool = activation.maxPool([activation.shape[0], activation.shape[1]], strides, pad);
        
//       //   const minpool = activation.neg().maxPool(
//       //       [activation.shape[0], activation.shape[1]], strides, pad).neg()
//       //       // To avoid dividing by zero.
//       //       .add(tf.scalar(.0000001));

//       //   activation = activation.sub(minpool).div(maxpool.sub(minpool));
//       // }

//       // Transpose the channels to the outer most dimension and then reshape the activation so we can show
//       // it in a rectangular collage.
    

//       const reshaped = activation.transpose([2, 0, 1]).reshape(
//         [collageDims[layerId][0], collageDims[layerId][1], activation.shape[0], activation.shape[1]]);

//       // Split channels between rows and columns. [16, width, height] becomes [4, width, 4, height]
//       const transposed = reshaped.transpose([0, 2, 1, 3]);

//       // Combine channels. [4, height, 4, height] becomes [4 * height, 4 * height]
//       let output = transposed.reshape(
//         [transposed.shape[0] * transposed.shape[1], transposed.shape[2] * transposed.shape[3]]);

//       // Normalize across the entire activation if the channelNormalize option isn't checked.
//       if (!channelNormalize) {
//         const min = output.min();
//         const max = output.max();
//         output = output.sub(min).div(max.sub(min));
//       }
//       return output.maximum(tf.scalar(0)).minimum(tf.scalar(1));
//     });

// } 

function toSquareish(x) {
    let sqrt = Math.sqrt(x);
    if (Number.isInteger(sqrt)) {
      return [sqrt, sqrt];
    }
    sqrt = Math.floor(sqrt);
    // Who cares that this is slow.
    while (!Number.isInteger(x / sqrt)) {
      sqrt--;
    }
    return [sqrt, x / sqrt];
}

</script>
<style src="../scss/fonts.css"></style>
<style lang="scss">
  @import "../scss/base";
  * {
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }
  html, body {
      margin : 0;
      padding : 0;
      background : #06050f;
      overflow-x : hidden;
  }
  body {
    overflow-y : hidden;
  }
  #app{
    position: absolute;
    top : 0px;
    left : 0px;
    height : 100%;
    width : 100%;
    div.app-container {
      position : absolute;
      top : 0px;
      left : 0px;
      width : 100%;
      height : 100%;
    }
  }
  section {
    padding-left : 25vw ;
  }

  #icons {
    position: relative;
    float: right;
    width: 180px;
    z-index: 1000;
    color: white;
    clear: both;
  }

  #icons progress {
    color: #0063a6;
    font-size: .6em;
    line-height: 1.5em;
    text-indent: .5em;    
    width: 15em;
    height: 1.8em;
    background: #fff; 
    padding: 1px;
  }

  #icons .poselabel {
    margin-top: 2px;
    display: block;
  }

  #icons .poseimg {
    margin-top: 2px;
    display: block;
  }

   #icons .poseprob {
    margin-left: 5px;
  }

  #layers {
    position: relative;
    z-index: 1000;
    
  }

  progress::-moz-progress-bar { background: white; }
  progress::-webkit-progress-value { background: white; }
  


  #output {
     position:relative;
     z-index:1000;
     border:1px solid white; 
  }

  #predictions {
    position:relative;
    z-index:1000;
    float:right;
    display: block;
    height: 100px;
  }

  div.mobile-gradient {
    position : fixed;
    top : 0px;
    left : 0px;
    width : 100vw;
    height : 20vh;
    pointer-events : none;
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#000000+0,000000+100&1+0,0+100 */
    background: -moz-linear-gradient(top, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, rgba(0,0,0,0.9) 50%,rgba(0,0,0,0) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, rgba(0,0,0,0.9) 50%,rgba(0,0,0,0) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#000000', endColorstr='#00000000',GradientType=0 ); /* IE6-9 */
  }
  div.mobile-gradient-bottom {
    position : fixed;
    bottom : 0px;
    left : 0px;
    width : 100vw;
    height : 20vh;
    pointer-events : none;
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#000000+0,000000+100&1+0,0+100 */
    background: -moz-linear-gradient(top, rgba(0,0,0,0) 20%, rgba(0,0,0,0.95) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, rgba(0,0,0,0) 20%,rgba(0,0,0,0.95) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, rgba(0,0,0,0) 20%,rgba(0,0,0,0.95) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#000000', endColorstr='#00000000',GradientType=0 ); /* IE6-9 */
  }
  div.rotate-layer {
    position: fixed;
    top : 0px;
    left : 0px;
    width : 100vw;
    height : 100vh;
    background : #06050f;
    z-index : 99999998;
    display: none;
    div.gradient {
      position: absolute;
      top : 0px;
      left : 0px;
      width : 100vw;
      height : 100vh;
      background: #0a0a14; /* Old browsers */
      background: -moz-radial-gradient(center, ellipse cover, #26263c 0%, #06050f 50%); /* FF3.6-15 */
      background: -webkit-radial-gradient(center, ellipse cover, #26263c 0%,#06050f 50%); /* Chrome10-25,Safari5.1-6 */
      background: radial-gradient(ellipse at center, #26263c 0%,#06050f 50%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#0a0a14', endColorstr='#06050f',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
    }
    svg {
      position: absolute;
      height : 40vh;
      top : 50%;
      margin-top : -22vh;
      left : 50%;
      transform : translateX(-50%);
      g {
        fill : #9b82dc;
      }
    }
    p {
      font-size: 2vw;
      letter-spacing: 0.3vw;
      position: absolute;
      top : 60%;
      color : #9b82dc;
      filter : drop-shadow(0px 0px 4px #9b82dc);
      font-family: 'open_sansbold';
      text-transform: uppercase;
      width : 50vw;
      line-height: 4vw;
      text-align: center;
      left : 50%;
      transform : translateX(-50%);
    }
  
    
  }
  @media screen and (max-width : 1000px){
    body,html{
      overflow-x : hidden;
    }
    #app {
      overflow-x: hidden;
      width : 100vw;
    }
  }
  @media screen and (max-width : 1000px) and (min-aspect-ratio: 13/9){
    div.rotate-layer {
      display: block !important;
    }
  }
</style>