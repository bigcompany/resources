var layout = require('./layout');

module['exports'] = function (options, callback) {

  options = options || {};

  var $ = this.$,
    self = this,
    output = '',
    method = options.method,
    entity = options.name || 'unknown';

  if (typeof options.data !== 'undefined') {
    $('form').remove();
    options.method(options.data, function(err, result) {
      $('.result').html(JSON.stringify(result, true, 2));
      callback(null, $.html());
    });
  } else {

    $('.results').remove();
    if(typeof method.schema.properties !== 'undefined') {
      var _props = method.schema.properties;
      if (typeof method.schema.properties.options.properties !== 'undefined') {
        _props = method.schema.properties.options.properties;
      }
      Object.keys(_props).forEach(function (property) {
        var input = _props[property];
        input.name = property;
        input.value = input.default || '';
        if (input.writeable !== false) {
          output += layout.renderControl(input, options);
        }
      });
    }

    $('h1').html(entity + ' - create');
    $('legend').html(entity + ' form');
    $('.inputs').html(output);
    $('input[type="submit"]').attr('value', options.name);
    callback(null, $.html());

  }

}