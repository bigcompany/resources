
var resource = require('resource');

module['exports'] = function(options, callback) {

  var r = resource.resources[options.resource];

  if(typeof r === "undefined") {
    return callback(new Error('No resource specified'));
  }

 var $ = this.$,
     self = this,
     output = '',
     entity = options.resource || 'unknown',
     _props = r.methods.get.schema.properties;

  if(typeof options.id !== 'undefined') {
    $('form').remove();
    r.get(options.id, function(err, record){
      if (err) {
        $('table').remove();
        $('form').remove();
        $('h2').html('could not find ' + options.id);
        return callback(err, $.html());
      }
      $('.message').remove();
      function cont (err, result) {
        if(result) {
          output += result;
        }
        if(arr.length === 0) {
          output += ('<tr>'
                 +     '<td colspan="2"><h4>methods</h4></td>'
                 +   '</tr>');
          var _methods = Object.keys(r.methods);
          _methods.sort();
          _methods.forEach(function(m){
            var desc = r.methods[m].schema.description || '&nbsp;',
                leading;

            if (options.unscoped) {
              leading = '../';
            }
            else {
              leading = '../../';
            }

            output += ('<tr>'
                   +     '<td><a href="' + leading + r.name + '/' + m + '/' + options.id  + '">' + m + '</a></td><td>' + desc + '</td>'
                   +   '</tr>');
          });
          $('.records').html(output);
          return callback(null, $.html());
        }
        var property = arr.pop();
        var value = record[property];
        var prop = r.schema.properties[property];

        if (prop.type === "object") {
          value = JSON.stringify(value);
        }

        if (prop.format === "url") {
          value = '<a href="' + value + '">' + value + '</a>';
        }

        if (prop.format === "video") {
          var embed = value.replace('watch?v=', 'embed/');
          value = value + '<iframe width="560" height="315" src="' + embed + '" frameborder="0" allowfullscreen></iframe>';
        }

        if (prop.format === "password") {
          value = '********';
        }

        //
        // Render null values as an empty space
        //
        if(value === null) {
          value = "&nbsp;";
        }

        if (typeof prop.key !== 'undefined') {
          resource[prop.key].get(record[property], function (err, results){
            if (err) {
              return cont(err);
            }
            var tr = '<tr>';
            tr += ('<td>' + property + '</td><td>');
            //
            // for tag.getTag
            // TODO: move this block
            /*
              results.forEach(function(result, i){
                tr += ('<a href="/admin/resources/' + prop.key + '/get/' + result.id + '">' + result.name + '</a>');
                if(i < results.length - 1) {
                  tr += ' > ';
                }
              });*/
            //
            // for tag.getTag
            //
            tr += results.id;
            tr += '</td></tr>';
            cont(err, tr);
          });
        } else {
          var tr = ('<tr>'
                 +     '<td>' + property + '</td>'
                 +     '<td>' + (value) + '</td>'
                 +   '</tr>');
          cont(null, tr);
        }
      }
      var arr = Object.keys(r.schema.properties);
      output += ('<tr>'
             +     '<td colspan="2"><h4>properties</h4></td>'
             +   '</tr>');
      arr.reverse();
      cont();

      /*
      $('h1').html(entity);
      //$('.back').html('back to ' + entity);
      //$('.back').attr('href', '/' + entity);
      $('.create').html('Create new ' + entity);
      $('.edit').attr('href', '../update/' + options.id);
      $('.destroy').attr('href', '../destroy/' + options.id);
      */

    });
  } else {
    $('table').remove();
    var input = _props['id'];
    input.name = 'id';
    input.value = input.default || '';

    $('h1').html(entity + ' - create');
    $('legend').html(entity + ' form');
    $('input[type="submit"]').attr('value', 'Get ' + entity);

    if (input.writeable !== false) {
      options.control = input;
      self.parent.inputs.index.present(options, function(err, result){
        $('.inputs').html(result);
        callback(null, $.html());
      });
    }
  }
 
}
