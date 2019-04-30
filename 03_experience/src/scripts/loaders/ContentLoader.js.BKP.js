import '../vendors/PreloadJS.js';
import LanguageHelper from "../helpers/LanguageHelper";
import * as THREE from 'three';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import Globals from '../core/Globals';
import axios from 'axios';
import SoundsLoader from './SoundsLoader';


class ContentLoader{

  static DATA_MENU = null;
  static DATA_CLIENTS = null;
  static DATA_PROJECTS = null;
  static DATA_STUDIOS = null;
  static DATA_TEXTS = null;
  static DATA_METATAGS = null;
  static DATA_COUNTRIES = null;
  static DATA_TEAM = null;
  static DATA_MODEL_HUIA = null;
  static DATA_MODEL_FEATHER = null;
  static SPRITESHEETS = [];
  static STUDIO_TECHNOLOGY = "technology";
  static STUDIO_MEDIA = "media";
  static STUDIO_EXPERIENCE = "experience";

  static PROGRESS = 0;

  static _onProgress;
  static _onComplete;


  static DATA_HUIA_3D = [];
  static DATA_HUIA_LOW_POLY = null;
  static DATA_TREE = null;
  static DATA_ISLAND = null;
  static DATA_HUIA_3D_TEXTURES = [];
  static DATA_EXPERIENCE_TEXTURES = [];
  static DATA_BOAT = null;
  static DATA_PROJECTS_DETAILS = [];


  static getApiUrl() {
    return window.API_URL;
  }

  static preloadSite (onProgress, onComplete) {
    window.THREE = THREE;

    this.loadingWithProject = null;

    if(window.location.href.indexOf("projects") != -1){
      var split;

      if(window.location.href.charAt(window.location.href.length-1) == "/"){
        split =window.location.href.substr(0,window.location.href.length-1).split("/");
      }else{
        split = window.location.href.split("/");
      }

      var el = split.pop();
      if(el != "" && el != "projects"){
        this.loadingWithProject = el;
      }
    }

    this._onProgress = onProgress;
    this._onComplete = onComplete;

    this.dataQueue = new createjs.LoadQueue(true);
    this.dataQueue.maintainScriptOrder = false;
    this.dataQueue.setMaxConnections(10);
    this.dataQueue.loadFile({id : "menu", src : window.API_URL + "menu", type : createjs.AbstractLoader.JSON});
    this.dataQueue.loadFile({id : "clients", src : window.API_URL + "clients", type : createjs.AbstractLoader.JSON});
    this.dataQueue.loadFile({id : "team", src : window.API_URL + "team", type : createjs.AbstractLoader.JSON});
    this.dataQueue.loadFile({id : "projects", src : window.API_URL + "projects", type : createjs.AbstractLoader.JSON});
    this.dataQueue.loadFile({id : "studios", src : window.API_URL + "studios", type : createjs.AbstractLoader.JSON});
    this.dataQueue.loadFile({id : "texts", src : "/static/json/texts.json", type : createjs.AbstractLoader.JSON});
    this.dataQueue.loadFile({id : "metatags", src : "/static/json/metatags.json", type : createjs.AbstractLoader.JSON});
    this.dataQueue.loadFile({id : "countries", src : "/static/json/countries.json", type : createjs.AbstractLoader.JSON});
    // this.dataQueue.loadFile({id : "model", src : "/static/huia-model/women.json?ck=123", type : createjs.AbstractLoader.JSON});
    // this.dataQueue.loadFile({id : "model", src : "/static/huia-model/model.jd?ck=123", type : createjs.AbstractLoader.JSON});

    // if(!window.IS_CRAWLER){
    this.dataQueue.loadFile({id : "thunderbolt-ss", src : "/static/images/thunderbolt-ss.json", type : createjs.AbstractLoader.SPRITESHEET});
    this.dataQueue.loadFile({id : "charh-ss", src : "/static/images/logo-h.json", type : createjs.AbstractLoader.SPRITESHEET});
    this.dataQueue.loadFile({id : "charu-ss", src : "/static/images/logo-u.json", type : createjs.AbstractLoader.SPRITESHEET});
    this.dataQueue.loadFile({id : "chari-ss", src : "/static/images/logo-i.json", type : createjs.AbstractLoader.SPRITESHEET});
    this.dataQueue.loadFile({id : "chara-ss", src : "/static/images/logo-a.json", type : createjs.AbstractLoader.SPRITESHEET});
    this.dataQueue.loadFile({id : "logodetails-ss", src : "/static/images/logo-details.json", type : createjs.AbstractLoader.SPRITESHEET});
    this.dataQueue.loadFile({id : "animtitle-ss", src : "/static/images/anim-title.json", type : createjs.AbstractLoader.SPRITESHEET});
    // }

    var self = this;

    this.dataQueue.addEventListener('progress', (data) => {
      self.PROGRESS = Math.round((data.progress * 0.2) * 100);

      if(this.loadingWithProject){
        self.PROGRESS = Math.round(self.PROGRESS/2);
      }
      if(self._onProgress)
        self._onProgress();
    });

    this.dataQueue.addEventListener('complete', (data) => {
      self.load3DImages();
    });

    this.dataQueue.addEventListener('fileload', (data) => {
      if(data.item.id == "menu"){
        self.DATA_MENU = LanguageHelper.translateObject(data.result);
      }else if(data.item.id == "clients"){
        self.DATA_CLIENTS = LanguageHelper.translateObject(data.result);
      }else if(data.item.id == "team"){
        self.DATA_TEAM = LanguageHelper.translateObject(data.result);
      }else if(data.item.id == "projects"){
        self.DATA_PROJECTS = LanguageHelper.translateObject(data.result);
      }else if(data.item.id == "studios"){
        self.DATA_STUDIOS = LanguageHelper.translateObject(data.result);

        for(var i = 0; i < self.DATA_STUDIOS.length; i++){
          self.DATA_STUDIOS[i].titleHover = self.DATA_STUDIOS[i].titleHover.replace("$", "<br/>");

          for(var k = 0; k < self.DATA_STUDIOS[i].features.length; k++){
            self.DATA_STUDIOS[i].features[k] = self.DATA_STUDIOS[i].features[k].replace("$", "<br/>");
          }
        }
      }else if(data.item.id == "texts"){
        self.DATA_TEXTS = LanguageHelper.translateObject(data.result);
      }else if(data.item.id == "metatags"){
        self.DATA_METATAGS = LanguageHelper.translateObject(data.result);
      }else if(data.item.id == "countries"){
        self.DATA_COUNTRIES = LanguageHelper.translateObject(data.result);
      }
      else if(data.item.id.indexOf("-ss") > 1){
        self.SPRITESHEETS[data.item.id.replace("-ss","")] = data.result;
      }
    });

    this.dataQueue.load();
    window.ContentLoader = this;
  }

