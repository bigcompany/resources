var resource = require('resource'),
    fs = resource.define('fs');

fs.schema.description = "adds file-system persistence";

fs.method('init', function (cb) {
  cb(null, true);
});

fs.dependencies = {
  "mkdirp": "*",
  "async": "*"
};

exports.fs = fs;