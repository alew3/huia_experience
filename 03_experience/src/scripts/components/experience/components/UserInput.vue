<template lang="html">
  <div class="container" ref="container">
    <div class="step1" ref="step1" v-if="step == 1">
      <div class="center-text" v-html="textName" ref="txtName"></div>
      <div class="input-container" ref="containerName">
        <input maxLength="25" spellcheck="false" type="text" v-bind:placeholder="typeTxt" ref="inputName" v-on:keyup.enter="submitName"/>
        <button v-on:click="submitName" class="send-txt" ref="button"><div class="bg-hover"/><?xml version="1.0" ?><svg height="1792" viewBox="0 0 1792 1792" width="1792" xmlns="http://www.w3.org/2000/svg"><path d="M1764 11q33 24 27 64l-256 1536q-5 29-32 45-14 8-31 8-11 0-24-5l-453-185-242 295q-18 23-49 23-13 0-22-4-19-7-30.5-23.5t-11.5-36.5v-349l864-1059-1069 925-395-162q-37-14-40-55-2-40 32-59l1664-960q15-9 32-9 20 0 36 11z"/></svg><svg height="1792" viewBox="0 0 1792 1792" width="1792" xmlns="http://www.w3.org/2000/svg"><path d="M1764 11q33 24 27 64l-256 1536q-5 29-32 45-14 8-31 8-11 0-24-5l-453-185-242 295q-18 23-49 23-13 0-22-4-19-7-30.5-23.5t-11.5-36.5v-349l864-1059-1069 925-395-162q-37-14-40-55-2-40 32-59l1664-960q15-9 32-9 20 0 36 11z"/></svg></button>
      </div>
    </div>

    <div class="step2" ref="step2" v-if="step == 2">
      <div class="center-text" v-html="textCity" ref="txtCity"></div>
      <div class="notrequired" ref="notrequired">{{notrequiredTxt}}</div>
      <div class="cityandcountry-line">
        <div class="input-container city" ref="containerCity">
          <input maxLength="64" spellcheck="false" type="text" v-bind:placeholder="cityTxt" ref="inputCity"/>
        </div>
        <CountryDropDown ref="dropdown"/>
      </div>
      <div class="checkbox-line" ref="checkboxLine">
        <input type="checkbox" ref="checkFullscreen" name="fullscreen" id="fullscreen" checked></input>
        <label for="fullscreen">{{fullscreenTxt}}</label>
        <div class="bullet"></div>
        <button class="skip" v-on:click="showStep3" ref="btnSkip">{{skipTxt}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import LanguageHelper from '../../../helpers/LanguageHelper';
import ContentLoader from '../../../loaders/ContentLoader';
import Globals from '../../../core/Globals';
import CountryDropDown from './CountryDropDown';


export default {
  components : {
      'CountryDropDown' : CountryDropDown
  },

  methods : {
      submitName () {
        if(this.$refs.inputName.value.length < 3){
          TweenMax.to(this.$refs.containerName, 0.15, {rotation:1, scaleX : 1.1, scaleY : 1.1, ease : Quint.easeIn, yoyo : true, repeat : 3});
        }else{
          Globals.USER_DATA.userName = this.$refs.inputName.value;
          this.showStep2();
        }
      },


      showStep1 (del) {
        del = del || 2;
        for(var i = 0; i < this.$refs.txtName.children.length; i++){
          var split = new SplitText(this.$refs.txtName.children[i], {type : "chars"});
          TweenMax.staggerFromTo(split.chars, 1, {opacity : 0}, {opacity : 1, delay : del, ease : Linear.easeNone},0.015);
        }
        TweenMax.set(this.$refs.containerName, {width : 41, x : 130, opacity : 0});
        TweenMax.fromTo(this.$refs.containerName, 0.3, {scaleX : 0.8, scaleY : 0.8, opacity : 0},{scaleX : 1, scaleY : 1, opacity : 1, ease : Back.easeOut, delay:del+0.5});
        TweenMax.to(this.$refs.containerName, 1, {width:300, x : 0, delay : del+0.8, ease : Quint.easeInOut});
      },

      showStep2(del) {

        if(this.$refs.step1){
          this.$refs.step1.style.pointerEvents = "none";
        }
        this.step = 2;

        if(!this.$refs.txtCity)
          return;

        ContentLoader.getGeolocationData(this.onCompleteGeo);
        for(var i = 0; i < this.$refs.txtCity.children.length; i++){
          var split = new SplitText(this.$refs.txtCity.children[i], {type : "chars"});
          TweenMax.staggerFromTo(split.chars, 1, {opacity : 0}, {opacity : 1, delay : del, ease : Linear.easeNone},0.015);
        }

        this.$refs.notrequired.style.width = "100%";
        TweenMax.fromTo(this.$refs.notrequired, 1, {opacity : 0}, {opacity : 0.3, delay : del+0.3});
        this.$refs.step2.style.pointerEvents = "all";


        if(window.MOBILE_DETECT.mobile()){
          TweenMax.fromTo(this.$refs.containerCity, 1, {width : "10vw", opacity : 0}, {width : "90vw", delay : del, opacity : 1, ease : Quint.easeInOut});
          TweenMax.fromTo(this.$refs.dropdown.$refs.container, 1, {width : "0vw", opacity : 0, x: 0}, {width : "90vw", x : 0, delay : del, opacity : 1, ease : Quint.easeInOut});
        }else{
          TweenMax.fromTo(this.$refs.containerCity, 1, {width : 30, opacity : 0}, {width : 180, delay : del, opacity : 1, ease : Quint.easeInOut});
          TweenMax.fromTo(this.$refs.dropdown.$refs.container, 1, {width : 30, opacity : 0, x: 340}, {width : 180, x : 0, delay : del, opacity : 1, ease : Quint.easeInOut});
        }
        TweenMax.fromTo(this.$refs.checkboxLine, 1, {x : -50, opacity : 0},{x : 0, opacity : 1, ease : Quint.easeInOut, delay:del});
        TweenMax.fromTo(this.$refs.btnSkip, 1, {x : 100, opacity : 0},{x : 0, opacity : 1, ease : Quint.easeInOut, delay:del});
      },

      onCompleteGeo(data){
        if(!this.$refs.inputCity)
          return;

        this.$refs.inputCity.value = data.userCity;

        var obj = null;
        for(var i = 0; i < ContentLoader.DATA_COUNTRIES.length; i++){
            if(ContentLoader.DATA_COUNTRIES[i].code.toLowerCase() == data.userCountry.toLowerCase()){
              obj = ContentLoader.DATA_COUNTRIES[i];
            }
        }

        if(obj)
          this.$refs.dropdown.selectItem(obj);
      },


      showStep3() {
        if(this.$refs.checkboxLine.querySelectorAll('input[type="checkbox"]:checked').length > 0){
          var elem = document.body;
          if (elem.requestFullscreen) {
            elem.requestFullscreen();
          } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
          } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
          } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
          }
        }
        // this.step = 3;

        Globals.USER_DATA.userCity = this.$refs.inputCity.value;

        if(this.$refs.dropdown.selectedItem){
          Globals.USER_DATA.userCountry = this.$refs.dropdown.selectedItem.code.toLowerCase();
          Globals.USER_DATA.userCountryName = this.$refs.dropdown.selectedItem.name;
        }

        this.$refs.container.style.pointerEvents = "none";
        TweenMax.to(this.$refs.container, 0.5, {opacity : 0, onComplete:this.submitAll, onCompleteScope:this});
      },


      submitAll () {
        this.$emit("completeForm");
      }
  },


  mounted () {
    // this.showStep2(0);
    this.showStep1(3);
  },

  updated () {
    if(this.$refs.txtCity){
      this.showStep2(0);
    }
  },


  data(){
    return{
      step : 1,
      no : (LanguageHelper.LANGUAGE == 'pt_br') ? "Começar" : "Start!",
      typeTxt : ContentLoader.DATA_TEXTS.nicknamePlaceholder,
      cityTxt : ContentLoader.DATA_TEXTS.cityPlaceholder,
      textName : ContentLoader.DATA_TEXTS.textname,
      textCity : ContentLoader.DATA_TEXTS.textcity,
      skipTxt : ContentLoader.DATA_TEXTS.skip,
      fullscreenTxt : ContentLoader.DATA_TEXTS.fullscreen,
      notrequiredTxt : ContentLoader.DATA_TEXTS.notrequired
    }
  }
}
</script>

