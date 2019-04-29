<template lang="html">
  <div class="item" ref="container">
  </div>
</template>

<script>
import MathHelper from '../../helpers/MathHelper';

export default {
  props :{
    index : 0
  },

  data () {
    return {
      visible : true
    }
  },

  methods : {
    isMobile(){
      return window.MOBILE_DETECT.mobile()
    },
    checkVisibility(posx){
      if(this.leftPos + posx < 0 && this.visible){
        this.visible = false;
        TweenMax.to(this.$refs.container, 1, {opacity : 0.1, ease : Quint.easeOut});
      }else if(this.leftPos + posx > 0 && !this.visible){
        this.visible= true;
        TweenMax.to(this.$refs.container, 1, {opacity : 1, ease : Quint.easeOut});
      }
    },
    setStartPosition (posx,posy){
      TweenMax.set(this.$refs.container, {left : posx, top : posy, x : 0, y : 0, scaleX : 1, scaleY : 1, opacity : 1});

      this.leftPos = posx;
      this.topPos = posy;
      this.positionX = 0;
      this.positionY = 0;
      this.finRandomX = this.positionX;
      this.finRandomY = this.positionY;

      this.initialPositionX = posx;
      this.initialPositionY = posy;

      TweenMax.from(this.$refs.container, 1, {left : this.leftPos, top : this.topPos, scaleX : 0, scaleY : 0, ease : Back.easeOut, x : this.positionX-40+Math.random()*80, y : this.positionY-40+Math.random()*80, force3D : true, delay : 1+(this.index*0.05), onComplete:this.iniMovementLooping});
    },

    reactToHover(el){
      var distance = MathHelper.distanceBetweenTwoPoints({x : this.initialPositionX, y : this.initialPositionY}, {x : el.initialPositionX, y : el.initialPositionY});

      var angle = Math.atan2(this.initialPositionY-el.initialPositionY, this.initialPositionX - el.initialPositionX);

      if(distance < 800){
        if(Math.cos(angle) < 0){
          this.positionX = Math.cos(angle)*((800-distance)/30);
        }else{
          this.positionX = Math.cos(angle)*((800-distance)/8);
        }
        this.positionY = Math.sin(angle)*((800-distance)/8);
        TweenMax.killTweensOf(this.$refs.container);
        TweenMax.to(this.$refs.container, 1+Math.random(), {y : this.positionY, top : this.topPos, scaleX : 1, scaleY : 1, ease : Back.easeOut});
        TweenMax.to(this.$refs.container, 1+Math.random(), {x : this.positionX, left : this.leftPos, ease : Back.easeOut, overwrite:false});
      }
    },

    backToInitial(){
      TweenMax.killTweensOf(this.$refs.container);
      this.positionX = 0;
      this.positionY = 0;
      TweenMax.to(this.$refs.container, 1, {x : 0, y : 0, left : this.leftPos, shortRotation : 0, angle : 0, top : this.topPos, scaleX : 1, scaleY : 1, ease : Back.easeOut, onComplete:this.iniMovementLooping});
    },
  },

  mounted () {
    this.reactToHover = this.reactToHover.bind(this);
    this.backToInitial = this.backToInitial.bind(this);
  }
}
</script>

<style lang="css" scoped>
div.item {
  position : absolute;
  background : #ffffff;
  width : 4px;
  height : 4px;
  display : block;
  border-radius : 50%;
}
</style>
