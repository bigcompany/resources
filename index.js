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
var npmResourcesPath = require.resolve('resources').replace('index.js', '');

var _resources = fs.readdirSync(npmResourcesPath);

//
// Filter out any potential non-resource files / folders
//
_resources = _resources.filter(function (val) {
  var isResource = false;
  val = npmResourcesPath + val;
  isResource = resource.isResource(val);
  return isResource;
});

//
// For every resource, attempt to use it
//
_resources.forEach(function (r) {
  resource.use(r);
});

exports.resources = _resources;