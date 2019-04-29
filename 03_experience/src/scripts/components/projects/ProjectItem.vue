<template lang="html">
  <li ref="container">
    <svg viewBox="0 0 50 50" ref="svgbullet" class="circlebullet">
      <circle ref="circlebullet" cx="25" cy="25" r="21" stroke="#ffffff" stroke-width="1.1" stroke-linecap="round" stroke-dasharray="0.1,7.8" fill="transparent" />
    </svg>
    <div class="geometries">
      <div class="box" ref="box">
          <div class="box-percentage" ref="boxpercentage">
          </div>
      </div>
      <div class="boxbar1" ref="boxbar1"></div>
      <div class="boxbar2" ref="boxbar2"></div>
    </div>
    <svg version="1.1" x="0px" y="0px" ref="preloading" class="preloading"
    	 viewBox="0 0 536.2 533.9" style="enable-background:new 0 0 536.2 533.9;" xml:space="preserve">
    <polygon ref="percentage" class="st0" stroke="#ffffff" stroke-width="5" fill="transparent" points="268.1,0.5 171,18.7 87,70.6 27.5,149.5 0.5,244.4 9.6,342.8 53.6,431.2 126.6,497.7 218.7,533.4
    	317.5,533.4 409.6,497.7 482.5,431.2 526.6,342.8 535.7,244.4 508.6,149.5 449.1,70.6 365.2,18.7 "/>
    </svg>
    <svg viewBox="0 0 50 50" ref="circles">
      <circle ref="circleout" cx="25" cy="25" r="21" stroke="#ffffff" stroke-width="0.3" fill="transparent" />
      <circle ref="circlein" cx="25" cy="25" r="22" stroke="rgba(255,255,255,0.3)" stroke-width="0.3" fill="transparent" />
    </svg>
    <div class="text-block" ref="txtcontainer">
      <h2 ref="txtpart1">{{this.model.title}}</h2>
      <span ref="txtpart2">{{this.model["subtitle-title"]}}</span>
      <p ref="opentxt">CLICK</p>
    </div>

    <div class="hit" ref="hit" v-if="isMobile()" v-on:touchstart="onOverItem" v-on:touchend="onOutItem"></div>
    <div class="hit" ref="hit" v-if="!isMobile()" v-on:mouseover="onOverItem" v-on:mouseout="onOutItem" v-on:click="onClickItem"></div>
  </li>
</template>

<script>
import '../../vendors/SplitText.min';
import MathHelper from '../../helpers/MathHelper';
import SoundsLoader from '../../loaders/SoundsLoader';
import * as THREE from "three";

