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
        },
        "data": {
          "type": "object",
          "required": false
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
    form.present(options, function(err, res){
      if(err) {
        throw err;
      }
      return callback(err, res);
    });
  });
};

exports.forms = forms;