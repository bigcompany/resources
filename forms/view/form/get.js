var layout = require('./layout');

module['exports'] = function(options, callback) {

  var resource = options.resource;

  if(typeof resource === "undefined") {
    return callback(new Error('No resource specified'));
  }

 var $ = this.$,
     self = this,
     output = '',
     entity = resource.name || 'unknown',
     _props = resource.methods.get.schema.properties;

  if(typeof options.id !== 'undefined') {
    $('form').remove();
    resource.get(options.id, function(err, result){
      if (err) {
        $('table').remove();
        $('form').remove();
        $('.message').html('could not find ' + options.id);
        return callback(err, $.html());
      }
      //
      // Interate through all non-private schema properties,
      // and create table rows with the values of the record
      //
      Object.keys(resource.schema.properties).forEach(function(property) {
        if (!resource.schema.properties[property].private) {
          var value = result[property];

          if (resource.schema.properties[property].type === "object") {
            value = JSON.stringify(value);
          }
          
          //value = value.toString();

          // Bad string concat man!
          output += ('<tr>'
                 +     '<td>' + property + '</td>'
                 +     '<td>' + (value) + '</td>'
                 +   '</tr>');
       }
      });

      //
      // Check to see if there are any remote methods to show
      //
      for(var m in resource.methods) {
        if(["all", "find", "create", "get"].indexOf(m) === -1) {
          output += ('<tr>'
                 +     '<td colspan = "2"><a href="../' + m + '/' + options.id  + '">' + m + '</a></td>'
                 +   '</tr>');
        }
      }

      $('h1').html(entity);
      //$('.back').html('back to ' + entity);
      //$('.back').attr('href', '/' + entity);
      $('.records').html(output);
      $('.create').html('Create new ' + entity);

      $('.edit').attr('href', '../update/' + options.id);
      $('.destroy').attr('href', '../destroy/' + options.id);

      callback(null, $.html())
    });
  } else {
    $('table').remove();
    var input = _props['id'];
    input.name = 'id';
    input.value = input.default || '';
    if (input.writeable !== false) {
      output += layout.renderControl(input, options);
    }

    $('h1').html(entity + ' - create');
    //$('.back').html('back to ' + entity);
    //$('.back').attr('href', '/' + entity);

    $('legend').html(entity + ' form');
    //$('form').attr('action', '/' + entity + '/new');
    $('.inputs').html(output);
    $('input[type="submit"]').attr('value', 'Get ' + entity);

    output = $.html();

    if (callback) {
      return callback(null, output);
    }
    return output;
    
  }

 
 
 
}