export default {
  props : {
    model : null,
    index : 0
  },

  data () {
    return {
      visible : true,
      blur : {strength : 0}
    }
  },

  methods :{
    isMobile() {
        return window.MOBILE_DETECT.mobile()
    },

    setBorderColor(){
      var rgb = MathHelper.hexToRGB(this.model.hover_color);

      this.$refs.box.style.borderColor = this.model.hover_color;
      this.$refs.boxpercentage.style.backgroundColor = this.model.hover_color;
      this.$refs.boxbar1.style.backgroundColor = this.model.hover_color;
      this.$refs.boxbar2.style.backgroundColor = this.model.hover_color;

      if(window.environment3d){
          window.environment3d.emmitParticles(this.particlesOptions,60);
          window.environment3d.showBackgroundProject(this.model.background, this.model.hover_color);
      }
    },


    fadeOutElement (index) {
      if(this.isMobile()){
        this.onOutItem();
        TweenMax.to(this.$refs.container, 1, {y : this.index < index ? -10 : 10, ease : Quint.easeOut});
        return;
      }

      this.$refs.box.style.borderColor = "#888888";
      this.$refs.boxbar1.style.backgroundColor = "#888888";
      this.$refs.boxbar2.style.backgroundColor = "#888888";
      var sc = 0.8;
      TweenMax.to(this.$refs.container, 0.2, {opacity : (this.visible ? 0.5 : 0.1), blur : 2, scaleX : sc, scaleY : sc, force3D : true, ease : Quint.easeOut, onUpdateScope:this});
    },

    hideElement () {
      TweenMax.to(this.$refs.container, 0.3, {opacity : 0});
    },

    fadeInElement() {
      if(this.isMobile()){
        TweenMax.to(this.$refs.container, 1, {y : 0, ease : Quint.easeOut});
        return;
      }

      this.$refs.box.style.borderColor = "#7bc2b4";
      this.$refs.boxbar1.style.backgroundColor = "#7bc2b4";
      this.$refs.boxbar2.style.backgroundColor = "#7bc2b4";
      var sc = 1;
      TweenMax.to(this.$refs.container, 0.2, {opacity: (this.visible ? 1 : 0.1), scaleX : sc, scaleY : sc, blur : 0, force3D : true, ease : Quint.easeOut,  onUpdateScope:this});
    },
    updateBlur() {
      TweenMax.set(this.$refs.container, {webkitFilter:"blur("+this.$refs.container.blur+"px)"});
    },
    Color(){
      // this.$refs.circlebullet.style.stroke = this.model.hover_color;
    },

    showHit () {
      this.$refs.hit.style.display = "block";
    },

    onOverItem(evt){
      TweenMax.killTweensOf(this.$refs.box);
      TweenMax.killTweensOf(this.$refs.txtpart1);
      TweenMax.killTweensOf(this.$refs.txtpart2);
      TweenMax.killTweensOf(this.$refs.svgbullet);
      TweenMax.killTweensOf(this.$refs.preloading);
      TweenMax.killTweensOf(this.openSplit.chars);

      this.downTime = new Date().getTime();

      if(this.isMobile())
      {
        this.downPosition = this.$refs.container.getBoundingClientRect().top;

      }

      // SoundsLoader.playSound("overmenu", false, 0.3, 0);
      var n = 1 + Math.round(Math.random()*1);
      SoundsLoader.playSound("projecthover"+n, false, 0.2, 0);

      var w = (this.model["subtitle-title"] ? 60 : 50);

      // TweenMax.fromTo(this.$refs.box, 0.1, {width : 42, height : 42, marginLeft:-21}, {width : 16, height : 16, marginLeft : -8, ease : Quint.easeOut});
      // TweenMax.fromTo(this.$refs.box, 0.3, {marginTop:-21},{marginTop : -60, ease : Quad.easeInOut});
      // TweenMax.to(this.$refs.box, 0.3, {marginTop : 40, ease : Quad.easeIn, overwrite:false, delay:0.3});
      // TweenMax.to(this.$refs.box, 0.3, {width : w, height : w, marginLeft : -Math.round(w/2), marginTop : -Math.round(w*0.72), onStart:this.setBorderColor.bind(this),ease : Back.easeOut, overwrite:false, delay:0.6});
      TweenMax.to(this.$refs.box, 0.3, {marginTop : 40, ease : Quad.easeIn, overwrite:false});
      TweenMax.to(this.$refs.box, 0.3, {width : w, height : w, marginLeft : -Math.round(w/2), marginTop : -Math.round(w*0.72), onStart:this.setBorderColor.bind(this),ease : Back.easeOut, overwrite:false});
      TweenMax.to(this.$refs.boxpercentage, 0.3, {width : w, height : w, x : -w, ease : Back.easeOut, overwrite:false});

      TweenMax.set(this.$refs.svgbullet, {rotation : 0});
      TweenMax.set(this.$refs.preloading, {rotation : 10});
      // TweenMax.fromTo(this.$refs.svgbullet, 1, {scaleX : 0.8, scaleY : 0.8, marginTop : -120, marginLeft : -115, opacity:0},{scaleX : 1, scaleY : 1, opacity : 0.2, ease : Quint.easeOut});
      TweenMax.fromTo(this.$refs.preloading, 0.5, {scaleX : 1.2, scaleY : 1.2, marginTop : -103, marginLeft : -97.5, opacity:0},{scaleX : 1, scaleY : 1, opacity : 0.2, ease : Back.easeOut, delay : 0.3});
      TweenMax.to(this.$refs.svgbullet, 20, {rotation : 360, repeat : -1, overwrite:false, ease : Linear.easeNone});
      TweenMax.to(this.$refs.preloading, 20, {rotation : 364, repeat : -1, overwrite:false, ease : Linear.easeNone});
      // TweenMax.to(this.$refs.txtcontainer, 0.5, {scale:1.8, delay:0.3,force3D : true, ease : Back.easeOut});
      // TweenMax.to(this.$refs.txtcontainer, 0.5, {marginTop:10,force3D : true, delay : 0.8, overwrite:false, ease : Back.easeOut});
      // TweenMax.staggerFromTo(this.openSplit.chars, 0.5, {y : 10, opacity : 0}, {y : 0, opacity :1,force3D : true, delay : 0.9, overwrite:false, ease : Back.easeOut}, 0.05);

      TweenMax.to(this.$refs.txtcontainer, 1, {scale:1.4, force3D : true, delay:0.1, ease : Quint.easeOut});
      TweenMax.to(this.$refs.txtcontainer, 1, {marginTop:10,force3D : true, overwrite:false, delay:0.1, ease : Quint.easeOut});
      TweenMax.staggerFromTo(this.openSplit.chars, 0.5, {y : 10, opacity : 0}, {y : 0, opacity :1,force3D : true, delay : 0.3, overwrite:false, ease : Back.easeOut}, 0.05);



      TweenMax.killTweensOf(this.$refs.circlein);
      TweenMax.killTweensOf(this.$refs.circleout);
      TweenMax.set(this.$refs.circlein, {drawSVG: "0% 0%"});
      TweenMax.set(this.$refs.circleout, {drawSVG: "0% 0%", opacity : (window.MOBILE_DETECT.mobile() ? 0 : 1)});

      // TweenMax.to(this.$refs.circlein, 0.3, {drawSVG : "40% 80%", ease : Linear.easeNone, delay:0.3});
      // TweenMax.to(this.$refs.circlein, 0.6, {drawSVG : "100% 100%", ease : Quint.easeOut, delay:0.6, overwrite:false});
      // TweenMax.to(this.$refs.circleout, 0.3, {drawSVG : "40% 80%", ease : Linear.easeNone, delay:0.3});
      // TweenMax.to(this.$refs.circleout, 0.6, {drawSVG : "100% 100%", ease : Quint.easeOut, delay:0.6, overwrite:false});

      TweenMax.killTweensOf(this.$refs.boxbar1);
      TweenMax.killTweensOf(this.$refs.boxbar2);

      TweenMax.to(this.$refs.boxbar1, 0.3, {x : -40, y : -40, width : 0, ease : Back.easeIn});
      TweenMax.to(this.$refs.boxbar2, 0.3, {x : 80, y : 40, width : 0, ease : Back.easeIn});

      var viewportOffset = this.$refs.container.getBoundingClientRect();
      this.particlesOptions.position2d = {x : viewportOffset.left+100, y : viewportOffset.top+30};
      this.particlesOptions.position = null;


      if(this.isMobile()){
        // TweenMax.to(this.$refs.container, 1, {x : (this.index%2 != 0)? -30 : 10, ease : Quint.easeOut});
        
        var y = document.getElementById('app').scrollTop + (window.innerHeight/2) - this.$refs.container.offsetHeight;
        TweenMax.to(this.$refs.container, 1, {top:y, ease: Quint.easeOut});
      }

      if(!this.isMobile()){
        this.$refs.hit.addEventListener('mousemove', this.onMoveItem);
      }
      this.$emit('onOverItem', this.index);
    },

    onOutItem(evt){
      if(this.loading)
        return;

      if(evt && this.isMobile()){

        if((new Date().getTime() - this.downTime < 1000) && Math.abs(this.$refs.container.getBoundingClientRect().top - this.downPosition) < 300){

          this.onClickItem();
          return;
        }
      }

      if(!this.isMobile()){
        this.$refs.hit.removeEventListener('mousemove', this.onMoveItem);
      }


      TweenMax.killTweensOf(this.$refs.box);
      TweenMax.killTweensOf(this.$refs.txtcontainer);
      TweenMax.killTweensOf(this.$refs.svgbullet);
      TweenMax.killTweensOf(this.$refs.preloading);
      TweenMax.killTweensOf(this.openSplit.chars);
      TweenMax.killTweensOf(this.$refs.boxpercentage);

      if(!this.$refs.box)
        return;

      this.$refs.box.style.borderColor = "#7bc2b4";
      this.$refs.boxbar1.style.backgroundColor = "#7bc2b4";
      this.$refs.boxbar2.style.backgroundColor = "#7bc2b4";
      // this.$refs.circlebullet.style.stroke = "#7bc2b4";

      if(this.isMobile()){
        TweenMax.to(this.$refs.container, 1, {x : 0, ease : Quint.easeOut});
      }

      if(window.environment3d){
        window.environment3d.hideBackgroundProject();
      }

      if(!this.$refs.box)
        return;



      TweenMax.to(this.$refs.box, 0.3, {width : 42, height : 42, x : 0, y : 0, marginTop:-21, marginLeft:-21, ease : Back.easeOut, rotation:-45});
      TweenMax.to(this.$refs.svgbullet, 0.3, {opacity : 0, scaleX : 0.5, scaleY : 0.5});
      TweenMax.to(this.$refs.preloading, 0.3, {opacity : 0, scaleX : 0.5, scaleY : 0.5});
      TweenMax.to(this.$refs.boxpercentage, 0.3, {x : -90});
      TweenMax.to(this.$refs.txtcontainer, 0.3, {scale:1, marginTop : 15, ease : Quad.easeOut});
      TweenMax.to(this.$refs.txtpart1, 0.3, {x : 0, y : 0, ease : Quad.easeOut});
      TweenMax.to(this.$refs.txtpart2, 0.3, {x : 0, y : 0, ease : Quad.easeOut});
      TweenMax.to(this.$refs.opentxt, 0.3, {x : 0, y : 0, ease : Quad.easeOut});

      TweenMax.killTweensOf(this.$refs.circlein);
      TweenMax.killTweensOf(this.$refs.circleout);
      TweenMax.set(this.$refs.circlein, {drawSVG: "0% 0%"});
      TweenMax.set(this.$refs.circleout, {drawSVG: "0% 0%"});

      TweenMax.to(this.$refs.boxbar1, 0.3, {x : 0, y : 0, width : 26, ease : Quint.easeOut});
      TweenMax.to(this.$refs.boxbar2, 0.3, {x : 0, y : 0, width : 26, ease : Quint.easeOut});

      TweenMax.to(this.openSplit.chars, 0.2, {y : -10, opacity : 0});
      this.$emit('onOutItem', this.index);
    },

    setColors () {

    },

    checkVisibility(posx){
      if(this.posx + posx < window.innerWidth*0.05){
        this.visible = false;
        TweenMax.to(this.$refs.container, 1, {opacity : 0.1, ease : Quint.easeOut});
      }else{
        this.visible = true;
        TweenMax.to(this.$refs.container, 1, {opacity : 1,  ease : Quint.easeOut});
      }
    },

    onClickItem(evt){
      this.loading = true;
      this.loadingCompleted = false;
      document.body.style.pointerEvents = "none";
      this.$refs.opentxt.style.letterSpacing = "3px";
      this.$refs.opentxt.innerHTML = "0%";


      if(!ContentLoader.getProjectDetail(this.model.slug)){
        ContentLoader.loadProjectDetail(this.model.slug, this.onProgressLoading, this.onCompleteLoading);

        if(this.isMobile()){
          TweenMax.to(this.$refs.container, 1, {left : "50vw", x : 0, scaleX : 0.8, scaleY : 0.8, ease : Quint.easeInOut});
          this.$emit('onClickItem', this.index);
        }
      }else{
        this.goRoute();
      }
    },

    onMoveItem(evt){

      if(this.destroying) return;

      var coefx = ((evt.clientX - this.$refs.hit.getBoundingClientRect().left)-109)/109;
      var coefy = ((evt.clientY - this.$refs.hit.getBoundingClientRect().top)-90)/90;
      var angle = Math.atan2(coefx, coefy);
      var distance = Math.abs(coefx + coefy);
      coefx = Math.min(coefx, 1);
      coefx = Math.max(coefx, -1);
      coefy = Math.min(coefy, 1);
      coefy = Math.max(coefy, -1);

      // console.log(coefx, coefy);

      TweenMax.to(this.$refs.txtpart1, 2, {x : Math.sin(angle) * (distance*7), y : Math.cos(angle)*(distance*7), roundedProps:"x,y", ease : Quint.easeOut});
      TweenMax.to(this.$refs.txtpart2, 2, {x : Math.sin(angle) * (distance*10), y : Math.cos(angle)*(distance*10), roundedProps:"x,y", ease : Quint.easeOut});
      TweenMax.to(this.$refs.opentxt, 2, {x : Math.sin(angle) * (distance*12), y : Math.cos(angle)*(distance*12), ease : Quint.easeOut});
      TweenMax.to(this.$refs.box, 2, {x : -Math.sin(angle) * (distance*12), y : -Math.cos(angle)*(distance*12), ease : Quint.easeOut});
    },

    onProgressLoading(p){
      // TweenMax.to(this.$refs.percentage, 1, {drawSVG : "0% "+Math.round(p*100)+"%"color, ease : Quint.easeOut});
      var w = (this.model["subtitle-title"] ? 60 : 50);
      TweenMax.to(this.$refs.boxpercentage, 0.3, {x : Math.round(1-p)*-w, ease : Quint.easeOut});
      this.$refs.opentxt.innerHTML = Math.round(p*100) + "%";
    },

    onCompleteLoading(evt){
      this.loading = false;
      this.loadingCompleted = true;
      // TweenMax.to(this.$refs.percentage, 1, {drawSVG : "0% 100%", ease : Quint.easeOut, onComplete:this.goRoute});
      TweenMax.to(this.$refs.boxpercentage, 0.3, {x : 0, ease : Quint.easeOut, onComplete:this.goRoute});
      this.$refs.opentxt.innerHTML = "100%";
      //
    },

    goRoute () {
      this.$router.push('/projects/'+this.model.slug + "/");
    },

    posite () {
      if(window.MOBILE_DETECT.mobile()){
        TweenMax.set(this.$refs.container, {scaleX : 0.8, scaleY : 0.8, x : "-50%"});
        var posx = (40+((this.index%2)*25))+"vw";
        var posy = this.index * 140;
        TweenMax.set(this.$refs.container, {left : '50vw', top : posy});
      }else{
        var posx = Math.round(window.innerWidth*0.15) + Math.floor(this.index/3) * 626;
        posx += ((this.index%3)==1) ? 313 : 0;
        this.posx = posx;
        var posy = Math.round(this.index%3)*Math.round(window.innerHeight * 0.25);
        this.posy = posy;
        TweenMax.set(this.$refs.container, {left : posx, top : posy});
      }
      //

    }
  },

  beforeDestroy() {
    TweenMax.killChildTweensOf(this.$refs.container);
    this.destroying = true;
    if(!this.isMobile()){
      this.$refs.hit.removeEventListener('mousemove', this.onMoveItem);
    }

    if(this.loading && !this.loadingCompleted){
      ContentLoader.setLoadProjectCallbacks(null,null);
    }
  },

  mounted () {
    this.position = Math.floor(Math.random()*4);
    if(this.position == 4) this.position = 3;

    var self = this;
    TweenMax.set(this.$refs.percentage, {drawSVG : "0% 0%"});

    this.posite();
    TweenMax.set(this.$refs.circleout, {rotation : 180, transformOrigin:"50% 50%"});
    TweenMax.set(this.$refs.circleout, {drawSVG:"0% 0%"});
    TweenMax.set(this.$refs.circlein, {drawSVG:"0% 0%"});

    var del = 1+(this.index * 0.1);
    TweenMax.fromTo(this.$refs.txtpart1, 1, {x : 30, y : 30, opacity :0}, {x : 0, y :0, opacity : 1, ease : Back.easeOut, delay:del+0.2});
    TweenMax.fromTo(this.$refs.txtpart2, 1, {x : 30, y : 30, opacity :0}, {x : 0, y:0, opacity : 1, ease : Back.easeOut, delay:del+0.3, onComplete:this.showHit});
    TweenMax.from(this.$refs.boxbar1, 1, {x : -40, y : -40, width : 0, ease : Quint.easeOut,delay:del});
    TweenMax.from(this.$refs.boxbar2, 1, {x : 80, y : 40, width : 0, ease : Quint.easeOut,delay:del});
    TweenMax.from(this.$refs.box, 1, {opacity:0, ease : Back.easeOut, x : -30, y : -30, force3D : true, delay:del});

    this.openSplit = new SplitText(this.$refs.opentxt, {type : "chars"});
    TweenMax.set(this.openSplit.chars, {y : 10, opacity :0});

    this.particlesOptions = {
			positionRandomness: 4,
			velocityRandomness: 0.5,
			// color: 0xffffff,
			color: parseInt(this.model.hover_color.replace("#","0x")),
			colorRandomness: .1,
      velocity : new THREE.Vector3(0,0.1,0),
			turbulence: .1,
			lifetime: 5,
			size: 3*(2/window.devicePixelRatio),
      tex : 'particle2.png',
			sizeRandomness: 1
		};

    this.onMoveItem = this.onMoveItem.bind(this);
    this.$refs.container.blur = 0;
  }
}
</script>

