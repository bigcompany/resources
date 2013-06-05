var test = require('tap').test,
    nock = require('nock'),
    resource = require('resource'),
    io = require('socket.io-client'),
    blockchain = resource.use('blockchain'),
    block = resource.use('block'),
    transaction = resource.use('transaction'),
    logger = resource.logger,
    coinName,
    connectId,
    chain;

blockchain.persist('memory');
transaction.persist('memory');
block.persist('memory');
//nock.recorder.rec();

test('create a socket server', function (t) {
  resource.use('http');
  resource.use('socket');
  resource.http.listen(function (err, server) {
    t.error(err, 'http resource listened');
    resource.socket.start(function (err) {
      t.error(err, 'socket resource listened');
      t.end();
    });
  });
});

var client;
test('connect to socket server', function (t) {
  // run test
  t.doesNotThrow(function () {
    client = io.connect('http://localhost:8888');
  }, 'client created successfully');
  t.type(client, 'object', 'client is defined');
  client.on('connect', function () {
    t.pass('client connected');
    t.end();
  });
});

test('create a blockchain instance', function(t) {
  coinName = 'bitcoin';
  client.emit('blockchain', 'create', {id: 'test', coin: coinName}, function(err, _blockchain) {
    t.error(err, 'no error');
    t.equal(_blockchain.coin, coinName, 'blockchain instance has correct coin property');
    blockchain.connect(_blockchain.id, {}, function(err, _blockchain) {
      t.error(err, 'no error');
      chain = _blockchain;
      t.equal(chain.servers.length, 1, 'blockchain instance has 1 server');
      connectId = chain.servers[0];
      t.end();
    });
  });
});

test('blockchain receives blocknotify', function (t) {
  // setup nock
  nock('http://localhost:8332')
  .filteringRequestBody(function() {return '*'; })
  .post('/', '*')
  .reply(200, "{\"result\":{\"hash\":\"00000000dfd5d65c9d8561b4b8f60a63018fe3933ecb131fb37f905f87da951a\",\"size\":216,\"height\":2000,\"version\":1,\"merkleroot\":\"10f072e631081ad6bcddeabb90bc34d787fe7d7116fe0298ff26c50c5e21bfea\",\"tx\":[\"10f072e631081ad6bcddeabb90bc34d787fe7d7116fe0298ff26c50c5e21bfea\"],\"time\":1233046715,\"nonce\":2999858432,\"bits\":\"1d00ffff\",\"difficulty\":1.00000000,\"previousblockhash\":\"00000000a1496d802a4a4074590ec34074b76a8ea6b81c1c9ad4192d3c2ea226\",\"nextblockhash\":\"0000000067217a46c49054bad67cda2da943607d326e89896786de10b07cb7c0\"},\"error\":null,\"id\":1370163510609}\n", { date: 'Sun, 02 Jun 2013 08:58:30 +0000',
  connection: 'close',
  'content-length': '582',
  'content-type': 'application/json',
  server: 'bitcoin-json-rpc/v0.8.1-beta' });
  // run test
  var blockhash = '00000000dfd5d65c9d8561b4b8f60a63018fe3933ecb131fb37f905f87da951a';
  logger.info('calling (blockchain::blocknotify', coinName, connectId, blockhash, function() {},')');
  client.emit('blockchain', 'blocknotify', {coinName: coinName, connectId: connectId, blockhash: blockhash}, function (err, _block) {
    if (err) { throw err; }
    t.error(err, 'no error');
    t.equal(_block.id, "00000000dfd5d65c9d8561b4b8f60a63018fe3933ecb131fb37f905f87da951a", 'block hash is correct');
    t.equal(_block.type, coinName, 'block type is correct');
    t.equal(_block.index, 2000, 'block height is correct');
    t.equal(_block.txs.length, 1, 'block has correct number of txs');
    t.equal(_block.txs[0], "10f072e631081ad6bcddeabb90bc34d787fe7d7116fe0298ff26c50c5e21bfea", 'block tx is correct');
    t.equal(_block.time, 1233046715, 'block time is correct');
    t.end();
  });
});

test('blockchain receives walletnotify', function (t) {
  // setup nock
  nock('http://localhost:8332')
  .filteringRequestBody(function() {return '*'; })
  .post('/', '*')
  .reply(200, "{\"result\":{\"amount\":0.00000000,\"fee\":-0.00050000,\"blockhash\":\"0000000000000106a87885b978c14934aa1e04cbb21fd58c625088aeaa020752\",\"blockindex\":106,\"blocktime\":1370172561,\"txid\":\"a499a51f44f26258c258d40aa6d12da005820df947d103135c3d995a4a3749b4\",\"time\":1370172369,\"timereceived\":1370172369,\"details\":[{\"account\":\"\",\"address\":\"1EJgW94BzWAYtmStgVGid2zSsDYbVKQsaa\",\"category\":\"send\",\"amount\":-0.01000000,\"fee\":-0.00050000},{\"account\":\"\",\"address\":\"1EJgW94BzWAYtmStgVGid2zSsDYbVKQsaa\",\"category\":\"receive\",\"amount\":0.01000000}]},\"error\":null,\"id\":1370206815859}\n", { date: 'Sun, 02 Jun 2013 21:00:15 +0000',
  connection: 'close',
  'content-length': '573',
  'content-type': 'application/json',
  server: 'bitcoin-json-rpc/v0.8.1-beta' });
  // run test
  var txid = 'a499a51f44f26258c258d40aa6d12da005820df947d103135c3d995a4a3749b4';
  logger.info('calling (blockchain::walletnotify', coinName, connectId, txid, function() {},')');
  client.emit('blockchain', 'walletnotify', {coinName: coinName, connectId: connectId, txid: txid}, function (err, tx) {
    if (err) { throw err; }
    t.error(err, 'no error');
    t.type(tx, 'object', 'tx is object');
    t.equal(tx.id, txid, 'tx id is correct');
    t.equal(tx.source, '0000000000000106a87885b978c14934aa1e04cbb21fd58c625088aeaa020752', 'tx blockhash is correct');
    t.equal(tx.time, 1370172369, 'tx time is correct');
    t.end();
  });
});

/*
test('destroy blockchain', function(t) {
  client.emit('blockchain', 'destroy', 'test', function(err, result) {
    t.error(err, 'no error');
    t.end();
  });
});

test('try to get destroyed creature', function (t) {
  client.emit('blockchain', 'get', 'test', function (err, result) {
    t.type(err, 'object', 'returns an object representing an error');
    t.end();
  });
});

test("stop everything", function (t) {

  t.plan(2);

  client.on('disconnect', function () {
    t.pass('client disconnected');
  });
  client.disconnect();

  resource.http.server.close(function () {
    t.pass('server disconnected');
  });
});
*/