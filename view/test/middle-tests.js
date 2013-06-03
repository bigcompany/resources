var test = require("tap").test,
  resource = require("resource"),
  supertest = require('supertest'),
  html = resource.use("html"),
  view = resource.use('view'),
  http = resource.use('http');

//
// -------- Middleware Testing ----------
//

// TODO: modules express and connect were not auto-loaded?

http.start(function () {

  test("load a view/layout with http and view.middle", function(t) {
    t.plan(4);
    view.create( { path: __dirname + "/view17" } , function(err, _view) {
      t.error(err, 'no error');
      t.ok(_view, 'view is returned');

      http.app.use(view.middle({view: _view}));

      supertest(http.app)
        .get('/root')
        .end(function(err, res){
          if (err) throw err;
          t.error(err, 'no error');
          t.equal(res.text, '<h1>big</h1>\n<div id="main"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
            'response returns correct result');
          t.end();
      });
    });
  });

  test("load nested view/layout with http and view.middle", function(t) {
    t.plan(6);
    view.create( { path: __dirname + "/view18" } , function(err, _view) {
      t.error(err, 'no error');
      t.ok(_view, 'view is returned');

      http.app.use(view.middle({view: _view}));

      supertest(http.app) // first test index
        .get('/index')
        .end(function(err, res){
          if (err) throw err;
          t.error(err, 'no error');
          t.equal(res.text,
            '<h1>big</h1>\n<h2>nothing</h2>\n<div id="main"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
            'response returns correct result');
      });

      supertest(http.app) // then test test/table
        .get('/test/table')
        .end(function(err, res){
          if (err) throw err;
          t.error(err, 'no error');
          t.equal(res.text,
            '<h1>nothing</h1>\n<h2>big</h2>\n<div id="main"><div class="table">steve</div>\n</div>',
            'response returns correct result');
          t.end();
      });
    });
  });

  test("load nested views/layouts with http and view.middle", function(t) {
    t.plan(10);
    view.create( { path: __dirname + "/view19" } , function(err, _view) {
      t.error(err, 'no error');
      t.ok(_view, 'view is returned');

      http.app.use(view.middle({view: _view}));

      supertest(http.app) // first test index2
        .get('/index2')
        .end(function(err, res){
          if (err) throw err;
          t.error(err, 'no error');
          t.equal(res.text,
            '<h1>big</h1>\n<h2>nothing</h2>\n<div id="main"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
            'response returns correct result');
      });

      supertest(http.app) // then test table2
        .get('/table2')
        .end(function(err, res){
          if (err) throw err;
          t.error(err, 'no error');
          t.equal(res.text,
            '<h1>big</h1>\n<h2>nothing</h2>\n<div id="main"><div class="table">steve</div>\n</div>',
            'response returns correct result');
      });

      supertest(http.app) // then test test2/index
        .get('/test2/index')
        .end(function(err, res){
          if (err) throw err;
          t.error(err, 'no error');
          t.equal(res.text,
            '<h1>nothing</h1>\n<h2>big</h2>\n<div id="main"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
            'response returns correct result');
      });

      supertest(http.app) // then test test2/table
        .get('/test2/table')
        .end(function(err, res){
          if (err) throw err;
          t.error(err, 'no error');
          t.equal(res.text,
            '<h1>nothing</h1>\n<h2>big</h2>\n<div id="main"><div class="table">steve</div>\n</div>',
            'response returns correct result');
          t.end();
      });
    });
  });

});


/*test("nested views, nested layouts affect only appropriate directory level", function(t) {
  view.create( { path: __dirname + "/view16" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>big</h1>\n<h2>nothing</h2>\n<div id="main"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
        'present() returns correct result');
    });
    _view.test.table.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>nothing</h1>\n<h2>big</h2>\n<div id="main"><div class="table">steve</div>\n</div>',
        'present() returns correct result');
      t.end();
    });
  });
});*/