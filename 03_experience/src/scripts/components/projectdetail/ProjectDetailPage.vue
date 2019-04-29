<template>
  <div class="page" ref="container" v-on:touchstart="onTouchStart" v-on:touchend="onTouchEnd" v-on:touchmove="onTouchMove">
    <div class="column-left">
      <div class="title" ref="title">
        <div class="txt-container">
          <h2 v-html="title" ref="h2"></h2>
          <h3 ref="h3">{{model['subtitle-title']}}</h3>
        </div>
      </div>
      <div class="paragraph" v-html="model.paragraph" ref="paragraph"></div>
      <div class="paragraph-diamond" v-if="!video" ref="paragraphdiamond"></div>
    </div>
    <div v-bind:class="{'column-right': true, 'computer-framed' : getIsComputerFramed()}">
      <div ref="singleImageContainer" class="single-image-container" v-if="getIsSingleImage()">
        <img v-bind:src="getSingleImageSrc()" ref="singleImage" />
      </div>
      <div ref="phoneFramedContainer" class="phone-framed-container" v-if="getIsPhoneFramed()" v-bind:style="{backgroundImage : getPhoneImage()}">
        <img v-bind:src="getPhoneFramedSrc()" ref="phoneFramedImage" />
        <img v-bind:src="getStoppedFrame('phone')" ref="gifStoppedImage" v-if="isMobile()" />
        <div class="gif-btn" ref="gifBtn" v-if="isMobile()" v-on:touchend="showGif"><div class="btn"><div class="bg"></div><span>GIF</span><i><svg x="0px" y="0px" viewBox="0 0 46.02 46.02" style="enable-background:new 0 0 46.02 46.02;">
        <g><path d="M14.757,46.02c-1.412,0-2.825-0.521-3.929-1.569c-2.282-2.17-2.373-5.78-0.204-8.063l12.758-13.418L10.637,9.645
        			C8.46,7.37,8.54,3.76,10.816,1.582c2.277-2.178,5.886-2.097,8.063,0.179l16.505,17.253c2.104,2.2,2.108,5.665,0.013,7.872
        			L18.893,44.247C17.77,45.424,16.267,46.02,14.757,46.02z"/></g></svg></i></div></div>
      </div>
      <div ref="computerFramedContainer" class="computer-framed-container" v-if="getIsComputerFramed()">
        <img v-bind:src="getComputerFramedSrc()" ref="phoneFramedImage" />
        <img v-bind:src="getStoppedFrame('computer')" ref="gifStoppedImage" v-if="isMobile()" />
        <div class="gif-btn" ref="gifBtn" v-if="isMobile()" v-on:touchend="showGif"><div class="btn"><div class="bg"></div><span>GIF</span><i><svg x="0px" y="0px" viewBox="0 0 46.02 46.02" style="enable-background:new 0 0 46.02 46.02;">
        <g><path d="M14.757,46.02c-1.412,0-2.825-0.521-3.929-1.569c-2.282-2.17-2.373-5.78-0.204-8.063l12.758-13.418L10.637,9.645
        			C8.46,7.37,8.54,3.76,10.816,1.582c2.277-2.178,5.886-2.097,8.063,0.179l16.505,17.253c2.104,2.2,2.108,5.665,0.013,7.872
        			L18.893,44.247C17.77,45.424,16.267,46.02,14.757,46.02z"/></g></svg></i></div></div>
      </div>
      <div ref="galleryContainer" v-bind:class="{'gallery-container':true, 'horizontal' : this.model.isWide}" v-if="getIsImageGallery()">
        <ProjectDetailImageGallery :images="this.model.images" ref="projectGallery" :wide="this.model.isWide" v-bind:color="this.color" />
      </div>
      <div ref="videoContainer" class="video-container" v-if="getIsVideo()">
        <ProjectDetailVideo :model="this.model" ref="projectVideo" v-bind:color="this.color" />
      </div>
    </div>
  </div>
</template>

