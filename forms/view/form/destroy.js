var resource = require('resource');

module['exports'] = function (options, callback) {

  var r = resource.resources[options.resource],
       $ = this.$,
       output = '',
       record = options.data;

    //
    // Todo: perform check if record exists
    //
    if(options.action === "post") {
      r.destroy(options.id, function(err, result){
        $('.message').html('Destroyed!');
        $('form').remove();
        output = $.html();
        return callback(null, output);
      });
    } else {
      if (typeof record === "object") {
        Object.keys(record).forEach(function(key){
          var html = "<label for='" + key + "'>" + key + "</label><input name ='" + key + "' value='" + record[key] + "'/><br/>";
          output += html;
        });
      } else if (typeof options.id !== 'undefined') {
        $('.confirm').html('Destroy ' + options.id + '?');
      }
      //$('h1').html('Could not find ' + record);
      output = $.html();
      return callback(null, output);
    }

}
