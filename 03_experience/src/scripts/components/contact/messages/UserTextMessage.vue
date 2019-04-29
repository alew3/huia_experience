<template lang="html">
  <div class="message-container" ref="messageContainer">
    <div class="ballon-bg" ref="ballonBg">
    </div>
    <div class="ballon-content" ref="ballonContent">
      <p v-html="this.text">{{this.text}}</p>
    </div>
  </div>
</template>

<script>
// import '../../vendors/SplitText.min.js';
import SoundsLoader from '../../../loaders/SoundsLoader';


export default {
  props : {
    'text': '',
    isEmoji : false
  },

  beforeDestroy(){
    TweenMax.killTweensOf(this.$refs.messageContainer);
    TweenMax.killChildTweensOf(this.$refs.messageContainer);
  },

  mounted () {
    var h = this.$refs.ballonContent.clientHeight;
    SoundsLoader.playSound("usermessage", false, 0.5, 0);
    if(this.isEmoji){
      this.$refs.ballonContent.style.fontSize = "50px";
      this.$refs.ballonContent.style.lineHeight = "50px";
      this.$refs.ballonContent.style.height = "55px";

      h = this.$refs.ballonContent.clientHeight;
    }else{
      this.$refs.ballonContent.style.lineHeight = "15px";
    }

    if(h > 32)
    {
      this.$refs.ballonBg.style.height = (h+24) + 'px';
    }

    this.$refs.ballonContent.style.width = this.$refs.ballonContent.clientWidth + 5 + 'px';
    this.$refs.ballonContent.style.position = "absolute";
    this.$refs.ballonContent.style.overflow = "hidden";
    this.$refs.ballonContent.style.top = "2px";
    this.$refs.ballonBg.style.width = this.$refs.ballonContent.style.width;
    // this.splitText = new SplitText(this.$refs.ballonContent, {type : "lines", display : "inline"});
    TweenMax.from(this.$refs.messageContainer, 0.4, {scaleY : 0, rotation:10, height : 0, marginBottom : 0, force3D : false, ease : Back.easeOut, force3D : true});
    TweenMax.from(this.$refs.ballonContent, 0.5, {y : 10, delay : 0.2, opacity : 0, ease : Back.easeOut, force3D : true});
  }
}
</script>

<style lang="scss" scoped>
div.message-container {
  display : block;
  float : right;
  left : 28px;
  position : relative;
  font-size : 10px;
  font-family: 'open_sansbold';
  color : #8f6fd5;
  margin-bottom : 15px;
  clear : both;
  transform-origin: 0% 100%;

  div.ballon-bg {
    background : transparent;
    border: double transparent 1em;
    letter-spacing: 3px;
    border-style: solid;
    border-width: 16px 18px 24px;
    // -moz-border-image: url(/static/images/user-message-border.svg) 16 18 24;
    // -webkit-border-image: url(/static/images/user-message-border.svg) 16 18 24;
    // -o-border-image: url(/static/images/user-message-border.svg) 16 18 24;
    border-image: url(/static/images/user-message-border.svg) 16 18 24 fill;
    transform : scaleX(-1);
  }

  div.ballon-content {
    padding: 10px 20px;
    position : relative;
    top : 0px;
    left : 0px;
    display : block;
    letter-spacing: 3px;
    float : left;
    clear : both;
    backface-visibility: hidden;
  }
}
</style>
