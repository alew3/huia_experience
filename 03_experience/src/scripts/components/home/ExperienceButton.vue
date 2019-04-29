<template lang="html">
  <div class="container" ref="container">
    <div class="border" ref="border"></div>
    <div class="dragger-target" ref="draggerTarget">
      <div class="glow" ref="draggerGlow"></div>
      <div class="bullet" ref="draggerTargetBullet"></div>
    </div>
    <div class="dragger" v-on:mouseover="onOverDrag" v-on:mouseout="onOutDrag" v-on:mousedown="onDownMouse" v-on:touchstart="onDownMouse" ref="dragger">
      <div class="bullet" ref="draggerBullet"></div>
    </div>
    <div class="text" ref="text">{{this.getText()}}</div>
  </div>
</template>

<script>
import ContentLoader from '../../loaders/ContentLoader';
export default {
  data () {
    return {
      totalWidth : 210
    }
  },

  methods : {
    getText () {
      return ContentLoader.DATA_TEXTS.connect;
    },
    onDownMouse(evt){
      if(evt.touches){
        this.iniMouseX = evt.touches[0].clientX;
        this.iniX = this.posX || 0;
      }else{
        this.iniMouseX = evt.clientX;
        this.iniX = this.posX || 0;
      }
      if(window.MOBILE_DETECT.mobile()){
        document.addEventListener('touchmove', this.onMoveMouse);
        document.addEventListener('touchend', this.onUpMouse);
      }else{
        document.addEventListener('mousemove', this.onMoveMouse);
        document.addEventListener('mouseup', this.onUpMouse);
      }
    },
    onUpMouse(evt){
      if(window.MOBILE_DETECT.mobile()){
        document.removeEventListener('touchmove', this.onMoveMouse);
        document.removeEventListener('touchend', this.onUpMouse);
      }else{
        document.removeEventListener('mousemove', this.onMoveMouse);
        document.removeEventListener('mouseup', this.onUpMouse);
      }

      var coef = (this.posX/((this.totalWidth/2)-17));

      if(coef < 0.5){
        this.posX = 0;
        this.onMoveMouse();
      }else{
        this.posX = ((this.totalWidth/2)-17);
        this.onMoveMouse();
      }
    },
    onOverDrag(evt){
      this.emmitParticles(100);
      TweenMax.to(this.$refs.draggerBullet, 0.5, {scaleX : 1.5, scaleY : 1.5, ease : Back.easeOut});
    },

    onOutDrag(evt){
      TweenMax.to(this.$refs.draggerBullet, 0.5, {scaleX : 1, scaleY : 1, ease : Back.easeOut});
    },
    onMoveMouse(evt){
      if(evt){

        if(evt.touches)
          this.posX = this.iniX + (evt.touches[0].clientX - this.iniMouseX);
        else
          this.posX = this.iniX + (evt.clientX - this.iniMouseX);
      }
      this.posX = Math.max(0,this.posX);
      this.posX = Math.min((this.totalWidth/2)-17,this.posX);
      var coef = (this.posX/((this.totalWidth/2)-17));

      if(coef > 0.7){
        // TweenMax.to(this.$refs.draggerTargetBullet, 0.3, {scaleX : 1 + ((1-coef)*4), ease : Quint.easeOut});
        // TweenMax.to(this.$refs.draggerBullet, 0.3, {scaleX : 1.5 + ((1-coef)*4), ease : Quint.easeOut});
        this.completed = true;
      }else{
        // TweenMax.to(this.$refs.draggerTargetBullet, 0.3, {scaleX : 1, ease : Quint.easeOut});
        // TweenMax.to(this.$refs.draggerBullet, 0.3, {scaleX : 1.5, scaleY : 1.5, ease : Quint.easeOut});
        this.completed = false;
      }

      if(!evt){
        TweenMax.to(this.$refs.draggerBullet, 0.3, {scaleX : 1, scaleY : 1, ease : Quint.easeOut});
      }
      TweenMax.to(this.$refs.dragger, (evt)?0.5:0.3, {x : this.posX, ease : Quad.easeOut, onUpdate:this.emmitParticles, onUpdateScope:this});
      TweenMax.to(this.$refs.draggerTarget, (evt)?0.5:0.3, {x : -this.posX, ease : Quad.easeOut});
      TweenMax.to(this.$refs.border, (evt)?0.5:0.3, {x : this.posX, width : this.totalWidth - ((this.totalWidth-34)*coef), ease : Quad.easeOut, onComplete:this.checkCompleted, onCompleteScope:this});

      TweenMax.staggerTo(this.split.chars, 0.3, {opacity : 0.3 + (coef*0.7)},0.05);


      if(this.completed){
        // this.completed = true;
        this.$refs.container.style.pointerEvents = "none";
        TweenMax.to(this.$refs.draggerBullet, 0.3, {scaleX : 1, scaleY : 1, ease : Quint.easeOut});
      }

    },

    checkCompleted () {
      if(!this.completed) return;

      TweenMax.killTweensOf(this.split.chars);
      TweenMax.staggerTo(this.split.chars, 0.3, {x : -10, opacity : 0, ease : Quint.easeInOut},0.01);
      TweenMax.to(this.$refs.border, 0.5, {scaleX : 1.5, scaleY : 1.5, opacity:0, ease : Quint.easeInOut});
      TweenMax.to(this.$refs.draggerTargetBullet, 0.5, {scaleX : 1.5, scaleY : 1.5, opacity:0, delay:0.1, ease : Quint.easeInOut});
      TweenMax.to(this.$refs.draggerBullet, 0.5, {scaleX : 1.5, scaleY : 1.5, opacity:0, delay:0.2, ease : Quint.easeInOut});
      TweenMax.to(this.$refs.draggerGlow, 0.5, {opacity:0, delay:0.2, ease : Quint.easeInOut,onComplete:this.goExperience, onCompleteScope:this});
    },

    goExperience() {
      this.$router.push('/experience');
    },

    emmitParticles (num) {
      var bounds = this.$refs.dragger.getBoundingClientRect();
      this.particlesOptions.position2d = {x : bounds.left+20, y : bounds.top+20};
      this.particlesOptions.position = null;
      if(window.environment3d){
        window.environment3d.emmitParticles(this.particlesOptions,num||2);
      }
    }
  },


  beforeDestroy () {
    document.removeEventListener('mousemove', this.onMoveMouse);
    document.removeEventListener('mouseup', this.onUpMouse);
  },


  mounted () {
    this.particlesOptions = {
      positionRandomness: 1,
      velocityRandomness: 0.1,
      velocity : new THREE.Vector3(-0.1,0.01,0),
      color: 0x8c6ee5,
      colorRandomness: 0,
      turbulence: .05,
      lifetime: 3,
      size: 2*(2/window.devicePixelRatio),
      tex : 'particle1.png',
      sizeRandomness: 1
    };

    this.onMoveMouse = this.onMoveMouse.bind(this);
    this.onUpMouse = this.onUpMouse.bind(this);
    this.split = new SplitText(this.$refs.text, {type : "chars"});

    TweenMax.from(this.$refs.container, 1.5, {opacity : 0, ease : Quint.easeInOut, delay : 1});
    TweenMax.staggerFromTo(this.split.chars, 1, {x : 10, opacity : 0},{x : 0, opacity : 0.3, ease : Quint.easeInOut, delay : 2}, 0.02);
    // TweenMax.fromTo(this.$refs.text, 1, {letterSpacing:0}, {letterSpacing : 10, ease : Quint.easeInOut});
  }
}
</script>

