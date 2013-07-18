var resource = require('resource'),
    npm = resource.define('npm');

npm.schema.description = "for interacting with the Node Package Manager";

function publish (options, callback) {
  var _npm = require('npm'),
      path = options.path;
  // remove path from options so it doesn't affect load
  delete options.path;
  // load npm config
  _npm.load(options, function (err) {
    if (err) { return callback(err); }
    // run npm publish of path
    _npm.commands.publish([path], callback);
  });
}
npm.method('publish', publish, {
  description: "publishes a package to npm based on path",
  properties: {
    options: {
      path: {
        type: "string",
        required: true
      },
      force: {
        description: "clobber previously published versions",
        type: "boolean"
      }
    },
    callback: {
      type: "function",
      required: true
    }
  }
});

function install (options, callback) {
  var _npm = require('npm'),
      packages = options.packages;
  // remove packages from options so it doesn't affect load
  delete options.packages;
  // load npm config
  _npm.load(options, function (err) {
    if (err) { return callback(err); }
    // run npm publish of path
    _npm.commands.install(packages, callback);
  });
}
npm.method('install', install, {
  description: "installs a package",
  properties: {
    options: {
      packages: {
        type: "array",
        items: {
          type: "string"
        },
        required: true
      },
      prefix: {
        description: "the location to install global items. forces non-global commands to run in the specified folder.",
        type: "string"
      }
    },
    callback: {
      type: "function",
      required: true
    }
  }
});

/*

TODO: 

npm.link = function (hook, callback) {
  _npm.load({exit:false}, function (err) {
    _npm.link(hook, function (err, result) {
      callback(err, result);
    });
  });
}

npm.search = function (keywords, callback) {
  _npm.load({exit:false}, function (err) {
    _npm.commands.search(keywords, function (err, result) {
      callback(err, result);
    });
  });
}

*/

npm.dependencies = {
  "npm": "*"
};

exports.npm = npm;
