var resource = require('resource'),
    fs = resource.define('fs');

resource.use('persistence');

fs.method('start', function (cb) {
  cb(null, true);
});

fs.dependencies = {
  "mkdirp": "*"
};

exports.fs = fs;