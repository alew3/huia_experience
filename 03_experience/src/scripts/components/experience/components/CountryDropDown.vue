<template lang="html">
  <div class="country-container" ref="container" v-on:mousemove="onMouseMove">
    <div v-bind:class="{'selected' : true, 'no-item' : this.selectedItem==null}" v-on:click="openClose" ref="selected">{{placeholder}}
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 401.998 401.998" style="enable-background:new 0 0 401.998 401.998;" xml:space="preserve">
      	<g><path d="M73.092,164.452h255.813c4.949,0,9.233-1.807,12.848-5.424c3.613-3.616,5.427-7.898,5.427-12.847    c0-4.949-1.813-9.229-5.427-12.85L213.846,5.424C210.232,1.812,205.951,0,200.999,0s-9.233,1.812-12.85,5.424L60.242,133.331    c-3.617,3.617-5.424,7.901-5.424,12.85c0,4.948,1.807,9.231,5.424,12.847C63.863,162.645,68.144,164.452,73.092,164.452z" fill="#933EC5"/><path d="M328.905,237.549H73.092c-4.952,0-9.233,1.808-12.85,5.421c-3.617,3.617-5.424,7.898-5.424,12.847    c0,4.949,1.807,9.233,5.424,12.848L188.149,396.57c3.621,3.617,7.902,5.428,12.85,5.428s9.233-1.811,12.847-5.428l127.907-127.906    c3.613-3.614,5.427-7.898,5.427-12.848c0-4.948-1.813-9.229-5.427-12.847C338.139,239.353,333.854,237.549,328.905,237.549z" fill="#933EC5"/></g>
      </svg>
    </div>
    <div class="deg-top" ref="degTop" v-if="!isMobile"></div>
    <div class="list" ref="list" v-if="!isMobile">
      <div class="list-item" v-on:click="selectItem(item)" v-for="item in data" v-bind:data-code="item.code">{{item.name}}</div>
    </div>
    <div class="deg-bottom" ref="degBottom" v-if="!isMobile"></div>
    <select v-if="isMobile" ref="select" v-on:change="onChangeSelect">
      <option v-for="(item,i) in data" v-bind:value="i">{{item.name}}</option>
    </select>
  </div>
</template>

<script>
import ContentLoader from '../../../loaders/ContentLoader';
import LanguageHelper from '../../../helpers/LanguageHelper';

export default {
  methods : {
    openCombo() {
      this.opened = true;
      this.$refs.container.style.borderRadius = "20px";
      this.$refs.container.style.position = "absolute";
      TweenMax.to(this.$refs.container, 0.5, {height : this.openedHeight, top : -Math.round((this.openedHeight-40)/2), ease : Expo.easeInOut});
      TweenMax.to(this.$refs.list, 0.5, {x : 0, ease : Quad.easeOut});
      TweenMax.to(this.$refs.selected, 0.5, {x : -190, ease : Quad.easeOut});
      this.$refs.degTop.style.display = "block";
      this.$refs.degBottom.style.display = "block";
      TweenMax.fromTo([this.$refs.degTop,this.$refs.degBottom], 0.3, {opacity : 0}, {opacity : 1, delay : 0.5});

      window.clearInterval(this.interval);
      this.interval = setInterval(this.updatePosition, 10);

      document.addEventListener('keydown', this.onKeyChar);
      document.addEventListener('click', this.onClickDocument);
      this.$refs.container.addEventListener("mousewheel", this.onWheel, false);
    	this.$refs.container.addEventListener("DOMMouseScroll", this.onWheel, false);
    },
    close () {
      this.opened = false;
      if(this.isMobile) return;
      window.clearInterval(this.interval);
      TweenMax.to(this.$refs.container, 0.3, {height : 40,top : 0, borderRadius : 50, ease : Quint.easeIn});
      TweenMax.to(this.$refs.list, 0.6, {left : 190, ease : Quint.easeInOut});
      TweenMax.to(this.$refs.selected, 0.6, {x : 0, ease : Quint.easeInOut});
      this.$refs.degTop.style.display = "none";
      this.$refs.degBottom.style.display = "none";
      document.removeEventListener('keydown', this.onKeyChar);
      document.removeEventListener('click', this.onClickDocument);
      this.$refs.container.removeEventListener("mousewheel", this.onWheel, false);
    	this.$refs.container.removeEventListener("DOMMouseScroll", this.onWheel, false);
    },

    updatePosition(){
      this.posY += this.difY;
      this.posY = Math.min(this.posY,30);
      this.posY = Math.max(this.openedHeight - this.$refs.list.getBoundingClientRect().height - 30, this.posY);
      TweenMax.to(this.$refs.list, 0.5, {y : this.posY, left : 0, roundProps:"y", ease : Quad.easeOut});
    },

    selectItem(item){
      this.selectedItem = item;
      this.placeholder = this.selectedItem.name;
      this.close();
    },

    onClickDocument(evt){
      var limits = this.$refs.container.getBoundingClientRect();
      if(evt.clientX < limits.left ||
        evt.clientY < limits.top ||
        evt.clientX > limits.left + limits.width ||
        evt.clientY > limits.top + limits.height){
          this.close();
        }
    },

    onWheel(evt){
      evt.preventDefault();

      if(!this.opened)
        return;

      var num = evt.deltaY;
      if(evt.type == "DOMMouseScroll"){
        num = evt.detail;
      }

      TweenMax.killTweensOf(this);

      this.difY = -num/20;
      TweenMax.to(this, 0.5, {difY : 0});
    },

    onKeyChar(evt){
      if(!this.opened) return;

      var t = new Date().getTime();


      if((t - this.lastCharTime) / 1000 < 0.5)
        this.charsWord += evt.key.toLowerCase();
      else
        this.charsWord = evt.key.toLowerCase();


      this.lastCharTime = t;
      for(var i = 0; i < this.data.length; i++){
        if(this.data[i].name.substr(0,this.charsWord.length).toLowerCase() == this.charsWord.toLowerCase()){
            this.posY = -i * 30;
            this.difY = 0;
            this.updatePosition();
            return;
        }
      }
    },

    onChangeSelect (evt){
      this.selectItem(this.data[this.$refs.select.value]);
    },

    onMouseMove(evt){
      if(this.opened){
        var posy = evt.clientY - this.$refs.container.getBoundingClientRect().top;
        var coef = posy / this.openedHeight;

        if(coef < 0.3){
          this.difY = ((0.3-coef)/0.3) * 10;
        }else if(coef > 0.7){
          this.difY = -((coef-0.7)/0.3)*10;
        }else{
          this.difY = 0;
        }
      }
    },

    openClose (evt) {
      evt.preventDefault();

      if(this.opened)
        this.close();
      else
        this.openCombo();
    }
  },


  data () {
    return {
      isMobile : window.MOBILE_DETECT.mobile(),
      data : ContentLoader.DATA_COUNTRIES,
      opened : false,
      selectedItem : null,
      openedHeight : 400,
      placeholder : (LanguageHelper.LANGUAGE == 'pt_br') ? "selecione seu país" : "select your country...",
    }
  },

  beforeDestroy () {
    window.clearInterval(this.interval);
    document.removeEventListener('keydown', this.onKeyChar);
    document.removeEventListener('click', this.onClickDocument);
  },

  mounted () {
    this.posY = 0;
    this.difY = 0;
    this.lastCharTime = 0;
    this.charsWord = "";
    this.onKeyChar = this.onKeyChar.bind(this);
    this.onClickDocument = this.onClickDocument.bind(this);
    this.onWheel = this.onWheel.bind(this);
  }
}
</script>

