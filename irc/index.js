var resource = require('resource'),
    irc = resource.define('irc');

var util = require('util'),
    Client = require('irc').Client;

irc.schema.description = 'for managing communication with irc';

irc.property('server', {
  description: 'an irc server',
  properties: {
    host: {
      description: 'the hostname of the irc server',
      type: 'string',
      default: 'irc.freenode.net'
    },
    port: {
      description: 'the port of the irc server',
      type: 'number',
      default: 6667
    }
  }
});

irc.property('message', {
  description: 'an irc message',
  properties: {
    options: {
      type: 'object',
      properties: {
        host: irc.schema.properties.server.properties.host,
        port: irc.schema.properties.server.properties.port,
        channel: irc.schema.properties.channel,
        channels: irc.schema.properties.channels,
        nick: irc.schema.properties.nick,
        message: {
          type: 'string',
          default: '...'
        }
      }
    }
  }
});

irc.property('command', {
  description: 'an irc command',
  properties: {
    options: {
      type: 'object',
      properties: {
        host: irc.schema.properties.server.properties.host,
        port: irc.schema.properties.server.properties.port,
        command: { type: 'string' }
      }
    }
  }
});

irc.property('nick', {
  default: 'biggie'
});
irc.property('channel', {
  default: '#big'
});
irc.property('channels', {
  type: 'array'
});

//
// A lookup table of irc connections
//
irc.connections = {};

irc.method('connect', connect, {
  description: 'connects to an irc server',
  properties: {
    options: {
      type: 'object',
      properties: {
        host: irc.schema.properties.server.properties.host,
        port: irc.schema.properties.server.properties.port,
        nick: irc.schema.properties.nick,
        channel: irc.schema.properties.channel,
        channels: irc.schema.properties.channels
      }
    }
  }
});
function connect (options, callback) {
  var tuple = [options.host, options.port].join(':'),
      client;

  //options.channels = options.channels || options.channel.split(' ');
  console.log('fff- ', options);
  client = irc.connections[tuple] = new Client(
    options.host,
    options.nick
  );

  client.on('message', function (from, to, message) {
    // XXX we need to emit some sort of message event/method here.
    // problem: the "message" method is being used
    console.log('message: ', { from : from, to: to, message: message });
  });

  client.conn.on('error', function connError (err) {
    console.log('a connection error has occured');
    console.log(err.stack);
  });

  client.on('error', function onError (err) {
    console.log('a client error has occured');
  });

  client.on('connect', function () {
    // console.log('connected');
  });

  //
  // Listening for the "message of the day", despite seeming unsatisfactory,
  // is considered the "best way" to detect when client/server handshaking
  // is complete.
  client.once('motd', function (motd) {
    // TODO: freenode-style "id check" (see L45, hook.io-irc/lib/irc.js)
    callback(null, options);
  });
}

irc.method('disconnect', disconnect, {
  description: 'disconnects from an irc server',
  properties: {
    options: {
      type: 'object',
      properties: {
        host: irc.schema.properties.server.properties.host,
        port: irc.schema.properties.server.properties.port,
        message: {
          type: 'string',
          default: 'big irc is disconnected (http://big.vc)'
        }
      }
    }
  }
});
function disconnect (options, callback) {
  var tuple = [options.host, options.port].join(':');

  irc.connections[tuple].disconnect(options.message, function (err) {
    if (err) {
      return callback(err);
    }
    delete irc.connections[tuple];
    callback(null, true);
  });
}

irc.method('message', message, {
  description: 'sends an irc message',
  properties: irc.schema.properties.message.properties
});
function message (options, callback) {
  var tuple = [options.host, options.port].join(':');

  irc.connections[tuple].say(
    options.channels || [options.channel],
    options.message
  );
  callback(null, true);
}

irc.method('command', command, {
  description: 'sends an irc command',
  properties: irc.schema.properties.command.properties
});
function command (options, callback) {
  var tuple = [options.host, options.port].join(':');

  irc.connections[tuple].send(options.command);  
  callback(null, true);
}

irc.method('join', join, {
  description: 'joins an irc channel',
  properties: {
    options: {
      type: 'object',
      properties: {
        host: irc.schema.properties.server.properties.host,
        port: irc.schema.properties.server.properties.port,
        channel: irc.schema.properties.channel
      }
    }
  }
});
function join (options) {
  console.log(arguments);
  var tuple = [options.host, options.port].join(':');
  console.log('joining...');
  irc.connections[tuple].join(options.channel);
}

