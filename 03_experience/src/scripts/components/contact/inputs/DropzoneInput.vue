<template lang="">
  <div class="containerall" ref="container">
    <div class="container" v-bind:class="{'disabled' : this.hasFile}">
      <div class="percentage" ref="percentage"></div>
      <div class="dropzone" id="dropzoneResume" ref="container"> <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="673.221px" height="673.222px" viewBox="0 0 673.221 673.222" style="enable-background:new 0 0 673.221 673.222;" xml:space="preserve"> <path d="M470.486,136.597c13.158-13.77-13.158-41.279-26.347-27.509L138.69,428.215c0,0-68.452,71.543-5.263,137.547 c63.188,66.035,131.672-5.508,131.672-5.508l321.269-335.621c0,0,84.272-88.036-5.263-181.581 c-89.536-93.544-173.809-5.508-173.809-5.508L86.028,373.196c0,0-121.115,126.562-5.264,247.615s236.997-5.508,236.997-5.508 l321.27-335.652c13.158-13.739-13.158-41.279-26.347-27.509L291.446,587.764c0,0-94.799,99.052-184.335,5.508 c-89.535-93.544,5.264-192.565,5.264-192.565L433.613,65.054c0,0,57.926-60.527,121.146,5.508 c63.188,66.035,5.263,126.562,5.263,126.562L238.783,532.745c0,0-42.136,44.033-79.009,5.508s5.263-82.528,5.263-82.528 L470.486,136.597z"/> </svg>
      </div>
    </div>
    <button v-on:click="this.removeFile" v-if="this.hasFile" class="remove" ref="remove"><svg enable-background="new 0 0 32 32" height="32px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M20.377,16.519l6.567-6.566c0.962-0.963,0.962-2.539,0-3.502l-0.876-0.875c-0.963-0.964-2.539-0.964-3.501,0  L16,12.142L9.433,5.575c-0.962-0.963-2.538-0.963-3.501,0L5.056,6.45c-0.962,0.963-0.962,2.539,0,3.502l6.566,6.566l-6.566,6.567  c-0.962,0.963-0.962,2.538,0,3.501l0.876,0.876c0.963,0.963,2.539,0.963,3.501,0L16,20.896l6.567,6.566  c0.962,0.963,2.538,0.963,3.501,0l0.876-0.876c0.962-0.963,0.962-2.538,0-3.501L20.377,16.519z" fill="#515151"/></svg></button>
  </div>
</template>

<script>
import ChatLoader from '../../../loaders/ChatLoader';
import ContentLoader from '../../../loaders/ContentLoader';
import Dropzone from 'dropzone';

export default {
  data () {
    return {
      hasFile : false
    }
  },

  mounted (){
    TweenMax.set(this.$refs.percentage, {scaleX : 0});
    Dropzone.autoDiscover = false;
    this.createDropZone();
  },

  updated(){
    if(this.hasFile){
      // this.dropzone.disable();
    }else{
      this.dropzone.enable();
    }
  },

  methods : {
    createDropZone() {
      this.dropzone = new Dropzone("div#dropzoneResume",
      {
        url: ContentLoader.getApiUrl() + "contact/resume",
        paramName: "file", // The name that will be used to transfer the file
        maxFilesize: 15, // MB
        acceptFiles : "application/pdf",
        autoProcessQueue : false,
        uploadMultiple : false,
        // hiddenInputContainer : false,
        maxFiles : 1,
        dictDefaultMessage : ContentLoader.DATA_TEXTS.file,
        accept: function(file, done) {
            if(file.type != "application/pdf"){
              alert("Just PDF files.");
              done("error");
            }else{
              done();
            }
        }
      });

      this.dropzone.on('error', this.onErrorFile);
      this.dropzone.on('addedfile', this.onFileAdded);
      this.dropzone.on('uploadprogress', this.onFileProgress);
      this.dropzone.on('success', this.onFileSuccess);
    },

    onFileProgress(evt){
      TweenMax.set(this.$refs.percentage, {scaleX : evt.upload.progress / 100});
    },

    onFileSuccess(evt){
      var result = JSON.parse(evt.xhr.response);
      if(result.result == "success"){
        this.$emit('uploadSuccess', {newfile : result.file, file : this.dropzone.files[0]});
      }else{
        // this.removeFile();
        this.$emit('uploadError', {});
      }
    },

    onFileAdded(file){
      this.hasFile = true;
    },

    onErrorFile(evt, error2, error3){
      if(error2 != "error")
        alert(error2.error);

      this.dropzone.removeFile(evt);
      this.hasFile = false;
    },

    removeFile(){
      if(this.dropzone.files.length == 0) return;

      this.dropzone.removeFile(this.dropzone.files[0]);
      this.hasFile = false;
      TweenMax.set(this.$refs.percentage, {scaleX : 0});
    },


    uploadFile(){
      this.dropzone.processQueue();
    },
  }
}
</script>

