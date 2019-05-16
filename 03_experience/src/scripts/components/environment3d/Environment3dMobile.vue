<template lang="html">
  <div class="container" ref="container">
    <div class="gradient-bg"></div>
    <canvas id="container" ref="canvas"></canvas>
    <div class="img-hover"></div>
    <div class="img-noise"></div>
  </div>
</template>

<script>
import EnvironmentMobile from "./environmentmobile/EnvironmentMobile";
import Globals from "../../core/Globals";
export default {

  mounted () {
    this.environment = new EnvironmentMobile(this.$refs.canvas, this.$refs.bodyImg);
    // window.environment3d = this.environment;
    TweenMax.fromTo(this.$refs.container, Globals.ENTRANCE_DURATION/2, {opacity :0}, {opacity : 1, delay : (Globals.SHOW_INTRO ? Globals.ENTRANCE_DELAY/2 : 0)});
  }
}
</script>

<style lang="scss" scoped>
div.container{
  position : fixed;
  top : 0px;
  left : 0px;
  width : 100%;
  height : 100%;
  opacity : 1;

  div.gradient-bg {
    position : fixed;
    display: block;
    width : 100%;
    height: 100%;
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#191923+0,0a0a14+100 */
    background: #191923; /* Old browsers */
    background: -moz-radial-gradient(center, ellipse cover, #26263c 0%, #06050f 60%); /* FF3.6-15 */
    background: -webkit-radial-gradient(center, ellipse cover, #26263c 0%,#06050f 60%); /* Chrome10-25,Safari5.1-6 */
    background: radial-gradient(ellipse at center, #26263c 0%,#06050f 60%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#26263c', endColorstr='#06050f',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
  }

  div.body {
    position : fixed;
    top : 0px;
    left : 0px;
    width : 100vh;
    height : 100vh;
    pointer-events: none;

    img {
      width: 80vw;
      bottom: 0px;
      top: 43vh;
      position: absolute;
      display: block;
      left: 26vw;
    }
  }

  canvas {
    position : fixed;
    display : block;
    width : 100%;
    height : 100%;
    background : transparent;
  }

  div.img-hover {
    position : fixed;
    top : 0px;
    left : 0px;
    background : url('/static/images/huia-bg.png') center center no-repeat;
    background-size : cover;
    width : 100%;
    height : 100%;
    display : block;
    pointer-events: none;
  }

  div.img-noise {
    position : fixed;
    top : 0px;
    left : 0px;
    background : url('/static/images/noise.png') center center repeat;
    width : 100%;
    height : 100%;
    opacity : 0.2;
    pointer-events: none;
    // display : none;
  }

  div.color-hover {
    position : absolute;
    top : 0px;
    left : 0px;
    width : 100%;
    height : 100%;
    background : rgba(0,0,0,0.3);
    pointer-events: none;
    display: none;
    // display : none;
  }
}
</style>
