var test = require('tap').test,
    resource = require('resource'),
    //supertest = require('supertest'),
    nock = require('nock'),
    //decimal = require('decimal'),
    bitcoin = resource.use('bitcoin');

bitcoin.start();

//nock.recorder.rec();

test('connect()', function (t) {
  // setup json-rpc mock
  nock('http://localhost:8332')
    .filteringRequestBody(function() {return '*'; })
    .post('/', '*')
    .reply(
      200,
      {'result':{'errors':''},'error':null},
      {'connection': 'close','content-type': 'application/json'});
  // run test
  bitcoin.connect({}, function(err, conn) {
    t.error(err, 'bitcoin client should not error');
    t.type(conn, 'object', 'bitcoin connection should be object');
    t.type(conn.id, 'string', 'bitcoin connectId should be string');
    t.type(conn.client, 'object', 'bitcoin client should be object');
    t.end();
  });
});


test('getNewAddress()', function (t) {
  // setup json-rpc mock
  nock('http://localhost:8332')
    .filteringRequestBody(function() {return '*'; })
    .post('/', '*')
    .reply(
      200,
      {'result':'1KsxXncnnV6XKhjxh5YoNqmUkdxD58XuWV','error':null},
      {'connection': 'close','content-type': 'application/json'});
  // run test
  var connectId = bitcoin.connectId();
  bitcoin.getNewAddress(connectId, [], function (err, address) {
    t.error(err, 'getNewAddress() should not error');
    t.type(address, 'string', 'address should be string');
    t.end();
  });
});

test('getBalance()', function (t) {
  // setup json-rpc mock
  nock('http://localhost:8332')
    .filteringRequestBody(function() {return '*'; })
    .post('/', '*')
    .reply(
      200,
      {'result':0.10000000,'error':null},
      {'connection': 'close','content-type': 'application/json'});
  // run test
  var connectId = bitcoin.connectId();
  bitcoin.getBalance(connectId, [], function (err, balance) {
    t.error(err, 'getBalance() should not error');
    t.type(balance, 'number', 'balance should be number');
    t.end();
  });
});

test('getBalance(account)', function (t) {
  // setup json-rpc mock
  nock('http://localhost:8332')
    .filteringRequestBody(function() {return '*'; })
    .post('/', '*')
    .reply(
      200,
      {'result':0.10000000,'error':null},
      {'connection': 'close','content-type': 'application/json'})
    .filteringRequestBody(function() {return '*'; })
    .post('/', '*')
    .reply(
      200,
      {'result':0.00000000,'error':null},
      {'connection': 'close','content-type': 'application/json'});
  // run test
  var connectId = bitcoin.connectId();
  bitcoin.getBalance(connectId, ['big_test_address1'], function (err, balance) {
    t.error(err, 'getBalance() should not error');
    t.type(balance, 'number', 'balance should be number');
    t.equal(balance, 0.1, 'balance of "big_test_address2" should equal 0.1');

    bitcoin.getBalance(connectId, ['big_test_address2'], function (err, balance) {
      t.error(err, 'getBalance() should not error');
      t.type(balance, 'number', 'balance should be number');
      t.equal(balance, 0.0, 'balance of "big_test_address2" should equal 0.0');
      t.end();
    });
  });
});

