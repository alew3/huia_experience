<template>
  <div class="chat-container" ref="chatContainer">
    <ul class="chat-content" id="chat-content" ref="chatContent">
      <li v-for="(item,index) in messages" key="index">
          <BotTextMessage v-if="item.sender == messageSender.BOT && item.type == messageTypes.TEXT" v-bind:text="item.content" />
          <UserTextMessage v-if="item.sender == messageSender.USER && item.type == messageTypes.TEXT" v-bind:text="item.content" />
          <BotTyping v-if="item.sender == messageSender.BOT && item.type == messageTypes.TYPING" />
          <UserTyping v-if="item.sender == messageSender.USER && item.type == messageTypes.TYPING" />
      </li>
    </ul>
  </div>
</template>

<script>
import BotTextMessage from './messages/BotTextMessage';
import UserTextMessage from './messages/UserTextMessage';
import BotTyping from './messages/BotTyping';
import UserTyping from './messages/UserTyping';
import ChatLoader from '../../loaders/ChatLoader';
import {MessageType,MessageSender} from '../../core/constants/ChatConstants';


export default {
  data() {
    return{
      messages : ChatLoader.MESSAGES,
      messageSender : MessageSender,
      messageTypes : MessageType
    }
  },

  components : {
    'BotTextMessage' : BotTextMessage,
    'UserTextMessage' : UserTextMessage,
    'BotTyping' : BotTyping,
    'UserTyping' : UserTyping
  },

  methods : {
    checkPosition(){
      // this.$refs.chatScroller.style.height = this.$refs.chatContent.clientHeight + "px";
      // this.$refs.chatScroller.style.top = this.$refs.chatContainer.offsetHeight + "px";
    }
  },


  destroyed(){
    ChatLoader.MESSAGES = [];
    ChatLoader.destroy();
  },

  updated() {
    this.checkPosition();
  },

  mounted() {
    window.contactChat = this;
    this.checkPosition();
  }
}
</script>

<style lang="scss" scoped>
  div.chat-container {
    display : block;
    float : left;
    position : relative;
    height : 75vh;
    width : 100%;
    -webkit-mask-image: -webkit-gradient(linear, left 3%, left 25%, from(rgba(0,0,0,0)), to(rgba(0,0,0,1)));

    &::-webkit-scrollbar              { background : transparent; width : 5px; margin-left : 10px;}
    &::-webkit-scrollbar-button       { display: none; }
    &::-webkit-scrollbar-track        { background : transparent;}
    &::-webkit-scrollbar-track-piece  { background : transparent;}
    &::-webkit-scrollbar-thumb        { background : rgba(255,255,255,0.1); border-radius : 30px; position : relative; left : 10px; }
    &::-webkit-scrollbar-corner       { background : transparent; }
    &::-webkit-resizer                { background : transparent; }

    div.chat-scroller {
      position : relative;
      width : 100%;
      height : 100%;
      display : block;
    }

    ul.chat-content{
      position : absolute;
      bottom : 0px;
      width : 100%;
      padding-right : 30px;
    }
  }

@media screen and (max-width : 1000px){
  div.chat-container {
    height : 55vh;

    ul.chat-content{
      overflow:auto;
      max-height : 40vh;
      padding-bottom:8px;
    }
  }
}
</style>
