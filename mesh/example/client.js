var resource = require('resource');

resource.use('mesh');
resource.connect();

setInterval(function(){
  resource.emit('client-foo', { bar: "foo" });
}, 2000);

resource.onAny(function(data){
  console.log(this.event, data)
});