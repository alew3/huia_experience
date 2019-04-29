<template lang="html">
  <div class="images-container" ref="imagesContainer" v-on:touchstart="onTouchStart" v-on:touchend="onTouchEnd" v-on:touchmove="onTouchMove">
    <img v-for="(item,index) in this.images" v-bind:src="createFilename(item.file.filename)" v-bind:class="{'horizontal' : isHorizontal(item)}" v-on:mouseover="hoverImage(index)" v-on:mouseout="outImage(index)" v-on:click="alignToElement(index)"/>
  </div>
</template>

<script>
import MathHelper from '../../helpers/MathHelper';

export default {
  props : {
    images : null,
    color : null,
    wide : false
  },

  data () {
    return {
      currentAlignedElement : 0
    }
  },


  methods : {
    onTouchStart (evt){
      console.log("start");
      this.iniTouchX = evt.touches[0].clientX;
      this.iniAligned = this.currentAlignedElement;
      TweenMax.to(this.$refs.imagesContainer,0.5,{scaleX : 0.95, scaleY : 0.95, ease : Quint.easeOut});
    },

    isHorizontal (image) {
      return this.wide;
    },

    onTouchEnd(evt){
      TweenMax.to(this.$refs.imagesContainer,0.3,{scaleX : 1, scaleY : 1, ease : Back.easeOut});
    },

    onTouchMove(evt){
      var dif = Math.round((evt.touches[0].clientX - this.iniTouchX)/this.difTouch);
      var num = this.iniAligned-dif;
      num = Math.max(0,num);
      num = Math.min(this.totalImages-1,num);
      this.alignToElement(num);
    },

    isMobile () {
        return window.MOBILE_DETECT.mobile()
    },

    createFilename (src){
      return window.ASSETS_URL + "upload/" + src;
    },

    showElement(el){
      el.style.display = "block";
    },

    alignToElement(index, fromLoop){
      this.currentAlignedElement = index;
      if(!this.$refs.imagesContainer) return;

      // var index = (evt.currentTarget).parentNode.children.indexOf(evt.currentTarget);
      var len = this.$refs.imagesContainer.children.length;
      for(var i = 0; i < this.$refs.imagesContainer.children.length; i++){
        var el = this.$refs.imagesContainer.children[i];

        if(i != index){
          el.style.pointerEvents = "all";
        }
        var dif = Math.abs(i-index);
        TweenMax.set(el, {zIndex : len - dif});
        TweenMax.to(el, 0.5, {scaleX : 1-(dif*0.15), scaleY : 1-(dif*0.15), rotation:0, x : el.attributes["data-inix"], force3D : true, ease : Back.easeOut});
      }

      var el = this.$refs.imagesContainer.children[index];
      el.style.pointerEvents = "none";
      TweenMax.to(this.$refs.imagesContainer, 0.5, {x : -index*60, force3D : true, ease : Back.easeOut});

      if(fromLoop){
        TweenMax.to(this, 4, {onComplete:this.alignToElement, onCompleteParams:[(this.currentAlignedElement+1 < len) ? this.currentAlignedElement+1 : 0, true]});
      }
    },

    hoverImage(index){
      if(this.isMobile()) return;
      TweenMax.killTweensOf(this);
      if(!this.$refs.imagesContainer) return;
      var el = this.$refs.imagesContainer.children[index];

      var dif = index - this.currentAlignedElement;
      var inix = el.attributes["data-inix"];
      if(dif < 0){
        TweenMax.to(el, 0.5, {x : inix - 25, rotation:-3, ease : Back.easeOut});
      }else if(dif > 0){
        TweenMax.to(el, 0.5, {x : inix + 25, rotation:3, ease : Back.easeOut});
      }
    },

    outImage(index){
      if(this.isMobile()) return;
      if(!this.$refs.imagesContainer) return;
      var el = this.$refs.imagesContainer.children[index];
      var inix = el.attributes["data-inix"];
      TweenMax.to(el, 0.5, {x : inix, rotation:0, ease : Back.easeOut});
    }
  },

  beforeDestroy () {
    TweenMax.killTweensOf(this);
  },

  mounted () {
    var color = MathHelper.hexToRGB(this.color.toString());
    // this.$refs.imagesContainer.style.WebkitFilter = "drop-shadow(0px 0px 60px rgba("+color.r+","+color.g+","+color.b+",0.4))";

    var len = this.images.length;
    var x = len * 50;

    for(var i = 0; i < len; i++){
      var sc = 1 - (i*0.15);
      var op = (i > 0) ? 0.7 : 1;
      var el = this.$refs.imagesContainer.children[i];
      el.attributes["data-inix"] = i * 60;
      TweenMax.set(el, {x : i * 60, zIndex : len-i, scaleX : sc, scaleY : sc});

      if(i == 0){
        el.style.pointerEvents = "none";
        TweenMax.from(el, 0.5, {scaleX : sc + 0.05, scaleY : sc + 0.05, opacity : 0, ease : Quint.easeIn, delay : 0});
      }else{
        el.style.display = "none";
        TweenMax.from(el, 1+(i*0.1), {x : 0, ease : Quint.easeOut, delay : 0.5, onStart:this.showElement, onStartParams:[el]});
      }
    }

    this.totalImages = this.$refs.imagesContainer.children.length;
    this.difTouch = window.innerWidth/(this.totalImages*2);

    if(len > 1 && !this.isMobile()){
      TweenMax.to(this, 4, {onComplete:this.alignToElement, onCompleteParams:[this.currentAlignedElement+1, true]});
    }


  }
}
</script>

<style lang="scss" scoped>
  div.images-container {
    position : absolute;
    // filter : drop-shadow(0px 0px 60px rgba(255,0,0,0.3));
    img {
      display : block;
      float : left;
      position : relative;
      height : 73vh;
      position : absolute;
      cursor : pointer;

      &.horizontal {
        width : 42vw;
        height : auto;
        box-shadow: 0px 0px 20px rgba(0,0,0,0.5);
      }
    }
  }

  @media screen and (max-width : 1000px){
    div.images-container {
      img {
        height : 60vh;

        &.horizontal{
          height : auto;
          width : 100vw;
        }
      }
    }
  }
</style>
