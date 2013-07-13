var resource = require('resource'),
    memory = resource.define('memory');

memory.schema.description = "adds memory persistence";

memory.method('start', function (cb){
  cb(null, true);
});

memory.method('enable', resource.use('jugglingdb').enable);

exports.memory = memory;