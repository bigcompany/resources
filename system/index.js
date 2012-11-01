var resource = require('resource'),
    system = resource.define('system');

system.schema.description = "for interacting with the operating system";

var spawn = require('child_process').spawn;

system.method('info', info, {
  "description": "provides information about current operating system"
});

system.method('useradd', useradd, {
  "description": "adds a user to a group",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "user": {
          "description": "the name of the user to add",
          "type": "string",
          "required": true
        },
        "group": {
          "description": "group to add user to",
          "type": "string",
          "default": "big-users"
        }
      }
    },
    "callback": {
      "type": "function"
    }
  }
});

system.method('userdel', userdel, {
  "description": "removes a user from a group",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "user": {
          "description": "the name of the user to add",
          "type": "string",
          "required": true
        },
        "group": {
          "description": "user group to add user to",
          "type": "string",
          "default": "big-users"
        }
      }
    },
    "callback": {
      "type": "function"
    }
  }
});

system.method('passwd', passwd, {
  "description": "changes a user's password",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "user": {
          "description": "the name of the user to update password for",
          "type": "string",
          "required": true
        },
        "password": {
          "description": "the new password",
          "type": "string",
          "required": true
        }
      }
    },
    "callback": {
      "type": "function"
    }
  }
});

system.method('groupadd', groupadd, {
  "description": "adds a new group to the system",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "name": {
          "description": "the name of the group",
          "type": "string",
          "required": true
        }
      }
    },
    "callback": {
      "type": "function"
    }
  }
});

system.method('members', members, {
  "description": "lists members of a group",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "name": {
          "description": "the name of the group",
          "type": "string",
          "default": "big-users",
          "required": true
        }
      }
    },
    "callback": {
      "type": "function"
    }
  }
});

// TODO: move this to "process" resource, restart on system should be a system restart
system.method('kill', function(){
  // TODO: if kill was a command on system, it would take a pID as an argument
  process.exit();
});

function info () {

  var os  = require('os');

  var obj = {};

  obj.name     = "big";
  obj.version  = "v0.0.0";

  obj.system = {
    platform: os.platform(),
    uptime: os.uptime(),
    loadavg: os.loadavg(),
    totalmem: os.totalmem(),
    cpus: os.cpus(),
    networkInterfaces: os.networkInterfaces()
  };

  return obj;

};

function useradd (options, callback) {

  if (process.platform !== "linux") {
    return callback(new Error('command only available for linux systems'));
  }

  // useradd -s /usr/local/bin/big-sh -m -g big-users marak
  var useradd  = spawn('useradd', ['-s', '/usr/local/bin/big-sh', '-m', '-g', options.group, options.user]);

  useradd.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  useradd.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  useradd.on('exit', function (code) {
    console.log('child process exited with code ' + code);
    callback(null, options);
  });
};

function passwd(options, cb) {

 var passwd,
     stderr = [],
     stdout = [];

 passwd = spawn('passwd', [ options.user ]);

 passwd.stdout.on('data', function (data) {
   stdout.push(data.toString());
 });

 passwd.stderr.on('data', function (data) {
   var str = data.toString();
   var expects = {
     '(current) UNIX password: ': options.current,
     'Enter new UNIX password: ': options.password,
     'Retype new UNIX password: ': options.password
   };
   // TODO: expect `Bad: new password is too simple`
   var out = expects[str];
   if (out) {
     passwd.stdin.write(out + '\n');
   }
   else {
     stderr.push(str);
   }
 });

 passwd.on('exit', function (c) {
   var err = null;
   if (c) {
     err = new Error(stderr.join('').split('\n')[0]);
   }
   cb(err, stdout.join(''), stderr.join(''));
 });

};

function userdel (options, callback) {

  if (process.platform !== "linux") {
    return callback(new Error('command only available for linux systems'));
  }

  // userdel marak
  var userdel  = spawn('userdel', [options.username]);

  userdel.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  userdel.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  userdel.on('exit', function (code) {
    console.log('child process exited with code ' + code);
    callback(null, 'big-users');
  });

};

function groupadd (options, callback) {

  if (process.platform !== "linux") {
    return callback(new Error('command only available for linux systems'));
  }

  // groupadd big-users
  var groupadd  = spawn('groupadd', [options.name]);

  groupadd.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  groupadd.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  groupadd.on('exit', function (code) {
    console.log('child process exited with code ' + code);
    callback(null, 'big-users');
  });

};

function members (options, callback) {

  if (process.platform !== "linux") {
    return callback(new Error('command only available for linux systems'));
  }

  // members big-users
  var members  = spawn('members', [options.name]);

  members.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  members.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  members.on('exit', function (code) {
    console.log('child process exited with code ' + code);
    callback(null, code);
  });

};

exports.system = system;