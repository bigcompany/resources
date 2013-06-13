var tap = require("tap"),
    supertest = require('supertest'),
    resource = require('resource'),
    server;

tap.test("start an api server", function (t) {
  var creature = resource.use('creature');
  resource.use('account');
  resource.use('calculator');
  resource.use('api');
  resource.use('http');

  creature.property('isAwesome', { type: 'boolean', default: false });
  creature.property('foo');

  creature.persist('memory');

  //
  // Add a method to creature for testing instance-scoped method calls
  //
  creature.method('feed', feed, {
    description: 'feed a creature',
    properties: {
      options: creature.schema,
      callback: {
        type: 'function',
        required: true
      }
    }
  });
  function feed(options, callback) {
    options.life = options.life + 1;
    callback(null, options);
  }
  resource.http.start(function (err, _server) {
    t.error(err, 'no error');
    t.ok(_server, 'server is returned');
    t.ok(resource.http.app, 'resource.http.app is defined');
    server = _server;
    t.end();
  });
});

tap.test("strict api tests with creature", function (t) {
  t.test("get /api", function (t) {
    supertest(server)
      .get('/api')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err) {
        t.error(err, 'no error');

        //
        // TODO: Assert some properties of the json
        //

        t.end();
      })
    ;
  });

  /*
  t.test("get /api/creature", function (t) {
    supertest(server)
      .get('/api/creature')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {

        t.error(err, 'no error');

        //
        // TODO: Assert some properties of the json
        //

        t.end();
      })
    ;
  });

  t.test("get /api/creature/get", function (t) {
    supertest(server)
      .get('/api/creature/get')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');
        t.end();
      })
    ;
  });
  */

  t.test("create a new creature by posting to /api/creature/larry", function (t) {
    supertest(server)
      .post('/api/creature/larry')
      .expect(201)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.equal(body.id, 'larry', 'id is larry');

        t.end();
      })
    ;
  });

  t.test("create a new creature by posting to /api/creature with id in body", function (t) {
    supertest(server)
      .post('/api/creature')
      .send({ id: 'bobby', life: 99, isAwesome: true })
      .expect(201)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.equal(body.id, 'bobby', 'id is bobby');
        t.equal(body.life, 99, 'life is 99');
        t.equal(body.isAwesome, true, 'isAwesome is true');

        t.end();
      })
    ;
  });

  t.test("create a new creature by putting to /api/creature with id", function (t) {
    supertest(server)
      .put('/api/creature/korben')
      .expect(201)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.equal(body.id, 'korben', 'id is korben');

        t.end();
      })
    ;
  });

  t.test("get created creature by getting /api/creature/korben", function (t) {
    supertest(server)
      .get('/api/creature/korben')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        t.doesNotThrow(JSON.parse.bind(null, res.text), 'body is valid JSON');
        t.end();
      })
    ;
  });

  t.test("update creature by putting /api/creature/korben", function (t) {
    supertest(server)
      .put('/api/creature/korben')
      .send({ type: 'unicorn', life: 10 })
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.type(body, 'object', 'creature is object');
        t.equal(body.type, 'unicorn', 'type is unicorn');
        t.equal(body.life, 10, 'life is 10');

        t.end();
      })
    ;
  });

  t.test("get updated creature by getting /api/creature/korben", function (t) {
    supertest(server)
      .get('/api/creature/korben')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.type(body, 'object', 'creature is object');
        t.equal(body.type, 'unicorn', 'type is unicorn');
        t.equal(body.life, 10, 'life is 10');

        t.end();
      })
    ;
  });

  t.test("call creature method by posting /api/creature/korben/fire", function (t) {
    supertest(server)
      .post('/api/creature/korben/fire')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.type(body, 'object', 'result is object');
        t.equal(body.status, 'fired', 'status is fired');
        t.equal(body.direction, 'up', 'direction is up');

        t.end();
      })
    ;
  });

  t.test("call creature method by getting /api/creature/fire", function (t) {
    supertest(server)
      .get('/api/creature/fire')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.type(body, 'object', 'result is object');
        t.equal(body.status, 'fired', 'status is fired');
        t.equal(body.direction, 'up', 'direction is up');

        t.end();
      })
    ;
  });

  t.test("call method with instance by posting /api/creature/korben/feed", function (t) {
    supertest(server)
      .post('/api/creature/korben/feed')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.type(body, 'object', 'body is an object');
        t.equal(body.life, 11, 'life is 11');

        t.end();
      })
    ;
  });

  //
  // In the current implementation, calling a method against an instance does
  // not save it. You have to do that on your own.
  //
  t.test("show that instance is unchanged by getting /api/creature/korben", function (t) {
    supertest(server)
      .get('/api/creature/korben')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.type(body, 'object', 'creature is object');
        t.equal(body.life, 10, 'life is 10');

        t.end();
      })
    ;
  });

  t.test("update instance with output of /api/creature/korben/feed", function (t) {
    supertest(server)
      .post('/api/creature/korben/feed')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.type(body, 'object', 'body is an object');
        t.equal(body.life, 11, 'life is 11');

        supertest(server)
          .put('/api/creature/korben')
          .send(body)
          .expect(200)
          .end(function (err, res) {
            t.error(err, 'no error');
            t.end();
          })
        ;
      })
    ;
  });

  t.test("show that instance is updated by getting /api/creature/korben", function (t) {
    supertest(server)
      .get('/api/creature/korben')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.type(body, 'object', 'creature is object');
        t.equal(body.life, 11, 'life is 11');

        t.end();
      })
    ;
  });

  t.test("get nonexistent creature method /api/creature/korben/_die", function (t) {
    supertest(server)
      .get('/api/creature/korben/_die')
      .expect('Content-Type', 'application/json')
      .expect(404)
      .end(function (err) {
        t.error(err, '_die is not found');
        t.end();
      })
    ;
  });

  t.test("post nonexistent creature method /api/creature/korben/_die", function (t) {
    supertest(server)
      .post('/api/creature/korben/_die')
      .expect(404)
      .expect('Content-Type', 'application/json')
      .end(function (err) {
        t.error(err, '_die is not found');
        t.end();
      })
    ;
  });

  t.test("destroy creature by deleting /api/creature/korben", function (t) {
    supertest(server)
      .del('/api/creature/korben')
      .expect(204)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'creature is deleted');
        t.end();
      })
    ;
  });

  t.test("get destroyed creature by getting /api/creature/korben", function (t) {
    supertest(server)
      .get('/api/creature/korben')
      .expect(404)
      .expect('Content-Type', 'application/json')
      .end(function (err) {
        t.error(err, 'deleted creature is not found');
        t.end();
      })
    ;
  });

  t.end();
});

