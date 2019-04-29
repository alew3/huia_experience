class UserGestures {
  static MOUSE_MOVE = "neckMove";
  static FLAP_WINGS = "flapWings";
  static FLY  = "fly";
  static LAND = "land";
  static SCRATCH_RIGHT = "scratchRight";
  static SCRATCH_LFET = "scratchLeft";
  static SHORT_JUMP = "shortJump";
  static LONG_JUMP = "longJump";
}

import Globals from '../../../core/Globals';
import dat from '../../../vendors/dat.gui';
import SpitText from "../../../vendors/SplitText.min";
import MathHelper from "../../../helpers/MathHelper";
import SoundsLoader from '../../../loaders/SoundsLoader';

import { EventBus } from '../../../core/event-bus.js';

let lastPlay = new Date();


export default class UserGesturesManager  {



  constructor(environment){
    this.environment = environment;

    this.enabled = true;
    this.clickCounter = 0;
    this.DELAY_FOR_CLICKS = 1.4;
    this.randomIdleObject = {time : 0};
    this.createListeners();

    this.raycaster = new THREE.Raycaster();

    this.particlesOptions = {
      positionRandomness: 4,
      // color: 0xffffff,
      color: 0x8C6EE5,
      colorRandomness: .1,
      velocity : new THREE.Vector3(0,0.03,0),
      velocityRandomness:0.1,
      turbulence: .1,
      lifetime: 4,
      size: 4*(2/window.devicePixelRatio),
      tex : 'particle2.png',
      sizeRandomness: 1
    };

    this.interactions = [{num : 0, type : "single"},{num : 1, type : "single"},{num : 2, type : "single"},{num : 3, type : "single"},{num : 4, type : "single"},{num : 5, type : "single"},{num : 4, type : "double"}];
    this.interactions = this.shuffle(this.interactions);
    this.lastInteractionTime = new Date().getTime();
    this.initIdleRandom(true);

    EventBus.$on('move-head', head => {
      //console.log(`Oh, that's nice. It's gotten ${head.x} clicks! :)`)
      head.x = (head.x/600) * window.innerWidth;
      head.y = (head.y/400) * window.innerHeight;

      let evt = {'clientX' : head.x, 'clientY': head.y, 'target.id':'home'};
      this.onMouseMove(evt);
    });

    EventBus.$on('pose-activation', pose => { 
      //console.log("capture animation event", pose);
      if (pose!="normal" && (Date.now() - lastPlay > 3000)) {
        lastPlay = Date.now();
        switch (pose) {
          case "dramatic":
            this.environment.huiaScene.dramatic();
            break;
          case "radouken": // ERRADO..
            this.environment.huiaScene.hadouken();
            break;
          case "backpack":
            this.environment.huiaScene.backpack();
            break;
          case "moonwalk":
            this.environment.huiaScene.moonwalk();
            break;
          // case "piscada":
          //   this.environment.huiaScene.piscada();
          //   break;
          case "fly":
            this.performFlap();
            break;
          case "wings":
            this.environment.huiaScene.piscada();
            break;
          case "underarm":
            this.environment.huiaScene.piscada();
            break;
          case "normal":
            // do nothing
        }
      };
    });

    // EventBus.$on('jump', head =>  {
    //   //console.log(`Oh, that's nice. It's gotten ${head.x} clicks! :)`)
    //   this.environment.huiaScene.shortJump();
    // });
  }

  


  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  initIdleRandom(first){
    TweenMax.to(this.interactions, ((first) ? 15 : (10+Math.random()*2)), {onComplete:this.initIdleRandom, onCompleteScope:this});

    if(first){
      return;
    }

    var dif = (new Date().getTime() - this.lastInteractionTime)/1000;

    if(dif < 3 || this.environment.blurred || this.environment.huiaScene.bird.flying){
      return;
    }

    if(this.lastInteraction == null){
      this.lastInteraction = -1;
    }

    this.lastInteraction++;

    if(this.lastInteraction > this.interactions.length - 1)
      this.lastInteraction = 0;

    var interaction = this.interactions[this.lastInteraction];
    this.lastHover = "hover" + interaction.num;

    if(interaction.type == "single")
      this.performSingleClick();
    else
      this.performDoubleClick();
  }

