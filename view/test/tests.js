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
		t.equal(_view.input, 'html', "default input is 'html'");
		t.equal(_view.output, 'html', "default output is 'html'");
		t.equal(_view.template, undefined, "no template is loaded when no path is given");
		t.end();
	});
});

test("start a view with a given template", function (t) {
	// TODO
	t.end();
});

// TODO: test different input/output types

test("start view from single template of given path", function (t) {
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

test("start view from single template and presenter of given path", function (t) {
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

test("start view from single template and presenter with layout", function (t) {
  view.create( { path: __dirname + "/view3" } , function(err, _view) {
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