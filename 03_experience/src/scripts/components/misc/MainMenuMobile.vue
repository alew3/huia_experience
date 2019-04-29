<template>
  <div v-bind:class="{'menu-gradient' : true, 'opened' : opened}" ref="menuGradient">
    <div class="bg-gradient" ref="bgGradient">
      <div class="bg-item" v-for="item in this.model" v-bind:style="{'background' : getGradientObject(item)}" key=item.slug></div>
    </div>
    <div class="bg-over" ref="bgGradientOver">
      <div class="bar1" ref="bgBar1"></div>
      <div class="bar2" ref="bgBar2"></div>
    </div>
    <div class="menu-container" ref="menuContainer">
      <div class="menu-mask" ref="menuMask">
        <nav ref="menuItems" v-on:mousedown="onDownTouch" v-on:mouseup="onUpTouch">
            <div class="menu-item" v-for='item in this.model' key=item.slug>
              <router-link :to="getPath(item.path)">{{item.title}}</router-link>
              <div class="bar"></div>
            </div>
            <!-- <div class="menu-item">
              <router-link :to="'/'+this.model[0]">{{this.model[0].title}}</router-link>
              <div class="bar"></div>
            </div> -->
        </nav>
      </div>
      <div class="open-menu-bg-container" ref="openBgMenuContainer">
        <div class="open-menu-bg" ref="openIconBg" v-bind:style="{backgroundColor : this.color}"></div>
      </div>
      <a class="icon-open" ref="openIcon" v-touch:tap="openMenu">
        <div class="p" v-bind:style="{backgroundColor : this.color}"></div><div class="p p1" v-bind:style="{backgroundColor : this.color}"></div><div class="p p2" v-bind:style="{backgroundColor : this.color}"></div>
      </a>
      <svg viewBox="0 0 50 50" ref="closeIconBg">
        <circle ref="circleout" cx="25" cy="25" r="21" v-bind:stroke="this.color" onerror=""stroke-width="1" fill="transparent" />
        <circle ref="circlein" cx="25" cy="25" r="22" v-bind:stroke="this.color" stroke-width="1" fill="transparent" />
      </svg>
      <a class="icon-close" ref="closeIcon">
        <div class="p" v-bind:style="{backgroundColor : this.color}"></div><div class="p p1" v-bind:style="{backgroundColor : this.color}"></div>
      </a>
      <a class="close-hit" ref="closeHit" v-touch:tap="onTapClose"></a>
    </div>
    <router-link :to="'/'" class="logo-link"><canvas ref="logoCanvas" width="200" height="200" class="logo-canvas"></canvas></router-link>
  </div>
</template>

<script>

import VueRouter from 'vue-router';
import ContentLoader from '../../loaders/ContentLoader';
import MathHelper from '../../helpers/MathHelper';
import NavigatorHelper from '../../helpers/NavigatorHelper';
import '../../vendors/easeljs';
import '../../vendors/SplitText.min.js';
import * as THREE from 'three';

