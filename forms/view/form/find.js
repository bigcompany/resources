var resource = require('resource');


module['exports'] = function(options, callback) {

  var r = resource.resources[options.resource];

  if(typeof r === "undefined") {
    return callback(new Error('No resource specified'));
  }

 var $ = this.$,
     self = this,
     output = '',
     entity = options.resource || 'unknown';

  if (options.data) {
    //
    // Remove all blank values
    //
    var query = {};
    Object.keys(options.data).forEach(function(prop){
      if(typeof options.data[prop] !== 'undefined' && options.data[prop].length > 0) {
        query[prop] = options.data[prop];
      }
    });

    r.find(query, function(err, results){
      if(results.length > 0) {
        $('.message').remove();
        $('form').remove();
        $('table th').html(entity);
        results.forEach(function(record){
          output += ('<tr>'
                 +     '<td><a href="./get/' + record.id +'">' + record.id + '</a></td>'
                 +     '<td><a href="./update/'  + record.id + '">' + 'Update' + '</a></td>'
                 +     '<td><a href="./destroy/'  + record.id + '">' + 'Destroy' + '</a></td>'
                 +   '</tr>');
        });
        $('.records').html(output);
      } else {
        $('table').remove();
        $('.message').html('no records found');
      }
      output = $.html();
      return callback(null, output);
    });
  } else {
    $('table').remove();
    var _props = r.methods.find.schema.properties.options.properties;


    $('.back').html('back to ' + entity);
    $('.back').attr('href', '/' + entity);

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
      input.value = '';
      options.control = input;
      self.parent.inputs.index.present(options, cont);

    };
    var arr = Object.keys(_props);
    arr.reverse();
    cont();

  }

}
