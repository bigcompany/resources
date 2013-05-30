var test = require('tap').test,
    resource = require('resource'),
    //supertest = require('supertest'),
    nock = require('nock'),
    decimal = require('decimal'),
    wallet = resource.use('wallet');

nock.recorder.rec();

test('connect()', function (t) {
  // setup json-rpc mock
  nock('http://localhost:8332')
    .filteringRequestBody(function() {return '*'; })
    .post('/', '*')
    .reply(
      200,
      {'result':{'errors':''},'error':null},
      {'connection': 'close','content-type': 'application/json'})
    .filteringRequestBody(function() {return '*'; })
    .post('/', '*')
    .reply(
      200,
      {'result':{'errors':''},'error':null},
      {'connection': 'close','content-type': 'application/json'});
  // run test
  wallet.create({account: 'test'}, function(err, myWallet) {
    t.error(err, 'no error');
    console.log(myWallet);
    wallet.connect(myWallet, {}, function(err, myWallet) {
      t.error(err, 'no error');
      t.type(myWallet.servers, 'object', 'wallet servers is of type object');
      t.equal(myWallet.servers.length, 1, 'wallet has only one active server');
      wallet.connect(myWallet, {}, function(err, myWallet) {
        t.error(err, 'no error');
        t.type(myWallet.servers, 'object', 'wallet servers is of type object');
        t.equal(myWallet.servers.length, 1, 'wallet still has only one active server');
        t.end();
      });
    });
  });
});