import ChatMessageModel from "../core/chat/ChatMessageModel";
import StringsHelper from "../helpers/StringsHelper";
import ContentLoader from './ContentLoader';
import {MessageType,MessageSender,ConversationType,AnswerType} from "../core/constants/ChatConstants";
import {ApiAiClient} from 'api-ai-javascript';
import axios from 'axios';


const client = new ApiAiClient({accessToken: '29202036a0794c5cadf50cd63f2f0a32'});

class ChatLoader {
  static MESSAGES = [];
  static userTyping = null;
  static botTyping = null;

  static currentAnswer = null;
  static lastMessageFromBot = true;

  static conversationType = null;
  static COLLECTED_DATA = {};
  static inputField = null;

  static REQUIRED_DATA = {
    RESUME : [AnswerType.NAME, AnswerType.EMAIL, AnswerType.RESUME, AnswerType.PORTFOLIO],
    CONTACT : [AnswerType.NAME, AnswerType.EMAIL, AnswerType.MESSAGE, AnswerType.RECIPIENT]
  }

  static ASNEIRA_COUNTER = 0;





  static initialize(callback, input){
    // create hello
    this.sendBotMessage(ContentLoader.getRandomMessage(ContentLoader.DATA_TEXTS.contact.hello).title, MessageType.TEXT);

    this.callback = callback;
    this.inputField = input;

    // this.callback();

    var self = this;

    this.timeout = setTimeout(()=>{
      self.showBotDelayedMessage(ContentLoader.getRandomMessage(ContentLoader.DATA_TEXTS.contact.introduction).title, MessageType.TEXT, 1000, this.callback);
    }, 1000);


    window.ChatLoader = this;
  }

  static setInput(input){
    this.inputField = input;
  }

  static destroy () {
    clearTimeout(this.timeout);
  }

  static sendBotMessage(message, type){
    var model = new ChatMessageModel();
    model.sender = MessageSender.BOT;
    model.type = type;
    model.content = message;
    this.MESSAGES.push(model);

    this.lastMessageFromBot = true;
  }

  static setResumeFile(data){
    this.COLLECTED_DATA.RESUME = data.newfile;
    this.sendUserMessage(data.file.name, MessageType.TEXT, false);
  }

  static sendUserMessage(message, type, ignore){
    if(this.userTyping)
      this.stopUserTyping();

    if(!this.lastMessageFromBot)
      return;

    this.inputField.inputEnabled = false;
    this.lastMessageFromBot = false;




    var model = new ChatMessageModel();
    model.sender = MessageSender.USER;
    model.type = (type) ? type : MessageType.TEXT;
    model.content = message;
    this.MESSAGES.push(model);


    if(this.currentAnswer != null){
      this.treatDirectResponse(message, ignore);
      return;
    }

    this.startBotTyping();

    var self = this;
    client.textRequest(message)
    .then((response) => {
      self.treatResult(response.result);
    })
    .catch((error) => {
      self.treatError(error);
    })
  }


  static treatResult(data){
    this.stopBotTyping();

    if(data.source == "agent"){
      if(data.action == "input.unknown" ||
      data.action == "huiabot.hello"){

        this.sendBotMessage(data.fulfillment.speech, MessageType.TEXT);
        this.inputField.inputEnabled = true;
      }else if(data.action == ""){
        this.sendBotMessage(data.fulfillment.speech, MessageType.TEXT);
        this.inputField.inputEnabled = true;

        if(this.conversationType == null){
          this.showBotDelayedMessage(ContentLoader.getRandomMessage(ContentLoader.DATA_TEXTS.contact.introduction).title, MessageType.TEXT, 2500, this.enableInput);
          this.inputField.inputEnabled = false;
        }else{
          this.sendSeriousBotDelayedMessage();
        }
      }else if(data.action == "input.name"){

        this.COLLECTED_DATA.NAME = data.parameters["given-name"].replace(".","");
        this.sendBotMessage(data.fulfillment.speech, MessageType.TEXT);
        this.inputField.inputEnabled = true;

      }else if(data.action == "input.resume"){
        this.conversationType = ConversationType.RESUME;

        this.sendBotMessage(data.fulfillment.speech, MessageType.TEXT);
        this.sendSeriousBotDelayedMessage();

      }else if(data.action == "input.talk"){
        this.conversationType = ConversationType.CONTACT;

        if(data.actionIncomplete){
          this.sendBotMessage(data.fulfillment.speech, MessageType.TEXT);
          this.inputField.inputEnabled = true;
        }else{
          if(data.parameters.recipient){
            this.COLLECTED_DATA.RECIPIENT = data.parameters.recipient;
          }

          this.sendSeriousBotMessage();
        }


      }
    }else if(data.source == "domains"){
      this.ASNEIRA_COUNTER++;

      if(this.ASNEIRA_COUNTER < 20){
        this.sendBotMessage(data.fulfillment.speech, MessageType.TEXT);

        if(this.conversationType == null){
          this.showBotDelayedMessage(ContentLoader.getRandomMessage(ContentLoader.DATA_TEXTS.contact.introduction).title, MessageType.TEXT, 1000, this.enableInput);
          this.inputField.inputEnabled = false;
        }else{
          this.sendSeriousBotDelayedMessage();
        }
      }else{
        this.sendSeriousBotMessage();
        this.inputField.inputEnabled = true;
      }
    }
  }


