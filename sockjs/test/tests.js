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

var client,
  sid;
tap.test('connect to socket server', function (t) {
  t.doesNotThrow(function(){
    resource.sockjs.socketServer.on('connection', function(socket){
      sid = socket.id;
      t.ok(socket.id, 'socket connected and socket object passed to server');
    });
  }, 'socketServer listens to connection event');

  t.doesNotThrow(function () {
    client = ioclient.create('http://localhost:8888');
  }, 'client created successfully');

  t.type(client, 'object', 'client is defined');

  client.on('connection', function (conn) {
    t.pass('client connected');
    t.end();
  });
});

tap.test('check if connection has been cached', function(t){
  t.ok(resource.sockjs.connections[sid], 'connection has been cached');
  t.end();
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

tap.test('broadcast message from server to client', function(t){
  client.on('data', function(message){
    t.equal(message, 'hello from sockjs', 'Correct message arrived from server');
    t.end();
  });
  t.doesNotThrow(function(){
    resource.sockjs.send('hello from sockjs');
  }, 'sending message from server doesn\'t throw error');
});

tap.test('close sockjs socket', function (t){
  t.doesNotThrow(function(){
    resource.sockjs.connections[sid].on('close', function(){
      t.notOk(resource.sockjs.connections[sid], 'connection is removed from cache once closed');
      t.end();
    });
    client.on('close', function(){
      t.pass('client closing connection');
      t.doesNotThrow(function(){
        resource.http.server.close();
      }, 'http server closing connection');
    });
  }, 'setting listener on close event');

  client.close();
});
