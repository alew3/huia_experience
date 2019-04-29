import Messages from './Messages';
import MultiplayerContainer from './MultiplayerContainer';
import Globals from "../../../core/Globals";

export default class Multiplayer {

  //
  constructor (scene, birdBase, namesContainer) {
    this.scene = scene;
    this.birdBase = birdBase;
    this.namesContainer = namesContainer;
    this.connected = false;
    this.connectionId = null;
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    this.connection = new WebSocket(window.WS_URL + "?userName="+Globals.USER_DATA.userName+"&userCity="+Globals.USER_DATA.userCity+"&userCountry="+Globals.USER_DATA.userCountry);
    this.connection.onopen = this.onOpenedConnection.bind(this);
    this.connection.onmessage = this.onMessageFromServer.bind(this);
  }

  destroy () {
    console.log("destroy Multiplayer");
    this.connection.close();
    this.connection = null;
    this.container = null;
  }

  sendUserPosition(position,rotation){
    if(this.connection.readyState != 1) return;
    if(!this.connectionId) return;
    var obj = {
      type : Messages.UPDATING_POSITION,
      position : position,
      connectionId : this.connectionId,
      rotation : rotation
    }
    this.connection.send(JSON.stringify(obj));
  }


  // events
  onOpenedConnection(){
    this.connected = true;
  }

  onMessageFromServer(data){
    var data = JSON.parse(data.data);

    if(data.type == Messages.INFORM_CONNECTION_ID){
      this.connectionId = data.id;

      this.container = new MultiplayerContainer(this.connectionId, this.scene, this.birdBase, this.namesContainer);
      this.scene.add(this.container);
    }else if(data.type == Messages.UPDATED_POSITIONS){
      if(this.container)
      this.container.updateBirds(data.data);
    }else if(data.type == Messages.JOINED){
      // if(this.container)
      // this.container.addBird(data.data);
    }else if(data.type == Messages.LEFT){
      if(this.container)
      this.container.removeBird(data.data);
    }

  }
}
