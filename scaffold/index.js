//
// TODO: Scaffold resource
//
var resource = require('resource'),
    scaffold = resource.define('scaffold');

resource.use('app', { datasource: 'memory' });

scaffold.schema.description = "for creating new application scaffolds";

scaffold.property("name", {
  "type":"string",
  "default": "my-app",
  "description": "the name of the app"
});

scaffold.method("new", newApp, {
  "description": "creates a new application"
});

function newApp () {
  
  //
  // List available apps
  //
  console.log('what to make in app?');
  resource.app.all(function (err, results) {
    console.log(err, results)
  });
  

  
};

exports.scaffold = scaffold;