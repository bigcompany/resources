var resource = require('resource'),
    twitter = resource.define('twitter');

twitter.property('credentials', {
  description: 'credentials for logging into twitter',
  properties: {
    type: 'object',
    consumer_key: {
      type: 'string',
      required: true
    },
    consumer_secret: {
      type: 'string',
      required: true
    },
    access_token_key: {
      type: 'string',
      required: true
    },
    access_token_secret: {
      type: 'string',
      required: true
    }
  }
});

//
// A user may be specified either by twitter screenName, or by twitter's
// numerical id for the same user. At least some methods in ntwitter require
// this numerical id in leiu of the screenName.
//
twitter.property('user', {
  description: 'a twitter user',
  properties: {
    id: {
      required: false
    },
    screenName: {
      type: 'string',
      required: false
    }
  }
});

//
// Many methods require a specified user in addition to other properties
//
function withScreenNameOrId(schema) {
  schema.properties = schema.properties || {};
  schema.properties.screenName = twitter.schema.properties.user.properties.screenName;
  schema.properties.id = twitter.schema.properties.user.properties.screenName
  return schema;
}

//
// We keep track of both screenNames and ids for users that have active
// authenticated client instances
//
// TODO: Consider cases where the specified user does not have a client.
// ntwitter should have a method for looking up numerical ids given a
// screenName.
//
function getScreenNameAndId(options) {
  var screenName, id;

  if (options.screenName) {
    screenName = options.screenName;
    id = twitter.screenNames[screenName];
  }
  else if (options.id) {
    id = options.id;
    screenName = twitter.ids[id];
  }

  return {
    screenName: screenName,
    id: id
  };
}

twitter.property('tweet', {
  description: 'a twitter tweet',
  properties: {
    message: {
      type: 'string',
      default: 'I am big.'
    },
  }
});

twitter.property('stream', {
  description: 'a twitter stream',
  properties: {
    method: { type: 'string', required: true }
  }
});

//
// When a user connects, their credentials are verified, their screenName
// and id are mutually cross-referenced, and the client is namespaced under
// their screenName
//
// TODO: Consider caching username/id pairs for non-authenticated users
// to avoid making unnecessary API calls, as a separate abstraction from
// the connections lookup table
//
twitter.connections = {};
twitter.screenNames = {};
twitter.ids = {};

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

  var client = new Twitter(options);
  client.verifyCredentials(function (err, data) {
    if (err) {
      return callback(err);
    }

    data.screenName = data.screen_name;

    twitter.screenNames[data.screen_name] = data.id;
    twitter.ids[data.id] = data.screen_name;
    twitter.connections[data.screen_name] = {
      client: client,
      metadata: data,
      streams: options.streams || {}
    };

    //
    // Open any streams passed in as connection parameters
    //
    var closedStreams = Object.keys(options.streams || {}),
        i = closedStreams.length;

    if (i) {
      return closedStreams.forEach(function (streamId) {
        var opts = options.streams[streamId].options;
        twitter.addStream(opts, function (err) {
          if (err) {
            return callback(err);
          }

          i--;
          if (i <= 0) {
            callback(null, data);
          }
        });
      })
    }

    callback(null, data);
  });
};

twitter.method('disconnect', disconnect, {
  description: 'disconnects from twitter',
  properties: {
    options: withScreenNameOrId({
      type: 'object'
    }),
    callback: {
      type: 'function',
      default: function () {}
    }
  }
});
function disconnect (options, callback) {
  var user = getScreenNameAndId(options),
      screenName = user.screenName,
      id = user.id;

  //
  // Clean up any active streams
  //
  var openStreams = Object.keys(twitter.connections[screenName].streams),
      i = openStreams.length;

  openStreams.forEach(function (streamId) {
    twitter.removeStream({
      screenName: screenName,
      streamId: streamId
    }, function (err) {
      if (err) {
        return callback(err);
      }

      i--;
      if (i <= 0) {
        //
        // Clean up user from lookup tables
        //
        delete twitter.connections[screenName];
        delete twitter.screenNames[screenName];
        delete twitter.ids[userdata.id];

        callback(null, true);
      }
    });
  });
}

