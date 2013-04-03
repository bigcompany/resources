var tap = require("tap"),
    supertest = require('supertest'),
    resource = require('resource'),
    server;

tap.test("start an api server", function (t) {
  resource.use('creature');
  resource.use('calculator');
  resource.use('http');
  resource.use('api');
  resource.http.listen(function (err, _server) {
    t.error(err, 'no error');
    t.ok(_server, 'server is returned');
    t.ok(resource.http.app, 'resource.http.app is defined');

    resource.api.listen(function (err, _server) {
      t.error(err, 'no error');
      t.ok(_server, 'server is returned');

      server = _server;

      t.end();
    });
  });
});

tap.test("strict api tests with creature", function (t) {
  t.test("GET /api", function (t) {
    supertest(server)
      .get('/api')
      .expect(200)
      .end(function (err) {
        t.error(err, 'GET /api');
        t.end();
      })
    ;
  });

  t.test("GET /api/creature", function (t) {
    supertest(server)
      .get('/api/creature')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'GET /api/creature');
        t.doesNotThrow(JSON.parse.bind(null, res.body), 'body is valid JSON');
        t.end();
      })
    ;
  });

  t.test("POST /api/creature/create", function (t) {
    supertest(server)
      .post('/api/creature/create', { id: 'korben' })
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.equal(body.id, 'korben', 'id is korben');
        t.end();
      })
    ;
  });

  t.test("GET /api/creature/korben", function (t) {
    supertest(server)
      .get('/api/creature/korben')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');
        t.doesNotThrow(JSON.parse.bind(null, res.body), 'body is valid JSON');
        t.end();
      })
    ;
  });

  t.test("PUT /api/creature/korben", function (t) {
    supertest(server)
      .put('/api/creature/korben', { type: 'unicorn', life: 10 })
      .expect(204)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.type('object', body.creature, 'creature is object');

        var creature = body.creature || {};
        t.equal(creature.type, 'unicorn', 'type is unicorn');
        t.equal(creature.life, 10, 'life is 10');

        t.end();
      })
    ;
  });

  t.test("GET /api/creature/korben/feed", function (t) {
    supertest(server)
      .put('/api/creature/korben/feed')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.type(body.result, 'string', 'result is a string');

        t.end();
      })
    ;
  });

  t.test("GET /api/creature/korben", function (t) {
    supertest(server)
      .put('/api/creature/korben')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.type(body.creature, 'object', 'creature is object');
        var creature = body.creature || {};
        t.equal(creature.life, 11, 'life is 11');

        t.end();
      })
    ;
  });

  t.test("GET /api/creature/korben/feed", function (t) {
    supertest(server)
      .put('/api/creature/korben/feed')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.type(body.result, 'string', 'result is a string');

        t.end();
      })
    ;
  });

  t.test("GET /api/creature/korben", function (t) {
    supertest(server)
      .put('/api/creature/korben')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.type(body.creature, 'object', 'creature is object');
        var creature = body.creature || {};
        t.equal(creature.life, 12, 'life is 12');

        t.end();
      })
    ;
  });

  t.test("GET /api/creature/korben/hit", function (t) {
    supertest(server)
      .put('/api/creature/korben/hit')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.type(body.result, 'string', 'result is a string');

        t.end();
      })
    ;
  });

  t.test("GET /api/creature/korben", function (t) {
    supertest(server)
      .put('/api/creature/korben')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.type(body.creature, 'object', 'creature is object');
        var creature = body.creature || {};
        t.equal(creature.life, 11, 'life is 11');

        t.end();
      })
    ;
  });

  t.test("GET /api/creature/korben/hit", function (t) {
    supertest(server)
      .put('/api/creature/korben/hit')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.type(body.result, 'string', 'result is a string');

        t.end();
      })
    ;
  });

  t.test("GET /api/creature/korben", function (t) {
    supertest(server)
      .put('/api/creature/korben')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.type(body.creature, 'object', 'creature is object');
        var creature = body.creature || {};
        t.equal(creature.life, 10, 'life is 10');

        t.end();
      })
    ;
  });

  t.test("GET /api/creature/korben/_die", function (t) {
    supertest(server)
      .get('/api/creature/korben/_die')
      .expect(404)
      .end(function (err) {
        t.error(err, '_die is not found');
        t.end();
      })
    ;
  });

  t.test("POST /api/creature/korben/_die", function (t) {
    supertest(server)
      .post('/api/creature/korben/_die')
      .expect(404)
      .end(function (err) {
        t.error(err, '_die is not found');
        t.end();
      })
    ;
  });

  t.test("DELETE /api/creature/korben", function (t) {
    supertest(server)
      .del('/api/creature/korben')
      .expect(204)
      .end(function (err) {
        t.error(err, 'creature is deleted');
        t.end();
      })
    ;
  });

  t.test("GET /api/creature/korben", function (t) {
    supertest(server)
      .get('/api/creature/korben')
      .expect(404)
      .end(function (err) {
        t.error(err, 'deleted creature is not found');
        t.end();
      })
    ;
  });

  t.end();
});

tap.test("stop an api server", function (t) {
  server.close(function (err) {
    t.ok(!err, 'no error');
    t.end();
  });
});
