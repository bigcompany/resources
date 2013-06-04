var test = require("tap").test,
  resource = require("resource"),
  html = resource.use("html"),
  view = resource.use('view');

test("start a view", function (t) {
  view.create( {} , function (err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');

    // check default properties
    t.equal(/.*\/view/.test(_view.viewPath), true, "default viewPath is '.*/view'");
    t.equal(_view.name, '', "default name is ''");
    t.equal(_view.template, undefined, "no template is loaded when no path is given");
    t.equal(_view.presenter, undefined, "no presenter is loaded when no path is given");
    t.end();
  });
});

test("start a view with a given template", function (t) {
  var _template = '<div class="user">\n\t<div class="name">name</div>\n\t<div class="email">email</div>\n</div>\n';
  view.create( { template: _template } , function (err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result, _template, 'present() returns correct result');
      t.end();
    });
  });
});

test("start a view with a given template and presenter", function (t) {
  var _template = '<div class="user">\n\t<div class="name">name</div>\n\t<div class="email">email</div>\n</div>\n';
  var _presenter = function (options, callback) {
      callback(null, 'hi');
  };
  view.create( { template: _template, presenter: _presenter } , function (err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    t.equal(_view.presenter, _presenter, 'view loaded given presenter');
    _view.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result, 'hi', 'present() returns correct result');
      t.end();
    });
  });
});

test("start a view with a given presenter but no template", function (t) {
  var _presenter = function (options, callback) {
      callback(null, 'hi');
  };
  view.create( { presenter: _presenter } , function (err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    t.equal(_view.presenter, _presenter, 'view loaded given presenter');
    t.equal(_view.template, undefined, 'view loaded empty string as template');
    _view.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result, "hi", 'present() returns correct result');
      t.end();
    });
  });
});

test("start view from single template at given path", function (t) {
  var viewPath = __dirname + "/view1";
  view.create( { path: viewPath } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    t.equal(_view.viewPath, viewPath,
      'viewPath was correctly set to path: ' + viewPath);
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<div class="user">\n\t<div class="name">name</div>\n\t<div class="email">email</div>\n</div>\n',
        'present() returns correct result');
      t.end();
    });
  });
});

test("start view from given path containing single template and presenter", function (t) {
  view.create( { path: __dirname + "/view2" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n',
        'present() returns correct result');
      t.end();
    });
  });
});

test("start view from given path containing single template and presenter with layout template", function (t) {
  view.create( { path: __dirname + "/view3" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>nothing</h1>\n<div id="main"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
        'present() returns correct result');
      t.end();
    });
  });
});

// TODO: is this test valid?
test("start view from given path containing single template and presenter with layout presenter", function (t) {
  view.create( { path: __dirname + "/view4" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,'<div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n');
      t.end();
    });
  });
});

test("start from view given path containing single template and presenter with layout template and presenter", function (t) {
  view.create( { path: __dirname + "/view5" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>big</h1>\n<div id="main"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
        'present() returns correct result');
      t.end();
    });
  });
});

