<template>
  <section class="home" id="home" ref="container">
    <div class="hit" id="home-hit" ref="home-hit" v-if="!isMobile()">
      <div class="timer" ref="timer">
        <div class="fill"><svg version="1.1" x="0px" y="0px"
        	 width="451.847px" height="451.847px" viewBox="0 0 451.847 451.847" style="enable-background:new 0 0 451.847 451.847;"
        	 xml:space="preserve">
        <g>
        	<path d="M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751
        		c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0
        		c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z"/>
        </g></svg></div>
        <div class="fill-glow"></div>
        <div class="icon">
          <div class="step1"></div>
        </div>
        <div class="texts">
          <div class="step5">{{this.getStep(4)}}</div>
        </div>
      </div>
    </div>
    <div class="interact-txt" ref="interactTxt" v-if="canShowInteract()">{{this.getInteractText()}}</div>
    <!-- <ExperienceButton v-if="!isMobile()" /> -->
    <!-- <InteractLayer v-if="!isMobile()" /> -->
  </section>
</template>


<script>
import TweenMax from 'gsap';
import '../vendors/easeljs';
import '../vendors/easeljswebgl';
import ContentLoader from '../loaders/ContentLoader';
import Globals from '../core/Globals';
import ExperienceButton from "./home/ExperienceButton";
import InteractLayer from "./home/InteractLayer";

