var tap = require("tap"),
    resource = require('resource');

tap.test('can render data onto html', function (t) {

  var html = resource.use('html');

  var tpl = '<p class="name">name placeholder</p>';

  var res = html.render({ name: "Bob" }, tpl);
  t.equal(res, '<p class="name">Bob</p>')
  t.end();

});
