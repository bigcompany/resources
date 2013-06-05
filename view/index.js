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

view.property("presenter", {
  "type": "function",
  "description:": "the presenter function of the view"
});

view.method('create', create, {
  "description": "creates a new view",
  "properties": {
    "options": {
      "type": "object"
    },
    "callback": {
      "type": "function",
      "required": true
    }
  }
});

function create (options, callback) {
  options = options || {};

  var view;

  // given template and presenter
  if (typeof options.template !== 'undefined' &&
    typeof options.presenter !== 'undefined') {
    view = new View({
      template: options.template,
      presenter: options.presenter
    });

  // given just template
  } else if(typeof options.template !== 'undefined') {
    view = new View({
      template: options.template
    });

  // given just presenter
  } else if(typeof options.presenter !== 'undefined') {
    view = new View({
      presenter: options.presenter
    });

  // given neither template nor presenter
  } else {
    view = new View({
      path: options.path
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