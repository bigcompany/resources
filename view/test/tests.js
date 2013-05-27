var test = require("tap").test,
	resource = require("resource"),
	supertest = require("supertest"),
	html = resource.use("html"),
	markdown = resource.use("markdown"),
	view = resource.use('view');

test("start a view", function (t) {
	view.create( {} , function (err, _view) {
		t.error(err, 'no error');
		t.ok(_view, 'view is returned');

		// check default properties
		t.equal(/.*\/view/.test(_view.viewPath), true, "default viewPath is '.../view'");
		t.equal(_view.name, '', "default name is ''");
		//t.equal(_view.input, 'html', "default input is 'html'");
		//t.equal(_view.output, 'html', "default output is 'html'");
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

// TODO: ask marak if this even needs to be tested
/*test("start a view with a given presenter", function (t) {
	var _presenter = function (options, callback) {
			callback(null, 'hi');
	};
  view.create( { presenter: _presenter } , function (err, _view) {
		t.error(err, 'no error');
		t.ok(_view, 'view is returned');
		t.equal(_view.presenter, _presenter, 'view loaded given presenter');

		_view.present({}, function (err, result) {
			t.error(err, 'no error');
			t.ok(result, 'present returns result');
			t.equal(result, "hi", 'present() returns correct result');
			t.end();
		});
  });
});*/

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

//TODO: ask marak to test layout when given only a presenter?

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


// TODO: make the following test a layout with no presenter
/*
test("start view given path containing single template and presenter with layout template and presenter", function (t) {
  view.create( { path: __dirname + "/view4" } , function(err, _view) {
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
});*/

test("start view given path containing single template and presenter with layout template and presenter", function (t) {
  view.create( { path: __dirname + "/view4" } , function(err, _view) {
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
  view.create( { path: __dirname + "/view5" } , function(err, _view) {
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

// TODO: make layout presenter change index presenter, and do other stuff like that
// how to access index template from within layout presenter: this.parent.index.template, 