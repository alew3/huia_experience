<template lang="html">
  <div class="control-ui-container" ref="container">
    <div class="sound" ref="sound">
      <div class="bar" v-bind:style="{background : this.color}"></div>
      <div class="bar" v-bind:style="{background : this.color}"></div>
      <div class="bar" v-bind:style="{background : this.color}"></div>
      <div class="bar" v-bind:style="{background : this.color}"></div>
      <div class="bar" v-bind:style="{background : this.color}"></div>
      <div class="bar" v-bind:style="{background : this.color}"></div>
      <div class="glow" v-bind:style="{background : this.color}"></div>
      <div class="hit" v-on:click="toggleSound"></div>
    </div>
    <div class="quality-control" ref="qualityControl" v-if="!isMobile">
      <div class="txt" v-bind:style="{color : this.color}">
        <!-- <div class="hd" ref="qualityhd">HD</div>
        <div class="md" ref="qualitymd">MD</div>
        <div class="sd" ref="qualitysd">SD</div> -->
      </div>
      <div class="dragger">
        <div class="line"></div>
        <div class="bullet" ref="bullet" v-bind:style="{background : this.color}"></div>
        <div class="hit" ref="draghit" v-on:mousedown="onDownQualityHit"></div>
      </div>
    </div>
  </div>
</template>

<script>
import SplitText from '../../vendors/SplitText.min';
import SoundsLoader from "../../loaders/SoundsLoader";

export default {
  data () {
    return {
      color : "#8c6ee5",
      soundEnabled : true,
      isMobile : false // window.MOBILE_DETECT.mobile()
    }
  },

  mounted () {
    // sounds off
    //SoundsLoader.toggleEnabled(false);

    this.iniDragY = 0;
    this.currentDragY = 0;
    this.iniMouseY = 0;

    window.qualityControlUi = this;

    for(var i =0 ; i < this.$refs.sound.children.length-2; i++){
      TweenMax.set(this.$refs.sound.children[i],{scaleY : 0.15});
      TweenMax.to(this.$refs.sound.children[i], 0.2 + Math.random()*0.2, {scaleY : 1, yoyo : true, ease : Linear.easeNone, repeat:-1});
    }

    TweenMax.fromTo(this.$refs.container, 1, {opacity : 0},{opacity:1, delay:1});


    if(!this.$refs.qualityhd)
      return;

    this.splits = [];
    this.splits[0] = new SplitText(this.$refs.qualityhd, {type : "chars"});
    this.splits[1] = new SplitText(this.$refs.qualitymd, {type : "chars"});
    this.splits[2] = new SplitText(this.$refs.qualitysd, {type : "chars"});
    if(true && !window.qualityEnabled)
      this.disableQuality();
  },

  methods : {
    disableQuality (op) {
      if(this.$refs.qualityControl)
        this.$refs.qualityControl.style.pointerEvents = "none";

      TweenMax.to(this.$refs.qualityControl, 0.4, {opacity : (op) ? 0 : 0.3});
    },

    hideToExperience () {
      this.disableQuality(true);
    },

    enableQuality () {
      this.$refs.qualityControl.style.pointerEvents = "all";
      TweenMax.to(this.$refs.qualityControl, 0.4, {opacity : 1});
    },

    toggleSound () {
      if(this.soundEnabled){
        this.soundEnabled = false;
        SoundsLoader.toggleEnabled(false);
        for(var i =0 ; i < this.$refs.sound.children.length-2; i++){
          TweenMax.killTweensOf(this.$refs.sound.children[i]);
          TweenMax.to(this.$refs.sound.children[i], 0.15, {scaleY : 0.2, ease : Linear.easeNone});
        }
        TweenMax.to(this.$refs.sound.children[6], 0.3, {opacity : 0.1, scaleY : 0.7});
      }else{
        this.soundEnabled = true;
        SoundsLoader.toggleEnabled(true);
        for(var i =0 ; i < this.$refs.sound.children.length-2; i++){
          TweenMax.killTweensOf(this.$refs.sound.children[i]);
          TweenMax.to(this.$refs.sound.children[i], 0.2 + Math.random()*0.2, {scaleY : 1, yoyo : true, ease : Linear.easeNone, repeat:-1});
        }
        TweenMax.to(this.$refs.sound.children[6], 0.3, {opacity : 0.2, scaleY : 1});
      }
    },

    changeColor(color){
      this.color = color;
    },

    onDownQualityHit (evt) {
      this.iniMouseY = evt.pageY;
      try{
        this.iniDragY = (this.$refs.bullet._gsTransform.y);
      }catch(e){
        this.iniDragY = 0;
      }

      document.addEventListener('mousemove', this.onMoveQualityHit);
      document.addEventListener('mouseup', this.onUpQualityHit);
    },

    updateQualityIndicator(quality,internal){
      var coef = (quality-1);
      this.$refs.bullet.style.filter = "blur("+(coef*2)+"px)";
      this.quality = quality;

      var num;
      if(coef < 0.33)
        num = 0;
      else if(coef < 0.66)
        num = 1;
      else
        num = 2;

      for(var i = 0; i < this.splits.length; i++){
        TweenMax.staggerTo(this.splits[i].chars, 1, {y : -num*10, ease : Expo.easeOut},0.1);
      }

      if(!internal){
        var posy = coef * 30;
        TweenMax.to(this.$refs.bullet, 0.5, {y : posy, ease : Quint.easeOut});
        TweenMax.to(this.$refs.draghit, 0.5, {y : posy, ease : Quint.easeOut, onUpdate : this.onUpdateQuality, onUpdateParams:[true]});
      }else{
        this.$emit('dragQualityChanged');
      }
    },

    onMoveQualityHit(evt){
      var posy = this.iniDragY + (evt.pageY-this.iniMouseY);
      posy = Math.max(posy,0);
      posy = Math.min(30,posy);
      TweenMax.to(this.$refs.bullet, 0.5, {y : posy, ease : Quint.easeOut});
      TweenMax.to(this.$refs.draghit, 0.5, {y : posy, ease : Quint.easeOut, onUpdate : this.onUpdateQuality, onUpdateParams:[false]});
    },

    onUpdateQuality(fromOutside){
      var coef = this.$refs.bullet._gsTransform.y / 30;

      if(!fromOutside)
        this.updateQualityIndicator(1+coef,true);
    },

    onUpQualityHit(evt){
      document.removeEventListener('mousemove', this.onMoveQualityHit);
      document.removeEventListener('mouseup', this.onUpQualityHit);
    }
  }
}
</script>

