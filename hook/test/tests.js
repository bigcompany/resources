var tap = require('tap'),
    test = tap.test,
    resource = require('resource'),
    hook = resource.use('hook'),
    creature = resource.use('creature');

var counter = resource.counter = resource.define('counter');
counter.property('message', {
  type: 'string'
});
counter.property('timestamp', { type: 'any' });

counter.persist('memory');

creature.method('poke', function (text, cb) {
  if (!cb) {
    cb = text;
    text = 'poked!';
  }
  cb(null, text);
});

test("create hooks",function (t) {
  var hooks = [
    { if: 'creature::create', then: 'counter::create', with: { message: 'creature create' }},
    { if: 'creature::poke', then: 'creature::create', with: { life: 100 }},
    { if: 'creature::poke', then: 'counter::create', with: { message: 'creature poke' }}
  ];

  t.plan(3);
  hooks.forEach(function (h) {
    hook.create(h, function (err, _h) {
      t.error(err, 'created hook ' + _h.id);
    });
  });
});

test("start hooks", function (t) {
  hook.start(function (err) {
    t.error(err, 'hooks started');
    t.end();
  });
});

test("create creatures", function (t) {
  var creatures = [
    { id: 'korben', life: 10, type: 'dragon' },
    { id: 'hazel', life: 15, type: 'dragon' },
    { id: 'booboo', life: 10, type: 'unicorn' }
  ];

  t.plan(3);

  creatures.forEach(function (c) {
    creature.create(c, function (err) {
      t.error(err, 'created creature ' + c.id);
    });
  });
});

test("call poke", function (t) {
  creature.poke(function (err, text) {
    t.equal(text, 'poked!', 'creature was poked');
    t.end();
  });
});

test("hooks fired", function (t) {
  creature.all(function (err, creatures) {
    t.error(err, 'got all creatures');
    counter.all(function (err, counters) {
      t.error(err, 'got all counters');
      hook.all(function (err, hooks) {
        t.error(err, 'got all hooks');

        t.equal(creatures.length, 4, 'four creatures');
        t.equal(counters.length, 4, 'four counters');
        t.equal(hooks.length, 3, 'three hooks');

        t.end();
      });
    });
  });
});