test("presenters should have access to view object", function (t) {
  view.create( { path: __dirname + "/view6" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<div class="layout-name">layout</div>\n<div class="layout-template">%3Cdiv%20class%3D%22layout-name%22%3Ename%3C/div%3E%0A%3Cdiv%20class%3D%22layout-template%22%3Etemplate%3C/div%3E%0A%3Cdiv%20class%3D%22layout-presenter%22%3Epresenter%3C/div%3E%0A%3Cdiv%20class%3D%22layout-parent%22%3Eparent%3C/div%3E%0A%3Cdiv%20id%3D%22main%22%3E%3C/div%3E</div>\n<div class="layout-presenter">function%20%28options%2C%20callback%29%20%7B%0A%0A%20%20var%20%24%20%3D%20this.%24%3B%0A%0A%20%20%24%28%27.layout-name%27%29.html%28this.name%29%3B%0A%20%20%24%28%27.layout-template%27%29.html%28escape%28this.template%29%29%3B%0A%20%20%24%28%27.layout-presenter%27%29.html%28escape%28this.presenter%29%29%3B%0A%20%20%24%28%27.layout-parent%27%29.html%28this.parent.name%29%3B%0A%0A%20%20callback%28null%2C%20%24.html%28%29%29%3B%0A%7D</div>\n<div class="layout-parent"></div>\n<div id="main"><div class="name">index</div>\n<div class="template">%3Cdiv%20class%3D%22name%22%3Ename%3C/div%3E%0A%3Cdiv%20class%3D%22template%22%3Etemplate%3C/div%3E%0A%3Cdiv%20class%3D%22presenter%22%3Epresenter%3C/div%3E%0A%3Cdiv%20class%3D%22parent%22%3Eparent%3C/div%3E</div>\n<div class="presenter">function%20%28options%2C%20callback%29%20%7B%0A%0A%20%20var%20%24%20%3D%20this.%24%3B%0A%0A%20%20%24%28%27.name%27%29.html%28this.name%29%3B%0A%20%20%24%28%27.presenter%27%29.html%28escape%28this.presenter%29%29%3B%0A%20%20%24%28%27.parent%27%29.html%28this.parent.name%29%3B%0A%20%20%24%28%22.template%22%29.html%28escape%28this.template%29%29%3B%0A%0A%20%20callback%28null%2C%20%24.html%28%29%29%3B%0A%7D</div>\n<div class="parent"></div></div>',
        'present() returns correct result');
      t.end();
    });
  });
});

test("layout presenter should run before template presenter", function (t) {
  view.create( { path: __dirname + "/view7" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>big</h1>\n<div id="main"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
        'present() returns correct result');
      t.end();
    });
  });
});


test("layout presenter should modify a template before the template presenter is called", function (t) {
  view.create( { path: __dirname + "/view8" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<div id="main"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div></div>',
        'present() returns correct result');
      t.end();
    });
  });
});

test("layout presenter should be able to modify template presenter", function (t) {
  view.create( { path: __dirname + "/view9" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result, 'hi', 'present() returns correct result');
      t.end();
    });
  });
});

test("template presenter should be able to modify layout html", function (t) {
  view.create( { path: __dirname + "/view10" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>big</h1>\n<div id="main"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
        'present() returns correct result');
      t.end();
    });
  });
});

test("multiple views with a layout and presenter", function (t) {
  view.create( { path: __dirname + "/view11" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>big</h1>\n<div id="main"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>\n',
        'present() returns correct result');
    });
    _view.table.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>big</h1>\n<div id="main"><div class="table">steve</div>\n</div>\n',
        'present() returns correct result');
      t.end();
    });
  });
});

test("layout presenter and template presenter both see passed options", function (t) {
  view.create( { path: __dirname + "/view12" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({
      name: "Bob",
      email: "bob@bob.com",
      company: "big"
    }, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>big</h1>\n<div id="main"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
        'present() returns correct result');
      t.end();
    });
  });
});

test("multiple views with a layout and presenter, as well as options", function (t) {
  view.create( { path: __dirname + "/view13" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({
      name: "Bob",
      email: "bob@bob.com",
      company: "big"
    }, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>big</h1>\n<div id="main"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
        'present() returns correct result');
    });
    _view.table.present({
      table: "steve",
      company: "company"
    }, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>company</h1>\n<div id="main"><div class="table">steve</div>\n</div>',
        'present() returns correct result');
      t.end();
    });
  });
});

test("nested views, no layouts", function(t) {
  view.create( { path: __dirname + "/view15" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n',
        'present() returns correct result');
    });
    _view.test.table.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<div class="table">steve</div>\n',
        'present() returns correct result');
      t.end();
    });
  });
});

test("nested views, nested layouts affect only appropriate directory level", function(t) {
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
});