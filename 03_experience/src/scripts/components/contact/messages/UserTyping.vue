<template lang="html">
  <div class="balls-container" ref="container">
    <div class="balls-purple" ref="ballsWhite">
      <div class="ball"></div>
      <div class="ball"></div>
      <div class="ball"></div>
    </div>
  </div>
</template>

<script>
export default {
  mounted () {
    TweenMax.staggerTo(this.$refs.ballsWhite.children, 0.3, {y : -5, ease : Circ.easeOut, yoyo:true, repeat : -1},0.1);
    // TweenMax.staggerTo(this.$refs.ballsBlack.children, 0.3, {y : -15, ease : Circ.easeOut, yoyo:true, repeat : -1},0.1);
    TweenMax.from(this.$refs.container, 0.3, {height : 0, marginBottom : 0, ease : Back.easeOut});
  },

  beforeDestroy(){
    TweenMax.killTweensOf(this.$refs.container);
    TweenMax.killChildTweensOf(this.$refs.container);
  }
}
</script>

<style lang="scss" scoped>
  $scale : 0.2;

  div.balls-container{
    display : block;
    float : right;
    clear : both;
    margin-bottom : 15px;
    padding : 5px * $scale;
    height : 50px * $scale;
    margin-left : 12px;
    div.ball {
      display : inline-block;
      float : left;
      background : #0f0f24;
      width : 30px * $scale;
      height : 30px * $scale;
      border-radius : 50px * $scale;
      margin-right : 15px * $scale;
    }

    div.balls-purple {
      position : absolute;
      div.ball {
        background : #8f6fd5;
        width : 30px * $scale;
        height : 30px * $scale;
        margin-left : 0px * $scale;
      }
    }
  }
</style>
