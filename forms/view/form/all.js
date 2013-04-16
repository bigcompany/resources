var resource = require('resource');

module['exports'] = function(options, callback) {

  var r = resource.resources[options.resource],
      data     = options.data;

  if(typeof r === "undefined") {
    return callback(new Error('No resource specified'));
  }
  var $             = this.$,
      output        = '',
      entity        = options.resource;

  r.all(function(err, data){

    if (err) {
      $('table').remove();
      $('.message').html(JSON.stringify(err, true, 2));
      $('.message').addClass('error');
      return callback(null, $.html());
    }

    if(data.length > 0) {
      $('.message').remove();

      data.forEach(function(record){

        var label = record.title || record.name || record.id;

        var leading;
        if (options.id) {
          leading = '../';
        }
        else {
          leading = './';
        }

        output += ('<tr>'
               +     '<td><a href="' + leading + 'get/' + record.id +'">' + label + '</a></td>'
               +     '<td><a href="' + leading + 'update/'  + record.id + '">' + 'update' + '</a></td>'
               +     '<td><a href="' + leading + 'destroy/'  + record.id + '">' + 'destroy' + '</a></td>'
               +   '</tr>');
      });
      $('h1').html(entity);
      $('.records').html(output);
      $('.schema').html(JSON.stringify(r.schema.properties, true, 2));
      $('.create').html('Create new ' + entity);
      $('.create').attr('href', '/' + entity + '/new');

      if(data.length === 0) {
        $('table').remove();
      }
    } else {
      $('table').remove();
      $('.message').html('no records found');
    }

    output = $.html();
    return callback(null, output);

  });

}