tap.test("strict api tests with calculator", function (t) {
  t.test("get /api", function (t) {
    supertest(server)
      .get('/api')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err) {
        t.error(err, 'no error');

        //
        // TODO: Assert some properties of the json
        //

        t.end();
      })
    ;
  });

  t.test("get /api/calculator", function (t) {
    supertest(server)
      .get('/api/creature')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        //
        // TODO: Assert some properties of the json
        //

        t.end();
      })
    ;
  });

  t.test("execute method by getting /api/calculator/add", function (t) {
    supertest(server)
      .get('/api/calculator/add?a=1&b=2')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.equal(body, 3, 'result is 3');

        t.end();
      })
    ;
  });

  t.test("try to create a new calculator by posting to /api/calculator/baban", function (t) {
    supertest(server)
      .put('/api/calculator/baban')
      .expect(404) // Method not found
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.end();
      })
    ;
  });

  t.test("try to call calculator method by posting /api/calculator/baban/add", function (t) {
    supertest(server)
      .post('/api/calculator/baban/add')
      .send({ a: 1, b: 2 })
      .expect(400)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        //
        // TODO: Assert something regarding the error
        //
        t.equal(body.message, 'Resource `calculator` is not persisted', 'calculator is not persisted');

        t.end();
      })
    ;
  });

  t.end();
});

