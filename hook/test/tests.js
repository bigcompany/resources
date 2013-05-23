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

counter.before('create', function (c, cb) {
  c.timestamp = new Date();
  cb(null, c);
});

creature.method('poke', function (text, cb) {
  if (!cb) {
    cb = text;
    text = 'poked!';
  }
  cb(null, text);
});

counter.after('create', function (c, cb) {
  console.log('# created counter ' + c.id);
  cb(null, c);
});

creature.after('create', function (c, cb) {
  console.log('# created creature ' + c.id);
  cb(null, c);
});

hook.after('create', function (h, cb) {
  console.log('# created hook ' + h.id);
  cb(null, h);
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
    { id: 'korben', life: 15, type: 'dragon' },
    { id: 'hazel', life: 15, type: 'dragon' },
    { id: 'booboo', life: 15, type: 'unicorn' }
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

  t.plan(18);

  hook.all(function (err, hooks) {
    t.error(err, 'got all hooks');
    t.equal(hooks.length, 3, 'three hooks total');
  });

  hook.find({ if: "creature::poke" }, function (err, hooks) {
    t.error(err, 'got hooks for creature::poke');
    t.equal(hooks.length, 2, 'two hooks for creature::poke');
  });

  hook.find({ then: "counter::create" }, function (err, hooks) {
    t.error(err, 'got hooks triggering counter::create');
    t.equal(hooks.length, 2, 'two hooks triggering counter::create');
  });

  creature.all(function (err, creatures) {
    t.error(err, 'got all creatures');
    t.equal(creatures.length, 4, 'four creatures total');
  });

  creature.find({ life: 15 }, function (err, creatures) {
    t.error(err, 'got creatures with life 15');
    t.equal(creatures.length, 3, 'three creatures with life 15');
  });

  creature.find({ life: 100 }, function (err, creatures) {
    t.error(err, 'got creatures with life 100');
    t.equal(creatures.length, 1, 'one creature with life 100');
  });

  counter.all(function (err, counters) {
    t.error(err, 'got all counters');
    t.equal(counters.length, 4, 'four counters total');
  });

  counter.find({ message: 'creature create' }, function (err, counters) {
    t.error(err, 'got counters from creature::create');
    t.equal(counters.length, 3, 'three counters from creature::create');
  });

  counter.find({ message: 'creature poke' }, function (err, counters) {
    t.error(err, 'got counters from creature::poke');
    t.equal(counters.length, 1, 'one counter from creature::poke');
  });
});
