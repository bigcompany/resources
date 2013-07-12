var resource = require('resource'),
    cli = resource.define('cli');

var logger = resource.logger;

cli.schema.description = "provides a command line interface";
cli.started = false;

cli.method('start', start, {
  "description": "starts the big command line interface"
});

function start (callback) {

  //
  // Don't allow a user to use the cli to call it's own start method
  //
  if(cli.started) {
    logger.warn('it looks like you are trying to start the cli inside the cli');
    logger.warn("i can't allow you to do that");
    process.exit();
  }
  //
  // TODO: ascii art here
  //
  cli.started = true;
  cli.router = createRouter(resource.resources);
  cli.route = router.route;
  callback(null, router);
};

//
// Miniature cli router which works sufficiently for our use cases
//
var router = {
  _routes: {
  },
  route: function (_command) {

    //
    // Use either the supplied command, or the command from argv
    //
    _command = _command || argv._.join(' ');

    var routes = router._routes,
        part,
        c = _command.split(' ');

    //
    // If there is no match for the command, assume its because additional arguments,
    // have been supplied after the command and use those additional arguments as method arguments
    //
    // Ex:
    //
    //    big creature create bobby
    //
    //  will not be found, and instead attempt
    //
    //    big creature create
    //    controller.create("bobby")
    //
    if(typeof routes[_command] !== 'function') {
      part = c[c.length - 1];
      c.pop();
    }
    //
    // Join the command array back into a string
    //
    c = c.join(' ');

    //
    // If the command is a function, execute it
    //
    if(typeof routes[c] === 'function') {
      routes[c](part);
    } else {
      //
      // If not, we have a missing method
      //
      logger.error('resource ' + c.magenta +  ' not found')
    }
  },

  //
  // binds a command a function to the routing table
  //
  on: function (_command, fn){
    this._routes[_command] = fn;
  }

}

var createRouter = function (resources, options, callback) {

  var prompt      = require('prompt-lite'),
      _resource   = require('resource'),
      colors      = require('colors'),
      controller  = require('./lib/controller')
      argv        = require('optimist').argv;

  //
  // Set up prompt overrides with optimist.argv (default)
  //
  prompt.override = argv;

  cli.prompt = prompt;

  options = options || {};

  resources = resources || {};

  //
  // Convert resources into array for sorting
  //
  if(typeof resources === 'object' && !Array.isArray(resources)) {
    var arr = [];
    var keys = Object.keys(resources);
    keys = keys.sort();
    keys.forEach(function(key){
      arr.push(resources[key]);
    });
    resources = arr;
   }

  //
  // Create default routes
  //

  //
  // Root, run when no known resources are passed in
  //
  router.on("", function() {
    // check to see if any arguments exist
    if (argv._.length > 0) {
      // attempt to use that argument as a resource
      var name = argv._[0];
      resource.use(name);
    }

    if (resources.length) {
      logger.info('resources'.magenta);

      resources.forEach(function (resource) {
        logger.info(' - ' + resource.name.magenta + ' ' + (resource.schema.description || '').grey);
      });

      logger.help('type ' + 'a ' + 'resource'.magenta + ' name to explore it');
    }

    if(Object.keys(router._routes).length > 1) {
      logger.info('commands'.magenta);
      Object.keys(router._routes).forEach(function(route){
        if (route.length) {
          logger.info(' - ' + route.magenta);
        }
      });
      logger.help('type a ' + 'command'.magenta + ' to execute it');
    } else {
      logger.error('no commands or resources are available');
    }
  });

  //
  // Create routes for all resources and resource methods
  //
  resources.forEach(function (resource) {
    var entity = resource.name
        param = options.param || ':id';
    //
    // Route for resource name itself.
    // Shows help / additional instructions for next level of commands
    //
    router.on(entity, function() {
      if (typeof resource.schema.description !== 'undefined') {
        logger.help(resource.schema.description)
      }

      //
      // The root level of a resource,
      // show all immediate child commands
      //
      if (Object.keys(resource.methods).length === 0) {
        logger.warn('no methods available for ' + resource.name.magenta);
      } else {
        logger.info(resource.name.magenta + ' methods:')
        for (var m in resource.methods) {
          if(typeof resource.methods[m] === "function") {
            var self = this,
                desc = '';
            if(typeof resource.methods[m].schema !== 'undefined' && resource.methods[m].schema.description !== 'undefined') {
              desc = resource.methods[m].schema.description || '';
            }
            logger.info(' - ' + m.magenta + ' ' + desc.grey );
          }
        }
        logger.help('type the ' + 'method'.magenta + ' name');
      }
    });

    //
    // Find every function on the resource,
    // which has the "remote" property set to "true"
    //
    for (var m in resource.methods) {
      //console.log(resource.methods[mappings[m]], m)
      var _method = resource.methods[m];
      if(typeof _method === "function") {
        var self = this;
        //
        // Must maintain scope of m in callback closure
        //
        (function(m){
          router.on(entity + ' ' + m, function(_id){
            var defaults = {},
                _args    = [];
            if(typeof controller[m] === 'function') {
              controller[m](_id, {}, resource);
            } else {
              controller.resourceMethod(_id, m, resource);
            }
          });
        })(m);
      }
    }
  });

  if (typeof callback === 'function') {
    return callback(null, router);
  } else {
    return router;
  }

};

cli.method('createRouter', createRouter); // TODO: add schema for method

function promptToList (resource, callback) {
  var property = {
    name: 'yesno',
    message: 'list all ' + (resource.name + 's') + '?', // TODO: Fix inflection
    validator: /y[es]*|n[o]?/,
    warning: 'Must respond yes or no',
    default: 'yes'
  };
  prompt.get(property, function(err, result){
    if (err || result.yesno !== "yes") {
      logger.warn('action cancelled')
      return;
    }
    callback(null, result);
  });
}

exports.route = router.route;

cli.dependencies = {
  "prompt-lite": "0.1.x",
  "optimist": "0.3.5",
  "colors": "*"
};

exports.cli = cli;