<style lang="scss">
div.containerall {
  position : absolute;
  top : 0px;
  left : 0px;
  width : 85%;
  height : 100%;

  float : left;
  display: block;

  button.remove {
    position : absolute;
    top : 7px;
    right : 0px;
    outline : none;
    background : #8f6fd5;
    border : none;
    width : 30px;
    height : 30px;
    display: block;
    border-radius : 50%;

    color : #fff;
    transition: background 0.2s linear;

    svg {
      width : 15px;
      height : 15px;
      position : absolute;
      top : 7px;
      left : 7px;
      path {
        fill : #0f0f24;
      }
    }

    &:hover {
      background : #fff;
    }
  }
}
div.container {
  position : absolute;
  top : 0px;
  left : 0px;
  width : 100%;
  height : 100%;
  float : left;
  display: block;

  div.percentage {
    position : absolute;
    top : 0px;
    left : 0px;
    width : 120%;
    height : 100%;
    background : #fff;
    opacity : 0.1;

    transform-origin: 0px 0px;
  }

  &.disabled {
    div#dropzoneResume{
      pointer-events : none;
    }
  }
}
  div#dropzoneResume {
    font-family: 'open_sansbold', sans-serif;
    color : #8f6fd5;
    outline : none;
    border : none;
    background : none;

    width : 100%;
    display : block;

    font-size : 10px;
    padding : 15px 14px;
    padding-right : 60px;
    letter-spacing: 3px;

    transition : color 0.3s linear;

      position : absolute;
      top : 0px;
      left : 0px;
      height : 100%;
      cursor : pointer;
      transition : background 0.2s linear;

      &.dz-drag-hover {
        background : rgba(255,255,255,0.2);
      }




      & > svg, .dz-message {
        transition: transform 300ms cubic-bezier(0.175, 0.885, 0.320, 1.275); /* easeOutBack */
      }

      & > svg {
        width : 25px;
        height : 25px;
        position : absolute;
        top : 10px;

        path {
          fill : #8f6fd5;
        }
      }

      &:hover {
        & > svg {
          transform : scale(1.2) rotate(-5deg);
        }

        .dz-message {
          transform : translateX(10px);
        }
      }

      .dz-default {
        margin-left : 40px;
      }

      div.dz-preview {
        pointer-events: none;
        position : absolute;
        top : 50%;
        left : 50px;
        width : 100%;
        opacity : 0;
        transition : opacity 0.3s linear;
        transform : translateY(-50%);
        padding-left : 0px;
        padding-right: 80px;
        overflow : hidden;
        text-overflow: ellipsis;
        white-space : nowrap;

        .dz-filename {
          width : 100%;
          overflow: hidden;
        }

        .dz-error-message {
          display: none;
        }

        .dz-image {
          display: none;
        }



        .dz-success-mark, .dz-error-mark {
          display: none;
        }
      }

      &.dz-started{
        div.dz-default{
          opacity : 0;
        }
        div.dz-preview {
          opacity : 1;
        }
      }
    }
</style>
