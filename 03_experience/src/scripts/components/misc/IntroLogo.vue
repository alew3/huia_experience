<template lang="html">
  <canvas id="logo" ref="canvas" width="679" height="107"></canvas>
</template>

<script>
import TweenMax from 'gsap';
import '../../vendors/easeljs';
import '../../vendors/easeljswebgl';
import ContentLoader from '../../loaders/ContentLoader';
import Globals from '../../core/Globals';

export default {
  methods : {
    createSprites(){
      this.stage = new createjs.Stage(this.$refs.canvas);

      this.charH = new createjs.Sprite(ContentLoader.SPRITESHEETS.charh);
      this.stage.addChild(this.charH);
      this.charH.visible = false;
      this.charH.gotoAndStop(1);


      this.charU = new createjs.Sprite(ContentLoader.SPRITESHEETS.charu);
      this.stage.addChild(this.charU);
      this.charU.visible = false;
      this.charU.gotoAndStop(1);

      this.charI = new createjs.Sprite(ContentLoader.SPRITESHEETS.chari);
      this.stage.addChild(this.charI);
      this.charI.visible = false;
      this.charI.gotoAndStop(1);

      this.charA = new createjs.Sprite(ContentLoader.SPRITESHEETS.chara);
      this.stage.addChild(this.charA);
      this.charA.visible = false;
      this.charA.gotoAndStop(1);

      this.logoDetails = new createjs.Sprite(ContentLoader.SPRITESHEETS.logodetails);
      this.stage.addChild(this.logoDetails);
      this.logoDetails.gotoAndPlay(1);
      createjs.Ticker.setFPS(30);
      createjs.Ticker.addEventListener("tick", this.handleTick);

      this.charH.y = 19;

      this.charU.x = 194;
      this.charU.y = 9;

      this.charI.x = 388;
      this.charI.y = 19;


      this.charA.x = 581;
      this.charA.y = 17;
    },


    handleTick () {
      if(!this.stage) return;
      this.stage.update();
      if(this.charH.currentFrame == this.charH.spriteSheet._frames.length-1){
        this.charH.stop();
      }
      if(this.charU.currentFrame == this.charU.spriteSheet._frames.length-1){
        this.charU.stop();
      }
      if(this.charI.currentFrame == this.charI.spriteSheet._frames.length-1){
        this.charI.stop();
      }
      if(this.charA.currentFrame == this.charA.spriteSheet._frames.length-1){
        this.charA.stop();
        if(!this.finished){
          this.finished = true;
          createjs.Ticker.removeEventListener("tick", this.handleTick);

          TweenMax.to(this.$refs.canvas, 0.3, {opacity :0, ease : Quad.easeIn, onComplete:this.endAnim, delay : 1, onCompleteScope:this});
          if(window.environment3d)
            window.environment3d.entranceAnimation();
        }
      }

      if(this.logoDetails.currentFrame == 17){
        this.charH.visible = true;
        this.charH.play();
      }
      if(this.logoDetails.currentFrame == 28){
        this.charU.visible = true;
        this.charU.play();
        this.charI.visible = true;
        this.charI.play();
      }
      if(this.logoDetails.currentFrame == 34){
        this.charA.visible = true;
        this.charA.play();
      }

      if(this.logoDetails.currentFrame == this.logoDetails.spriteSheet._frames.length-1){
        this.logoDetails.stop();
        this.logoDetails.visible = false;
        this.logoDetails.gotoAndStop(10);
      }

      // this.stage.update();
    },

    endAnim (){
      this.$emit("endAnim", this);
    }
  },

  mounted () {
    this.createSprites();
  }
}
</script>

<style lang="scss" scoped>
canvas#logo {
  // width : 500px;
  // height : 120px;
  top : 50%;
  left : 50%;
  margin-left : -340px;
  margin-top : -53px;
  position : absolute;
  // background : #ff0000;
}
@media screen and (max-width : 1000px){
  canvas#logo{
    width : 80vw;
    left : 50%;
    margin-left : 0px;
    max-width : 400px;

    transform : translateX(-50%);
  }
}
</style>
