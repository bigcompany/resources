//
// TODO: application resource
//

var resource = require('resource'),
    app = resource.define('app');

app.schema.description = "for managing apps";

app.property("name", {
  "type":"string",
  "default": "my title",
  "description": "the title of the app"
});

exports.app = app;