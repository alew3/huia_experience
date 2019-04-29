<template lang="html">
  <div class="textscontainer">
    <div class="textscontent" ref="content">
      <p v-for="(item,i) in this.data" v-html="item" v-bind:key="i"></p>
    </div>
    <div class="bullets-container" ref="bullets">
      <div v-for="(item,i) in this.data" v-bind:key="i" v-bind:class="{'selected' : getIsSelected(i), 'bullet' : true}" v-on:click="showText(i)">
        <div class="icon-glow"></div>
        <div class="icon-glow icon-glow-2"></div>
        <div class="icon"></div>
        <div class="hit"></div>
      </div>
    </div>
    <div class="touch-hit" v-on:touchstart="onTouchStart" v-on:touchmove="onTouchMove" v-on:touchend="onTouchEnd"></div>
  </div>
</template>

<script>

export default {
  props : {
    data : null,
  },

  data () {
    return {
      currentText : 1,
      iniX : 0,
      iniMouseX : 0,
      currentX : 0
    }
  },

  methods : {
    onTouchStart(evt){
      TweenMax.killTweensOf(this);
      TweenMax.killTweensOf(this.$refs.content);
      TweenMax.to(this.$refs.content, 0.2, {opacity : 0.6});
      this.iniX = this.currentX;
      this.iniMouseX = evt.touches[0].clientX;
    },

    onTouchMove(evt){
      this.currentX = this.iniX + (evt.touches[0].clientX - this.iniMouseX);
      TweenMax.to(this.$refs.content, 0.3, {x : this.currentX});

      var num = Math.round(-this.currentX/window.innerWidth);
      num = Math.max(0,num);
      num = Math.min(this.data.length-1,num);
      this.currentText = num;
    },

    onTouchEnd(evt){
      this.currentX = -this.currentText*window.innerWidth;
      TweenMax.to(this.$refs.content, 1, {opacity : 1, x : -this.currentText*window.innerWidth, ease : Back.easeOut});

      TweenMax.killTweensOf(this);
      TweenMax.to(this, 6, {onComplete:this.goToNextText, onCompleteScope:this});
    },
    getIsSelected (n) {
      return n == this.currentText;
    },

    getWidth () {
      return (this.data.length * 305) + 'px';
    },

    showText(num){
      if(this.currentText == num) return;

      if(window.MOBILE_DETECT.mobile()){
        this.currentText = num;
        this.currentX = -this.currentText*window.innerWidth;
        TweenMax.to(this.$refs.content, 0.5, {opacity : 1, x : -this.currentText*window.innerWidth, ease : Back.easeOut});
        // TweenMax.to(this.$refs.content, 1, {x : -(num*window.innerWidth), ease : Quint.easeInOut});
      }else{
        for(var i = 0; i < this.$refs.content.children.length; i++){
          if(num == i){
            this.$refs.content.children[i].style.display = "block";
          }else{
            this.$refs.content.children[i].style.display = "none";
          }
        }
      }


      this.currentText = num;
      TweenMax.staggerFromTo(this.splits[num].lines, 1, {y : 20, opacity : 0}, {y : 0, opacity : 1, ease : Quint.easeInOut},0.1);

      TweenMax.killTweensOf(this);
      TweenMax.to(this, 6, {onComplete:this.goToNextText, onCompleteScope:this});
    },

    goToNextText () {
      var num = 0;

      num = this.currentText+1;
      if(num > this.data.length-1)
        num = 0;

      this.showText(num);
    }
  },


  beforeDestroy () {
    TweenMax.killTweensOf(this);
  },


  mounted () {
    this.splits = [];

    for(var i =0 ; i < this.$refs.content.children.length; i++){
      var split = new SplitText(this.$refs.content.children[i], {type : "lines"});
      this.splits.push(split);

      if(window.MOBILE_DETECT.mobile()){
        TweenMax.set(this.$refs.content.children[i], {x : i * window.innerWidth});
      }
    }

    TweenMax.killTweensOf(this);
    TweenMax.staggerFromTo(this.$refs.bullets.children, 1, {scaleX : 0, scaleY : 0}, {scaleX : 1, scaleY : 1, ease : Back.easeOut, delay:1},0.1);

    this.showText(0);
  }
}
</script>

<style lang="scss" scoped>
  div.textscontainer {
    left : 0px;
    bottom : 0px;
    top : 50%;
    margin-top : 240px;
    left : 50%;
    margin-left : -154px;
    position: absolute;
    width : 305px;

    div.touch-hit {
      display: none;
    }

    div.textscontent {
      position: absolute;

      p {
        clear : both;
        float : left;
        position : absolute;
        display: block;
        color : #fff;
        font-family: 'open_sanssemibold';
        letter-spacing: 3px;
        width: 305px;
        text-align: center;
        font-size : 10px;
        line-height: 18px;
        text-shadow: 0px 0px 20px #fff;
      }
    }

    div.bullets-container {
      position: relative;
      display: block;
      text-align: center;
      width : auto;
      top : 70px;
      float : left;
      left : 50%;
      transform : translateX(-50%);

      div.bullet {
        display: inline-block;
        float : left;
        width : 30px;
        height : 30px;
        margin-right : 5px;
        position: relative;
        &:last-child {
          margin-right: 0px;
        }

        div.icon, div.icon-glow {
          width : 12px;
          height : 12px;
          position: absolute;
          top : 9px;
          left : 9px;
          transform: rotate(45deg);

          background : #ed6d76;

          transition : transform 0.3s ease-in-out;
        }

        div.icon-glow {
          filter : blur(5px);
          opacity: 0.5;
          transform : rotate(45deg) scale(0.8,0.8);
          transition: opacity 0.3s linear;
        }

        div.icon-glow-2{
          transform : rotate(0deg) scale(0.8,0.2);
        }

        div.hit {
          position: absolute;
          top : 0px;
          left : 0px;
          width : 100%;
          height : 100%;
          display: block;
          cursor: pointer;
        }

        &.selected {
          div.icon-glow {
            opacity: 0;
          }

          div.hit {
            pointer-events: none;
          }
        }

        &:not(.selected){
          div.icon {
            transform : rotate(45deg) scale(0.3,0.3);
          }
        }
      }
    }
  }


@media screen and (max-width : 1000px){

    div.textscontainer {
      left : 0vw;
      bottom : 0px;
      top : 17vh;
      margin-top : 0px;
      margin-left : 0px;
      position: absolute;
      width : 100vw;
      height : 40vw;
      overflow : hidden;

      div.touch-hit{
        position: absolute;
        width : 100vw;
        display: block;
        margin-left: -10vw;
        height : 40vw;
      }

      div.textscontent {
        position: absolute;
        p {
          width: 100vw;
          padding-left : 10vw;
          padding-right: 10vw;
          text-align: center;
          font-size : 3.5vw;
          line-height: 6vw;
        }
      }

      div.bullets-container {
        top : 15vh;
      }
    }
}
</style>
