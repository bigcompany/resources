var resource  = require('resource'),
    path = require('path'),
    http = resource.define('http');

http.schema.description = "provides an HTTP API";
http.property("port", {
  "type": "number",
  "default": 8888,
  "description": "the port to listen on"
});

http.property("host", {
  "type": "string",
  "default": "0.0.0.0", 
  "description": "the host interface to listen on"
});

http.property("root", {
  "type": "string",
  "default": resource.helper.appDir + '/public' // TODO: smarter detection of process.cwd() versus __dirname?
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
      express = require('express'),
      app = express();

  //
  // connectr module is used to enable management of Connect middleware stack
  //
  app = require('./lib/connectr').patch(app);

  //
  // map the connectr methods for middleware management
  //
  app.before = app.before;
  app.after = app.after;
  app.first = app.first;
  app.last = app.last;

  app.use(connect.favicon(__dirname + '/favicon.png')).as('favicon');

  app.use(connect.logger('dev')).as('logger');
  app.use(connect.cookieParser()).as('cookieParser');
  app.use(connect.session({ secret: 'my secret here' })).as('session');

  if(options.enableUploads === true) {
    app
    .use(express.bodyParser({
      uploadDir: __dirname + '/uploads',
      keepExtensions: true
    })).as('bodyParser');
  }

  app.use(mergeParams).as('mergeParams');

  //
  // Basic virtual host support
  //
  if (resource.virtualhost) {
    app.use(resource.virtualhost.middle).as('virtualhost');
  }

  //
  // API middleware
  //
  if (resource.api) {
    app.use(resource.api.middle).as('middle');
  }

  //
  // Explicitly use the app.router middleware here so that routes take
  // precedence over the view middleware
  //
  app.use(app.router).as('router');

  //
  // Use view middleware
  //
  if (resource.view) {
    // Remark: For now, do not automatically load middleware
    // This is a somewhat useful sugar sytnax, but its slightly confusing right now
    // app.use(resource.view.middle());
  }

  finish();

  function finish() {

    if (typeof options.root !== 'undefined') {
      //
      // Use http root passed in through options
      //
      app
        .use(connect.static(options.root)).as("static");;
    }

    //
    // Use the default http root that ships with resources
    //
    // app.use(connect.static(__dirname + '/public')).as("static");

    http.server = server = require('http').createServer(app).listen(options.port, options.host, function () {
     callback(null, server);
    });

    //
    // Bind app instance to http resource
    //
    http.app = app;
    http.server = server;
  }
}

//
// Middleware for merging all querystring / request.body and route parameters,
// into a common scope bound to req.resource.params
//
function mergeParams (req, res, next) {

  req.resource = req.resource || {};
  req.resource.params = {};

  //
  // Iterate through all the querystring and request.body values and
  // merge them into a single "data" argument
  //
  if (typeof req.params === 'object') {
    Object.keys(req.params).forEach(function (p) {
      req.resource.params[p] = req.param(p);
    });
  }

  if (typeof req.query === 'object') {
    Object.keys(req.query).forEach(function (p) {
      req.resource.params[p] = req.query[p];
    });
  }

  Object.keys(req.body).forEach(function (p) {
    req.resource.params[p] = req.body[p];
  });

  next();
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
          "enum": [
            "GET",
            "HEAD",
            "POST",
            "PUT",
            "DELETE",
            "TRACE",
            "OPTIONS",
            "CONNECT",
            "PATCH"
          ]
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
          "type": "any",
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

http.dependencies = {
  "connect": "2.7.1",
  "express": "3.0.4",
  "request": "2.12.0"
};

exports.http = http;
