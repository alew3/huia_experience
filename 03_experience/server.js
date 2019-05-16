#!/usr/bin/env node

/**
 * Module dependencies.
 */

/**
 * Get port from environment and store in Express.
 */
var express = require('express');
var app = express();
var debug = require('debug');
var http = require('http');
var port = normalizePort(process.env.PORT || '8080');
var server = http.createServer(app);
var html = require('html');
var cons = require('consolidate');
var prerender = require('prerender-node');
var useragent = require('express-useragent');
var sm = require('sitemap');

prerender.set('prerenderServiceUrl', 'http://prerender.huia.com.br/?url=')
app.use('/static', express.static(__dirname + '/static'));
app.use(useragent.express());
app.use(prerender);
app.engine('html', cons.underscore);
// set .html as the default extension
app.set('view engine', 'html');


app.all(/.*/, function(req, res, next) {
  var host = req.header("host");
  var originalUrl = req.originalUrl;
  var newHost = host;
  var b = false;

  var params = null;


  if(originalUrl.split("?").length > 1){
    originalUrl = originalUrl.split("?")[0];
    params = req.originalUrl.split("?")[1];
  }



  // first, check last slash
  if(host.indexOf('huia.com.br') == -1){
    if(originalUrl.charAt(originalUrl.length-1) != "/" && originalUrl != ""){
      originalUrl = originalUrl + "/";
      res.redirect(301, req.protocol + "://" + host + originalUrl + (params ? "?"+params : ""));
      return;
    }{
      next();
      return;
    }
  }

  if(originalUrl.charAt(originalUrl.length-1) != "/" && originalUrl != ""){
    b = true;
    originalUrl = originalUrl + "/";
  };

  // if (!host.match(/^www\..*/i)) {
  //   newHost = "www." + host;
  //   b = true;
  // }

  if (!b) {
    next();
  } else {
    res.redirect(301, req.protocol + "://"+ newHost + originalUrl + (params ? "?"+params : ""));
  }
});

app.get('/robots.txt', function(req,res){
  res.sendFile('robots.txt', {root: './static'});
});


app.get('/admin', function(req,res){
  res.redirect("http://52.42.29.202:2052/keystone/");
});

app.get('/sitemap.xml', function(req,res){
  res.sendFile('sitemap.xml', {root: './static'});
});

app.get('/googlee1c9a00160e405d0.html', function(req,res){
  res.sendFile('googlee1c9a00160e405d0.html', {root: './static'});
});



app.get('*', function(req, res, next) {
  var fullUrl = req.protocol + '://' + req.get('host');
  res.render(__dirname + "/index.html");
});


app.set('port', port);

/**
 * Create HTTP server.
 */


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, '127.0.0.1');
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
