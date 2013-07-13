var tap = require("tap"),
    resource = require('resource');

tap.test('use and start the config resource', function (t) {
  resource.use('config', { datasource : { type: 'fs', path: __dirname + "/fixtures/db/" }});
  resource.use('creature');
  resource.config.start(function(err, res){
    t.error(err, 'config started');
    t.end();
  })
});

tap.test('check that configuration values were attached to resource.config', function (t) {
  t.equal(resource.config.foo, 'bar', 'foo property was attached');
  t.type(resource.config.creature, Object, 'creature config was attached');
  t.equal(resource.config.creature.style, 'scary', 'foo property was attached');
  t.end();
});

tap.test('check that indivdual resource configuration values were attached to their specific resources', function (t) {
  t.equal(resource.creature.config.style, 'scary', 'style property was attached');
  t.end();
});