<style lang="scss" scoped>
  div.country-container {
    display : inline-block;
    z-index: 999;
    float : left;
    position : relative;
    width : 180px;
    overflow : hidden;
    border : 2px solid #8f6fd5;
    padding : 0px 0px;
    margin-top : 20px;
    border-radius: 50px;
    height : 40px;
    background : rgba(10,10,20,0.9);
    margin-left : 10px;
    transition : border-color 0.3s linear;
    -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);
    select {
      position : absolute;
      top : 0px;
      left : 0px;
      opacity : 0;
      width : 100%;
      height : 40px;
    }
    div.selected {
      font-family: 'open_sansbold', sans-serif;
      color : #8f6fd5;
      outline : none;
      border : none;
      background : none;
      transition : background 0.1s linear;
      width : 180px;
      display : block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      font-size : 10px;
      line-height: 36px;
      padding : 0px 14px;
      padding-right: 35px;
      letter-spacing: 1px;

      cursor : pointer;

      &.no-item {
        color : #777;
      }

      svg {
        width : 15px;
        height : 15px;
        position : absolute;
        top : 11px;
        right : 10px;

        path {
          fill : #8f6fd5;
        }
      }

      &:hover {
        background : rgba(255,255,255,0.1);
      }
    }
    div.deg-top {
      position : absolute;
      top : 0px;
      left : 0px;
      width : 100%;
      height : 40px;
      pointer-events: none;
      display: none;
      z-index: 9;
      background: -moz-linear-gradient(top, rgba(10,10,20,1) 0%, rgba(10,10,20,0) 100%); /* FF3.6-15 */
      background: -webkit-linear-gradient(top, rgba(10,10,20,1) 0%,rgba(10,10,20,0) 100%); /* Chrome10-25,Safari5.1-6 */
      background: linear-gradient(to bottom, rgba(10,10,20,1) 0%,rgba(10,10,20,0) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#0a0a14', endColorstr='#000a0a14',GradientType=0 );
    }

    div.deg-bottom {
      position : absolute;
      bottom : 0px;
      left : 0px;
      width : 100%;
      height : 40px;
      pointer-events : none;
      display: none;
      background: -moz-linear-gradient(bottom, rgba(10,10,20,1) 0%, rgba(10,10,20,0) 100%); /* FF3.6-15 */
      background: -webkit-linear-gradient(bottom, rgba(10,10,20,1) 0%,rgba(10,10,20,0) 100%); /* Chrome10-25,Safari5.1-6 */
      background: linear-gradient(to top, rgba(10,10,20,1) 0%,rgba(10,10,20,0) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#0a0a14', endColorstr='#000a0a14',GradientType=0 );
    }
    div.list {
      position : absolute;
      top : 0px;
      left : 190px;
      top : 0px;
      padding : 8px 0px;

      div.list-item {
        font-family: 'open_sansbold', sans-serif;
        color : #8f6fd5;
        outline : none;
        border : none;
        background : none;

        width : 190px;
        display : block;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size : 10px;
        line-height: 30px;
        padding : 0px 14px;
        letter-spacing: 1px;

        cursor : pointer;
        transition : padding-left 0.1s ease-out, background 0.5s ease-out;

        &:hover {
          background : rgba(255,255,255,0.1);
          padding-left : 16px;
        }
      }
    }
  }


  @media screen and (max-width : 1000px){
    div.country-container {
      margin-left : 0px;
    }
  }
</style>
