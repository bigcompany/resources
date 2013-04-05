var tap = require("tap"),
    supertest = require('supertest'),
    resource = require('resource'),
    server;

tap.test("start an api server", function (t) {
  resource.use('creature');
  resource.use('account');
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
  t.test("get /api", function (t) {
    supertest(server)
      .get('/api')
      .expect(200)
      .end(function (err) {
        t.error(err, 'no error');
        t.end();
      })
    ;
  });

  t.test("get /api/creature", function (t) {
    supertest(server)
      .get('/api/creature')
      .expect(200)
      .end(function (err, res) {

        t.error(err, 'no error');
        t.end();
      })
    ;
  });

  t.test("create a new creature by posting to /api/creature with id", function (t) {
    supertest(server)
      .post('/api/creature/korben')
      .expect(201)
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
      .expect(201)
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

  t.test("call creature method by getting /api/creature/korben/fire", function (t) {
    supertest(server)
      .get('/api/creature/korben/fire')
      .expect(200)
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

  //
  // TODO: resource.creature does not have a feed method.
  // We should write other tests that try to cover this functionality
  // instead (ie, methods which modify the creature).
  //
  /*
  t.test("GET /api/creature/korben/feed", function (t) {
    supertest(server)
      .get('/api/creature/korben/feed')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.type(body, 'string', 'result is a string');

        t.end();
      })
    ;
  });

  /*
  t.test("GET /api/creature/korben", function (t) {
    supertest(server)
      .get('/api/creature/korben')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
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
      .get('/api/creature/korben/feed')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.bind(res.text);
        }, 'body is valid JSON');

        t.type(body.result, 'string', 'result is a string');

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

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
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
      .get('/api/creature/korben/hit')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.type(body.result, 'string', 'result is a string');

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

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
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
      .get('/api/creature/korben/hit')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.type(body.result, 'string', 'result is a string');

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

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.type(body.creature, 'object', 'creature is object');
        var creature = body.creature || {};
        t.equal(creature.life, 10, 'life is 10');

        t.end();
      })
    ;
  });
  */

  t.test("get nonexistent creature method /api/creature/korben/_die", function (t) {
    supertest(server)
      .get('/api/creature/korben/_die')
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
      .end(function (err) {
        t.error(err, 'deleted creature is not found');
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
      .end(function (err) {
        t.error(err, 'no error');
        t.end();
      })
    ;
  });

  t.test("try to create /api/account/marak without an email", function (t) {
    supertest(server)
      .post('/api/account/marak')
      .expect(422)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body, errors;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.doesNotThrow(function () {
          errors = body.validate.errors;
        }, 'validate.errors is defined');

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
      .end(function (err) {
        t.error(err, 'no account for marak');
        t.end();
      })
    ;
  });

  t.test("try to create /api/account/marak with invalid email", function (t) {
    supertest(server)
      .post('/api/account/marak')
      .send({ email: 'not_a_valid_email' })
      .expect(422)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body, errors;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.doesNotThrow(function () {
          errors = body.validate.errors;
        }, 'validate.errors is defined');

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
      .end(function (err) {
        t.error(err, 'no account for marak');
        t.end();
      })
    ;
  });

  t.test("create /api/account/marak with valid email", function (t) {
    supertest(server)
      .post('/api/account/marak')
      .send({ email: 'marak@marak.com' })
      .expect(201)
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
      .end(function (err) {
        t.error(err, 'no error');
        t.end();
      })
    ;
  });

  t.test("try to update /api/account/marak with invalid email", function (t) {
    supertest(server)
      .post('/api/account/marak')
      .send({ email: 'not_a_valid_email' })
      .expect(422)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body, errors;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.doesNotThrow(function () {
          errors = body.validate.errors;
        }, 'validate.errors is defined');

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
      .expect(201)
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

  //
  // TODO: Tests for POSTing to /api/account with email and other property
  // without id
  //

  t.end();
});

tap.test("non-strict api tests with creature", function (t) {
  t.test("get /api", function (t) {
    supertest(server)
      .get('/api')
      .expect(200)
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
      .expect(201)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.type(body, 'object', 'creature is object');
        t.equal(body.id, 'leila', 'id is leila');
        t.equal(body.type, 'dragon', 'type is unicorn');
        t.equal(body.life, 10, 'life is 10');

        t.end();
      })
    ;
  });

  t.test("destroy creature by posting to /api/creature/leila/destroy", function (t) {
    supertest(server)
      .post('/api/creature/leila/destroy')
      .expect(204)
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
      .end(function (err, res) {
        t.error(err, 'destroyed creature not found');

        t.end();
      })
    ;
  });

  t.test("create creature by posting to /api/creature/create", function (t) {
    supertest(server)
      .post('/api/creature/create')
      .send({ id: 'chi-chi' })
      .expect(201)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.type(body, 'object', 'creature is object');
        t.equal(body.id, 'chi-chi', 'id is chi-chi');

        t.end();
      })
    ;
  });

  t.test("get created creature /api/creature/chi-chi", function (t) {
    supertest(server)
      .get('/api/creature/chi-chi')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.type(body, 'object', 'creature is object');
        t.equal(body.id, 'chi-chi', 'id is chi-chi');
        t.equal(body.life, 10, 'life is 10');

        t.end();
      })
    ;
  });

  t.test("update creature by posting to /api/creature/chi-chi/update", function (t) {
    supertest(server)
      .post('/api/creature/chi-chi/update')
      .send({ id: 'nibblet', type: 'dragon' })
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.type(body, 'object', 'creature is object');
        t.equal(body.id, 'nibblet', 'id is nibblet');
        t.equal(body.type, 'dragon', 'type is dragon');

        t.end();
      })
    ;
  });

  t.test("try to get updated creature with old id /api/creature/chi-chi", function (t) {
    supertest(server)
      .get('/api/creature/chi-chi')
      .expect(404)
      .end(function (err, res) {
        t.error(err, 'chi-chi not found');
        t.end();
      })
    ;
  });

  t.test("get updated creature with new id /api/creature/nibblet", function (t) {
    supertest(server)
      .get('/api/creature/nibblet')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.type(body, 'object', 'creature is object');
        t.equal(body.id, 'nibblet', 'id is nibblet');

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

  t.test("find creatures of type dragon by getting /api/creature/find?type=dragon", function (t) {
    supertest(server)
      .get('/api/creature/find?type=dragon')
      .expect(200)
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
      .end(function (err, res) {
        t.error(err, 'no error');

        var body, errors;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.doesNotThrow(function () {
          errors = body.validate.errors;
        }, 'validate.errors is defined');

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
      .end(function (err, res) {
        t.error(err, 'no error');

        var body, errors;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.doesNotThrow(function () {
          errors = body.validate.errors;
        }, 'validate.errors is defined');

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
      .expect(201)
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
      .end(function (err, res) {
        t.error(err, 'no error');

        var body, errors;
        t.doesNotThrow(function () {
          body = JSON.parse(res.text);
        }, 'body is valid JSON');

        t.doesNotThrow(function () {
          errors = body.validate.errors;
        }, 'validate.errors is defined');

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

  //
  // TODO: Test updates with string -> number coercions
  //

  t.end();
});

tap.test("stop an api server", function (t) {
  server.close(function (err) {
    t.ok(!err, 'no error');
    t.end();
  });
});
