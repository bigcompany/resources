module['exports'] = function(options, callback) {

  var resource = options.resource,
      data     = options.data;
      

  if(typeof resource === "undefined") {
    return callback(new Error('No resource specified'));
  }
  var $             = this.$,
      output        = '',
      entity        = resource.lowerResource;
  
  resource.all(function(err, data){

    if(data.length > 0) {
      $('.message').remove();
      $('table th').html(entity);

      data.forEach(function(record){
        output += ('<tr>'
               +     '<td><a href="./get/' + record.id +'">' + record.id + '</a></td>'
               +     '<td><a href="./update/'  + record.id + '">' + 'Edit' + '</a></td>'
               +     '<td><a href="./destroy/'  + record.id + '">' + 'Destroy' + '</a></td>'
               +   '</tr>');
      });
      $('h1').html(entity);
      $('.records').html(output);
      $('.schema').html(JSON.stringify(resource.schema.properties, true, 2));
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

    if (callback) {
      return callback(null, output);
    }
    return output;    
    
  });


}
