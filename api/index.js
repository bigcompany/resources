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

api.middle = function (req, res, next) {
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

function handle(options, req, res) {

  if (Object.keys(options).length === 1) {
    //
    // Route is '/api'
    //
    return reply(null, {
      resources: Object.keys(resource.resources).map(function (r) {
        return { resource: r, url: '/api/' + r };
      })
    });
  }

  var _resource = resource.resources[options.resource],
      _method = _resource.methods[options.method],
      isCrudMethod = false,
      status;

  var data = req.resource.params;

  if (options.id) {
    data.id = options.id;
  }

  //
  // If we are calling a method against an instance, make sure it's
  // actually instantiable.
  //
  if (options.id && options.method && !_resource.methods.get) {
    return reply(new Error(
      'Resource `' + options.resource + '` is not persisted'
    ), null, 400);
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
      status = 404;
    }

    reply(null, { methods: routes }, status);
  }
  else {

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
              status = 201;
            }
            _method(data, finish);
          });
        }

        //
        // Use resource.invoke to ensure resource method gets invoked with correct signature
        //
        return resource.invoke(_method, data, finish);
      } else {
        //
        // Use resource.invoke to ensure resource method gets invoked with correct signature
        //
        return resource.invoke(_method, {}, finish);
      }

      function finish(err, result) {
        if (err) {
          if (err.message && err.message.match(/not found/)) {
            status = 404;
          }
          else if (err.errors) {
            status = 422;
          }
          else {
            status = 500;
          }
        }

        if (result === null) {
          status = 204;
        }

        if (options.method === 'create') {
          status = 201;
        }

        reply(err, result, status);
      }
    }

    function reply(err, result, status) {
      if (typeof status === 'number' || typeof status === 'string') {
        res.statusCode = status;
      }

      res.setHeader('Content-Type', 'application/json');

      if (err) {
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

      res.end(JSON.stringify(result, true, 2));
    }
  }
}
exports.api = api;
