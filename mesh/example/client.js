var resource = require('resource');

var mesh = resource.use('mesh');

mesh.connect(function(){

  setInterval(function(){
    mesh.emit('client-foo', { bar: "foo" });
  }, 2000);

  mesh.onAny(function(data){
    console.log(this.event, data);
  })

});
