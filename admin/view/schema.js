var layout = require('./layout');

module['exports'] = function (options) {

  options = options || {};

  var $ = this.$.load(this.template),
      schema = options.schema || {};

  //$('.description').html(schema.description);

  function render (props, level) {
    var str = '';
    if(typeof props !== "object") {
      return props;
    }
    level++;
    if(level === 5) {
      level = 4;
    }
    str += '<table class="table table-bordered" border="1">';
    Object.keys(props).forEach(function(prop){
      if(typeof props[prop] === "object") {
        str += ('<tr><td colspan="2"><h' + level.toString() +'>' + prop + '</h' + level.toString() + '>' + render(props[prop], level) + '</td></tr>');
      } else {
        var val = props[prop];
        if(typeof props[prop] === 'undefined' || props[prop].length === 0 || props[prop] === null) {
          val = "&nbsp;";
        }
        str += ('<tr><td style="width:25%">' + prop + '</td><td style="width:75%">' + val + '</td></tr>');
      }
    });
    str += "</table>"
    return str;
  }

  if(typeof schema.properties === 'object') {
    $('.props').append(render(schema.properties, 1));
  }

  return $.html();

}