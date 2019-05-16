<template lang="html">
  <transition
          name="contact"
          mode="out-in"
          v-on:before-enter="beforeEnter"
          v-on:enter="enter"
          v-on:after-enter="afterEnter"
          v-on:enter-cancelled="enterCancelled"
          v-on:before-leave="beforeLeave"
          v-on:leave="leave"
          v-bind:css="false"
          v-on:after-leave="afterLeave"
          v-on:leave-cancelled="leaveCancelled"
        >
  <section id="projects" ref="projects">
    <h1>PROJECTS</h1>
    <div class="projects-mask" ref="projectMask">
      <ul class="projects-list" ref="projectsList">
        <ProjectItem v-on:onClickItem="onClickItem" v-on:onOverItem="onOverItem" v-on:onOutItem="onOutItem" v-for="(item,index) in this.items" key="index" :model="item" :index="index" v-bind:ref="getRef(index)"/>
      </ul>
    </div>
    <ProjectNavigator v-if="isMobile()" ref="navigator" :items="this.items" :listWidth="this.listWidth"/>
  </section>
</transition>
</template>

<script>
import ProjectItem from "./projects/ProjectItem";
import ProjectNavigator from "./projects/ProjectNavigator";
import ContentLoader from "../loaders/ContentLoader";
import SoundsLoader from "../loaders/SoundsLoader";

export default {
  data (){
    return {
      items : ContentLoader.DATA_PROJECTS,
      listWidth : 0,
    }
  },
  components : {
    'ProjectItem' : ProjectItem,
    'ProjectNavigator' : ProjectNavigator
  },

  methods : {
    beforeEnter () {

    },

    isMobile () {
      return !window.MOBILE_DETECT.mobile()
    },

    enter (el,done) {

    },

    getRef(index){
      return "item"+index;
    },

    afterEnter () {

    },

    enterCancelled () {

    },

    beforeLeave () {
      if(window.environment3d){
        window.environment3d.hideBackgroundProject();
      }
    },

    leave(el, done){
      TweenMax.to(this.$refs.projects, 0.5, {opacity : 0, onComplete:done});
    },

    afterLeave() {

    },

    leaveCancelled() {

    },
    onOverItem (index){
      for(var i = 0; i < this.items.length; i++){
        if(i != index){
          var el = this.$refs["item"+i][0];
          el.fadeOutElement(index);
        }
      }
    },

    onClickItem (index){
      for(var i = 0; i < this.items.length; i++){
        if(i != index){
          var el = this.$refs["item"+i][0];
          el.hideElement(index);
        }
      }
    },

    onOutItem(index){
      for(var i = 0; i < this.items.length; i++){
        if(i != index){
          var el = this.$refs["item"+i][0];
          el.fadeInElement();
        }
      }
    },

    positeElements () {
      this.LIST_WIDTH = Math.round((window.innerWidth*0.30) + Math.ceil((this.items.length / 3)*626));
      this.LIST_HEIGHT = Math.round(2%3)*Math.round(window.innerHeight * 0.25);
      var arrPositions = [];
      for(var i = 0; i < this.items.length; i++){
          var el = this.$refs["item"+i][0];
          el.posite();
          arrPositions.push({x : el.posx, y : el.posy});
      }


      if(this.$refs.navigator){
        this.$refs.navigator.createBullets(this.items, arrPositions, this.LIST_WIDTH, this.LIST_HEIGHT);
        this.$refs.navigator.updateScrollPosition(this.posX/(window.innerWidth), this.LIST_WIDTH/window.innerWidth);
      }else{
        TweenMax.set(this.$refs.projects, {height : ((this.items.length)*140 + 120)});
      }
    },

    onResizeWindow(evt){
      this.positeElements();
    },

    onMouseMove(evt){
      this.coefMouseX = (evt.pageX - (window.innerWidth/2) ) / (window.innerWidth/2);
    },

    startListeners () {
      this.coefMouseX = 0;
      this.posX = 0;
      document.addEventListener('mousemove', this.onMouseMove);
      this.checkElementsVisible(0);
      this.interval = setInterval(this.checkMouseCoef.bind(this),100);
      window.addEventListener('resize', this.onResizeWindow);
    },

    checkMouseCoef () {

      var b = false;
      if(this.coefMouseX > 0.6){
        this.posX -= ((this.coefMouseX-0.6)/0.4) * 100;
        this.posX = Math.max(this.posX, window.innerWidth - this.LIST_WIDTH);
        b = true;
      }else if(this.coefMouseX < -0.6){
        this.posX += ((this.coefMouseX+0.6)/-0.4) * 100;
        this.posX = Math.min(0, this.posX);
        b = true;
      }


      if(b){
        this.checkElementsVisible(this.posX);
        TweenMax.to(this.$refs.projectsList, 1, {x : Math.round(this.posX), roundProps:"x", ease : Quad.easeOut, force3D : true});

        if(this.$refs.navigator)
          this.$refs.navigator.updateScrollPosition(this.posX/(window.innerWidth), this.LIST_WIDTH/window.innerWidth);
      }
    },

    checkElementsVisible(posx){
      for(var i =0 ; i < this.items.length; i++){
        this.$refs["item"+i][0].checkVisibility(posx);
      }
    },
  },

  mounted () {
    SoundsLoader.playSound("sectionentrance2", false, 0.1, 0);
    document.body.style.pointerEvents = "all";
    window.huiaPrerenderReady = true;
    this.listWidth = Math.floor(this.items.length/3) * 626;

    if(this.$refs.navigator)
      this.$refs.navigator.updateDraggerWidth();

    if(window.mainMenu){
      window.mainMenu.changeColor("#76BDB2");
    }else{
      TweenMax.to(this, 1, {onComplete:()=>{window.mainMenu.changeColor("#76BDB2");}});
    }

    if(window.environment3d){
      window.environment3d.setBlur(true,true);
    }
    this.positeElements();
    this.startListeners();
  },



  destroyed() {
    document.body.style.pointerEvents = "all";
    TweenMax.killChildTweensOf(this.$refs.projects);
    document.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onResizeWindow);
    window.clearInterval(this.interval);
  }
}
</script>

<style lang="scss" scoped>
  h1 {
    font-size : 0px;
    position : absolute;
  }


  section#projects {
    position : absolute;
    top : 0px;
    left : 0px;
    width : 100%;
    height : 100%;
    display : block;
    overflow : hidden;

    div.projects-mask {
      position : absolute;
      top : 0px;
      left : 0px;
      width : 100%;
      height : 100%;
      display : block;

      ul.projects-list {
        position : absolute;
        top : 15%;
        left : 0px;
        display : block;
        padding-left : 20vw;
        height : 500px;
      }
    }
  }

  @media screen and (max-width : 1000px){
    section#projects{
      // overflow-y : scroll;
      // -webkit-overflow-scrolling: touch;
      // overflow-x : hidden;
      padding-bottom : 0;
      display : block;
      float : left;
      position : relative;

      div.projects-mask {
        ul.projects-list{
          top : 15vh;
        }
      }
    }
  }
</style>