irc.method('part', part, {
  description: 'leaves an irc channel',
  properties: {
    options: {
      type: 'object',
      properties: {
        host: irc.schema.properties.server.properties.host,
        port: irc.schema.properties.server.properties.port,
        channel: irc.schema.properties.channel
      }
    }
  }
});
function part (options, callback) {
  var tuple = [options.host, options.port].join(':');

  irc.connections[tuple].part(options.channel, function (err) {
    // TODO: If we keep an internal representation of channels, this
    // is where we would delete them.
    callback(err, !err);
  });
}

irc.method('voice', voice, {
  description: 'gives voice to an irc user',
  properties: {
    options: {
      properties: {
        host: irc.schema.properties.server.properties.host,
        port: irc.schema.properties.server.properties.port,
        channel: irc.schema.properties.channel,
        channels: irc.schema.properties.channels,
        nick: (function () {
          var nick = irc.schema.properties.nick;
          nick.required = true;
          return nick;
        })()
      }
    }
  }
});
function voice (options, callback) {
  // TODO: Do we need to make a clone of the options object?
  options.command = util.format('mode %s +v %s', options.channel, options.nick);
  irc.command(options, callback);
}

irc.method('devoice', devoice, {
  description: 'removes voice from an irc user',
  properties: {
    options: {
      properties: {
        host: irc.schema.properties.server.properties.host,
        port: irc.schema.properties.server.properties.port,
        channel: irc.schema.properties.channel,
        channels: irc.schema.properties.channels,
        nick: (function () {
          var nick = irc.schema.properties.nick;
          nick.required = true;
          return nick;
        })()
      }
    }
  }
});
function devoice (options, callback) {
  options.command = util.format('mode %s -v %s', options.channel, options.nick);
  irc.command(options, callback);
}

irc.method('op', op, {
  description: 'gives ops to an irc user',
  properties: {
    options: {
      properties: {
        host: irc.schema.properties.server.properties.host,
        port: irc.schema.properties.server.properties.port,
        channel: irc.schema.properties.channel,
        channels: irc.schema.properties.channels,
        nick: (function () {
          var nick = irc.schema.properties.nick;
          nick.required = true;
          return nick;
        })()
      }
    }
  }
});
function op (options, callback) {
  options.command = util.format('mode %s +o %s', options.channel, options.nick);
  irc.command(options, callback);
}

irc.method('deop', deop, {
  description: 'removes ops from an irc user',
  properties: {
    options: {
      properties: {
        host: irc.schema.properties.server.properties.host,
        port: irc.schema.properties.server.properties.port,
        channel: irc.schema.properties.channel,
        channels: irc.schema.properties.channels,
        nick: (function () {
          var nick = irc.schema.properties.nick;
          nick.required = true;
          return nick;
        })()
      }
    }
  }
});
function deop (options, callback) {
  options.command = util.format('mode %s -o %s', options.channel, options.nick);
  irc.command(options, callback);
}

irc.method('kick', kick, {
  description: 'kicks a user from an irc channel',
  properties: {
    options: {
      properties: {
        host: irc.schema.properties.server.properties.host,
        port: irc.schema.properties.server.properties.port,
        channel: irc.schema.properties.channel,
        channels: irc.schema.properties.channels,
        nick: (function () {
          var nick = irc.schema.properties.nick;
          nick.required = true;
          return nick;
        })()
      }
    }
  }
});
function kick (options, callback) {
  options.command = util.format('kick %s %s', options.channel, options.nick);
  irc.command(options, callback);
}

irc.method('ban', ban, {
  description: 'bans a user from an irc channel',
  properties: {
    options: {
      properties: {
        host: irc.schema.properties.server.properties.host,
        port: irc.schema.properties.server.properties.port,
        channel: irc.schema.properties.channel,
        channels: irc.schema.properties.channels,
        nick: (function () {
          var nick = irc.schema.properties.nick;
          nick.required = true;
          return nick;
        })()
      }
    }
  }
});
function ban (options, callback) {
  options.command = util.format('mode %s +b %s', options.channel, options.nick);
  irc.command(options, function (err, ok) {
    // Technically this is a "kickban", but it's pretty uncommon to ban
    // someone without kicking them as well.
    if (err) {
      return callback(err, ok);
    }
    irc.kick(options, callback);
  });
}

irc.method('unban', unban, {
  description: 'unbans a user from an irc channel',
  properties: {
    options: {
      properties: {
        host: irc.schema.properties.server.properties.host,
        port: irc.schema.properties.server.properties.port,
        channel: irc.schema.properties.channel,
        channels: irc.schema.properties.channels,
        nick: (function () {
          var nick = irc.schema.properties.nick;
          nick.required = true;
          return nick;
        })()
      }
    }
  }
});
function unban (options, callback) {
  options.command = util.format('mode %s -b %s', options.channel, options.nick);
  irc.command(options, callback);
}

exports.irc = irc;
exports.dependencies = {
  "irc": "*"
};
