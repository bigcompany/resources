//
// boolean.js - input fields for boolean types
//

module['exports'] = function (options, callback) {
  //
  // Todo: This load statement should be moved to Viewful
  //
  var input = options.control;
  var $ = this.$.load(this.template);
  if(typeof input.error !== 'undefined') {
    $('.control-group').addClass('error');
    $('.help-inline').html(input.error.message);
  }
  var label = $('.control-label');
  label.attr('for', input.name);
  label.html(input.name);

  var hidden = $('input[type=hidden]');
  hidden.attr('id', input.name);
  hidden.attr('name', input.name);

  var checkbox = $('input[type=checkbox]');
  checkbox.attr('onclick', 
      'document.getElementById("' + input.name + '").value = this.checked');

  $('input').attr('value', input.value.toString());

  if(input.value.toString() === "true") {
    checkbox.attr('checked', 'CHECKED');
    //selected = ' SELECTED="SELECTED"'; // Bad string concat man!
  }
  else {
    checkbox.removeAttr('checked');
  }

  return callback(null, $.html());
};
