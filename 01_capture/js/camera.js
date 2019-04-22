import $ from 'jquery';
import dat from 'dat.gui';
import Stats from 'stats.js';
import * as posenet from '@tensorflow-models/posenet';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import {drawBoundingBox, drawKeypoints, drawSkeleton} from '/js/demo_util';
import 'babel-polyfill';
import 'jquery-mask-plugin';

// setup variables
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

const tick = new Audio('flash.mp3');
const interval = 1000; // ms
let timer;

const stats = new Stats();
let zip = new JSZip();

const videoWidth  = $('#video').width();
const videoHeight = $('#video').height();

const canvas  = document.getElementById('output');
const canvas2 = document.getElementById('skeleton');

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
      maxPoseDetections: 5,
      minPoseConfidence: 0.15,
      minPartConfidence: 0.1,
      nmsRadius: 30.0,
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


/**
 * Sets up dat.gui controller on the top-right of the window
 */
function setupGui(cameras, net) {
    guiState.net = net;
  
    if (cameras.length > 0) {
      guiState.camera = cameras[0].deviceId;
    }
  
    const gui = new dat.GUI({width: 300, closed: true});

    const algorithmController =
        gui.add(guiState, 'algorithm', ['single-pose', 'multi-pose']);
  
    let input = gui.addFolder('Input');
    const architectureController = input.add(
        guiState.input, 'mobileNetArchitecture',
        ['1.01', '1.00', '0.75', '0.50']);
    input.add(guiState.input, 'outputStride', [8, 16, 32]);
    input.add(guiState.input, 'imageScaleFactor').min(0.2).max(1.0);
    input.open();

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


function setupFPS() {
    stats.showPanel(0);  
    $('#stats').append(stats.dom);
    $('#stats').children().css({position:'relative'});
}


function detectPoseInRealTime(video, net) {

    var ctx = canvas.getContext('2d');
    var ctx2 = canvas2.getContext('2d');
  
    // since images are being fed from a webcam
    const flipHorizontal = true;
    var savedCanvas = false;
  
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    canvas2.width = videoWidth;
    canvas2.height = videoHeight;
  
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
  
      ctx.clearRect(0, 0, videoWidth, videoHeight);
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
  
      poses.forEach(({score, keypoints}) => {
        if (score >= minPoseConfidence) {
          if (guiState.output.showPoints) {
            drawKeypoints(keypoints, minPartConfidence, ctx);
            drawKeypoints(keypoints, minPartConfidence, ctx2);
          }
          if (guiState.output.showSkeleton) {
            drawSkeleton(keypoints, minPartConfidence, ctx);
            drawSkeleton(keypoints, minPartConfidence, ctx2);
          }
          if (guiState.output.showBoundingBox) {
            drawBoundingBox(keypoints, ctx);
            drawBoundingBox(keypoints, ctx2);
          }
        }
      });
      
  
      // End monitoring code for frames per second
      stats.end();
  
      requestAnimationFrame(poseDetectionFrame);
    }
  
    poseDetectionFrame();
  }

// choose the main pose by sholder length
function getMainPose(poses) {
    let mainPose = [];
    let width = 0.0;
    poses.forEach((pose) => { 
        let leftShoulderX  = parseFloat(pose.keypoints[5].position.x);
        let rightShoulderX = parseFloat(pose.keypoints[6].position.x);
        let newW = Math.abs(rightShoulderX-leftShoulderX);
        if (width<newW) {
            width = newW;
            mainPose = pose;
        }
    });
    return [mainPose];
}

function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
  else
      byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], {type:mimeString});
}

export async function bindPage() {
    // Load the PoseNet model weights with architecture 0.75
    const net = await posenet.load(0.75);
  
    document.getElementById('info').style.display = 'none';
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
    setupGui([], net);
    setupFPS();
    detectPoseInRealTime(video, net);

    // radio single frame
    $('#single').click(function() {
      $('#single_picture').removeAttr('disabled');
      $('#start_record').attr('disabled', 'disabled');
      $('#stop_record').attr('disabled', 'disabled');
    });

    // radio multiple frame
    $('#multiple').click(function() {
      $('#single_picture').attr('disabled', 'disabled');
      $('#start_record').removeAttr('disabled');
      $('#stop_record').removeAttr('disabled');
    });

    // single picture
    $('#single_picture').click(function() { singlePicture(); });

    // start record
    $('#start_record').click(function() { startRecording(); });

    // stop record
    $('#stop_record').click(function() { stopRecording(); });

    // reset / new zip
    $('#new_zip').click(function() { newZip(); });

    // download zip
    $('#download_zip').click(function() { saveZip(); });

}

function newZip() {
  zip = new JSZip();
  $('#image_counter').val(0);
  $('#download_zip').attr('disabled','disabled');
  $('#files').text('');
  $('#total').text(0);
}

function startRecording() {
  console.log('begin recording');
  $('#stop_record').show();
  $('#start_record').hide();
  timer = window.setInterval(saveCanvas, interval);
  console.log('recording');
}

function stopRecording() {
  console.log('stop recording');
  window.clearInterval(timer);
  $('#stop_record').hide();
  $('#start_record').show();
}


function singlePicture() {
  saveCanvas();
}

function saveZip() {
  stopRecording();
  console.log('saving zip');

  zip.generateAsync({type:'blob'})
  .then(function (zip) {
      saveAs(zip, fileName + '.zip');
  });
}  

function saveCanvas() {
    $('#download_zip').removeAttr('disabled');
    let file = $('#filename').val() + '_' + $('#image_counter').val() + '.png';
    console.log('adding canvas to zip', file);
    zip.file(file, dataURItoBlob(canvas2.toDataURL('image/png')),{binary: true});

    $('#image_counter').val(+$('#image_counter').val()+1);
    // $('#total').val(zip.files);
    let i = 0;
    let strFiles = "";
    zip.folder().forEach(function(relativePath, file) {
      strFiles += file.name + "\n";
      i++;
      //console.log(file);
    });

    $('#files').text(strFiles);
    $('#total').text(i);

    //timer = { countdown: 1};
    //var tween = TweenLite.to(timer, 1, {countdown:0, onUpdate:showTimer, onComplete:flash})
}

function showTimer() {
  //$("#countdown").text(timer.countdown.toFixed(0);
}

// start aplication
bindPage();