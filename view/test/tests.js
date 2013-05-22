var test = require("tap").test,
	resource = require("resource"),
	supertest = require("supertest"),
	view = resource.use('view');

test("start a view with no callback", function (t) {
	var _view = view.create(); // no options
	t.ok(_view, 'view is returned');
	_view = view.create( {} ); // empty options
	t.ok(_view, 'view is returned');

	// check default properties
	t.equal(_view.name, '', 'default name is \'\'');


	t.end();
});

test("start a view with a callback", function (t) {
	view.create( {} , function (err, _view) {
		t.error(err, 'no error');
		t.ok(_view, 'view is returned');
		t.end();
	});
});

test("start a view with given path", function (t) {
	view.create( {} , function(err, _view) {
		console.log("hi", _view);
		t.end();
	});


});