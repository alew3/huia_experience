<template lang="html">
  <div class="member-container" ref="container">
    <div class="bullet" ref="bullet">
      <svg height="210" width="500" viewBox="0 0 66 66">
        <polygon points="30,6 60,60 6,60" style="fill:transparent;stroke:#7bc2b4;stroke-width:10" />
      </svg>
    </div>
    <div class="detail" ref="detail">
      <div class="img-photo-bg" ref="imgLogoBg"></div>
      <div class="img-photo" ref="imgLogo" v-bind:style="{backgroundImage :'url('+this.getImage()+')'}"></div>
      <div class="part1" ref="detailpart1"></div>
      <div class="part2" ref="detailpart2"></div>
      <div class="part3" ref="detailpart3"></div>
      <div class="text" ref="txt">
        <div class="name" v-html="getNameHtml(this.model.name)"></div>
        <p>{{this.model.title}}</p>
      </div>
    </div>
    <div class="hit" ref="hit" v-on:mouseover="onOverHit" v-on:touchend="checkClickHit" v-on:mouseout="onOutHit"></div>
  </div>
</template>

<script>
import MathHelper from '../../helpers/MathHelper';
import SoundsLoader from '../../loaders/SoundsLoader';

export default {
  name : "teamMember",

  props : {
    model : null,
    index : null
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

    checkClickHit(){
      if(this.opened){
        this.onOutHit("ignore");
      }else{
        this.onOverHit();
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
    getImage(){
      if(this.loaded){
        if(this.model.photo){
          return window.ASSETS_URL + "upload/" + this.model.photo.filename;
        }else{
          return window.ASSETS_URL + "upload/1492432650770.png";
        }
      }else{
        return "";
      }
    },

    data() {
      return {
          loaded : false,
          visible : true,
          opened : false,
          name : "teamMember"
      }
    },

    getNameHtml(name){
      var arr = name.split("$");
      var s = "";

      for(var i =0 ; i < arr.length;i++){
        s += "<p>"+arr[i]+"</p>";
      }

      return s;
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
        TweenMax.to(this.$refs.container, 1+Math.random(), {y : this.positionY, top : this.topPos, scaleX : 1, scaleY : 1, ease : Back.easeOut});

        if(! this.isMobile()){
          TweenMax.to(this.$refs.container, 1+Math.random(), {x : this.positionX, left : this.leftPos, opacity:1, ease : Back.easeOut, overwrite:false});
        }
      }
    },

    backToInitial(){
      TweenMax.killTweensOf(this.$refs.container);
      this.positionX = 0;
      this.positionY = 0;
      var sc = (this.opened) ? 0.8 : 1;
      TweenMax.to(this.$refs.container, 1, {x : 0, y : 0/*, left : this.leftPos*/, opacity:1, shortRotation : 0, angle : 0, top : this.topPos, scaleX : sc, scaleY : sc, ease : Back.easeOut, onComplete:this.iniMovementLooping});
    },

    loadImage () {
      this.img = new Image();
      var self = this;
      this.img.onload = function(evt){
        self.loaded = true;
        self.showImage();
      }
      this.img.src = window.ASSETS_URL + "upload/" + this.model.photo.filename;
    },

    showImage (anim) {
      this.$refs.imgLogo.style.backgroundImage = 'url(' + ((this.model.photo) ? window.ASSETS_URL + "upload/" + this.model.photo.filename : window.ASSETS_URL + "upload/1492432650770.png") + ')';
      this.$refs.imgLogoBg.style.display = "none";
      TweenMax.killTweensOf(this.$refs.imgLogo);
      if(anim){
        TweenMax.set(this.$refs.imgLogo, {x : 0, y : 0});
        TweenMax.fromTo(this.$refs.imgLogo, 3, {scaleX : 0.5, scaleY : 0.5}, {scaleX : 1, scaleY : 1, force3D : true, ease : Elastic.easeOut, overwrite:false});
        TweenMax.fromTo(this.$refs.imgLogo, 3, {scaleX : 0.5, scaleY : 0.5, opacity : 0}, {scaleX : 1, scaleY : 1, opacity:1, force3D : true, ease : Elastic.easeOut, overwrite:false});
      }else{
        TweenMax.fromTo(this.$refs.imgLogo, 0.3, {opacity : 0}, {opacity : 1, overwrite:false});
      }
    },

    onOverHit (evt){
      if(evt && this.isMobile()) return;
      this.opened = true;

      SoundsLoader.playSound("overteam", false, 0.05, 0);
      TweenMax.killTweensOf(this.$refs.detail);
      TweenMax.to(this.$refs.bullet, 0.2, {scaleX : 0, scaleY : 0, ease : Quint.easeOut});
      this.$refs.detail.style.display = "block";

      TweenMax.to(this.$refs.detail, 0.5, {x : -62,ease : Back.easeOut});
      TweenMax.to(this.$refs.detail, 2, {y : -80,ease : Elastic.easeOut, overwrite:false});
      TweenMax.to(this.$refs.detailpart1, 0.5, {x : 0, y : 90,width:20, ease : Back.easeOut});
      TweenMax.to(this.$refs.detailpart2, 0.5, {x : 70, y : 30, width : 20, ease : Back.easeOut});
      TweenMax.to(this.$refs.detailpart3, 0.5, {x : 50, y : 140, width : 20, ease : Back.easeOut});

      if(!this.loaded){
        this.loadImage();
      }else{
        this.showImage(true);
      }

      //
      this.$refs.txt.style.display = "block";
      //
      var viewportOffset = this.$refs.container.getBoundingClientRect();
      this.particlesOptions.position2d = {x : viewportOffset.left, y : viewportOffset.top};
      this.particlesOptions.position = null;


      if(this.isMobile()) {
        this.$refs.container.style.left = "45px";
      }

      //
      this.$refs.hit.style.width = "260px";
      this.$refs.hit.style.height = "160px";
      this.$refs.hit.style.left = "-130px";
      this.$refs.hit.style.top = "-80px";
      //
      if(window.environment3d){
          window.environment3d.emmitParticles(this.particlesOptions,50);
      }


      if(this.isMobile()){
        TweenMax.to(this.$refs.container, 0.5, {scaleX : 0.8, scaleY : 0.8, ease: Quint.easeOut});
      }
      //
      //
      this.$emit("onOverBullet", this);
    },

    onOutHit(evt){
      if(evt && evt != "ignore" && this.isMobile()) return;
      this.opened = false;
      if(this.isMobile()){
        TweenMax.to(this.$refs.container, 0.5, {scaleX : 1, scaleY : 1, ease: Quint.easeOut});
      }
      TweenMax.killTweensOf(this.$refs.detail);
      TweenMax.killTweensOf(this.$refs.imgLogo);
      TweenMax.to(this.$refs.imgLogo, 0.1, {scaleX : 0, scaleY : 0, x : -95, y : -95, ease : Quint.easeOut});
      TweenMax.to(this.$refs.imgLogoBg, 0.1, {scaleX : 0, scaleY : 0, x : -95, y : -95, ease : Quint.easeOut});
      this.$refs.txt.style.display = "none";
      //
      this.$refs.hit.style.width = "30px";
      this.$refs.hit.style.height = "30px";
      this.$refs.hit.style.left = "-15px";
      this.$refs.hit.style.top = "-15px";
      //
      TweenMax.to(this.$refs.bullet, 0.1, {scaleX : 1, scaleY : 1, ease : Quint.easeIn});
      TweenMax.to(this.$refs.detail, 0.1, {x : 0,y : 0, ease : Quint.easeOut, onComplete:()=>{this.$refs.detail.style.display="none";}});
      TweenMax.to(this.$refs.detailpart1, 0.1, {x : 0,y : 0, ease : Quint.easeOut});
      TweenMax.to(this.$refs.detailpart2, 0.1, {x : 0,y : 0, ease : Quint.easeOut});
      TweenMax.to(this.$refs.detailpart3, 0.1, {x : 0,y : 0, ease : Quint.easeOut});

      this.$emit("onOutBullet", this, (evt == "ignore"));
    },

    onMoveInLogo(evt){
      var difx = (evt.offsetX - 62)/62;
      var dify = (evt.offsetY - 62)/62;
      TweenMax.to(this.$refs.imgLogo, 1, {rotationX : dify*5, rotationY : -difx*5, ease: Quint.easeOut, overwrite:false});
    },

    iniMovementLooping () {
      if(this.$refs.container == null) return;

      var posx = this.positionX - 5 + Math.random()*10;
      var posy = this.positionY - 5 + Math.random()*10;

      var distance = MathHelper.distanceBetweenTwoPoints({x : posx, y : posy}, {x : this.finRandomX, y : this.finRandomY});

      this.finRandomX = posx;
      this.finRandomY = posy;
      TweenMax.to(this.$refs.container, distance/5, {x : posx, y : posy, ease : Linear.easeNone, onComplete:this.iniMovementLooping, onCompleteScope:this});
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
			turbulence: .05,
			lifetime: 5,
			size: 3*(2/window.devicePixelRatio),
			sizeRandomness: 1
		};



    this.reactToHover = this.reactToHover.bind(this);
    this.backToInitial = this.backToInitial.bind(this);
  }
}
</script>

<style lang="scss">
  div.member-container {
    position : absolute;
    div.bullet {
      width : 22px;
      height : 22px;
      top : -11px;
      left : -11px;
      position : absolute;

      svg {
        width : 22px;
        height : 22px;
        position : absolute;
      }
    }

    div.detail {
      position : absolute;
      top : 6px;
      left : -30px;
      display : none;
      perspective: 100;
      perspective-origin: 62px 62px;


      div.text {
        position : absolute;
        width : 140px;
        font-family: 'open_sansbold';
        text-transform: uppercase;
        color : #fff;
        left : 180px;
        top : 50px;

        div.name {
          p{
            line-height: 15px;
            display : block;
            float : left;
            padding-left : 2px;
            letter-spacing: 13px;
            margin-bottom : 10px;

            background: rgba(122,193,179,1);
            background: -moz-linear-gradient(left, rgba(122,193,179,1) 0%, rgba(122,193,179,0) 84%, rgba(122,193,179,0) 100%);
            background: -webkit-gradient(left top, right top, color-stop(0%, rgba(122,193,179,1)), color-stop(84%, rgba(122,193,179,0)), color-stop(100%, rgba(122,193,179,0)));
            background: -webkit-linear-gradient(left, rgba(122,193,179,1) 0%, rgba(122,193,179,0) 84%, rgba(122,193,179,0) 100%);
            background: -o-linear-gradient(left, rgba(122,193,179,1) 0%, rgba(122,193,179,0) 84%, rgba(122,193,179,0) 100%);
            background: -ms-linear-gradient(left, rgba(122,193,179,1) 0%, rgba(122,193,179,0) 84%, rgba(122,193,179,0) 100%);
            background: linear-gradient(to right, rgba(122,193,179,1) 0%, rgba(122,193,179,0) 84%, rgba(122,193,179,0) 100%);
            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#7ac1b3', endColorstr='#7ac1b3', GradientType=1 );
          }
          margin-bottom : 15px;
        }
      }

      div.img-photo-bg {
        position : absolute;
        display : none;
        opacity : 0.3;

        width : 160px;
        height : 160px;
        display : block;
        background-position: center center;
        background-size: contain;
        background-repeat: no-repeat;
        transform-style: preserve-3d;
        background-image: url('/static/images/bg-team-member.png');
        top : 0px;
      }

      div.img-photo {
        position : absolute;
        display : none;

        width : 160px;
        height : 160px;
        display : block;
        background-position: center center;
        background-size: contain;
        background-repeat: no-repeat;
        transform-style: preserve-3d;
        top : 0px;
      }

      div.part1,div.part2,div.part3 {
        width : 20px;
        height : 2px;
        display : block;
        position : absolute;
        background : #7bc2b4;
        transform-origin: 0px 2px;
      }

      div.part1{
        transform : rotate(-63deg);
        left : 25px;
        top : 0px;
      }

      div.part2{
        transform : rotate(65deg);
        left : 24px;
        top : -17px;
      }

      div.part3 {
        top : 30px;
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

  @media screen and (max-width : 1000px){
    div.member-container {     

      div.detail {        

        div.text {    
          left:150px;
        }
      }
    }
  }
</style>
