var resource = require('resource'),
    page = resource.define('page');

page.schema.description = "for representing HTML pages";

page.property('name');
page.property('title');
page.property('content', {
  "type": "string",
  "default": ""
});
page.property('author');
page.property('viewCount', {
  "type": "number",
  "default": 0
});
page.property('totalEdits', {
  "type": "number",
  "default": 0
});

page.property('mtime', {
  "type": "number"
});

exports.page = page;