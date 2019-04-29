import EventDispatcher from '@danehansen/event-dispatcher';


class GPUMonitorMode {
  static FRAME_BY_FRAME = "fbf";
  static SHORT_INTERVAL = "shi";
  static LONG_INTERVAL = "longi";
  static PASSIVE = "pss";
}


class GPUMonitor extends EventDispatcher {

  static AVERAGE_INTERVAL_PER_FRAME = 20;
  static COUNTER_CHECK = 45;
  static FIRST_COUNTER_CHECK = 120;

  /**
  * getters and setters
  **/
  get suggestedQuality () {
    return this._suggestedQuality;
  }


  /**
  * constructor
  **/
  constructor (initialQuality = 2, minQuality = 1, maxQuality = 2, mode = GPUMonitorMode.FRAME_BY_FRAME, roundedValues = false) {
    super();
    this.mode = mode;
    this.initialQuality = initialQuality;
    this.minQuality = minQuality;
    this.maxQuality = maxQuality;
    this.roundedValues = roundedValues;
    this.first = true;
    this._suggestedQuality = this.initialQuality;
    this.update = this.update.bind(this);
    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.checkAverage = this.checkAverage.bind(this);
    this.setSuggestedQuality = this.setSuggestedQuality.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  /**
  * public methods
  **/
  update () {
    this.updateByFrame(true);
  }

  start () {
    if(this.mode == GPUMonitorMode.FRAME_BY_FRAME){
      this.initFrameByFrame();
    }else if(this.mode == GPUMonitorMode.SHORT_INTERVAL){
      this.initShortInterval();
    }else if(this.mode == GPUMonitorMode.LONG_INTERVAL){
      this.initLongInterval();
    }else if(this.mode == GPUMonitorMode.PASSIVE){
      this.initPassiveMode();
    }else{
      console.error("GPUMonitor : the monitor mode have to match some of GpuMonitorMode constants.");
    }
  }

  pause () {
    // TODO
  }

  destroy () {
    // TODO
  }

  checkAverage(average){
    var scale = (average - GPUMonitor.AVERAGE_INTERVAL_PER_FRAME)/GPUMonitor.AVERAGE_INTERVAL_PER_FRAME;
    var quality = this._suggestedQuality+(scale/2);
    quality = Math.max(this.minQuality,quality);
    quality = Math.min(this.maxQuality,quality);

    this.setSuggestedQuality(quality);
  }

  setSuggestedQuality(quality){
    if(this.roundedValues){
      quality = Math.round(quality);
    }
    // console.log(quality);

  if(quality == this._suggestedQuality && quality != this.maxQuality) return;
    if(Math.abs(quality - this._suggestedQuality) < 0.1){
      this.counterOnBest++;
      window.counterOnBest = this.counterOnBest;
      if(this.counterOnBest > 2){
        this.counterOnBest = 0;
        this.setSuggestedQuality(Math.max(this._suggestedQuality-0.5,this.minQuality));
      }
      return;
    }

    this._suggestedQuality = quality;

    this.dispatchEvent("change", {value : this._suggestedQuality});
  }

  /**
  * private methods
  **/
  initFrameByFrame () {
    this.currentTime = new Date().getTime();
    this.counter = 0;
    this.counterOnBest = 0;
    this.sum = 0;
    window.requestId = window.requestAnimationFrame(this.updateByFrame.bind(this,false));
  }

  initShortInterval() {
    // TODO
  }

  initLongInterval() {
    // TODO
  }


  initPassiveMode() {
    // TODO
  }

  updateByFrame(ignore = false){
    var dt = new Date().getTime();
    var dif = dt - this.currentTime;
    this.counter++;
    this.sum += dif;

    this.currentTime = dt;


    var b = false;

    if(this.first && this.counter == GPUMonitor.FIRST_COUNTER_CHECK){
      b = true;
      this.first = false;
    }else if(this.counter == GPUMonitor.COUNTER_CHECK){
      b = true;
    }

    if(b){
      var average = this.sum / this.counter;
      this.checkAverage(average);
      this.counter = 0;
      this.sum = 0;
    }
    if(!ignore)
      window.requestId = window.requestAnimationFrame(this.updateByFrame.bind(this,false));

  }

}


export {GPUMonitor, GPUMonitorMode};
