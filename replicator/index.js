var resource  = require('resource'),
    replicator = resource.define('replicator'),
    path = require('path'),
    fs = require('fs');

replicator.schema.description = "replicator service for big instances";

replicator.property('replication', {
  "decription": "a replication event",
  "properties": {
    "time": {
      "description": "the date and time of the replication",
      "type": "string",
      "default": new Date().toString()
    },
    "source": {
      "description": "the source of the replication ( where the code is coming from )",
      "type": "string"
    },
    "target": {
      "description": "the target of the replication ( where the code is going )",
      "type": "string"
    }
  }
});

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

replicator.method('listen', listen, {
  "description": "starts a listening replicator service capable of recieving big push requests"
});

function listen () {

  var pushover = require('pushover');
  var p = '/tmp/repos';
  console.log(p);
  var repos = pushover(p);

  repos.on('push', function (push) {
      console.log('push ' + push.repo + '/' + push.commit + ' (' + push.branch + ')');
      console.log('checking out latest commit...');
      var exec = require('child_process').exec;
      var _command = "git --git-dir=/root/big/ checkout -f";
      var checkout = exec(_command,
        function (error, stdout, stderr) {
          if (error !== null) {
            // TODO: do something meaningful with the error
            console.log('exec error: ' + error);
          } else {
            console.log('checked out lastest commit to: /root/big/');
          }
          push.accept();
          console.log('restart needed to update');
          console.log('exiting process... ( there should be a process monitor watching this )')
          process.nextTick(function(){
            process.exit();
          });
      });
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