export default {
  name : "MainMenuMobile",

  data () {
    return {
      clickEnabled : false,
      opened : false,
      model : ContentLoader.DATA_MENU,
      color : "#8C6EE5",
      colors : {home : "#8C6EE5", contact : "#8C6EE5", projects : "#76BDB2", team : "#76BDB2", about : "#ed6d76"},
    }
  },

  methods : {
    getPath(str){
      if(str == "/") str = "";
      return '/' + str;
    },
    getGradientObject (item) {
      // NavigatorHelper.getCs
      var p = item.path;
      p = p.split("/").join("");

      if(p == "/" || p == "")
        p = "home";

      if(!this.colors[p]){
        if(p.indexOf("about") > -1){
          p = "about";
        }else if(p.indexOf("projects") > -1){
          p = "projects";
        }
      }
      return this.colors[p];
      // var color = MathHelper.hexToRGB(this.colors[item.slug]);
      // return NavigatorHelper.getCssPrefix()+"linear-gradient(to bottom, rgba("+color.r+","+color.g+","+color.b+",0) 0%, rgba("+color.r+","+color.g+","+color.b+",0.2) 30%, rgba("+color.r+","+color.g+","+color.b+",1) 100%)";
    },


    openMenu (evt) {
      if(window.focusField){
        if(window.focusField.target){
          window,focusField.target.blur();
        }
      }
      if(!this.clickEnabled) return;
      this.$refs.menuItems.style.visibility = "visible";
      var time = 0.4;

      if(window.environment3d)
        window.environment3d.setBlur(true);


      this.transformInCloseButton(true);

      TweenMax.killTweensOf(this.$refs.bgBar1);
      TweenMax.killTweensOf(this.$refs.bgBar2);

      TweenMax.fromTo(this.$refs.bgBar1, 1, {opacity : 0}, {y : 0, opacity : 0.5, ease : Quint.easeOut});
      TweenMax.fromTo(this.$refs.bgBar2, 1, {opacity : 0}, {y : 0, opacity : 0.5, ease : Quint.easeOut});

      this.opened = true;
      this.clickEnabled = false;

      TweenMax.to(this.$refs.bgGradient, 1, {opacity : 1, ease : Quint.easeOut});
      TweenMax.to(this.$refs.bgGradientOver, 1, {opacity : 1, ease : Quint.easeOut});

      TweenMax.killTweensOf(this.$refs.menuItems);
      this.$refs.menuItems.style.opacity = 1;
      this.$refs.menuItems.style.pointerEvents = "all";
      this.$refs.menuMask.style.pointerEvents = "all";
      this.$refs.bgGradientOver.style.pointerEvents = "all";


      this.$refs.menuItems.style.display = "block";
      this.blockHeight = this.$refs.menuItems.children[0].getBoundingClientRect().height;

      this.$refs.menuGradient.addEventListener('touchstart', this.onDownTouch);
      this.$refs.menuGradient.addEventListener('touchend', this.onUpTouch);
      TweenMax.set(this.$refs.menuItems.children, {opacity : 0});
      TweenMax.set(this.$refs.menuItems,{scaleX : 0.98, scaleY : 0.98});
      // TweenMax.staggerFromTo(this.$refs.menuItems.children, 1, {x : 30}, {x : 0, ease : Back.easeOut},0.5);
      this.positeElements();
      this.alignToCurrentRoute();
    },

    enableMenu(opening){
      this.clickEnabled = true;
    },


    closeMenu(evt){
      // console.log(this.clickEnabled + " " +this.opened);
      if(!this.clickEnabled) return;
      if(!this.opened){
        // if(this.internalCloseButton){
        //   if(this.$router.currentRoute.path.indexOf("studios") > -1){
        //     this.$router.push('/studios');
        //   }else if(this.$router.currentRoute.path.indexOf("projects") > -1){
        //     this.$router.push('/projects');
        //   }
        // }
        return;
      }

      if(this.$router.currentRoute.path == "/"){
        window.environment3d.setBlur(false);
      }

      this.$refs.menuGradient.removeEventListener('touchstart', this.onDownTouch);
      this.$refs.menuGradient.removeEventListener('touchend', this.onUpTouch);
      this.$refs.menuItems.style.visibility = "hidden";

      this.transformInMenuButton(true);

      this.clickEnabled = false;
      this.opened = false;

      TweenMax.to(this.$refs.bgGradient, 1, {opacity : 0});
      TweenMax.to(this.$refs.bgGradientOver, 1, {opacity : 0});

      this.$refs.menuItems.style.pointerEvents = "none";
      this.$refs.menuMask.style.pointerEvents = "none";
      this.$refs.bgGradientOver.style.pointerEvents = "none";
      TweenMax.to(this.$refs.menuItems, 0.4, {opacity : 0, overwrite:false});
      TweenMax.to(this.$refs.menuContainer, 1, {x : 0, ease : Expo.easeInOut});
      TweenMax.to(this.$refs.logoCanvas, 1, {x : 0, ease : Expo.easeInOut});




      if(evt){
        this.alignToCurrentRoute();
      }
    },


    transformInCloseButton (ignore) {
      var time = 0.4;
      TweenMax.killTweensOf(this.$refs.circleout);
      TweenMax.set(this.$refs.circleout, {drawSVG : "0% 0%", transformOrigin : "50% 50%", rotation :0});
      TweenMax.to(this.$refs.circleout,time/2, {drawSVG : "0% 30%", ease : Linear.easeNone});
      TweenMax.to(this.$refs.circleout, time, {drawSVG : "100% 100%", ease : Quad.easeOut, delay:time/2, overwrite:false});
      TweenMax.to(this.$refs.circleout, time*1.5, {rotation:180, ease : Quad.easeOut, overwrite:false});

      TweenMax.killTweensOf(this.$refs.circlein);
      TweenMax.set(this.$refs.circlein, {drawSVG : "100% 100%", transformOrigin : "50% 50%", rotation :0});
      TweenMax.to(this.$refs.circlein, time/2, {drawSVG : "70% 100%", ease : Linear.easeNone});
      TweenMax.to(this.$refs.circlein, time, {drawSVG : "0% 0%", ease : Quad.easeOut, delay:time/2, overwrite:false});
      TweenMax.to(this.$refs.circlein, time*1.5, {rotation:-180, ease : Quad.easeOut, overwrite:false});

      this.$refs.openIcon.style.pointerEvents = "none";
      this.$refs.closeHit.style.pointerEvents = "all";
      TweenMax.set(this.$refs.openIcon.children, {transformOrigin:"0% 50%"});
      TweenMax.to(this.$refs.openIcon.children[0], 0.3, {x : 38, ease : Expo.easeInOut, scaleX : 0});
      TweenMax.to(this.$refs.openIcon.children[1], 0.3, {x : 38, ease : Expo.easeInOut, scaleX : 0, delay:0.05});
      TweenMax.to(this.$refs.openIcon.children[2], 0.3, {x : 38, ease : Expo.easeInOut, scaleX : 0, delay:0.1});


      this.$refs.closeIcon.style.display = "block";
      this.$refs.closeHit.style.display = "block";
      TweenMax.set(this.$refs.closeIcon.children[0], {scaleX : 0});
      TweenMax.set(this.$refs.closeIcon.children[1], {scaleX : 0});


      if(this.ignore){
        this.internalCloseButton = false;
      }else{
        this.internalCloseButton = true;
      }


      TweenMax.fromTo(this.$refs.closeIcon.children[0], 0.3, {scaleX :0}, {scaleX : 0.8,scaleY:0.7, ease : Back.easeOut, delay:0.4});
      TweenMax.fromTo(this.$refs.closeIcon.children[1], 0.3, {scaleX :0}, {scaleX : 0.8,scaleY:0.7, ease : Back.easeOut, delay:0.4, onComplete:this.showCloseParticles});

      TweenMax.fromTo(this.$refs.closeIcon.children[0], 0.4, {y : 0}, {y : -2.5, ease : Back.easeInOut, delay:0.3, overwrite:false});
      TweenMax.fromTo(this.$refs.closeIcon.children[1], 0.4, {y : 0}, {y : 2.5, ease : Back.easeInOut, delay:0.3, overwrite:false, onComplete:this.enableMenu, onCompleteParams:[true]});
    },

    transformInMenuButton () {
      var time = 0.4;
      this.internalCloseButton = false;
      TweenMax.killTweensOf(this.$refs.circleout);
      TweenMax.set(this.$refs.circleout, {drawSVG : "0% 0%", transformOrigin : "50% 50%", rotation :0});
      TweenMax.to(this.$refs.circleout,time/2, {drawSVG : "0% 30%", ease : Linear.easeNone});
      TweenMax.to(this.$refs.circleout, time, {drawSVG : "100% 100%", ease : Quad.easeOut, delay:time/2, overwrite:false});
      TweenMax.to(this.$refs.circleout, time*1.5, {rotation:180, ease : Quad.easeOut, overwrite:false});

      TweenMax.killTweensOf(this.$refs.circlein);
      TweenMax.set(this.$refs.circlein, {drawSVG : "100% 100%", transformOrigin : "50% 50%", rotation :0});
      TweenMax.to(this.$refs.circlein, time/2, {drawSVG : "70% 100%", ease : Linear.easeNone});
      TweenMax.to(this.$refs.circlein, time, {drawSVG : "0% 0%", ease : Quad.easeOut, delay:time/2, overwrite:false});
      TweenMax.to(this.$refs.circlein, time*1.5, {rotation:-180, ease : Quad.easeOut, overwrite:false});

      this.$refs.openIcon.style.pointerEvents = "all";
      this.$refs.closeHit.style.pointerEvents = "none";
      TweenMax.killTweensOf(this.$refs.closeIcon);
      TweenMax.to(this.$refs.closeIcon, 0.5, {rotation : 0, ease : Back.easeOut});
      TweenMax.to(this.$refs.closeIcon.children[0], 0.3, {scaleX : 0, ease : Quint.easeIn, x : 0, y : 0, scaleY : 1});
      TweenMax.to(this.$refs.closeIcon.children[1], 0.3, {scaleX : 0, ease : Quint.easeIn, x : 0, y : 0, scaleY : 1});

      TweenMax.to(this.$refs.openIcon.children[0], 0.3, {x : 0, scaleX : 1, ease : Quint.easeOut, delay:0.5, overwrite:false});
      TweenMax.to(this.$refs.openIcon.children[1], 0.4, {x : 0, scaleX : 1, ease : Quint.easeOut, delay:0.55, overwrite:false, onComplete:this.enableMenu});
      TweenMax.to(this.$refs.openIcon.children[2], 0.3, {x : 0, scaleX : 1, ease : Quint.easeOut, delay:0.6, overwrite:false});
    },


    createEaselContent() {
      createjs.Ticker.setFPS(15);
      createjs.Ticker.addEventListener("tick", this.handleTick);
    },

    handleTick () {
      this.stageLogo.update();

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
        this.enableMenu();
        createjs.Ticker.removeEventListener('tick', this.handleTick);
      }
    },

    overOpenIcon () {
      if(!this.clickEnabled) return;
      TweenMax.set(this.$refs.openIcon.children, {transformOrigin:"50% 50%"});
      TweenMax.staggerTo(this.$refs.openIcon.children, 0.3, {scaleX : 0.8, ease : Back.easeOut}, 0.05);
      createjs.Ticker.setFPS(60);

      var bounds = this.$refs.openIcon.getBoundingClientRect();
      this.particlesOptions.position2d = {x : bounds.left+20, y : bounds.top};
      this.particlesOptions.position = null;

      if(window.environment3d){
        window.environment3d.emmitParticles(this.particlesOptions,20);
      }
    },

    onTapClose(evt){
      if(this.internalCloseButton){
          if(this.$router.currentRoute.path.indexOf("about") > -1){
            this.$router.push('/about/');
          }else if(this.$router.currentRoute.path.indexOf("projects") > -1){
            this.$router.push('/projects/');
          }
        this.internalCloseButton = false;
        return;
      }
      this.closeMenu();
    },

    changeColor(color){
      this.color = color;
      // this.particlesOptions.color = this.particlesCloseOptions.color = MathHelper.hexToDec(color);
    },

    outOpenIcon () {
      if(!this.clickEnabled) return;
      if(this.opened) return;

      TweenMax.set(this.$refs.openIcon.children, {transformOrigin:"50% 50%"});
      TweenMax.staggerTo(this.$refs.openIcon.children, 0.3, {scaleX : 1, ease : Back.easeOut}, 0.05);
    },

    createLogo(){
      this.stageLogo = new createjs.Stage(this.$refs.logoCanvas);

      this.charH = new createjs.Sprite(ContentLoader.SPRITESHEETS.charh);
      this.stageLogo.addChild(this.charH);
      this.charH.visible = true;
      this.charH.gotoAndPlay(1);


      this.charU = new createjs.Sprite(ContentLoader.SPRITESHEETS.charu);
      this.stageLogo.addChild(this.charU);
      this.charU.visible = true;
      this.charU.gotoAndPlay(1);

      this.charI = new createjs.Sprite(ContentLoader.SPRITESHEETS.chari);
      this.stageLogo.addChild(this.charI);
      this.charI.visible = true;
      this.charI.gotoAndPlay(1);

      this.charA = new createjs.Sprite(ContentLoader.SPRITESHEETS.chara);
      this.stageLogo.addChild(this.charA);
      this.charA.visible = true;
      this.charA.gotoAndPlay(1);


      this.charH.y = 0;

      this.charU.x = 40;
      this.charU.y = -5;

      this.charI.x = 40;
      this.charI.y = 40;


      this.charA.x = 80;
      this.charA.y = 40;

      this.charH.scaleX = this.charH.scaleY =
      this.charU.scaleX = this.charU.scaleY =
      this.charI.scaleX = this.charI.scaleY =
      this.charA.scaleX = this.charA.scaleY = 0.5;
      window.charH = this.charH;
      window.charU = this.charU;
      window.charI = this.charI;
      window.charA = this.charA;
    },

    enableIcons () {
      this.clickEnabled = true;
      // TweenMax.to(this.$refs.openIconBg, 2, {opacity : 0.5, yoyo:true, scaleX : 1.5, scaleY : 1.5, repeat : -1, ease : Linear.easeNone, overwrite:false});
    },

    overCloseIcon(){
      if(!this.clickEnabled) return;
      TweenMax.to(this.$refs.closeIcon, 0.5, {rotation : 90, ease : Back.easeOut});
      var time = 0.4;
      TweenMax.killTweensOf(this.$refs.circleout);
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

    outCloseIcon(){
      if(!this.clickEnabled) return;
      TweenMax.to(this.$refs.closeIcon, 0.5, {rotation : 0, ease : Back.easeOut});
    },

    onDownTouch (evt){
      if(!evt.target.classList.contains('close-hit')){
        evt.preventDefault();
      }else{
        this.closeMenu();
        return;
      }

      this.iniMouseY = evt.touches[0].pageY;
      this.moveMouseY = this.iniMouseY;
      this.iniTime = new Date().getTime();
      if(this.$refs.menuItems._gsTransform){
        this.iniPositionY = this.$refs.menuItems._gsTransform.y;
      }else{
        this.iniPositionY = this.posY || 0;
      }

      TweenMax.killTweensOf(this.$refs.menuItems);
      this.$refs.menuGradient.addEventListener('touchmove', this.onMoveTouch);
    },

    onMoveTouch (evt){
      evt.preventDefault();
      this.posY = this.iniPositionY + (evt.touches[0].pageY - this.iniMouseY);
      this.moveMouseY = evt.touches[0].pageY;
      this.direction = (evt.touches[0].pageY - this.iniMouseY) < 0 ? "up" : "down";
      TweenMax.to(this.$refs.menuItems, 1, {y : this.posY, ease : Quint.easeOut, force3D : true, scaleX : 1, scaleY : 1, onUpdate:this.positeElements, onUpdateScope:this});
    },


    onUpTouch (evt){
      if(evt.target.classList.contains('icon-open')
        || evt.target.classList.contains('menu-mask')
        || evt.target.classList.contains('menu-container')
        || evt.target.classList.contains('close-hit')
        || evt.target.tagName.toLowerCase() == "nav") return;


      evt.preventDefault();
      this.$refs.menuContainer.removeEventListener('touchmove', this.onMoveTouch);

      var difpos = Math.abs(this.moveMouseY - this.iniMouseY);
      var difTime = (new Date().getTime() - this.iniTime) / 1000;

      if(difpos < window.innerHeight * 0.15){
        if(isNaN(this.posY)){
          this.posY = 0;
        }

        // this.alignToSection(evt.target);
        this.$router.push(evt.target.attributes.href.value);
      }
    },

    alignToSection(el){
      this.posY += (window.innerHeight/2)-el.getBoundingClientRect().top - (window.innerHeight * 0.075);
      TweenMax.killTweensOf(this.$refs.menuItems);
      TweenMax.to(this.$refs.menuItems, 1, {y : this.posY, ease : Quint.easeOut, force3D : true, scaleX : 1, scaleY : 1,onUpdate:this.positeElements, onUpdateScope:this});
    },

    alignToCurrentRoute(){
      var siteRoute = this.$route.path;
      for(var i = 0; i < this.$refs.menuItems.children.length; i++){
        var el = this.$refs.menuItems.children[i];
        var route = el.children[0].attributes.href.value;
        if(route.indexOf(siteRoute) > -1 && (siteRoute != "/")> -1){
          this.alignToSection(el);
          break;
        }else if(siteRoute == "/" && route == "/"){
          this.alignToSection(el);
          break;
        }
      }
    },


    positeElements (evt){
      var current = 0;
      if(this.$refs.menuItems._gsTransform)
        current = this.$refs.menuItems._gsTransform.y;

      var h = (document.documentElement.clientHeight * 0.15);
      var blockHeight = this.blockHeight;
      var arr = [];
      for(var i = 0; i < this.$refs.menuItems.children.length; i++){
        var el = this.$refs.menuItems.children[i];
        var t = el.getBoundingClientRect().top;
        // TweenMax.killTweensOf(el);
        if(t < 0){
          TweenMax.set(el, {y : "+=" + (this.$refs.menuItems.children.length * blockHeight)});
        }else if(t > blockHeight * (this.$refs.menuItems.children.length+0.5)){
          TweenMax.set(el, {y : "-=" + (this.$refs.menuItems.children.length * blockHeight)});
        }else{
          el.coef = (t - (window.innerHeight/2)) / (window.innerHeight/2);
          arr.push(el);
        }
      }

      arr.sort(function(a, b){return a.coef-b.coef});

      for(var i = 0; i < arr.length; i++){

        if(i == 2){
          arr[i].classList.add('center');

          TweenMax.to(arr[i], 0.5, {opacity : 1, ease : Quint.easeOut});
          TweenMax.to(arr[i].children[1], 0.5, {width : 45, ease : Quint.easeOut});
          TweenMax.to(this.$refs.bgGradient.children[Array.prototype.indexOf.call(this.$refs.menuItems.children, arr[i])], 1, {opacity : 1});

          var path = arr[i].children[0].attributes.href.value.split("/").join("");
          if(path == "" || path == "/")
            path = "home";

          if(!this.colors[path]){
            if(path.indexOf("about") > -1){
              path = "about";
            }else if(path.indexOf("projects") > -1){
              path = "projects";
            }
          }
          this.color = this.colors[path];

        }else{
          arr[i].classList.remove('center');

          TweenMax.to(arr[i], 0.5, {opacity : 0.2, ease : Quint.easeOut});
          TweenMax.to(arr[i].children[1], 0.5, {width : 15, ease : Quint.easeOut});
          TweenMax.to(this.$refs.bgGradient.children[Array.prototype.indexOf.call(this.$refs.menuItems.children, arr[i])], 1, {opacity : 0});
        }
      }
    }
  },

  watch : {
    $route : function(){
      this.closeMenu();
      this.alignToCurrentRoute();
    }
  },

  mounted () {
    this.posY = 0;
    window.mainMenu = this;
    this.createLogo();
    this.createEaselContent();
    TweenMax.set(this.$refs.circleout, {drawSVG:"0% 0%", rotation : 0});
    TweenMax.set(this.$refs.circlein, {drawSVG:"0% 0%", rotation : 0});
    TweenMax.from(this.$refs.openBgMenuContainer, 1, {opacity : 0});
    TweenMax.staggerFromTo(this.$refs.openIcon.children, 0.6, {scaleX : 0, x : -10}, {scaleX : 1, x : 0, ease : Back.easeInOut}, 0.1);
    this.blockHeight = this.$refs.menuItems.children[0].getBoundingClientRect().height;
    this.$refs.menuItems.style.pointerEvents = "none";
    this.$refs.menuMask.style.pointerEvents = "none";
    this.$refs.bgGradientOver.style.pointerEvents = "none";
    this.$refs.bgGradientOver.style.opacity = 0;
    this.$refs.menuItems.style.opacity = 0;

    var dif = this.$refs.menuItems.getBoundingClientRect().top;
    var num = 0;
    for(var i = 0; i < this.$refs.menuItems.children.length; i++){
      var el = this.$refs.menuItems.children[i];
      el.iniY = el.getBoundingClientRect().top;
    }

    this.alignToCurrentRoute();
  }
}
</script>

