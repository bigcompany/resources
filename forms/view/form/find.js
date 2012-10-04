var layout = require('./layout');

module['exports'] = function(options, callback) {

  var resource = options.resource;

  if(typeof resource === "undefined") {
    return callback(new Error('No resource specified'));
  }

 var $ = this.$,
     self = this,
     output = '',
     entity = resource.name || 'unknown';

  if (options.data) {

    //
    // Remove all blank values
    //
    var query = {};
    Object.keys(options.data).forEach(function(prop){
      if(options.data[prop].length > 0) {
        query[prop] = options.data[prop];
      }
    });

    resource.find(options.data, function(err, results){
      if(results.length > 0) {
        $('.message').remove();
        $('form').remove();
        $('table th').html(entity);
        results.forEach(function(record){
          output += ('<tr>'
                 +     '<td><a href="./get/' + record.id +'">' + record.id + '</a></td>'
                 +     '<td><a href="./update/'  + record.id + '">' + 'Edit' + '</a></td>'
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
    var _props = resource.methods.find.schema.properties.options.properties;

    Object.keys(_props).forEach(function (property) {
      var input = _props[property];
      input.name = property;
      input.value = '';
      if (input.writeable !== false) {
        output += layout.renderControl(input, options);
      }
    });

    $('.back').html('back to ' + entity);
    $('.back').attr('href', '/' + entity);

    $('.inputs').html(output);

    output = $.html();
    return callback(null, output);

  }

}