tap.test("strict validation tests with account", function (t) {
  t.test("get /api/account", function (t) {
    supertest(server)
      .get('/api/account')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err) {
        t.error(err, 'no error');
        t.end();
      })
    ;
  });

  t.test("try to create /api/account/marak without an email", function (t) {
    supertest(server)
      .put('/api/account/marak')
      .expect(422)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body, errors;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.doesNotThrow(function () {
          errors = body.errors;
        }, 'errors is defined');

        t.ok(Array.isArray(errors), 'errors is an array');

        var property, expected, message;
        try {
          property = errors[0].property;
          expected = errors[0].expected;
          message = errors[0].message;
        }
        catch (err) {}

        t.equal(property, 'email', 'first error has email property');
        t.equal(expected, true, 'email is expected');
        t.equal(message, 'is required', 'email is required');

        t.end();
      });
    ;
  });

  t.test("try to get /api/account/marak", function (t) {
    supertest(server)
      .get('/api/account/marak')
      .expect(404)
      .expect('Content-Type', 'application/json')
      .end(function (err) {
        t.error(err, 'no account for marak');
        t.end();
      })
    ;
  });

  t.test("try to create /api/account/marak with invalid email", function (t) {
    supertest(server)
      .put('/api/account/marak')
      .send({ email: 'not_a_valid_email' })
      .expect(422)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body, errors;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.doesNotThrow(function () {
          errors = body.errors;
        }, 'errors is defined');

        t.ok(Array.isArray(errors), 'errors is an array');

        var property, expected, attribute, message;
        try {
          property = errors[0].property;
          expected = errors[0].expected;
          attribute = errors[0].attribute;
          message = errors[0].message;
        }
        catch (err) {}

        t.equal(property, 'email', 'first error has email property');
        t.equal(expected, 'email', 'email is expected');
        t.equal(attribute, 'format', 'format invalidated');
        t.equal(message, 'is not a valid email', 'email is invalid');

        t.end();
      });
    ;
  });

  t.test("try to get /api/account/marak", function (t) {
    supertest(server)
      .get('/api/account/marak')
      .expect(404)
      .expect('Content-Type', 'application/json')
      .end(function (err) {
        t.error(err, 'no account for marak');
        t.end();
      })
    ;
  });

  t.test("create /api/account/marak with valid email", function (t) {
    supertest(server)
      .put('/api/account/marak')
      .send({ email: 'marak@marak.com' })
      .expect(201)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.equal(body.id, 'marak', 'user is marak');

        t.end();
      });
    ;
  });

  t.test("get /api/account/marak", function (t) {
    supertest(server)
      .get('/api/account/marak')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err) {
        t.error(err, 'no error');
        t.end();
      })
    ;
  });

  t.test("try to update /api/account/marak with invalid email", function (t) {
    supertest(server)
      .put('/api/account/marak')
      .send({ email: 'not_a_valid_email' })
      .expect(422)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body, errors;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.doesNotThrow(function () {
          errors = body.errors;
        }, 'errors is defined');

        t.ok(Array.isArray(errors), 'errors is an array');

        var property, expected, attribute, message;
        try {
          property = errors[0].property;
          expected = errors[0].expected;
          attribute = errors[0].attribute;
          message = errors[0].message;
        }
        catch (err) {}

        t.equal(property, 'email', 'first error has email property');
        t.equal(expected, 'email', 'email is expected');
        t.equal(attribute, 'format', 'format invalidated');
        t.equal(message, 'is not a valid email', 'email is invalid');

        t.end();
      });
    ;
  });

  t.test("update /api/account/marak with valid email", function (t) {
    supertest(server)
      .put('/api/account/marak')
      .send({ email: 'marak@big.vc' })
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.equal(body.id, 'marak', 'user is marak');
        t.equal(body.email, 'marak@big.vc', 'email is updated');

        t.end();
      });
    ;
  });

  t.test("get /api/account/marak with updated email", function (t) {
    supertest(server)
      .get('/api/account/marak')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.equal(body.id, 'marak', 'user is marak');
        t.equal(body.email, 'marak@big.vc', 'email is updated');

        t.end();
      })
    ;
  });

  t.end();
});

tap.test("non-strict api tests with creature", function (t) {
  t.test("get /api", function (t) {
    supertest(server)
      .get('/api')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err) {
        t.error(err, 'GET /api');
        t.end();
      })
    ;
  });

  t.test("create a creature by posting to /api/creature/create", function (t) {
    supertest(server)
      .post('/api/creature/create')
      .send({ id: 'leila' })
      .expect(201)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');
        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');
        t.type(body, 'object', 'creature is object');
        t.equal(body.id, 'leila', 'id is leila');
        t.equal(body.life, 10, 'life is 10');
        t.end();
      })
    ;
  });

  t.test("get created creature /api/creature/leila", function (t) {
    supertest(server)
      .get('/api/creature/leila')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.type(body, 'object', 'creature is object');
        t.equal(body.id, 'leila', 'id is leila');
        t.equal(body.life, 10, 'life is 10');

        t.end();
      })
    ;
  });

  t.test("update creature by posting to /api/creature/leila/update", function (t) {
    supertest(server)
      .post('/api/creature/leila/update')
      .send({ type: 'unicorn' })
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.type(body, 'object', 'creature is object');
        t.equal(body.id, 'leila', 'id is leila');
        t.equal(body.type, 'unicorn', 'type is unicorn');
        t.equal(body.life, 10, 'life is 10');

        t.end();
      })
    ;
  });

  t.test("destroy creature by posting to /api/creature/leila/destroy", function (t) {
    supertest(server)
      .post('/api/creature/leila/destroy')
      .expect(204)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'leila is destroyed');
        t.end();
      })
    ;
  });

  t.test("try to get destroyed creature /api/creature/leila", function (t) {
    supertest(server)
      .get('/api/creature/leila')
      .expect(404)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'destroyed creature not found');

        t.end();
      })
    ;
  });

  t.test("find creatures by getting /api/creature/find", function (t) {
    supertest(server)
      .get('/api/creature/find')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.ok(Array.isArray(body), 'creature is array');

        t.end();
      })
    ;
  });

  t.test("find creatures by posting /api/creature/find", function (t) {
    supertest(server)
      .post('/api/creature/find')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.ok(Array.isArray(body), 'creature is array');

        t.end();
      })
    ;
  });

  t.test("find creatures of type dragon by posting /api/creature/find", function (t) {
    supertest(server)
      .post('/api/creature/find')
      .send({ type: 'dragon' })
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.doesNotThrow(function () {
          body.forEach(function (creature) {
            t.type(creature, 'object', 'creature is an object');
            t.equal(creature.type, 'dragon', 'creature is a dragon');
          });
        }, 'body is array');

        t.end();
      })
    ;
  });

  t.test("find creatures of type dragon by posting /api/creature/find?type=dragon", function (t) {
    supertest(server)
      .post('/api/creature/find?type=dragon')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.doesNotThrow(function () {
          body.forEach(function (creature) {
            t.type(creature, 'object', 'creature is an object');
            t.equal(creature.type, 'dragon', 'creature is a dragon');
          });
        }, 'body is array');

        t.end();
      })
    ;
  });

  t.end();
});

