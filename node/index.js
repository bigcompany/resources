var resource  = require('resource'),
    node = resource.define('node');

node.schema.description = "for managing nodes";

node.property("port", {
  "type": "number",
  "default": 7777,
  "description": "the port of the node"
});

node.property("host", {
  "type": "string",
  "default": "0.0.0.0",
  "description": "the host of the node"
});

node.property('events', {
  "description": "the total amount of events processed by this node",
  "type": "number"
});

node.property('username', {
  "description": "the username used to log into the node",
  "type": "string",
  "default": "root",
  "required": false
});

node.property('password', {
  "description": "the password used to log into the node",
  "type": "string",
  "required": false
});


node.property('system', {
  "description": "a dump of the node's system information ( from node.process and require('os') module )",
  "type": "object"
});

node.property('lastSeen', {
  "description": "the last date/time the node was seen",
  "type": "string"
});

node.method('sh', sh, {
  "description": "execute shell scripts on a remote node via SSH",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "host": {
          "type": "string",
          "default": "0.0.0.0"
        },
        "recipe": {
          "description": "path to the shell script to run remotely",
          "type": "string",
          "default": __dirname + "/recipes/ls-test"
        }
      }
    },
    "callback": {
      "type": "function"
    }
  }
});

var spawn = require('child_process').spawn,
    fs = require('fs'),
    sys = require('sys');

function sh (options, callback) {

  options.username = "root";

  //
  // Read in shell script recipe file
  //
  fs.readFile(options.recipe, function (err, data) {

    if (err) {
      return callback(err);
    }

    var loggedIn = false,
    lines,
    commands = [],
    ssh;

   //
   // Turn recipe commands into new line delimited array
   //
   lines = data.toString().split('\n');

   //
   // Remove any line that is empty or starts with a comment
   //
   lines.forEach(function(line){
     if(line.substr(0, 1) !== '#' && line.length > 0) {
       commands.push(line);
     }
   });

   //
   // Join the commands back into bash commands using && to concat each command
   // This creates a long string of bash commands connected by &&,
   // which are executed sequentially
   //
   commands = commands.join(' && ');

   //
   // Spawn SSH binary as child process
   //
   ssh = spawn('ssh', ['-l' + options.username, options.host, commands]);

   //
   // When the SSH binary exits, execute the callback
   //
   ssh.on('exit', function (code, signal) {
     callback(null, {
       code: code,
       signal: signal
     })
   });

   ssh.stderr.on('data', function (err) {
     process.stdout.write(err);
   });

   ssh.stdout.on('data', function (out) {
     process.stdout.write(out);
     if (!loggedIn) {
       var stdin = process.openStdin();
       stdin.on('data', function (chunk) {
         ssh.stdin.write(chunk);
       });
     }
     loggedIn = true;
   });


 });

}

exports.node = node;