<script>
import MathHelper from '../../helpers/MathHelper';
import SplitText from '../../vendors/SplitText.min';
import ProjectDetailImageGallery from './ProjectDetailImageGallery';
import ProjectDetailVideo from './ProjectDetailVideo';

export default {
  components : {
      'ProjectDetailImageGallery' : ProjectDetailImageGallery,
      'ProjectDetailVideo' : ProjectDetailVideo
  },

  props : {
    model : null,
    color : null,
    direction : {
      type : String,
      default : "down"
    },
    pageIndex : 0,
    totalPages : 0
  },

  data () {
    return {
      singleImageSrc : "",
      title : "",
      singleImage : false,
      video : false,
      imageGallery : false
    }
  },

  beforeUpdate(){
    this.variablesSet = false;
  },


  methods : {
    isMobile(){
        return window.MOBILE_DETECT.mobile()
    },

    onTouchStart(evt){
      evt.preventDefault();
      this.touching = true;
      this.touchDirection = null;
      this.iniPosX = this.posX;
      this.iniPosY = this.posY || 0;
      this.iniTouchPos = {x : evt.touches[0].clientX, y : evt.touches[0].clientY};
      this.lastPos = {x : evt.touches[0].clientX, y : evt.touches[0].clientY};
    },

    onTouchEnd(evt){
      this.touchDirection = null;
      if(this.lastPos.y - this.iniTouchPos.y < -50){
        if(this.pageIndex < this.totalPages-1)
        {
          this.$emit('goDown');
        }
        else{
          this.posY = 0;
          window.requestAnimationFrame(this.positeOnMotionDev);
        }
      }else if(this.lastPos.y - this.iniTouchPos.y > 50){
        if(this.pageIndex > 0)
        {
          this.$emit('goUp');
        }
        else{
          this.posY = 0;
          window.requestAnimationFrame(this.positeOnMotionDev);
        }
      }else{
        this.posY = 0;
        window.requestAnimationFrame(this.positeOnMotionDev);
      }
      // this.touching = false;
    },

    onTouchMove(evt){
      if(!this.touching) return;
      this.lastPos = {x : evt.touches[0].clientX, y : evt.touches[0].clientY};

      if(!this.touchDirection){
        var difx = Math.abs(evt.touches[0].clientX - this.iniTouchPos.x);
        var dify = Math.abs(evt.touches[0].clientY - this.iniTouchPos.y);
        if(difx > dify){
          this.touchDirection = "hor";
          this.posY = 0;
        }else if(dify > difx){
          this.touchDirection = "vert";
        }else{
          return;
        }
      }

      if(this.touchDirection == "vert")
        this.posY = this.iniPosY + (evt.touches[0].clientY - this.iniTouchPos.y);
      else if(this.touchDirection == "hor")
        this.posX = this.iniPosX + (evt.touches[0].clientX - this.iniTouchPos.x);


      this.posX = Math.min(0,this.posX);
      // this.posY = Math.min(0,this.posY);

      if(this.posX > -window.innerWidth * 0.3){
        this.hideGif();
      }
      this.posX = Math.max(-window.innerWidth*0.65,this.posX);
      window.requestAnimationFrame(this.positeOnMotionDev);
    },

    getSingleImageSrc () {
      return window.ASSETS_URL + 'upload/' + this.model.image.filename;
    },

    showGif(){
      this.$refs.phoneFramedImage.style.display = "block";
      this.$refs.gifStoppedImage.style.display = "none";
      this.$refs.gifBtn.style.display = "none";
    },

    hideGif(){
      if(!this.$refs.phoneFramedImage) return;

      if(this.$refs.phoneFramedImage.style.display == "none") return;
      this.$refs.phoneFramedImage.style.display = "none";
      this.$refs.gifStoppedImage.style.display = "block";
      this.$refs.gifBtn.style.display = "block";
    },

    getPhoneFramedSrc () {
      return window.ASSETS_URL + 'upload/' + this.model.animation_phone.filename;
    },

    getStoppedFrame(src){
      return window.ASSETS_URL + 'upload/' + this.model["animation_print_"+src].filename;
    },

    getPhoneImage () {
      return "url('/static/images/phoneframe-"+this.model.phone_frame_color+".png')";
    },

    getComputerFramedSrc () {
      return window.ASSETS_URL + 'upload/' + this.model.animation_computer.filename;
    },

    getIsSingleImage () {
      return (this.model.page_type == "singleimage");
    },

    getIsPhoneFramed () {
      return (this.model.page_type == "phoneframed");
    },

    getIsComputerFramed () {
      return (this.model.page_type == "computerframed");
    },

    getIsImageGallery() {
      return (this.model.page_type == "imagegallery");
    },

    getIsVideo() {
      return (this.model.page_type == "video");
    },

    destroyAnimation (direction) {
      TweenMax.to(this.$refs.container, 0.5, {y : (direction == "down") ? (window.innerHeight/8) : -(window.innerHeight/8), ease : Quint.easeIn, force3D : true});
      TweenMax.to(this.$refs.container, 0.5, {scaleX : 0.9, scaleY : 0.9, opacity : 0, ease : Quad.easeOut, force3D : true});
    },


    onMotionDev(evt){
      if(this.touching) return;

      if(this.deviceRotation == -1){
        this.deviceRotation = evt.gamma;
        this.lastRotation = this.deviceRotation;
        return;
      }
      this.posX = (evt.gamma*7)-this.deviceRotation;
      this.lastRotation = (evt.gamma*7);

      this.posX = Math.min(0,this.posX);

      if(this.posX > -window.innerWidth * 0.3){
        this.hideGif();
      }
      this.posX = Math.max(-window.innerWidth*0.65,this.posX);
      window.requestAnimationFrame(this.positeOnMotionDev);
    },

    positeOnMotionDev() {
      TweenMax.to(this.$refs.container, 0.5, {x : this.posX, y : (this.posY || 0), ease : Quint.easeOut});
    }
  },


  beforeDestroy() {
    window.removeEventListener('deviceorientation', this.onMotionDev);
    window.removeEventListener('devicemotion', this.onMotionDev);

    if(this.$refs.gifBtn){
      TweenMax.killTweensOf(this.$refs.gifBtn.children[0].children[1]);
      TweenMax.killTweensOf(this.$refs.gifBtn.children[0].children[2]);
    }
  },

  destroyed () {
    TweenMax.killChildTweensOf(this.$refs.container);
  },


  mounted() {
    if(this.model.page_type == "singleimage"){
      this.singleImage = true;
    }else if(this.model.page_type == "imagegallery"){
      this.imageGallery = true;
      this.singleImage = false;
    }else if(this.model.page_type != "phoneframed" && this.model.page_type != "computerframed"){
      this.video = true;
    }


    this.title = this.model.title.replace("$","<br/>");



    if(this.$refs.singleImage){
      var color = MathHelper.hexToRGB(this.color.toString());
      this.$refs.singleImage.style.WebkitFilter = "drop-shadow(0px 0px 60px rgba("+color.r+","+color.g+","+color.b+",0.4))";
    }else if(this.$refs.phoneFramedContainer){
      var color = MathHelper.hexToRGB(this.color.toString());
      this.$refs.phoneFramedContainer.style.WebkitFilter = "drop-shadow(0px 0px 60px rgba("+color.r+","+color.g+","+color.b+",0.4))";
    }else if(this.$refs.computerFramedContainer){
      var color = MathHelper.hexToRGB(this.color.toString());
      this.$refs.computerFramedContainer.style.WebkitFilter = "drop-shadow(0px 0px 60px rgba("+color.r+","+color.g+","+color.b+",0.4))";
    }


    if(this.$refs.phoneFramedImage && this.isMobile()){
      this.$refs.phoneFramedImage.style.display = "none";
      TweenMax.set(this.$refs.gifBtn.children[0].children[2], {x : 30, opacity : 0});
      TweenMax.to(this.$refs.gifBtn.children[0].children[1], 1, {x : -30, opacity : 0, ease : Back.easeInOut, yoyo : true, repeat : -1, repeatDelay:2});
      TweenMax.to(this.$refs.gifBtn.children[0].children[2], 1, {x : 0, opacity : 1, ease : Back.easeInOut, yoyo : true, repeat : -1, repeatDelay:2});
    }

    var del = 0;
    // this.splitTitle = new SplitText(this.$refs.h2, {type : "lines"});
    TweenMax.fromTo(this.$refs.h2, 0.5, {y : (this.direction == "down" ? -50 : 50), opacity : 0}, {y : 0, opacity : 1, ease : Quint.easeOut, delay : del+0.5, force3D : true}, 0.1);
    TweenMax.fromTo(this.$refs.h3, 0.5, {y : (this.direction == "down" ? -50 : 50), opacity : 0}, {y : 0, opacity : 1, ease : Quint.easeOut, delay:del+0.5, force3D : true});

    TweenMax.from(this.$refs.paragraphdiamond, 2, {scaleX : 0.5, scaleY : 0.5, opacity:0, ease : Back.easeOut, delay:del+0.5});


    if(this.$refs.singleImage){
      var color = MathHelper.hexToRGB(this.color.toString());
      TweenMax.fromTo(this.$refs.singleImage, 2, {opacity : 0, y : (this.direction == "down" ? -50 : 50)}, {opacity : 1, y : 0, ease : Quint.easeOut, delay:del+0.5})
    }

    if(this.$refs.videoContainer && !this.isMobile()){
      TweenMax.to(this.$refs.title, 1, {x : -50, ease : Quint.easeInOut, delay:del});
      TweenMax.to(this.$refs.paragraph, 1, {x : -50, ease : Quint.easeInOut, delay:del, overwrite:false});
      TweenMax.fromTo(this.$refs.paragraph, 1, {x : 0, opacity : 0}, {x : -50, opacity : 1, ease: Quint.easeInOut, delay:del+0.5, force3D : true});
    }else{
      TweenMax.fromTo(this.$refs.paragraph, 1.5, {y : (this.direction == "down" ? -50 : 50), opacity : 0}, {y : 0, opacity : 1, ease: Quint.easeOut, delay:del+0.5, force3D : true});
    }

    if(window.MOBILE_DETECT.mobile()){
      if(window.DeviceMotionEvent){
        this.deviceRotation = -1;
        this.onMotionDev = this.onMotionDev.bind(this);
        this.positeOnMotionDev = this.positeOnMotionDev.bind(this);
        this.posX = 0;

        window.addEventListener('deviceorientation', this.onMotionDev);
        window.requestAnimationFrame(this.positeOnMotionDev);
      }
    }

    TweenMax.from(this.$refs.container, 1, {y : (this.direction == "down") ? (window.innerHeight/8) : -(window.innerHeight/8), ease : Quint.easeOut, force3D : true});
    TweenMax.from(this.$refs.container, 1, {scaleX : 1.1, scaleY : 1.1, opacity : 0, ease : Quad.easeIn, force3D : true});
  }
}
</script>

