var assert = require('assert'),
    vows = require('vows'),
    helpers = require('./helpers'),
    viewful = require('../lib/viewful');


vows.describe('viewful/viewful-basic-test').addBatch({
  'When using `viewful`': {
    'the viewful api': {
      topic: viewful,
      'should require without error': function (result) {
        assert(true, true);
      },
      topic: viewful,
      'should contain a top-level View class': function (_viewful) {
        assert.isFunction(_viewful.View);
      },
      'should contain engines': function (_viewful) {
        assert.isObject(_viewful.engines);
      },
      'should have loaded plates engine': function (_viewful) {
        assert.isObject(_viewful.engines['plates']);
        assert.isFunction(_viewful.engines['plates'].render);
      },
      'should be able to create a new View instance': function (_viewful) {
        assert.isObject(new _viewful.View());
      }
    },
    'a new viewful.View() with default options': {
      topic: new viewful.View(),
      'should return a new View': function (_view) {
        assert.isObject(_view);
      },
      'should contain "render" function': function (_view) {
        assert.isFunction(_view.render);
      },
      'should contain default "input"': function (_view) {
        assert.equal(_view.input, 'html');
      },
      'should contain default "output"': function (_view) {
        assert.equal(_view.output, "html");
      }
      /*
      'and calling View.compile()':                 helpers.compile(),
      'and calling View.compile(["p", user.name])': helpers.compile({ title : "hello!" }, null, null, "<h1>marak</h1>"),
      */
    }
  }
}).export(module);

