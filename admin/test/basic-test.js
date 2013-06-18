var wd = require('wd')
  , assert = require('assert')
  , resource = require('resource')
  , server
  , browser = wd.remote();

/*
browser.on('status', function(info) {
  console.log(info.cyan);
});

browser.on('command', function(meth, path, data) {
  console.log(' > ' + meth.yellow, path.grey, data || '');
});

*/

var tap = require("tap");


tap.test('start the admin resource', function (t) {

  var admin = resource.use('admin');
  resource.use('account');
  resource.use('creature');
  admin.start(function(err, _server) {
	server = _server;
	t.ok(true, 'admin server started');
    t.end();
  });

});


tap.test('start the webdriver client', function (t) {

  browser.init({
      browserName: 'firefox'
      , tags : ["examples"]
      , name: "This is an example test"
    }, function() {

    t.ok(true, 'browser started');
    t.end();
  });

});

var baseUrlCreds = "http://admin:admin@localhost:8888/admin",
    baseUrl = "http://localhost:8888/admin";


tap.test("get /admin with credentials", function (t) {

  browser.get(baseUrlCreds, function (err, result) {
    browser.title(function(err, title) {
      t.equal(title, 'Admin', 'title is admin');
      t.end();
    });
  });

});

tap.test("click on resources link - should load /resources page", function (t) {
  browser.elementsByCssSelector('a.link', function (err, el) {
    browser.clickElement(el[0], function(){
      browser.eval("window.location.href", function(err, href) {
        t.equal(href, baseUrl + '/resources', 'found page');
        t.end();
      });
    });
  });
});

tap.test("click on creature link - should load /resources/creature page", function (t) {
  browser.elementsByCssSelector('.resources a', function (err, el) {
    browser.clickElement(el[2], function(){
      browser.eval("window.location.href", function(err, href) {
        t.equal(href, baseUrl + '/resources/creature', 'found page');
        t.end();
      });
    });
  });
});

tap.test("click on the first resource method - should load /resources/creature/all page", function (t) {
  browser.elementsByCssSelector('.methods a', function (err, el) {
    browser.clickElement(el[0], function(){
      browser.eval("window.location.href", function(err, href) {
        t.equal(href, baseUrl + '/resources/creature/all', 'found page');
        t.end();
      });
    });
  });
});

tap.test("click on the back link", function (t) {
  browser.elementsByCssSelector('.back', function (err, el) {
    browser.clickElement(el[0], function(){
      browser.eval("window.location.href", function(err, href) {
        t.equal(href, baseUrl + '/resources/creature', 'found page');
        t.end();
      });
    });
  });
});

tap.test("click on the second resource method - should load /resources/creature/create page", function (t) {
  browser.elementsByCssSelector('.methods a', function (err, el) {
    browser.clickElement(el[1], function(){
      browser.eval("window.location.href", function(err, href) {
        t.equal(href, baseUrl + '/resources/creature/create', 'found page');
        t.end();
      });
    });
  });
});

tap.test("submiting the form at /resources/creature/create", function (t) {
  browser.elementByCssSelector('form', function (err, form) {
    browser.submit(form, function(){
      browser.elementByCssSelector('.records', function (err, el) {
        // TODO: better detection of record creation
        t.type(el, Object, 'found a new record');
        t.end();
      });
    });
  });
});


tap.test('clean up and shut down browser', function (t) {
  browser.quit();
  t.end();
});

tap.test('clean up and shut down server', function (t) {
  server.close();
  t.end();
});