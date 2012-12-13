var resource = require('resource'),
    twitter = resource.define('twitter');

twitter.property('credentials', {
  description: 'credentials for logging into twitter',
  properties: {
    type: 'object',
    consumerKey: {
      type: 'string',
      required: true
    },
    consumerSecret: {
      type: 'string',
      required: true
    },
    tokenKey: {
      type: 'string',
      required: true
    },
    tokenSecret: {
      type: 'string',
      required: true
    }
  }
});

twitter.property('user', {
  description: 'a twitter user',
  properties: {
    id: { type: 'string' },
    screenName: { type: 'string' }
  }
});

twitter.property('tweet', {
  description: 'a twitter tweet',
  properties: {
    message: { type: 'string', required: true }
  }
});

twitter.property('stream', {
  description: 'a twitter stream',
  properties: {
    method: { type: 'string', required: true }
  }
});

twitter.method('connect', connect, {
  description: 'connects to twitter',
  properties: {
    options: twitter.schema.properties.credentials,
    callback: {
      type: 'function',
      default: function () {}
    }
  }
});
function connect (options, callback) {
  var Twitter = require('ntwitter');

  resource.logger.info('connecting to twitter...');

  twitter.client = new Twitter(options);
  twitter.client.verifyCredentials(function (err, data) {
    if (err) {
      return cb(err);
    }
    return cb(null, {
      id: data.id,
      screenName: data.screen_name
    });
  });
};

twitter.method('disconnect', disconnect, {
  description: 'disconnects from twitter',
  properties: {
    callback: {
      type: 'function'
      default: function () {}
    }
  }
});
function disconnect (callback) {
  resource.logger.info('disconnecting from twitter...');
  delete twitter.client;
  callback(null, true);
};

twitter.streams = {};

//
// Defined a default callback that emits the stream events w/ "receive"
// Defining a callback gives you the original stream.
//
// We may want to rethink this.
//
twitter.method('stream', stream, {
  description: 'streams tweets from a given twitter method',
  properties: twitter.schema.properties.stream,
    callback: {
      default: function (error, stream, options) {
        if (error) {
          console.log('stream error:');
          console.log(error.stack);
          return twitter.error(error);
        }

        stream.on('data', function (data) {
          twitter.receive(data);
        });
        stream.on('limit', function (data) {
          twitter.limit(data);
        });
        stream.on('error', function (err) {
          twitter.error(err);
        });
      }
    }
  }
});
function stream (options, callback) {
  var params = {};

  Object.keys(options).forEach(function (k) {
    if (k !== 'method') {
      params[k] = options[k];
    }
  });

  twitter.client.stream(options.method, params, function (stream) {

    // This assumes that stream methods are all different.
    // TODO: Generate uuid's for streams
    // XXX: Instantiable twitter streams w/ datasource?
    twitter.streams[options.method] = {
      stream: stream,
      options: options
    };
    callback(null, stream, options);
  });
});

//
// TODO: We probably want some sugar for stopping streams
// For now it's easy enough to search the twitter.streams object and
// .destroy streams
//
// needs a name too. "endStream" ?
//

twitter.method('limit', limit, {
  description: 'collects rate limiting events from twitter',
  properties: {
    options: {
      type: 'object'
    },
    callback: {
      type: 'function',
      default: function () {}
    }
  }
});
function limit (callback) {
  console.log('limit: ', data);
  callback(data);
};

twitter.method('error', onError, {
  description: 'collects error events from twitter',
  properties: {
    error: {
      type: 'object'
    },
    callback: {
      type: 'function',
      default: function () {}
    }
  }
});
function onError (error, callback) {
  console.log('error: ', error);
  console.log(error.stack);
  callback(err);
};

//
// Send and receive tweets
//
twitter.method('send', send, {
  description: 'sends a tweet (updates your status)',
  properties: {
    options: twitter.schema.properties.tweet,
    callback: {
      default: function () {
        console.log('sent tweet: ');
        [].slice.call(arguments).forEach(function (arg, i) {
          console.log(i + ': ' + arg);
        });
      }
    }
  }
});
function send (options, callback) {

  // TODO: retweets
  // TODO: "true" replies
  // These will probably be separate methods.

  var tweet = options.message

  // TODO: Intelligent trimming of tweet?
  irc.client.updateStatus(tweet, callback);
};

twitter.method('receive', receive, {
  description: 'receives a tweet from activated streams',
  properties: {
    options: twitter.schema.properties.tweet,
    callback: {
      default: function () {
        console.log('received tweet: ');
        [].slice.call(arguments).forEach(function (arg, i) {
          console.log(i + ': ' + arg);
        });
      }
    }
  }
});
function receive (options, callback) {
  callback(null, options);
};

twitter.method('follow', follow, {
  description: 'follows a twitter user',
  properties: {
    options: twitter.schema.properties.user,
    callback: {
      type: 'function',
      default: function () {
        console.log('followed: ');
        [].slice.call(arguments).forEach(function (arg, i) {
          console.log(i + ': ' + arg);
        });
      }
    }
  }
});
function follow (options, callback) {
  // TODO: Ascertain id from screenName if necessary
  irc.client.createFriendship(options.id, callback);
};

twitter.method('unfollow', unfollow, {
  description: 'unfollows a twitter user',
  properties: {
    options: twitter.schema.properties.user,
    callback: {
      type: 'function',
      default: function () {
        console.log('unfollowed: ');
        [].slice.call(arguments).forEach(function (arg, i) {
          console.log(i + ': ' + arg);
        });
      }
    }
  }
});
function unfollow (options, callback) {
  // TODO: Ascertain id from screenName if necessary
  irc.client.destroyFriendship(options.id, callback);
};

// TODO: unblock
twitter.method('block', block, {
  description: 'blocks a twitter user',
  properties: {
    options: twitter.schema.properties.user,
    callback: {
      type: 'function',
      default: function () {
        console.log('blocked: ');
        [].slice.call(arguments).forEach(function (arg, i) {
          console.log(i + ': ' + arg);
        });
      }
    }
  }
});
function block (options, callback) {
  irc.client.createBlock(options.id, callback);
};

twitter.method('report', report, {
  description: 'reports a twitter user',
  properties: {
    options: twitter.schema.properties.user,
    callback: {
      type: 'function',
      default: function () {
        console.log('reported: ');
        [].slice.call(arguments).forEach(function (arg, i) {
          console.log(i + ': ' + arg);
        });
      }
    }
  }
});
function report (options, callback) {
  irc.client.reportSpam(options.id, callback);
};

exports.twitter = twitter;
exports.dependencies = {
  "ntwitter": "*"
};