twitter.method('addStream', addStream, {
  description: 'starts listening to a twitter stream',
  properties: {
    options: withScreenNameOrId(twitter.schema.properties.stream),
    callback: {
      type: 'function',
      default: function (error, options, stream) {}
    }
  }
});
function addStream (options, callback) {
  var params = {},
      user = getScreenNameAndId(options);

  //
  // TODO: Consider cases where there's a namespace collision between
  // authenticated user screenName/id versus non-authenticated user stream
  // parameters
  //
  Object.keys(options).forEach(function (k) {
    if (k === 'method') {
      return;
    }
    if (k === 'screenName') {
      return;
    }
    if (k === 'id') {
      return;
    }
    params[k] = options[k];
  });

  twitter.connections[user.screenName].client.stream(options.method, params, function (stream) {
    var uuid = options.method + '-' + resource.uuid();

    twitter.connections[user.screenName].streams[uuid] = {
      stream: stream,
      options: options
    };

    stream.on('data', function (data) {
      twitter.receive(data);
    });
    stream.on('limit', function (data) {
      twitter.limit(data);
    });
    stream.on('error', function (err) {
      twitter.error(err);
    });

    options.streamId = uuid;
    callback(null, options);
  });
};

twitter.method('getStream', getStream, {
  description: 'gets an active twitter stream',
  properties: {
    object: withScreenNameOrId({
      type: 'object',
      streamId: {
        type: 'string'
      }
    }),
    callback: {
      type: 'function',
      required: true
    }
  }
});
function getStream (object, callback) {
  var stream,
      screenName = getScreenNameAndId(options).screenName;

  try {
    stream = twitter.connections[screenName].streams[options.streamId];
  }
  catch (err) {
    return callback(err);
  }
  callback(null, stream);
}

twitter.method('removeStream', removeStream, {
  description: 'stops listening to a twitter stream',
  properties: {
    object: withScreenNameOrId({
      type: 'object',
      streamId: {
        type: 'string'
      }
    }),
    callback: {
      type: 'function',
      default: function (error, options) {}
    }
  }
});
function removeStream (options, callback) {
  twitter.getStream(options, function (err, stream) {
    if (err) {
      return callback(err);
    }
    stream.destroy();
    stream.on('destroy', function () {
      delete twitter.streams[id];
      callback(null, options);
    });
  });
}


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
    options: withScreenNameOrId(twitter.schema.properties.tweet),
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

  var screenName = getScreenNameAndId(options).screenName,
      tweet = options.message;

  // TODO: Intelligent trimming of tweet?
  twitter.connections[screenName].client.updateStatus(tweet, function (err, result) {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

twitter.method('receive', receive, {
  description: 'receives tweets from activated streams',
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
    options: withScreenNameOrId({
      type: 'object',
      user: twitter.schema.properties.user
    }),
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
  var screenName = getScreenNameAndId(options).screenName;

  irc.connections[screenName].client.createFriendship(options.id, callback);
};

twitter.method('unfollow', unfollow, {
  description: 'unfollows a twitter user',
  properties: {
    options: withScreenNameOrId({
      type: 'object',
      user: twitter.schema.properties.user
    }),
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
  var screenName = getScreenNameAndId(options).screenName;

  irc.connections[screenName].client.createBlock(options.id, callback);
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
  var screenName = getScreenNameAndId(options).screenName;

  twitter.connections[screenName].client.reportSpam(options.id, callback);
};

twitter.method('tweetLength', tweetLength, {
  description: 'gets the length of a tweet',
  properties: {
    options: twitter.schema.properties.tweet,
    callback: {
      type: 'function',
      required: false
    }
  }
});
function tweetLength (options, callback) {
  var l = require('twitter-text').getTweetLength(options.message);

  if (callback) {
    callback(null, l);
  }
  else {
    return l;
  }
};

exports.twitter = twitter;
exports.dependencies = {
  "ntwitter": "0.5.0"
};
