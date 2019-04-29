<template lang="html">
  <div class="close">
    <svg viewBox="0 0 50 50" ref="closeIconBg">
      <circle ref="circleout" cx="25" cy="25" r="21" v-bind:stroke="this.color" stroke-width="1" fill="transparent" />
      <circle ref="circlein" cx="25" cy="25" r="22" v-bind:stroke="this.color" stroke-width="1" fill="transparent" />
    </svg>
    <div class="glow" ref="glow" v-bind:style="{'background' : this.color}">
    </div>
    <div class="close-btn" ref="btn">
      <div class="part1" v-bind:style="{'background' : this.color}"></div>
      <div class="part2" v-bind:style="{'background' : this.color}"></div>
    </div>
    <div class="hit" v-on:mouseover="onOverIcon" v-on:mouseout="onOutIcon" v-on:click="onClickIcon">
    </div>
  </div>
</template>

<script>
export default {

  data () {
    return {
      color : '#8c6ee5'
    }
  },

  methods : {
    onOverIcon(evt){
      var time = 0.4;
      TweenMax.killTweensOf(this.$refs.circleout);
      TweenMax.to(this.$refs.btn, 0.5, {rotation : 90, ease : Back.easeOut});
      TweenMax.set(this.$refs.circleout, {drawSVG : "0% 0%", transformOrigin : "50% 50%", rotation :0});
      TweenMax.to(this.$refs.circleout,time/2, {drawSVG : "0% 30%", ease : Linear.easeNone});
      TweenMax.to(this.$refs.circleout, time, {drawSVG : "100% 100%", ease : Quad.easeOut, delay:time/2, overwrite:false});
      TweenMax.to(this.$refs.circleout, time*1.5, {rotation:180, ease : Quad.easeOut, overwrite:false});

      TweenMax.killTweensOf(this.$refs.circlein);
      TweenMax.set(this.$refs.circlein, {drawSVG : "100% 100%", transformOrigin : "50% 50%", rotation :0});
      TweenMax.to(this.$refs.circlein, time/2, {drawSVG : "70% 100%", ease : Linear.easeNone});
      TweenMax.to(this.$refs.circlein, time, {drawSVG : "0% 0%", ease : Quad.easeOut, delay:time/2, overwrite:false});
      TweenMax.to(this.$refs.circlein, time*1.5, {rotation:-180, ease : Quad.easeOut, overwrite:false});
    },

    onOutIcon(evt){
      TweenMax.to(this.$refs.btn, 0.5, {rotation : 0, ease : Back.easeOut});
    },

    onClickIcon(evt){
      this.$router.history.push("/");
    }
  },
  mounted () {
    TweenMax.set(this.$refs.circleout, {drawSVG : "0% 0%", transformOrigin : "50% 50%", rotation :0});
    TweenMax.set(this.$refs.circlein, {drawSVG : "100% 100%", transformOrigin : "50% 50%", rotation :0});
    TweenMax.fromTo(this.$refs.glow, 0.5, {opacity : 0}, {opacity : 0.5, delay : 1});
    TweenMax.fromTo(this.$refs.btn, 0.5, {rotation:90},{rotation:0, ease : Back.easeOut, delay : 1});
    TweenMax.fromTo(this.$refs.btn.children, 0.3, {scaleX : 0},{scaleX : 1, ease : Back.easeOut, delay : 1});
  }
}
</script>

<style lang="scss">
  div.close{
    position : absolute;
    width : 50px;
    height : 50px;
    top : 50vh;
    left : 0px;
    margin-top : -25px;
    left : 30px;

    svg {
      width : 44px;
      height : 44px;
      left : 3px;
      top : 1px;
      position : absolute;
    }

    div.glow {
      position : absolute;
      top : 0px;
      left : 0px;
      width : 50px;
      height : 50px;
      background : #8c6ee5;
      border-radius: 50%;
      filter : blur(15px);
      opacity: 0.5;
    }

    div.close-btn {
      position : absolute;
      width : 40px;
      height : 40px;
      top : 5px;
      left : 5px;
      transform-origin: 20px 18px;
      cursor : pointer;

      div.part1, div.part2{
        background : #000000;
        display: block;
        position : absolute;
        width : 30px;
        height : 3px;
        left : 5px;
        top : 3px;
      }

      div.part1 {
        transform : rotate(45deg);
        top : 17px;
      }

      div.part2 {
        transform : rotate(-45deg);
        top : 17px;
      }
    }

    div.hit {
      position : absolute;
      width : 40px;
      height : 40px;
      top : 5px;
      left : 5px;
      cursor : pointer;

    }
  }


  @media screen and (max-width : 1000px){
    div.close{
      position : absolute;
      width : 50px;
      height : 50px;
      top : 5vh;
      left : 50%;
      margin-top : -25px;
      margin-left : -25px;
    }
  }
</style>
