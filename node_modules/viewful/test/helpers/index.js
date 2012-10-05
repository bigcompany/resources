var helpers = exports;
var assert = require('assert');

helpers.render = function (data, expected) {
  expected = expected || '';
  return {
    topic: function (_view) {
      _view.render(data, this.callback);
    },
    'should compile expected result': function (err, result) {
      assert.isNull(err);
      assert.equal(result, expected);
    }
  }
};

helpers.renderSync = function (data, expected) {
  expected = expected || '';
  if (expected === '') {
    return {
      topic: function (_view) {
        var msg = _view.input
                + ' template engine cannot render synchronously';
        try{ _view.render(data); }
        catch (err) { this.callback(err, msg); }
      },
      'should error': function (err, message) {
        assert.isObject(err);
        assert.equal(err.message, message);
      }
    };
  } else {
    return {
      topic: function (view) { return view; },
      'should compile expected result': function (_view) {
        assert.equal(_view.render(data), expected);
      }
    };
  }
};