  disable(){
    if(this.splits){
      for(var i =0 ; i < this.splits.length; i++){
        TweenMax.killTweensOf(this.splits[i].chars);
        this.splits[i].revert()
      }
      this.splits = null;
    }

    this.disabled = true;
  }

  enable () {
    this.disabled = false;

    if(this.environment.huiaScene.bird.flying){
      this.environment.huiaScene.land();
      this.end3dCursor();
    }
  }
  performDoubleClick (posx,posy) {
    if(this.environment.huiaScene.bird.flying){
      this.environment.huiaScene.land();
      this.end3dCursor();
      return;
    }

    if(this.environment.huiaScene.bird.mouseBlocked)
      return;



    this.lastInteractionTime = new Date().getTime();
    window.hideText();
    // perna esquerda
    if(this.lastHover == "hover4"){
        this.environment.huiaScene.longJump();
        SoundsLoader.playSound("longjump",false,0.5,0);
        TweenMax.to(this.environment.huiaScene.cameraContainer.position, 1.3, {y : 18, ease : Quad.easeInOut});
        TweenMax.to(this.environment.huiaScene.cameraContainer.position, 1, {y : 5, ease : Quad.easeOut, delay : 1.3, overwrite:false});
        this.end3dCursor();
    }
    // asa
    else if(this.lastHover == "hover3"){
        this.environment.huiaScene.fly();
        this.hideHover();
        this.ini3DCursor(posx,posy);
        this.showLandCursor();
    }else{
      this.performSingleClick();
    }
  }


  getIntersectObjects(position){
    var mouse = {};
    mouse.x = ( position.x / window.innerWidth ) * 2 - 1;
    mouse.y = - ( position.y / window.innerHeight ) * 2 + 1;

    this.raycaster.setFromCamera(mouse, this.environment.huiaScene._camera);
    var intersect = this.raycaster.intersectObjects(this.environment.huiaScene.bird.children,true);

    for(var i = 0; i < intersect.length; i++){
      if(intersect[i].object.name){
        if(intersect[i].object.name.indexOf("hover") > -1){
          return intersect[i];
        }
      }
    }
    return null;
  }


  hideHover(){
    bird.pointLight.hide = true;
    this.lastHover = null;
    TweenMax.to(this.environment.huiaScene.bird.pointLight, 0.5, {intensity : 0, distance : 40});
    TweenMax.to(this.environment.huiaScene.bird.pointLightDirectional, 0.5, {intensity : 0});

    if(!this.cursor3dEnabled && !this.environment.huiaScene.bird.flying)
      document.body.style.cursor = "auto";
  }