export default{
  name: 'Home',
  data () {
    return {
      finished : false,
      txtstep1 : "",
      txtstep2 : "",
      txtstep3 : "",
      txtstep4 : "",
    }
  },

  components : {
    'ExperienceButton' : ExperienceButton,
    'InteractLayer' : InteractLayer
  },

  created (){
  },

  beforeDestroy () {

  },

  destroyed (){
  },

  computed : {
  },

  methods : {
    canShowInteract(){
      return !window.interactShown && !window.MOBILE_DETECT.mobile();
    },
    getInteractText () {
        return ContentLoader.DATA_TEXTS.interact;
    },

    isMobile() {
        return window.MOBILE_DETECT.mobile()
    },

    hideText(){
      if(!this.$refs.interactTxt || this.textHide)
        return;
      this.textHide = true;

      TweenMax.killTweensOf(this.$refs.interactTxt);
      TweenMax.killTweensOf(this.split.chars);

      // TweenMax.to(this.$refs.interactTxt, 0.5, {x : -50, opacity : 0, overwrite: false, force3D : true, ease : Quint.easeInOut});
      TweenMax.staggerTo(this.split.chars, 1, {opacity : 0, x : -30, force3D : true, ease : Quint.easeInOut}, 0.01);
    },

    getStep(n){
      if(n == 0)
        return ContentLoader.DATA_TEXTS.flap;
      else if(n == 1)
        return ContentLoader.DATA_TEXTS.shortJump;
      else if(n == 2)
        return ContentLoader.DATA_TEXTS.longJump;
      else if(n == 3)
        return ContentLoader.DATA_TEXTS.fly;
      else if(n == 4)
        return ContentLoader.DATA_TEXTS.land;
    }
  },


  destroyed(){
    window.homeTimer = null;
    window.homeLine = null;
  },

  mounted () {
    if(window.mainMenu){
      window.mainMenu.changeColor("#8C6EE5");
    }else{
     // TweenMax.to(this, 1, {onComplete:()=>{window.mainMenu.changeColor("#8C6EE5");}});
    }

    window.homeTimer = this.$refs.timer;
    window.homeLine = this.$refs.line;
    window.hideText = this.hideText;

    if(window.environment3d){
      window.environment3d.setBlur(false,true);
    }

    // TweenMax.from(this.$refs.experienceBtn, 1, {opacity : 0, delay : 1});
    // this.createSprites();

    if(this.$refs.interactTxt){
      this.split = new SplitText(this.$refs.interactTxt, {type : "chars"});
      TweenMax.staggerFromTo(this.split.chars, 1, {opacity : 0}, {opacity : 1, force3D : true, ease : Quint.easeInOut}, 0.01);
      TweenMax.fromTo(this.$refs.interactTxt, this.split.chars.length*0.1, {x : 100}, {x : 0, force3D : true, ease : Quint.easeOut});
      TweenMax.to(this.$refs.interactTxt, this.split.chars.length*0.1, {x : -50, delay : this.split.chars.length*0.1, overwrite: false, force3D : true, ease : Quint.easeInOut});
      TweenMax.staggerTo(this.split.chars, 0.5, {opacity : 0, force3D : true, delay : (this.split.chars.length*0.1)+0.7, ease : Quint.easeOut}, 0.01);
    }
    window.interactShown = true;
    window.huiaPrerenderReady = true;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
section#home {
  position : absolute;
  top : 0px;
  left : 0px;
  padding : 0px;
  width : 100%;
  height : 100%;
  display : block;
  overflow: hidden;

  div.interact-txt {
    font-size : 14px;
    color : #9b82dc;
    text-transform: uppercase;
    text-align: center;
    position : absolute;
    display: block;
    letter-spacing: 7px;
    font-family: 'open_sansbold';
    display : block;
    width : 100%;
    filter : drop-shadow(0px 0px 4px #9b82dc);
    top : 50%;
    margin-top : -6px;
    text-align: center;
    pointer-events: none;
  }

  .experience-btn {
    position : absolute;
    bottom : 10px;
    color : #ffffff;
    font-family: 'open_sansbold';
    font-size : 10px;
    text-transform: uppercase;
    left : 50%;
    transform : translateX(-50%);
    // display: none;
  }

  div.hit {
    width : 85vw;
    height : 100vh;
    position : relative;
    top : 0px;
    left : 15vw;
    // cursor : url('/static/images/cursor.png') -15 32, default;
    // cursor : none;
    div.line {
      position : absolute;
      width : 100px;
      height : 1px;
      opacity: 0.1;
      background : #8c6ee5;
      pointer-events: none;
      display: none;
      transform-origin : 1px 0px;
    }

    div.timer {
      position : absolute;
      top : 0px;
      left : 0px;
      display: block;
      float: left;
      pointer-events: none;
      display: none;
      width : 200px;
      height : 66px;

      div.fill{
        position : absolute;
        width : 66px;
        height : 66px;
        border-radius : 50%;
        display: block;
        border : 3px solid #8c6ee5;
        // background : #8c6ee5;
        opacity : 1;

        svg {
          position: absolute;
          width : 30px;
          height : 40px;
          top : 10px;
          left : 14px;
          display: block;
          g,path {
            fill : #8c6ee5;
          }
        }
      }

      div.fill-glow{
        position : absolute;
        width : 66px;
        height : 66px;
        border-radius : 50%;
        display: block;
        background : #8c6ee5;
        opacity : 0.3;
        filter : blur(5px);
      }

      div.icon {
        position : absolute;
        width : 66px;
        height : 66px;
        display: block;

        div.step1{
          position : absolute;
          width : 66px;
          height : 66px;
          border-radius : 50%;
          display: block;
          border : 2px solid #8c6ee5;
        }

        div.step2{
          position : absolute;
          width : 46px;
          height : 46px;
          border-radius : 50%;
          display: block;
          border : 2px solid #8c6ee5;
          top : 10px;
          left : 10px;
        }

        div.step3{
          position : absolute;
          width : 26px;
          height : 26px;
          border-radius : 50%;
          display: block;
          border : 2px solid #8c6ee5;
          top : 20px;
          left : 20px;
        }
      }

      div.texts {
        position : absolute;
        width : 300px;
        height : 30px;
        line-height: 30px;
        font-size: 14px;
        font-family: 'open_sansbold';
        text-transform: uppercase;
        color : #8c6ee5;
        letter-spacing: 8px;
        left : 80px;
        top : 20px;
        overflow: hidden;
      }
    }
  }
}


@media screen and (max-width : 1000px){
  section#home {
    width : 100vw;
    left : 0px;
    height : 30vh;
    bottom : 0px;
    top : auto;

    div.hit {
      // cursor : url('/static/images/cursor.png') -15 32, default;
      // cursor : none;
      div.line {
        display: none;
      }

      div.timer {
        display: none;
      }
    }
  }
}
</style>
