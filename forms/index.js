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
  this.data = fixDataTypes(options);
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

// form variables are posted as strings, so we use the 
// resource schema to reset the values to the proper types
function fixDataTypes(options) {
  var data = options.data;
  var r = resource.resources[options.resource];
  if(Object.keys(data).length === 0)
    return data; //{}
  Object.keys(r.schema.properties).forEach(function (prop, i) {
    if(data.hasOwnProperty(prop)) {
      var item = r.schema.properties[prop];
      switch(item['type']) {
        case "boolean":
          data[prop] = data[prop] === 'true' ? true : false;
          break;
        case "array":
          // TODO: refactor required for different array types
          data[prop] = data[prop].replace(', ', '').split(',');
          break;
        case "number":
          data[prop] = Number(data[prop]);
          break;
      }
    }
  });
  return data;
}

exports.forms = forms;