  performSingleClick(posx,posy) {


    if(this.environment.huiaScene.bird.flying){
      this.environment.huiaScene.land();
      this.end3dCursor();
      return;
    }

    if(this.environment.huiaScene.bird.mouseBlocked)
      return;

    window.hideText();
    var difTime = this.endClickTime - this.startClickTime;

    this.lastInteractionTime = new Date().getTime();
    // perna esquerda
    if(this.lastHover == "hover4"){
      if(!this.lastLegRight){
        this.lastLegRight = true;
        SoundsLoader.playSound("rightpaw",false,0.5,0);
        this.environment.huiaScene.bird.playAnimation(2,false);
      }else{
        this.lastLegRight = false;
        SoundsLoader.playSound("leftpaw",false,0.5,0);
        this.environment.huiaScene.bird.playAnimation(3,false);
      }
    }
    // perna direita
    else if(this.lastHover == "hover2"){
        SoundsLoader.playSound("shortjump",false,0.5,0);
        this.environment.huiaScene.shortJump();
        TweenMax.to(this.environment.huiaScene.cameraContainer.position, 1, {y : 8, ease : Quad.easeInOut});
        TweenMax.to(this.environment.huiaScene.cameraContainer.position, 1, {y : 5, ease : Quad.easeOut, delay : 1, overwrite:false});
    }
    // barriga
    else if(this.lastHover == "hover1"){
      // if(!this.cursor3dEnabled) return;
       this.performFlap();
    }
    // asa
    else if(this.lastHover == "hover3"){
        SoundsLoader.playSound("scratch", false, 0.5, 0);
        this.environment.huiaScene.bird.playAnimation(11,false);
    }
    // cabeca
    else if(this.lastHover == "hover0"){
      SoundsLoader.playSound("goandback", false, 0.5, 0);
      this.environment.huiaScene.bird.jumpToSide();
    }
    // rabo
    else if(this.lastHover == "hover5"){
      SoundsLoader.playSound("turn", false, 0.5, 0);
      TweenMax.to(this.environment.huiaScene._camera.position, 1.3, {z : 5, ease : Quad.easeOut});
      TweenMax.to(this.environment.huiaScene._camera.position, 1, {z : 0, ease : Quad.easeOut, delay : 3, overwrite:false});
      this.environment.huiaScene.bird.lookBack();
    }

    this.hideHover();

    // if(difTime < 500){
    //
    //   if(this.isInLegLimits(this.clickPosition)){
    //     this.performLegsAnimations(this.clickPosition);
    //   }else if(this.isInWingLimits(this.clickPosition)){
    //     SoundsLoader.playSound("scratch", false, 0.5, 0);
    //     this.environment.huiaScene.bird.playAnimation(11,false);
    //   }else{
    //     this.end3dCursor();
    //   }
    // }
    //
    // if(difTime < this.DELAY_FOR_CLICKS*1000){
    //   if(!this.cursor3dEnabled) return;
    //   this.performFlap();
    //   this.end3dCursor();
    //   return;
    // }
    //
    // if(!this.cursor3dEnabled) return;
    //
    // if(difTime < this.DELAY_FOR_CLICKS*2000){
    //   SoundsLoader.playSound("shortjump",false,0.5,0);
    //   this.environment.huiaScene.shortJump();
    //   TweenMax.to(this.environment.huiaScene.cameraContainer.position, 1, {y : 8, ease : Quad.easeInOut});
    //   TweenMax.to(this.environment.huiaScene.cameraContainer.position, 1, {y : 5, ease : Quad.easeOut, delay : 1, overwrite:false});
    //   this.end3dCursor();
    // }else if(difTime < this.DELAY_FOR_CLICKS*3000){
    //   this.environment.huiaScene.longJump();
    //   SoundsLoader.playSound("longjump",false,0.5,0);
    //   TweenMax.to(this.environment.huiaScene.cameraContainer.position, 1.3, {y : 18, ease : Quad.easeInOut});
    //   TweenMax.to(this.environment.huiaScene.cameraContainer.position, 1, {y : 5, ease : Quad.easeOut, delay : 1.3, overwrite:false});
    //   this.end3dCursor();
    // }else{
    //   this.environment.huiaScene.fly();
    //   this.showLandCursor();
    // }
  }

  performLegsAnimations (position) {
    if(position.x < -0.8){
      SoundsLoader.playSound("rightpaw",false,0.5,0);
      this.environment.huiaScene.bird.playAnimation(2,false);
    }else{
      SoundsLoader.playSound("leftpaw",false,0.5,0);
      this.environment.huiaScene.bird.playAnimation(3,false);
    }
  }

  performFlap(){
    this.environment.huiaScene.bird.playAnimation(1,false);
    TweenMax.to(this.environment.huiaScene._camera.position, 1.5, {z : 6, ease : Quad.easeOut});
    TweenMax.to(this.environment.huiaScene._camera.position, 1, {z : 0, ease : Quad.easeOut, delay : 1.5, overwrite:false});
    SoundsLoader.playSound("flapwings", false, 0.5, 0);
  }


  get3DPositionBy2D(dx,dy){
    var vector = new THREE.Vector3();
    vector.set(
    ( dx / window.innerWidth ) * 2 - 1,
    - ( dy / window.innerHeight ) * 2 + 1,
    0.5 );
    vector.unproject( this.environment.huiaScene.camera );
    var dir = vector.sub( this.environment.huiaScene.cameraContainer.position ).sub(this.environment.huiaScene.camera.position).normalize();
    var distance = - this.environment.huiaScene.cameraContainer.position.z / dir.z;
    var pos = this.environment.huiaScene.cameraContainer.position.clone().add( dir.multiplyScalar( distance ) );
    return pos;
  }