test('accounts', function (t) {
  // setup json-rpc mock
  nock('http://localhost:8332')
    .filteringRequestBody(function() {return '*'; })
    .post('/', '*')
    .reply(
      200,
      {'result':'16w8hqgFMRcCzn5vvN1Hz1wjB55uA2myUd','error':null},
      {'connection': 'close','content-type': 'application/json'})
    .filteringRequestBody(function() {return '*'; })
    .post('/', '*')
    .reply(
      200,
      {'result':'big_test_address3','error':null},
      {'connection': 'close','content-type': 'application/json'})
    .filteringRequestBody(function() {return '*'; })
    .post('/', '*')
    .reply(
      200,
      {'result':['16w8hqgFMRcCzn5vvN1Hz1wjB55uA2myUd'],'error':null},
      {'connection': 'close','content-type': 'application/json'})
    .filteringRequestBody(function() {return '*'; })
    .post('/', '*')
    .reply(
      200,
      {'result':'1JS9EXRcREGBiSbf6rCFehbox8Vjo4554C','error':null},
      {'connection': 'close','content-type': 'application/json'})
    .filteringRequestBody(function() {return '*'; })
    .post('/', '*')
    .reply(
      200,
      {'result':'big_test_address3','error':null},
      {'connection': 'close','content-type': 'application/json'})
    .filteringRequestBody(function() {return '*'; })
    .post('/', '*')
    .reply(
      200,
      {'result':['16w8hqgFMRcCzn5vvN1Hz1wjB55uA2myUd','1JS9EXRcREGBiSbf6rCFehbox8Vjo4554C'],'error':null},
      {'connection': 'close','content-type': 'application/json'});
  // run test
  var connectId = bitcoin.connectId();
  var acct = 'big_test_address3';
  bitcoin.getNewAddress(connectId, [acct], function (err, address) {
    t.error(err, 'getNewAddress(account) should not error');
    t.type(address, 'string', 'address should be string');

    bitcoin.getAccount(connectId, [address], function (err, account) {
      t.error(err, 'getAccount(address) should not error');
      t.type(account, 'string', 'account should be string');
      t.equal(account, acct, 'account should be correct');

      bitcoin.getAddressesByAccount(connectId, [account], function(err, addresses) {
        t.error(err, 'getAddressesByAccount(account) should not error');
        t.type(addresses, 'object', 'addresses should be object');
        t.equal(addresses.length, 1, 'there should only be one address');
        t.equal(addresses[0], address, 'address should be correct');

        bitcoin.getNewAddress(connectId, [acct], function (err, address2) {
          t.error(err, 'getNewAddress(account) should not error');
          t.type(address2, 'string', 'address should be string');

          bitcoin.getAccount(connectId, [address], function (err, account2) {
            t.error(err, 'getAccount(address) should not error');
            t.type(account2, 'string', 'account should be string');
            t.equal(account2, acct, 'account should be correct');

            bitcoin.getAddressesByAccount(connectId, [account], function(err, addresses2) {
              t.error(err, 'getAddressesByAccount(account) should not error');
              t.type(addresses2, 'object', 'addresses should be object');
              t.equal(addresses2.length, 2, 'there should be two addresses');
              t.ok(!(addresses2[0] == address) ^ !(addresses2[1] == address), 'address should be correct');
              t.ok(!(addresses2[0] == address2) ^ !(addresses2[1] == address2), 'address should be correct');
              t.end();
            });
          });
        });
      });
    });
  });
});

test('setTxFee(amount)', function(t) {
 // setup json-rpc mock
  nock('http://localhost:8332')
    .filteringRequestBody(function() {return '*'; })
    .post('/', '*')
    .reply(
      200,
      {'result':true,'error':null},
      {'connection': 'close','content-type': 'application/json'});
  // run test
  var connectId = bitcoin.connectId();
  var txFee = 0.0005;
  bitcoin.setTxFee(connectId, [txFee], function (err, result) {
    t.error(err, 'setTxFee(amount) should not error');
    //console.log(result);
    t.type(result, 'boolean', 'result should be boolean');
    t.end();
  });
});

