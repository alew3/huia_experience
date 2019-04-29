<template>
  <transition
          name="clients"
          mode="out-in"
          v-on:leave="leave"
        >
        <section id="clients" class="container" ref="container">
          <h1>Clients</h1>
          <div class="all-bullets" ref="allBulletsContainer">
            <div class="white-bullets" ref="whiteBullets">
              <WhiteBullet v-for="i in elements.length" :index="i" key="i" v-bind:ref="getWhiteRef(i)" />
            </div>
            <ul class="bullets-container" ref="bulletsContainer">
              <li v-for="(item,index) in elements">
                <ClientItem v-on:onOverBullet="onOverItem" key="index" v-on:onOutBullet="onOutItem" :model="item" :index="index" v-if="!item.name" v-bind:ref="getElementRef(index)"/>
                <TeamMember v-on:onOverBullet="onOverItem" key="index" v-on:onOutBullet="onOutItem" :model="item" :index="index" v-else  v-bind:ref="getElementRef(index)"/>
              </li>
            </ul>
          </div>
          <ClientNavigator ref="navigator" v-if="!isMobile()"/>
        </section>
  </transition>
</template>

<script>

import ContentLoader from "../loaders/ContentLoader.js";
import SoundsLoader from "../loaders/SoundsLoader.js";
import MathHelper from '../helpers/MathHelper';
import ClientItem from './clients/ClientItem';
import TeamMember from './clients/TeamMember';
import WhiteBullet from './clients/WhiteBullet';
import ClientNavigator from './clients/ClientNavigator';
import Globals from '../core/Globals';

