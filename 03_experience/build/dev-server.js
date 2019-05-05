require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var prerender = require('prerender-node')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

//console.log("loading webpackconfig",webpackConfig.module.rules);

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()



var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

prerender.set('prerenderServiceUrl', 'http://localhost:2095/?url=')
prerender.set('removeScriptTags', false)
app.use(prerender)
// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)





// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
//app.use(staticPath, express.static('./static'),{index:false,extensions:['bin']})
//express.static.mime.default_type = "application/x-huia-experience";
//var router = express.Router([strict=true])
//app.use(staticPath, express.static('./static',[extensions=[''],index=false,redirect=false]))
//app.use(staticPath, express.static('./static'))
app.use(staticPath, express.static('./static',{index:false,extensions:['bin'],fallthrough:false,redirect:false,dotfiles:"allow"}))
console.log('static path',staticPath)
//app.use(staticPath, express.static('./static',{index:false,extensions:['bin']}))

var uri = 'http://localhost:' + port;

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

//app.all(/.*/, function(req, res, next) {
app.all('*', function(req, res, next) {
  var host = req.header("host");
  var originalUrl = req.originalUrl;

  // first, check last slash
  console.log(originalUrl.charAt(originalUrl.length-1));
  if(originalUrl.charAt(originalUrl.length-1) != "/"){
    originalUrl = originalUrl + "/";
  }

  if(host.indexOf('huia.com.br') == -1){
    res.redirect(301, host + originalUrl);
    next();
    return;
  }

  var b = false;
  if (!host.match(/^www\..*/i)) {
    host = "www." + host;
    b = true;
  }

  if (!b) {
    next();
  } else {
    res.redirect(301, req.protocol + "://www." + host + originalUrl);
  }
});

app.get('/robots.txt', function(req,res){
  res.sendFile('robots.txt', {root: './static'});
});


app.get('/sitemap.xml', function(req,res){
  res.sendFile('sitemap.xml', {root: './static'});
});

console.log('> Starting dev server...')
// devMiddleware.waitUntilValid(() => {
//   console.log('> Listening at ' + uri + '\n')
//
//   // when env is testing, don't need open it
//   if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
//     opn(uri)
//   }
//   _resolve()
// })
console.log(uri);
var server = app.listen(port);

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
