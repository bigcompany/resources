var resource = require('resource'),
    datetime = resource.define('datetime');

datetime.schema.description = "date and time helper";

function format (date, mask) {
  var dateFormat = require('dateformat');
  return dateFormat(date, mask);
}

datetime.method('format', format, {
  "description": "formats a date by mask",
  "properties": {
    "date": {
      "type": "object",
      "required": true
    },
    "mask": {
      "type": "string",
      "default": "mm dd, yyyy",
      "required": true
    }
  }
});

datetime.dependencies = {
  "dateformat": "*"
};

exports.datetime = datetime;