  static getProjectObjectBySlug(slug){
    for(var i = 0; i < this.DATA_PROJECTS.length; i++){
      if(this.DATA_PROJECTS[i].slug == slug)
        return this.DATA_PROJECTS[i];
    }

    return null;
  }

  static setMetaTags(path){
    // path = path.replace('/','');
    var data;

    if(!ContentLoader.DATA_METATAGS) return;

    if(path.charAt(0) == "/"){
      path = path.substr(1,path.length-1);
    }

    if(path.charAt(path.length-1) != "/"){
      path = path + "/";
    }

    // console.log(path);

    if(!ContentLoader.DATA_METATAGS.metatags[path]){
      if(path == "" || path == "/"){
        data = ContentLoader.DATA_METATAGS.metatags.home;
      }else if(path.indexOf('projects') > -1){
        // path = "projects/"
        // data = ContentLoader.DATA_METATAGS.metatags.projects;

        var slug = path.replace("projects/","");
        slug = slug.replace("/projects/","");
        slug = slug.replace("/","");
        slug = slug.replace("/","");


        var obj = this.getProjectObjectBySlug(slug);

        data = {
          title : obj.seoTitle,
          description : obj.seoDescription,
          url : obj.seoUrl,
          ogDescription : obj.ogDescription,
          ogTitle : obj.ogTitle,
          ogUrl : obj.ogUrl
        };


        if(obj.shareImage){
          data.shareImage = window.ASSETS_URL + "upload/" + obj.shareImage.filename;
        }
      }
    }else{
      data = ContentLoader.DATA_METATAGS.metatags[path];
    }


    if(!data.shareImage){
      data.shareImage = window.ROOT_URL + "static/images/share.jpg";
    }

    // title
    document.title = data.title;
    document.querySelector("meta[itemprop=name]").attributes.content.value = data.title;
    document.querySelector("meta[property='og:site_name']").attributes.content.value = data.ogTitle;
    document.querySelector("meta[property='og:title']").attributes.content.value = data.ogTitle;
    document.querySelector("meta[name='twitter:site']").attributes.content.value = data.ogTitle;
    document.querySelector("meta[name='twitter:title']").attributes.content.value = data.ogTitle;

    //image
    document.querySelector("meta[itemprop=image]").attributes.content.value = data.shareImage;
    document.querySelector("meta[property='og:image']").attributes.content.value = data.shareImage;
    document.querySelector("meta[name='twitter:image']").attributes.content.value = data.shareImage;

    // description
    document.querySelector("meta[name=description]").attributes.content.value = data.description;
    document.querySelector("meta[property='og:description']").attributes.content.value = data.ogDescription;
    document.querySelector("meta[name='twitter:description']").attributes.content.value = data.ogDescription;

    // keywords
    document.querySelector("meta[name=keywords]").attributes.content.value = data.keywords;

    // url
    document.querySelector("meta[property='og:url']").attributes.content.value = (data.ogUrl) ? data.ogUrl : window.ROOT_URL;
    document.querySelector("meta[name='twitter:url']").attributes.content.value = (data.ogUrl) ? data.ogUrl : window.ROOT_URL;
  }

