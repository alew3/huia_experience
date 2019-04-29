<template lang="html">
  <div class="navigator-container" ref="container">
    <div class="center-bar" ref="centerbar"></div>
    <div class="bullets" ref="bullets">
      <div class="bullet" v-for="(item, index) in this.items" key="index"></div>
    </div>
    <div class="debugrect" ref="debugrect"></div>
  </div>
</template>

<script>
export default {
  props:{
    listWidth : 0
  },

  data () {
    return{
      windowWidth : window.innerWidth,
      posx : 0,
      items : null,
      draggerWidth : 0
    }
  },

  watch : {
    windowWidth () {
      this.updateDraggerWidth();
    },

    listWidth () {
      this.updateDraggerWidth();
    }
  },

  methods : {
    getRef(id){
      return "el"+id;
    },
    createBullets (items,positions, listwidth, listheight) {
      this.items = items;
      this.positions = positions;
      this.listwidth = listwidth;
      this.listheight = listheight;

      if(this.$refs.bullets.children.length){
        this.updatePositions();
      }else{
        this.first = true;
      }
    },


    updateDraggerWidth() {
    },


    onOverDragger (evt){

    },

    onOutDragger(evt){

    },

    updatePositions () {
      if(this.$refs.bullets.children.length){
        for(var i = 0; i < this.$refs.bullets.children.length; i++){
          var el = this.$refs.bullets.children[i];
          var posy = (this.positions[i].y/this.listheight)*42;
          var posx = ((this.positions[i].x/this.listwidth)*264);
          posx += 30;
          TweenMax.set(el, {x : posx-3, y : posy-3});
          TweenMax.fromTo(el, 1, {scaleX : 0, scaleY : 0}, {scaleX : 1, scaleY : 1, ease : Back.easeOut, delay:i*0.01});

          this.positions[i].x = posx;
          this.positions[i].y = posy;
        }
      }
    },

    updateScrollPosition(posx, width){
      this.auxx = posx;
      this.auxw = width;
      var w = Math.round(224 * (1/width));
      var x = -posx * (posx/(width-1));
      var realx =  30 - (x * (240 * (1/width)));
      this.$refs.debugrect.style.width = w + "px";
      this.$refs.debugrect.style.left = realx + "px";

      for(var i = 0; i < this.$refs.bullets.children.length; i++){
        var el = this.$refs.bullets.children[i];
        var posx = this.positions[i].x;
        var difleft = posx - realx;
        var difright = posx - (realx + w);
        var difcenter = posx - (realx + (w/2));

        if(difleft < 0){
          var filter = Math.abs(difleft * 0.05);
          filter = Math.min(2,filter);
          var scale = 1+(filter/3);
          scale = Math.max(1,scale);
          scale = Math.min(2,scale);
          var op = 0.5-(filter/5);
          TweenMax.to(el, 1, {x : this.positions[i].x + difleft*0.2, scaleX : scale, scaleY : scale, opacity : op, ease : Quint.easeOut, force3D : true});
          el.style.webkitFilter = "blur("+filter+"px)";
          el.style.filter = "blur("+filter+"px)";
          el.style.boxShadow = "none";
        }
        else if(difright > 0){
          var filter = Math.abs(difright * 0.05);
          filter = Math.min(2,filter);
          var scale = 1+(filter/3);
          var op = 0.5-(filter/6);
          scale = Math.max(1,scale);
          scale = Math.min(2,scale);
          TweenMax.to(el, 1, {x : this.positions[i].x + difright*0.2, scaleX : scale, scaleY : scale, opacity : op, ease : Quint.easeOut, force3D : true});
          el.style.webkitFilter = "blur("+filter+"px)";
          el.style.filter = "blur("+filter+"px)";
          el.style.boxShadow = "none";
        }else{
          el.style.webkitFilter = "none";
          el.style.filter = "none";
          el.style.boxShadow = "0px 0px 6px rgba(255,255,255,0.5)";
          TweenMax.to(el, 1, {x : posx, scaleX : 1, scaleY : 1, opacity : 1, ease : Quint.easeOut, force3D : true});
        }

        TweenMax.to(this.$refs.bullets, 1, {x : x*30, ease : Quint.easeOut});
      }
    }


  },

  updated(){
    this.updatePositions();


    if(this.first){
      this.first = false;
      this.updateScrollPosition(0, this.auxw);
    }
  },


  beforeDestroy() {
    TweenMax.killTweensOf(this.$refs.container);
    TweenMax.killChildTweensOf(this.$refs.container);
  },

  mounted () {
    this.windowWidth = window.innerWidth;

    TweenMax.fromTo(this.$refs.container, 0.5, {opacity :0},{opacity :1, ease : Quint.easeInOut, delay:1});
  }
}
</script>

<style lang="scss" scoped>
 div.navigator-container {
   position : absolute;
   display : block;
   float : left;
   bottom : 10px;
   left : 50%;
   margin-left : -140px;
   width : 280px;
   height : 66px;

   div.center-bar {
     width : 281px;
     height : 1px;
     /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#619892+0,619892+12,619892+90,619892+100&0.4+0,1+12,1+90,0.4+100 */
      background: -moz-linear-gradient(left, rgba(97,152,146,0) 0%, rgba(97,152,146,1) 12%, rgba(97,152,146,1) 90%, rgba(97,152,146,0) 100%); /* FF3.6-15 */
      background: -webkit-linear-gradient(left, rgba(97,152,146,0) 0%,rgba(97,152,146,1) 12%,rgba(97,152,146,1) 90%,rgba(97,152,146,0) 100%); /* Chrome10-25,Safari5.1-6 */
      background: linear-gradient(to right, rgba(97,152,146,0) 0%,rgba(97,152,146,1) 12%,rgba(97,152,146,1) 90%,rgba(97,152,146,0) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#66619892', endColorstr='#66619892',GradientType=1 ); /* IE6-9 */
     top : 20px;
     display : block;
     opacity : 0.15;
     transform-origin: 0px 0px;
     position : absolute;
   }

   div.debugrect{
     position : absolute;
     top : 0px;
     left : 0px;
     width : 10px;
     height : 66px;
     background : rgba(0,0,255,0);
   }

   div.bullets {
     position : absolute;
     top : 0px;
     left : 0px;

     div.bullet {
       background : #7bc2b4;
       width : 6px;
       height : 6px;
       position : absolute;
       display : block;
       transform : rotate(45deg);
      //  border-radius: 50%;
     }
   }

 }
</style>
