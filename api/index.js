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

  var resources = options.resources;

  var api = function (req, res, next) {
    var url = require('url'),
        data = {},
        route;

    route = url.parse(req.url)
     .pathname
     .split('/')
     .filter(function (_) { return _ !== ''; })
    ;

    if (route[0] !== 'api') {
      return next();
    }

    route.shift();

    if (route.length) {
      data.resource = route.shift();
    }
    else {
      //
      // Route is '/api'
      //
      res.setHeader('Content-Type', 'application/json');

      return res.end(JSON.stringify({
        resources: Object.keys(resource.resources).map(function (r) {
          return { resource: r, url: '/api/' + r };
        })
      }, true, 2));
    }

    if (route.length) {
      data.method = route.shift();
    }

    if (route.length) {
      data.id = data.method;
      data.method = route.shift();
    }

    data.action = req.method;

    handle(data, req, res);
  };

  resource.http.app.use(api);
  resource.api.middleware = api;

  callback(null, resource.http.server);

  function handle(options, req, res) {

    var _resource = resource.resources[options.resource],
        _method = _resource.methods[options.method],
        isCrudMethod = false;

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

    //
    // Handle cases where options.method is actually an id and we want to
    // infer the method from the HTTP method
    //
    if (typeof _method === 'undefined' && !options.id) {
      if (options.method) {
        data.id = options.method;
      }

      if (options.action === 'GET' && options.method) {
        _method = _resource.methods.get;
        options.method = 'get';
      }
      if (options.action === 'POST' || options.action === 'PUT') {
        _method = _resource.methods.updateOrCreate;
        options.method = 'updateOrCreate';
      }
      if (options.action === 'DELETE') {
        _method = _resource.methods.destroy; //?
        options.method = 'destroy';
      }
    }

    //
    // Methods for which /:resource/:id/:method do not require an implicit
    // call to r['get'] (ie, "crud methods")
    //
    isCrudMethod = [
      'get',
      'create',
      'update',
      'updateOrCreate',
      'destroy'
    ].some(function (method) {
      return options.method !== method;
    });

    //
    // Show a list of available methods
    //
    if (typeof _method === 'undefined') {
      var routes;

      routes = Object.keys(_resource.methods).map(function (m) {
        return { method: m, url: '/api/' + options.resource + '/' + m };
      });

      if (options.method) {
        res.statusCode = 404;
      }

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ methods: routes }, true, 2));
    }
    else {

      if (
        _method.schema &&
        _method.schema.properties &&
        _method.schema.properties.options &&
        _method.schema.properties.options.properties
      ) {
        var props = _method.schema.properties.options.properties;

        Object.keys(data).forEach(function (p) {
          if (props && props[p] && props[p].type === 'number') {
            var coerced = parseFloat(data[p], 10);

            if (coerced.toString() !== 'NaN') {
              data[p] = coerced;
            }
          }
        });
      }

      if (typeof options.id !== 'undefined' && !isCrudMethod) {
        _resource.methods.get(options.id, function (err, inst) {
          if (err) {
            return finish(err);
          }
          Object.keys(inst).forEach(function (p) {
            data[p] = inst[p];
          });

          _method(data, finish);
        });
      }
      else {

        if (Object.keys(data).length > 0) {
          //
          // Do a get in order to set the status code correctly
          //
          if (options.method === 'updateOrCreate' && data.id) {
            return _resource.methods.get(data.id, function (err) {
              if (err && err.message && err.message.match('not found')) {
                res.statusCode = 201;
              }
              _method(data, finish);
            });
          }

          //
          // TODO: get should be able to take an options hash and not just a
          // string. We should also have a generalized method for translating back
          // forth and between schema-matched objects and function argument
          // arrays. This is just a hack to make tests pass.
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
          res.setHeader('Content-Type', 'application/json');

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
                errors: err.errors
              }, true, 2));
            }
            else {
              return res.end(JSON.stringify({
                message: err.message
              }, true, 2));
            }
          }

          if (result === null) {
            res.statusCode = 204;
          }

          if (options.method === 'create') {
            res.statusCode = 201;
          }

          res.end(JSON.stringify(result, true, 2));
        }
      }
    }
  }
}

exports.api = api;
