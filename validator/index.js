var resource = require('resource'),
    validator = resource.define('validator');
    
validator.schema.description = "adds JSON-validator to resources";

validator.method('validate', validate, {
  "description": "hi",
  "properties": {
    "data": {
      type: "object"
    },
    "schema": {
      type: "object"
    }
  }
});

function validate (data, schema) {
  var _validator = require('./vendor/validator');
  return _validator.validate(data, schema);
}

exports.validator = validator;
