var tap = require("tap"),
    resource = require('resource');

tap.test('can render markdown into html', function (t) {
  var md = resource.use('markdown');
  var str = "# hello";
  var res = md.render(str);
  t.equal(res, '<h1>hello</h1>\n')
  t.end();
});
