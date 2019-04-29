<template>
  <transition
    v-on:leave="leave">
    <section id="studio-detail" ref="container">
      <div class="center-title" ref="centerTitle">
        <i v-bind:class="this.getClass()" ref="icon"></i>
        <h1 v-html="this.getTitle()" ref="title"></h1>
        <h2 ref="subtitle">{{this.getStudioTxt()}}</h2>
        <div class="bar" ref="bar"></div>
        <span class="txt" ref="txt">{{this.content.textAbout}}</span>
        <div class="red-bullet" ref="redBullet"></div>
      </div>
      <div class="features">
        <ul class="left-column" ref="leftColumn">
          <li v-for="el in this.getLeftElements()"><div class="bar"></div><div class="bar"></div><span class="feature-text" v-html="el"></span></li>
        </ul>
        <ul class="right-column" ref="rightColumn">
          <li v-for="el in this.getRightElements()"><div class="bar"></div><div class="bar"></div><span class="feature-text" v-html="el"></span></li>
        </ul>
      </div>
    </section>
</transition>
</template>

<script>
import ContentLoader from "../loaders/ContentLoader";
import SoundsLoader from "../loaders/SoundsLoader";

export default {

  name : "StudioDetail",


  data () {
    return {
      content : ""
    }
  },

  methods : {
    getTitle () {
      return this.content.titleHover.replace("$","<br/>");
    },
    getStudioTxt () {
      return  ContentLoader.DATA_TEXTS.studio;
    },

    getLeftElements () {
      return this.content.features.slice(0,Math.ceil(this.content.features.length/2));
    },

    getRightElements () {
      return this.content.features.slice(Math.ceil(this.content.features.length/2),this.content.features.length);
    },

    getClass () {
      return this.content.slug;
    },

    leave (fn, done) {
      var del = 0;
      TweenMax.staggerTo(this.splitTitle.lines, 0.3, {y : -30, opacity :0, scaleY : 0.8,ease : Back.easeInOut, delay : del});
      TweenMax.to(this.$refs.subtitle, 0.3, {y : -20, opacity :0, scaleY : 0.8, ease : Back.easeInOut, delay:del+0.1});
      TweenMax.to(this.$refs.bar, 0.3, {y : -40, opacity :0,ease : Expo.easeInOut, delay:del+0.15});
      TweenMax.to(this.$refs.txt, 0.3, {y : -40, opacity :0,ease : Expo.easeInOut, delay:del+0.2});
      TweenMax.to(this.$refs.icon, 0.3, {scaleX : 0, scaleY : 0,ease : Expo.easeInOut, delay:del+0.25});
      TweenMax.to(this.$refs.redBullet, 0.3, {scaleX : 0, scaleY : 0,ease : Expo.easeInOut, delay:del+0.3});

      TweenMax.to(this.$refs.leftColumn, 0.5, {x : -10, opacity : 0, ease : Expo.easeInOut, delay:del});
      TweenMax.to(this.$refs.rightColumn, 0.5, {x : 10, opacity : 0, ease : Expo.easeInOut, delay:del, onComplete:done});
    },

    emitParticles () {
      if(window.MOBILE_DETECT.mobile()) return;

      this.particlesOptions = {
  			positionRandomness: 8,
  			velocityRandomness: 0.8,
        velocity : new THREE.Vector3(0,0.1,0),
  			color: 0xed6d76,
  			colorRandomness: 0,
  			turbulence: .1,
  			lifetime: 5,
  			size: 3*(2/window.devicePixelRatio),
        tex : 'particle2.png',
  			sizeRandomness: 1
  		};

      var bounds = this.$refs.centerTitle.getBoundingClientRect();
      this.particlesOptions.position2d = {x : bounds.left+bounds.width/2, y : bounds.top+bounds.height/2};
      this.particlesOptions.position = null;

      if(window.environment3d){
        window.environment3d.emmitParticles(this.particlesOptions,60);
      }
    }
  },


  beforeMount () {
    for(var s in ContentLoader.DATA_STUDIOS){
      if(ContentLoader.DATA_STUDIOS[s].slug == this.$router.currentRoute.params.slug){
        this.content = ContentLoader.DATA_STUDIOS[s];
        break;
      }
    }
  },


  mounted () {

    TweenMax.to(document.getElementById("app"), 0.5, {scrollTo:{y : 0}});

    SoundsLoader.playSound("studiodetail", false, 0.2, 0);

    window.huiaPrerenderReady = true;
    if(window.environment3d){
      window.environment3d.setBlur(true,true);
    }

    if(window.mainMenu){
      window.mainMenu.changeColor("#ed6d76");
      window.mainMenu.transformInCloseButton();
    }else{
      TweenMax.to(this, 1, {onComplete:()=>{
        window.mainMenu.changeColor("#ed6d76");
        window.mainMenu.transformInCloseButton();}});
    }


    this.splitTitle = new SplitText(this.$refs.title, {type : "lines"});
    this.splitAbout = new SplitText(this.$refs.txt, {type : "lines"});

    var del = 0.5;

    TweenMax.staggerFromTo(this.splitTitle.lines, 1, {y : 30, opacity :0, scaleY : 0.8}, {y : 0, opacity :1, scaleY : 1, ease : Back.easeInOut, onStart:this.emitParticles, onStartScope:this, delay : del}, 0.1);
    TweenMax.fromTo(this.$refs.subtitle, 1, {y : 20, opacity :0, scaleY : 0.8}, {y : 0, opacity :1, scaleY : 1, ease : Back.easeInOut, delay:del+0.2});
    TweenMax.fromTo(this.$refs.bar, 1, {y : 40, opacity :0}, {y : 0, opacity : 1, ease : Expo.easeInOut, delay:del+0.4});
    TweenMax.fromTo(this.$refs.bar, 0.5, {height : 3}, {height : 10, ease : Expo.easeIn, delay:del+0.4, yoyo : true, repeat : 1});

    TweenMax.fromTo(this.$refs.icon, 0.5, {scaleX : 0.7, scaleY : 0.7, opacity : 0}, {scaleX : 1, scaleY : 1, opacity : 1, ease : Back.easeOut, delay : del+0.7});
    TweenMax.fromTo(this.$refs.redBullet, 0.5, {scaleX : 0.7, scaleY : 0.7, opacity : 0}, {scaleX : 1, scaleY : 1, opacity : 1, ease : Back.easeOut, delay : del+0.7});
    TweenMax.staggerFromTo(this.splitAbout.lines, 1, {y : 20, opacity :0, scaleY : 0.8}, {y : 0, opacity :1, scaleY : 1, delay:del+0.7, ease : Back.easeInOut}, 0.1);


    del = 1.5;
    var num = 0;
    for(var i = 0; i < this.$refs.leftColumn.children.length; i++){
      var el = this.$refs.leftColumn.children[i];

      var split = new SplitText(el.children[2], {type : "chars"});
      TweenMax.staggerFromTo(split.chars, 1, {x : 20, opacity : 0}, {x : 0, opacity : 1, ease : Expo.easeInOut, delay : del + (i * 0.1)},0.03);

      TweenMax.fromTo(el.children[0], 1, {x : -15, y : 25, scaleX : 0},{x : 0, y : 0, scaleX : 1, ease : Back.easeOut, delay : del + i * 0.3});
      TweenMax.fromTo(el.children[1], 1, {x : 15, y : -25, scaleX : 0},{x : 0, y : 0, scaleX : 1, ease : Back.easeOut, delay : del + i * 0.3});
    }

    for(var i = 0; i < this.$refs.rightColumn.children.length; i++){
      var el = this.$refs.rightColumn.children[i];

      var split = new SplitText(el.children[2], {type : "chars"});
      TweenMax.staggerFromTo(split.chars, 1, {x : 20, opacity : 0}, {x : 0, opacity : 1, ease : Expo.easeInOut, delay : del + (i * 0.1)},0.03);

      TweenMax.fromTo(el.children[0], 1, {x : -15, y : 25, scaleX : 0},{x : 0, y : 0, scaleX : 1, ease : Back.easeOut, delay : del + i * 0.3});
      TweenMax.fromTo(el.children[1], 1, {x : 15, y : -25, scaleX : 0},{x : 0, y : 0, scaleX : 1, ease : Back.easeOut, delay : del + i * 0.3});
    }

    if(this.$refs.rightColumn.children.length < this.$refs.leftColumn.children.length) {
      TweenMax.set(this.$refs.rightColumn.children[0], {top:24});
      
    }
  },


  beforeDestroy () {
    window.mainMenu.transformInMenuButton();
  }
}
</script>

