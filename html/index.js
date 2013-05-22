var resource = require('resource'),
    html = resource.define('html');

html.schema.description = "for rendering html";

html.dependencies = {
  "html-lang": "*"
};

html.method('render', render);

function render (selector, str, data) {
  var _html = require('html-lang');
  return _html.render(selector, str, data);
};

exports.html = html;
