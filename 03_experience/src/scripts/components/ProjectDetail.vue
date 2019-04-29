<template lang="html">
  <transition
          name="projectdetail"
          mode="out-in"
          v-on:leave="leaveAll"
        >
    <section id="project-detail" ref="container">
      <div class="pages-container" v-if="this.model">
        <transition-group v-on:leave="leavePage" mode="out-in">
          <ProjectDetailPage v-for="(page,index) in model.data.pages" v-on:goDown="onGoDown" v-on:goUp="onGoUp" v-bind:key="index" :direction="direction" v-bind:totalPages="model.data.pages.length" v-bind:model="page" v-if="currentPage == index" v-bind:pageIndex="index" v-bind:color="model.data.detail_color"/>
        </transition-group>
      </div>
      <button ref="copyBtn" @success="handleSuccess" v-bind:style="{'color' : this.model.data.detail_color, 'pointerEvents' : ((this.linkCopied) ? 'none' : 'all')}" v-clipboard="this.getProjectLink()">
          <svg x="0px" y="0px" viewBox="0 0 482.8 482.8" style="enable-background:new 0 0 482.8 482.8;" width="512px" height="512px">
            <g>
              <path d="M255.2,209.3c-5.3,5.3-5.3,13.8,0,19.1c21.9,21.9,21.9,57.5,0,79.4l-115,115c-21.9,21.9-57.5,21.9-79.4,0l-17.3-17.3    c-21.9-21.9-21.9-57.5,0-79.4l115-115c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-115,115C8.7,322.7,0,343.6,0,365.8    c0,22.2,8.6,43.1,24.4,58.8l17.3,17.3c16.2,16.2,37.5,24.3,58.8,24.3s42.6-8.1,58.8-24.3l115-115c32.4-32.4,32.4-85.2,0-117.6    C269.1,204,260.5,204,255.2,209.3z" v-bind:fill="this.model.data.detail_color"/>
              <path d="M458.5,58.2l-17.3-17.3c-32.4-32.4-85.2-32.4-117.6,0l-115,115c-32.4,32.4-32.4,85.2,0,117.6c5.3,5.3,13.8,5.3,19.1,0    s5.3-13.8,0-19.1c-21.9-21.9-21.9-57.5,0-79.4l115-115c21.9-21.9,57.5-21.9,79.4,0l17.3,17.3c21.9,21.9,21.9,57.5,0,79.4l-115,115    c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4l115-115c15.7-15.7,24.4-36.6,24.4-58.8    C482.8,94.8,474.2,73.9,458.5,58.2z" v-bind:fill="this.model.data.detail_color"/>
            </g>
          </svg>
          {{getCopyText()}}
      </button>
      <div class="scroll-indicator" ref="scrollIndicator" v-if="this.model.data.pages.length > 1" v-on:click="onClickScrollIndicator()">
        <div class="blur-bg" v-bind:style="{'backgroundColor' : this.model.data.detail_color}"></div>
        <div class="arrow" ref="scrollIndicatorArrow">
          <div class="element-1 element">
            <div class="part1" v-bind:style="{'backgroundColor' : this.model.data.detail_color}"></div>
            <div class="part2" v-bind:style="{'backgroundColor' : this.model.data.detail_color}"></div>
          </div>
          <div class="element-2 element">
            <div class="part1" v-bind:style="{'backgroundColor' : this.model.data.detail_color}"></div>
            <div class="part2" v-bind:style="{'backgroundColor' : this.model.data.detail_color}"></div>
          </div>
        </div>
      </div>

      <ProjectDetailNavigator v-if="this.model.data.pages.length > 1" ref="navigator" :length="this.model.data.pages.length" :titles="this.getTitles()" v-bind:color="model.data.detail_color" v-on:changePage="onChangePage"/>
    </section>
  </transition>
</template>

<script>
import ContentLoader from '../loaders/ContentLoader';
import ProjectDetailPage from './projectdetail/ProjectDetailPage';
import ProjectDetailNavigator from './projectdetail/ProjectDetailNavigator';
import VueClipboards from "vue-clipboards";
import Vue from 'vue';