  static treatDirectResponse(message, ignore){
    if(!ignore){
      if(this.currentAnswer.toLowerCase() === AnswerType.EMAIL){
        if(!StringsHelper.validateEmail(message)){
          this.showBotDelayedMessage(ContentLoader.getRandomMessage(ContentLoader.DATA_TEXTS.contact.validateemail).title, MessageType.TEXT, 30, this.enableInput);
          this.sendSeriousBotDelayedMessage(600);
        }else{
          this.COLLECTED_DATA[this.currentAnswer.toUpperCase()] = message;
          this.sendSeriousBotDelayedMessage(500);
        }
      }else if(this.currentAnswer.toLowerCase() === AnswerType.PORTFOLIO){
        if(!StringsHelper.validateUrl(message)){
          this.showBotDelayedMessage(ContentLoader.getRandomMessage(ContentLoader.DATA_TEXTS.contact.validateurl).title, MessageType.TEXT, 30, this.enableInput);
          this.sendSeriousBotDelayedMessage(600);
        }else{
          this.COLLECTED_DATA[this.currentAnswer.toUpperCase()] = message;
          this.sendSeriousBotDelayedMessage(500);
        }
      }else{

        if(this.currentAnswer.toUpperCase() != "RESUME")
          this.COLLECTED_DATA[this.currentAnswer.toUpperCase()] = message;

        this.sendSeriousBotDelayedMessage(500);
      }
    }

  }

  static treatError(data){

  }

  static enableInput(){
    this.inputField.inputEnabled = true;
  }

  static sendSeriousBotDelayedMessage(del, cb){
    this.startBotTyping();
    var self = this;
    this.timeout = setTimeout(()=>{
      self.stopBotTyping();
      self.sendSeriousBotMessage();

      if(cb){
        cb();
      }
    },del);
  }
  static sendSeriousBotMessage(){
    if(this.currentAnswer == "CONFIRMATION"){
      var msg = (this.conversationType == ConversationType.CONTACT) ? ContentLoader.getRandomMessage(ContentLoader.DATA_TEXTS.contact.confirmation_contact).title : ContentLoader.getRandomMessage(ContentLoader.DATA_TEXTS.contact.confirmation_resume).title;

      if(this.conversationType == ConversationType.CONTACT){
        msg = msg.replace("$name", this.COLLECTED_DATA.NAME);
        msg = msg.replace("$email", this.COLLECTED_DATA.EMAIL);
        msg = msg.replace("$recipient", this.COLLECTED_DATA.RECIPIENT);
        msg = msg.replace("$message", this.COLLECTED_DATA.MESSAGE);
      }else if(this.conversationType == ConversationType.RESUME){
        msg = msg.replace("$name", this.COLLECTED_DATA.NAME);
        msg = msg.replace("$email", this.COLLECTED_DATA.EMAIL);
        msg = msg.replace("$resume", this.COLLECTED_DATA.RESUME);
        msg = msg.replace("$portfolio", this.COLLECTED_DATA.PORTFOLIO);
      }

      this.currentAnswer = AnswerType.CONFIRMATION;
      this.sendBotMessage(msg, MessageType.TEXT);
      return;
    }

    var arrBase = (this.conversationType == ConversationType.CONTACT) ? this.REQUIRED_DATA.CONTACT : this.REQUIRED_DATA.RESUME;
    var remaining = [];

    for(var i = 0; i < arrBase.length; i++){
      var str = arrBase[i].toString().replace("Symbol(","").replace(")","")
      if(this.COLLECTED_DATA[str.toUpperCase()] == null){
        remaining.push(str);
      }
    }

    if(remaining.length > 0){
      this.currentAnswer = remaining[0];
      this.inputField.answerType = this.currentAnswer;
      this.sendBotMessage(ContentLoader.getRandomMessage(ContentLoader.DATA_TEXTS.contact[remaining[0].toLowerCase()]).title, MessageType.TEXT);
      this.inputField.inputEnabled = true;
    }else{
      this.currentAnswer = "CONFIRMATION";
      this.inputField.answerType = this.currentAnswer;
      this.inputField.inputEnabled = false;
      var self = this;
      this.sendSeriousBotDelayedMessage(1000, ()=>{
        self.inputField.inputEnabled = true;
      });
    }

  }

