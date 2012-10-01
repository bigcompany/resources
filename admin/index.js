var resource  = require('resource'),
    admin = resource.define('admin');

admin.schema.description = "web based admin panel for big";

resource.use('system');
resource.use('view');
resource.use('datasource');

admin.method('start', start);

function start (options, callback) {
  var connect = require('connect');
  var auth = connect.basicAuth('admin', 'admin');

  resource.http.app.use(connect.static(__dirname + '/public'));

  var view = resource.view.create({ path: __dirname + '/view'});
  view.load();

  resource.http.app.get('/admin', auth, function (req, res, next) {
    var _r = _resources();
    view.index.render({
      system: JSON.stringify(dashboard(), true, 2)
    });
    str = view.index.present({ resources: resource.resources });
    res.end(str);
  });

  resource.http.app.get('/admin/resources', auth, function (req, res, next) {
    var str = view.resources.render();
    str = view.resources.present({ resources: resource.resources });
    res.end(str);
  });

  resource.http.app.get('/admin/ssh', auth, function (req, res, next) {
   view.ssh.render({});
   str = view.ssh.present({});
   res.end(str);
  });

  resource.http.app.get('/admin/docs', auth, function (req, res, next) {
   view.docs.render({});
   str = view.docs.present({});
   res.end(str);
  });

  resource.http.app.get('/admin/replicator', auth, function (req, res, next) {
   view.replicator.render({});
   str = view.replicator.present({});
   res.end(str);
  });

  resource.http.app.get('/admin/datasources', auth, function (req, res, next) {
   view.datasources.render({});
   resource.datasource.all(function(err, results){
     str = view.datasources.present({ datasources: results });
     res.end(str);
   });
  });

  resource.http.app.get('/admin/datasources/:datasource', auth, function (req, res, next) {
   resource.datasource.get(req.param('datasource'), function(err, result){
     console.log(err, result)
     view.datasource.render({});
     str = view.datasource.present({ datasource: result });
     res.end(str);
   });
  });

  resource.http.app.get('/admin/docs/resources/:resource', function (req, res, next) {
    var r = resource.resources[req.param('resource')];
    var str = resource.docs.generate(r);
    var view = resource.view.create({
      template: str,
      input: "markdown"
    });
    console.log(view.template);
    str = '<link href="/style.css" rel="stylesheet"/> \n' + view.render();
    res.end(str);
  });


  resource.http.app.get('/admin/resources/:resource', auth, function (req, res, next) {
    var r = resource.resources[req.param('resource')];
    var obj = resource.toJSON(r);
    var str = view.resource.render({
      name: r.name,
      schema: JSON.stringify(r.schema, true, 2),
      methods: JSON.stringify(_methods(r), true, 2)
    });
    str = view.resource.present({ methods: r.methods, resource: r });
    res.end(str);
  });

  resource.http.app.get('/admin/resources/:resource/:method', auth, function (req, res, next) {
    var _resource = resource.resources[req.param('resource')];
    var _method = _resource[req.param('method')];
    var str = view.method.render({
      label: req.param('resource') + ' - ' + req.param('method'),
      method: _method.unwrapped.toString(),
      schema: JSON.stringify(_method.schema, true, 2)
    });
    str = view.method.present({ resource: _resource, methods: _resource.methods, method: _method, name: req.param('method') });
    res.end(str);
  });

}

exports.admin = admin;

exports.dependencies = {
  "connect": "*"
};

//
// TODO: move this out of here to resource.toJSON
//
  function _resources () {
    var arr = [];
    Object.keys(resource.resources).forEach(function(r){
      arr.push(r);
    });
    return arr;
  }
  function _methods (resource) {
    var arr = [];
    Object.keys(resource.methods).forEach(function(m){
      arr.push(m);
    });
    return arr;
  }
//
//
//


// generates JSON-data to be sent to dashboard view
function dashboard () {

  var os  = require('os'),
      obj = {};

  obj.name     = "big";
  obj.version  = "v0.0.0";

  obj.system = resource.system.info();

  obj.resources = [];

  for(var r in resource.resources) {
    obj.resources.push(r);
  }

  return obj;

};