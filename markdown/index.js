var resource = require('resource'),
    markdown = resource.define('markdown');

markdown.schema.description = "for parsing markdown";

markdown.dependencies = {
  "marked": "*"
};

markdown.method('render', render);

function render (str) {
  var marked = require('marked');
  return marked(str);
};

exports.markdown = markdown;
