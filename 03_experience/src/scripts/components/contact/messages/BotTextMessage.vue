<template lang="html">
  <div class="message-container" ref="messageContainer">
    <div class="ballon-bg" ref="ballonBg">
    </div>
    <div class="ballon-content" ref="ballonContent">
      <p v-html="this.formatText()">{{this.formatText()}}</p>
    </div>
  </div>
</template>

<script>
import 'autolink-js';
import SoundsLoader from '../../../loaders/SoundsLoader';
// import '../../vendors/SplitText.min.js';


export default {
  props : {
    'text': '',
    isEmoji : false
  },

  beforeDestroy() {
    TweenMax.killTweensOf(this.$refs.messageContainer);
    TweenMax.killChildTweensOf(this.$refs.messageContainer);
  },

  methods : {
    formatText () {
      return this.text.autoLink(
        {target : '_blank',
          callback: (url) => {
            return /\.(gif|png|jpe?g)$/i.test(url) ? '<img style="display:block; float:left; position:relative;" src="' + url + '">' : '<a href="'+url+'" title="'+url+'" target="_blank" style="color:#8f6fd5;}">'+url+'</a>'
          }
        });
    }
  },

  mounted () {
    var h = this.$refs.ballonContent.offsetHeight;

    if(this.isEmoji){
      this.$refs.ballonContent.style.fontSize = "50px";
      this.$refs.ballonContent.style.lineHeight = "50px";
      this.$refs.ballonContent.style.height = "55px";

      h = this.$refs.ballonContent.offsetHeight;
    }else{
      this.$refs.ballonContent.style.lineHeight = "15px";
    }



    // if(h > 32)
    // {
    //   if(h > 80)
    //     this.$refs.ballonBg.style.height = (h+120) + 'px';
    //   else
    //     this.$refs.ballonBg.style.height = (h+24) + 'px';
    // }

    SoundsLoader.playSound("message", false, 0.5, 0);

    this.$refs.ballonContent.style.width = this.$refs.ballonContent.clientWidth + 5 + 'px';
    // this.$refs.ballonContent.style.position = "absolute";
    this.$refs.ballonContent.style.overflow = "hidden";
    this.$refs.ballonContent.style.top = "2px";
    this.$refs.ballonBg.style.width = this.$refs.ballonContent.style.width;
    TweenMax.from(this.$refs.messageContainer, 0.4, {scaleY : 0, rotation:10, height : 0, marginBottom : 0, force3D : false, ease : Back.easeOut, force3D : true});
    TweenMax.from(this.$refs.ballonContent, 0.5, {y : 10, delay : 0.2, opacity : 0, ease : Back.easeOut, force3D : true});

    window.botmessage = this;

    setTimeout(function() {
      var $containerMessages = document.getElementById('chat-content');
      var top = $containerMessages.scrollHeight;
      TweenMax.to($containerMessages, 0.9, {scrollTo:top});
    }, 400);
  }
}
</script>

<style lang="scss" scoped>
div.message-container {
  display : block;
  float : left;
  position : relative;
  font-size : 10px;
  font-family: 'open_sansbold';
  color : #ffffff;
  margin-bottom : 15px;
  clear : both;
  transform-origin: 0% 100%;

  div.ballon-bg {
    background : transparent;
    border: double transparent 1em;
    letter-spacing: 3px;
    border-style: solid;
    border-width: 16px 18px 24px;
    border-image: url(/static/images/bot-message-border.svg) 16 18 24 fill;
    position : absolute;
    height : calc(100% + 6px);
  }

  div.ballon-content {
    padding: 10px 20px;
    position : relative;
    top : 0px;
    left : 0px;
    display : block;
    letter-spacing: 3px;
    float : left;
    backface-visibility: hidden;
    p {
      color : #ffffff;
    }
    // & > p > a {
    //   color : #8f6fd5 !important;
    //
    //   &:hover {
    //     text-decoration: underline;
    //   }
    // }
    // background : #ff0000;
  }
}
</style>