  static loadExperience(onProgress, onComplete){
    this._onProgress = onProgress;
    this._onComplete = onComplete;



    this.imageQueue = new createjs.LoadQueue(true);
    this.imageQueue.loadFile({id : "huia-low-diffuse", src : "/static/experience-models/huia_comp_diffuse_low.jpg", type : createjs.AbstractLoader.IMAGE});
    this.imageQueue.loadFile({id : "huia-low-roughness", src : "/static/experience-models/huia_comp_roughness_low.jpg", type : createjs.AbstractLoader.IMAGE});
    this.imageQueue.loadFile({id : "island-diffuse", src : "/static/experience-models/island_diffuse_low.png", type : createjs.AbstractLoader.IMAGE});
    this.imageQueue.loadFile({id : "island-alpha", src : "/static/experience-models/island_alpha.jpg", type : createjs.AbstractLoader.IMAGE});
    this.imageQueue.loadFile({id : "island-roughness", src : "/static/experience-models/island_roughness_medium.jpg", type : createjs.AbstractLoader.IMAGE});
    this.imageQueue.loadFile({id : "river-diffuse", src : "/static/experience-models/riversequence/diffuse.jpg", type : createjs.AbstractLoader.IMAGE});
    this.imageQueue.loadFile({id : "river-specular", src : "/static/experience-models/riversequence/spec.jpg", type : createjs.AbstractLoader.IMAGE});
    this.imageQueue.loadFile({id : "river-normals", src : "/static/experience-models/riversequence/normals.jpg", type : createjs.AbstractLoader.IMAGE});
    this.imageQueue.loadFile({id : "tree-bark-diffuse", src : "/static/experience-models/tree_bark_dif_low.jpg", type : createjs.AbstractLoader.IMAGE});
    this.imageQueue.loadFile({id : "tree-leaf-diffuse", src : "/static/experience-models/tree_leaf_dif.png", type : createjs.AbstractLoader.IMAGE});
    this.imageQueue.loadFile({id : "coconuttree-diffuse", src : "/static/experience-models/coconut-tree.png", type : createjs.AbstractLoader.IMAGE});
    this.imageQueue.loadFile({id : "boat-diffuse", src : "/static/experience-models/boat_d.jpg", type : createjs.AbstractLoader.IMAGE});
    this.imageQueue.loadFile({id : "water-foam", src : "/static/experience-models/water-foam.png", type : createjs.AbstractLoader.IMAGE});

    this.imageQueue.loadFile({id : "lensflare0", src : "/static/experience-models/lensflare0.png", type : createjs.AbstractLoader.IMAGE});
    this.imageQueue.loadFile({id : "lensflare2", src : "/static/experience-models/lensflare2.png", type : createjs.AbstractLoader.IMAGE});
    this.imageQueue.loadFile({id : "lensflare3", src : "/static/experience-models/lensflare3.png", type : createjs.AbstractLoader.IMAGE});


    this.imageQueue.loadFile({id : "water-normals", src : "/static/experience-models/waternormals.jpg", type : createjs.AbstractLoader.IMAGE});
    this.imageQueue.loadFile({id : "notexturesky1", src : "/static/experience-models/skyboxA3.jpg", type : createjs.AbstractLoader.IMAGE});
    this.imageQueue.loadFile({id : "notexturesky2", src : "/static/experience-models/skyboxA6.jpg", type : createjs.AbstractLoader.IMAGE});
    this.imageQueue.loadFile({id : "notexturesky3", src : "/static/experience-models/skyboxA1.jpg", type : createjs.AbstractLoader.IMAGE});
    this.imageQueue.loadFile({id : "notexturesky4", src : "/static/experience-models/skyboxA4.jpg", type : createjs.AbstractLoader.IMAGE});
    this.imageQueue.loadFile({id : "notexturesky5", src : "/static/experience-models/skyboxA2.jpg", type : createjs.AbstractLoader.IMAGE});
    this.imageQueue.loadFile({id : "notexturesky6", src : "/static/experience-models/skyboxA5.jpg", type : createjs.AbstractLoader.IMAGE});
    this.imageQueue.loadFile({id : "notextureheightmap", src : "/static/experience-models/island_heightmap.jpg", type : createjs.AbstractLoader.IMAGE});
    var self = this;

    this.imageQueue.addEventListener('progress', (data) => {
      self.PROGRESS = Math.round((data.progress * 0.5) * 100);
      if(self._onProgress)
        self._onProgress();
    });

    this.imageQueue.addEventListener('fileload', (data) => {
        if(data.item.id.indexOf("notexture") == -1){
          var texture = new THREE.Texture();
          texture.image = data.result;
          texture.needsUpdate = true;
          self.DATA_EXPERIENCE_TEXTURES[data.item.id] = texture;
        }else{
          self.DATA_EXPERIENCE_TEXTURES[data.item.id.replace("notexture","")] = data.result;
        }
    });

    this.imageQueue.addEventListener('complete', (data) => {
      self.PROGRESS = 50;
      self._onProgress();
      self.loadExperience3DModel();
      // self.PROGRESS = 100;
      // self._onProgress();
    });
  }

