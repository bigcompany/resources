var resource = require('resource');

module['exports'] = function (options, callback) {

  options = options || {};
  var $ = this.$,
    self = this,
    output = '',
    method = resource[options.resource].methods[options.method],
    entity = options.resource || 'unknown',
    desc;

  desc = method.schema.description || '';

  if (desc.length === 0) {
    desc = options.method;
  }

  $('#submit').attr('value', options.method);
  $('legend').html(desc);

  if (typeof options.data !== 'undefined') {
    var cb = function (err, result) {
      if (err) {
        if (err.errors) {
          err.errors.forEach(function(e){
            $('.result').append(JSON.stringify(e));
          });
        } else {
          $('.result').append(err.message);
        }
        return showForm(options.data, err.errors);
      } else {
        $('form').remove();
        $('.result').html(JSON.stringify(result, true, 2));
        return callback(null, $.html());
      }
    }
    return resource.invoke(method, options.data, cb);
  } else {
    $('.results').remove();
    showForm();
  }

  function showForm (data, errors) {
    data = data || {};
    if(typeof method.schema.properties !== 'undefined') {
      var _props = method.schema.properties || {};

      if (method.schema.properties.options && typeof method.schema.properties.options.properties !== 'undefined') {
        _props = method.schema.properties.options.properties;
      }

      $('h1').html(entity + ' - create');
      $('input[type="submit"]').attr('value', options.method);

      var cont = function(err, result) {
        if (result) {
          output += result;
        }
        if(arr.length === 0) {
          $('.inputs').html(output);
          return callback(null, $.html())
        }
        var property = arr.pop();
        var input = {};
        for(var p in _props[property]) {
          input[p] = _props[property][p];
        };
        input.name = property;
        for(var e in errors) {
          if (errors[e].property === input.name) {
            input.error = errors[e];
          }
        }
        if(typeof data[input.name] !== 'undefined') {
          input.value = data[input.name];
        } else {
          input.value = input.default || '';
        }
        options.control = input;
        self.parent.inputs.index.present(options, function(err, str){
          cont(err, str);
        });
      };

      var arr = Object.keys(_props);
      arr.reverse();
      cont();

    } else {
      callback(null, $.html());
    }
  }

}
