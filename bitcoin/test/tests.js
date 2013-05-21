var tap = require("tap"),
    supertest = require('supertest'),
    resource = require('resource'),
    server;

tap.test("start a bitcoin server", function (t) {
  var bitcoin = resource.use('bitcoin');
});
