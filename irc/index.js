var resource = require('resource'),
    irc = resource.define('irc');

var util = require('util');

irc.schema.description = 'for managing communication with irc';

irc.TRIGGER = "!"

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

irc.property('nick', {
  default: 'biggie'
});
irc.property('channel', {
  default: '#big'
});
irc.property('channels', {
  type: 'array'
});

irc.property('message', {
  description: 'an irc message',
  properties: {
    options: {
      type: 'object',
      properties: {
        host: irc.schema.properties.server.properties.host,
        port: irc.schema.properties.server.properties.port,
        to: {
          type: "string",
          default: "#big"
        },
        message: {
          type: 'string',
          default: 'big'
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

irc.method('wrapColors', wrapColors, {
  description: 'wraps text in an irc color code',
  properties: {
    color: {
      enum: [
        'white',
        'black',
        'dark_blue',
        'dark_green',
        'light_red',
        'dark_red',
        'magenta',
        'orange',
        'yellow',
        'light_green',
        'cyan',
        'light_cyan',
        'light_blue',
        'light_magenta',
        'gray',
        'light_gray',
        'reset'
      ]
    },
    message: { type: 'string' }
  }
});
function wrapColors(color, message) {
  return require('irc').colors.wrap(color, message);
}

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
    },
    callback: {
      type: 'function'
    }
  }
});

function connect (options, callback) {

  var tuple = [options.host, options.port].join(':'),
      Client = require('irc').Client, // irc Client class
      client; // irc client instance

  irc.connections[tuple] = { channels: {} };
  client = irc.connections[tuple].client = new Client(
    options.host,
    options.nick,
    {
      floodProtection: true,
      floodProtectionDelay: 300
    }
  );

  client.on('message', _message);

  client.on('netError', function (err) {
    resource.emit('irc::netError', err);
  });

  client.on('error', function onError (err) {
    // TODO: the irc resource itself should be an event emitter namespaced to irc
    // Ex: irc.emit('error', err);
    resource.emit('irc::error', err);
  });

  //
  // Listening for the "message of the day", despite seeming unsatisfactory,
  // is considered the "best way" to detect when client/server handshaking
  // is complete.
  client.on('motd', function (motd) {
    //
    // Pass the connection continuation, waiting for MOTD
    //
    callback(null, motd);
  });

}

//
// Event handler for listening for incoming irc messages
//
function _message (from, to, message) {

  var opt = require('optimist'),
      client = this;

  //
  // TODO: better detection of who to reply to, to / from
  //
  var replyTo = from;
  if(to.substr(0, 1) === "#") {
    replyTo = to;
  }

  // console.log(from, to, message);
  irc.receive({
    host: client.opt.server,
    port: client.opt.port,
    channel: to,
    channels: [to],
    nick: from,
    message: message
  });

  // XXX we need to emit some sort of message event/method here.
  // problem: the "message" method is being used
  if (message[0] === irc.TRIGGER) {

    //
    // Run user submitted command
    //

    var _command = message.substr(1, message.length -1).split(' '),
        _resource = _command.shift(),
        _method = _command.shift();

    resource.logger.info('received command from irc client ' + _command.join(' ').magenta);

    //
    // Assume that _command is in the style of "!resource method"
    //
    if (typeof resource[_resource] !== 'object') {
      client.say(replyTo, 'invalid resource ' +  _resource);
      return;
    }
    if (typeof resource[_resource][_method] !== 'function') {
      client.say(replyTo, 'invalid resource method ' +  _resource + "::" + _method);
      return;
    }

    var args = [];
    var schema = resource[_resource][_method].schema;

    if(_command.length > 0 ) {
      var _data = opt.parse(_command);
      if (typeof schema.properties === "object" && typeof schema.properties.options === "undefined") {
        Object.keys(schema.properties).forEach(function(prop,i){
          args.push(_data[i]);
        });
      }
      else {
        args.push(_data);
      }
    }

    var _callback = function (err, results) {
      if (err) {
        return client.say(replyTo, JSON.stringify(err, true, 2));
      }
      client.say(replyTo, JSON.stringify(results, true, 2));
    };
    args.push(_callback);

    //
    // TODO: better detection if method is sync or async based on schema
    //
    var result = resource[_resource][_method].apply(this, args);
    if (typeof result !== 'undefined') {
      _callback(null, result);
    }

    //
    // end running user command
    //

  }

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

  irc.connections[tuple].client.disconnect(options.message, function (err) {
    if (err) {
      return callback(err);
    }
    delete irc.connections[tuple];
    callback(null, true);
  });
}

irc.method('send', send, {
  description: 'sends an irc message',
  properties: {
    options: irc.schema.properties.message.properties.options,
    callback: {
      required: false,
      default: function () {}
    }
  }
});
function send (options, callback) {
  var tuple = [options.host, options.port].join(':');
  irc.connections[tuple].client.say(
    options.to || options.channels || [options.channel],
    options.message
  );
  callback(null, options);
}

// TODO: Is this right? Test it with hooks.
irc.method('receive', receive, {
  description: 'receives an irc message',
  properties: {
    options: irc.schema.properties.message.properties.options,
    callback: {
      required: false,
      default: function () {}
    }
  }
});
function receive(options, callback) {
  resource.logger.info('received message: '.grey + JSON.stringify(options));
  callback(null, options);
}

irc.method('command', command, {
  description: 'sends an irc command',
  properties: irc.schema.properties.command.properties
});
function command (options, callback) {
  var tuple = [options.host, options.port].join(':');

  irc.connections[tuple].client.send(options.command);  
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
  var tuple = [options.host, options.port].join(':');

  // TODO: Do something clever with channel vs. channels

  resource.logger.info('joining ' + options.channel.magenta);

  irc.connections[tuple].client.join(options.channel);
  irc.connections[tuple].channels[options.channel] = true;
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

  // TODO: Do something clever with channel vs. channels

  resource.logger.info('leaving ' + options.channel.magenta);

  irc.connections[tuple].client.part(options.channel);
  delete irc.connections[tuple].channels[options.channel];
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

irc.dependencies = {
  "irc": "0.3.4",
  "optimist": "0.3.5"
};

exports.irc = irc;