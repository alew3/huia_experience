// /**
//  * @license
//  * Copyright 2018 Google Inc. All Rights Reserved.
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  * https://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  * =============================================================================
//  */

import * as posenet from '@tensorflow-models/posenet';
import * as tf from '@tensorflow/tfjs';
import dat from 'dat.gui';
import Stats from 'stats.js';
import $ from 'jquery';
import {drawBoundingBox, drawKeypoints, drawSkeleton} from 'demo_util';


// setup variables
let last_moves = [];
const stats = new Stats();
const videoWidth  = $('#video').width();
const videoHeight = $('#video').height();

let lastPredict = new Date();

let canvas  = $('#output')[0];
let canvas2 = $('#skeleton')[0];

canvas.height = videoHeight;
canvas.width = videoWidth;
canvas2.height = videoHeight;
canvas2.width = videoWidth;


let ctx = canvas.getContext('2d');
let ctx2 = canvas2.getContext('2d');
ctx.imageSmoothingEnabled = false;
ctx2.imageSmoothingEnabled = false;


let hiddenCanvas = document.createElement('canvas');
let ctxH = hiddenCanvas.getContext('2d');
ctxH.imageSmoothingEnabled = false;
hiddenCanvas.width = videoWidth;
hiddenCanvas.height = videoHeight;



const predictionsElement = $('#predictions');

const MOBILENET_MODEL_PATH = 'http://localhost:1234/tfjs_huia_mob_224_teste_4_q/model.json';
const POSE_CLASSES = {
  0: 'backpack',
  1: 'dramatic',
  2: 'fly',
  3: 'moonwalk',
  4: 'normal',
  5: 'radouken',
  6: 'underarm',
  7: 'wings',
  }

const IMAGE_SIZE = 224; 
const TOPK_PREDICTIONS = Object.keys(POSE_CLASSES).length;

let mobilenet;

const mobilenetDemo = async () => {

  //status('Loading model...');
  console.log('loading model: ', MOBILENET_MODEL_PATH);
  
  mobilenet = await tf.loadLayersModel(MOBILENET_MODEL_PATH); //, {strict:false});

 // Warmup the model. This isn't necessary, but makes the first prediction
 // faster. Call `dispose` to release the WebGL memory allocated for the return
 // value of `predict`.
 //mobilenet.predict(tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3])).dispose();

 predict(hiddenCanvas);

};

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// kick off the demo

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

  const stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': {
     // my external webcam id, it  will use another if it doesn't exist
      deviceId: '0165df6b12fef3ba881da9a0bf01b898860f7c2d254d972cab487a9d18a355be',
      facingMode: 'user',
      width: videoWidth,
      height: videoHeight,
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
    mobileNetArchitecture: '0.75',
    outputStride: 16,
    imageScaleFactor: 0.5,
  },
  singlePoseDetection: {
    minPoseConfidence: 0.1,
    minPartConfidence: 0.5,
  },
  multiPoseDetection: {
    maxPoseDetections: 3,
    minPoseConfidence: 0.10,
    minPartConfidence: 0.05,
    // minimum distance in pixels between the root parts of poses
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

  const gui = new dat.GUI({width: 300, closed: true});

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
      guiState.input, 'mobileNetArchitecture',
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


// /**
//  * Sets up a frames per second panel on the top-left of the window
//  */
function setupFPS() {
    stats.showPanel(0);  
    $('#stats').append(stats.dom);
    $('#stats').children().css({position:'relative'});
}

// /**
//  * Feeds an image to posenet to estimate poses - this is where the magic
//  * happens. This function loops with a requestAnimationFrame method.
//  */
function detectPoseInRealTime(video, net) {

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
    ctx2.clearRect(0, 0, videoWidth, videoHeight);

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

    if (poses.length>0)
      poses = getMainPose(poses);

    let segments = 0;
    poses.forEach(({score, keypoints}) => {
      if (score >= minPoseConfidence) {
        if (guiState.output.showPoints) {
          drawKeypoints(keypoints, minPartConfidence, ctxH);
          //drawKeypoints(keypoints, minPartConfidence, ctx2);
        }
        if (guiState.output.showSkeleton) {
          // 8 segments threshold for prediction
          segments = drawSkeleton(keypoints, minPartConfidence, ctxH);
        //   drawSkeleton(keypoints, minPartConfidence, ctx2);
        }
        if (guiState.output.showBoundingBox) {
          drawBoundingBox(keypoints, ctxH);
          //drawBoundingBox(keypoints, ctx2);
        }
      }
    });
    // copy hidden canvas to webcam overlay and skeleton image
    //ctxH.globalAlpha = 1;
    ctx.drawImage(ctxH.canvas,0,0);
    ctx2.drawImage(ctxH.canvas,0,0);

    // only predict when we have at least 8 body parts on screen and every 200ms
    if ((segments >= 8) && ((new Date() - lastPredict)>200)) {
      //console.log("predicting");
      realTimePredict();
      lastPredict = Date.now();
    }

    // End monitoring code for frames per second
    stats.end();

    requestAnimationFrame(poseDetectionFrame);
  }

  poseDetectionFrame();
}

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
  //$('#predict').click(startPredicting);

  mobilenetDemo();
  setupGui([], net);
  setupFPS();
  detectPoseInRealTime(video, net);
}


/**
 * Given an image element, makes a prediction through mobilenet returning the
 * probabilities of the top K classes.
 */
async function predict(imgElement) {
  //console.log('Predicting...' + imgElement);

  let tempCanvas = document.createElement('canvas');
  let ctxT = tempCanvas.getContext('2d');
  tempCanvas.width = IMAGE_SIZE;
  tempCanvas.height = IMAGE_SIZE;
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

    const offset = tf.scalar(127.5);
    // Normalize the image from [0, 255] to [-1, 1].
    const normalized = img.sub(offset).div(offset);

    //console.log(normalized);

    // Reshape to a single-element batch so we can pass it to predict.
    const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 3]);

    startTime2 = performance.now();
    // Make a prediction through mobilenet.
    let preds = mobilenet.predict(batched);
    return preds;
  });

  // Convert logits to probabilities and class names.
  const classes = await getTopKClasses(logits, TOPK_PREDICTIONS);
  const totalTime1 = performance.now() - startTime1;
  const totalTime2 = performance.now() - startTime2;
  // status(`Done in ${Math.floor(totalTime1)} ms ` +
  //     `(not including preprocessing: ${Math.floor(totalTime2)} ms)`);

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
        } else {
          $('#predictions').html('');
        }
   }
  //console.log(classes);
  
}

/**
 * Computes the probabilities of the topK classes given logits by computing
 * softmax to get probabilities and then sorting the probabilities.
 * @param logits Tensor representing the logits from MobileNet.
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
}

bindPage();