<style lang="scss" scoped>
  div.container {
      position : absolute;
      display: block;
      top : 50%;
      left : 50%;
      display: block;
      float : left;
      width : auto;
      height : auto;
      transform : translate(-50%, -50%);

      div.step1, div.step2 {
        position : relative;
        top : 0px;
        left : 0px;
        display: block;
        float : left;
      }

      div.center-text {
        font-size : 12px;
        color : #9b82dc;
        text-transform: uppercase;
        text-align: center;
        position : relative;
        display: block;
        letter-spacing: 5px;
        line-height: 30px;
        font-family: 'open_sansbold';
        display : block;
        float : left;
        filter : drop-shadow(0px 0px 4px #9b82dc);
      }

      div.notrequired {
        font-size : 12px;
        color : #fff;
        position : relative;
        clear : both;
        float : left;
        width : 100%;
        text-align: center;
        font-family: 'open_sanssemibold';
        text-transform: uppercase;
        margin-top : 10px;
        opacity : 0.1;
        letter-spacing: 5px;
      }

      div.cityandcountry-line {
        display: block;
        float: left;
        position : relative;
        clear : both;
        float : left;
        width : 380px;
        left : 50%;
        margin-top : 30px;
        margin-left : -190px;


      }

      div.checkbox-line {
        display : block;
        position : relative;
        float : left;
        clear : both;
        width : 380px;
        margin-top : 30px;
        left : 50%;
        margin-left : -190px;

        div.bullet {
          position : absolute;
          background : #8f6fd5;
          width : 20px;
          height : 20px;
          top : 15px;
          left : 9px;
          display : block;
          border-radius : 50%;
          display: none;
          pointer-events: none;
          // transform : scale(0);

          // transition : transform 0.3s ease-in-out;
        }

        input {
          opacity : 0;
          position : absolute;
          left : 0px;
          pointer-events: none;

          &+label {
            font-family: 'open_sansbold';
            color : #8f6fd5;
            font-size : 13px;
            padding-left : 50px;
            position : absolute;
            line-height : 34px;
            cursor : pointer;
            left : 0px;
            margin-top : 8px;
            text-transform: uppercase;

            &:before {
              content : "";
              width : 34px;
              height : 34px;
              margin-top : -2px;
              margin-left : -50px;

              border : 2px solid #8f6fd5;
              display : block;
              position : absolute;
              border-radius : 50%;
            }
          }


          &:checked {
            &+label {
              &+.bullet{
                display: block;
              }
            }
          }
        }

        button.skip {
          background : #8f6fd5;
          border : none;
          color : #fff;
          font-size : 13px;
          text-transform: uppercase;
          font-family: 'open_sansbold';
          padding : 12px 16px;
          border-radius : 20px;
          position : absolute;
          border : none;
          clear : both;
          outline : none;
          top : 6px;
          left : 50%;
          text-align: center;
          transition : background 0.2s linear, color 0.2s linear;
          &:hover {
            color : #8f6fd5;
            background : #fff;
          }
        }
      }

      div.input-container {
        display : inline-block;
        float : left;
        clear : both;
        position : relative;
        width : 300px;
        overflow : hidden;
        border : 2px solid #8f6fd5;
        padding : 0px 0px;
        margin-top : 20px;
        border-radius: 50px;
        height : 40px;
        background : rgba(10,10,20,0.5);
        left : 50%;
        margin-left : -150px;
        transition : border-color 0.3s linear;

        input {
          font-family: 'open_sansbold', sans-serif;
          color : #8f6fd5;
          outline : none;
          border : none;
          background : none;

          width : 85%;
          display : block;

          font-size : 10px;
          padding : 11px 14px;
          padding-right : 60px;
          letter-spacing: 1px;

          transition : color 0.3s linear;
        }

        &.city {
          width : 180px;
          margin-left : 0px;
          left : 0px;

          input {
            width : 100% !important;
            padding-right : 14px;
          }
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
          width : 30px;
          height : 30px;
          border-radius : 50%;
          overflow : hidden;

          div.bg-hover {
            background : #fff;
            width : 30px;
            height : 30px;
            display : block;
            position : absolute;
            top : 0px;
            left : 0px;
            border-radius : 50%;
            transform : scale(0);
            transition : transform 0.2s ease-out;
          }

          svg {
            width : 14px;
            height : 14px;
            left : 8px;
            top : 8px;
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
              left : 7px;
              top : 8px;
            }
          }
        }
      }



      :-webkit-input-placeholder,::-moz-placeholder,:-ms-input-placeholder{
        color : #ff0000;
      }
  }



  @media screen and(max-width : 1000px){

      div.container {
          top : 50%;
          left : 5vw;
          display: block;
          float : left;
          transform : translateY(-50%);
          width : 90vw;
          div.step1, div.step2 {
          }

          div.center-text {
            font-size : 3vw;
            letter-spacing: 0.5vw;
            line-height: 6vw;
            width : 90vw;
          }

          div.notrequired {
            font-size : 3vw;
            margin-top : 5vw;
            letter-spacing: 0vw;
            width : 90vw;
          }

          div.cityandcountry-line {
            width : 90vw !important;
            left : 0vw;
            margin-top : 5vw;
            margin-left : 0px;
          }

          div.checkbox-line {
            width : 80vw;
            margin-top : 5vw;
            left : 10vw;
            margin-left : 0px;
          }
      }
  }
</style>