<style lang="scss" scoped>
div.menu-gradient {
  position : fixed;
  top : 0px;
  width : 100vw;
  height : 80px;
  z-index : 9999999;
  //overflow : hidden;
  //transition : height 1s ease-in-out;

  &.opened {
    height : 100vh;
  }

  a.logo-link {
    display: block;
    width : 100px;
    height : 75px;
    top : 0px;
    right : 0px;
    position : absolute;
    overflow : hidden;
    z-index : 99999;
  }
  canvas.logo-canvas {
    position : absolute;
    background : transparent;
    pointer-events : none;
    transform : scale(0.6);
    top : -30px;
    left : -30px;
    /* temp */
    // display : none;
  }

  div.bg-gradient {
    opacity : 0;
    pointer-events : none;
    position : absolute;
    top : 0px;
    left : 0px;
    width : 100%;
    height : 100%;
    background : #000;

    div.bg-item {
      position : absolute;
      width : 100vw;
      height : 150vh;
      display : block;
      top : 0px;
      left : 0px;

    }
  }

  div.bg-over {
    position : fixed;
    top : 0px;
    left : 0px;
    width : 100%;
    height : 100%;
    background: rgba(0,0,0,1);
    background: -moz-linear-gradient(left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);
    background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(0,0,0,0.9)), color-stop(100%, rgba(0,0,0,0)));
    background: -webkit-linear-gradient(left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);
    background: -o-linear-gradient(left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);
    background: -ms-linear-gradient(left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);
    background: linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#000000', endColorstr='#000000', GradientType=1 );

    div {
      width : 40vw;
      height : 1px;
      background : #ffffff;
      position : absolute;
      opacity : 0;

      &.bar1 {
        top : 30vh;
        transform-origin: top left;
        transform : rotate(-45deg);
        /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#ffffff+0,ffffff+100&1+0,0+100 */
        background: -moz-linear-gradient(left,  rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(left,  rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(to right,  rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#00ffffff',GradientType=1 ); /* IE6-9 */
      }

      &.bar2 {
        top : 90vh;
        right : 0px;
        transform-origin: top right;
        transform : rotate(45deg);
        /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#ffffff+0,ffffff+100&1+0,0+100 */
        background: -moz-linear-gradient(right,  rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(right,  rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(to left,  rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#00ffffff',GradientType=1 ); /* IE6-9 */
      }
    }
  }
}



div.menu-container{
  z-index : 999;
  position : absolute;
  top : 0px;
  left : 0px;
  width : 100vw;
  height : 60px;

  div.open-menu-bg {
    position : absolute;
    width : 40px;
    height : 40px;
    opacity : 0.8;
    background : #ff0000;
    border-radius : 50%;
    filter : blur(20px);
    transition : background-color 0.3s linear;
    left : 50vw;
    top : 50%;
    margin-left : -20px;
    margin-top : -5px;
  }

  a.close-hit{
    position : absolute;
    cursor : pointer;
    width : 40px;
    height : 40px;
    top : 50%;
    margin-top : -10px;
    left : 50vw;
    margin-left : -20px;
    display : none;
  }

  svg {
    width : 45px;
    height : 45px;
    position : absolute;
    top : 50%;
    left : 50%;
    margin-left : -23px;
    margin-top : -13px;
    pointer-events : none;

    circle, path {
      transform-origin: 50% 50%;
    }

  }


  a.icon-close {
    position : absolute;
    width : 30px;
    height : 18px;
    display : none;
    transform-origin : 8px 7px;
    top : 50%;
    left : 50vw;
    margin-left:-9px;
    margin-top : 2px;
    pointer-events: none;


    div.center {
      display : block;
      position : absolute;
      background : #ff0000;
      width : 3px;
      height : 3px;
    }

    div.p {
      position : absolute;
      pointer-events : none;
      background : #8C6EE5;
      top : 0px; left : 0px;
      width : 30px;
      height : 3px;
      transition : background-color 0.3s linear;
      transform-origin : 0px 50%;
      &:not(.p1) {
        transform : rotate(45deg);
      }
      &.p1 {
        top : 12px;
        transform : rotate(-45deg);
      }
    }
  }

  a.icon-open {
    top : 50%;
    position : absolute;
    cursor : pointer;
    width : 40px;
    height : 40px;
    left : 50vw;
    margin-left : -20px;
    margin-top : -10px;
    padding-left : 5px;

    div.p {
      pointer-events : none;

      position : absolute;
      width : 30px;
      height : 3px;
      background : #8C6EE5;
      top : 0px; left : 0px;
      transform-origin: top left;

      transition : background-color 0.3s linear;


      margin-left : 5px;
      margin-top : 12px;

      &.p1 {
        top : 6px;
      }
      &.p2 {
        top : 12px;
      }
    }


  }
  canvas {
    position : absolute;
    pointer-events : none;
    top : -100px;

    /** temp **/
    display : none;
  }

  div.menu-mask {
    position : absolute;
    top : 50vh;
    width : 100vw;
    height : 90vh;
    overflow: hidden;
    margin-top : -45vh;

    -webkit-mask-image: -webkit-gradient(
    linear, left top, left bottom,
    color-stop(0.10,  rgba(0,0,0,0)),
    color-stop(0.20,  rgba(0,0,0,1)),
    color-stop(0.80,  rgba(0,0,0,1)),
    color-stop(0.90,  rgba(0,0,0,0)));
  }



  nav {
    position : absolute;
    top : 0px;
    left : 0px;
    width : 100%;
    visibility: hidden;

    div.menu-block {
      display : block;
      float : left;
      position : relative;
      clear : both;
      width : 100%;
    }

    div.menu-item {
      display : block;
      float : left;
      clear : both;
      position : relative;
      opacity : 1;
      width : 100%;
      height : 15vh;
      cursor : pointer;
      transition : filter 0.3s linear;

      &.center {
        filter : drop-shadow(0px 0px 8px rgba(255,255,255,1));
      }

      a {
        display : block;
        float : left;
        clear : both;
        position : relative;
        color : #fff;
        width : 100%;
        font-size : 4vw;
        font-family: 'open_sansbold', sans-serif;
        text-transform: uppercase;
        letter-spacing: 3vw;
        margin-right : -3vw;
        text-align: center;
        line-height : 15vh;
        padding-left : 3vw;

        & > div {
          pointer-events: none !important;
        }

      }

      div.bar{
        content : "";
        background : #fff;
        width : 15px;
        height : 1px;
        display : block;
        float : left;
        position : absolute;
        pointer-events : none;
        clear: both;

        left : 50vw;
        transform : translateX(-50%);
        bottom : 0px;
        margin-bottom : 4vh;
      }
    }
  }
}
</style>
