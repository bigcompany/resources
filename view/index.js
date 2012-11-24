var resource = require('resource'),
    view = resource.define('view'),
    viewful = require('./lib/viewful');

//
// Export the View class for convenience
//
exports.View = viewful.View;

view.schema.description = "for managing views";

view.property("path", {
  "type": "string",
  "default": ".", 
  "description": "the path to the view",
  "format": "uri" 
});

view.property("template", {
  "type": "string",
  "description": "the string template of the view"
});

view.property("input", {
  "type": "string"
});

view.property("output", {
  "type": "string"
});

view.method('create', create, {
  "description": "creates a new view",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "path": view.schema.properties.path
      }
    }
  }
});

function create (options, callback) {
  options = options || {};
  //
  // TODO: move this delegation / conditional logic to inside view engine
  //
  if(typeof options.template !== 'undefined') {
    var view = new viewful.View({
      template: options.template,
      input: options.input,
      output: options.ouput
    });
  } else {
    var view = new viewful.View({
      path: options.path,
      input: options.input,
      output: options.ouput
    });
  }
  return view;
}

exports.view = view;

exports.dependencies = {
  "cheerio": "0.9.x"
};