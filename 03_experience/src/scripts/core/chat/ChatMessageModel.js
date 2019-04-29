import {MessageType,MessageSender} from '../constants/ChatConstants';

export default class ChatMessageModel {
  get type() {
    return this._type;
  }

  set type(tp){
    this._type = tp;

    if(tp == MessageType.EMOJI)
      this.isEmoji = true;
  }
  constructor(sender,type,content){
    this.sender = sender;
    this.type = type;
    this.content = content;
  }
}
