//
// TODO: Finish this resource
// TODO: Add HTTP integration tests for REST endpoints
//

var resource = require('resource'),
    api = resource.define('api');

api.schema.description = "provides a web API for interacting with resources";

api.property('version', {
  "description": "the semantic version of the API",
  "type": "string",
  "default": "v0.0.1"
});

/*
  //
  // TODO: better setting of resources to expose through API,
  // currently hard-coded to use all resource.resources
  //
  api.property('resources', {
    "description": "the resources represented by the api",
    "type": "object",
    "default": resource.resources.creature
  });
*/
api.method('listen', listen, {
  "description": "when the api resource starts",
  "properties": {
    "options": {
      "type": "object",
      "properties": api.schema.properties
    },
    "callback": {
      "description": "the callback executed after server listen",
      "type": "function",
      "required": false
    }
  }
});

function listen (options, callback) {

  var resources = options.resources;

  resource.http.app.get('/api/:resource', function(req, res) {
    handle({
      resource: req.param('resource'),
      action: "GET"
      }, req, res);
  });
  resource.http.app.get('/api/:resource/:method', function(req, res) {
    handle({ 
      resource: req.param('resource'),
      method: req.param('method'),
      action: "GET"
      }, req, res);
  });

  resource.http.app.get('/api/:resource/:method/:id', function(req, res) {
    handle({ 
      resource: req.param('resource'),
      method: req.param('method'),
      id: req.param('id'),
      action: "GET"
      }, req, res);
  });

  resource.http.app.post('/api/:resource/:method', function(req, res) {
    handle({ 
      resource: req.param('resource'),
      method: req.param('method'),
      action: "POST"
    }, req, res);
  });

  resource.http.app.post('/api/:resource/:method/:id', function(req, res) {
    handle({ 
      resource: req.param('resource'),
      method: req.param('method'),
      id: req.param('id'),
      action: "POST"
      }, req, res);
  });

  resource.http.app.del('/api/:resource/:method/:id', function(req, res) {
    handle({ 
      resource: req.param('resource'),
      method: req.param('method'),
      id: req.param('id'),
      action: "DELETE"
      }, req, res);
  });

  resource.http.app.put('/api/:resource/:method/:id', function(req, res) {
    handle({ 
      resource: req.param('resource'),
      method: req.param('method'),
      id: req.param('id'),
      action: "PUT"
    }, req, res);
  });

  function handle(options, req, res) {

    var _resource = resource.resources[options.resource],
        _method   = _resource.methods[options.method];

    var data = {};

    // todo: alter _method based on options.action
    if (typeof _method === 'undefined') {
      var str = "<h1>Methods Available</h1> \n\n";
      var rs = resource.resources;
      for (var m in _resource.methods) {
        str += ('&nbsp;&nbsp;' + m + '<br/>'); // rs[r].methods[m]
      }
      res.end(str);
    } else {
      //
      // Merge query and form data into a common scope
      //
      for(var p in req.query) {
        data[p] = req.query[p];
      }
      if (Object.keys(data).length > 0) {
        _resource.methods[options.method](data.id, function (err, result){
          console.log(err, result)
          res.end(JSON.stringify(result));
        });
      } else {
        _resource.methods[options.method](function (err, result){
          res.end(JSON.stringify(result));
        });
      }
    }
  };

  resource.http.app.get('/api', function (req, res, next) {
    //
    // TODO: Add better HTML view for rendering resource methods as routes
    //
    //var str = JSON.stringify(resource.http.app.routes, true, 2);
    var str = "";
    var rs = resource.resources;
    for(var r in rs) {
      str += ('<a href="/api/' + r + '">' + r + '</a><br/>');
      for (var m in rs[r].methods) {
        str += ('&nbsp;&nbsp; <a href="/api/' + r + '/' + m + '">' + m + '</a><br/>');
      }
    }
    res.end(str);
  });

  resource.http.app.get('/api/' + options.version, function (req, res, next) {
    res.end(JSON.stringify(api, true, 2));
  });

  resource.http.app.get('/api/' + options.version + '/:resource', function (req, res, next) {
    var r = resource.resources[req.param('resource')];
    var obj = resource.toJSON(r);
    res.end(JSON.stringify(obj, true, 2));
  });

  callback(null, resource.http.server);

}

exports.api = api;