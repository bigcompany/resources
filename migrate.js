/**
 * @fileOverview Migration script to resource 0.5.x, this script will:
 *   - create a new branch filtering the selected folder (resource)
 *   - create a new repo pulling this branch in a new directory
 *   - apply OSS boilerplate
 *
 * To use you need to have this directory structure:
 *   |- resources/
 *   |- resource-template/
 *
 * Fetch resource-template:
 *   git clone https://github.com/thanpolas/resource-template.git
 *
 * To run enter 'resources/' directory and type:
 *   node ./migrate.js [resource name]
 *
 * where [resource name corresponds to a directory].
 */

var exec = require('child_process').exec;

function runCommand(command, optExecOptions, done) {
  function execCB(err, stdout, stderr) {
    if ( err ) {
      console.error('ERROR:', err);
      done(false, stderr, stdout);
      return;
    }
    done(true, stdout);
  }
  if (optExecOptions) {
    exec(command, optExecOptions, execCB);
  } else {
    exec(command, execCB);
  }
}

function gitSubtree(resourceName, done) {
  var gitSub = 'git subtree split --prefix=' + resourceName +
    ' --branch=resource-' + resourceName;
  runCommand(gitSub, done);
}

function mkdir(resourceName, done) {
  runCommand('mkdir ../resource-' + resourceName, done);
}

function gitInit(resourceName, done) {
  process.chdir('../resource-' + resourceName);
  runCommand('git init', done);
}

function gitpull(resourceName, done) {
  runCommand('git pull ../resources resource-' + resourceName, done);
}

function ossBoilerplate(resourceName, done) {
  runCommand('cp ../resource-template/.* ./', function() {
    // ignore error, we expect them
    runCommand('cp ../resource-template/* ./', done);
  });
}

// the callback of death
function go() {
  var resourceName = process.argv[2];
  console.log('git subtree...');
  gitSubtree(resourceName, function(err) {
    if (err) {return console.log('Error:', err);}
    console.log('creating new resource directory...');
    mkdir(resourceName, function(err) {
      if (err) {return console.log('Error:', err);}
      console.log('Entering new directory and initializing git...');
      gitInit(resourceName, function(err) {
        if (err) {return console.log('Error:', err);}
        console.log('Fetching subtree\'d branch from resources...');
        gitpull(resourceName, function(err) {
          if (err) {return console.log('Error:', err);}
          console.log('Applying OSS boilerplate...');
          ossBoilerplate(resourceName, function() {
            console.log('All done!\nResource "resource-' + resourceName +
              '" has been created!');
          });
        });
      });
    });
  });
}

go();
