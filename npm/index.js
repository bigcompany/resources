var resource = require('resource'),
    npm = resource.define('npm');

npm.schema.description = "for interacting with the Node Package Manager api";

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

function publish (path, callback) {
  var npmModule = require('npm');
  npmModule.load({ exit: false }, function (err) {
    // TODO: how to add flags such as --force ?
    npmModule.commands.publish([path], function (err, result) {
      callback(err, result);
    });
  });
};

npm.dependencies = {
  "npm": "*"
};

exports.npm = npm;

/*

TODO: 

npm.install = function (hook, callback) {
  npmModule.load({exit:false}, function (err) {
    npmModule.install(package, function (err, result) {
      callback(err, result);
    });
  });
}

npm.link = function (hook, callback) {
  npmModule.load({exit:false}, function (err) {
    npmModule.link(hook, function (err, result) {
      callback(err, result);
    });
  });
}

npm.search = function (keywords, callback) {
  npmModule.load({exit:false}, function (err) {
    npmModule.commands.search(keywords, function (err, result) {
      callback(err, result);
    });
  });
}

*/