<style lang="scss" scoped>
  div.control-ui-container {
    position : absolute;
    top : 10px;
    left : 300px;
    display: block;
    float : right;

    div.sound{
      position : relative;
      width : 21px;
      height : 20px;
      display : block;
      float : left;
      margin-left: 2px;

      div.bar {
        position : relative;
        display : inline-block;
        width : 1px;
        height : 20px;
        margin-right : 2px;
        float : left;
        z-index: 1;
        background : #8c6ee5;
        transition : background 0.3s linear;
      }

      div.hit {
        position : absolute;
        top : -5px;
        left : -5px;
        width : 30px;
        height : 30px;
        display: block;
        cursor: pointer;
        z-index: 2;
      }

      div.glow {
        position : absolute;
        top : -1px;
        left : -7px;
        width : 30px;
        height : 22px;
        display: block;
        z-index: 0;
        opacity: 0.2;
        background : #8c6ee5;
        filter : blur(3px);
        border-radius: 40%;
      }
    }

    div.quality-control {
      position : relative;
      clear : both;
      float : left;
      display: block;
      margin-top : 15px;

      div.txt {
        font-size: 10px;
        font-family: 'open_sansbold';
        color : #8c6ee5;
        text-transform: uppercase;
        letter-spacing: 3px;
        display: block;
        float : left;
        position : relative;
        transition: color 0.3s linear;
        pointer-events: none;
        height : 10px;
        overflow: hidden;

        div.hd, div.md, div.sd {
          width : 23px;
          text-align: center;
        }
      }

      div.dragger{
        display: block;
        float : left;
        position : relative;
        margin-top : 10px;
        height : 40px;
        clear : both;
        left : 5px;

        div.line {
          position : absolute;
          width : 2px;
          height : 40px;
          background : #fff;
          left : 4px;
          opacity : 0.1;
        }
        div.bullet {
          position : absolute;
          width : 10px;
          height : 10px;
          background : #8c6ee5;
          display: block;
          border-radius : 50%;
          transition: background 0.3s linear;
        }
        div.hit {
          position : absolute;
          width : 24px;
          height : 24px;
          display: block;
          top : -7px;
          left : -7px;
          background : rgba(255,255,255,0.3);
          cursor: pointer;
          opacity: 0;
        }
      }
    }
  }


  @media screen and (max-width : 1024px){
    div.control-ui-container {
      left : 5vw;
      top : 5vh;
    }
  }
</style>