  static loadExperience3DModel() {
    var self = this;
    JSZipUtils.getBinaryContent('/static/experience-models/models.zip', function(err, data) {
        if(err) {
            throw err; // or handle err
        }
        self.PROGRESS = 70;
        self._onProgress();

        JSZip.loadAsync(data).then(function (zip) {
          self.PROGRESS = 75;
          self._onProgress();
          // console.log(zip);
            zip.file("island.jd").async("string").then(function(txt){
              ContentLoader.DATA_ISLAND = JSON.parse(txt);
              self.PROGRESS = 80;
              self._onProgress();

              zip.file("huia.jd").async("string").then(function(txt){
                ContentLoader.DATA_HUIA_LOW_POLY = JSON.parse(txt);

                self.PROGRESS = 85;
                self._onProgress();

                zip.file("boat.json").async("string").then(function(txt){
                  ContentLoader.DATA_BOAT = JSON.parse(txt);

                  zip.file("tree.jd").async("string").then(function(txt){
                    ContentLoader.DATA_TREE = JSON.parse(txt);

                    // if(Globals.USER_DATA.userCity == "" || Globals.USER_DATA.userCountry == "" || Globals.USER_DATA.userCity == null || Globals.USER_DATA.userCountry == null){
                    //   self.PROGRESS = 90;
                    // }else{
                      self.PROGRESS = 100;
                      self._onProgress();
                    // }
                  });
                });
              });
            });
        });
    });
  }

  static getGeolocationData (onCompleteAddress) {
    var self = this;
    this._onCompleteAddress = onCompleteAddress;

    if(!navigator.geolocation){
      return "notEnabled";
    }

    navigator.geolocation.getCurrentPosition((position)=>{
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;

      self.loadAddress(lat,lng);
    });
  }

