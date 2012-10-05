var assert = require('assert'),
    vows = require('vows'),
    helpers = require('./helpers'),
    viewful = require('../lib/viewful');

vows.describe('viewful/viewful-load-test').addBatch({
  'When using `viewful`': {
    'a new viewful.View()': {
      topic: new viewful.View(),
      'should return a new View': function (_view) {  
        assert.isObject(_view);
      },
      'should contain "load" function': function (_view) {
        assert.isFunction(_view.load);
      },
      /*
      'should contain default "input"': function (_view) {
        assert.equal(_view.input, "plates");
      },
      */
      'should contain default "output"': function (_view) {
        assert.equal(_view.output, "html");
      },
      'viewful.load("/invalid/path/to")' : {
        topic : function(_view){
          var loaded = _view.load("/invalid/path/to");
          this.callback(loaded);
        },
        'should error' : function(result){
          assert.isNotNull(result)
        }
      },
      'viewful.load("./examples/fixtures/swig/view/")' : {
        topic : function(_view){
          try {
            var loaded = _view.load("./examples/swig/view/");
            this.callback(null, loaded);
          } catch (err) {
            this.callback(err);
          }
        },
        'should not error' : function(err, result){
          assert.isNull(err)
        },
        'should return loaded templates' : function(err, result){
          assert.isObject(result)
        },
        'and templates should be valid' : function(err, result){
          assert.isObject(result)
          assert.isDefined(result.creature.create.template);
          assert.isDefined(result.creature.create.render);
          assert.isDefined(result.creature.create.present);
          assert.isDefined(result.creature.inputs.button.template);
          assert.isDefined(result.creature.inputs.button.render);
          assert.isDefined(result.creature.inputs.button.present);
        }
      },
      'viewful.load("./test/fixtures/views/simple/", cb)' : {
        topic : function(_view){
          _view.load("./test/fixtures/views/simple/", this.callback);
        },
        'should not error' : function(err, result){
          assert.isNull(err)
        },
        'should return loaded templates' : function(err, result){
          assert.isObject(result)
        },
        'and templates should be valid' : function(err, result){
          assert.isObject(result)
          assert.isDefined(result.index.template);
          assert.isDefined(result.bar.template);
          assert.isDefined(result.foo.template);
          assert.isDefined(result.bar.render);
          assert.isDefined(result.foo.render);
          assert.isDefined(result.bar.present);
        }
      }
    }
  }
}).export(module);