tap.test("non-strict validation tests with account", function (t) {
  t.test("GET /api/account", function (t) {
    supertest(server)
      .get('/api/account')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err) {
        t.error(err, 'no error');
        t.end();
      })
    ;
  });

  t.test("POST /api/account", function (t) {
    supertest(server)
      .post('/api/account')
      .send({ id: 'josh' })
      .expect(422)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body, errors;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.doesNotThrow(function () {
          errors = body.errors;
        }, 'errors is defined');

        t.ok(Array.isArray(errors), 'errors is an array');

        var property, expected, message;
        try {
          property = errors[0].property;
          expected = errors[0].expected;
          message = errors[0].message;
        }
        catch (err) {}

        t.equal(property, 'email', 'first error has email property');
        t.equal(expected, true, 'email is expected');
        t.equal(message, 'is required', 'email is required');

        t.end();
      });
    ;
  });

  t.test("GET /api/account/josh", function (t) {
    supertest(server)
      .get('/api/account/josh')
      .expect(404)
      .expect('Content-Type', 'application/json')
      .end(function (err) {
        t.error(err, 'no account for josh');
      })
    ;
    t.end();
  });

  t.test("POST /api/account", function (t) {
    supertest(server)
      .post('/api/account')
      .send({ id: 'josh', email: 'not a valid email' })
      .expect(422)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body, errors;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.doesNotThrow(function () {
          errors = body.errors;
        }, 'errors is defined');

        t.ok(Array.isArray(errors), 'errors is an array');

        var property, expected, attribute, message;
        try {
          property = errors[0].property;
          expected = errors[0].expected;
          attribute = errors[0].attribute;
          message = errors[0].message;
        }
        catch (err) {}

        t.equal(property, 'email', 'first error has email property');
        t.equal(expected, 'email', 'email is expected');
        t.equal(attribute, 'format', 'format invalidated');
        t.equal(message, 'is not a valid email', 'email is invalid');

        t.end();
      });
    ;
  });

  t.test("GET /api/account/josh", function (t) {
    supertest(server)
      .get('/api/account/josh')
      .expect(404)
      .expect('Content-Type', 'application/json')
      .end(function (err) {
        t.error(err, 'no account for josh');
      })
    ;
    t.end();
  });

  t.test("POST /api/account", function (t) {
    supertest(server)
      .post('/api/account')
      .send({ id: 'josh', email: 'josh@jesusabdullah.net' })
      .expect(201) // TODO: .expect(201)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.equal(body.id, 'josh', 'user is josh');

        t.end();
      });
    ;
  });

  t.test("GET /api/account/josh", function (t) {
    supertest(server)
      .get('/api/account/josh')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function (err) {
        t.error(err, 'no error');
      })
    ;
    t.end();
  });

  t.test("POST /api/account/josh/update", function (t) {
    supertest(server)
      .post('/api/account/josh/update')
      .send({ email: 'not a valid email' })
      .expect(422)
      .expect('Content-Type', 'application/json')
      .end(function (err, res) {
        t.error(err, 'no error');

        var body, errors;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.doesNotThrow(function () {
          errors = body.errors;
        }, 'errors is defined');

        t.ok(Array.isArray(errors), 'errors is an array');

        var property, expected, attribute, message;
        try {
          property = errors[0].property;
          expected = errors[0].expected;
          attribute = errors[0].attribute;
          message = errors[0].message;
        }
        catch (err) {}

        t.equal(property, 'email', 'first error has email property');
        t.equal(expected, 'email', 'email is expected');
        t.equal(attribute, 'format', 'format invalidated');
        t.equal(message, 'is not a valid email', 'email is invalid');

        t.end();
      });
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
