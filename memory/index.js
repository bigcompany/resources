var resource = require('resource'),
    memory = resource.define('memory');

memory.method('start', function (cb){
  cb(null, true);
});

exports.memory = memory;