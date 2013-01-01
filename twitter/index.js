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
// TODO: Look up id if screenName is known but id is not
// Also: cache user/id pairs (LRU cache?)
//
twitter.property('user', {
  description: 'a twitter user',
  properties: {
    id: { type: 'string' },
    screenName: { type: 'string' }
  }
});

//
// TODO: There are other properties a tweet may have.
//
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
      return callback(err);
    }

    return callback(null, data);
  });
};

twitter.method('disconnect', disconnect, {
  description: 'disconnects from twitter',
  properties: {
    callback: {
      type: 'function',
      default: function () {}
    }
  }
});
function disconnect (callback) {
  resource.logger.info('disconnecting from twitter...');
  delete twitter.client;
  callback(null, true);
}

twitter.streams = {};

twitter.method('addStream', addStream, {
  description: 'starts listening to a twitter stream',
  properties: {
    options: twitter.schema.properties.stream,
    callback: {
      type: 'function',
      default: function (error, options, stream) {}
    }
  }
});
function addStream (options, callback) {
  var params = {};

  Object.keys(options).forEach(function (k) {
    if (k !== 'method') {
      params[k] = options[k];
    }
  });

  twitter.client.stream(options.method, params, function (stream) {
    var uuid = options.method + '-' + resource.uuid();

    twitter.streams[uuid] = {
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
    id: { type: 'string' },
    callback: {
      type: 'function',
      required: true
    }
  }
});
function getStream (id, callback) {
  var stream;

  try {
    stream = twitter.streams[id];
  }
  catch (err) {
    return callback(err);
  }
  callback(null, stream);
}

twitter.method('removeStream', removeStream, {
  description: 'stops listening to a twitter stream',
  properties: {
    id: { type: 'string' },
    callback: {
      type: 'function',
      default: function (error, options) {}
    }
  }
});
function removeStream (id, callback) {
  twitter.getStream(id, function (err, stream) {
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
  twitter.client.updateStatus(tweet, function (err, result) {
    if (err) {
      return callback(err);
    }
    console.log(options);
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
  twitter.client.reportSpam(options.id, callback);
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
  "ntwitter": "*",
  "twitter-text": "*"
};
