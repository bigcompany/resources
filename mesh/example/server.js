var resource = require('resource');

resource.use('mesh');
resource.listen();

resource.emit('server');

setInterval(function(){
  resource.emit('server-foo', { bar: "foo" });
}, 2000);

resource.onAny(function(data){
  console.log(this.event, data)
})