Vue.use(VueClipboards);

export default {
  components : {
      'ProjectDetailPage' : ProjectDetailPage,
      'ProjectDetailNavigator' : ProjectDetailNavigator
  },


  data() {
    return {
      model : null,
      direction : "down",
      currentPage : 0,
      changeEnabled : true,
      txt : "aeae",
      copyData: 'copy data 12123',
      linkCopied : false,
      slug : this.$router.currentRoute.params.slug
    }
  },

  methods : {
    getCopyText () {
      return (this.linkCopied ? ContentLoader.DATA_TEXTS.copied : ContentLoader.DATA_TEXTS.copyLink);
    },

    onGoDown(){
      this.goPageByDrag('down');
    },

    onGoUp() {
      this.goPageByDrag('up');
    },

    goPageByDrag(str){
      var go = false;

      if(str == 'down'){
        if(this.currentPage < this.model.data.pages.length - 1)
        {
          this.goToPage(this.currentPage + 1);
          go = true;
        }
      }else{
        if(this.currentPage > 0){
          go = true;
          this.goToPage(this.currentPage - 1);
        }
      }

      if(go){
        TweenMax.to(this, 2, {onComplete:()=>{ this.changeEnabled = true;}});
        this.changeEnabled = false;
      }
    },

    getTitles () {
      var tl = [];
      for(var i = 0; i < this.model.data.pages.length; i++){
        tl.push(this.model.data.pages[i].title.replace("$"," ") + " " + this.model.data.pages[i]["subtitle-title"].replace("$", " "));
      }
      return tl;
    },

    handleSuccess(e) {
        this.linkCopied = true;
        e.clearSelection();
    },

    // copyLink (){
    //
    // },

    getProjectLink () {
      return window.ROOT_URL + "projects/"+this.$router.currentRoute.params.slug;
    },
    loadData() {
      ContentLoader.loadProjectDetail(this.slug, this.onProgressLoading, this.onCompleteLoading);
    },

    onChangePage(index){
      if(!this.changeEnabled){
        return;
      }

      TweenMax.to(this, 1, {onComplete:()=>{ this.changeEnabled = true;}});
      this.changeEnabled = false;
      this.goToPage(index);
    },

    onClickScrollIndicator(evt){
      if(!this.changeEnabled){
        return;
      }

      TweenMax.to(this, 1, {onComplete:()=>{ this.changeEnabled = true;}});
      this.changeEnabled = false;
      this.goToPage(this.currentPage + 1);
    },

    onWheel(evt){
      evt.preventDefault();

      if(!this.changeEnabled){
        return;
      }

      var go = false;
      var num = evt.deltaY;

      if(evt.type == "DOMMouseScroll"){
        num = evt.detail;
      }


      if(num > 0){
        if(this.currentPage < this.model.data.pages.length - 1)
        {
          this.goToPage(this.currentPage + 1);
          go = true;
        }
      }else{
        if(this.currentPage > 0){
          go = true;
          this.goToPage(this.currentPage - 1);
        }
      }

      if(go){
        TweenMax.to(this, 2, {onComplete:()=>{ this.changeEnabled = true;}});
        this.changeEnabled = false;
      }
    },

    leavePage(el, done){
      el.style.pointerEvents = "none";
      TweenMax.to(el, 0.5, {ease : Linear.easeNone, onComplete:done});
      el.__vue__.destroyAnimation(this.direction);
    },

    leaveAll(el, done){
      TweenMax.to(this.$refs.container, 0.5, {opacity : 0, ease : Linear.easeNone, onComplete:done});
    },

    onProgressLoading(data){
      // console.log("loading ..." + data + "%");
    },

    onCompleteLoading(data){
      this.showPage();
    },


    showPage () {
      window.huiaPrerenderReady = true;
      this.model = ContentLoader.getProjectDetail(this.slug);
      window.projectTitle = this.model.data.titleBreakable;
      window.detailColor = this.model.data.detail_color;
      if(window.mainMenu){
        window.mainMenu.changeColor(this.model.data.detail_color);
        window.mainMenu.transformInCloseButton();
      }else{
        TweenMax.to(this, 1, {onComplete:()=>{
          window.mainMenu.changeColor(this.model.data.detail_color);
          window.mainMenu.transformInCloseButton();
        }});
      }
    },

    hideIndicator () {

    },

    showIndicator () {

    },

    goToPage(index){
      if(index > this.currentPage){
        this.direction = "up";
      }else{
        this.direction = "down";
      }
      this.currentPage = index;
      this.$refs.scrollIndicator.style.pointerEvents = (index == this.model.data.pages.length-1) ? "none" : "all";

      if(this.$refs.navigator)
        this.$refs.navigator.selectItem(index);

      TweenMax.to(this.$refs.scrollIndicator, 0.5, {opacity : ((index == this.model.data.pages.length-1) ? 0 : 1)});
    },
  },

  beforeMount () {
    if(!ContentLoader.getProjectDetail(this.slug)){
      this.loadData();
    }else{
      this.showPage();
    }
  },

  mounted() {
    TweenMax.fromTo(this.$refs.container, 0.5, {opacity : 0}, {opacity:1});
    if(!ContentLoader.getProjectDetail(this.slug)){
      this.model = null;
      this.loadData();
    }else{
      this.showPage();
    }

    if(window.environment3d){
      window.environment3d.setBlur(true,true);
    }

    window.projectDetail = this;
    TweenMax.from(this.$refs.copyBtn, 1, {y : 10, opacity : 0, ease : Quint.easeInOut, delay:1});

    if(this.$refs.scrollIndicator){
      TweenMax.from(this.$refs.scrollIndicator, 1, {y : 10, opacity : 0, ease : Quint.easeInOut, delay:1});

      this.timeline = new TimelineMax({repeat : -1});
      this.timeline.set(this.$refs.scrollIndicatorArrow.children[0], {scaleX : 0, scaleY : 0, y : -10});
      this.timeline.set(this.$refs.scrollIndicatorArrow.children[0].children[1], {rotation:-90});
      this.timeline.set(this.$refs.scrollIndicatorArrow.children[0].children[0], {rotation:90});
      this.timeline.to(this.$refs.scrollIndicatorArrow.children[1], 0.4, {y : -5, ease : Quad.easeOut});
      this.timeline.to(this.$refs.scrollIndicatorArrow.children[1], 0.4, {y : 0, ease : Quad.easeIn});
      this.timeline.to(this.$refs.scrollIndicatorArrow.children[1], 0.4, {y : -5, ease : Quad.easeOut});
      this.timeline.to(this.$refs.scrollIndicatorArrow.children[1], 0.4, {y : 0, ease : Quad.easeIn});
      this.timeline.to(this.$refs.scrollIndicatorArrow.children[1], 0.4, {y : -5, ease : Quad.easeOut});
      this.timeline.to(this.$refs.scrollIndicatorArrow.children[1], 0.4, {y : 0, ease : Quad.easeIn});
      this.timeline.to(this.$refs.scrollIndicatorArrow.children[1].children[0], 0.2, {rotation : 15, scaleX : 0.5, ease : Linear.easeNone});
      this.timeline.to(this.$refs.scrollIndicatorArrow.children[1].children[1], 0.2, {rotation : -15, scaleX : 0.5, ease : Linear.easeNone}, "-=0.2");
      this.timeline.to(this.$refs.scrollIndicatorArrow.children[1].children[0], 0.2, {scaleX : 0, ease : Quad.easeOut});
      this.timeline.to(this.$refs.scrollIndicatorArrow.children[1].children[1], 0.2, {scaleX : 0, ease : Quad.easeOut}, "-=0.2");
      this.timeline.to(this.$refs.scrollIndicatorArrow.children[0], 0.4, {scaleX : 1, scaleY : 1, ease : Quad.easeOut}, "-=0.4");
      this.timeline.to(this.$refs.scrollIndicatorArrow.children[0].children[0], 0.4, {scaleX : 1, scaleY : 1, rotation:45,ease : Quad.easeOut}, "-=0.4");
      this.timeline.to(this.$refs.scrollIndicatorArrow.children[0].children[1], 0.4, {scaleX : 1, scaleY : 1, rotation:-45,ease : Quad.easeOut}, "-=0.4");
      this.timeline.to(this.$refs.scrollIndicatorArrow.children[0], 0.4, {scaleX : 1, scaleY : 1, ease : Quad.easeOut}, "-=0.4");
      this.timeline.to(this.$refs.scrollIndicatorArrow.children[0], 0.4, {y : 0, ease : Quad.easeIn});
      this.timeline.play();
    }

    if(this.model.data.pages.length == 0){
      this.$refs.scrollIndicator.style.display = "none";
    }

  	document.addEventListener("mousewheel", this.onWheel, false);
  	document.addEventListener("DOMMouseScroll", this.onWheel, false);


  },

  beforeDestroy () {
    window.projectTitle = null;
    window.detailColor = null;
    document.removeEventListener("mousewheel", this.onWheel, false);
  	document.removeEventListener("DOMMouseScroll", this.onWheel, false);
    window.mainMenu.transformInMenuButton();

    if(this.timeline){
      this.timeline.stop();
      this.timeline.clear();
      this.timeline = null;
    }
  }
}
</script>

