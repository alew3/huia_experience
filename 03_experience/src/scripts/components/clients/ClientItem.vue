<template lang="html">
  <div class="item-container" ref="container">
    <div class="bullet" ref="bullet"></div>
    <div class="detail" ref="detail">
      <div class="img-logo" ref="imgLogo" v-bind:style="{backgroundImage :'url('+this.getLogoPath()+')'}"></div>
      <div class="loading" ref="loading"><div class="percent"></div></div>
      <div class="part1" ref="detailpart1"><div class="half-bullet"></div></div>
      <div class="part2" ref="detailpart2"><div class="half-bullet"></div></div>
    </div>
    <div class="hit" ref="hit" v-on:mouseover="onOverHit" v-on:touchend="checkClickHit" v-on:mouseout="onOutHit"></div>
  </div>
</template>

<script>
import MathHelper from '../../helpers/MathHelper';
import SoundsLoader from '../../loaders/SoundsLoader';

export default {
  name : "clientItem",

  props : {
    model : null,
    index : 0
  },


  data () {
    return {
      loaded : false,
      w : 0,
      h : 0,
      visible : true,
      opened : false,
      name : "clientItem"
    }
  },

  beforeDestroy () {
    TweenMax.killTweensOf(this.$refs.container);
    TweenMax.killChildTweensOf(this.$refs.container);
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
      TweenMax.killTweensOf(this.$refs.container);
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
    getLogoPath(){
      if(this.loaded){
        if(this.model.logo){
          return window.ASSETS_URL + "upload/" + this.model.logo.filename;
        }else{
          return window.ASSETS_URL + "upload/1492437752034.png";
        }
      }else{
        return "";
      }
    },

    reactToHover(el){
      if(this.opened){
        this.onOutHit();
      }

      if(this.isMobile()){
          if(this.initialPositionY > el.initialPositionY){
            this.positionY = 70;
          }else{
            this.positionY = -70;
          }

          TweenMax.killTweensOf(this.$refs.container);
          TweenMax.to(this.$refs.container, 1+Math.random(), {y : this.positionY, top : this.topPos, ease : Back.easeOut});
          TweenMax.to(this.$refs.container, 1+Math.random(), {x : this.positionX, scaleX : 1, scaleY: 1, left : this.leftPos, ease : Back.easeOut, overwrite:false});
          return;
      }


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
        TweenMax.to(this.$refs.container, 1+Math.random(), {y : this.positionY, top : this.topPos, ease : Back.easeOut});
        TweenMax.to(this.$refs.container, 1+Math.random(), {x : this.positionX, scaleX : 1, scaleY: 1, left : this.leftPos, ease : Back.easeOut, overwrite:false});
      }
    },

    backToInitial(){
      TweenMax.killTweensOf(this.$refs.container);
      this.positionX = 0;
      this.positionY = 0;

      var sc = (this.opened) ? 0.8 : 1;
      TweenMax.to(this.$refs.container, 1, {x : 0, y : 0, left : this.leftPos, scaleX : sc, scaleY: sc, top : this.topPos, ease : Back.easeOut, onComplete:this.iniMovementLooping});
    },

    loadImage () {
      this.img = new Image();
      var self = this;
      this.img.onload = function(evt){
        self.loaded = true;
        self.w = self.img.naturalWidth;
        self.h = self.img.naturalHeight;

        self.showImage();
      }
      this.img.src = (this.model.logo == undefined) ? (window.ASSETS_URL + "upload/1492437752034.png") : (window.ASSETS_URL + "upload/" + this.model.logo.filename);
    },

    showImage () {
      var w2 = this.w/2;
      var h2 = this.h/2;

      if(this.model.logo == undefined)
        this.$refs.imgLogo.style.backgroundImage = 'url('+window.ASSETS_URL + 'upload/1492437752034.png)';
      else
        this.$refs.imgLogo.style.backgroundImage = 'url('+window.ASSETS_URL + "upload/" + this.model.logo.filename+')';
      this.$refs.imgLogo.style.display = "block";
      this.$refs.imgLogo.style.width = this.w+"px";
      this.$refs.hit.style.width = (this.w+40)+"px";
      this.$refs.imgLogo.style.height = this.h+"px";
      this.$refs.hit.style.height = (this.h+40)+"px";
      this.$refs.hit.style.left = -w2-20+"px";
      this.$refs.hit.style.top = -h2-20+"px";
      this.$refs.loading.style.display = "none";
      TweenMax.to(this.$refs.detailpart2, 0.5, {x : this.w+10, y : this.h+10, ease : Back.easeOut});
      TweenMax.to(this.$refs.detail, 0.5, {x : -w2,ease : Back.easeOut});
      TweenMax.to(this.$refs.detail, 2, {y : -h2,ease : Elastic.easeOut, overwrite:false});
      TweenMax.fromTo(this.$refs.imgLogo, 3, {scaleX : 0.5, scaleY : 0.5}, {scaleX : 1, scaleY : 1, force3D : true, ease : Elastic.easeOut});
    },

    onOverHit (evt){
      if(evt && this.isMobile()) return;
      TweenMax.killTweensOf(this.$refs.detail);

      SoundsLoader.playSound("overteam", false, 0.07, 0);
      TweenMax.to(this.$refs.bullet, 0.2, {scaleX : 0, scaleY : 0, ease : Quint.easeOut});

      TweenMax.to(this.$refs.detailpart2, 0.5, {x : 20, y : 20, ease : Back.easeOut});
      TweenMax.to(this.$refs.detail, 0.5, {x : -10,ease : Back.easeOut});
      TweenMax.to(this.$refs.detail, 2, {y : -10,ease : Elastic.easeOut, overwrite:false});
      TweenMax.fromTo(this.$refs.loading, 0.5, {scaleX : 0}, {scaleX : 1,force3D : true, rotation:45,ease : Quint.easeOut});
      TweenMax.killTweensOf(this.$refs.imgLogo);
      TweenMax.set(this.$refs.imgLogo, {x : 0, y : 0});

      this.opened = true;

      if(!this.loaded){
        this.loadImage();
      }else{
        this.showImage();
      }
      this.$refs.detail.style.display = "block";
      // TweenMax.fromTo(this.$refs.imgLogo, 3, {scaleX : 0.5, scaleY : 0.5}, {scaleX : 1, scaleY : 1, force3D : true, ease : Elastic.easeOut});

      var viewportOffset = this.$refs.container.getBoundingClientRect();
      this.particlesOptions.position2d = {x : viewportOffset.left, y : viewportOffset.top};
      this.particlesOptions.position = null;

      if(this.isMobile()){
        TweenMax.to(this.$refs.container,1, {scaleX : 0.8, scaleY : 0.8, ease: Quint.easeOut});
      }

      // this.$refs.hit.style.width = "125px";
      // this.$refs.hit.style.height = "70px";
      // this.$refs.hit.style.left = "-63px";
      // this.$refs.hit.style.top = "-35px";

      if(window.environment3d){
          window.environment3d.emmitParticles(this.particlesOptions,50);
      }

      this.$emit("onOverBullet", this);
    },

    onOutHit(evt){
      if(evt && evt != "ignore" && this.isMobile()) return;

      TweenMax.killTweensOf(this.$refs.detail);
      TweenMax.killTweensOf(this.$refs.imgLogo);
      this.opened = false;
      TweenMax.to(this.$refs.imgLogo, 0.1, {scaleX : 0, scaleY : 0, x : -75, y : -40, ease : Quint.easeOut});

      this.$refs.hit.style.width = "30px";
      this.$refs.hit.style.height = "30px";
      this.$refs.hit.style.left = "-15px";
      this.$refs.hit.style.top = "-15px";
      TweenMax.to(this.$refs.loading, 0.1, {scaleX : 0, force3D : true, ease : Quint.easeOut});
      TweenMax.to(this.$refs.bullet, 0.1, {scaleX : 1, scaleY : 1, ease : Quint.easeIn});
      TweenMax.to(this.$refs.detail, 0.1, {x : 0,y : 0, ease : Quint.easeOut, onComplete:()=>{this.$refs.detail.style.display="none";}});
      TweenMax.to(this.$refs.detailpart1, 0.1, {x : 0,y : 0, ease : Quint.easeOut});
      TweenMax.to(this.$refs.detailpart2, 0.1, {x : 0,y : 0, ease : Quint.easeOut});

      if(this.isMobile()){
        TweenMax.to(this.$refs.container, 1, {scaleX : 1, scaleY :1, ease: Quint.easeOut});
      }

      // if(evt != "ignore")
      this.$emit("onOutBullet", this, (evt == "ignore"));
    },

    checkClickHit(){
      if(this.opened){
        this.onOutHit("ignore");
      }else{
        this.onOverHit();
      }
    },

    iniMovementLooping () {
      if(this.$refs.container == null) return;

      var posx = this.positionX - 5 + Math.random()*10;
      var posy = this.positionY - 5 + Math.random()*10;

      var distance = MathHelper.distanceBetweenTwoPoints({x : posx, y : posy}, {x : this.finRandomX, y : this.finRandomY});

      this.finRandomX = posx;
      this.finRandomY = posy;
      TweenMax.to(this.$refs.container, distance/5, {left : this.leftPos, top : this.topPos, x : posx, y : posy, ease : Linear.easeNone, onComplete:this.iniMovementLooping, onCompleteScope:this});
    }
  },


  mounted () {
    var posx = Math.floor(this.index/5) * 300;
    var posy = (this.index%5)* 120;
    posx += (this.index%2)*100;
    posx += -30+Math.random()*60;
    posy -= 30 + Math.random()*60;

    this.particlesOptions = {
			positionRandomness: 5,
			velocityRandomness: .5,
			color: 0x7bc2b4,
			colorRandomness: .1,
			turbulence: .1,
			lifetime: 5,
			size: 3*(2/window.devicePixelRatio),
      tex : 'particle2.png',
			sizeRandomness: 1
		};





    this.reactToHover = this.reactToHover.bind(this);
    this.backToInitial = this.backToInitial.bind(this);
  }
}
</script>

