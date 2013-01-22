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
     _props = r.methods.update.schema.properties.options.properties,
     shouldGet;

  //
  // In the case that only the id is defined in options.data, we get the
  // resource instance instead of trying to do an update. A simpler approach
  // is to check that Object.keys(options.data) === 1, but this breaks when
  // properties are keyed but have undefined values.
  //
  shouldGet = Object.keys(_props).every(function (k) {
    var idAndIsSet = options.data && (k === 'id' && typeof options.data.id !== 'undefined'),
        notSet = options.data && typeof options.data[k] === 'undefined';

    return idAndIsSet || notSet;
  });

  $('legend').html(r.methods.update.schema.description);

  if (shouldGet) {
    r.get(options.id, function(err, record) {
      showForm(record);
    });
  }
  else if (options.data) {
    r.update(options.data, function(err, result){
      if (err) {
        err.errors.forEach(function(e){
          $('.message').append(JSON.stringify(e));
        });
        showForm(options.data, err.errors);
      } else {
        //$('.message').html('Updated!');
        //$('form').remove();
        self.parent.get.present({ resource: options.resource, id: result.id }, function(err, re){
          return callback(null, re);
        });
      }
    });
  }
  else {
    $('table').remove();
    var input = _props['id'];
    input.name = 'id';
    input.value = input.default || '';
    layout.renderControl(input, options, function(err, re){
      $('h1').html(entity + ' - create');
      $('input[type="submit"]').attr('value', 'Get ' + entity);
      $('.inputs').html(re);
      return callback(null, $.html());
    });
  }

  function showForm (record, errors)  {
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
      input.private = schema.private || false;
      input.description = schema.description;
      input.name = property;
      input.key = schema.key;
      input.value = record[property] || '';
      input.format = schema.format;
      input.type = schema.type;
      input.enum = schema.enum || '';
      input.editable = schema.editable;

      for(var e in errors) {
        if (errors[e].property === input.name) {
          input.error = errors[e];
        }
      }

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
  }

};