  static loadAddress(lat,lng){
    var self = this;
    var objResponse = {};
    axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&key=AIzaSyAtwyLI5J4294iaBitBy0413izgA9pKfbE")
    .then((data)=>{
      for(var i = 0; i < data.data.results.length; i++){
        if(data.data.results[i].types[0] == "street_address" || data.data.results[i].types[0] == "route"){
          var objResult = data.data.results[i];

          for(var q = 0; q < objResult.address_components.length; q++){
            var el = objResult.address_components[q];
            if(el.types[0] == "locality"){
              objResponse.userCity = el.short_name;
            }else if(el.types[0] == "administrative_area_level_1"){
              objResponse.userCity += " - " + el.short_name;
            }else if(el.types[0] == "country"){
              objResponse.userCountry = el.short_name;
              objResponse.userCountryName = el.long_name;
            }
          }
        }
      }

      self._onCompleteAddress(objResponse);
    });
  }


  static load3DImages () {
    var quality = "low";

    if(window.IS_CRAWLER){
      this.load3DModel();
      return;
    }

    // if(!window.MOBILE_DETECT.mobile()){
      this.imageQueue = new createjs.LoadQueue(false);
      this.imageQueue.setMaxConnections(10);
      this.imageQueue.maintainScriptOrder = false;
      if(!window.MOBILE_DETECT.mobile()){
        this.imageQueue.loadFile({id : "particle1", src : "/static/images/particle1.png", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "particle2", src : "/static/images/particle2.png", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "particle3", src : "/static/images/particle3.png", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "outline-circle", src : "/static/images/outline-circle.png", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "background", src : "/static/images/background.png", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "huia-diffuse", src : "/static/huia-model/textures/"+quality.toLowerCase()+"/huia_diffuse.jpg", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "huia-roughness", src : "/static/huia-model/textures/"+quality.toLowerCase()+"/huia_roughness.jpg", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "huia-normalmap", src : "/static/huia-model/textures/"+quality.toLowerCase()+"/huia_normal.jpg", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "huia-specular", src : "/static/huia-model/textures/"+quality.toLowerCase()+"/huia_spec.jpg", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "floor", src : "/static/images/floor-front.png", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "feather-diffuse", src : "/static/huia-model/textures/"+quality.toLowerCase()+"/feather_diffuse.jpg", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "feather-roughness", src : "/static/huia-model/textures/"+quality.toLowerCase()+"/feather_roughness.jpg", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "feather-normalmap", src : "/static/huia-model/textures/"+quality.toLowerCase()+"/feather_normalmap.jpg", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "feather-alphamap", src : "/static/huia-model/textures/"+quality.toLowerCase()+"/feather_alpha.jpg", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "feather-alphamap-plumes", src : "/static/huia-model/textures/"+quality.toLowerCase()+"/feather_alpha_plumes.jpg", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "eye-ball", src : "/static/huia-model/textures/"+quality.toLowerCase()+"/eye_ball.jpg", type : createjs.AbstractLoader.IMAGE});

        this.imageQueue.loadFile({id : "ambientloop-sound", src : "/static/sounds/ambient-loop.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "ambientinternalloop-sound", src : "/static/sounds/ambientinternal-loop.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "overmenu-sound", src : "/static/sounds/over-menu.mp3", type : createjs.AbstractLoader.SOUND});
        // this.imageQueue.loadFile({id : "overclient-sound", src : "/static/sounds/overclient.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "overteam-sound", src : "/static/sounds/overteam.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "overclosemenu-sound", src : "/static/sounds/overclose-menu.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "overitemmenu-sound", src : "/static/sounds/overitem-menu.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "shortjump-sound", src : "/static/sounds/shortjump.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "flapwings-sound", src : "/static/sounds/flapwings.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "fly-sound", src : "/static/sounds/fly.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "goandback-sound", src : "/static/sounds/goandback.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "land-sound", src : "/static/sounds/land.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "leftpaw-sound", src : "/static/sounds/leftpaw.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "longjump-sound", src : "/static/sounds/longjump.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "rightpaw-sound", src : "/static/sounds/rightpaw.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "scratch-sound", src : "/static/sounds/scratch.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "turn-sound", src : "/static/sounds/turn.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "message-sound", src : "/static/sounds/message.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "usermessage-sound", src : "/static/sounds/usermessage.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "type-sound", src : "/static/sounds/type.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "sing1-sound", src : "/static/sounds/sing-1.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "sing2-sound", src : "/static/sounds/sing-2.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "sing3-sound", src : "/static/sounds/sing-3.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "sing4-sound", src : "/static/sounds/sing-4.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "sing5-sound", src : "/static/sounds/sing-5.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "overitem1-sound", src : "/static/sounds/overitem-1.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "overitem2-sound", src : "/static/sounds/overitem-2.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "overitem3-sound", src : "/static/sounds/overitem-3.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "overitem4-sound", src : "/static/sounds/overitem-4.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "projecthover1-sound", src : "/static/sounds/projecthover-1.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "projecthover2-sound", src : "/static/sounds/projecthover-2.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "sectionentrance1-sound", src : "/static/sounds/section-entrance-1.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "sectionentrance2-sound", src : "/static/sounds/section-entrance-2.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "entrancestudio-sound", src : "/static/sounds/entrance-studio.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "studiodetail-sound", src : "/static/sounds/studio-detail.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "overstudio1-sound", src : "/static/sounds/overstudio-1.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "overstudio2-sound", src : "/static/sounds/overstudio-2.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "overstudio3-sound", src : "/static/sounds/overstudio-3.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "openmenu-sound", src : "/static/sounds/open-menu.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "closemenu-sound", src : "/static/sounds/close-menu.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "flyingloop-sound", src : "/static/sounds/flying-loop.mp3", type : createjs.AbstractLoader.SOUND});

        this.imageQueue.loadFile({id : "glitch1-sound", src : "/static/sounds/glitch-1.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "glitch2-sound", src : "/static/sounds/glitch-2.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "glitch3-sound", src : "/static/sounds/glitch-3.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "glitch5-sound", src : "/static/sounds/glitch-5.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "glitch6-sound", src : "/static/sounds/glitch-6.mp3", type : createjs.AbstractLoader.SOUND});
        this.imageQueue.loadFile({id : "glitch7-sound", src : "/static/sounds/glitch-7.mp3", type : createjs.AbstractLoader.SOUND});



      }else{
        this.imageQueue.loadFile({id : "huia-diffuse", src : "/static/huia-model/textures/"+quality.toLowerCase()+"/huia_diffuse.jpg", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "huia-roughness", src : "/static/huia-model/textures/"+quality.toLowerCase()+"/huia_roughness.jpg", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "huia-normalmap", src : "/static/huia-model/textures/"+quality.toLowerCase()+"/huia_normal.jpg", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "huia-specular", src : "/static/huia-model/textures/"+quality.toLowerCase()+"/huia_spec.jpg", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "feather-diffuse", src : "/static/huia-model/textures/"+quality.toLowerCase()+"/feather_diffuse.jpg", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "feather-roughness", src : "/static/huia-model/textures/"+quality.toLowerCase()+"/feather_roughness.jpg", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "feather-normalmap", src : "/static/huia-model/textures/"+quality.toLowerCase()+"/feather_normalmap.jpg", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "feather-alphamap", src : "/static/huia-model/textures/"+quality.toLowerCase()+"/feather_alpha.jpg", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "feather-alphamap-plumes", src : "/static/huia-model/textures/"+quality.toLowerCase()+"/feather_alpha_plumes.jpg", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "eye-ball", src : "/static/huia-model/textures/"+quality.toLowerCase()+"/eye_ball.jpg", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "particle1", src : "/static/images/particle1.png", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "particle2", src : "/static/images/particle2.png", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "body", src : "/static/huia-model/body.png", type : createjs.AbstractLoader.IMAGE});
        this.imageQueue.loadFile({id : "body-alpha", src : "/static/huia-model/body-alpha.png", type : createjs.AbstractLoader.IMAGE});
      }
      this.imageQueue.loadFile({id : "notexture-noise-bg", src : "/static/images/noise.png", type : createjs.AbstractLoader.IMAGE});
      this.imageQueue.loadFile({id : "notexture-user-ballon", src : "/static/images/user-message-border.svg", type : createjs.AbstractLoader.IMAGE});
      this.imageQueue.loadFile({id : "notexture-bot-ballon", src : "/static/images/bot-message-border.svg", type : createjs.AbstractLoader.IMAGE});
      this.imageQueue.loadFile({id : "notexture-teammember", src : "/static/images/bg-team-member.png", type : createjs.AbstractLoader.IMAGE});

    var self = this;


    if(!this.imageQueue) return;

    this.imageQueue.addEventListener('progress', (data) => {
      self.PROGRESS = 20 + Math.round((data.progress * 0.4) * 100);

      if(this.loadingWithProject){
        self.PROGRESS = Math.round(self.PROGRESS/2);
      }
      if(self._onProgress)
        self._onProgress();
    });


    this.imageQueue.addEventListener('fileload', (data) => {
      if(data.item.id.indexOf("-sound") > 1){
        SoundsLoader.SOUNDS[data.item.id.replace("-sound","")] = data.result;
        return;
      }

      if(data.item.id.indexOf("notexture") == -1){
        var texture = new THREE.Texture();
        texture.image = data.result;
        texture.needsUpdate = true;
        self.DATA_HUIA_3D_TEXTURES[data.item.id] = texture;
      }
    });

    this.imageQueue.addEventListener('complete', (data) => {
      self.PROGRESS = 70;

      if(this.loadingWithProject){
        self.PROGRESS = Math.round(self.PROGRESS/2);
      }
      self.load3DModel();
      // self.PROGRESS = 100;
      // self._onProgress();
    });


    this.imageQueue.load();
  }

