var resource = require('resource'),
    swig = resource.define('swig');

swig.schema.description = "for parsing swig";

swig.method('render', render);

function render (str, data) {
  var swig = require('swig'),
      html = swig.compile(str)(data);
  return html;
};

swig.dependencies = {
  "swig": "*"
};

exports.swig = swig;
