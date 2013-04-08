module['exports'] = function (options, callback) {

  var routes = options.routes,
      title = options.title,
      $ = this.$;

  $('h1').text(title);

  routes.forEach(function (route) {
    $('ul').html('<a href="' + route.url + '">' + route.name + '</a>');
  });

  callback(null, $.html());
}
