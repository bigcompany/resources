var resource = require('resource'),
    stdout = resource.define('stdout');

stdout.schema.description = "outputs all events as new-line delimited JSON fragments to STDOUT";

resource.onAny(function(data){
  data = data || {};
  var obj = {
    "event": this.event,
    "data": data
  };
  //console.log(JSON.stringify(obj));
});

exports.stdout = stdout;
