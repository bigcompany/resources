var resource = require('resource');

var mesh = resource.use('mesh');

mesh.connect({ port: 8888 }, function(err){
  if (err) { throw err; }
  setInterval(function(){
    mesh.emit('client-foo', { bar: "foo" });
  }, 2000);

  mesh.onAny(function(data){
    console.log(this.event, data);
  })

});
