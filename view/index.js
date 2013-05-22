var resource = require('resource'),
    view = resource.define('view'),
    viewful = require('./lib/viewful');

//
// Export the View class for convenience
//
exports.View = viewful.View;
view.View = viewful.View;
view.engines = viewful.engines;

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
  try {
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
    //
    // Remark: View should not attempt to load if no path was entered
    //
    // TODO: Should this fix be here or in the View prototype constructor ( viewful.View ) ?
    //
    if (typeof options.path === 'string') {
      view.load();
    }
  }
  catch (err) {
    if (callback) {
      return callback(err);
    }
    throw err;
  }

  if (callback) {
    callback(null, view);
  }
  else {
    return view;
  }
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