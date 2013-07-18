var resource = require('resource'),
    tap = require('tap'),
    npm = resource.use('npm');

tap.test("install npm package", function (t) {
  npm.install(["Faker"], function (err, result) {
    t.ok(!err, "npm.install did not error");
    t.ok(result, "npm.install returned result");
    t.ok(require('Faker'), "Faker is installed");
    t.end();
  });
});