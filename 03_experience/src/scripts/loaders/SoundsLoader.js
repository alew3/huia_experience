export default class SoundsLoader {
  static SOUNDS = [];
  static LOOPS = {};
  static ENABLED = true;


  static playSound(str, loop, volume, fadeintime){
    if(window.MOBILE_DETECT.mobile()) return;
    if(str.indexOf('sing') > -1 && this.background) return;
    if(!this.SOUNDS[str]) return;

    window.sound = this.SOUNDS[str];
    this.SOUNDS[str].currentTime = 0;
    this.SOUNDS[str].loop = loop;

    if(loop){
      this.registerLoop(str,volume);
    }

    if(!loop && !this.ENABLED)
      return;

    if(!this.ENABLED && loop)
      volume = 0;

    this.SOUNDS[str].volume = 0;
    TweenMax.to(this.SOUNDS[str], fadeintime, {volume : volume, ease : Linear.easeNone});
    this.SOUNDS[str].play();
  }

  static registerLoop(str,volume){
      this.LOOPS[str] = volume;
  }

  static unregisterLoop(str){
      this.LOOPS[str] = null;
  }


  static stopLoop(str){
    if(!this.SOUNDS[str]) return;

    this.SOUNDS[str].pause();
    this.unregisterLoop(str);
  }


  static startWindowEvents () {
    if(window.MOBILE_DETECT.mobile()) return;
    window.onblur = (evt)=> {
      this.LAST_ENABLED = this.ENABLED;
      this.toggleEnabled(false,true);
    }

    window.onfocus = (evt)=>{
      this.toggleEnabled(this.LAST_ENABLED);
    }
  }

  static toggleEnabled (b,force) {
    if(window.MOBILE_DETECT.mobile()) return;
    this.ENABLED = b;

    localStorage.setItem("huiasound",b);

    for(var s in this.LOOPS){
      if(this.ENABLED){
        TweenMax.to(this.SOUNDS[s], 0.5, {volume : this.LOOPS[s], ease : Linear.easeNone});
      }else{

        if(force){
          this.SOUNDS[s].volume = 0;
        }else{
          TweenMax.to(this.SOUNDS[s], 0.5, {volume : 0, ease : Linear.easeNone});
        }
      }
    }
  }


  static changeVolume(str,volume,time){
    if(window.MOBILE_DETECT.mobile()) return;
    TweenMax.to(this.SOUNDS[str], time, {volume : volume, ease : Linear.easeNone});
  }


  static setBlurSound (b,animated) {
    if(window.MOBILE_DETECT.mobile()) return;
    this.background = b;
    if(b){
      this.LOOPS["ambientloop"] = 0;
      this.LOOPS["ambientinternalloop"] = 0.2;

      if(this.ENABLED){
        TweenMax.to(this.SOUNDS["ambientloop"], (animated) ? 1 : 0, {volume : 0, ease : Linear.easeNone});
        TweenMax.to(this.SOUNDS["ambientinternalloop"], (animated) ? 1 : 0, {volume : 0.2, ease : Linear.easeNone});
      }
    }else{
      this.LOOPS["ambientloop"] = 0.2;
      this.LOOPS["ambientinternalloop"] = 0;

      if(this.ENABLED){
        TweenMax.to(this.SOUNDS["ambientloop"], (animated) ? 1 : 0, {volume : 0.2, ease : Linear.easeNone});
        TweenMax.to(this.SOUNDS["ambientinternalloop"], (animated) ? 1 : 0, {volume : 0, ease : Linear.easeNone});
      }
    }
  }
}
