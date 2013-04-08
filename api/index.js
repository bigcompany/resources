//
// TODO: Finish this resource
// TODO: Add HTTP integration tests for REST endpoints
//

var resource = require('resource'),
    api = resource.define('api'),
    path = require('path');

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

  var resources = options.resources,
      view = resource.view.create({ path: path.join(__dirname, 'view') });

  view.load();

  resource.http.app.get('/api/:resource', function(req, res) {
    handle({
      resource: req.param('resource'),
      action: "GET"
    }, req, res);
  });
  resource.http.app.post('/api/:resource', function(req, res) {
    handle({
      resource: req.param('resource'),
      action: "POST"
    }, req, res);
  });
  resource.http.app.put('/api/:resource', function(req, res) {
    handle({
      resource: req.param('resource'),
      action: "PUT"
    }, req, res);
  });

  resource.http.app.get('/api/:resource/:method', function(req, res) {
    handle({ 
      resource: req.param('resource'),
      method: req.param('method'),
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
  resource.http.app.put('/api/:resource/:method', function(req, res) {
    handle({
      resource: req.param('resource'),
      method: req.param('method'),
      action: "PUT"
    }, req, res);
  });
  resource.http.app.del('/api/:resource/:method', function(req, res) {
    handle({ 
      resource: req.param('resource'),
      method: req.param('method'),
      action: "DELETE"
    }, req, res);
  });

  resource.http.app.get('/api/:resource/:id/:method', function(req, res) {
    handle({ 
      resource: req.param('resource'),
      method: req.param('method'),
      id: req.param('id'),
      action: "GET"
    }, req, res);
  });

  resource.http.app.post('/api/:resource/:id/:method', function(req, res) {
    handle({ 
      resource: req.param('resource'),
      method: req.param('method'),
      id: req.param('id'),
      action: "POST"
    }, req, res);
  });

  resource.http.app.put('/api/:resource/:id/:method', function(req, res) {
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

    //
    // Merge query and form data into a common scope
    //
    Object.keys(req.query).forEach(function (p) {
      data[p] = req.query[p];
    });
    Object.keys(req.body).forEach(function (p) {
      data[p] = req.body[p];
    });
    if (options.id) {
      data.id = options.id;
    }

    if (typeof _method === 'undefined' && !options.id) {
      if (options.method) {
        data.id = options.method;
      }

      if (options.action === 'GET' && options.method) {
        _method = _resource.methods.get;
        options.method = 'get';
      }
      if (options.action === 'POST') {
        _method = _resource.methods.create;
        options.method = 'create';
      }
      if (options.action === 'PUT') {
        _method = _resource.methods.update; //?
        options.method = 'update';
      }
      if (options.action === 'DELETE') {
        _method = _resource.methods.destroy; //?
        options.method = 'destroy';
      }
    }

    // todo: alter _method based on options.action
    if (typeof _method === 'undefined') {
      view.routes.render();
      view.routes.present({
        title: 'Methods Available',
        routes: Object.keys(_resource.methods).map(function (m) {
          return { name: m, url: '/api/' + options.resource + '/' + m };
        })
      }, function (err, str) {
        if (err) {
          return res.end(JSON.stringify({ message: err.message }));
        }

        if (options.method) {
          res.statusCode = 404;
        }

        res.end(str);
      });
    }
    else {

      if (Object.keys(data).length > 0) {
        //
        // TODO: get should be able to take an options hash and not just a string.
        // We should also have a generalized method for translating back and
        // forth between schema-matched objects and function argument arrays.
        // This is just a hack to make tests pass.
        //
        if (
          Object.keys(data).length === 1 &&
          data.id && (
            options.method === 'get' ||
            options.method === 'destroy'
          )
        ) {
          data = data.id;
        }

        _method(data, finish);
      } else {
        _method(finish);
      }

      function finish(err, result) {
        if (err) {
          if (err.message && err.message.match(/not found/)) {
            res.statusCode = 404;
          }
          else if (err.errors) {
            res.statusCode = 422;
          }
          else {
            res.statusCode = 500;
          }

          if (err.errors) {
            return res.end(JSON.stringify({
              message: err.message,
              validate: {
                errors: err.errors
              }
            }));
          }
          else {
            return res.end(JSON.stringify({
              message: err.message
            }));
          }
        }

        if (result === null) {
          res.statusCode = 204;
        }

        if (options.method === 'create' || options.method === 'update') {
          res.statusCode = 201;
        }

        res.end(JSON.stringify(result));
      }
    }
  };

  resource.http.app.get('/api', function (req, res, next) {
    view.routes.render();
    view.routes.present({
      title: 'Resources Available',
      routes: Object.keys(resource.resources).map(function (r) {
        return { name: r, url: '/api/' + r };
      })
    }, function (err, str) {
      if (err) {
        return res.end(JSON.stringify({ message: err.message }));
      }
      res.end(str);
    });
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
