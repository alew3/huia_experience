<template lang="html">
  <div class="container" ref="container">
    <div class="gradient-bg" ref="bg"></div>
    <img class="feather" src="/static/images/feather-preloader.png" ref="feather"/>
    <img class="feather-shadow" src="/static/images/feather-preloader-shadow.png" ref="shadow"/>
    <div class="center-content">
      <div class="center-text" v-html="text" ref="centertext"></div>
      <div class="preloader-bar" ref="preloaderbar">
        <div class="preloader-percentage-shine" ref="percentageShine"></div>
        <div class="preloader-percentage" ref="percentage"></div>
        <div class="reflect" ref="reflect"></div>
        <div class="particle-emmiter" ref="particleEmmiter">
          <div v-for="i in 20"></div>
        </div>
        <!-- <div class="big-shine"></div> -->
      </div>
    </div>
  </div>
</template>

<script>
import ContentLoader from "../../loaders/ContentLoader";
import '../../vendors/Physics2DPlugin';
import LanguageHelper from '../../helpers/LanguageHelper';
import Globals from '../../core/Globals';


export default {
  /**
  * INITIAL INFO
  **/
  name : "Preloader",
  data () {
    return {
        progress : "0%",
        timeCompleted : false,
        loadCompleted : false,
        stepsLimit : 3,
        timeMin : (Globals.DEBUG) ? 4000 : 14000,
        text : ((LanguageHelper.LANGUAGE == 'pt_br') ? "<p>PORTUGUESNeque porro quisquam est qui</p><p>dolorem ipsum quia dolor sit amet,</p><p>consectetur adipisci veli</p>" : "<p>We are Huia, a tech studio dedicated to bringing ideas to life.</p><p>Huia was also a noble bird from New Zealand last seen in 1907.</p><p>In our site you can interact and imagine what the real bird was like.</p><p>Enjoy the experience.</p>"),
        text2 : ((LanguageHelper.LANGUAGE == 'pt_br') ? "<p>PORTUGUESNeque porro quisquam est qui</p><p>dolorem ipsum quia dolor sit amet,</p><p>consectetur adipisci veli</p>" : "<p>We are Huia, a tech studio dedicated to bringing ideas to life.</p><p>Huia was also a noble bird from New Zealand last seen in 1907.</p><p>In our site you can interact and imagine what the real bird was like.</p><p>Enjoy the experience.</p>")
    }
  },


  /**
  * LIFECYCLE
  **/
  mounted () {
    if(Globals.DEBUG){
      this.startLoading();
      return;
    }
    var del = 0;

    if(!window.MOBILE_DETECT.mobile()){
      this.splits = [];
      for(var i = 0; i < this.$refs.centertext.children.length; i++){
        var num = (this.$refs.centertext.children[i].innerHTML.length*0.01);
        var splitText = new SplitText(this.$refs.centertext.children[i], {type : "chars"});
        this.splits.push(splitText);
        // del += num;
      }
    }

    this.showTxt(0);

    TweenMax.fromTo(this.$refs.bg, 1, {opacity : 0}, {opacity : 1, delay : del});
    TweenMax.fromTo(this.$refs.feather, 2, {scaleX:0.9, scaleY : 0.9, opacity : 0}, {scaleX : 1, scaleY : 1, delay : del, opacity:1, ease : Quint.easeOut});

    this.$refs.preloaderbar.style.display = 'none';
    TweenMax.from(this.$refs.preloaderbar, 1, {width : 0, ease : Quint.easeOut, delay : del+1, onStart:()=>{this.$refs.preloaderbar.style.display = 'block';}, onComplete:this.startLoading.bind(this)});
    // ContentLoader.preloadSite(this.onProgressData);
    TweenMax.set(this.$refs.percentage, {width : 0});
    TweenMax.set(this.$refs.percentageShine, {width : 0});
    TweenMax.set(this.$refs.reflect, {width : 0});

    this.createParticles();
    this.loopFeather();
    // this.interval = window.setTimeout(this.endTimeout.bind(this), this.timeMin);
  },

  /**
  * METHODS
  **/
  methods : {
    startLoading () {
      ContentLoader.preloadSite(this.onProgressData);
      this.showParticles();
    },


    showTxt(num){
      for(var i = 0; i < this.$refs.centertext.children.length; i++){
        if(num == i){
          this.$refs.centertext.children[i].style.display = 'block';
        }else{
          this.$refs.centertext.children[i].style.display = 'none';
        }
      }

      if(this.splits){
        TweenMax.staggerFromTo(this.splits[num].chars, 1, {opacity :0}, {x : 0, y : 0, opacity : 1, scaleX : 1, rotation : 0, ease : Quint.easeIn,overwrite:false},0.02);
        TweenMax.to(this.splits[num].chars, 0.5, {x : 0, y : 0, opacity : 0, scaleX : 1, rotation : 0, ease : Quint.easeOut,overwrite:false, delay : 4.1, onComplete:this.showNext, onCompleteScope:this});
      }else{
        TweenMax.fromTo(this.$refs.centertext.children[num], 1, {opacity :0}, {x : 0, y : 0, opacity : 1, scaleX : 1, rotation : 0, ease : Quint.easeIn,overwrite:false});
        TweenMax.to(this.$refs.centertext.children[num], 0.5, {x : 0, y : 0, opacity : 0, scaleX : 1, rotation : 0, ease : Quint.easeOut,overwrite:false, delay : 4.1, onComplete:this.showNext, onCompleteScope:this});
      }

      this.currentIndex = num;

      // TweenMax.to(this, 5, {onComplete:this.showNext, onCompleteParams:this});
    },


    showNext (isLast) {
//console.log("this.loadCompleted " + this.loadCompleted);
      if(this.loadCompleted==true){

        //this.stepsLimit = this.currentIndex;
        //console.log("LOADING COMPLETED ENDING ");
      }
      if(this.currentIndex+1 == this.stepsLimit && !isLast){
        this.endTimeout();
        return;
      }


      if(this.currentIndex < this.stepsLimit)
        this.showTxt(this.currentIndex+1);
      else
        this.destroyPreloader();
    },

    loopFeather () {
      var rand = 10+Math.random()*10;
      var scale = 1 - ((10-rand)/100);
      var t = 4+Math.random()*1;
      TweenMax.to(this.$refs.feather, t,{y : rand, yoyo : true, ease : Linear.easeNone, repeat : 1, onComplete:this.loopFeather.bind(this)});
      TweenMax.to(this.$refs.shadow, t,{scaleX : scale, scaleY : scale, yoyo : true, ease : Linear.easeNone, repeat : 1});
    },

    createParticles () {
      for(var i = 0; i < this.$refs.particleEmmiter.children.length; i++){
        var el = this.$refs.particleEmmiter.children[i];
        el.style.display = 'block';
        var s = 1;
        TweenMax.set(el, {width : s, height : s, opacity : 0.6});
        TweenMax.set(el, {y : Math.random()*15, x : Math.random()*-40});
        var num = 1+Math.random()*1;
        var del = Math.random();
        TweenMax.to(el, num, {opacity : 0, physics2D:{velocity:5+Math.random() * 10, angle:180 + Math.random()*30, gravity:-20+Math.random()*40}, repeat : -1, delay:del });
      }
    },

    showParticles () {
      TweenMax.fromTo(this.$refs.particleEmmiter, 1, {opacity : 0}, {opacity : 1, y : -5});
    },

    endTimeout () {
      this.timeCompleted = true;
      if(this.loadCompleted){
        this.showNext(true);
        // this.destroyPreloader();
      }
    },

    destroyPreloader () {

      TweenMax.killTweensOf(this.$refs.feather);
      TweenMax.killTweensOf(this.$refs.shadow);
      // this.$emit("preloaderComplete");
      var del = 0;

      if(this.splits){
        for(var i = 0; i < this.splits.length; i++){
          TweenMax.staggerTo(this.splits[i].chars, 1, {opacity : 0,ease : Quint.easeIn},0.02);
          del += this.$refs.centertext.children[i].children.length;
        }
      }else{
        for(var i = 0; i < this.$refs.centertext.children.length; i++){
          TweenMax.staggerTo(this.$refs.centertext.children, 1, {opacity : 0,ease : Quint.easeIn},0.02);
          del += 1;
        }
      }
      del += 1;
      TweenMax.killChildTweensOf(this.$refs.particleEmmiter);
      this.$refs.particleEmmiter.style.display = 'none';
      TweenMax.to(this.$refs.bg, 0.5, {opacity : 0, delay : 1, ease : Linear.easeNone});
      TweenMax.to(this.$refs.feather, 0.5, {opacity : 0, delay : 1, ease : Linear.easeNone});
      TweenMax.to(this.$refs.shadow, 0.5, {opacity : 0, delay : 1, ease : Linear.easeNone});
      TweenMax.to(this, (del*0.02),{onComplete:this.endDestroy.bind(this)});
      // TweenMax.staggerTo(this.$refs.centertext.children, 1, {y : -30, opacity : 0, ease : Expo.easeInOut, delay : 0.1}, 0.1);
    },

    endDestroy () {
      this.$refs.centertext.style.display = "none";

      if(this.splits){
        for(var i =0 ; i < this.splits.length;i++){
          this.splits[i].revert();
        }
      }


      ContentLoader.setMetaTags(this.$router.currentRoute.path);
      this.$emit("preloaderComplete");
    },

    onProgressData (data){
      var p = ContentLoader.PROGRESS / 100;

      if(window.MOBILE_DETECT.mobile()){
        TweenMax.to(this.$refs.percentage, 1, {width : Math.round((window.innerWidth*0.7 * p)-10), ease : Expo.easeOut, onComplete:(ContentLoader.PROGRESS === 100 ? this.onCompleteData.bind(this) : null)});
        TweenMax.to(this.$refs.percentageShine, 1, {width : Math.round((window.innerWidth*0.7 * p)-10), ease : Expo.easeOut});
        TweenMax.to(this.$refs.reflect, 1, {width : Math.min(Math.round((window.innerWidth*0.7 * p)-10),40), x : Math.round((window.innerWidth*0.7 * p)-10)-Math.min(Math.round((window.innerWidth*0.7 * p)-10),40), ease : Expo.easeOut});
        TweenMax.to(this.$refs.particleEmmiter, 1, {x : Math.round((window.innerWidth*0.7 * p)-10), ease : Expo.easeOut});
      }else{
        TweenMax.to(this.$refs.percentage, 1, {width : 248 * p, ease : Expo.easeOut, onComplete:(ContentLoader.PROGRESS === 100 ? this.onCompleteData.bind(this) : null)});
        TweenMax.to(this.$refs.percentageShine, 1, {width : 248 * p, ease : Expo.easeOut});
        TweenMax.to(this.$refs.reflect, 1, {width : Math.min(248 * p,40), x : (248 * p)-Math.min(248 * p,40), ease : Expo.easeOut});
        TweenMax.to(this.$refs.particleEmmiter, 1, {x : 248 *p, ease : Expo.easeOut});
      }
      // this.progress = ContentLoader.PROGRESS.toString() + "%";
      // TweenMax.to(this.$refs.container, 0.5, {width : ContentLoader.PROGRESS + "%", ease : Quint.easeOut, onComplete:(ContentLoader.PROGRESS == 100 ? this.onCompleteData : null)});


    },

    onCompleteData (data){
      if(Globals.DEBUG){
        this.$emit("preloaderComplete");
        window.clearInterval(this.interval);
        return;
      }

      TweenMax.to(this.$refs.preloaderbar, 0.5, {opacity : 0,ease : Linear.easeNone});
      this.loadCompleted = true;
      this.stepsLimit = this.currentIndex;

      if(this.timeCompleted){
        this.destroyPreloader();
      }
    },

    setComplete (value){

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
    font-family: 'open_sanslight_italic';
    overflow: hidden;

    div.gradient-bg {
      position : absolute;
      top : 0px;
      left : 0px;
      width : 100vw;
      height : 100vh;

      /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#0a0a14+0,191923+100 */
      background: #0a0a14; /* Old browsers */
      background: -moz-radial-gradient(center, ellipse cover, #26263c 0%, #06050f 50%); /* FF3.6-15 */
      background: -webkit-radial-gradient(center, ellipse cover, #26263c 0%,#06050f 50%); /* Chrome10-25,Safari5.1-6 */
      background: radial-gradient(ellipse at center, #26263c 0%,#06050f 50%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#0a0a14', endColorstr='#06050f',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
    }

    img.feather{
      position : absolute;
      top : 50%;
      left : 50%;
      margin-left : -85px;
      margin-top : -163px;
    }

    img.feather-shadow {
      position : absolute;
      top : 50%;
      left : 50%;
      margin-left : -85px;
      margin-top : 120px;
      opacity: 0.3;
    }

    div.center-content {
      position : absolute;
      top : 50%;
      left : 50vw;
      width : 80vw;
      margin-top : -2vh;
      margin-left : -40vw;
      pointer-events: none;

      div.center-text {
        font-size : 14px;
        color : #9b82dc;
        text-transform: uppercase;
        text-align: center;
        position : relative;
        display: block;
        letter-spacing: 5px;
        line-height: 15px;
        font-family: 'open_sansbold';
        display : block;
        width : 100%;
        filter : drop-shadow(0px 0px 4px #9b82dc);
      }

      div.preloader-bar {
        width : 256px;
        height : 12px;
        background : transparent;
        border : 2px solid rgba(255,255,255,0.1);
        position : relative;
        display: block;
        margin : auto;
        margin-top : 120px;
        border-radius: 6px;

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
    }

    div.color-over {
      position : absolute;
      top : 0px;
      left : 0px;
      background : #191923;
      width : 100%;
      height : 100%;
      opacity : 0;
    }
  }


  @media screen and (max-width:1000px){
    div.container {

      div.gradient-bg{
        height : 50vh;
        top : 15vh;
      }

      img.feather{
        position : absolute;
        top : 50%;
        left : 50%;
        margin-left : -80px;
        margin-top : -245px;
        width : 160px;
      }

      img.feather-shadow {
        display: none;
      }

      div.center-content {
        top : 65%;
        left : 5vw;
        width : 90vw;
        margin-top : 5vw;
        margin-left : 0px;
        pointer-events: none;

        div.center-text {
          font-size : 3.8vw;
          letter-spacing: 0vw;
          line-height: 5.3vw;
          width : 80vw;
          left : 5vw;
        }

        div.preloader-bar {
          width : 70vw;
          height : 12px;
          background : transparent;
          border : 2px solid rgba(255,255,255,0.1);
          position : relative;
          display: block;
          margin : auto;
          margin-top : 10vw;
        }
      }
    }
  }
</style>