<style lang="scss">
  div.item-container {
    position : absolute;

    h1 {
      font-size : 0px;
    }
    div.bullet {
      width : 20px;
      height : 20px;
      border-radius : 50%;
      display : block;
      border : 3px solid #7bc2b4;

      position : absolute;
      top : -10px;
      left : -10px;
    }


    div.detail {
      position : absolute;
      top : -10px;
      left : -10px;
      display : none;
      perspective: 100;
      perspective-origin: 75px 40px;

      div.img-logo {
        position : absolute;
        display : block;
        background-position: center center;
        background-size: contain;
        background-repeat: no-repeat;
        transform-style: preserve-3d;
        top : 15px;
        left : 15px;
        display : none;
      }

      div.loading {
        position : absolute;
        width : 25px;
        height : 2px;
        background : rgba(123,194,180,0.5);
        top : 12px;
        left : 12px;
        transform-origin: center left;
        transform : rotate(45deg);

        div.percent{
          background : #fff;
          width : 0px;
          height : 2px;
          display : block;
          transform-origin: 0px 0px;
          opacity : 0.5;
        }
      }

      div.part1, div.part2{
        width : 10px;
        height : 10px;
        position : absolute;
        overflow: hidden;
      }

      div.part1 div.half-bullet {
        width : 20px;
        height : 20px;
        border-radius : 50%;
        display : block;
        border : 3px solid #7bc2b4;

        position : absolute;
      }

      div.part2 div.half-bullet {
        width : 20px;
        height : 20px;
        border-radius : 50%;
        display : block;
        border : 3px solid #7bc2b4;
        top : -10px;
        left : -10px;

        position : absolute;
      }

      div.part2 {
        top : 10px;
        left : 10px;
      }
    }

    div.hit {
      position : absolute;
      width : 30px;
      height : 30px;
      display : block;
      cursor : pointer;
      top : -15px;
      left : -15px;
    }
  }
</style>
