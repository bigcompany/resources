var resource  = require('resource'),
    path = require('path'),
    http = resource.define('http');

http.schema.description = "provides an HTTP server API";

http.property("port", {
  "type": "number",
  "default": 8888,
  "description": "the port to listen on "
});

http.property("host", {
  "type": "string",
  "default": "0.0.0.0", 
  "description": "the host interface to listen on"
});

http.property("root", {
  "type": "string",
  "default": process.cwd() + '/public' // TODO: smarter detection of process.cwd() versus __dirname?
});

http.method('listen', listen, {
  "description": "starts a listening http server",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "port": http.schema.properties['port'],
        "host": http.schema.properties['host'],
        "root": http.schema.properties['root'],
        "enableUploads": {
          "type": "boolean",
          "default": true
        }
      }
    },
    "callback": {
      "description": "the callback executed after server listen",
      "type": "function",
      "required": false
    }
  }
});

function listen (options, callback) {
  options = options || {};

  var server;

  var connect = require('connect'),
      express = require('express');

  var app = express();

  //
  // Basic virtual host support
  //
  if (resource.virtualhost) {
    app.use(function(req, res, next){
      var host = req.headers.host.split(':');
      host = host[0];
      resource.virtualhost.find({ host: host }, function(err, results) {
        if (err || results.length === 0) {
          return next();
        }
        connect.static(path.resolve(process.cwd() + results[0].path))(req, res, next);
      });
    });
  }

  /* TODO: finish resource.view middleware
  app.use(function (req, res, next) {
  });
  var view = resource.view.create({ path: process.cwd() + '/view'});
  view.load();

  //console.log(view);
  //console.log(req.url);
  var name = "index";
  if (req.url === "/") {
    name = "index";
  }
  if(typeof view[name] === "undefined") {
    return next();
  }
  var str = view[name].render({});
  str = view[name].present({}, function (err, str) {
    res.end(str);
  });
  */

  if(typeof options.root !== 'undefined') {
    app
      .use(connect.static(options.root))
      .use(connect.directory(options.root));
  }

  app
    .use(connect.favicon(__dirname + '/favicon.png'))
    .use(connect.logger('dev'))
    .use(connect.cookieParser())
    .use(connect.session({ secret: 'my secret here' }));

  if(options.enableUploads === true) {
    app
    .use(express.bodyParser({
      uploadDir: __dirname + '/uploads',
      keepExtensions: true
    }));
  }


  http.server = server = require('http').createServer(app).listen(options.port, options.host, function () {
   callback(null, server);
  });

  app.get('/', function (req, res){
    res.end('home');
  });

  //
  // Bind app instance to http resource
  //
  http.app = app;
  http.server = server;

}

exports.http = http;

exports.dependencies = {
  "connect": "2.7.0",
  "express": "2.5.11"
};
