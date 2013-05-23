var resource = require('resource'),
    forms = resource.define('forms');

resource.use('view');
resource.use('html');

forms.schema.description = "for generating HTML forms";

forms.method("generate", generate, { 
  "description": "generates a new form based on a resource schema",
  "properties": {
    "options": {
      "properties": {
        "resource": {
          "type": "string",
          "required": true
        },
        "method": {
          "type": "string",
          "required": true
        }
      },
      "callback": {
        "type": "function"
      }
    }
  }
});

function generate (options, callback) {
  resource.view.create({ path: __dirname + '/view', input: "html"}, function (err, view) {
    var str = '', form;
    form = view.form[options.method] || view.form['method'];
    form.render({}, function(err){
      if(err) {
        throw err;
      }
      form.present(options, callback);
    });
  });
};

exports.forms = forms;