<template>
  <div v-bind:class="{'menu-gradient' : true, 'opened' : opened}" ref="menuGradient">
    <div class="bg-gradient" ref="bgGradient"></div>
    <router-link :to="'/'"><canvas ref="logoCanvas" width="200" height="200" class="logo-canvas"></canvas></router-link>
    <div class="menu-container" ref="menuContainer">
      <nav ref="menuItems">
        <div class="menu-item" v-for='item in this.model' key=item.slug>
          <router-link :to="'/'+item.slug">{{item.title}}</router-link>
          <div class="bar"></div>
        </div>
      </nav>
      <canvas ref="thunderCanvas" width="200" height="200"></canvas>
      <div class="open-menu-bg-container" ref="openBgMenuContainer"><div class="open-menu-bg" ref="openIconBg" v-bind:style="{backgroundColor : this.color}"></div></div>
      <a class="icon-open" ref="openIcon" v-on:mouseover="overOpenIcon" v-on:touchstart="overOpenIcon" v-on:mouseout="outOpenIcon" v-on:touchend="outOpenIcon" v-on:click="openMenu" v-touch:tap="openMenu">
        <div class="p" v-bind:style="{backgroundColor : this.color}"></div><div class="p p1" v-bind:style="{backgroundColor : this.color}"></div><div class="p p2" v-bind:style="{backgroundColor : this.color}"></div>
      </a>
      <svg viewBox="0 0 50 50" ref="closeIconBg">
        <circle ref="circleout" cx="25" cy="25" r="21" v-bind:stroke="this.color" onerror=""stroke-width="1" fill="transparent" />
        <circle ref="circlein" cx="25" cy="25" r="22" v-bind:stroke="this.color" stroke-width="1" fill="transparent" />
      </svg>
      <a class="icon-close" ref="closeIcon">
        <div class="p" v-bind:style="{backgroundColor : this.color}"></div><div class="p p1" v-bind:style="{backgroundColor : this.color}"></div>
      </a>
      <a class="close-hit" ref="closeHit" v-on:mouseover="overCloseIcon" v-on:mouseout="outCloseIcon" v-on:click="closeMenu" v-touch:tap="closeMenu">
      </a>
    </div>
  </div>
</template>

<script>

import VueRouter from 'vue-router';
import ContentLoader from '../../loaders/ContentLoader';
import MathHelper from '../../helpers/MathHelper';
import '../../vendors/easeljs';
import '../../vendors/easeljswebgl';
import '../../vendors/SplitText.min.js';
import * as THREE from 'three';

