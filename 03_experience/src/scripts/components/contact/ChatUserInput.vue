<template lang="html">
  <div class="input-container" ref="container" v-bind:class="{disabled : !this.inputEnabled}">
    <input maxChars="2048" spellcheck="false" type="text" v-bind:placeholder="typeTxt" ref="input" v-on:keyup.enter="submit" v-on:keypress="this.generalKeyPress" v-on:focus="this.onFocusField" v-on:blur="this.onBlurField"/>
    <DropzoneInput ref="dropzone"/>
    <div class="confirmation-buttons" ref="confirmationButtons">
      <button v-on:click="sendChat" ref="btnSend"><div class="bg-hover"></div><span>{{sendTxt}}</span></button>
      <button v-on:click="resetChat" ref="btnReset"><div class="bg-hover"></div><span>{{resetTxt}}</span></button>
    </div>
    <button v-on:click="submit" class="send-txt" ref="button"><div class="bg-hover"/><?xml version="1.0" ?><svg height="1792" viewBox="0 0 1792 1792" width="1792" xmlns="http://www.w3.org/2000/svg"><path d="M1764 11q33 24 27 64l-256 1536q-5 29-32 45-14 8-31 8-11 0-24-5l-453-185-242 295q-18 23-49 23-13 0-22-4-19-7-30.5-23.5t-11.5-36.5v-349l864-1059-1069 925-395-162q-37-14-40-55-2-40 32-59l1664-960q15-9 32-9 20 0 36 11z"/></svg><svg height="1792" viewBox="0 0 1792 1792" width="1792" xmlns="http://www.w3.org/2000/svg"><path d="M1764 11q33 24 27 64l-256 1536q-5 29-32 45-14 8-31 8-11 0-24-5l-453-185-242 295q-18 23-49 23-13 0-22-4-19-7-30.5-23.5t-11.5-36.5v-349l864-1059-1069 925-395-162q-37-14-40-55-2-40 32-59l1664-960q15-9 32-9 20 0 36 11z"/></svg></button>
  </div>
</template>

<script>
import ChatLoader from '../../loaders/ChatLoader';
import SoundsLoader from '../../loaders/SoundsLoader';
import DropzoneInput from "./inputs/DropzoneInput";

