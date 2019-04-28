import * as posenet from '@tensorflow-models/posenet';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import {drawBoundingBox, drawKeypoints, drawSkeleton} from './demo_util';
import $ from 'jquery';
import 'jquery-mask-plugin';
import dat from 'dat.gui';
import Stats from 'stats.js';
import flash from './static/flash.mp3';

// setup variables
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

let tick = new Audio(flash);
let timer;
const interval = 3000; // ms
let lastKeypoints;

const stats = new Stats();
let zip = new JSZip();

const videoWidth  = $('#video').width();
const videoHeight = $('#video').height();

let canvas  = $('#output')[0];
let canvas2 = $('#skeleton')[0];

const guiState = {
    algorithm: 'multi-pose',
    input: {
      mobileNetArchitecture: '1',
      outputStride: 16,
      imageScaleFactor: 0.5,
    },
    singlePoseDetection: {
      minPoseConfidence: 0.1,
      minPartConfidence: 0.5,
    },
    multiPoseDetection: {
      maxPoseDetections: 2,
      minPoseConfidence: 0.12,
      minPartConfidence: 0.07,
      nmsRadius: 20.0,
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

    console.log("mediadevices", navigator.mediaDevices);


    // List cameras id and microphones.
    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
      devices.forEach(function(device) {
        if (device.kind=="videoinput") {
          console.log(device.kind + ": " + device.label +
                    " id = " + device.deviceId);
                  }
      });
    })
  
    const video = document.getElementById('video');
    video.width = videoWidth;
    video.height = videoHeight;
  
    const stream = await navigator.mediaDevices.getUserMedia({
      'audio': false,
      'video': {
        // this is my external webcam id, it  will use another if it doesn't find it
        deviceId: '0165df6b12fef3ba881da9a0bf01b898860f7c2d254d972cab487a9d18a355be',
        facingMode: 'user',
        width: videoWidth,
        height: videoHeight,
      },
    });
    //console.log("media devices",stream);
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
      console.log("cameras found",cameras);
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

    let hiddenCanvas = document.createElement('canvas');
    hiddenCanvas.width = videoWidth;
    hiddenCanvas.height = videoHeight;
    let ctxH = hiddenCanvas.getContext('2d');

    let ctx = canvas.getContext('2d');
    let ctx2 = canvas2.getContext('2d');
  
    // since images are being fed from a webcam
    const flipHorizontal = true;
  
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
      

      // clear hidden canvas before redrawing
      ctxH.clearRect(0, 0, ctxH.canvas.width, ctxH.canvas.height);
      console.log(ctxH.height);

      poses.forEach(({score, keypoints}) => {
        lastKeypoints = keypoints;
        if (score >= minPoseConfidence) {
          if (guiState.output.showSkeleton) {
            drawSkeleton(keypoints, minPartConfidence, ctxH, 1, true);
            //drawSkeleton(keypoints, minPartConfidence, ctx2, 1, true);
          }
          if (guiState.output.showPoints) {
            drawKeypoints(keypoints, minPartConfidence, ctxH, 1, true);
            //drawKeypoints(keypoints, minPartConfidence, ctx2, 1, true);
          }
          if (guiState.output.showBoundingBox) {
            drawBoundingBox(keypoints, ctxH);
            //drawBoundingBox(keypoints, ctx2);
          }
        }
      });

      // copy hidden canvas to webcam overlay and skeleton image
      ctxH.globalAlpha = 1;
      ctx.drawImage(ctxH.canvas,0,0);
      ctx2.drawImage(ctxH.canvas,0,0);
  
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

    $('#stop_record').hide();

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
  window.clearInterval(timer);

  timer = setInterval( () => {tick.play(); saveCanvas()}, interval);

  $('#stop_record').show();
  $('#start_record').hide();
  console.log('recording');
}

function stopRecording() {
  window.clearInterval(timer);
  console.log('stop recording');
  $('#stop_record').hide();
  $('#start_record').show();
}

function singlePicture() {
  saveCanvas();
}

function saveZip() {
  stopRecording();
  console.log('saving zip');

  zip.generateAsync({type: 'blob'})
  .then(function(zip) {
      saveAs(zip, 'capture_images.zip');
  });
}  

function saveCanvas() {
  // enable download button
  $('#download_zip').removeAttr('disabled');

  // filename comes from pose name and number
  let name = $('#filename').val() + '_' + $('#image_counter').val();
  
  // convert to blob and add to zip
  let blob = dataURItoBlob(canvas2.toDataURL('image/png'));
  zip.file(`./imgs/${name}.png`, blob, {binary: true});
  // save keypoints as json in case we want to use them
  zip.file(`./json/${name}.json`, JSON.stringify(lastKeypoints,null,4)); 

  // show thumbnails
  let strFiles = $('#files').html();
  strFiles += '<figure><img width=\'100\' height=\'100\' src=\'data:image/png;'+ canvas2.toDataURL('image/png') + '\'><figcaption>' + name + '</figcaption></figure>';
  $('#files').html(strFiles);

  // count files in zip
  let total = 0;
  zip.folder('').forEach(function(relativePath, file) {
    //console.log(relativePath,file);
    if (!file.dir) total++;
  }); 

  // update counters
  $('#image_counter').val(+$('#image_counter').val()+1);
  $('#total').text(total);
}

// start aplication
bindPage();
