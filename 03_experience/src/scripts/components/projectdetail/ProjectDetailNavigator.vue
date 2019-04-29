<template lang="html">
  <div class="navigator" ref="navigator">
    <svg width="1" height="1" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
            <filter id="blur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0 20" />
            </filter>
        </defs>
    </svg>
    <div class="bar" v-bind:style="{backgroundColor : color}" ref="bar"></div>
    <ul class="bullets-items" ref="bulletsContainer">
      <li v-on:mouseover="showTooltip" v-on:touchstart="showTooltip" v-on:touchend="hideTooltip" v-on:mouseout="hideTooltip" v-for="n in length" class="bullet-item" v-on:click="onClickItem(n-1)">
        <div class="tooltip-container"><div class="tooltip" v-bind:style="{backgroundColor : getRGBA(color)}">{{getTitle(n)}}</div></div>
        <div class="diamond">
          <div class="glow" v-bind:style="{backgroundColor : color}"></div>
          <div class="content" v-bind:style="{backgroundColor : color}"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import MathHelper from '../../helpers/MathHelper';

export default {
  props : {
    length : 0,
    color : "",
    titles : {
      type : Array,
      defaults : []
    }
  },

  data () {
    return {
      currentItem : -1
    }
  },

  methods :{
    getTitle(n){
        return this.titles[n-1];
    },

    getRGBA(color){
      var color = MathHelper.hexToRGB(color);

      if(window.MOBILE_DETECT.mobile())
        return "rgba("+color.r+","+color.g+","+color.b+",0.8)";
      else
        return "rgba("+color.r+","+color.g+","+color.b+",0.5)";
    },

    showTooltip(evt){
      var el = evt.currentTarget.children[0];
      el.children[0].style.display = "block";
      TweenMax.fromTo(el.children[0], 0.3, {opacity:0, scaleY : 0.5}, {x : 0, opacity:1, scaleY : 1, ease : Back.easeOut});
    },

    hideTooltip(evt){
      if(evt.currentTarget){
        var el = evt.currentTarget.children[0];
        TweenMax.to(el.children[0], 0.2, {scaleY : 0.5, opacity : 0, ease:Quint.easeOut});
      }else{
        TweenMax.to(this.$refs.bulletsContainer.children[evt].children[0].children[0], 0.2, {scaleY : 0.5, opacity : 0, ease:Quint.easeOut});
      }
    },

    onOverItem(index){
      // var el = this.$refs.bulletsContainer.children[index];
      //
      // var viewportOffset = el.getBoundingClientRect();
      // this.particlesOptions.position2d = {x : viewportOffset.left+15, y : viewportOffset.top+15};
      // this.particlesOptions.position = null;
      //
      // if(window.environment3d){
      //     window.environment3d.emmitParticles(this.particlesOptions,5);
      // }
    },

    onOutItem(index){
      // var el = this.$refs.bulletsContainer.children[index];
    },

    onClickItem(index){
      this.$emit("changePage", index);
    },

    selectItem(index){
      TweenMax.to(this.$refs.bulletsContainer, 1, {y : -index*30, ease : Quint.easeInOut});

      for(var i = 0; i < this.$refs.bulletsContainer.children.length; i++){
        var el = this.$refs.bulletsContainer.children[i];
        if(i == index){
          el.style.pointerEvents = "none";
          TweenMax.to(el.children[1].children[1], 1, {scaleX : 1, scaleY : 1,opacity:1, ease : Quint.easeInOut});
          TweenMax.to(el.children[1].children[0], 1, {opacity:0, ease : Linear.easeNone});
        }else{
          el.style.pointerEvents = "auto";
          TweenMax.to(el.children[1].children[1], 1, {scaleX : 0.5, scaleY : 0.5,opacity:0.5,  ease : Quint.easeInOut});
          TweenMax.to(el.children[1].children[0], 1, {opacity:0.3, ease : Linear.easeNone});
        }
      }
    },
  },

  beforeDestroy () {
      TweenMax.killTweensOf(this);
  },

  mounted () {
    var num = MathHelper.hexToDec(this.color.replace("#",""));

    this.particlesOptions = {
			positionRandomness: 1,
			velocityRandomness: .5,
			color: num,
			colorRandomness: .1,
			turbulence: .05,
			lifetime: 2,
			size: 10,
			sizeRandomness: 3
		};

    TweenMax.fromTo(this.$refs.bar, 1, {scaleY : 0},{scaleY : 1, ease : Quint.easeInOut});
    TweenMax.staggerFromTo(this.$refs.bulletsContainer.children, 1, {scaleX : 0, y: 50},{scaleX : 1, y : 0, ease : Quint.easeInOut}, 0.1);
    this.selectItem(0);

    TweenMax.to(this, 2, {onComplete:()=>{for(var i = 0; i < this.length; i++){this.hideTooltip(i)}}})
  }
}
</script>

<style lang="scss" scoped>
div.navigator{
  display : block;
  float : left;
  padding : 0;
  margin : 0;
  right : 53px;
  position : absolute;
  top : 50%;
  margin-top : -19vh;

  div.bar {
    position : absolute;
    height : 30vh;
    width : 1px;
    opacity : 0.15;
    filter : url(#blur);
  }

  ul.bullets-items {
    position : absolute;
    top : 15vh;

    li {
      display : block;
      float : left;
      position : relative;
      display : block;
      clear : both;
      width : 30px;
      height : 30px;
      margin-left : -14px;
      cursor : pointer;

      div.tooltip-container{
        width : 300px;
        position : absolute;
        pointer-events : none;
        left : -300px;
        display: block;
        float : left;
        top : 50%;
        transform : translateY(-50%);

        div.tooltip {
          font-family: 'open_sansbold';
          font-size: 10px;
          position : relative;
          padding : 5px 8px;
          text-align: left;
          border-radius : 30px;
          display: block;
          text-transform: uppercase;
          float : right;
          z-index: 1000;
          right : 0px;
          pointer-events: none;
          transform-origin: bottom right;
          // max-width: 150px;
          text-align: right;
        }
      }

      div.diamond {
        position : absolute;
        width : 30px;
        height : 30px;
        float : left;
        display: block;
        pointer-events: none;

        div.content {
          width : 8px;
          height : 8px;
          top : 11px;
          left : 11px;
          position : absolute;
          transform : rotate(45deg);
        }

        div.glow {
          width : 14px;
          height : 14px;
          top : 8px;
          left : 8px;
          position : absolute;
          transform : rotate(45deg);
          filter : blur(2px);
          opacity: 0.3;
        }
      }
    }
  }
}


@media screen and (max-width : 1000px){
  div.navigator{
    left : 4vw;
    right : auto;
    position : absolute;
    top : 50%;
    margin-top : -19vh;

    ul.bullets-items {

      li {

        div.tooltip-container{
          width : 300px;
          left : 30px;
          right : 0px;

          div.tooltip {
            display:none !important;
            float : left;
          }
        }
      }
    }
  }
}
</style>
