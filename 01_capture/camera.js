
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
const interval = 3000; // ms
let timer;
let last_keypoints;

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

    console.log("mediadevices", navigator.mediaDevices);


    // List cameras and microphones.

    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
      devices.forEach(function(device) {
        console.log(device.kind + ": " + device.label +
                    " id = " + device.deviceId);
      });
    })
  
    const video = document.getElementById('video');
    video.width = videoWidth;
    video.height = videoHeight;
  
    const stream = await navigator.mediaDevices.getUserMedia({
      'audio': false,
      'video': {
        deviceId: '413c333f15980debc49118b552c7d243a1aba16ece3417132f47ff05cd7387ce',
        // FaceTime HD Camera (05ac:8514) id = 7c67134ce2b1b2b877d4562f92b13003deb8f782235048328fb2c62e908789b7
        // Logitech HD Pro Webcam C920 (046d:082d) id = 413c333f15980debc49118b552c7d243a1aba16ece3417132f47ff05cd7387ce
        // Monitor Display iSight (05ac:8508) id = fbbf4804b3600b7899a2a7fb5f5b6afebf8637d94defd20f3fd166485a797532
        // Live! Cam inPerson HD VF0720 (041e:4089) id = c4aba1b13c2211e67260c8eb8e124194e3b00683e53b8ef93d40d0ea5c40788a
        facingMode: 'user',
        width: videoWidth,
        height: videoHeight,
      },
    });
    console.log("media devices",stream);
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
        last_keypoints = keypoints;
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
  window.clearInterval(timer);

  timer = setInterval(()=>{tick.play(); saveCanvas()}, interval);

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
    let name = $('#filename').val() + '_' + $('#image_counter').val();
    zip.file(`./json/${name}.json`, JSON.stringify(last_keypoints,null,4));
    //console.log('adding canvas to zip', file);
    
    let blob = dataURItoBlob(canvas2.toDataURL('image/png'));
    zip.file(`./imgs/${name}.png`, blob, {binary: true});

    $('#image_counter').val(+$('#image_counter').val()+1);

    let i = 0;
    let strFiles = '';
    zip.folder('./imgs/').forEach(function(relativePath, file) {
      strFiles += '<img width=\'100\' height=\'100\' src=\'data:image/png;'+ canvas2.toDataURL('image/png') + '\'>' + file.name + '<br/>';
      i++;
    });

    $('#files').html(strFiles);
    $('#total').text(i);

    $('#download_zip').removeAttr('disabled');   

    //timer = { countdown: 1};
    //var tween = TweenLite.to(timer, 1, {countdown:0, onUpdate:showTimer, onComplete:flash})
}

function showTimer() {
  //$("#countdown").text(timer.countdown.toFixed(0);
}

// start aplication
bindPage();