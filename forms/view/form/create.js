var layout = require('./layout');

module['exports'] = function (options, callback) {

  options = options || {};
  var resource = options.resource;

 var $ = this.$,
     self = this,
     output = '',
     entity = resource.name || 'unknown';

  if (options.data) {
    resource.create(options.data, function(err, result){
      if (err) {
        $('.message').html(err.message);
      } else {
        $('.message').html('created!');
      }
      $('form').remove();
      output = $.html();
      return callback(null, output);
    });
  } else {
    Object.keys(resource.schema.properties).forEach(function (property) {
      var input = resource.schema.properties[property];
      input.name = property;
      input.value = input.default || '';
      if (input.writeable !== false) {
        output += layout.renderControl(input, options);
      }
    });

    $('h1').html(entity + ' - create');
    $('.back').html('back to ' + entity);
    $('.back').attr('href', '/' + entity);

    $('legend').html(options.resource.methods.create.schema.description);
    $('.inputs').html(output);
    $('input[type="submit"]').attr('value', 'Create new ' + entity);

    output = $.html();

    if (callback) {
      return callback(null, output);
    }

    return output;
    
  }

}