export default {
  components : {
    'DropzoneInput' : DropzoneInput
  },

  data()  {
    return {
      inputEnabled : true,
      answerType : 'text',
      typeTxt : ContentLoader.DATA_TEXTS.type,
      sendTxt : ContentLoader.DATA_TEXTS.send,
      resetTxt : ContentLoader.DATA_TEXTS.reset
    }
  },


  updated(){
    this.checkType();
  },

  beforeDestroy() {
    TweenMax.killTweensOf(this.$refs.container);
    TweenMax.killChildTweensOf(this.$refs.container);
  },

  mounted () {
    var cont = this.$refs.container;
    var input = this.$refs.input;
    var btn = this.$refs.button;
    TweenMax.set(cont, {transformOrigin : "30px 30px", left : "50%", width : 50});
    TweenMax.fromTo(cont, 0.5, {scale : 0}, {scale : 1, ease : Back.easeOut});
    TweenMax.from(btn, 0.5, {y : 50, ease : Quad.easeOut});
    TweenMax.to(cont, 0.3, {width : "100%", left : 0, ease : Quad.easeIn, overwrite:false, delay:0.5});
    TweenMax.from(input, 0.8, {x : 50, opacity : 0, ease : Quint.easeInOut, overwrite:false, delay:0.5});

    this.checkType(true);

    ChatLoader.setInput(this);
    this.$refs.dropzone.$on('uploadSuccess', this.onUploadSuccess);
    this.$refs.dropzone.$on('uploadError', this.onUploadError);
  },

  methods : {
    resetChat () {
      ChatLoader.resetChat(this.enableInput);
      this.restart();
      this.$refs.dropzone.removeFile();
    },
    setFinish(){
      TweenMax.to(this.$refs.btnSend, 0.5, {x : -120, ease : Back.easeInOut});
      TweenMax.to(this.$refs.btnReset, 0.5, {x : 0, marginTop : -30, ease : Back.easeInOut});
      TweenMax.to(this.$refs.container, 0.5, {width : 110, ease : Back.easeInOut});
    },
    restart() {
      TweenMax.to(this.$refs.btnSend, 0.5, {x : 0, ease : Back.easeInOut});
      TweenMax.to(this.$refs.btnReset, 0.5, {x : 0, marginTop : 0, ease : Back.easeInOut});
    },
    sendChat(){
      ChatLoader.sendForm();
    },

    enableInput () {
      this.inputEnabled = true;
    },

    checkType(first){
      var dif = 60;
      if(this.answerType.toLowerCase() == 'resume'){
        TweenMax.to(this.$refs.input, 0.5, {y : -dif, ease : Back.easeInOut});
        TweenMax.to(this.$refs.dropzone.$refs.container, 0.5, {y : 0, ease : Back.easeInOut});
        TweenMax.to(this.$refs.confirmationButtons, 0.5, {y : dif, ease : Back.easeInOut});
        TweenMax.to(this.$refs.container, 0.3, {width : "80%", left : "0", ease : Quad.easeIn, overwrite:false});
        TweenMax.to(this.$refs.button, 0.5, {x : 0, ease : Quint.easeOut});
      }else if(this.answerType.toLowerCase() == 'confirmation'){
        TweenMax.to(this.$refs.input, 0.5, {y : -dif*2, ease : Back.easeInOut});
        TweenMax.to(this.$refs.dropzone.$refs.container, 0.5, {y : -dif, ease : Back.easeInOut});
        TweenMax.to(this.$refs.confirmationButtons, 0.5, {y : 0, ease : Back.easeInOut});
        TweenMax.to(this.$refs.button, 0.5, {x : 100, ease : Quint.easeOut});
        TweenMax.to(this.$refs.container, 0.3, {width : 196, left : "0", ease : Quad.easeIn, overwrite:false});
      }else{
        TweenMax.to(this.$refs.input, 0.5, {y : 0, ease : Back.easeInOut});
        TweenMax.to(this.$refs.dropzone.$refs.container, 0.5, {y : dif, ease : Back.easeInOut});
        TweenMax.to(this.$refs.confirmationButtons, 0.5, {y : dif*2, ease : Back.easeInOut});
        TweenMax.to(this.$refs.button, 0.5, {x : 0, ease : Quint.easeOut});
        if(!first)
          TweenMax.to(this.$refs.container, 0.3, {width : "100%", left : 0, ease : Quad.easeIn, overwrite:false});
      }
    },

    submitFile () {
      if(!this.$refs.dropzone.hasFile){
        alert(ContentLoader.DATA_TEXTS.selectFile);
        return;
      }

      this.$refs.dropzone.uploadFile();
      this.inputEnabled = false;
      ChatLoader.startUserTyping();
    },

    onUploadSuccess(data){
      // ChatLoader.stopUserTyping();
      // this.$refs.dropzone.removeFile();
      // this.inputEnabled = true;
      ChatLoader.setResumeFile(data);
    },

    onUploadError(data){
      alert(ContentLoader.DATA_TEXTS.generalError);
      this.inputEnabled = true;
      this.$refs.dropzone.removeFile();
      ChatLoader.stopUserTyping();
    },
    submit () {
      if(!this.inputEnabled) return;

      if(this.answerType.toLowerCase() == 'resume'){
        this.submitFile();
        return;
      }
      if(this.$refs.input.value.length < 2)
        return;

      ChatLoader.sendUserMessage(this.$refs.input.value);
      this.$refs.input.value = "";

      setTimeout(function() {
        var $containerMessages = document.getElementById('chat-content');
        var top = $containerMessages.scrollHeight;
        TweenMax.to($containerMessages, 0.9, {scrollTo:top});
      }, 400);
    },

    startTyping() {
      ChatLoader.startUserTyping();
    },

    destroyTyping() {
      ChatLoader.stopUserTyping();
      clearInterval(this.typingInterval);
      this.typingInterval = null;
    },

    generalKeyPress (evt) {
      if(!this.inputEnabled) return;
      SoundsLoader.playSound("type", false, 0.1, 0);
      if(this.typingInterval == null){
        this.startTyping();
        this.typingInterval = setTimeout(this.destroyTyping, 700);
      }else{
        clearInterval(this.typingInterval);
        this.typingInterval = setTimeout(this.destroyTyping, 700);
      }
    },

    onFocusField(evt){
      window.focusField = evt;
      if(window.MOBILE_DETECT.mobile()){
        this.$emit('focusIn');
      }

    },

    onBlurField(evt){
      window.focusField = null;
      if(window.MOBILE_DETECT.mobile()){
        this.$emit('focusOut');
      }
      if(!evt.relatedTarget) return;



      if(evt.relatedTarget.tagName.toLowerCase() == 'button'){
          this.$refs.input.focus();
      }
    }
  }
}
</script>

