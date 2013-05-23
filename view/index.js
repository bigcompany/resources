var resource = require('resource'),
    view = resource.define('view'),
    View = require('./lib/View');

//
// Export the View class for convenience
//
exports.View = View;
view.View = View;

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
      "type": "object"
    }
  }
});

function create (options, callback) {
  options = options || {};

  if(typeof options.template !== 'undefined') {
    var view = new View({
      template: options.template,
      input: options.input,
      output: options.ouput
    });
  } else {
    var view = new View({
      path: options.path,
      input: options.input,
      output: options.ouput
    });
  }

  //
  // Remark: View should not attempt to load if no path was entered
  //
  if (typeof options.path === 'string') {
    return view.load(callback);
  }

  return callback(null, view);

}

//
// View middleware
// Creates a view from a folder and automatically route all urls to paths in that folder
//
view.middle = require('./middle');

view.dependencies = {
  "cheerio": "0.9.x"
};

exports.view = view;