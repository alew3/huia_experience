<template lang="html">
  <div class="container">
    <div class="preloader-bar" ref="preloaderbar">
      <div class="preloader-percentage-shine" ref="percentageShine"></div>
      <div class="preloader-percentage" ref="percentage"></div>
      <div class="reflect" ref="reflect"></div>
      <div class="particle-emmiter" ref="particleEmmiter">
        <div v-for="i in 20"></div>
      </div>
      <!-- <div class="big-shine"></div> -->
    </div>
    <div class="experienceContainer" ref="experienceContainer">
      <div class="gradient-bg"></div>
      <canvas id="container" ref="canvas"></canvas>
      <div class="img-hover"></div>
      <div class="img-noise" ref="imgNoise"></div>
      <div class="names-container" ref="namesContainer"></div>
    </div>
    <UserInput v-on:completeForm="onCompleteForm" v-if="!formCompleted"/>
    <CloseButton color="#8c6ee5" ref="closeBtn" />
  </div>
</template>

<script>
import Experience from './experience/Experience';
import UserInput from './experience/components/UserInput';
import CloseButton from './experience/components/CloseButton';
import ContentLoader from '../loaders/ContentLoader';
import Globals from '../core/Globals';
import LanguageHelper from '../helpers/LanguageHelper';

export default {
  components : {
    'UserInput' : UserInput,
    'CloseButton' : CloseButton
  },

  data () {
    return {
      formCompleted : false,
      preloadCompleted : false,
    }
  },

  methods : {
    startExperienceTransition () {
      TweenMax.to(this, 0.5, {onComplete:this.destroyMenus, onCompleteScope:this});
    },

    destroyMenus () {
      window.app.experience = true;
      window.environment3d.flyToExperience();
    },

    experienceAnim () {
      console.log("epxerience anim");
      this.$refs.closeBtn.color = "#ffffff";
      this.experience.firstAnimation();
    },

    onCompleteForm (){
      this.formCompleted = true;

      if(this.preloadCompleted){
        this.createExperience();
      }
    },

    onProgress(evt){
      var p = ContentLoader.PROGRESS / 100;
      if(evt == "hehe"){
        p = 0;
      }

      TweenMax.to(this.$refs.percentage, 1, {width : 150 * p, ease : Expo.easeOut, onComplete:(ContentLoader.PROGRESS === 100 ? this.onCompleteData.bind(this) : null)});
      TweenMax.to(this.$refs.percentageShine, 1, {width : 150 * p, ease : Expo.easeOut});
      TweenMax.to(this.$refs.reflect, 1, {width : Math.min(150 * p,20), x : (150 * p)-Math.min(150 * p,20), ease : Expo.easeOut});
      TweenMax.to(this.$refs.particleEmmiter, 1, {x : 150 *p, ease : Expo.easeOut});

      if(ContentLoader.PROGRESS == 100 && evt != "hehe"){
        this.preloadCompleted = true;
        TweenMax.killTweensOf(this.$refs.preloaderbar);
        TweenMax.to(this.$refs.preloaderbar, 0.5, {opacity : 0});
      }
      // if(ContentLoader.PROGRESS == 100){
      //   this.createExperience();
      // }
    },

    onCompleteData(end){
      if(this.formCompleted){
        this.createExperience();
      }
    },

    startHere () {
      window.experiencePlayed = true;
      window.environment3d.destroy();
      this.experience = new Experience(this.$refs.canvas, this.$refs.namesContainer);
      this.$refs.closeBtn.color = "#ffffff";
      TweenMax.fromTo(this.$refs.experienceContainer, 2, {opacity : 0}, {opacity : 1});
      TweenMax.fromTo(this.$refs.namesContainer, 2, {opacity : 0}, {opacity : 1});
      TweenMax.fromTo(this.$refs.canvas, 2, {opacity : 0}, {opacity : 1});
      TweenMax.fromTo(this.$refs.imgNoise, 2, {opacity : 0}, {opacity : 0.1});
    },

    createExperience () {
      if(ContentLoader.DATA_ISLAND == null){
        ContentLoader.loadExperience(this.onProgress.bind(this));
      }else{
        TweenMax.to(window.environment3d.canvas, 0.5, {opacity : 0, onComplete:this.startHere, onCompleteScope:this});
      }
    }
  },
  mounted () {
    if(Globals.DEBUG){
      window.experiencePlayed = true;
      this.createExperience();
      return;
    }
    window.experiencePlayed = true;
    window.huiaPrerenderReady = true;
    if(window.mainMenu)
    {
      window.mainMenu.hideToExperience();
      window.qualityControlUi.hideToExperience();
    }

    this.onProgress("hehe");

    TweenMax.to(this, 0.5, {onComplete : this.startExperienceTransition, onCompleteScope : this});
    TweenMax.from(this.$refs.preloaderbar, 1, {y : 50, opacity:0, ease : Quint.easeInOut});
    ContentLoader.loadExperience(this.onProgress.bind(this));
  },

  destroyed () {
    if(this.experience){
      this.experience.destroy();
    }
  }
}
</script>

