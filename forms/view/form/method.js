var layout = require('./layout'),
    resource = require('resource');

module['exports'] = function (options, callback) {

  options = options || {};

  var $ = this.$,
    self = this,
    output = '',
    method = resource[options.resource].methods[options.method],
    entity = options.resource || 'unknown';

  if (typeof options.data !== 'undefined') {
    $('form').remove();
    method(options.data, function(err, result) {
      $('.result').html(JSON.stringify(result, true, 2));
      callback(null, $.html());
    });
  } else {

    $('.results').remove();

    if(typeof method.schema.properties !== 'undefined') {
      var _props = method.schema.properties || {};

      if (method.schema.properties.options && typeof method.schema.properties.options.properties !== 'undefined') {
        _props = method.schema.properties.options.properties;
      }

      $('h1').html(entity + ' - create');
      $('legend').html(entity + ' form');
      $('input[type="submit"]').attr('value', options.name);

      cont = function(err, result) {
        if (result) {
          output += result;
        }
        if(arr.length === 0) {
          $('.inputs').html(output);
          return callback(null, $.html())
        }
        var property = arr.pop();
        var input = _props[property];
        input.name = property;
        input.value = input.default || '';
        layout.renderControl(input, options, function(err, str){
          cont(err, str);
        });
      };

      var arr = Object.keys(_props);
      console.log(arr);
      arr.reverse();
      cont();

    } else {
      callback(null, $.html());
    }

  }

}