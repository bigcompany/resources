var resource = require('resource');

module['exports'] = function (options, callback) {

  var r = resource.resources[options.resource];

  var output = '',
     $ = this.$,
     self = this,
     inflect = '',
     record = options.data || {},
     entity  = '',
     _props = r.methods.update.schema.properties.options.properties;

  $('legend').html(r.methods.update.schema.description);


  if (options.data && options.data.submit) {
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
  else if (options.id) {
    return r.get(options.id || options.data.id, function(err, record) {
      showForm(record);
    });
  }
  else {
    $('table').remove();
    var input = _props['id'];
    input.name = 'id';
    input.value = input.default || '';
    options.control = input;
    self.parent.inputs.index.present(options, function(err, re){
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

      options.control = input;
      self.parent.inputs.index.present(options, cont);
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