<style lang="scss">
  div.page {
    position : absolute;
    top : 0px;
    left : 0px;
    width : 100vw;
    height : 100vh;
    overflow : hidden;
    display: inline-block;

    div.gamma {
      position : absolute;
      top : 0px;
      z-index: 999999999;
      color : #fff;
      font-family: 'open_sansbold';
    }



    div.column-left {
      position : absolute;
      top : 50vh;
      left : 0px;
      width : 45vw;
      margin-top : -200px;

      div.title {
        position : relative;
        top : 0px;
        left : 0px;
        display : block;
        float : right;
        width : 250px;
        margin-right : 107px;

        svg {
          position : absolute;
          left : -92px;
          top : -35px;
        }

        div.diamond-border {
          position : absolute;
          width : 140px;
          height : 140px;
          background : transparent;
          border : 2px solid #ff00ff;
          left : -74px;
          top : -20px;
        }

        div.diamond {
          position : absolute;
          width : 100px;
          height : 100px;
          background : #ff00ff;
          left : -55px;
        }

        div.txt-container{
          display : block;
          position : relative;
          h2 {
            font-size : 45px;
            font-family: 'open_sansbold';
            color : #fff;
            text-transform : uppercase;
          }

          h3 {
            font-size : 22px;
            font-family: 'open_sansbold';
            color : #fff;
          }
        }
      }

      div.paragraph {
        font-size : 18px;
        color : #fff;
        font-family: 'open_sansregular';
        text-align: left;
        width : 250px;
        line-height : 28px;
        display : block;
        float : right;
        margin-right : 107px;
        position : relative;
        clear : both;
        margin-top : 67px;

        strong {
          font-family: 'open_sansbold';
        }
        em {
          font-family: 'open_sansitalic';
        }

        em { strong {
          font-family: 'open_sansbold_italic';
        }}

        strong { em {
          font-family: 'open_sansbold_italic';
        }}
      }

      div.paragraph-diamond {
        display : block;
        float : right;
        position : relative;
        width : 12px;
        height : 12px;
        background : #fff;
        margin-top : 35px;
        margin-right : 340px;
        clear : both;
        transform : rotate(45deg);
      }
    }


    div.column-right {
      width : 45vw;
      position : absolute;
      top : 50%;
      right : 0px;
      transform : translateY(-50%);
      height : 73vh;

      &.computer-framed{
        right : 12vw;
      }




      div.single-image-container {
        position : relative;
        display : block;
        height : 100%;

        img {
          display : block;
          float : left;
          position : relative;
          height : 73vh;
          filter : drop-shadow(0px 0px 60px rgba(255,0,0,0.3));
        }
      }

      div.phone-framed-container {
        position : relative;
        display : block;
        height : 73vh;
        width : 36.32vh;
        background-position: center center;
        background-repeat : no-repeat;
        background-size: cover;
        filter : drop-shadow(0px 0px 60px rgba(255,0,0,0.3));

        img {
          display: block;
          float: left;
          position: relative;
          height: 56.3vh;
          top: 8.5vh;
          left: 2.1vh;
          width : 32vh;
        }


      }

      div.computer-framed-container {
        position : relative;
        display : block;
        height : 55vh;
        width : 55vh * 1.468;
        background : url('/static/images/computer-frame.png') center center no-repeat;
        background-size: cover;
        filter : drop-shadow(0px 0px 60px rgba(255,0,0,0.3));
        top : 50%;
        transform : translateY(-50%);

        img {
          display: block;
          float: left;
          position: relative;
          height: 36.4vh;
          top: 3.3vh;
          left: 9.9vh;
          width: 61vh;
        }
      }


      div.gallery-container {
        position : relative;
        display : block;
        height : 100%;

        &.horizontal {
          height : auto;
          top : 50%;
          transform : translateY(-15vw);
          left : -6vw;
        }
      }
    }
  }






  @media screen and (max-width : 1000px){
    div.page {
      width : 200vw;
      overflow : none;
      div.column-left {
        position : absolute;
        top : 30vh;
        left : 15vw;
        width : 70vw;
        margin-top : 0px;

        div.title {
          float : left;
          width : auto;
          margin-right : 0px;

          svg {
            position : absolute;
            left : -92px;
            top : -35px;
          }

          div.txt-container{
            display : block;
            position : relative;
            h2 {
              font-size : 10vw;
            }

            h3 {
              font-size : 6vw;
            }
          }
        }

        div.paragraph {
          font-size : 4vw;
          width : auto;
          line-height : 5vw;
          float : left;
          margin-right : 0px;
          margin-top : 6vw;
        }

        div.paragraph-diamond {
          float : left;
          margin-right : 0px;
        }
      }


      div.column-right {
        width : 45vw;
        position : absolute;
        top : 50%;
        right : auto;
        transform : translateY(-30vh);
        height : 60vh;
        left : 90vw;

        &.computer-framed{
          right : 12vw;
        }

        div.video-container {
          position : relative;
          float : left;
          display: block;
          top : 50%;
          left : 50%;
          transform : translate(-25%,-50%);
        }


        div.single-image-container {
          position : relative;
          display : block;
          height : 100%;

          img {
            display : block;
            float : left;
            position : relative;
            height : 60vh;
            filter : drop-shadow(0px 0px 40px rgba(255,0,0,0.3));
          }
        }

        div.phone-framed-container {
          position : relative;
          display : block;
          height : 60vh;
          width : 29.85vh;
          background-position: center center;
          background-repeat : no-repeat;
          background-size: cover;
          filter : drop-shadow(0px 0px 40px rgba(255,0,0,0.3));

          img {
            position : absolute;
            display: block;
            float: left;
            height: 56.3vh * 0.82191;
            top: 8.5vh * 0.82191;
            left: 2.1vh * 0.82191;
            width : 32vh * 0.82191;
          }
        }

        div.gif-btn {
          display: block;
          float:left;
          position:absolute;
          height: 56.3vh * 0.82191;
          top: 8.5vh * 0.82191;
          left: 2.1vh * 0.82191;
          width : 32vh * 0.82191;
          color : #fff;
          font-family: 'open_sansbold';
          background : rgba(0,0,0,0.8);

          div.btn {
            position : absolute;
            top : 50%;
            left : 50%;
            width : 15vw;
            height : 15vw;
            margin-top : -7.5vw;
            margin-left : -7.5vw;

            span {
              position : absolute;
              top : 50%;
              left : 50%;
              display : block;
              transform : translate(-50%,-50%);
              font-size : 4vw;
            }

            i {
              position : absolute;
              top : 50%;
              left : 50%;
              width : 16px;
              height : 16px;
              margin-left : -8px;
              margin-top : -8px;

              svg {
                path,g {
                  fill : #ffffff;
                }
              }
            }

            div.bg {
              border : 1px solid #fff;
              background : none;
              border-style: dashed;
              border-radius : 50%;
              position : absolute;
              width : 15vw;
              height : 15vw;
              -webkit-animation-name: spin;
              -webkit-animation-duration: 6s;
              -webkit-animation-iteration-count: infinite;
              -webkit-animation-timing-function: linear;

              @keyframes spin {
                  from {transform:rotate(0deg);}
                  to {transform:rotate(360deg);}
              }
            }
          }
        }

        div.computer-framed-container {
          position : relative;
          display : block;
          // height : 55vh * 0.82191;
          // width : 55vh * 1.468 * 0.82191;
          width : 110vw;
          height : 110vw * 0.6811;
          background : url('/static/images/computer-frame.png') center center no-repeat;
          background-size: cover;
          filter : drop-shadow(0px 0px 60px rgba(255,0,0,0.3));
          top : 50%;
          transform : translateY(-50%);
          left : -25vw;

          img {
            display: block;
            float: left;
            position: absolute;
            height: 59vw * 0.82191;
            top: 5.7vw * 0.82191;
            left: 16.2vw * 0.82191;
            width: 101vw * 0.82191;
          }

          div.gif-btn {
            position: absolute;
            height: 59vw * 0.82191;
            top: 5.7vw * 0.82191;
            left: 16.2vw * 0.82191;
            width: 101vw * 0.82191;

            span {
              position : absolute;
              left : 7.5vw;
              top : 8vw;
            }

            i {
              top : 8vw;
            }
          }
        }


        div.gallery-container {
          position : relative;
          display : block;
          height : 100%;

          &.horizontal {
            height : auto;
            width : 40vw;
            transform : translateY(-15vh);
            left : -0.5vw;
          }
        }
      }
    }
  }
</style>