export default {
  name : "MainMenu",

  data () {
    return {
      clickEnabled : false,
      opened : false,
      model : ContentLoader.DATA_MENU,
      color : "#8C6EE5"
    }
  },

  methods : {
    openMenu (evt) {
      if(!this.clickEnabled) return;

      if(evt.type == "tap"){
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
      }

      this.opened = true;
      this.clickEnabled = false;
      this.$refs.openIcon.style.pointerEvents = "none";
      this.$refs.closeHit.style.cursor = "default";
      this.$refs.closeHit.style.pointerEvents = "all";
      this.$refs.closeHit.style.cursor = "pointer";

      TweenMax.to(this.$refs.bgGradient, 1, {opacity : 1});

      TweenMax.killTweensOf(this.$refs.menuItems);
      this.$refs.menuItems.style.opacity = 1;
      this.$refs.menuItems.style.pointerEvents = "all";

      TweenMax.set(this.$refs.openIcon.children, {transformOrigin:"0% 50%"});

      if(!window.MOBILE_DETECT.mobile()){
        TweenMax.to(this.$refs.menuContainer, 1, {x : 20, ease : Expo.easeInOut});
        TweenMax.to(this.$refs.logoCanvas, 1, {x : 150, ease : Expo.easeInOut});
        TweenMax.to(this.$refs.openBgMenuContainer, 0.4, {x : 150, ease : Back.easeIn});

        TweenMax.to(this.$refs.openIcon.children[1], 0.5, {x : 110, ease : Expo.easeInOut, scaleX : 0});
        TweenMax.to(this.$refs.openIcon.children[0], 0.4, {x : 120, ease : Back.easeIn, scaleX : 1.2});
        TweenMax.to(this.$refs.openIcon.children[2], 0.4, {x : 120, ease : Back.easeIn, scaleX : 1.2});
        TweenMax.to(this.$refs.openIcon.children[0], 0.3, {x : 155, ease : Back.easeOut, scaleX : 0, overwrite:false, delay:0.4});
        TweenMax.to(this.$refs.openIcon.children[2], 0.3, {x : 155, ease : Back.easeOut, scaleX : 0, overwrite:false, delay:0.4});
      }else{
        // TweenMax.to(this.$refs.openIcon.children[0], 0.4, {x : -5, ease : Back.easeOut, scaleX : 1});
        // TweenMax.to(this.$refs.openIcon.children[2], 0.4, {x : -5, ease : Back.easeOut, scaleX : 1});
        TweenMax.to(this.$refs.openIcon.children[0], 0.3, {x : 38, ease : Expo.easeInOut, scaleX : 0});
        TweenMax.to(this.$refs.openIcon.children[1], 0.3, {x : 38, ease : Expo.easeInOut, scaleX : 0, delay:0.05});
        TweenMax.to(this.$refs.openIcon.children[2], 0.3, {x : 38, ease : Expo.easeInOut, scaleX : 0, delay:0.1});
      }




      this.$refs.closeIcon.style.display = "block";
      this.$refs.closeHit.style.display = "block";
      TweenMax.set(this.$refs.closeIcon.children[0], {scaleX : 0});
      TweenMax.set(this.$refs.closeIcon.children[1], {scaleX : 0});


      TweenMax.fromTo(this.$refs.closeIcon.children[0], 0.3, {scaleX :0}, {scaleX : 0.8,scaleY:0.7, ease : Back.easeOut, delay:0.4});
      TweenMax.fromTo(this.$refs.closeIcon.children[1], 0.3, {scaleX :0}, {scaleX : 0.8,scaleY:0.7, ease : Back.easeOut, delay:0.4, onComplete:this.showCloseParticles});

      TweenMax.fromTo(this.$refs.closeIcon.children[0], 0.4, {y : 0}, {y : -2.5, ease : Back.easeInOut, delay:0.3, overwrite:false});
      TweenMax.fromTo(this.$refs.closeIcon.children[1], 0.4, {y : 0}, {y : 2.5, ease : Back.easeInOut, delay:0.3, overwrite:false, onComplete:this.enableMenu, onCompleteParams:[true]});

      this.$refs.menuItems.style.display = "block";
      TweenMax.staggerFromTo(this.$refs.menuItems.getElementsByClassName("bar"), 1, {scaleY : 0}, {scaleY:1, x : 0, ease : Back.easeOut, delay: 0.5}, 0.1);

      for(var i = 0; i < this.splits.length; i++){
        TweenMax.staggerFromTo(this.splits[i].chars, 0.5, {x : -30, opacity : 0}, {x : 0, opacity : 1, ease : Quint.easeOut, delay : 0.5+(i * 0.1)}, 0.02);
      }
    },

    enableMenu(opening){
      this.clickEnabled = true;

      if(opening){
        this.particlesCloseOptions.position = null;
        var el = this.$refs.closeIcon.getBoundingClientRect();
        this.particlesCloseOptions.position2d = {x : el.left+20, y : el.top};

        if(window.environment3d){
          window.environment3d.emmitParticles(this.particlesCloseOptions,15);
        }
      }
    },


    closeMenu(evt){
      if(!this.clickEnabled) return;
      if(!this.opened) return;


      if(evt){
        if(evt.type == "tap"){
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
        }
      }

      this.clickEnabled = false;
      this.opened = false;

      TweenMax.to(this.$refs.bgGradient, 1, {opacity : 0});
      this.$refs.openIcon.style.pointerEvents = "all";
      this.$refs.closeHit.style.cursor = "pointer";
      this.$refs.closeHit.style.pointerEvents = "none";
      this.$refs.closeHit.style.cursor = "default";
      this.$refs.menuItems.style.pointerEvents = "none";
      TweenMax.to(this.$refs.menuItems, 0.4, {opacity : 0});

      TweenMax.killTweensOf(this.$refs.closeIcon);
      TweenMax.to(this.$refs.menuContainer, 1, {x : 0, ease : Expo.easeInOut});
      TweenMax.to(this.$refs.logoCanvas, 1, {x : 0, ease : Expo.easeInOut});
      TweenMax.to(this.$refs.closeIcon, 0.5, {rotation : 0, ease : Back.easeOut});
      TweenMax.to(this.$refs.closeIcon.children[0], 0.3, {scaleX : 0, ease : Quint.easeIn, x : 0, y : 0, scaleY : 1});
      TweenMax.to(this.$refs.closeIcon.children[1], 0.3, {scaleX : 0, ease : Quint.easeIn, x : 0, y : 0, scaleY : 1});

      if(!window.MOBILE_DETECT.mobile()){
        TweenMax.to(this.$refs.openIcon.children[0], 0.3, {scaleX : 1, x : 130, ease : Linear.easeNone, delay:0.2});
        TweenMax.to(this.$refs.openIcon.children[2], 0.3, {scaleX : 1, x : 130, ease : Linear.easeNone, delay:0.2});
        TweenMax.to(this.$refs.openIcon.children[0], 0.3, {x : 0, ease : Quint.easeOut, delay:0.5, overwrite:false});
        TweenMax.to(this.$refs.openIcon.children[2], 0.3, {x : 0, ease : Quint.easeOut, delay:0.5, overwrite:false});
        TweenMax.to(this.$refs.openIcon.children[1], 0.4, {x : 0, scaleX : 1, ease : Quint.easeOut, delay:0.5, overwrite:false, onComplete:this.enableMenu});
      }else{
        TweenMax.to(this.$refs.openIcon.children[0], 0.3, {x : 0, scaleX : 1, ease : Quint.easeOut, delay:0.5, overwrite:false});
        TweenMax.to(this.$refs.openIcon.children[1], 0.4, {x : 0, scaleX : 1, ease : Quint.easeOut, delay:0.55, overwrite:false, onComplete:this.enableMenu});
        TweenMax.to(this.$refs.openIcon.children[2], 0.3, {x : 0, scaleX : 1, ease : Quint.easeOut, delay:0.6, overwrite:false});
      }

      if(!window.MOBILE_DETECT.mobile()){
        TweenMax.to(this.$refs.openBgMenuContainer, 0.3, {x : 0, ease : Quint.easeOut, delay : 0.5});
      }
    },


    createEaselContent() {
      this.stage = new createjs.Stage(this.$refs.thunderCanvas);
      this.spritesheet = ContentLoader.SPRITESHEETS.thunderbolt;
      this.thunderbolt = new createjs.Sprite(this.spritesheet);
      this.stage.addChild(this.thunderbolt);


      this.thunderbolt.regY = 25;
      this.thunderbolt.y = 25;
      this.thunderbolt.rotation = 45;

      // this.thunderbolt.on('animationend', () => {
      //   this.thunderbolt.stop();
      //   createjs.Ticker.setFPS(30);
      //   this.enableIcons();
      // });


      this.thunderbolt.gotoAndPlay(0);
      createjs.Ticker.setFPS(15);
      createjs.Ticker.addEventListener("tick", this.handleTick);
    },

    handleTick () {
      if(this.thunderbolt){
        this.stage.update();
        if(this.thunderbolt.currentFrame == this.thunderbolt.spriteSheet._frames.length-1){
          this.thunderbolt.stop();
          this.thunderbolt.visible = false;
          createjs.Ticker.setFPS(30);

          this.enableIcons();
          this.createLogo();

          this.stage.removeChild(this.thunderbolt);
          this.stage.update();
          this.thunderbolt = null;
          this.stage = null;
        }
      }else{
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
          createjs.Ticker.removeEventListener('tick', this.handleTick);
        }
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

    changeColor(color){
      this.color = color;
      this.particlesOptions.color = this.particlesCloseOptions.color = MathHelper.hexToDec(color);
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
      TweenMax.to(this.$refs.openIconBg, 2, {opacity : 0.5, yoyo:true, scaleX : 1.5, scaleY : 1.5, repeat : -1, ease : Linear.easeNone, overwrite:false});
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

      this.particlesCloseOptions.position = null;
      var el = this.$refs.closeIcon.getBoundingClientRect();
      this.particlesCloseOptions.position2d = {x : el.left+20, y : el.top};

      if(window.environment3d)
        window.environment3d.emmitParticles(this.particlesCloseOptions,15);
    },

    outCloseIcon(){
      if(!this.clickEnabled) return;
      TweenMax.to(this.$refs.closeIcon, 0.5, {rotation : 0, ease : Back.easeOut});
    },

    overMenuItem (evt) {
      var target = evt.target;

      if(target.tagName.toLowerCase() == "a")
        target = evt.target.parentNode;

      TweenMax.to(target, 0.3, {opacity : 1});

      for(var i = 0; i < this.$refs.menuItems.children.length; i++){
        var el = this.$refs.menuItems.children[i];

        if(el != target){
          TweenMax.to(el, 0.3, {opacity : 0.15});
        }
      }
    },

    outMenuItem (evt) {
      for(var i = 0; i < this.order.length; i++){
        // var el = this.$refs.menuItems.children[i];
        // TweenMax.to(this.order[i], 0.3, {opacity : 1-Math.abs((2-i)*0.35)});
        if(2-i == 0){
          TweenMax.to(this.order[i], 0.3, {opacity : 1});
        }else{
          TweenMax.to(this.order[i], 0.3, {opacity : 0.3});
        }
        // }else{
        //   TweenMax.to(this.order[i], 0.3, {opacity : 0.2});
        // }
      }
    },

    alignToCurrentSection () {
      if(window.MOBILE_DETECT.mobile()) return;
      var route = this.$route.path;
      var indx = 0;
      for(var i =0 ; i < this.order.length; i++){
        if(route.indexOf(this.order[i].children[0].attributes.href.value) > -1){
          indx = i;
          break;
        }
      }

      var dif = 2 - indx;
      for(var i =0 ; i < this.order.length; i++){
        // if(this.order[i]._gsTransform){
          TweenMax.to(this.order[i], 1, { y : this.order[i]._gsTransform.y + dif * 40, onUpdate:this.updateRotationPositions, onUpdateParams:[this.order[i]], ease : Back.easeInOut});
        // }else{

          // TweenMax.to(this.order[i], 1, { y : (i*40) + dif * 40, onUpdate:this.udpateRotationPositions, onUpdateParams:[this.order[i]], ease : Quint.easeInOut});
        // }
      }
      this.order.rotate(-dif);


      this.outMenuItem();
    },

    updateRotationPositions (el) {
      var tw = TweenMax.getTweensOf(el);
      //var final = tw[0].vars.css.y;
      var current = el._gsTransform.y;

      if(current > 160 && tw[0].vars.css.y > 160){
        el._gsTransform.y -= this.order.length * 40;
        tw[0].updateTo({css:{y : tw[0].vars.css.y-200}},false);
      }
      if(current < 0 && tw[0].vars.css.y < 0){
        el._gsTransform.y += this.order.length * 40;
        tw[0].updateTo({css:{y : tw[0].vars.css.y+200}},false);
      }
    }
  },

  watch : {
    $route : function(){
      this.closeMenu();
      this.alignToCurrentSection();
    }
  },

  mounted () {
    window.mainMenu = this;
    this.createEaselContent();
    TweenMax.set(this.$refs.circleout, {drawSVG:"0% 0%", rotation : 0});
    TweenMax.set(this.$refs.circlein, {drawSVG:"0% 0%", rotation : 0});
    TweenMax.from(this.$refs.openBgMenuContainer, 1, {opacity : 0});
    TweenMax.staggerFromTo(this.$refs.openIcon.children, 0.6, {scaleX : 0, x : -10}, {scaleX : 1, x : 0, ease : Back.easeInOut}, 0.1);

    var els = this.$refs.menuItems.getElementsByTagName("a");
    this.order = [];

    this.splits = [];
    for(var i =0 ; i < els.length; i++){
      var split = new SplitText(els[i], {type : "chars", position : "absolute", charsClass : "disabled"});
      split.chars.reverse();
      this.splits.push(split);

      els[i].parentNode.addEventListener("mouseover", this.overMenuItem);
      els[i].parentNode.addEventListener("mouseout", this.outMenuItem);

      els[i].parentNode.style.position = "absolute";
      els[i].parentNode.style.top = "0px";

      if(window.MOBILE_DETECT.mobile()){
        // TweenMax.set(els[i].parentNode, {y : Math.round(i * 20)+"vh"});
      }else{
        TweenMax.set(els[i].parentNode, {y : Math.round(i * 40)});
      }
      this.order.push(els[i].parentNode);
    }


    if(!window.MOBILE_DETECT.mobile()){
      TweenMax.set(this.$refs.menuItems, {y : -Math.round((els.length*40)/2)});
    }
    this.$refs.menuItems.style.pointerEvents = "none";
    this.$refs.menuItems.style.opacity = 0;
    this.position = 0;
    this.alignToCurrentSection();
    // this.openMenu();

    this.particlesOptions = {
			positionRandomness: 1,
			velocityRandomness: .1,
      velocity : new THREE.Vector3(0,0.3,0),
			color: 0x8C6EE5,
			colorRandomness: 0,
			turbulence: .01,
			lifetime: 1,
			size: 7*(2/window.devicePixelRatio),
			sizeRandomness: 2
		};

    this.particlesCloseOptions = {
			positionRandomness: 1,
			velocityRandomness: .1,
      velocity : new THREE.Vector3(0.3,0,0),
			color: 0x8C6EE5,
			colorRandomness: 0,
			turbulence: .01,
			lifetime: 2,
			size: 15*(2/window.devicePixelRatio),
			sizeRandomness: 2
		};
  }
}
</script>

<style lang="scss" scoped>
div.menu-gradient {
  position : absolute;
  top : 0px;
  width : 5vw;
  height : 100%;

  canvas.logo-canvas {
    position : absolute;
    background : transparent;
    left : 20px;
    top : 30px;
  }

  div.bg-gradient {
    opacity : 0;
    pointer-events : none;
    position : absolute;
    top : 0px;
    left : 0px;
    width : 35vw;
    height : 100%;
    background: rgba(0,0,0,1);
    background: -moz-linear-gradient(left, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0) 100%);
    background: -webkit-gradient(left top, left bottom, color-stop(50%, rgba(0,0,0,0.9)), color-stop(100%, rgba(0,0,0,0)));
    background: -webkit-linear-gradient(left, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0) 100%);
    background: -o-linear-gradient(left, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0) 100%);
    background: -ms-linear-gradient(left, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0) 100%);
    background: linear-gradient(to bottom, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#000000', endColorstr='#000000', GradientType=1 );
  }
}
div.menu-container{
  z-index : 999;
  position : absolute;
  top : 50%;

  div.open-menu-bg {
    position : absolute;
    width : 40px;
    height : 40px;
    left : 45px;
    top : -24px;
    opacity : 0.8;
    background : #ff0000;
    border-radius : 50%;
    filter : blur(20px);
    transition : background-color 0.3s linear;
  }

  a.close-hit{
    position : absolute;
    cursor : pointer;
    width : 30px;
    height : 18px;
    top : -9px;
    left : 206px;
    display : none;
  }

  svg {
    position : absolute;
    top : -24px;
    left : 182px + 10px;
    width : 45px;
    height : 45px;

    circle, path {
      transform-origin: 50% 50%;
    }
  }


  a.icon-close {
    position : absolute;
    width : 30px;
    height : 18px;
    top : -9px;
    left : 206px;
    display : none;
    transform-origin : 8px 7px;


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
    left : 50px;
    top : -9px;
    position : absolute;
    cursor : pointer;
    width : 30px;
    height : 18px;

    div.p {
      pointer-events : none;

      position : absolute;
      width : 30px;
      height : 3px;
      background : #8C6EE5;
      top : 0px; left : 0px;
      transform-origin: top left;

      transition : background-color 0.3s linear;

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
  }
  nav {
    position : absolute;
    top : 0px;
    left : 0px;
    transform : translateY(-50%);

    div.menu-item {
      display : block;
      float : left;
      clear : both;
      position : relative;
      opacity : 0.5;
      width : 180px;
      height : 40px;
      cursor : pointer;

      a {
        display : block;
        float : left;
        clear : both;
        position : relative;
        color : #fff;
        width : 180px;
        font-size : 10px;
        font-family: 'open_sanssemibold', sans-serif;
        text-transform: uppercase;
        letter-spacing: 15px;
        text-align: right;
        line-height : 40px;
        & > div {
          pointer-events: none !important;
        }
      }

      div.bar{
        content : "";
        background : #fff;
        width : 1px;
        height : 15px;
        display : inline-block;
        float : left;
        position : absolute;
        top : 50%;
        margin-top : -8px;
        right : -5px;
        pointer-events : none;
      }
    }
  }
}



@media screen and (max-width : 1000px){
  div.menu-gradient {
    width : 100vw;
    height : 80px;
    z-index : 9999999;
    &.opened {
      height : 100vh;
    }
    canvas.logo-canvas {
      display : none;
    }

    div.bg-gradient {
      width : 100%;
      height : 100%;
    }
  }
  div.menu-container{
    top : 0px;
    left : 0px;
    width : 100vw;
    height : 80px;

    div.open-menu-bg {
      left : 50vw;
      top : 50%;
      margin-left : -20px;
      margin-top : -15px;
    }

    a.close-hit{
      width : 40px;
      height : 40px;
      top : 50%;
      margin-top : -20px;
      left : 50vw;
      margin-left : -20px;
      display : none;
    }

    svg {
      position : absolute;
      top : 50%;
      left : 50%;
      margin-left : -23px;
      margin-top : -23px;
      pointer-events : none;

      circle, path {
        transform-origin: 50% 50%;
      }
    }


    a.icon-close {
      top : 50%;
      left : 50vw;
      margin-left:-9px;
      margin-top : -8px;
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
      left : 50vw;
      top : 50%;
      margin-left : -20px;
      margin-top : -20px;
      width : 40px;
      height : 40px;
      padding-left : 5px;
      div.p {
        margin-left : 5px;
        margin-top : 12px;
        transition : background-color 0.3s linear;
      }


    }
    canvas {
      display : none;
    }
    nav {
      position : absolute;
      top : 80px;
      left : 0px;
      transform : none;
      width : 100%;
      height : calc(100vh - 80px);
      display: block;

      div.menu-item {
        display : block;
        float : left;
        clear : both;
        position : relative;
        opacity : 0.5;
        width : 100%;
        height : 10vh;
        cursor : pointer;

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
          text-align: center;
          line-height : 10vh;
          & > div {
            pointer-events: none !important;
          }
        }

        div.bar{
          display : none;
          content : "";
          background : #fff;
          width : 1px;
          height : 15px;
          display : block;
          float : left;
          position : absolute;
          top : 50%;
          margin-top : -8px;
          right : -5px;
          pointer-events : none;
        }
      }
    }
  }
}
</style>