export default {
  data(){
    return{
      elements : this.getMixedArrays(),
      NUM_LINES : 12,
      CLIENTS_PER_COLUMN : 3,
      MAX_CLIENTS : 30,
      INI_POS_X : 0,
      POS_X : 0,
      COEF : 0,
      INI_POS_Y : 0,
      WIDTH : 0,
      INI_MOUSE_X : 0,
      CURRENT_POS_X : 0,
      LIST_WIDTH : 0,
      LIST_HEIGHT : 0,
      listWidth : 0
    }
  },

  components : {
    'ClientItem' : ClientItem,
    'TeamMember' : TeamMember,
    'WhiteBullet' : WhiteBullet,
    'ClientNavigator' : ClientNavigator
  },

  beforeMount () {
  },


  mounted () {
    if(window.mainMenu){
      window.mainMenu.changeColor("#7bc2b4");
    }else{
      TweenMax.to(this, 1, {onComplete:()=>{window.mainMenu.changeColor("#7bc2b4");}});
    }

    if(window.environment3d){
      window.environment3d.setBlur(true,true);
    }
    SoundsLoader.playSound("sectionentrance1", false, 0.1, 0);

    window.huiaPrerenderReady = true;
    this.positeElements();
    // this.startListeners();
    // this.listWidth = Math.ceil(this.elements.length/5) * 300 + 300;
    TweenMax.to(this.$refs.container, 0, {delay : Globals.GENERAL_DELAY, onComplete:this.startListeners, onCompleteScope:this});
  },


  beforeDestroy(el){
    cancelAnimationFrame(this.requestAnim);
    this.requestAnim = null;
  },


  destroyed() {
    document.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onResizeWindow);
    window.clearInterval(this.interval);
  },

  watch : {
  },

  methods : {
    onMouseMove(evt){
        this.coefMouseX = (evt.pageX - (window.innerWidth/2) ) / (window.innerWidth/2);
        this.lastScale = 1;
    },

    setStartPosition (posx, posy){
        TweenMax.set(this.$refs.container, {left : posx, top : posy});
    },

    isMobile(){
      return window.MOBILE_DETECT.mobile()
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
        // this.checkElementsVisible(this.posX);
        TweenMax.to(this.$refs.allBulletsContainer, 1, {x : Math.round(this.posX), ease : Quad.easeOut, force3D : true});

        if(this.$refs.navigator)
          this.$refs.navigator.updateScrollPosition(this.posX/(window.innerWidth), this.LIST_WIDTH/window.innerWidth);
        // this.tw = TweenMax.to(this.$refs.whiteBullets, 1.1, {x : Math.round(this.posX), force3D : true, ease : Quad.easeOut});
      }
    },

    checkElementsVisible(posx){

      for(var i = 0; i < this.elements.length; i++){
        var el = this.$refs["element"+i];
        var white = this.$refs["white"+i];
        el[0].checkVisibility(posx);
        white[0].checkVisibility(posx);
      }
    },

    startListeners () {
      this.coefMouseX = 0;
      this.posX = 0;
      this.interval = setInterval(this.checkMouseCoef.bind(this),100);

      if(!this.isMobile()){
        document.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('resize', this.onResizeWindow);
      }
    },

    positeElements () {
      if(this.isMobile()){
        this.positeElementsMobile();
        return;
      }

      this.COLUMN_WIDTH = 95;
      this.COLUMN_HEIGHT = Math.floor((window.innerHeight * 0.7)  / this.NUM_LINES);
      var difBetweenElements;
      var firstPosition;

      var maxX = 0;
      var maxY = 0;

      var arrPositions = [];
      for(var i = 0 ; i < this.elements.length; i++){
        var el = this.$refs["element"+i];
        var white = this.$refs["white"+i];

        if(i % 2 == 0){
          difBetweenElements = 4+Math.round(Math.random()*4);
          firstPosition = Math.round(i%3)+(Math.random()*2);
        }

        var posx = Math.round(Math.floor(i/2)*(this.COLUMN_WIDTH*1.5 + (this.COLUMN_WIDTH*0.2)));
        var posy = ((i%2 == 0) ? firstPosition : firstPosition+difBetweenElements) * (this.COLUMN_HEIGHT + (this.COLUMN_HEIGHT * 0.1));
        posx += Math.round(Math.random()*(this.COLUMN_WIDTH));
        // el.style.top = posx + 'px';
        el[0].setStartPosition(posx,posy, true);
        arrPositions.push({x : posx, y : posy});

        if(firstPosition < 4){
          firstPosition--;
        }else{
          firstPosition++;
        }

        // if(Math.random() < 0.5)
        //   difBetweenElements++;
        // else
        //   difBetweenElements--;
        if(firstPosition < 4){
          posx += this.COLUMN_HEIGHT + (Math.random()*this.COLUMN_HEIGHT/2);
          posy += this.COLUMN_WIDTH + (Math.random()*this.COLUMN_WIDTH/2);
        }else{
          posy -= this.COLUMN_WIDTH - (Math.random()*this.COLUMN_WIDTH/2);
          posx -= this.COLUMN_WIDTH - (Math.random()*this.COLUMN_HEIGHT/2);
        }
        white[0].setStartPosition(posx,posy,true);

        if(posx > maxX){
          maxX = posx;
        }
        if(posy > maxY){
          maxY = posy;
        }
      }

      this.LIST_WIDTH = maxX + window.innerWidth*0.30;
      this.LIST_HEIGHT = maxY + window.innerHeight*0.15;

      this.$refs.bulletsContainer.style.width = Math.round(maxX) + 'px';
      this.$refs.bulletsContainer.style.height = Math.round(maxY) + 'px';

      this.$refs.whiteBullets.style.width = Math.round(maxX) + 'px';
      this.$refs.whiteBullets.style.height = Math.round(maxY) + 'px';

      if(this.$refs.navigator){
        this.$refs.navigator.createBullets(this.elements, arrPositions, this.LIST_WIDTH, this.LIST_HEIGHT);
        this.$refs.navigator.updateScrollPosition(this.posX/(window.innerWidth), this.LIST_WIDTH/window.innerWidth);
      }
    },

    positeElementsMobile () {
      this.COLUMN_WIDTH = Math.round(0.28 * window.innerWidth);
      this.COLUMN_HEIGHT = Math.round(window.innerHeight * 0.20);
      var difBetweenElements;
      var firstPosition;

      var maxX = 0;
      var maxY = 0;

      var arrPositions = [];
      for(var i = 0 ; i < this.elements.length; i++){
        var el = this.$refs["element"+i];
        var white = this.$refs["white"+i];
        var posx = ((i%3)*this.COLUMN_WIDTH);
        posx += Math.random()*(this.COLUMN_WIDTH/2);

        var posy = Math.floor(i/3)*this.COLUMN_HEIGHT;
        posy += (i%2)*(Math.random() * (this.COLUMN_HEIGHT/2));

        el[0].setStartPosition(posx,posy, true);

        posy += (this.COLUMN_HEIGHT/2);
        posx += (this.COLUMN_WIDTH/2);
        white[0].setStartPosition(posx,posy,true);

        if(posy > maxY){
          maxY = posy;
        }


        if(posx > maxX){
          maxX = posx;
        }
      }

      TweenMax.set(this.$refs.bulletsContainer, {height : maxY+(window.innerHeight*0.25), width : maxX});
      TweenMax.set(this.$refs.container, {height : maxY+(window.innerHeight*0.45)});

    },

    onResizeWindow(evt){
      this.positeElements();
    },


    onOverItem (el){
      this.hovering = true;

      if(this.isMobile()){
        var num = 0;
        if(el.name == 'clientItem'){
          if(el.initialPositionX < window.innerWidth * 0.3){
            num = (window.innerWidth * 0.2);
          }else if(el.initialPositionX < window.innerWidth * 0.6){
            num = (window.innerWidth * 0.3);
          }else{
            num = (window.innerWidth * 0.5);
          }
        }else{
          num = (window.innerWidth*0.15);
        }

        TweenMax.killTweensOf(this.$refs.container);

        if(this.isMobile()){
          
          var elem = this.$refs["element"+el.index];
          var t = elem[0].topPos;
          var y = elem[0].topPos > 100 ? (Math.abs(t - (window.innerHeight/2) + 180)) : 0;
          

          // document.getElementById('app').scrollTop = y;
          TweenMax.to(document.getElementById('app'), 0.5, {scrollTo:y});

        }
        else {
          TweenMax.to(this.$refs.allBulletsContainer, 1, {x : num - el.initialPositionX, ease : Quint.easeOut, overwrite:false });          
        }
      }

      for(var i = 0; i < this.elements.length; i++){
        var loopEl = this.$refs["element" + i][0];
        if(loopEl != el){
          loopEl.reactToHover(el);
        }

        var white = this.$refs["white" + i];
        if(white){
          white = white[0];
          white.reactToHover(el);
        }
      }
    },




    onOutItem(el, b){
      if((!this.hovering && this.isMobile()) || b)
        TweenMax.to(this.$refs.allBulletsContainer, 1, {x : 0, ease : Quint.easeOut, overwrite:false });

      this.hovering = false;
      for(var i = 0; i < this.elements.length; i++){
        var loopEl = this.$refs["element" + i][0];
        loopEl.backToInitial();

        var white = this.$refs["white" + i];
        if(white){
          white = white[0];
          white.backToInitial();
        }
      }
    },

    getElementRef(id){
      return "element"+id;
    },

    getWhiteRef(id){
      return "white"+(id-1);
    },

    leave(el, done){
      TweenMax.to(this.$refs.container, 0.5, {opacity : 0, onComplete:done});
    },

    getMixedArrays () {
        var arr = ContentLoader.DATA_CLIENTS.concat(ContentLoader.DATA_TEAM);
        return MathHelper.randomizeArray(arr);
        // var arr = ContentLoader.DATA_TEAM.concat(ContentLoader.DATA_CLIENTS);
        // return arr;
    }
  }
}
</script>

<style lang="scss" scoped>
section#clients{
  position : absolute;
  top : 0px;
  left : 0px;
  display : block;
  overflow : hidden;
  width : 100%;
  height : 100%;
  padding-left : 15vw;

  h1 {
    font-size : 0px;
  }

  ul.bullets-container {
    position : absolute;
    top : 10vh;
    display: block;
    float : left;
  }

  div.white-bullets {
    position : absolute;
    top : 10vh;
    display: block;
    float : left;
  }
}

@media screen and (max-width : 1000px){
  section#clients{
    position : relative;
    overflow : visible;
    padding-left : 15vw;
    height : auto;
    width : 100vw;
    padding-top : 28vh;
    min-height: 100vh;

    h1 {
      font-size : 0px;
    }


    ul.bullets-container {
      position : relative;
      top : 0px;
      display: block;
      float : left;
    }

    div.white-bullets {
      position : absolute;
      top : 0px;
      display: block;
      float : left;
    }
  }
}
</style>
