import StringsHelper from './StringsHelper';

class LanguageHelper {
  static DEFAULT = "en_us";
  static AVAILABLES = ["en_us", "pt_br"];

  static LANGUAGE = "en_us";

  static initialize(){
    var fromLocal = localStorage.getItem("lng-huia");
    var fromUrl = StringsHelper.getUrlParameter("language");

    // first, get value form url
    if(fromUrl && this.AVAILABLES.indexOf(fromUrl) > -1){
      localStorage.setItem("lng-huia", fromUrl);
    }
    // if not exists, get from localStorage
    else if(fromLocal && this.AVAILABLES.indexOf(fromLocal) > -1){
      localStorage.setItem("lng-huia", fromLocal);
    }else{
      localStorage.setItem("lng-huia", this.DEFAULT);
    }

    this.LANGUAGE = localStorage.getItem("lng-huia");

  }


  static translateObject(obj){
    return this.recursiveTranslation(obj);
  }

  static recursiveTranslation(obj){
    for(var s in obj){
      var subObj = obj[s];

      if(typeof(subObj) == "object"){
        if(s.indexOf(this.LANGUAGE) > -1){
          this.translateParameter(obj,s);
        }
        else{
          obj[s] = this.recursiveTranslation(obj[s]);
        }
      }else if(typeof(subObj) == "string"){
          if(s.indexOf(this.LANGUAGE) > -1){
            this.translateParameter(obj,s);
          }
      }
    }
    return obj;
  }

  static translateParameter(obj,s){
    var parameter = s.replace("-" + this.LANGUAGE, "");
    obj[parameter] = obj[s];

    for(var k = 0; k < this.AVAILABLES.length; k++){
      delete obj[parameter + "-" + this.AVAILABLES[k]];
    }
  }
}


export default LanguageHelper;
