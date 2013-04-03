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
      .get('/api/creature/korben/feed')
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
      .get('/api/creature/korben')
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
      .get('/api/creature/korben/feed')
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
      .get('/api/creature/korben')
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
      .get('/api/creature/korben/hit')
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
      .get('/api/creature/korben')
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
      .get('/api/creature/korben/hit')
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
      .get('/api/creature/korben')
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

tap.test("strict validation tests with account", function (t) {
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

  t.test("POST /api/account/marak", function (t) {
    supertest(server)
      .post('/api/account', {})
      .expect(422)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body, errors;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.doesNotThrow(function () {
          errors = body.validate.errors;
        }, 'validate.errors is defined');

        t.type(errors, 'errors', 'errors is an array');

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

  t.test("GET /api/account/marak", function (t) {
    supertest(server)
      .get('/api/account/marak')
      .expect(404)
      .end(function (err) {
        t.error(err, 'no account for marak');
      })
    ;
    t.end();
  });

  t.test("POST /api/account/marak", function (t) {
    supertest(server)
      .post('/api/account', { email: 'not a valid email' })
      .expect(422)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body, errors;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.doesNotThrow(function () {
          errors = body.validate.errors;
        }, 'validate.errors is defined');

        t.type(errors, 'errors', 'errors is an array');

        var property, expected, attribute, message;
        try {
          property = errors[0].property;
          expected = errors[0].expected;
          attribute = errors[0].attribute;
          message = errors[0].message;
        }
        catch (err) {}

        t.equal(property, 'email', 'first error has email property');
        t.equal(expected, true, 'email is expected');
        t.equal(attribute, 'format', 'format invalidated');
        t.equal(message, 'is not a valid email', 'email is invalid');

        t.end();
      });
    ;
  });

  t.test("GET /api/account/marak", function (t) {
    supertest(server)
      .get('/api/account/marak')
      .expect(404)
      .end(function (err) {
        t.error(err, 'no account for marak');
      })
    ;
    t.end();
  });

  t.test("POST /api/account/marak", function (t) {
    supertest(server)
      .post('/api/account', { email: 'marak@marak.com' })
      .expect(201)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.equal(body.id, 'marak', 'user is marak');

        t.end();
      });
    ;
  });

  t.test("GET /api/account/marak", function (t) {
    supertest(server)
      .get('/api/account/marak')
      .expect(200)
      .end(function (err) {
        t.error(err, 'no error');
      })
    ;
    t.end();
  });

  t.test("PUT /api/account/marak", function (t) {
    supertest(server)
      .post('/api/account/marak', { email: 'not a valid email' })
      .expect(422)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body, errors;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.doesNotThrow(function () {
          errors = body.validate.errors;
        }, 'validate.errors is defined');

        t.type(errors, 'errors', 'errors is an array');

        var property, expected, attribute, message;
        try {
          property = errors[0].property;
          expected = errors[0].expected;
          attribute = errors[0].attribute;
          message = errors[0].message;
        }
        catch (err) {}

        t.equal(property, 'email', 'first error has email property');
        t.equal(expected, true, 'email is expected');
        t.equal(attribute, 'format', 'format invalidated');
        t.equal(message, 'is not a valid email', 'email is invalid');

        t.end();
      });
    ;
  });

  t.test("PUT /api/account/marak", function (t) {
    supertest(server)
      .put('/api/account/marak', { email: 'marak@big.vc' })
      .expect(201)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.equal(body.id, 'marak', 'user is marak');
        t.equal(body.email, 'marak@big.vc', 'email is updated');

        t.end();
      });
    ;
  });

  t.test("GET /api/account/marak", function (t) {
    supertest(server)
      .get('/api/account/marak')
      .expect(200)
      .end(function (err) {
        t.error(err, 'no error');

        var body = {};
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.equal(body.id, 'marak', 'user is marak');
        t.equal(body.email, 'marak@big.vc', 'email is updated');
      })
    ;
    t.end();
  });

  //
  // TODO: Tests for POSTing to /api/account with email and other property
  // without id
  //
});

