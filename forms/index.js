var resource = require('resource'),
    forms = resource.define('forms');

resource.use('view');

forms.schema.description = "for generating HTML forms";

forms.method("generate", generate, { 
  "description": "generates a new form based on a resource schema",
  "properties": {
    "resource": {
      "description": "the resource which the form represents",
      "type": "any"
    }
  }
});

function generate (options, callback) {
  var view = resource.view.create({ path: __dirname + '/view', input: "html"});
  view.load();
  var str = '', form;
  form = view.form[options.method] || view.form['method'];
  form.render();
  form.present(options, callback);
};

exports.forms = forms;

var mappings = {
  "all": "list"
};