var layout = require('./layout'),
    resource = require('resource');

module['exports'] = function (options, callback) {

  var r = resource.resources[options.resource];

  var output = '',
     $ = this.$,
     self = this,
     inflect = 'foos',
     record = options.data || {},
     entity  = 'foo',
     _props = r.methods.update.schema.properties.options.properties;

  if (options.data) {
    r.update(options.data, function(err, result){
      if (err) {
        $('.message').html(err.message);
        $('form').remove();
        output = $.html();
        return callback(null, output);
      } else {
        //$('.message').html('Updated!');
        //$('form').remove();
        self.parent.get.present({ resource: options.resource, id: result.id }, function(err, re){
          console.log(err, re);
          return callback(null, re);
        });
      }
    });
  }
  else if (typeof options.id !== 'undefined') {

    r.get(options.id, function(err, record){
      cont = function(err, result) {
        if (result) {
          output += result;
        }
        if(arr.length === 0) {
          $('.inputs').html(output);
          return callback(null, $.html())
        }
        var property = arr.pop();
        var schema = r.schema.properties[property];
        var input = {};
        input.description = schema.description;
        input.name = property;
        input.key = schema.key;
        input.value = record[property] || '';
        input.format = schema.format;
        input.type = schema.type;
        input.enum = schema.enum || '';
        input.editable = schema.editable;
        layout.renderControl(input, options, cont);
      };
      var arr = Object.keys(r.schema.properties);
      arr.reverse();
      cont();

      if (options.updated) {
        $('h1').html('Updated!');
      } else {
        $('h1').html('Update ' + (record.id || entity));
      }

      $('.back').html('back to ' + entity);
      $('.back').attr('href', '/' + entity);
      $('legend').html(r.methods.update.schema.description);

    });

  } 

  else {

    $('table').remove();
    var input = _props['id'];
    input.name = 'id';
    input.value = input.default || '';
    layout.renderControl(input, options, function(err, re){
      $('h1').html(entity + ' - create');
      $('legend').html(entity + ' form');
      $('input[type="submit"]').attr('value', 'Get ' + entity);
      $('.inputs').html(re);
      return callback(null, $.html());
    });

  }

 };