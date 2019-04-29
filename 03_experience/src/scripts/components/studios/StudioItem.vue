<template>
  <div class="studio-item-container" ref="container">
    <div class="ball" ref="ball"></div>
    <svg viewBox="0 0 50 50">
      <circle ref="circleout" cx="25" cy="25" r="21" stroke-width="1" stroke="#ed6d76" fill="transparent" />
      <circle ref="circlein" cx="25" cy="25" r="22" stroke-width="1" stroke="#ed6d76" fill="transparent" />
    </svg>
    <div ref="title" class="title">
      <span>{{this.data.title}}</span>
      <span>{{this.studioTxt}}</span>
      <span class="click" ref="clicktxt">CLICK</span>
    </div>
    <i v-bind:class="this.getClass()" ref="icon"></i>
    <div class="hit" v-if="this.mounted" v-on:mouseover="onOverItem" v-on:mouseout="onOutItem" v-on:click="onClickItem" ref="hit"></div>
  </div>
</template>

<script>
import SoundsLoader from "../../loaders/SoundsLoader";

export default {
  props : {
    data : null,
    studioTxt : null,
    index : null,
    mousePosition : null
  },

  data () {
    return{
      mounted : false
    }
  },

  methods : {
    getClass () {
      return this.data.slug;
    },

    onOverItem(evt) {
      TweenMax.staggerTo(this.split.chars, 0.6, {x : -10, ease : Back.easeOut},0.02);
      TweenMax.to(this.$refs.ball, 0.5, {scaleX : 0.8, scaleY : 0.8, ease : Back.easeOut});
      TweenMax.to(this.$refs.icon, 0.5, {scaleX : 0.8, scaleY : 0.8, ease : Back.easeOut});

      // console.log("overstudio"+(this.index+1));
      SoundsLoader.playSound("overstudio"+(this.index+1), false, 0.5, 0);

      this.onMouseMove = this.onMoveItem.bind(this);
      this.hover = true;
      this.$refs.container.addEventListener('mousemove', this.onMouseMove);

      var bounds = this.$refs.container.getBoundingClientRect();
      this.particlesOptions.position2d = {x : bounds.left+50, y : bounds.top+50};
      this.particlesOptions.position = null;


      if(window.environment3d){
        window.environment3d.emmitParticles(this.particlesOptions,60);
      }

      TweenMax.to(this.$refs.container, 1, {scaleX : 1.2, scaleY : 1.2, ease : Back.easeOut});

      TweenMax.killTweensOf(this.openSplit.chars);
      TweenMax.set(this.openSplit.chars, {y : 10, opacity: 0});

      TweenMax.staggerFromTo(this.openSplit.chars, 0.5, {y : 10, opacity : 0}, {y : 0, opacity :1,force3D : true, delay : 0.3, overwrite:false, ease : Back.easeOut}, 0.05);
    },

    onOutItem () {
      if(this.destroying) return;

      TweenMax.to(this.$refs.container, 1, {scaleX : 1, scaleY : 1, ease : Back.easeOut});
      TweenMax.staggerTo(this.split.chars, 0.6, {x : 0, ease : Back.easeOut},0.02);
      this.hover = false;
      TweenMax.to(this.$refs.ball, 0.5, {scaleX :1, scaleY : 1, x : 0, y : 0, ease : Back.easeOut});
      TweenMax.to(this.$refs.icon, 0.5, {scaleX :1, scaleY : 1, ease : Back.easeOut});
      this.$refs.container.removeEventListener('mousemove', this.onMouseMove);

      TweenMax.killTweensOf(this.openSplit.chars);

      TweenMax.staggerTo(this.openSplit.chars, 0.3, {y : -10, opacity :0,force3D : true, overwrite:false, ease : Back.easeOut}, 0.03);
    },

    onClickItem(evt){
      TweenMax.killChildTweensOf(this.$refs.container);
      TweenMax.killTweensOf(this.container);
      this.$refs.container.removeEventListener('mousemove', this.onMouseMove);
      this.$emit('selectStudio', this,this.data.slug, this.index);
    },


    destroyElement(){
      this.split.chars.reverse();
      TweenMax.staggerTo(this.split.chars, 0.4, {y : 40, opacity : 0, scaleY : 0, ease : Quint.easeInOut},0.01);
      TweenMax.staggerTo(this.openSplit.chars, 0.4, {y : 40, opacity : 0, scaleY : 0, ease : Quint.easeInOut},0.01);
      TweenMax.to(this.$refs.icon, 0.5, {scaleX : 0, scaleY : 0, y : -90, delay : 0.5, ease : Quint.easeOut});
      TweenMax.to(this.$refs.ball, 0.5, {scaleX : 0, scaleY : 0, y : 90, delay : 0.5, ease : Quint.easeOut});
    },

    beforeDestroy () {
      this.destroying = true;
      TweenMax.killChildTweensOf(this.$refs.container);
      TweenMax.killTweensOf(this.container);
    },

    onMoveItem(evt){
      if(this.destroying) return;
      var coefx = ((evt.clientX - this.$refs.hit.getBoundingClientRect().left)-30)/30;
      var coefy = ((evt.clientY - this.$refs.hit.getBoundingClientRect().top)-30)/30;
      var angle = Math.atan2(coefx, coefy);
      var distance = Math.abs(coefx + coefy);
      coefx = Math.min(coefx, 1);
      coefx = Math.max(coefx, -1);
      coefy = Math.min(coefy, 1);
      coefy = Math.max(coefy, -1);

      TweenMax.to(this.$refs.ball, 2, {x : Math.sin(angle) * (distance*7), y : Math.cos(angle)*(distance*7), ease : Back.easeOut});
      TweenMax.to(this.$refs.title, 2, {x : -Math.sin(angle) * (distance*5), y : Math.cos(angle)*(distance*5), ease : Back.easeOut});
      TweenMax.to(this.$refs.icon, 2, {x : -Math.sin(angle) * (distance*7), y : -Math.cos(angle)*(distance*7), ease : Back.easeOut});
    }
  },

  watch : {
    mousePosition() {
      if(window.MOBILE_DETECT.mobile()) return;

      TweenMax.to(this.$refs.container, 1, {x : this.mousePosition.x*50, y : this.mousePosition.y*10, roundedProps:"x,y", ease : Quad.easeOut});
      if(!this.hover){
        TweenMax.to(this.$refs.title, 1, {x : this.mousePosition.x*5, y : this.mousePosition.y*5, roundedProps:"x,y", ease : Quad.easeOut});
        TweenMax.to(this.$refs.icon, 1, {x : this.mousePosition.x*6, y : this.mousePosition.y*6, roundedProps:"x,y", ease : Quad.easeOut});
      }
    }
  },

  mounted () {
    this.particlesOptions = {
			positionRandomness: 4,
			velocityRandomness: 0.5,
      velocity : new THREE.Vector3(0,0.1,0),
			color: 0xed6d76,
			colorRandomness: 0,
			turbulence: .1,
			lifetime: 5,
			size: 3*(2/window.devicePixelRatio),
      tex : 'particle2.png',
			sizeRandomness: 1
		};

    // this.particlesOptions = {
		// 	positionRandomness: 5,
		// 	velocityRandomness: .5,
		// 	color: 0x7bc2b4,
		// 	colorRandomness: .1,
		// 	turbulence: .1,
		// 	lifetime: 5,
		// 	size: 3*(2/window.devicePixelRatio),
    //   tex : 'particle2.png',
		// 	sizeRandomness: 1
		// };
    if(!window.MOBILE_DETECT.mobile()){
      TweenMax.set(this.$refs.container, {left : (this.index*21) + "vw"});
    }else{
      TweenMax.set(this.$refs.container, {top : (this.index*26) + "vh"});
    }

    var del = 0.5 + (this.index*0.3);

    TweenMax.set(this.$refs.circleout, {drawSVG:"100% 100%", rotation : 0});
    TweenMax.set(this.$refs.circlein, {drawSVG:"0% 0%", rotation : 0});

    TweenMax.to(this.$refs.circlein, 0.3, {drawSVG : "0% 50%", ease : Quad.easeIn, delay : del});
    TweenMax.to(this.$refs.circlein, 0.5, {drawSVG : "100% 100%", ease : Quad.easeOut, delay : del+0.3,overwrite:false});

    TweenMax.set(this.$refs.ball, {scaleX : 0.7, scaleY : 0.7, opacity : 0});
    TweenMax.to(this.$refs.ball, 1, {scaleX : 1, scaleY : 1, opacity : 1, delay : del,ease : Back.easeOut});

    this.split = new SplitText(this.$refs.title.children, {type : "chars"});

    TweenMax.staggerFromTo(this.split.chars, 1, {x : 25, opacity : 0},{y : 0, x : 0, opacity : 1, ease : Expo.easeInOut, delay : del}, 0.01);

    TweenMax.fromTo(this.$refs.icon, 0.5, {scaleX : 0, scaleY : 0}, {scaleX : 1, scaleY : 1, ease : Back.easeOut, delay : del + 0.3, onComplete:()=>{
      if(!this.$refs.title) return;

      this.mounted = true;
      TweenMax.set(this.$refs.title.children, {overflow : "visible"});
    }});

    this.openSplit = new SplitText(this.$refs.clicktxt, {type : "chars"});
    TweenMax.set(this.openSplit.chars, {y : 10, x : -10, opacity :0});
  }
}
</script>

