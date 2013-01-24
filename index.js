//
// A collection of useful resources
//
var resources = exports;

var resource = require('resource'),
    fs = require('fs');

//
// Read "/resources/" directory
//
var _resources = fs.readdirSync(__dirname);

//
// Filter out any potential non-resource files / folders
//
_resources = _resources.filter(function (val) {
  if (["index.js", "package.json", "node_modules", ".git", ".DS_Store", ".gitignore", "README.md"].indexOf(val) !== -1) {
    return false;
  }
  return true;
});

//
// For every resource, attempt to require it
//
_resources.forEach(function (r) {
  resource.use(r);
});
