<template>
  <transition
          name="about"
          mode="out-in"
          v-on:leave="leave"
        >
        <section id="studios" class="container" ref="container">
          <div class="items-container">
            <StudioItem ref="studio0" v-on:selectStudio="onSelectStudio" :index=0 :data="getStudio('experience')" :studioTxt="studioTxt" key="0" :mousePosition="{x : mouseX, y : mouseY}"/>
            <StudioItem ref="studio1" v-on:selectStudio="onSelectStudio" :index=1 :data="getStudio('media')" :studioTxt="studioTxt"  key="1" :mousePosition="{x : mouseX, y : mouseY}"/>
            <StudioItem ref="studio2" v-on:selectStudio="onSelectStudio" :index=2 :data="getStudio('technology')" :studioTxt="studioTxt"  key="2" :mousePosition="{x : mouseX, y : mouseY}"/>
          </div>
          <StudioTexts ref="texts" v-bind:data="getTexts()"/>
        </section>
  </transition>
</template>


<script>
  import TweenMax from "gsap";
  import StudioItem from './studios/StudioItem';
  import StudioTexts from './studios/StudioTexts';
  import ContentLoader from "../loaders/ContentLoader";
  import SoundsLoader from "../loaders/SoundsLoader";
  import 'gsap/ScrollToPlugin';


  export default {
    // init
    name : "Studios",
    components : {
      'StudioItem' : StudioItem,
      'StudioTexts' : StudioTexts
    },

    beforeCreate(){
      this.offsets = [0,0,0];
    },

    methods : {
      getTexts () {
        return ContentLoader.DATA_TEXTS.abouttext;
      },

      leave(el, done){
        // TweenMax.killChildTweensOf(this.$refs.container);
        // TweenMax.killTweensOf(this.$refs.container);
        TweenMax.to(this.$refs.texts.$el, 0.4, {opacity : 0});

        this.$refs.container.style.pointerEvents = "none";
        if(!this.goToIndex)
        {
          this.goToIndex = -1;
          TweenMax.to(this.$refs.container, 0.5, {opacity : 0, onComplete:done});
          return;
        }

        for(var i = 0; i < 3; i++){
          if(window.MOBILE_DETECT.mobile()){
              TweenMax.to(this.$refs["studio"+i].$refs.container, 1, { y : (i-this.goToIndex)*30, opacity : 0, ease : Quint.easeInOut, onComplete:((i == 2) ? done : null)});
          }else{
            TweenMax.to(this.$refs["studio"+i].$refs.container, 1, { x : (i-this.goToIndex)*(window.innerWidth/1.5), ease : Quint.easeInOut, onComplete:((i == 2) ? done : null)});
          }

        }


        // TweenMax.to(this.$refs.container, 0.5, {opacity : 0, onComplete:done});
        // TweenMax.to(this.$refs.container, 1, {y : -100, opacity : 0, ease : Quint.easeInOut, onComplete:done});
      },

      getStudio(str){
        for(var s in ContentLoader.DATA_STUDIOS){
          if(ContentLoader.DATA_STUDIOS[s].slug == str){
            return ContentLoader.DATA_STUDIOS[s];
          }
        }
      },

      onMouseMove(evt){
        this.mouseX = evt.clientX / (window.innerWidth/2);
        this.mouseY = evt.clientY / (window.innerHeight/2);
      },

      onSelectStudio(el, slug,index) {
        this.$router.push('/about/'+slug+ "/");
        TweenMax.killTweensOf(this.$refs.studio0.$refs.container);
        TweenMax.killChildTweensOf(this.$refs.studio0.$refs.container);
        this.$refs.studio0.destroying = true;
        TweenMax.killTweensOf(this.$refs.studio1.$refs.container);
        TweenMax.killChildTweensOf(this.$refs.studio1.$refs.container);
        this.$refs.studio1.destroying = true;
        TweenMax.killTweensOf(this.$refs.studio2.$refs.container);
        TweenMax.killChildTweensOf(this.$refs.studio2.$refs.container);
        this.$refs.studio2.destroying = true;
        this.goToIndex = index;


        el.destroyElement();
      }
    },

    mounted (el) {
      SoundsLoader.playSound("entrancestudio", false, 0.15, 0);
      TweenMax.to(document.getElementById("app"), 0.5, {scrollTo:{y : 0}});

      document.addEventListener('mousemove', this.onMouseMove);
      window.huiaPrerenderReady = true;
      if(window.environment3d){
        window.environment3d.setBlur(true,true);
      }

      if(window.mainMenu){
        window.mainMenu.changeColor("#ed6d76");
      }else{
        TweenMax.to(this, 1, {onComplete:()=>{window.mainMenu.changeColor("#ed6d76");}});
      }
    },

    beforeDestroy(el){
      document.removeEventListener('mousemove', this.onMouseMove);
    },

    data () {
      return {
        studios : ContentLoader.DATA_STUDIOS,
        studioTxt : ContentLoader.DATA_TEXTS.studio,
        mouseX : 0,
        mouseY : 0
      }
    }
  }
</script>


<style scoped lang="scss">
  section#studios {
    position : absolute;
    width : 100%;
    height : 100%;

    div.items-container {
      top : 50%;
      position : absolute;
      top : 50%;
      left : 25vw;
      width : 100%;
      padding-left : 20vw;
      margin-top : -35px;
    }
  }


  @media screen and (max-width : 1000px){
    section#studios {
      position : absolute;
      height : 130vh;
      div.items-container{
        left : 30vw;
        padding-left : 0px;
        top : 52vh;
      }
    }
  }
</style>
