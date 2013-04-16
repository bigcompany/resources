/*
 * socketful.js: creates socket.io event maps to resourceful
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */

var socketful = exports,
    resourceful = require('resourceful'),
    util     = require('util'),
    http     = require('http');

exports.engines = {
  "socket.io": require('../lib/engines/socketio')
};

//
// ### function createServer (resources)
// #### @resources {resourceful.Resource} Resource(s) to use for the server.
//
// Responds with an `http.Server` instance with a `socketfulRouter` for the
// specified `resources`.
//
exports.createServer = function (resources, options, callback) {

  options = options || {};
  options.engine = options.engine || 'socket.io';
  return socketful.engines[options.engine].createServer(resources, options, callback);
};
