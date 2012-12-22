var resource  = require('resource'),
    path = require('path'),
    http = resource.define('http');

http.schema.description = "provides an HTTP API";

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

http.method('start', listen, http.listen.schema);

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

//
// TODO: map all http request methods from https://github.com/mikeal/request,
// scroll down to "request(options, callback)" documentation )
//
http.method('request', request, {
  "description": "makes outgoing http client requests",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "uri": {
          "description": "the uri to be requested",
          // can also take object
          "type": "string",
          "required": true
        },
        "qs": {
          "description": "querystring values appended to the uri",
          "type": "object",
          "required": false
        },
        "method": {
          "description": "the HTTP method to use",
          "type": "string",
          "enum": ["GET", "POST", "PUT", "DELETE"]
        },
        "headers": {
          "description": "the http headers for the request",
          "type": "object",
          "required": false
        },
        "body": {
          "description": "the raw body for POST and PUT requests",
          "required": false
          // "type": { "enum": [ "string", "Buffer" ] }
        },
        "form": {
          "description": "form data in the request body",
          "type": "object",
          "required": false
        },
        "json": {
          "description": "JSON data in the request body",
          "type": "object",
          "required": false
        },
        "multipart": {
          "description": "data in a multi-part request",
          "type": "array",
          "required": false
        },
        // TODO: admin view needs to support booleans
        /*
        "followRedirect": {
          "description": "follow redirects",
          "type": "boolean",
          "required": false,
          "default": true
        },
        "followAllRedirects": {
          "description": "follow non-GET redirects",
          "type": "boolean",
          "required": false,
          "default": false
        },*/
        "maxRedirects": {
          "description": "maximum number of redirects to follow",
          "type": "number",
          "required": false,
          "default": 10
        },
        "encoding": {
          "description": "set the text encoding of the request body",
          "type": "string",
          "required": false
        },
        "timeout": {
          "description": "how long to wait (in ms) before the request times out",
          "type": "number",
          "required": false
        }/*,
        "strictSSL": {
          "description": "require that SSL certificates be valid",
          "type": "boolean",
          "required": false,
          "default": false
        },
        "jar": {
          "description": "remember cookie information",
          "type": "boolean",
          "required": false,
          "default": true
        }*/
        // TODO: pool
        // TODO: proxy
        // TODO: oauth
        // TODO: aws
      }
    }
  }
});

function request (options, callback) {
  var requestModule = require('request');
  requestModule(options, callback);
}

exports.http = http;

exports.dependencies = {
  "connect": "2.7.1",
  "express": "3.0.4",
  "request": "2.12.0"
};
