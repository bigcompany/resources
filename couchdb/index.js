var resource = require('resource'),
    couchdb = resource.define('couchdb');

couchdb.schema.description = "adds couchdb persistence";

couchdb.method('start', function (cb) {
  cb(null, true);
});

couchdb.dependencies = {
  "cradle": "0.6.4"
};

exports.couchdb = couchdb;