//
// string.js - input fields for String types
//

module['exports'] = function (input, options, callback) {
  //
  // Todo: This load statement should be moved to Viewful
  //
  var $ = this.$.load(this.template);
  if(options.error) {
    options.error.validate.errors.forEach(function(error){
      if(input.name === error.property){
        $('.control-group').addClass('error');
        $('.help-inline').html(error.message);
      }
    });
    for(var v in options.error.value) {
      if(input.name === v){
        input.value = options.error.value[v];
      }
    }
  }

  $('.control-label').attr('for', input.name);
  $('.control-label').html(input.name);
  $('input').attr('id',  input.name);
  $('input').attr('name', input.name);

  if(input.value.toString() ===  "true") {
    $('input').attr('checked', 'CHECKED');
    //selected = ' SELECTED="SELECTED"'; // Bad string concat man!
  }


  return $.html();
};
