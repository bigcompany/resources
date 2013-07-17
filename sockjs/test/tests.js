var tap = require("tap"),
    resource = require('resource'),
    ioclient = require('sockjs-client');

  require('../index.js');

tap.test('create a socket server with the sockjs engine', function (t) {
  resource.use('creature');
  resource.use('http');

  resource.http.listen(function (err, server) {
    t.error(err, 'http resource listened');
    resource.sockjs.start(server, function (err) {
      t.error(err, 'socket resource listened');
      t.end();
    });
  });
});

var client;
tap.test('connect to socket server', function (t) {
  t.doesNotThrow(function () {
    client = ioclient.create('http://localhost:8888');
  }, 'client created successfully');

  t.type(client, 'object', 'client is defined');

  client.on('connection', function (conn) {
    t.pass('client connected');
    t.end();
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

tap.test('close sockjs socket', function (t){

  t.doesNotThrow(function(){
    client.on('close', function(){
      t.pass('client closing');
      t.doesNotThrow(function(){
        resource.http.server.close();
        t.end();
      }, 'closing http server');
    });
  }, 'setting listener on close event');

  client.close();
});
