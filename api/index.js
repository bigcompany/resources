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
    }
  }
});

function listen (options, callback) {

  var resources = options.resources;

  resource.http.app.get('/api', function(req, res){
    res.end('api home page');
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

    
    // todo: populate with data from request
    var data = {};
    
    // todo: alter _method based on options.action
    
    _resource.methods[_method](data, function(err, result){
      req.end(JSON.stringify(result));
    })
    
  };

  /*
  Object.keys(resources).forEach(function(r){
    // for every resource, create routes for all methods
  });
  */

  resource.http.app.get('/api', function (req, res, next) {
    res.end('welcome to the api explorer');
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
