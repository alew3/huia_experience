<template lang="html">
  <div class="container" ref="videoContainer">
    <div class="video" ref="video" v-bind:class="{'video-full' : this.videofull}">
      <div class="img-video" v-bind:style="{'backgroundImage' : this.getImageUrl()}"></div>
      <iframe v-if="showVideo" width="560" height="315" v-bind:src="this.getVideoUrl()" frameborder="0" allowfullscreen></iframe>
    </div>

    <svg viewBox="0 0 50 50" ref="svgleft" class="left">
      <circle ref="circleleft" cx="25" cy="25" r="20" stroke="#8C6EE5" stroke-width="7" fill="transparent" />
    </svg>
    <svg viewBox="0 0 50 50" ref="svgright" class="right">
      <circle ref="circleright" cx="25" cy="25" r="20" stroke="#8C6EE5" stroke-width="7" fill="transparent" />
    </svg>

  </div>
</template>

<script>
export default {
  props : {
    color : null,
    model : null
  },

  data () {
    return {
      showVideo : false,
      videofull : false
    }
  },

  methods : {
    isMobile() {
        return window.MOBILE_DETECT.mobile()
    },

    getImageUrl() {
      if(this.model.video_source == "youtube")
        return "url('https://img.youtube.com/vi/"+this.model.video_id+"/0.jpg')";
    },

    getVideoUrl(){
      if(this.model.video_source == 'youtube')
        return "https://www.youtube.com/embed/"+this.model.video_id + "?rel=0&showinfo=0&rel=0&color=white&controls=1&disablekb=1&modestbranding=1";
      else
        return "https://player.vimeo.com/video/"+this.model.video_id + "?color=26263c&byline=0&portrait=0";
    },

    getVimeoUrl(){

    },

    onDeviceOrientation(evt){
      console.log("orientation", window.innerWidth > window.innerHeight);
      if(window.innerWidth > window.innerHeight){
        if(this.videofull) return;
        this.videofull = true;
        document.body.appendChild(this.$refs.video);
      }else{
        if(!this.videofull) return;
        this.videofull = false;
        this.$refs.videoContainer.appendChild(this.$refs.video);
      }
    },
  },


  beforeDestroy () {
    window.removeEventListener('deviceorientation', this.onDeviceOrientation);
  },

  mounted () {
    var del = 0;
    TweenMax.set(this.$refs.circleleft, {drawSVG:"0% 0%"});

    TweenMax.set(this.$refs.circleright, {rotation : 180, transformOrigin:"50% 50%"});
    TweenMax.set(this.$refs.circleleft, {transformOrigin:"50% 50%"});
    TweenMax.set(this.$refs.circleright, {drawSVG:"0% 0%"});


    if(!this.isMobile())
      TweenMax.set(this.$refs.video,{x : -200});

    TweenMax.to(this.$refs.circleleft, 1, {drawSVG : "0% 30%", rotation:180, ease : Quad.easeOut, delay:del})
    TweenMax.to(this.$refs.circleright, 1, {drawSVG : "70% 100%", rotation:90, ease : Quad.easeOut, delay:del, onComplete:()=>{this.showVideo = true;}});
    TweenMax.from(this.$refs.video, 1, {scaleX : 0.8, scaleY : 0.8, opacity : 0, ease : Back.easeOut, delay : del});

    this.$refs.circleleft.style.stroke = this.color;
    this.$refs.circleright.style.stroke = this.color;


    if(this.isMobile()){
      this.onDeviceOrientation = this.onDeviceOrientation.bind(this);
      window.addEventListener('deviceorientation', this.onDeviceOrientation);
    }
  }
}
</script>

<style lang="scss" scoped>
  div.container {
    position : absolute;
    height : 100%;

    div.video{
      position : absolute;
      width : 574px;
      height : 322px;
      background : #000;
      top : 50%;
      margin-top : -146px;

      div.img-video {
        position : absolute;
        top : 0px;
        left : 0px;
        width : 574px;
        height : 322px;
        background-position: center center;
        background-size: cover;
        background-repeat: no-repeat;
        opacity : 0.25;
        filter : grayscale(1);
      }

      iframe {
        position : absolute;
        width : 100%;
        height : 100%;
      }
    }

    svg {
      position : absolute;
      top : 0px;
      left : 0px;
      width : 50px;
      height : 50px;

      &.left {
        position : absolute;
        left : -230px;
        top : 50%;
        margin-top : -190px;
      }

      &.right {
        position: absolute;
        left: 360px;
        top: 50%;
        margin-top : 160px;
      }
    }
  }



  @media screen and (max-width : 1000px){

      div.container {
        position : relative;
        left : 0px;
        display: block;
        float : left;
        width : auto;
        height : auto;

        width : 90vw;
        height : 90vw * 0.55;


        div.video{
          position : relative;
          display: block;
          float: left;
          width : 100%;
          height : 100%;
          background : #000;
          top : 0px;
          margin-top : 0px;
          left : 0px;

          &.video-full {
            position : absolute;
            z-index : 99999999;
            width : 100vw;
            height : 100vh;
            top : 0px;
            left : 0px;
          }

          div.img-video {
            position : absolute;
            top : 0px;
            left : 0px;
            width : 100%;
            height : 100%;
            background-position: center center;
            background-size: cover;
            background-repeat: no-repeat;
            opacity : 0.25;
            filter : grayscale(1);
          }

          iframe {
            position : absolute;
            width : 100%;
            height : 100%;
          }
        }

        svg {
          display: none;
        }
      }
  }
</style>
