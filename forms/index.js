var resource = require('resource'),
    forms = resource.define('forms');

resource.use('view');

forms.schema.description = "generates HTML forms";

forms.property("resource", { 
  "description": "the resource which the form represents",
  "type": "any",
  "message": "a valid JSON-schema is required",
});

forms.method("generate", generate, { 
  "description": "a create form",
  "properties": {
    "resource": forms.schema.properties.resource
  }
});

function generate (options) {
  var view = resource.view.create({ path: __dirname + '/view', input: "html"});
  view.load();
  var str = '', form;
  form = view.form[options.method] || view.form['method'];
  return form;
};

exports.forms = forms;

var mappings = {
  "all": "list"
};