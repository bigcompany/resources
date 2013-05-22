var resource = require('resource'),
    swig = resource.define('swig');

swig.schema.description = "for parsing swig";

swig.method('render', render);

function render (str, data) {
  var _swig = require('swig'),
      html = _swig.compile(str)(data);
  return html;
};

swig.method('configure', function (options){
  var _swig = require('swig');
      _swig.init(options);
});

swig.dependencies = {
  "swig": "*"
};

exports.swig = swig;