<style lang="scss" scoped>
  li {
    display : block;
    width : 218px;
    height: 106px;
    position : absolute;
    display : block;

    svg {
      width : 200px;
      height : 200px;
      position : absolute;
      top : 53px;
      left : 109px;
      margin-left : -100px;
      margin-top : -100px;
    }


    svg.circlebullet {
      width : 230px;
      height : 230px;
      margin-left : -115px;
      margin-top : -115px;
      opacity : 0;

      circle {
        transition : stroke 0.3s linear;
      }
    }

    svg.preloading {
      width : 196px;
      height : 196px;
      margin-left : -100px;
      margin-top : -101px;
      opacity : 0;

      circle {
        transition : stroke 0.3s linear;
      }
    }


    div.geometries {
      position : absolute;
      top : 0px;
      left : 0px;
      width : 218px;
      height : 106px;
      pointer-events : none;

      div.box {
        border : 2px solid #7bc2b4;
        width : 42px;
        height : 42px;
        transform : rotate(-45deg);
        position : absolute;

        top : 50%;
        left : 50%;
        margin-left : -21px;
        margin-top : -21px;
        overflow:hidden;
        transition : border-color 0.3s linear;

        div.box-percentage {
          width : 42px;
          height : 42px;
          background : #ff0000;
          position : absolute;
          top : 0px;
          left : 0px;
          opacity : 0.5;
          transform : translateX(-42px);
        }
      }

      div.boxbar1{
        width: 26px;
        height: 2px;
        background: #7bc2b4;
        position: absolute;
        transform-origin: 0% 50%;
        top: 77px;
        left: 9px;
        transform: rotate(45deg);
        transition : background-color 0.3s linear;
      }

      div.boxbar2{
        width : 26px;
        height : 2px;
        background : #7bc2b4;
        position : absolute;
        transform-origin: 100% 50%;
        transform: rotate(45deg);
        left: 183px;
        top: 32px;
        transition : background-color 0.3s linear;
      }
    }

    div.text-block {
      display: block;
      position : absolute;
      top : 50%;
      transform : translateY(-50%);
      pointer-events : none;
      margin-top : 15px;
      h2 {
        font-family: 'open_sansextrabold';
        text-transform: uppercase;
        color : #fff;
        font-size : 25px;
        letter-spacing: 1px;
        width : 218px;
        text-align : center;
        cursor : default;

        div {
          transform-style: preserve-3d;
          transform-origin: 50% 100%;
        }
      }

      span {
        cursor : default;
        font-size : 15px;
        font-family: 'open_sansextrabold';
        color : #fff;
        text-align: center;
        width : 218px;
        letter-spacing: 0.6px;
        display : block;
        margin-top : 0.3px;
      }

      p {
        font-size : 8px;
        color : #fff;
        letter-spacing: 8px;
        text-align: center;
        width : 218px;
        left : 5px;
        padding-left : 6px;
        margin-top : 20px;
        font-family : "open_sansbold";
      }
    }

    div.hit {
      position : absolute;
      top : -40px;
      left : 0px;
      width : 218px;
      height : 180px;
      display : none;
      cursor : pointer;
    }
  }


  @media screen and (max-width : 1000px){

  }
</style>
