var resource  = require('resource'),
    replicator = resource.define('replicator'),
    path = require('path'),
    fs = require('fs');

replicator.schema.description = "replicator service for big instances";

replicator.method('push', push, {
  "description": "pushes current big instance to a remote big instance",
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
      "type": "object",
      "properties": {
        "path": {
          "description": "the path to pull the big instance from",
          "type": "string"
        },
        "location": {
          "description": "the type of location big is pulling from",
          "type": "string",
          "enum": ["fs", "http"]
        },
        "targetDir": {
          "description": "the location to extract big instance",
          "type": "string"
        }
      }
    },
    "callback": {
      "type": "function"
    }
  }
});

replicator.method('log', _log, {
  "description": "shows past commit history of replicator"
});


function _log (callback) {

  var spawn = require('child_process').spawn;
  var out = [],
      git = spawn('git', [ 'log', '--numstat' ], { cwd: "/tmp/repos/big/" });

  git.stdout.on('data', function (data) {
    out.push(data.toString());
  });

  git.stderr.on('data', function (data) {
    throw data;
  });

  git.on('exit', function (code) {
    if (out.length) {
      parse(out.join(''), callback);
    }
    else {
      throw new Error('no logs given');
    }
  });

  function parse(logs, callback) {
    var commits = [],
        thisCommit = {},
        mode = 'commit';

    function unshift() {
      thisCommit.msg = thisCommit.msg.join('\n');
      commits.unshift(thisCommit);
    }

    logs = logs.split('\n');

    logs.forEach(function (l, i) {
      if (mode === 'commit') {
        if (l.substr(0, 6) === 'commit') {
          init();
          mode = 'header';
          return;
        }
        throw parseError('expected `commit`');
      }
      else if (mode === 'header') {
        if (l === '') {
          mode = 'msg';
          return;
        }
        header();
      }
      else if (mode === 'msg') {
        if (l.substr(0, 4) === '    ') {
          return msg();
        }
        if (l === '') {
          mode = 'numstat';
          return;
        }
        throw parseError('unexpected non-indented block in msg');
      }
      else if (mode === 'numstat') {
        if (l.substr(0, 6) === 'commit') {
          unshift();
          init();
          mode = 'header';
          return;
        }
        if (l === '') {
          unshift();
          mode = 'commit';
          return;
        }
        numstat();
      }
      return;

      function init() {
        thisCommit = {
          commit: l.split(' ')[1],
          msg: [],
          plus: 0,
          minus: 0
        };
      }

      function header() {
        try {
          var kvp = l.split(':'),
              key = kvp[0].toLowerCase(),
              val = kvp[1].trim();

          if (key == 'date') {
            console.log(val);
            val = new Date(val);
          }

          thisCommit[key] = [val];
        }
        catch (err) {
          throw parseError('malformed header format');
        }
      }

      function msg() {
        thisCommit.msg.push(l.substr(4));
      }

      function numstat() {
        // way too lazy to do a regexp or anything clever.
        var row = l.split('\t');

        thisCommit.plus += parseInt(row[0], 10);
        thisCommit.minus += parseInt(row[1], 10);
      }

      function parseError(msg) {
        return new Error(util.format(
          'git logs parse error: %s\non line %d: `%s`',
          msg || '(unspecified)', i, l
        ));
      }
    });

    // push on last one
    //unshift();
    commits = commits.reverse();
    callback(null, commits);
  }

}

replicator.method('checkout', checkout, {
  "description": "checks out a local git repo into a directory",
  "properties": {
    "options": {
      "repo": {
        "description": "the repo to checkout",
        "type": "string"
      },
      "path": {
        "description": "the path to check the repo out to",
        "type": "string"
      }
    },
    "callback": {
      "type": "function"
    }
  }
});


function checkout (callback) {

    // TODO: add ability to check out specific sha instead of master
    console.log('checking out latest commit...');
    var exec = require('child_process').exec;
    var _command = "git --work-tree=" + process.env.HOME + "/big/ checkout -f";
    var checkout = exec(_command, { cwd: '/tmp/repos/big/' },
      function (err, stdout, stderr) {
        console.log(stdout, stderr);
        if (err) {
          // TODO: do something meaningful with the error
          console.log('exec error: ' + err);
        } else {
          console.log('checked out latest commit to: ~/big/');
        }
        console.log('restart needed to update');
        callback(err, true);
    });

}

replicator.method('listen', listen, {
  "description": "starts a listening replicator service capable of recieving big push requests",
  "properties": {
    "callback": {
      "type": "function"
    }
  }
});

function listen (callback) {

  var pushover = require('pushover');
  var p = '/tmp/repos';
  // console.log(p);
  var repos = pushover(p);

  repos.on('push', function (push) {
      console.log('push ' + push.repo + '/' + push.commit + ' (' + push.branch + ')');
      push.accept();
  });

  repos.on('fetch', function (fetch) {
      console.log('fetch ' + fetch.commit);
      fetch.accept();
  });

  //
  // Use git http push as middleware handler in existing http server
  //
  resource.http.app.use(function(req, res){
    repos.handle(req, res);
  });

  // TODO: where is the event handler for when this is ready?
  callback(null);

};


// pushes current big instance to another
function push (options, callback) {

  var spawn = require('child_process').spawn;

  // shell out to git to perform push

  // after push, continue
  var result = "";

  console.log('-----------------');
  console.log('DROPPING INTO GIT\n');

  var git  = spawn('git', ['push', 'http://' + options.host + ':' + options.port + '/big', 'master']);

  git.stdout.on('data', function (data) {
    data = data.toString();
    console.log(data);
    result += data;
  });

  git.stderr.on('data', function (data) {
    data = data.toString();
    console.log(data);
    result += data;
  });

  git.on('exit', function (code) {
    //console.log('child process exited with code ' + code);
    console.log('GIT EXITING')
    console.log('-----------------');
    callback(null, options);
  });

  // TODO: remote instance restarts and pipes back success / fail message

  //
  // TODO:
  //
    // if no connection can be found, throw error
    // in the future, we could add prompt to noc noc over ssh and try push again

}

function pull (options, callback) {
  // TODO: shell out to git pull
}


exports.replicator = replicator;

exports.dependencies = {
  "pushover": "*"
};