  createListeners () {
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }


  ini3DCursor(posx,posy){
    document.body.style.cursor = "none";

    if(!window.homeTimer)
      return;

    TweenMax.set(window.homeTimer, {x : posx - (window.innerWidth*0.15) - 32, y : posy - 32, roundProps:"x,y"});



    var cursor = window.homeTimer;
    var fill = cursor.children[0];
    var fillGlow = cursor.children[1];
    var icon = cursor.children[2];
    var texts = cursor.children[3];
    var line = window.homeLine;

    if(this.splits == null){
      this.splits = [];
      for(var i = 0; i < texts.children.length; i++){
        var split = new SplitText(texts.children[i], {type : "chars"});
        this.splits.push(split);
      }
    }else{
      for(var i = 0; i < texts.children.length; i++){
        TweenMax.killTweensOf(this.splits[i].chars);
        TweenMax.set(this.splits[i].chars, {y : 0});
      }
    }

    cursor.style.display = 'block';

    TweenMax.set([fill, fillGlow], {scaleX : 0, scaleY : 0});

    TweenMax.to(texts, 0.4, {x : 0, ease : Back.easeOut});
    TweenMax.staggerFromTo(this.splits[0].chars, 0.5, {y : 30},{y : 0, ease : Quint.easeOut},0.02);
    this.cursor3dEnabled = true;
  }

  end3dCursor () {
    document.body.style.cursor = "auto";
    this.cursor3dEnabled = false;
    if(!window.homeTimer)
      return;
    var cursor = window.homeTimer;
    var fill = cursor.children[0];
    var fillGlow = cursor.children[1];
    var icon = cursor.children[2];
    var texts = cursor.children[3];
    TweenMax.killChildTweensOf(cursor);
    cursor.style.display = 'none';
    // window.homeLine.style.display = 'none';
  }

  showLandCursor () {
    document.body.style.cursor = "none";
    // window.homeLine.style.display = 'none';
    // TweenMax.staggerTo(this.splits[3].chars, 0.5, {y : -120, ease : Quint.easeOut, overwrite:false},0.02);
    TweenMax.killTweensOf(this.splits[0].chars);
    TweenMax.set(this.splits[0].chars,{y : 30});
    TweenMax.staggerFromTo(this.splits[0].chars, 0.5, {y : 30},{y : 0, delay:0.5, ease : Quint.easeOut},0.02);

    var cursor = window.homeTimer;
    var fill = cursor.children[0];
    var fillGlow = cursor.children[1];
    var icon = cursor.children[2];
    var texts = cursor.children[3];

    TweenMax.killTweensOf(icon.children[0]);
    // TweenMax.killTweensOf(icon.children[1]);
    TweenMax.set(icon.children[0], {scaleX : 1, scaleY : 1, opacity : 1});
    TweenMax.to(icon.children[0], 0.4, {scaleX : 1.5, scaleY : 1.5, opacity : 0, ease : Quint.easeOut});
    // TweenMax.to(icon.children[1], 0.4, {scaleX : 1.5, scaleY : 1.5, opacity : 0, ease : Quint.easeOut});
    TweenMax.to(texts, 0.4, {x : -20, ease : Back.easeOut});
    TweenMax.killTweensOf([fill,fillGlow]);
    TweenMax.set([fill,fillGlow], {scaleX :0,scaleY:0});
    TweenMax.fromTo([fill,fillGlow], 0.4, {scaleX :0,scaleY:0}, {scaleX : 0.39, scaleY : 0.39, ease : Back.easeOut});
  }

  startBallLoop(el){
    TweenMax.to(el, 0.5, {scaleX : 0.9, scaleY : 0.9, ease : Linear.easeNone, yoyo : true, repeat : -1});
  }

  walkingJump () {
  }