test('send', function(t) {
  // setup json-rpc mock
  nock('http://localhost:8332')
    .filteringRequestBody(function() {return '*'; })
    .post('/', '*')
    .reply(
      200,
      {'result':0.09550000,'error':null},
      {'connection': 'close','content-type': 'application/json'})
    .filteringRequestBody(function() {return '*'; })
    .post('/', '*')
    .reply(
      200,
      {'result':'1258PcucRHGw3L2kQ7aT278C6uvz6RRpcD','error':null},
      {'connection': 'close','content-type': 'application/json'})
    .filteringRequestBody(function() {return '*'; })
    .post('/', '*')
    .reply(
      200,
      {'result':'0af7c6255c0eb53f089599b172d2acff5492491197c513b1f15704ac020c7983','error':null},
      {'connection': 'close','content-type': 'application/json'})
    .filteringRequestBody(function() {return '*'; })
    .post('/', '*')
    .reply(
      200,
      {'result': {'amount':0.00000000, 'fee': -0.00050000, 'confirmations': 0, 'txid': '0af7c6255c0eb53f089599b172d2acff5492491197c513b1f15704ac020c7983','details':[{'account':'big_test_address42','address':'1258PcucRHGw3L2kQ7aT278C6uvz6RRpcD','category':'send','amount':-0.01000000,'fee':-0.00050000},{'account':'big_test_address42','address':'16Xc5H6f5Dtjuk4qabBJwPVDd2FUKMuxxz','category':'send','amount':-0.08600000,'fee':-0.00050000},{'account':'big_test_address420','address':'1258PcucRHGw3L2kQ7aT278C6uvz6RRpcD','category':'receive','amount':0.01000000},{'account':'big_test_address42','address':'16Xc5H6f5Dtjuk4qabBJwPVDd2FUKMuxxz','category':'receive','amount':0.08600000}]},'error':null},
      {'connection': 'close','content-type': 'application/json'})
    .filteringRequestBody(function() {return '*'; })
    .post('/', '*')
    .reply(
      200,
      {'result':0.08500000,'error':null},
      {'connection': 'close','content-type': 'application/json'})
    .filteringRequestBody(function() {return '*'; })
    .post('/', '*')
    .reply(
      200,
      {'result':0.01000000,'error':null},
      {'connection': 'close','content-type': 'application/json'});

  // run test
  var connectId = bitcoin.connectId();
  var fromAddr = '16Xc5H6f5Dtjuk4qabBJwPVDd2FUKMuxxz';

  var fromAcct = 'big_test_address42';
  var toAcct = 'big_test_address420';
  var toSpend = 0.01;
  var txFee = 0.0005;
  bitcoin.getBalance(connectId, [fromAcct], function(err, origFromBalance) {
    t.error(err, 'getBalance() should not error');
    bitcoin.getNewAddress(connectId, [toAcct], function(err, toAddr) {
      t.error(err, 'getNewAddress() should not error');
      //console.log(origFromBalance, toSpend, txFee);
      var many = {};
      many[toAddr] = toSpend;
      many[fromAddr] = origFromBalance - toSpend - txFee;
      console.log(many);
      bitcoin.sendMany(connectId, [fromAcct, many], function (err, txid) {
        console.log(err);
        t.error(err, 'sendMany() should not error');
        t.type(txid, 'string', 'transaction id should be string');
        bitcoin.getTransaction(connectId, [txid], function(err, tx) {
          console.log(err);
          t.error(err, 'getTransaction() should not error');
          t.equal(tx.txid, txid, 'txid of returned tx should be equal to lookup txid');
          // transaction checks
          //t.equal(tx.amount, toSpend, 'tx amount should be correct');
          t.equal(tx.fee, -txFee, 'tx fee should be correct');
          /* too many. TODO: more minimal transaction
          t.equal(tx.details[0].account, fromAcct, 'first account in tx should be fromAcct');
          t.equal(tx.details[1].account, toAcct, 'second account in tx should be toAcct');
          t.equal(tx.details[0].address, fromAddr, 'first address in tx should be fromAddr');
          t.equal(tx.details[1].address, toAddr, 'second address in tx should be toAddr');
          t.equal(tx.details[0].category, 'send', 'first category in tx should be 'send'');
          t.equal(tx.details[1].category, 'receive', 'second category in tx should be 'receive'');
          t.equal(tx.details[0].amount, -toSpend, 'first amount in tx should be toSpend');
          t.equal(tx.details[1].amount, toSpend, 'second amount in tx should be toSpend');
          t.equal(tx.details[0].fee, -txFee, 'first fee in tx should be txFee');
          */
          bitcoin.getBalance(connectId, [fromAcct, 0], function(err, newFromBalance) {
            t.error(err, 'getBalance() should not error');
            bitcoin.getBalance(connectId, [toAcct, 0], function(err, newToBalance) {
              t.error(err, 'getBalance() should not error');
              t.equal(newFromBalance, origFromBalance - toSpend - txFee,
                'account sending coins should have correctly reduced balance');
              t.equal(newToBalance, toSpend,
                'new account receiving coins should have correct balance');
              t.end();
            });
          });
        });
      });
    });
  });
});