<style lang="scss" scoped>
  section#studio-detail {
    position : absolute;
    top : 0px;
    left : 0px;
    width : 100%;
    height : 100%;
    padding-left : 200px;

    div.center-title {
      position : absolute;
      top : 50%;
      left : 50%;
      transform : translate(-50%,-50%);
      user-select : none;
      cursor : arrow !important;

      i {
        position : relative;
        display : block;
        margin-bottom: 40px;

        &.experience {
          width : 30px;
          height : 30px;
          border : 3px solid #fff;
          border-radius : 50%;
          left : -80px;
          top : -6px;
        }

        &.media {
          width : 15px;
          height : 15px;
          background : #fff;
          position : absolute;
          border-radius : 50%;
          left : -55px;
          top : -50px;
        }

        &.technology {
          left : -70px;
          top : -6px;
          width : 19px;
          height : 19px;
          overflow: hidden;

          &:after{
            width : 40px;
            height : 40px;
            border : 3px solid #fff;
            border-radius : 50%;
            content : "";
            display: block;
            position : absolute;
          }
        }
      }

      h1 {
        color : #fff;
        font-family: 'open_sansextrabold';
        text-transform: uppercase;
        font-size: 45px;
        text-align: center;
      }

      h2 {
        font-size: 25px;
        color : #ed6d76;
        font-family: 'open_sansbold';
        text-align: center;
      }

      div.bar {
        position : relative;
        float : left;
        width : 15px;
        height : 3px;
        background : #ed6d76;
        left : 50%;
        margin-left : -7.5px;
        margin-top : 30px;
      }

      span.txt{
        clear : both;
        float : left;
        position : relative;
        display: block;
        margin-top : 22px;
        color : #fff;
        font-family: 'open_sanssemibold';
        letter-spacing: 3px;
        max-width: 280px;
        text-align: center;
        font-size : 10px;
        line-height: 18px;
        text-shadow: 0px 0px 20px #fff;
      }

      div.red-bullet {
        width : 13px;
        height : 13px;
        position : relative;
        background : #ed6d76;
        border-radius : 50%;
        display: block;
        float : left;
        position : relative;
        clear : both;
        left : 100%;
        margin-top : 50px;
        margin-left : 70px;
      }
    }


    ul {
      li {
        color : #ed6d76;
        text-transform: uppercase;
        margin-bottom : 65px;
        font-family: 'open_sanssemibold';
        line-height: 19px;
        font-size : 15px;

        &:last-child{
          margin-bottom:0px;
        }
      }


      div.bar{
        display: block;
        float : left;
        width : 3px;
        height : 13px;
        background : #fff;
        transform : rotate(35deg);
        margin-top : 3px;
        margin-left : -14px;

        &:first-child {
          margin-left : -21px;
        }
      }
    }

    ul.left-column {
      display : block;
      float : left;
      clear : both;
      top : 50%;
      position : absolute;
      left : 18vw;
      transform : translateY(-50%);
    }

    ul.right-column {
      display: block;
      float : left;
      clear : both;
      position : absolute;
      left : 75vw;
      top : 50%;
      transform : translateY(-50%);
    }
  }




  @media screen and (max-width : 1000px){
    section#studio-detail {
      width : 100vw;
      height : auto;
      padding-left : 0px;
      overflow-y : scroll;
      overflow-x : hidden;
      -webkit-overflow-scrolling: touch;
      position : relative;
      display : block;
      float : left;
      padding-bottom : 15vh;

      div.center-title {
        margin-top : 20vh;
        left : 5vw;
        width : 90vw;
        transform : none;
        position : relative;
        display : block;
        float : left;

        i {
          top : 0px !important;
          left : 0px !important;
          position : absolute;
        }

        h1 {
          font-size: 12vw;
          display : block;
          float : left;
          position : relative;
          text-align: center;
          width : 100%;
          margin-top : 5vh;
        }

        h2 {
          font-size: 7vw;
          display : block;
          float : left;
          position : relative;
          width : 100%;
          text-align: center;
        }

        div.bar {
          width : 15px;
          height : 3px;
          background : #ed6d76;
          left : 50%;
          margin-left : -7.5px;
          margin-top : 3vh;
          display : block;
          float : left;
          position : relative;
        }

        span.txt{
          letter-spacing: 0.5vw;
          width: 70vw;
          left : 10vw;
          font-size : 3vw;
          line-height: 4.5vw;
          margin-top : 3vh;
          display : block;
          float : left;
          position : relative;
        }

        div.red-bullet {
          left : auto;
          right : 7vw;
          margin-top : 5vh;
          margin-left : auto;
          float : right;
          display : block;
          position : relative;
          clear : both;
        }
      }

      div.features {
        position : relative;
        display: block;
        float: left;
        clear : both;
        // width : 100vw;
        left : 50%;
        transform : translateX(-50%);
        margin-top : 10vh;
      }

      ul {
        li {
          text-transform: uppercase;
          margin-bottom : 10vw;
          font-family: 'open_sanssemibold';
          line-height: 3.5vw;
          font-size : 3vw;
          display: inline-block;
          float: left;
          clear: both;
          position : relative;

          &:last-child{
            margin-bottom:0px;
          }
        }

        div.bar{
          width : 2px;          

          &:first-child {
            margin-left : -20px;
          }
        }
      }

      ul.left-column {
        display: inline-block;
        float: left;
        position: relative;
        transform : none;
        width : 60vw;
      }

      ul.right-column {
        float: left;
        left: 0px;
        display: inline-block;
        position: relative;
        transform : none;
        clear : none;
        top : 0px;
        width : 30vw;
      }

      .feature-text {
        position:absolute;
        width:100px;
        top:62%;
        transform:translateY(-50%);
      }
    }
  }
</style>