  static getProjectDetail(slug){
    return this.DATA_PROJECTS_DETAILS[slug];
  }

  static setLoadProjectCallbacks(onProgress,onComplete){
    this.onProgressDetail = onProgress;
    this.onCompleteDetail = onComplete;
  }

  static loadProjectDetail(slug, onProgress, onComplete){
    var self = this;

    this.onProgressDetail = onProgress;
    this.onCompleteDetail = onComplete;

    axios.get(ContentLoader.getApiUrl() + 'projects/'+slug)
    .then((data) => {
      if(self.loadingWithProject){
        self.PROGRESS = 70;
        self._onProgress();
      }else{
        self.onProgressDetail(0.2);
      }

      var data = LanguageHelper.translateObject(data.data[0]);
      self.DATA_PROJECTS_DETAILS[slug] = {data : data, imagesLoaded : false, images : []};
      self.loadProjectImages(slug,data);
    })
    .catch((data)=>{
      console.log("error", data);
    });
  }


  static loadProjectImages(slug,data){
    this.imagesQueue = new createjs.LoadQueue(false);
    this.imagesQueue.setMaxConnections(10);
    this.imagesQueue.maintainScriptOrder = false;

    if(window.IS_CRAWLER){

      this.DATA_PROJECTS_DETAILS[slug].imagesLoaded = true;
      this.PROGRESS = 100;
      if(this.loadingWithProject){
        this.loadingWithProject = null;
        if(this.onCompleteDetail)
          this.onCompleteDetail();
      }else{
        if(this.onCompleteDetail)
          this.onCompleteDetail();
      }

      return;
    }

    for(var i = 0; i < data.pages.length; i++){
      var page = data.pages[i];

      if(page.page_type == "singleimage"){
        this.imagesQueue.loadFile({id : page.image.filename, src : window.ASSETS_URL + "upload/"+page.image.filename, type : createjs.AbstractLoader.IMAGE});
      }
      else if(page.page_type == "imagegallery"){
        for(var q = 0; q < page.images.length; q++){
          this.imagesQueue.loadFile({id : page.images[q].file.filename, src : window.ASSETS_URL + "upload/"+page.images[q].file.filename, type : createjs.AbstractLoader.IMAGE});
        }
      }
      else if(page.page_type == "video"){
        if(page.video_source == "youtube"){
          this.imagesQueue.loadFile({id : "asfafas", src : "https://img.youtube.com/vi/"+page.video_id+"/0.jpg", type : createjs.AbstractLoader.IMAGE, crossOrigin : true});
        }
      }else if(page.page_type == "phoneframed"){
        this.imagesQueue.loadFile({id : page.animation_phone.filename, src : window.ASSETS_URL + "upload/"+page.animation_phone.filename, type : createjs.AbstractLoader.IMAGE});
        this.imagesQueue.loadFile({id : page.animation_print_phone.filename, src : window.ASSETS_URL + "upload/"+page.animation_print_phone.filename, type : createjs.AbstractLoader.IMAGE});
      }else if(page.page_type == "computerframed"){
        this.imagesQueue.loadFile({id : page.animation_computer.filename, src : window.ASSETS_URL + "upload/"+page.animation_computer.filename, type : createjs.AbstractLoader.IMAGE});
        this.imagesQueue.loadFile({id : page.animation_print_computer.filename, src : window.ASSETS_URL + "upload/"+page.animation_print_computer.filename, type : createjs.AbstractLoader.IMAGE});
      }
    }

    if(page.page_type == "phoneframed"){
      this.imagesQueue.loadFile({id : "photoframe", src : '/static/images/phoneframe-'+page.phone_frame_color+'.png', type : createjs.AbstractLoader.IMAGE});
    }
    this.imagesQueue.loadFile({id : "computerframe", src : '/static/images/computer-frame.png', type : createjs.AbstractLoader.IMAGE});

    var self = this;
    this.imagesQueue.addEventListener('fileload', (data) => {
      self.DATA_PROJECTS_DETAILS[slug].images[data.item.id] = data.rawResult;
    });

    this.imagesQueue.addEventListener('progress', (data) => {
      if(self.loadingWithProject){
        self.PROGRESS = 70 + Math.round(data.progress * 30);
        self._onProgress();
      }else{
        if(self.onProgressDetail){
          self.onProgressDetail(0.2 + (data.progress * 0.8));
        }
      }
    });

    this.imagesQueue.addEventListener('complete', (data) => {
      self.DATA_PROJECTS_DETAILS[slug].imagesLoaded = true;

      if(self.loadingWithProject){
        self.loadingWithProject = null;
      }else{
        if(self.onCompleteDetail)
          self.onCompleteDetail();
      }
    });

    this.imagesQueue.load();
  }



