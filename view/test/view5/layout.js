module['exports'] = function (options, callback) {

  var $ = this.$;

  $('.layout-name').html(this.name);
  $('.layout-template').html(escape(this.template));
  $('.layout-presenter').html(escape(this.presenter));
  $('.layout-parent').html(this.parent.name);

  callback(null, $.html());
};