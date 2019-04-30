// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MobileDetect from 'mobile-detect'
import VueTouch from 'vue-touch-easyhi'
import VueClipboards from 'vue-clipboards'
// import VueTooltip from 'v-tooltip'
import StringsHelper from './helpers/StringsHelper'
import Globals from './core/Globals'
import ContentLoader from './loaders/ContentLoader'

import 'createjs-soundjs';

Vue.use(VueTouch);
Vue.use(VueClipboards);


// Vue.use(VueTooltip);

Vue.config.productionTip = false;

if(window.location.href.indexOf("localhost") > -1){
  window.API_URL = "http://52.42.29.202:2052/api/";
  window.ASSETS_URL = "http://52.42.29.202:2052/";
  window.ROOT_URL = "http://localhost:8080/";
  window.WS_URL = "ws://localhost:2657";
}else if(window.location.href.indexOf("172") > -1){
  window.API_URL = "http://172.20.129.21:3000/api/";
  window.ASSETS_URL = "http://172.20.129.21:3000/";
  window.ROOT_URL = "http://172.20.129.21:8080/";
  window.WS_URL = "ws://172.20.129.21:2657";
}else if(window.location.href.indexOf("192") > -1){
  window.API_URL = "http://52.42.29.202:2052/api/";
  window.ASSETS_URL = "http://52.42.29.202:2052/";
  window.ROOT_URL = "http://192.161.1.101:8080/";
  window.WS_URL = "ws://localhost:2657";
}else if(window.location.href.indexOf("http://107.170.19.138/") > -1) {
  window.API_URL = "http://107.170.19.138:3001/api/";
  window.ASSETS_URL = "http://107.170.19.138:3001/";
  window.ROOT_URL = "http://107.170.19.138/";
  window.WS_URL = "ws://107.170.19.138:2657";
}else if(window.location.href.indexOf("https://www.huia.com.br/") > -1) {
  window.API_URL = "https://www.huia.com.br:3001/api/";
  window.ASSETS_URL = "https://www.huia.com.br:3001/";
  window.ROOT_URL = "https://www.huia.com.br/";
  window.WS_URL = "ws://www.huia.com.br:2657";
}else if(window.location.href.indexOf("http://52.42.29.202") > -1) {
  window.API_URL = "http://52.42.29.202:2052/api/";
  window.ASSETS_URL = "http://52.42.29.202:2052/";
  window.ROOT_URL = "http://52.42.29.202/";
  window.WS_URL = "ws://52.42.29.202:2086";
}else if(window.location.href.indexOf("http://sitenovo.huia.com.br") > -1) {
  window.API_URL = "http://api.huia.com.br/api/";
  window.ASSETS_URL = "http://api.huia.com.br/";
  window.ROOT_URL = "http://sitenovo.huia.com.br/";
  window.WS_URL = "ws://api.huia.com.br:2086";
}else if(window.location.href.indexOf("http://www.huia.com.br") > -1) {
  window.API_URL = "http://api.huia.com.br/api/";
  window.ASSETS_URL = "http://api.huia.com.br/";
  window.ROOT_URL = "http://www.huia.com.br/";
  window.WS_URL = "ws://api.huia.com.br:2086";
}else if(window.location.href.indexOf("http://www.sitenovo.huia.com.br") > -1) {
  window.API_URL = "http://api.huia.com.br/api/";
  window.ASSETS_URL = "http://api.huia.com.br/";
  window.ROOT_URL = "http://www.sitenovo.huia.com.br/";
  window.WS_URL = "ws://www.sitenovo.huia.com.br:2086";
}
else if(window.location.href.indexOf("https://sitenovo.huia.com.br") > -1) {
  window.API_URL = "https://api.huia.com.br/api/";
  window.ASSETS_URL = "https://api.huia.com.br/";
  window.ROOT_URL = "https://www.sitenovo.huia.com.br/";
  window.WS_URL = "ws://sitenovo.huia.com.br:2086";
}

router.beforeEach((to, from, next) => {
  ga('send', 'pageview', to.path);
  if(window.experiencePlayed){
    document.body.style.display = "none";
    location.href = window.ROOT_URL + ((to.path == "/") ? "" : to.path);
  }else{
    ContentLoader.setMetaTags(to.path);
    next();
  }
});


window.MOBILE_DETECT = new MobileDetect(window.navigator.userAgent);

function botCheck(){
var botPattern = "(googlebot\/|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|HeadlessChrome|bHeadlessChrome|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)";
          var re = new RegExp(botPattern, 'i');
          var userAgent = navigator.userAgent;
          if (re.test(userAgent)) {
              return true;
          }else{
            return false;
          }
}

window.IS_CRAWLER = botCheck();
// window.IS_CRAWLER = true;

(function(url) {
  // Create a new `Image` instance
  var image = new Image();

  image.onload = function() {
    // Inside here we already have the dimensions of the loaded image
    var style = [
      // Hacky way of forcing image's viewport using `font-size` and `line-height`
      'font-size: 10px;',
      'font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif;',
      'color: #bbbbbb;',
      'font-weight: bold;',
      'line-height: ' + this.height + 'px;',

      // Hacky way of forcing a middle/center anchor point for the image
      'padding-top: ' + this.height*.5+'px;',
      'padding-bottom: ' + this.height * .5 + 'px;',
      'padding-left: 70px;',
      'padding-right: ' + this.width * .5 + 'px;',

      // Set image dimensions
      'background-size: ' + this.width + 'px ' + this.height + 'px;',

      // Set image URL
      'background: #000 url('+ url +') no-repeat 10px 5px;',
      'background-repeat: no-repeat;'
     ].join(' ');

     console.log('%c tecnologia@huia.com.br', style);
     console.log('');
  };

  // Actually loads the image
  image.src = url;
})(window.ROOT_URL + 'static/images/console.jpg');

var debug = StringsHelper.getUrlParameter("debug");
Globals.DEBUG = (debug == "true");
Globals.SHOW_INTRO = (localStorage.getItem("introhuia") == "ok") ? false : true;
// Globals.SHOW_INTRO = true;


if(!Globals.SHOW_INTRO){
  var time = new Date().getTime();
  var dif = (time/1000) - (parseInt(localStorage.getItem("lastShownIntroTime","0"))/1000);

  if(dif > 40000){
    Globals.SHOW_INTRO = true;
  }
}

// Globals.SHOW_INTRO = true;

Globals.USER_DATA.userCity = localStorage.getItem("userCity", "");
Globals.USER_DATA.userCountry = localStorage.getItem("userCountry", "");
Globals.USER_DATA.userCountryName = localStorage.getItem("userCountryName", "");

if(Globals.SHOW_INTRO){
  localStorage.setItem("lastShownIntroTime", new Date().getTime().toString());
}

localStorage.setItem("introhuia", "ok");

// Globals.SHOW_INTRO = true;

Array.prototype.rotate = (function() {
    // save references to array functions to make lookup faster
    var push = Array.prototype.push,
        splice = Array.prototype.splice;

    return function(count) {
        var len = this.length >>> 0, // convert to uint
            count = count >> 0; // convert to int

        // convert count to value in range [0, len)
        count = ((count % len) + len) % len;

        // use splice.call() instead of this.splice() to make function generic
        push.apply(this, splice.call(this, 0, count));
        return this;
    };
})();

// FastClick.attach(document.body);
/* eslint-disable no-new */
window.onload = function(){
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  })
}
