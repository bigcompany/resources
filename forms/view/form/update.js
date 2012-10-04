var layout = require('./layout');

module['exports'] = function (options, callback) {

  var resource = options.resource;
  var output = '',
     $ = this.$,
     inflect = 'foos',
     record = options.data || {},
     entity  = 'foo',
     _props = resource.methods.update.schema.properties.options.properties;

  if (options.data) {
    resource.update(options.data, function(err, result){
      if (err) {
        $('.message').html(err.message);
      } else {
        $('.message').html('updated!');
      }
      $('form').remove();
      output = $.html();
      return callback(null, output);
    });
  }
  else if (typeof options.id !== 'undefined') {

    resource.get(options.id, function(err, record){
      var schema = resource.schema.properties;
      Object.keys(resource.schema.properties).forEach(function (property) {
        var schema = resource.schema.properties[property];
        var input = {};
        input.description = schema.description;
        input.name = property;
        input.value = record[property] || '';
        input.format = schema.format;
        input.type = schema.type;
        input.enum = schema.enum || '';
        input.editable = schema.editable;
        output += layout.renderControl(input, options);
      });

      if (options.updated) {
        $('h1').html('Updated!');
      } else {
        $('h1').html('Update ' + (record.id || entity));
      }

      $('.back').html('back to ' + entity);
      $('.back').attr('href', '/' + entity);
      $('.inputs').html(output);
      $('legend').html(options.resource.methods.update.schema.description);
      //$('form').attr('action', '/' + entity + '/' + record.id + '/update');

      output = $.html();
      return callback(null, output);

    });

  } 

  else {

    $('table').remove();
    var input = _props['id'];
    input.name = 'id';
    input.value = input.default || '';
    if (input.writeable !== false) {
      output += layout.renderControl(input, options);
    }

    $('h1').html(entity + ' - create');
    $('legend').html(entity + ' form');
    $('.inputs').html(output);
    $('input[type="submit"]').attr('value', 'Get ' + entity);

    output = $.html();

    return callback(null, output);

  }

 };