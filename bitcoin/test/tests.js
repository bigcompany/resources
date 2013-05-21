var test = require("tap").test,
    resource = require('resource'),
    supertest = require('supertest'),
    server;

test("start a bitcoin server", function (t) {
  var bitcoin = resource.use('bitcoin');
  bitcoin.connect({}, function(err, conn) {
    t.end();
  });
  t.end();
});


test("generate bitcoin address", function (t) {
  var bitcoin = resource.use('bitcoin');
  bitcoin.connect({}, function(err, conn) {
    conn.client.getNewAddress();
    t.end();
  });
  t.end();
});