<style lang="scss" scoped>
  div.studio-item-container {
    position : absolute;
    top : 0px;
    left : 0px;

    div.ball {
      position : absolute;
      width : 74px;
      height : 74px;
      background : #ed6d76;
      display: block;
      border-radius : 50%;
      overflow : hidden;
    }

    svg {
      position : absolute;
      display : block;
      width : 100px;
      height: 100px;
      left : -13px;
      top : -13px;
    }

    i {
      position : absolute;
      display : block;

      &.experience {
        width : 30px;
        height : 30px;
        border : 3px solid #fff;
        border-radius : 50%;
        left : -10px;
        top : -6px;
      }

      &.media {
        width : 15px;
        height : 15px;
        background : #fff;
        position : absolute;
        border-radius : 50%;
        left : -15px;
        top : -5px;
      }

      &.technology {
        left : -10px;
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

    div.title {
      position : absolute;
      color : #fff;
      font-size: 25px;
      text-transform: uppercase;
      font-family: 'open_sansbold';
      top : 37px;
      left : 20px;
      pointer-events : none;
      width : 180px;

      span {
        display : block;
        float : left;
        position : relative;
        clear : both;
        width : 180px;
        height : 25px;
        overflow : hidden;
      }


      span.click {
        font-size : 10px;
        color : #fff;
        letter-spacing: 7px;
        text-align: left;
        width : 218px;
        margin-top : 10px;
        font-family : "open_sansbold";
      }
    }

    div.hit {
      position : absolute;
      top : 0px;
      left : 0px;
      width : 230px;
      height : 100px;
      background : rgba(255,0,0,0);
      left : -30px;
      cursor : pointer;
    }
  }
</style>
