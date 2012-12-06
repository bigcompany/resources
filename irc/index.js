var resource = require('resource'),
    irc = resource.define('irc');

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
        message: { type: 'string' }
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

irc.property('nick');
irc.property('channel');
irc.property('channels', {
  type: 'array'
});

irc.method('connect', connect, {
  description: 'connects to an irc server',
  properties: {
    options: {
      type: 'object',
      properties: {
        host: irc.schema.properties.server.properties.host,
        port: irc.schema.properties.server.properties.port
      }
    }
  }
});
function connect (options, callback) {
  console.log(options);
  callback(null, true);
}

irc.method('disconnect', disconnect, {
  description: 'disconnects from an irc server',
  properties: {
    options: {
      type: 'object',
      properties: {
        host: irc.schema.properties.server.properties.host,
        port: irc.schema.properties.server.properties.port
      }
    }
  }
});
function disconnect (options, callback) {
  callback(null, true);
}

irc.method('message', message, {
  description: 'sends an irc message',
  properties: irc.schema.properties.message.properties
});
function message (options, callback) {
  console.log(options);
  callback(null, true);
}

irc.method('command', command, {
  description: 'sends an irc command',
  properties: irc.schema.properties.command.properties
});
function command (cmd, callback) {
  console.log(cmd);
  callback(null, cmd);
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
function join (options, callback) {
  console.log(options);
  callback(null, true);
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
  console.log(options);
  callback(null, true);
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
  console.log(options);
  console.log('voiced');
  callback(null, true);
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
  console.log(options);
  console.log('devoiced');
  callback(null, true);
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
  console.log(options);
  console.log('opped');
  callback(null, true);
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
  console.log(options);
  console.log('deopped');
  callback(null, true);
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
  console.log(options);
  console.log('kicked');
  callback(null, true);
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
  console.log(options);
  console.log('banned');
  callback(null, true);
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
  console.log(options);
  console.log('unbanned');
  callback(null, true);
}

exports.irc = irc;
