var tap = require('tap'),
    test = tap.test,
    resource = require('resource'),
    hook = resource.use('hook');

//
// Mock account resource
//
var account = resource.account = resource.define('account');
account.property('email', {
  type: 'string', format: 'email'
});
account.persist('memory');

//
// Mock email resource
//
var email = resource.email = resource.define('email');
email.method('send', send, {
  properties: {
    options: {
      properties: {
        email: { type: 'string', format: 'email' },
        from: { type: 'string', format: 'email' },
        subject: { type: 'string' },
        body: { type: 'string' }
      },
    },
    callback:{ type: 'function' }
  }
});

var emails = [];
function send(options, callback) {
  emails.push(options);
  callback(null, options);
};

test("create hooks",function (t) {
  hook.create({
    if: 'account::create',
    then: 'email::send',
    with: {
      from: 'noreply@big.vc',
      subject: 'Your account has been created',
      body: 'Your account has been created. Visit http://big.vc and log in.'
    }
  }, function (err, _h) {
    t.error(err, 'created hook ' + _h.id);
    t.end();
  });
});

test("start hooks", function (t) {
  hook.start(function (err) {
    t.error(err, 'hooks started');
    t.end();
  });
});

test("create account", function (t) {
  account.create({ id: 'josh', email: 'josh.holbrook@gmail.com' }, function (err, a) {
    t.error(err, 'created account ' + a.id);
    t.end();
  });
});

test("hook fired", function (t) {
  t.equal(emails.length, 1, 'sent an email');
  t.equal(emails[0].email, 'josh.holbrook@gmail.com', 'email is same as account');
  t.equal(emails[0].from, 'noreply@big.vc', 'reply email is as in "with"');
  t.equal(emails[0].subject, 'Your account has been created', 'subject is as in "with"');
  t.end();
});
