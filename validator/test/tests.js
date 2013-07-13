var wd = require('wd')
  , resource = require('resource')
  , validator = resource.use('validator')
  , tap = require('tap')
  , creature
  , creatures = {};


tap.test("create test creature resource", function(t) {
  creature = resource.define('creature');
  t.ok(creature, "creature is defined");

  creature.schema.description = "example resource for creatures";

  creature.property('life', { type: "number", required: true });

  t.end();
});

tap.test("validate empty life", function(t) {
  var validate = validator.validate({
    life: ""
  }, creature.schema);
  t.notOk(validate.valid, "empty string is not valid life property");
  t.end();
});