<template lang="html">
  <svg ref="svg" version="1.1" id="Isolation_Mode" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
  	 y="0px" viewBox="0 0 100 125" style="enable-background:new 0 0 100 125;" xml:space="preserve">
     <path class="st0" d="M21.9,69.7V10.3c0,0,0-7.9,8.4-7.9s8.4,7.7,8.4,7.7v46.3"/>
     <path class="st0" d="M55.1,61.3V39.2c0,0,0-7.9-8.4-7.9S38.3,39,38.3,39v18.5"/>
     <path class="st0" d="M71.6,66.2V44.1c0,0,0-7.9-8.4-7.9s-8.4,7.7-8.4,7.7v18.5"/>
     <path class="st0" d="M71.6,66.2V55.1c0,0,0-7.7,8.4-7.7s8.4,7.9,8.4,7.9s-0.2,16.6,0,22.2c0.2,9.1-4,35-16.6,39.5
     	c-8.9,3.1-29.5,3.4-39.8,0.7c-8-2.3-22.4-22-23.1-35.1c-1.4-21,7-25.7,13.1-25.5"/>
  </svg>
</template>

<script>
export default {

  mounted () {
    TweenMax.from(this.$refs.svg.children[0], 0.5, {y : 43, delay : 3, ease : Back.easeOut});
    TweenMax.from(this.$refs.svg.children[1], 0.5, {y : 11, delay : 3, ease : Back.easeOut});
    TweenMax.from(this.$refs.svg.children[2], 0.5, {y : 11, delay : 3, ease : Back.easeOut});
  }
}
</script>

<style lang="scss" scoped>
  svg {
    position : absolute;
    top : 0px;
    left : 0px;
    width : 25px * 1.2;
    height : 40px * 1.2;
    top : 50%;
    left : 50%;
    opacity : 0.4;


    path {
      fill:#000000;
      stroke:#FFFFFF;
      stroke-width:5;
      stroke-linecap:round;
      stroke-linejoin:round;
      stroke-miterlimit:10;
    }
  }
</style>