  onMouseMove(evt){
    var coefx = (evt.clientX-(window.innerWidth/2))/(window.innerWidth/2);
    var coefy = (evt.clientY-(window.innerHeight/2))/(window.innerHeight/2);
    var id = 'home'; //evt.target.id;
    var bird = this.environment.huiaScene.bird;
    var hasHover = false;
    if((id == "home" || id == "home-hit") && !this.disabled && !this.environment.huiaScene.bird.mouseBlocked)
    {
      var obj = this.getIntersectObjects({x : evt.clientX, y : evt.clientY});

      if(obj){
        if(obj.object.name){
          var name = obj.object.name;

          if(name.indexOf('hover') > -1){
            if(bird.pointLight.hide || (name != this.lastHover)){
              bird.pointLight.hide = false;
              this.lastHover = name;
              var num = parseInt(name.replace("hover",""));
              TweenMax.killTweensOf(bird.pointLight);
              TweenMax.killTweensOf(bird.pointLightDirectional);
              TweenMax.fromTo(bird.pointLight, 0.5, {intensity : 0}, {intensity : 25 + (num*0.5), distance : 70 + num*9, ease : Linear.easeNone});
              TweenMax.fromTo(bird.pointLightDirectional, 0.5, {intensity : 0}, {intensity : 25, ease : Linear.easeNone});
            }
            // }
            bird.pointLight.target = obj.object;
            hasHover = true;
            document.body.style.cursor = "pointer";

            bird.pointLightDirectional.target = bird.targetMouse;
            var pos = this.get3DPositionBy2D(evt.clientX, evt.clientY);
            pos.y *= 1.6;
            pos.x *= 1.5;
            pos.z *= 1.5;

            //DESEMPENHO tentar tirar as perticulas do mouse over do pássaro
            this.particlesOptions.position = null;
            this.particlesOptions.position2d = {x : evt.clientX, y : evt.clientY};
            window.environment3d.emmitParticles(this.particlesOptions,1);
            TweenMax.to(bird.targetMouse.position, 0.5, {x : pos.x, y : pos.y, z : pos.z, ease : Quint.easeOut});


            // bird.targetMouse.position.copy(pos);
          }
        }
      }
    }

    if(!hasHover){
      this.hideHover();
    }

    if(window.homeTimer && this.cursor3dEnabled){
      TweenMax.to(window.homeTimer, 1, {force3D : true, x : evt.pageX - (window.innerWidth*0.15) - 32, y : evt.pageY - 32, roundProps:"x,y", ease : Quint.easeOut});
    }

    if(this.environment.huiaScene)
    {
      this.environment.huiaScene.setMouseCoef(coefx,coefy);
      // this.environment.huiaScene.updateMaggotPosition(evt.clientX,evt.clientY);
    }
  }

  onMouseDown(evt){
    if(this.disabled) return;
    var id = evt.target.id;
    this.startClickTime = new Date().getTime();
    if(id != "home" && id != "home-hit")
      return;

    this.startPosition = {x : evt.pageX, y : evt.pageY};
    this.clickPosition = this.get3DPositionBy2D(evt.pageX,evt.pageY);
    TweenMax.killTweensOf(this);

    if(this.environment.huiaScene.bird.mouseBlocked) return;
    // this.ini3DCursor(evt);
    // if(!this.isInLegLimits(this.clickPosition) && !this.isInWingLimits(this.clickPosition)){
    //     this.ini3DCursor(evt);
    // }

  }

  onMouseUp(evt){
    if(this.disabled) return;
    var id = evt.target.id;
    // if(id != "home" && id != "home-hit")
    // {
    //   this.end3dCursor();
    //   return;
    // }
    this.lastClickPosition = {x : evt.clientX, y : evt.clientY};

    this.clickCounter++;
    this.endClickTime = new Date().getTime();


    if(this.clickCounter == 1){
        TweenMax.to(this, 0.1, {onComplete:this.endWaitClick.bind(this), onCompleteParams:[evt]});
    }else{
      this.clickCounter = 0;
      this.performDoubleClick(evt.clientX,evt.clientY);
    }
  }

  endWaitClick (evt){
    this.clickCounter = 0;
    this.performSingleClick(evt.pageX, evt.pageY);
  }



}