  static load3DModel(){
    var self = this;

    if(window.IS_CRAWLER){
      if(self.loadingWithProject){
        self.loadProjectDetail(self.loadingWithProject,self._onProgress,self._onComplete);
      }else{
        self.PROGRESS = 100;
        self._onProgress();
      }
      return;
    }

    // if(!window.MOBILE_DETECT.mobile()){
      // JSZipUtils.getBinaryContent((!window.MOBILE_DETECT.mobile()) ? '/static/huia-model/model.jd.zip' : '/static/huia-model/lowpoly/model.jd.zip', function(err, data) {
      JSZipUtils.getBinaryContent((!window.MOBILE_DETECT.mobile()) ? '/static/huia-model/model.jd.zip' : '/static/huia-model/head.jd.zip', function(err, data) {
          if(err) {
              throw err; // or handle err
          }
          self.PROGRESS = 80;
          if(self.loadingWithProject){
            self.PROGRESS = Math.round(self.PROGRESS/2);
          }
          self._onProgress();
          JSZip.loadAsync(data).then(function (zip) {
            self.PROGRESS = 90;
            if(self.loadingWithProject){
              self.PROGRESS = Math.round(self.PROGRESS/2);
            }
            self._onProgress();
              zip.file("model.jd").async("string").then(function(txt){
                ContentLoader.DATA_MODEL_HUIA = JSON.parse(txt);
                self.PROGRESS = 100;
                if(self.loadingWithProject){
                  self.PROGRESS = Math.round(self.PROGRESS/2);
                }
                self._onProgress();



                if(self.loadingWithProject){
                  self.loadProjectDetail(self.loadingWithProject,self._onProgress,self._onComplete);
                }

                // zip.file("feather.jd").async("string").then(function(txt){
                //   ContentLoader.DATA_MODEL_FEATHER = JSON.parse(txt);
                //   self.PROGRESS = 100;
                //   self._onProgress();
                // });
              });
              // console.log(file["model."])
          });
      });
    // }else{
    //   self.PROGRESS = 100;
    //   self._onProgress();
    // }
  }

  static getRandomMessage(array){
    var rand = Math.floor(Math.random() * (array.length-1));
    return array[rand];
  }
}


export default ContentLoader;
