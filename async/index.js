var resource = require('resource'),
    async = resource.define('async');

//
// Remark: This resource is a simple wrapper around the `async` module,
// you could just as easily require('async') instead of using this resource
//

//
// TODO: Enumerate all `async` library methods as resource methods,
// with arguments schemas
//

async.method('forEach', function(items, fn, callback) {
  var _async = require('async');
  _async.forEach(items, fn, callback);
});

exports.async = async;

exports.dependencies = {
  "async": "*"
};