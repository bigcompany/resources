var resource = require('resource'),
    npm = resource.define('npm');

npm.schema.description = "for interacting with the Node Package Manager api";

function publish (path, callback) {
  var _npm = require('npm');
  _npm.load({ exit: false }, function (err) {
    // TODO: how to add flags such as --force ?
    _npm.commands.publish([path], function (err, result) {
      callback(err, result);
    });
  });
}
npm.method('publish', publish, {
  "description": "publishes a package to npm based on path",
  "properties": {
    "path": {
      "type": "string",
      "required": true
    },
    "callback": {
      "type": "function",
      "required": true
    }
  }
});

function install (packages, callback) {
  var _npm = require('npm');
  _npm.load({ exit: false }, function (err) {
    _npm.commands.install(packages, callback);
  });
}
npm.method('install', install, {
  description: "installs an npm package",
  properties: {
    packages: {
      type: "array",
      items: {
        type: "string"
      },
      required: true
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
