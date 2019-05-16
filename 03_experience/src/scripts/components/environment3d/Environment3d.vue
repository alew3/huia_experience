<template lang="html">
  <div class="container" ref="container">
    <div class="gradient-bg"></div>
    <canvas id="container" ref="canvas"></canvas>
    <div class="img-hover"></div>
    <div class="img-noise"></div>
  </div>
</template>

<script>
import Environment from './environment/Environment';
import Globals from '../../core/Globals';
import {Detector} from "../../vendors/Detector";
import { EventBus } from '../../core/event-bus.js';


export default {

  mounted () {
      if(Detector.webgl){
          this.environment = new Environment(this.$refs.canvas);
          window.environment3d = this.environment;
      }else{
        // alert("Nao temos webgl por aqui");
      }

    TweenMax.fromTo(this.$refs.container, Globals.ENTRANCE_DURATION/2, {opacity :0}, {opacity : 1, delay : (Globals.SHOW_INTRO ? Globals.ENTRANCE_DELAY/2 : 0)});

    var self = this;
  },


  methods : {
    land () {
      // this.environment.land();
    }
  },

  beforeDestroy() {
    if(this.environment){
      this.environment.destroy();
    }
  }
}
</script>

<style lang="scss" scoped>
  div.container{
    position : absolute;
    top : 0px;
    left : 0px;
    width : 100%;
    height : 100%;
    opacity : 1;

    div.gradient-bg {
      position : absolute;
      display: block;
      width : 100%;
      height: 100%;
      /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#191923+0,0a0a14+100 */
      background: #06050f; /* Old browsers */
    }

    canvas {
      position : absolute;
      display : block;
      width : 100%;
      height : 100%;
      background : transparent;
    }

    div.img-hover {
      position : absolute;
      top : 0px;
      left : 0px;
      background : url('/static/images/huia-bg.png') center center no-repeat;
      background-size : cover;
      width : 100%;
      height : 100%;
      display : none;
    }

    div.img-noise {
      position : absolute;
      top : 0px;
      left : 0px;
      background : url('/static/images/noise.png') center center repeat;
      width : 100%;
      height : 100%;
      opacity : 0;
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
