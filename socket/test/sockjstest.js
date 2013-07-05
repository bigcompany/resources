var tap = require("tap"),
    resource = require('resource'),
    io = require('sockjs-client');

  resource.use('http');
  resource.use('creature');
  require('../index.js'); //Require resource instead of .use as we specifically want to use development resource

tap.test('create a socket server with the sockjs engine', function (t) {
  resource.http.listen(function (err, server) {
    t.error(err, 'http resource listened');
    resource.socket.start({engine: 'sock.js'}, function (err) {
      t.error(err, 'socket resource listened');
      t.end();
    });
  });
});

var client;
tap.test('connect to socket server', function (t) {
  t.doesNotThrow(function () {
    client = io.create('http://localhost:8888');
  }, 'client created successfully');

  t.type(client, 'object', 'client is defined');

  client.on('connection', function () {
    t.pass('client connected');
    t.end()
  });
});

tap.test('create a creature', function (t) {
  t.doesNotThrow(function(){
    var json = JSON.stringify(['creature', 'create', { id: 'korben' }]);
    client.write(json);
  }, 'client successfully wrote message');

  resource.creature.on('create', function(){
    t.pass('creature created');
    t.end();
  });
});
