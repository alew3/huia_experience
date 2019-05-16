<template lang="html">
  <div class="title-container" ref="container">
    <h1 ref="title">
      <p v-for="item in this.title" v-bind:style="{'background' : getBackgroundColor()}">{{item}}</p>
    </h1>
    <canvas ref="animation" width="120" height="17"></canvas>
  </div>
</template>

<script>
import Globals from '../../core/Globals';
import NavigatorHelper from '../../helpers/NavigatorHelper';
import MathHelper from '../../helpers/MathHelper';
import StringsHelper from '../../helpers/StringsHelper';
import '../../vendors/ScrambleTextPlugin';

export default {

  data (){
    return{
      title : [],
      backgroundColor : "#ffff00"
    }
  },

  watch : {
    $route () {
      this.changeTitle();

      var route = this.$route.path.split("/").join("").toLowerCase();

      if(route.indexOf("about") > -1 && route != "about"){
        this.sendToBack();
      }else{
        this.bringToFront();
      }
    }
  },


  methods : {
    changeTitle () {
      this.$refs.container.style.width = "auto";
      this.$refs.container.style.height = "auto";

      var route = this.$route.path.split("/").join("").toLowerCase();


      if(route == "") route = "home";

      if(route.indexOf('about') > -1) route = "about";

      if(!Globals.TITLES[route] && route.indexOf('projects') == -1){
        this.title = [];
        return;
      }
      if(!Globals.TITLES[route]){
        if(window.projectTitle){
          this.title = window.projectTitle.toUpperCase().split("#");

          // if(window.MOBILE_DETECT.mobile())
          //   this.title = "";
        }else{
          this.title = [];

          if(!this.interval)
            this.initWaitForUpdate();
        }

      }else{
        this.title = Globals.TITLES[route].split("#");
      }

      window.projectTitle = null;
    },

    initWaitForUpdate () {
      this.interval = setInterval(this.checkVariables,300);
    },


    sendToBack(){
      if(!window.MOBILE_DETECT.mobile()) return;

      TweenMax.to(this.$refs.container, 0.5, {opacity : 0.1, x : -10, ease : Quint.easeOut});
    },

    bringToFront(){
      TweenMax.to(this.$refs.container, 0.5, {opacity : 1, x : 0, ease : Quint.easeOut});
    },

    checkVariables () {
      // console.log(window.projectTitle);
      if(window.projectTitle){
        clearInterval(this.interval);
        this.interval = null;
        this.changeTitle();
      }
    },

    getBackgroundColor () {
      var route = this.$route.path.split("/").join("").toLowerCase();
      if(route == "") route = "home";
      var color;

      if(route.indexOf('about') > -1) route = "about";

      if(!Globals.TITLES[route]){
        color = MathHelper.hexToRGB(window.detailColor);
      }else{
        color = MathHelper.hexToRGB(Globals.COLORS[route]);
      }
      return NavigatorHelper.getCssPrefix()+"linear-gradient(to right, rgba("+color.r+","+color.g+","+color.b+",0) 0%, rgba("+color.r+","+color.g+","+color.b+",0.2) 30%, rgba("+color.r+","+color.g+","+color.b+",1) 100%)";
    },

    createEaselContent () {
      this.stage = new createjs.Stage(this.$refs.animation);
      this.spritesheet = ContentLoader.SPRITESHEETS.animtitle;
      this.anim = new createjs.Sprite(this.spritesheet);
      this.anim.x = 120;
      this.anim.rotation = 90;
      this.anim.scaleX = this.anim.scaleY = 0.4;
      this.stage.addChild(this.anim);

      this.anim.gotoAndPlay(0);
      createjs.Ticker.setFPS(10);
      createjs.Ticker.addEventListener("tick", this.handleTick);
    },

    handleTick () {
      if(this.ignoreHandle) return;

      this.stage.update();
      if(this.anim.currentFrame == this.anim.spriteSheet._frames.length-1){
        this.anim.stop();
        this.ignoreHandle = true;
      }
    },
  },

  mounted () {
    this.changeTitle();
    this.createEaselContent();
    window.sectionTitle = this;
  },

  updated () {
    for(var i = 0; i < this.$refs.title.children.length; i++){
      var el = this.$refs.title.children[i];
      TweenMax.to(el, 1, {scrambleText:{text:this.title[i], chars:"-_-_O/", revealDelay:0, speed:0.1}});
      TweenMax.from(el, 0.3, {x : 30, opacity : 0, ease : Quint.easeOut, delay:i*0.1});
    }
    this.ignoreHandle = false;
    createjs.Ticker.setFPS(30);
    this.anim.gotoAndPlay(0);

    if((this.title.length == 1 && this.title[0] === "")||(this.title.length == 0)){
      this.$refs.container.style.visibility = "hidden";
    }else{
      this.$refs.container.style.visibility = "visible";
    }
    // this.$refs.container.style.width = Math.round(offset.height) + "px";
    // this.$refs.container.style.height = Math.round(offset.height + 50) + "px";
  }
}
</script>

<style lang="scss">
  div.title-container {
    position : fixed;
    bottom : 50px;
    right : 0px;
    display : block;
    float : left;
    pointer-events: none;
    transform : rotate(-90deg);
    padding-bottom : 24px;

    h1 {
      display : block;
      float : left;
      position : relative;
      transform-origin: right top;
      font-size : 12px;
      letter-spacing: 12px;
      color : #fff;
      font-family: 'open_sansextrabold', sans-serif;
      // transform : rotate(-90deg);
      transform-origin: left top;
      overflow: hidden;
      p {
        margin-top : 7px;
        display : block;
        float : right;
        position : relative;
        clear : both;
        margin-right : -6px;
        padding-left : 30px;
        padding-top : 1px;
        padding-bottom : 1px;
        text-align: right;
      }
    }

    canvas {
      position : absolute;
      clear : both;
      float : right;
      bottom : 0px;
      right : -23px;
      transform-origin: right top;
    }
  }



  @media screen and (max-width : 1024px){
    div.title-container {
      right : auto;
      left : -7vw;
      bottom : 5vh;
      transform : scale(0.75) rotate(-90deg);
    }
  }
</style>