  static resetChat(cb){
    for(var i = this.MESSAGES.length; i >= 0; i--){
      this.MESSAGES.pop();
    }


    var self = this;

    clearTimeout(this.timeout);

    this.sendBotMessage(ContentLoader.getRandomMessage(ContentLoader.DATA_TEXTS.contact.hello).title, MessageType.TEXT);
    this.timeout = setTimeout(()=>{
      self.showBotDelayedMessage(ContentLoader.getRandomMessage(ContentLoader.DATA_TEXTS.contact.introduction).title, MessageType.TEXT, 1000, cb);
      //self.inputField.inputEnabled = true;
    }, 1000);

    this.COLLECTED_DATA = [];
    this.conversationType = null;
    this.inputField.inputEnabled = false;
    this.inputField.answerType = "text";
    this.currentAnswer = null;
  }

  static sendForm(){
    this.inputField.inputEnabled = false;
    this.sendBotMessage(ContentLoader.DATA_TEXTS.sending, MessageType.TEXT);
    var self = this;

    var data = {
      contactType : this.conversationType.toString().replace("Symbol(","").replace(")","").toLowerCase()
    };

    for(var s in this.COLLECTED_DATA){
      data[s.toLowerCase()] = this.COLLECTED_DATA[s];
    }


    this.startBotTyping();

    axios.post(ContentLoader.getApiUrl() + 'contact/send', data)
    .then(function (response) {
      self.timeout = setTimeout(()=>{
        self.stopBotTyping();
        self.sendBotMessage(ContentLoader.DATA_TEXTS.sendingSuccess, MessageType.TEXT);
        self.inputField.setFinish();
        self.inputField.inputEnabled = true;
      },400);
    })
    .catch(function (error) {
      self.timeout = setTimeout(()=>{
        self.stopBotTyping();
        self.sendBotMessage(ContentLoader.DATA_TEXTS.generalError, MessageType.TEXT);
      },400);
      self.inputField.inputEnabled = true;
    });
  }

  static startUserTyping(){
    if(this.userTyping) return;

    var model = new ChatMessageModel();
    model.sender = MessageSender.USER;
    model.type = MessageType.TYPING;
    this.MESSAGES.push(model);

    this.userTyping = model;
  }

  static stopUserTyping(){
    if(!this.userTyping) return;
    this.MESSAGES.splice(this.MESSAGES.indexOf(this.userTyping),1);
    this.userTyping = null;
  }

  static startBotTyping(){
    if(this.botTyping) return;

    var model = new ChatMessageModel();
    model.sender = MessageSender.BOT;
    model.type = MessageType.TYPING;
    this.MESSAGES.push(model);

    this.botTyping = model;
  }

  static stopBotTyping(){
    if(!this.botTyping) return;
    this.MESSAGES.splice(this.MESSAGES.indexOf(this.botTyping),1);
    this.botTyping = null;
  }

  static showBotDelayedMessage(message, type, del, cb){
    this.startBotTyping();
    var delay = del;
    if(!del){
      delay = ((message.length * 100) + 1000) || delay;
    }

    var self = this;
    this.timeout = setTimeout(() => {
      this.stopBotTyping();

      self.sendBotMessage(message,type);

      this.lastMessageFromBot = true;

      if(cb){
        TweenMax.to(this, 0.6, {onComplete:cb, onCompleteScope:self});
        // self.callback();
      }
    }, delay);
  }
}


export default ChatLoader;