tap.test("non-strict api tests with creature", function (t) {
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

  t.test("POST /api/creature/new", function (t) {
    supertest(server)
      .post('/api/creature/new', { id: 'gordita' })
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.type(body.creature, 'object', 'creature is object');
        var creature = body.creature || {};
        t.equal(creature.id, 'gordita', 'id is gordita');
        t.equal(creature.life, 10, 'life is 10');

        t.end();
      })
    ;
  });

  t.test("GET /api/creature/gordita", function (t) {
    supertest(server)
      .get('/api/creature/gordita')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.type(body.creature, 'object', 'creature is object');
        var creature = body.creature || {};
        t.equal(creature.id, 'gordita', 'id is gordita');
        t.equal(creature.life, 10, 'life is 10');

        t.end();
      })
    ;
  });

  t.test("POST /api/creature/gordita/update", function (t) {
    supertest(server)
      .post('/api/creature/gordita/update', { type: 'dragon' })
      .expect(204)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.type(body.creature, 'object', 'creature is object');
        var creature = body.creature || {};
        t.equal(creature.id, 'gordita', 'id is gordita');
        t.equal(creature.type, 'dragon', 'type is dragon');
        t.equal(creature.life, 10, 'life is 10');

        t.end();
      })
    ;
  });

  t.test("POST /api/creature/gordita/destroy", function (t) {
    supertest(server)
      .post('/api/creature/gordita/destroy')
      .expect(204)
      .end(function (err, res) {
        t.error(err, 'gordita is destroyed');
        t.end();
      })
    ;
  });

  t.test("GET /api/creature/gordita", function (t) {
    supertest(server)
      .get('/api/creature/gordita')
      .expect(404)
      .end(function (err, res) {
        t.error(err, 'destroyed creature not found');

        t.end();
      })
    ;
  });

  t.test("POST /api/creature/new", function (t) {
    supertest(server)
      .post('/api/creature/new', { id: 'chi-chi' })
      .expect(201)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.type(body.creature, 'object', 'creature is object');
        var creature = body.creature || {};
        t.equal(creature.id, 'chi-chi', 'id is chi-chi');

        t.end();
      })
    ;
  });

  t.test("GET /api/creature/chi-chi", function (t) {
    supertest(server)
      .get('/api/creature/chi-chi')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.type(body.creature, 'object', 'creature is object');
        var creature = body.creature || {};
        t.equal(creature.id, 'chi-chi', 'id is chi-chi');
        t.equal(creature.life, 10, 'life is 10');

        t.end();
      })
    ;
  });

  t.test("POST /api/creature/chi-chi", function (t) {
    supertest(server)
      .post('/api/creature/chi-chi', { id: 'nibblet', type: 'dragon' })
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.type(body.creature, 'object', 'creature is object');
        var creature = body.creature || {};
        t.equal(creature.id, 'nibblet', 'id is nibblet');
        t.equal(creature.type, 'dragon', 'type is dragon');

        t.end();
      })
    ;
  });

  t.test("GET /api/creature/chi-chi", function (t) {
    supertest(server)
      .get('/api/creature/chi-chi')
      .expect(404)
      .end(function (err, res) {
        t.error(err, 'chi-chi not found');
        t.end();
      })
    ;
  });

  t.test("GET /api/creature/nibblet", function (t) {
    supertest(server)
      .get('/api/creature/nibblet')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.type(body.creature, 'object', 'creature is object');
        var creature = body.creature || {};
        t.equal(creature.id, 'nibblet', 'id is nibblet');

        t.end();
      })
    ;
  });

  t.test("GET /api/creature/find", function (t) {
    supertest(server)
      .get('/api/creature/find')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.type(body.creature, 'array', 'creature is array');

        t.end();
      })
    ;
  });

  t.test("POST /api/creature/find", function (t) {
    supertest(server)
      .post('/api/creature/find')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.type(body.creature, 'array', 'creature is array');

        t.end();
      })
    ;
  });

  t.test("POST /api/creature/find", function (t) {
    supertest(server)
      .post('/api/creature/find', { type: 'dragon' })
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');
        var creatures = body.creature || null;
        t.type(creatures, 'array', 'creature is array');

        for (var creature in creatures) {
          t.equal(creature.type, 'dragon', 'creature is dragon');
        }

        t.end();
      })
    ;
  });

  t.test("GET /api/creature/find?type=dragon", function (t) {
    supertest(server)
      .get('/api/creature/find?type=dragon')
      .expect(200)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');
        var creatures = body.creature || null;
        t.type(creatures, 'array', 'creature is array');

        for (var creature in creatures) {
          t.equal(creature.type, 'dragon', 'creature is dragon');
        }

        t.end();
      })
    ;
  });
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
      .post('/api/account', { id: 'josh' })
      .expect(422)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body, errors;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.doesNotThrow(function () {
          errors = body.validate.errors;
        }, 'validate.errors is defined');

        t.type(errors, 'errors', 'errors is an array');

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
      .post('/api/account', { id: 'josh', email: 'not a valid email' })
      .expect(422)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body, errors;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.doesNotThrow(function () {
          errors = body.validate.errors;
        }, 'validate.errors is defined');

        t.type(errors, 'errors', 'errors is an array');

        var property, expected, attribute, message;
        try {
          property = errors[0].property;
          expected = errors[0].expected;
          attribute = errors[0].attribute;
          message = errors[0].message;
        }
        catch (err) {}

        t.equal(property, 'email', 'first error has email property');
        t.equal(expected, true, 'email is expected');
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
      .post('/api/account', { user: 'josh', email: 'josh@jesusabdullah.net' })
      .expect(201)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
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
      .post('/api/account/josh/update', { email: 'not a valid email' })
      .expect(422)
      .end(function (err, res) {
        t.error(err, 'no error');

        var body, errors;
        t.doesNotThrow(function () {
          body = JSON.parse.bind(null, res.body);
        }, 'body is valid JSON');

        t.doesNotThrow(function () {
          errors = body.validate.errors;
        }, 'validate.errors is defined');

        t.type(errors, 'errors', 'errors is an array');

        var property, expected, attribute, message;
        try {
          property = errors[0].property;
          expected = errors[0].expected;
          attribute = errors[0].attribute;
          message = errors[0].message;
        }
        catch (err) {}

        t.equal(property, 'email', 'first error has email property');
        t.equal(expected, true, 'email is expected');
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