<style lang="scss">
  div.input-container {
    display : block;
    float : left;
    position : relative;
    width : 100%;
    overflow : hidden;
    border : 2px solid #8f6fd5;
    padding : 0px 0px;
    margin-top : 20px;
    border-radius: 30px;
    height : 48px;

    transition : border-color 0.3s linear;

    // div.disabled {
    //   pointer-events: all !important;
    // }

    div.confirmation-buttons {
      position : absolute;
      top : 7px;
      left : 10px;

      button {
        font-family: 'open_sansbold', sans-serif;
        text-transform: uppercase;
        background : #8f6fd5;
        border : none;
        width : 80px;
        height : 30px;
        display : inline-block;
        margin-right : 10px;
        float : left;
        position : relative;
        overflow : hidden;
        border-radius: 30px;
        outline : none;

        span {
          transition : color 0.2s linear;
          color : #fff;

          position : absolute;
          top : 50%;
          left : 50%;
          text-align: center;
          transform : translate(-50%,-50%);
        }

        div.bg-hover {
          background : #fff;
          display : block;
          position : absolute;
          width : 100%;
          height : 100%;
          left : 0px;
          top : 0px;
          border-radius : 30px;
          transform : translateY(30px);
          opacity : 0;

          transition : transform 0.2s ease-out, opacity 0.2s ease-out;
        }

        &:hover{
          div.bg-hover{
            transform : translateY(0px);
            opacity : 1;
          }

          span {
            color : #8f6fd5;
          }
        }
      }
    }

    input {
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
    }



    button.send-txt {
      background : #8f6fd5;
      border : none;
      position : absolute;
      font-size : 0px;
      display : block;
      right : 4px;
      top : 3px;
      outline : none;
      width : 38px;
      height : 38px;
      border-radius : 50%;
      overflow : hidden;

      div.bg-hover {
        background : #fff;
        width : 38px;
        height : 38px;
        display : block;
        position : absolute;
        top : 0px;
        left : 0px;
        border-radius : 50%;
        transform : scale(0);
        transition : transform 0.2s ease-out;
      }

      svg {
        width : 18px;
        height : 18px;
        left : 8px;
        top : 10px;
        position : absolute;

        path {
          fill : #0f0f24;
        }

        transition : left 0.2s ease-in, top 0.2s ease-in, transform 0.2s ease-in;

        &:last-child {
          left : -15px;
          top : 40px;

          path {
            fill : #8f6fd5;
          }
        }
      }

      &:hover{
        div.bg-hover {
          transform : scale(1);
        }

        svg:not(:last-child) {
          left : 40px;
          top : -10px;
          transform : scale(0);
        }

        svg:last-child {
          left : 8px;
          top : 10px;
        }
      }
    }

    &.disabled {
      pointer-events : none;
      border-color : rgba(255,255,255,0.1);

      input {
        color : rgba(255,255,255,0.1);
      }

      button {
        background : rgba(255,255,255,0.1);
        opacity : 0.5;

        div.bg-hover {
          transform : scale(0);
        }
      }

      div.container {
        div.dropzone{
          color : rgba(255,255,255,0.1) !important;

          svg {
            path {
              fill : rgba(255,255,255,0.1) !important;
            }
          }
        }

        button {
          opacity : 0.2 !important;
        }
      }
    }
  }

  :-webkit-input-placeholder,::-moz-placeholder,:-ms-input-placeholder{
    color : #ff0000;
  }
</style>
