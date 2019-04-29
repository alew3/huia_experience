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
  <section id="contact" ref="container" v-on:mousemove="onMouseMove">
    <div class="content" ref="content">
      <ContactChat />
      <ChatUserInput ref="field" v-if="this.firstDataCompleted" enabled="this.inputEnabled" v-on:focusIn="onFocusIn" v-on:focusOut="onFocusOut"/>
    </div>
    <SocialButtons />
    <div class="address" ref="address">Coronel Lucas de Oliveira,  894<br/>Porto alegre - Rs - Brazil<br/>+55 (51) 3079.5252<br/>contato@huia.com.br</div>
  </section>
</transition>
</template>

<script>
import ChatUserInput from './contact/ChatUserInput';
import ContactChat from './contact/ContactChat';
import SocialButtons from './contact/SocialButtons';
import ChatLoader from "../loaders/ChatLoader";
import '../vendors/ScrambleTextPlugin';

export default {
  data () {
    return {
      firstDataCompleted : false
    }
  },

  components : {
    'ChatUserInput' : ChatUserInput,
    'ContactChat' : ContactChat,
    'SocialButtons' : SocialButtons
  },

  methods : {
    endInitialize() {
      this.firstDataCompleted = true;
    },

    beforeEnter () {

    },

    onFocusIn(evt){
      if(!window.MOBILE_DETECT.mobile()) return;
      if(window.MOBILE_DETECT.is('iphone') || window.MOBILE_DETECT.is('ipad')) return;

      this.$refs.address.style.display = "none";
      window.sectionTitle.$refs.container.style.display = "none";
    },

    onFocusOut(evt){
      this.$refs.address.style.display = "block";
      window.sectionTitle.$refs.container.style.display = "block";
    },

    enter (el,done) {

    },

    afterEnter () {

    },

    enterCancelled () {

    },

    beforeLeave () {
    },

    leave(el, done){
      TweenMax.to(this.$refs.container, 0.5, {opacity : 0, onComplete:done});
    },

    afterLeave() {

    },

    leaveCancelled() {

    },

    onMouseMove (evt){
      // console.log(evt.clientY);
      // TweenMax.to(this.$refs.content, 1, {rotationX : (evt.clientY / window.innerHeight)*30});
    }
  },

  mounted () {
    window.huiaPrerenderReady = true;
    ChatLoader.initialize(this.endInitialize);
    TweenMax.fromTo(this.$refs.address, 1, {opacity : 0},{opacity:0.6, delay : 1, ease : Linear.easeNone});
    this.split

    if(window.environment3d){
      window.environment3d.setBlur(true,true);
    }

    if(window.mainMenu){
      window.mainMenu.changeColor("#8C6EE5");
    }else{
      TweenMax.to(this, 1, {onComplete:()=>{window.mainMenu.changeColor("#8C6EE5");}});
    }
    // TweenMax.to(this.$refs.content, 2, {rotationY: -35, x: -100, z : 800, ease : Quint.easeOut});
  }
}
</script>

<style lang="scss" scoped>
  section#contact {
    position : absolute;
    top : 0px;
    left : 0px;
    width : 100vw;
    height : 100vh;
    padding-left : 0px;

    // perspective: 3000px;
    div.address {
      position : absolute;
      right : 100px;
      text-align: right;
      font-family: 'open_sansextrabold';
      text-transform: uppercase;
      color : #8f6fd5;
      top : 40px;
      opacity : 0.5;
      letter-spacing: 5px;
      font-size : 10px;
      line-height: 20px;
      user-select : auto;

      &::selection {
        color : #fff;
        background : #ffffff;
      }
    }


    div.content {
      width : 50vw;
      left : 50%;
      position : absolute;
      max-width : 500px;
      display : block;
      float : left;
      transform : translateX(-50%);
    }
  }


  @media screen and (max-width : 1000px){
    section#contact {
      height : 100%;

      div.address{
        // display: none;
        z-index : 999;
        bottom : auto;
        position : absolute;
        top : 73vh;
        right : 5vw;
        letter-spacing: 0px;
        position : fixed;
        font-size : 2.5vw;
        letter-spacing: 1vw;
        line-height: 5vw;
      }

      // perspective: 3000px;
      div.content {
        width : 80vw;
        left : 2vw;
        max-width : none;
        transform : none;
      }
    }
  }
</style>
