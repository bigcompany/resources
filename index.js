//
// A collection of useful resources
//
var resources = exports;

var resource = require('resource'),
    fs = require('fs'),
    path = require('path');

//
// Read "/resources/" directory
//
var resourcesPath = __dirname + '/';

var _resources = fs.readdirSync(resourcesPath);

//
// Filter out any potential non-resource files / folders
//
_resources = _resources.filter(function (val) {
  var isResource = false;
  val = resourcesPath + val;
  isResource = resource.isResource(val);
  return isResource;
});

//
// Export `resources` on the module scope to store all currently loaded resources
//
exports.resources = {};

//
// For every resource, use it and export it
//
_resources.forEach(function (r) {
  exports.resources[r] = resource.use(r);
});