var resource = require('resource');
var http = resource.use('http');
var mesh = resource.use('mesh');

http.listen(function (err) {
  if (err) {
    throw err;
  }
  mesh.listen(function(err){
    if (err) {
      throw err;
    }

    mesh.onAny(function(data){
      mesh.emit('server-echo::' + this.event, data);
    });

    setInterval(function(){
      mesh.emit('server-foo', { bar: "foo" });
    }, 2000);

    mesh.onAny(function(data){
      console.log(this.event, data)
    })
  });
});