<style lang="scss" scoped>
  div.container {
    position : absolute;
    display: block;
    float : left;
    top : calc(100% - 130px);
    left : 50%;
    margin-left : -105px;
    width : 210px;
    height : 34px;

    div.border {
      position : absolute;
      display : block;
      float : left;
      top : 0px;
      left : 0px;
      width : 210px;
      height : 34px;
      border : 2px solid rgba(255,255,255,0.2);
      border-radius : 17px;
    }

    div.text {
      pointer-events: none;
      position : absolute;
      font-family: 'open_sansbold';
      font-size : 10px;
      color : #fff;
      text-transform: uppercase;
      position: absolute;

      top : 45px;
      width : 300px;
      left : 50%;
      margin-left : -150px;
      text-align: center;
      letter-spacing: 10px;
      div {
        opacity : 0.3;
      }
    }

    div.dragger-target {
      position : absolute;
      width : 34px;
      height : 34px;
      display : block;
      right : 0px;

      div.glow {
        position : absolute;
        top : 7px;
        left : 7px;
        width : 20px;
        height : 20px;
        background : #8c6ee5;
        border-radius: 50%;
        filter : blur(8px);
        opacity : 0.5;
      }

      div.bullet {
        width : 24px;
        height : 24px;
        // transform-origin: center right;
        box-sizing: border-box;
        border : 4px solid #8c6ee5;
        border-radius : 50%;
        position : absolute;
        top : 5px;
        left : 5px;
        display: block;
      }
    }

    div.dragger {
      position : absolute;
      top : 0px;
      left : 0px;
      width : 34px;
      height : 34px;
      display: block;
      cursor : pointer;

      div.bullet {
        pointer-events: none;
        position : absolute;
        top : 17px;
        left : 17px;
        width : 8px;
        height : 8px;
        background : #8c6ee5;
        margin-left : -4px;
        margin-top : -4px;
        border-radius : 50%;
        // transform-origin: center left;
      }
    }
  }


  @media screen and (max-width : 1000px){
    div.container {
      top : auto;
      bottom : 50px;
      z-index : 999999;

      div.text{
        font-size: 2vw;
        letter-spacing: 1vw;
      }
    }
  }
</style>
