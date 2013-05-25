var spawn = require('child_process').spawn,
    tap = require('tap'),
    test = tap.test,
    resource = require('resource'),
    http = resource.use('http'),
    mesh = resource.use('mesh');

var server, client;

test("spawn server", function (t) {
  server = spawn('node', [ __dirname + '/../example/server.js' ]);
  server.stdout.on('data', logServer);
  server.stderr.on('data', logServer);

  setTimeout(function () {
    t.end();
  }, 1000);

  function logServer(d) {
    d.toString().split('\n').forEach(function (l) {
      if (l !== '') {
        console.log('# server: ' + l);
      }
    });
  }
});

test("create client", function (t) {
  t.plan(5);

  mesh.once('uplink', function (data) {
    t.ok(data.port, 'uplink contains port');
    t.ok(data.host, 'uplink contains host');
    t.equal(data.status, 'connected', 'uplink is connected');
    t.ok(data.lastSeen, 'uplink contains lastSeen');
  });

  mesh.connect({ port: 8888 }, function (err) {
    t.error(err, 'created mesh client');
  });
});

test("emit and receive events", function (t) {
  t.plan(2);
  mesh.once('server-echo::client-foo', function (data) {
    t.equal(data.bar, 'foo', 'received server echo');
  });
  mesh.once('server-foo', function (data) {
    t.equal(data.bar, 'foo', 'received server message');
  });

  mesh.emit('client-foo', { bar: "foo" });
});

test("close client", function (t) {
  mesh.client.on('close', function () {
    t.end();
  });
  mesh.client.close();
});

test("kill server", function (t) {
  server.kill();
  server.on('exit', function (err) {
    t.end();
  });
});

test("create server", function (t) {
  http.listen({ port: 8888 }, function (err) {
    t.error(err, 'started http server');

    mesh.onAny(function(data){
      mesh.emit('server-echo-' + this.event, data);
    });

    mesh.listen(function (err) {
      t.error(err, 'started mesh listener');    
      t.end();
    });
  });
});

test("spawn client, emit and receive events", function (t) {
  t.plan(6);

  mesh.once('downlink', function (data) {
    t.equal(data.status, 'connected', 'downlink is connected');
    t.ok(data.lastSeen, 'downlink contains lastSeen');
    t.equal(data.role, 'client', 'downlink has role client');
  });

  mesh.once('node::ohai', function (data) {
    t.ok(data.name, 'ohai has name');
    t.ok(data.system, 'ohai has system information');
  });

  mesh.once('client-foo', function (data) {
    t.equal(data.bar, 'foo', 'received client message');
  });

  client = spawn('node', [ __dirname + '/../example/client.js' ]);
  client.stdout.on('data', logClient);
  client.stderr.on('data', logClient);

  function logClient(d) {
    d.toString().split('\n').forEach(function (l) {
      if (l !== '') {
        console.log('# client: ' + l);
      }
    });
  }
});

test("kill client", function (t) {
  client.kill();
  client.on('exit', function (err) {
    t.end();
  });
});

test("close server", function (t) {
  http.server.close(function (err) {
    t.error(err, 'server closed');
    t.end();
  });
});

setTimeout(function () {
  console.log('#');
  console.log('# engine.io client does not hang up properly');
  console.log('# exiting tests manually after 20 seconds of waiting');
  console.log('#');
  process.exit(0);
}, 20 * 1000);