<style lang="scss" scoped>
div.container {
  position : absolute;
  top : 0px;
  left : 0px;
  width : 100%;
  height : 100%;

  div.preloader-bar {
    width : 156px;
    height : 12px;
    background : transparent;
    border : 2px solid rgba(255,255,255,0.1);
    position : absolute;
    display: block;
    margin : auto;
    top : 75vh;
    border-radius: 6px;
    left : 50%;
    margin-left : -78px;

    div.preloader-percentage-shine {
      display : block;
      width : 40px;
      height : 4px;
      background : #9b82dc;
      border-radius: 3px;
      left : 2px;
      position : absolute;
      top : 2px;
      filter : blur(8px);
      transform-origin: center left;
    }

    div.preloader-percentage{
      display : block;
      width : 0px;
      height : 4px;
      background : #8f6fd5;
      border-radius: 3px;
      left : 2px;
      position : absolute;
      top : 2px;
      transform-origin: center left;
    }

    div.particle-emmiter {
      position : absolute;
      opacity : 0;

      & > div {
        width : 1px;
        height : 1px;
        background : #ffffff;
        top : 0px;
        left : 0px;
        display : block;
        border-radius : none;
        display : none;
        position : absolute;
      }
    }

    div.reflect {
      display : block;
      width : 40px;
      height : 4px;
      border-radius: 50% 3px;
      left : 2px;
      position : absolute;
      top : 2px;
      transform-origin: center left;

      background: #8f6fd5; /* Old browsers */
      background: -moz-linear-gradient(left, #8f6fd5 0%, #ffffff 100%); /* FF3.6-15 */
      background: -webkit-linear-gradient(left, #8f6fd5 0%,#ffffff 100%); /* Chrome10-25,Safari5.1-6 */
      background: linear-gradient(to right, #8f6fd5 0%,#ffffff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#8f6fd5', endColorstr='#ffffff',GradientType=1 ); /* IE6-9 */
      filter : blur(1px);
    }

    div.big-shine {
      display : block;
      width : 80px;
      height : 20px;
      border-radius: 80% 10px 50% 10px;
      left : 2px;
      position : absolute;
      top : -2px;
      transform-origin: center left;
      background : #fbdbfe;
      opacity : 0.3;
      filter : blur(10px);
    }
  }


  div.experienceContainer{
    position : absolute;
    top : 0px;
    left : 0px;
    width : 100%;
    height : 100%;
    opacity : 0;

    div.gradient-bg {
      position : absolute;
      display: block;
      width : 100%;
      height: 100%;
      /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#191923+0,0a0a14+100 */
      background: #0a0a14; /* Old browsers */
      background: -moz-radial-gradient(center, ellipse cover, #26263c 0%, #06050f 50%); /* FF3.6-15 */
      background: -webkit-radial-gradient(center, ellipse cover, #26263c 0%,#06050f 50%); /* Chrome10-25,Safari5.1-6 */
      background: radial-gradient(ellipse at center, #26263c 0%,#06050f 50%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#0a0a14', endColorstr='#06050f',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
    }

    canvas {
      position : absolute;
      display : block;
      width : 100% !important;
      height : 100% !important;
      background : #ffffff;
      // transform : scaleY(-1);
      // display: none;
    }

    div.img-hover {
      position : absolute;
      top : 0px;
      left : 0px;
      background : url('/static/images/huia-bg.png') center center no-repeat;
      background-size : cover;
      width : 100%;
      height : 100%;
      display : none;
    }

    div.img-noise {
      position : absolute;
      top : 0px;
      left : 0px;
      background : url('/static/images/noise.png') center center repeat;
      width : 100%;
      height : 100%;
      opacity : 0.1;
      pointer-events: none;
      // display : none;
    }

    div.names-container {
      position : absolute;
      top : 0px;
      left : 0px;
      pointer-events: none;
      width : 100%;
      height : 100%;
      color : #000;
      overflow: hidden;

      div {
        position : absolute;
        color : #000;
        font-family: 'open_sansbold';
      }
    }

    div.color-hover {
      position : absolute;
      top : 0px;
      left : 0px;
      width : 100%;
      height : 100%;
      background : rgba(0,0,0,0.3);
      pointer-events: none;
      display: none;
      // display : none;
    }


  }



}
</style>
