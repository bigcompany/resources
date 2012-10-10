var layout = require('./layout'),
    resource = require('resource');

module['exports'] = function (options, callback) {

  options = options || {};
  var r = resource.resources[options.resource];

 var $ = this.$,
     self = this,
     output = '',
     entity = resource.name || 'unknown';

  if (options.data) {
    r.create(options.data, function(err, result){
      if (err) {
        $('.message').html(err.message);
        output = $.html();
        return callback(null, output);
      } else {
        $('.message').html('Created!');
        $('form').remove();
        self.parent.get.present({ resource: options.resource, id: result.id }, function(err, re){
          console.log(err, re)
          return callback(null, re);
        });
      }
    });
  } else {

    $('h1').html(entity + ' - create');
    $('.back').html('back to ' + entity);
    $('.back').attr('href', '/' + entity);

    $('legend').html(r.methods.create.schema.description);
    $('input[type="submit"]').attr('value', 'Create new ' + entity);
    
    cont = function(err, result) {
      if (result) {
        output += result;
      }
      if(arr.length === 0) {
        $('.inputs').html(output);
        return callback(null, $.html())
      }
      var property = arr.pop();
      var input = r.schema.properties[property];
      input.name = property;
      input.value = input.default || '';
      layout.renderControl(input, options, cont);
    };
    var arr = Object.keys(r.schema.properties);
    arr.reverse();
    cont();

  }

}