<style lang="scss" scoped>
  section#project-detail {
    position : absolute;
    top : 0px;
    left : 0px;
    width : 100%;
    height: 100%;
    padding-left : 0px;
    overflow : hidden;

    h1 {
      font-size : 40px;
      color : #ffffff;
    }

    button {
      position : absolute;
      bottom : 30px;
      left : 45vw;
      font-size: 10px;
      font-family: 'open_sansbold';
      text-transform: uppercase;
      letter-spacing: 5px;
      opacity : 0.5;
      margin-left : -357px;
      transition : color 0.3s linear,padding-left 0.3s ease-in-out;
      background : transparent;
      border : none;
      padding : 0px;
      outline : none !important;
      -webkit-appearance : none;

      svg {
        width : 10px;
        height : 10px;
        margin-top : 0px;
        margin-left : 0px;
        display: inline-block;
        float : left;
        position : absolute;
        transform : scale(0);
        transition : all 0.3s ease-in-out;
      }

      &:hover {
        padding-left : 15px;

        svg {
          transform : scale(1);
          margin-left : -15px;
        }
      }
    }

    div.scroll-indicator {
      position : absolute;
      bottom : 30px;
      left : 50%;
      cursor : pointer;

      div.blur-bg {
        width : 30px;
        height : 10px;
        left : -5px;
        top : -9px;
        position : absolute;
        border-radius: 50%;
        filter : blur(13px);
      }

      div.arrow {
        position : absolute;

        div.element {
          position : absolute;
          transform-origin: 11px 10px;

          div.part1 {
            position : absolute;
            width : 12px;
            height : 3px;
            display: block;
            border-radius : 12px;

            transform-origin: center right;
            transform : rotate(45deg);
            overflow: hidden;
            -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);
          }

          div.part2 {
            position : absolute;
            width : 12px;
            height : 3px;
            display: block;
            border-radius : 12px;

            transform-origin: center left;
            transform : rotate(-45deg);
            left : 11px;
            overflow: hidden;
            -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);
          }
        }
      }
    }
  }


  @media screen and (max-width : 1000px){
    section#project-detail {
      background : rgba(0,0,0,0.5);

      h1 {
        font-size : 0px;
        color : #ffffff;
      }

      button {
        bottom : auto;
        left : 3vw;
        font-size: 3vw;
        letter-spacing: 1.5vw;
        opacity : 0.5;
        margin-left : 0px;
        top : 4vh;
        z-index : 9999;

        display : none; //temp
      }

      div.scroll-indicator{
        left : 50%;
        transform : translateX(-15px);
      }
    }
  }
</style>
