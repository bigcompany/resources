var resource = require('resource'),
    virtualhost = resource.define('virtualhost');

virtualhost.schema.description = "provides virtual hosts";

virtualhost.property('host');
virtualhost.property('path');

virtualhost.persist('memory');

virtualhost.middle = function(req, res, next) {
  var connect = require('connect'),
      path = require('path'),
      host = req.headers.host.split(':');
  host = host[0];
  resource.virtualhost.find({ host: host }, function (err, results) {
    if (err || results.length === 0) {
      if (process.env.NODE_ENV === 'production') {
        resource.logger.warn('unknown host: ' + host);
        next();
      } else {
        resource.virtualhost.all(function (err, hosts) {
          resource.logger.warn('unknown host: ' + host);
          resource.logger.warn('available hosts are ' + JSON.stringify(hosts, true, 2));
          next();
        });
      }
    } else {
      connect.static(path.resolve(process.cwd() + results[0].path))(req, res, next);
    }
  });
};

exports.virtualhost = virtualhost;

exports.dependencies = {
  "connect": "2.7.1",
};
