var resource  = require('resource'),
    replicator = resource.define('replicator'),
    path = require('path'),
    fs = require('fs');

replicator.schema.description = "provides an application replication API for resource based apps";

replicator.method('push', push, {
  "description": "pushes local big instance to a remote big instance",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "host": {
          "description": "the host to push to",
          "type": "string",
          "default": "biginternetcompany.net"
        },
        "port": {
          "description": "the port to push to",
          "type": "string",
          "default": "8888"
        }
      }
    },
    "callback": {
      "type": "function"
    }
  }
});

replicator.method('pull', pull, {
  "description": "pulls a big instance from a remote big instance",
  "properties": {
    "options": {
      "type": "object"
    },
    "callback": {
      "type": "function"
    }
  }
});

replicator.method('checkout', checkout, {
  "description": "checks out a local git repo into a directory",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "repo": {
          "description": "the repo to checkout",
          "type": "string"
        },
        "path": {
          "description": "the path to check the repo out to",
          "type": "string"
        }
      }
    },
    "callback": {
      "type": "function"
    }
  }
});

function checkout (options, callback) {
  //
  // TODO: add ability to check out specific branch and sha, instead of master HEAD
  //
  resource.logger.info('checking out latest commit...');
  var exec = require('child_process').exec;
  var _command = "git --work-tree=" + process.env.HOME + "/" + options.repo + "/ checkout -f";
  var checkout = exec(_command, { cwd: '/tmp/repos/' + options.repo + '/' },
    function (err, stdout, stderr) {
      console.log(stdout, stderr);
      if (err) {
        // TODO: do something meaningful with the error
        resource.logger.error('exec error: ' + err);
      } else {
        resource.logger.info('checked out latest commit to: ' + process.env.HOME + '/' + options.repo +'/');
      }
      resource.logger.warn('restart needed to update');
      callback(err, true);
  });
}

replicator.method('listen', listen, {
  "description": "starts a listening replicator service capable of recieving push requests",
  "properties": {
    "callback": {
      "type": "function"
    }
  }
});

function listen (callback) {

  var pushover = require('pushover');
  var p = '/tmp/repos';
  var repos = pushover(p);

  repos.on('push', function (push) {

    resource.logger.info('push ' + push.repo + '/' + push.commit + ' (' + push.branch + ')');
    push.accept();

    var meta = {};
    meta.source = push.request.headers['host'];
    meta.target = "localhost:8888";
    meta.repo = push.repo;
    meta.branch = push.branch;
    meta.time = new Date().toString();

    //
    // Trigger a pull event
    //
    replicator.pull(meta, function(err, result){
      // console.log(err, result);
    });

  });

  repos.on('fetch', function (fetch) {
    resource.logger.info('fetch ' + fetch.commit);
    fetch.accept();
  });

  //
  // Use git http push as middleware handler in existing http server
  //
  resource.http.app.use(function(req, res){
    repos.handle(req, res);
  });

  // TODO: where is the event handler for when this is ready?
  callback(null, resource.http.server);

};

replicator.method('start', listen, replicator.listen.schema);

// pushes current big instance to another
function push (options, callback) {

  var spawn = require('child_process').spawn;

  // shell out to git to perform push

  // after push, continue
  var result = "";

  console.log('-----------------');
  console.log('DROPPING INTO GIT\n');

  var git  = spawn('git', ['push', 'http://' + options.host + ':' + options.port + '/big', 'master']),
  err;

  git.stdout.on('data', function (data) {
    data = data.toString();
    console.log(data);
    result += data;
  });

  git.stderr.on('data', function (data) {
    data = data.toString();
    if(data !== '' && data !== "\n") {
      console.log(data);
      result += data;
    }
  });

  git.on('exit', function (code) {
    result = result.split('\n');
    console.log('GIT EXITING')
    console.log('-----------------');
    if (result[0].search('t connect to host') !== -1 || result[0].search('error: Failed connect') !== -1) {
      resource.logger.error('git push failed!');
      resource.logger.info('attempting to ssh into the machine to fix the problem...');
      resource.node.sh({ host: options.host, recipe: "ubuntu-12.04" }, callback);
    } else {
      callback(null, options);
    }
  });

}

function pull (options, callback) {
  //
  // This function represents the "pull" event
  // There is no code here, since everything hooks on to "replicator::pull" event
  //
  //
  callback(null, options);
}

replicator.dependencies = {
  "pushover": "1.1.0"
};

exports.replicator = replicator;