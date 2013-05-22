var test = require("tap").test,
    resource = require('resource'),
    supertest = require('supertest'),
    bitcoin_lib = require('bitcoin'),
    bitcoin = resource.use('bitcoin');

test("start a bitcoin server", function (t) {
  bitcoin.connect({}, function(err, conn) {
    t.notOk(err, "bitcoin client should not error");
    t.ok(typeof conn == 'object', "bitcoin connection should be object");
    t.ok(typeof conn.client == 'object', "bitcoin client should be object");
    t.end();
  });
});


test("generate bitcoin address", function (t) {
  bitcoin.connect({}, function(err, conn) {
    conn.client.getNewAddress(function (err, address) {
      t.notOk(err, "getNewAddress() should not error");
      t.ok(typeof address == 'string', "address should be string");
      t.end();
    });
  });
});