var tap = require("tap"),
    resource = require('resource'),
    sockjs_client = require('sockjs-client'),
    socketio_client = require('socket.io-client');

require('../index.js');

var socket;
tap.test('create a sockjs server', function(t){
  resource.use('http');
  resource.http.listen(function(err, server){
    t.error(err, 'http resource listened');

    resource.socket.start({engine: 'sockjs'}, function(err, io){
      socket = io;
      t.error(err, 'socket resource listened');
      t.type(io, 'object', 'socket is defined');

      t.end();
    });
  });
});

var client,
    connection;
tap.test('connect to sockjs socket with sockjs client', function(t){
  t.doesNotThrow(function(){
    socket.on('connection', function(conn){
      connection = conn;
      t.pass('sockjs server connected');
    });
  }, 'sockjs server listening for connection');

  client = sockjs_client.create('http://localhost:8888');
  client.on('connection', function (msg) {
    t.pass('sockjs client connected');
    t.end();
  });
});

tap.test('close sockjs socket', function(t){

  t.doesNotThrow(function(){
    connection.on('close', function(){
      t.pass('connection closing');
      t.doesNotThrow(function(){
        resource.http.server.close();
      }, 'closing http server');
      t.end();
    });
  }, 'setting listener on close event');

  client.on('close', function(){
    t.pass('client closing');
  });

  client.close();
});

tap.test('create a socket.io server', function(t){
  resource.http.listen(function (err, server){
    t.error(err, 'http resource listening');

    resource.socket.start({ engine: 'socketio'} , function(err, io){
      socket = io;
      t.type(io, 'object', 'websocket established');
      t.error(err, 'socket resource listened');
      t.end();
    });
  });
});

tap.test('connect to socket', function(t){
  client = socketio_client.connect('http://localhost:8888');
  t.type(client, 'object', 'client created');
  client.on('connection', function(conn){
    connection = conn;
    t.pass('client connected');
  });

  socket.on('connection', function(){
    t.pass('socket connected');
    t.end();
  });
});

tap.test('shutdown socket.io', function(t){

  client.on('disconnect', function(){
    t.pass('client disconnected');
    t.end();
  });

  t.doesNotThrow(function(){
    client.disconnect();
  }, 'socket server closing');
});
