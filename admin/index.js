var resource  = require('resource'),
    admin = resource.define('admin');

admin.schema.description = "a web based admin panel";

//
// The admin requires a view engine
//
resource.use('view');

//
// The html resource provides simple HTML templating
//
resource.use('html');

//
// The system resource helps gather information about the system
//
resource.use('system');

//
// The datasource resource is used to store datasource persistence connections
//
resource.use('datasource', { datasource: "fs" });

//
// replication and node resources are used to store information about replicator and mesh history.
// Although the replicator and mesh resource aren't automatically installed with the admin,
// they easily can be added
//
resource.use('replication', { datasource: "fs"});
resource.use('node', { datasource: "fs"});

//
// The hook resource is used for easily hooking together resource events
//
resource.use('hook', { datasource: "fs"});

//
// HTML Form generator for admin forms
//
resource.use('forms');

//
// The standard http resource for creating http servers
//
resource.use('http');

admin.method('listen', listen, {
  "description": "start a listening admin web server",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "port": resource.http.schema.properties['port'],
        "host": resource.http.schema.properties['host']
      }
    },
    "callback": {
      "type": "function"
    }
  }
});

admin.method('start', listen, admin.listen.schema);

function listen (options, callback) {
  var connect = require('connect');
  var auth = connect.basicAuth('admin', 'admin');

  if(!resource.http.app) {
    resource.http.listen(options, next);
  }
  else {
    next();
  }

  function next(err) {

    if (err) {
      callback(err);
      return;
    }

    //
    // Create view middleware using /admin/view
    //
    resource.view.create({ path: __dirname + '/view' }, function(err, view) {
      if (err) {
        callback(err);
        return;
      }

      resource.http.app.use(resource.view.middle({ view: view, prefix: '/admin' }));

      //
      // Serve the /public/ admin folder
      //
      resource.http.app.use(connect.static(__dirname + '/public'));

      //
      // TODO: cleanup route handlers / make into common methods
      //

      resource.http.app.get('/admin', auth, function (req, res, next) {
        var _r = _resources();
        view.index.present({ resources: resource.resources }, function(err, str){
          res.end(str);
        });
      });

      resource.http.app.get('/admin/datasources/:datasource', auth, function (req, res, next) {
       resource.datasource.get(req.param('datasource'), function(err, result){
         view.datasource.present({ datasource: result }, function (err, str){
           res.end(str);
         });
       });
      });

      resource.http.app.get('/admin/resources/:resource', auth, function (req, res, next) {
        view.resource.present({
          resource: req.param('resource')
        }, function(err, str){
          res.end(str);
        });
      });

      resource.http.app.get('/admin/resources/:_resource/:_method', auth, function (req, res, next) {
        view.method.present({ resource: req.param('_resource'), method: req.param('_method') }, function(err, str){
          res.end(str);
        });
      });

      resource.http.app.post('/admin/resources/:_resource/:_method', auth, function (req, res, next) {

        var id = req.param('id'),
            data = req.resource.params;

        delete data._resource;
        delete data._method;

        view.method.present({
          resource: req.param('_resource'),
          method: req.param('_method'),
          data: data,
          action: 'post',
          id: id
        }, function(err, str){
          res.end(str);
        });


      });

      resource.http.app.get('/admin/resources/:_resource/:_method/:id', auth, function (req, res, next) {
        var _id = req.param('id');
        view.method.present({
          resource: req.param('_resource'),
          method: req.param('_method'),
          id: _id
        }, function(err, str){
          res.end(str);
        });
      });

      resource.http.app.post('/admin/resources/:_resource/:_method/:id', auth, function (req, res, next) {

        var data = req.resource.params;

        view.method.present({
          resource: req.param('_resource'),
          method: req.param('_method'),
          id: req.param('id'),
          data: data,
          request: req,
          response: res,
          action: 'post'
        }, function(err, str){
          res.end(str);
        });

      });

      callback(null, resource.http.server);

    });

  }
}

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

  obj.version  = "v0.0.0";

  obj.system = resource.system.info();

  obj.resources = [];

  for(var r in resource.resources) {
    obj.resources.push(r);
  }

  return obj;

};

admin.dependencies = {
  "connect": "2.7.1",
  "highlight": "0.2.3"
};

exports.admin = admin;