var resource = require('resource'),
    virtualhost = resource.define('virtualhost');

virtualhost.schema.description = "provides virtual hosts";

virtualhost.property('host');
virtualhost.property('path');

virtualhost.middle = function(req, res, next) {
  var connect = require('connect'),
      path = require('path'),
      host = req.headers.host.split(':');
  host = host[0];
  resource.virtualhost.find({ host: host }, function (err, results) {
    if (err || results.length === 0) {
      resource.virtualhost.all(function (err, hosts) {
        return res.end('unknown host: ' + host + ' \n' + 'available hosts are ' + JSON.stringify(hosts, true, 2));
      });
    } else {
      connect.static(path.resolve(process.cwd() + results[0].path))(req, res, next);
    }
  });
};

exports.virtualhost = virtualhost;

exports.dependencies = {
  "connect": "2.7.1",
};
