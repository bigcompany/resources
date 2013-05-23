var test = require("tap").test,
    resource = require('resource'),
    supertest = require('supertest'),
    nock = require('nock'),
    bitcoin_lib = require('bitcoin'),
    bitcoin = resource.use('bitcoin');

nock.recorder.rec();


test("connect()", function (t) {
  // setup json-rpc mock
  nock('http://localhost:8332')
    .filteringRequestBody(function(path) {
      return '*';
    })
    .post('/', "*")
    .reply(
      200,
      {"result":{"errors":""},"error":null},
      {'connection': 'close','content-type': 'application/json'});
  // run test
  bitcoin.connect({}, function(err, conn) {
    t.error(err, "bitcoin client should not error");
    t.ok(typeof conn == 'object', "bitcoin connection should be object");
    t.ok(typeof conn.id == 'string', "bitcoin connection_id should be string");
    t.ok(typeof conn.client == 'object', "bitcoin client should be object");
    t.end();
  });
});


test("getNewAddress()", function (t) {
  // setup json-rpc mock
  nock('http://localhost:8332')
    .filteringRequestBody(function(path) {
      return '*';
    })
    .post('/', "*")
    .reply(
      200,
      {"result":"1KsxXncnnV6XKhjxh5YoNqmUkdxD58XuWV","error":null},
      {'connection': 'close','content-type': 'application/json'});
  // run test
  var conn_id = bitcoin.connection_id();
  bitcoin.getNewAddress(conn_id, [], function (err, address) {
    t.error(err, "getNewAddress() should not error");
    t.ok(typeof address == 'string', "address should be string");
    t.end();
  });
});

test("getBalance()", function (t) {
  // setup json-rpc mock
  nock('http://localhost:8332')
    .filteringRequestBody(function(path) {
      return '*';
    })
    .post('/', "*")
    .reply(
      200,
      {"result":0.10000000,"error":null},
      {'connection': 'close','content-type': 'application/json'});
  // run test
  var conn_id = bitcoin.connection_id();
  bitcoin.getBalance(conn_id, [], function (err, balance) {
    t.error(err, "getBalance() should not error");
    t.ok(typeof balance == 'number', "balance should be number");
    t.end();
  });
});

test("getBalance(account)", function (t) {
  // setup json-rpc mock
  nock('http://localhost:8332')
    .filteringRequestBody(function(path) {
      return '*';
    })
    .post('/', "*")
    .reply(
      200,
      {"result":0.10000000,"error":null},
      {'connection': 'close','content-type': 'application/json'})
    .filteringRequestBody(function(path) {
      return '*';
    })
    .post('/', "*")
    .reply(
      200,
      {"result":0.00000000,"error":null},
      {'connection': 'close','content-type': 'application/json'});
  // run test
  var conn_id = bitcoin.connection_id();
  bitcoin.getBalance(conn_id, ['big_test_address1'], function (err, balance) {
    t.error(err, "getBalance() should not error");
    t.ok(typeof balance == 'number', "balance should be number");
    t.equal(balance, 0.1, "balance of 'big_test_address2' should equal 0.1");

    bitcoin.getBalance(conn_id, ['big_test_address2'], function (err, balance) {
      t.error(err, "getBalance() should not error");
      t.ok(typeof balance == 'number', "balance should be number");
      t.equal(balance, 0.0, "balance of 'big_test_address2' should equal 0.0");
      t.end();
    });
  });
});

test("accounts", function (t) {
  // setup json-rpc mock
  nock('http://localhost:8332')
    .filteringRequestBody(function(path) {
      return '*';
    })
    .post('/', "*")
    .reply(
      200,
      {"result":"16w8hqgFMRcCzn5vvN1Hz1wjB55uA2myUd","error":null},
      {'connection': 'close','content-type': 'application/json'})
    .filteringRequestBody(function(path) {
      return '*';
    })
    .post('/', "*")
    .reply(
      200,
      {"result":"big_test_address3","error":null},
      {'connection': 'close','content-type': 'application/json'})
    .filteringRequestBody(function(path) {
      return '*';
    })
    .post('/', "*")
    .reply(
      200,
      {"result":["16w8hqgFMRcCzn5vvN1Hz1wjB55uA2myUd"],"error":null},
      {'connection': 'close','content-type': 'application/json'})
    .filteringRequestBody(function(path) {
      return '*';
    })
    .post('/', "*")
    .reply(
      200,
      {"result":"1JS9EXRcREGBiSbf6rCFehbox8Vjo4554C","error":null},
      {'connection': 'close','content-type': 'application/json'})
    .filteringRequestBody(function(path) {
      return '*';
    })
    .post('/', "*")
    .reply(
      200,
      {"result":"big_test_address3","error":null},
      {'connection': 'close','content-type': 'application/json'})
    .filteringRequestBody(function(path) {
      return '*';
    })
    .post('/', "*")
    .reply(
      200,
      {"result":["16w8hqgFMRcCzn5vvN1Hz1wjB55uA2myUd","1JS9EXRcREGBiSbf6rCFehbox8Vjo4554C"],"error":null},
      {'connection': 'close','content-type': 'application/json'});
  // run test
  var conn_id = bitcoin.connection_id();
  var acct = 'big_test_address3';
  bitcoin.getNewAddress(conn_id, [acct], function (err, address) {
    t.error(err, "getNewAddress(account) should not error");
    t.ok(typeof address == 'string', "address should be string");

    bitcoin.getAccount(conn_id, [address], function (err, account) {
      t.error(err, "getAccount(address) should not error");
      t.ok(typeof account == 'string', "account should be string");
      t.equal(account, acct, "account should be correct");

      bitcoin.getAddressesByAccount(conn_id, [account], function(err, addresses) {
        t.error(err, "getAddressesByAccount(account) should not error");
        t.ok(typeof addresses == 'object', "addresses should be object");
        t.equal(addresses.length, 1, "there should only be one address");
        t.equal(addresses[0], address, "address should be correct");

        bitcoin.getNewAddress(conn_id, [acct], function (err, address2) {
          t.error(err, "getNewAddress(account) should not error");
          t.ok(typeof address2 == 'string', "address should be string");

          bitcoin.getAccount(conn_id, [address], function (err, account2) {
            t.error(err, "getAccount(address) should not error");
            t.ok(typeof account2 == 'string', "account should be string");
            t.equal(account2, acct, "account should be correct");

            bitcoin.getAddressesByAccount(conn_id, [account], function(err, addresses2) {
              t.error(err, "getAddressesByAccount(account) should not error");
              t.ok(typeof addresses2 == 'object', "addresses should be object");
              t.equal(addresses2.length, 2, "there should be two addresses");
              t.ok(!(addresses2[0] == address) ^ !(addresses2[1] == address), "address should be correct");
              t.ok(!(addresses2[0] == address2) ^ !(addresses2[1] == address2), "address should be correct");
              t.end();
            });
          });
        });
      });
    });
  });
});

