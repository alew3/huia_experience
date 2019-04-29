<template lang="html">
  <div class="buttons-container" ref="container">
    <a href="https://www.facebook.com/HuiaNCG/" target="_blank" title="facebook" v-on:mouseover='onOverItem' v-on:mouseout='onOutItem'><div class="hover"></div><svg viewBox="0 0 60 60"><path d="m23.1 55.5h10.4v-26.2h7.3l0.8-8.8h-8.1v-5c0-2.1 0.4-2.9 2.4-2.9h5.7v-9h-7.2c-7.8 0-11.3 3.4-11.3 10v7h-5.4v8.9h5.4v26z"/></svg></a>
    <a href="https://www.instagram.com/huiancg/" target="_blank" title="instagram" v-on:mouseover='onOverItem' v-on:mouseout='onOutItem'><div class="hover"></div><svg viewBox="0 0 60 60"><path class="st1" d="m29.3 10.1c6.3 0 7 0 9.5 0.1 2.3 0.1 3.5 0.5 4.4 0.8 1.1 0.4 1.9 0.9 2.7 1.8 0.8 0.8 1.3 1.6 1.8 2.7 0.3 0.8 0.7 2.1 0.8 4.4 0.1 2.5 0.1 3.2 0.1 9.5s0 7-0.1 9.5c-0.1 2.3-0.5 3.5-0.8 4.4-0.4 1.1-0.9 1.9-1.8 2.7-0.8 0.8-1.6 1.3-2.7 1.8-0.8 0.3-2.1 0.7-4.4 0.8-2.5 0.1-3.2 0.1-9.5 0.1s-7 0-9.5-0.1c-2.3-0.1-3.5-0.5-4.4-0.8-1.1-0.4-1.9-0.9-2.7-1.8-0.8-0.8-1.3-1.6-1.8-2.7-0.3-0.8-0.7-2.1-0.8-4.4-0.1-2.5-0.1-3.2-0.1-9.5s0-7 0.1-9.5c0.1-2.3 0.5-3.5 0.8-4.4 0.4-1.1 0.9-1.9 1.8-2.7 0.8-0.8 1.6-1.3 2.7-1.8 0.8-0.3 2.1-0.7 4.4-0.8 2.5-0.1 3.2-0.1 9.5-0.1m0-4.3c-6.4 0-7.2 0-9.7 0.1s-4.2 0.5-5.7 1.1-2.9 1.4-4.2 2.7-2.1 2.7-2.7 4.3c-0.6 1.5-1 3.2-1.1 5.7s-0.1 3.3-0.1 9.7 0 7.2 0.1 9.7 0.5 4.2 1.1 5.7 1.4 2.9 2.7 4.2 2.6 2.1 4.2 2.7c1.5 0.6 3.2 1 5.7 1.1s3.3 0.1 9.7 0.1 7.2 0 9.7-0.1c2.5-0.1 4.2-0.5 5.7-1.1s2.9-1.4 4.2-2.7 2.1-2.6 2.7-4.2c0.6-1.5 1-3.2 1.1-5.7s0.1-3.3 0.1-9.7 0-7.2-0.1-9.7-0.5-4.2-1.1-5.7-1.4-2.9-2.7-4.2-2.6-2.1-4.2-2.7c-1.5-0.6-3.2-1-5.7-1.1s-3.3-0.2-9.7-0.2"/><path class="st1" d="m29.3 17.3c-6.7 0-12.1 5.4-12.1 12.1s5.4 12.1 12.1 12.1 12.1-5.5 12.1-12.1c0-6.7-5.4-12.1-12.1-12.1m0 19.9c-4.3 0-7.8-3.5-7.8-7.8s3.5-7.8 7.8-7.8 7.8 3.5 7.8 7.8-3.4 7.8-7.8 7.8"/><path class="st1" d="m44.7 16.8c0 1.6-1.3 2.8-2.8 2.8-1.6 0-2.8-1.3-2.8-2.8 0-1.6 1.3-2.8 2.8-2.8s2.8 1.2 2.8 2.8"/></svg></a>
    <a href="https://vimeo.com/huiancg" target="_blank" title="vimeo" v-on:mouseover='onOverItem' v-on:mouseout='onOutItem'><div class="hover"></div><svg viewBox="0 0 60 60"><path class="st0" d="m45.6 10.1c-6.7-0.2-11.3 3.6-13.7 11.4 1.2-0.5 2.4-0.8 3.6-0.8 2.5 0 3.6 1.4 3.3 4.2-0.1 1.7-1.2 4.1-3.3 7.3-2 3.2-3.6 4.8-4.6 4.8-1.3 0-2.5-2.5-3.6-7.4-0.4-1.5-1-5.2-2-11.2-0.9-5.5-3.2-8.1-7-7.8-1.6 0.1-4 1.6-7.2 4.4-2.3 2.1-4.7 4.2-7.1 6.3l2.3 3c2.2-1.5 3.5-2.3 3.8-2.3 1.7 0 3.2 2.6 4.7 7.9 1.3 4.8 2.6 9.6 3.9 14.4 2 5.2 4.4 7.9 7.2 7.9 4.6 0 10.2-4.3 16.8-12.9 6.4-8.2 9.7-14.7 9.9-19.5 0.3-6.3-2-9.6-7-9.7z"/></svg></a>
  </div>
</template>

<script>
import SoundsLoader from '../../loaders/SoundsLoader';
export default {
  methods : {
    onOverItem(evt){
      SoundsLoader.playSound("overitemmenu",false,0.1,0);

      var bounds = evt.currentTarget.getBoundingClientRect();
      this.particlesOptions.position2d = {x : bounds.left+5, y : bounds.top+10};
      this.particlesOptions.position = null;

      if(window.environment3d){
        window.environment3d.emmitParticles(this.particlesOptions,10);
      }
      //TweenMax.to(evt.currentTarget, 0.5, {scaleX : 2, scaleY : 2, ease : Back.easeOut});
    },

    onOutItem(evt){
      //TweenMax.to(evt.currentTarget, 0.5, {scaleX : 1, scaleY : 1, ease : Back.easeOut});
    }
  },

  mounted () {
    this.particlesOptions = {
      positionRandomness: 1,
      velocityRandomness: .1,
      color: 0x8C6EE5,
      colorRandomness: 0,
      velocity : new THREE.Vector3(0,0.1,0),
      turbulence: .1,
      lifetime: 5,
      size: 4*(2/window.devicePixelRatio),
      sizeRandomness: 1
		};

    TweenMax.staggerFromTo(this.$refs.container.children, 0.5, {x : 50, opacity : 0},{x : 0, opacity : 1, ease : Quint.easeOut, delay : 1}, 0.1);
  }
}
</script>

<style lang="scss">
  div.buttons-container {
    position : absolute;
    right : 0px;
    top : 50%;
    transform : translateY(-50%);
    right : 25px;

    a {
      display : block;
      float : left;
      clear : both;
      width : 40px;
      height : 50px;

      div.hover {
        width : 40px;
        height : 40px;
        background : #8f6fd5;
        position : absolute;
        border-radius : 50%;
        filter : blur(20px);
        margin-left : -5px;
        margin-top : -5px;
        opacity : 0;
        transition : opacity 0.3s linear;
      }

      svg {
        width : 30px;
        height : 30px;
        path {
          fill : #8f6fd5;
        }
      }

      &:hover {
        div.hover {
          opacity : 1;
        }
      }

    }

  }


  @media screen and (max-width : 1000px){
    div.buttons-container{
      right : 0px;
      position : fixed;
    }
  }
</style>
