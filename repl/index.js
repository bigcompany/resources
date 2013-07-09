var resource = require('resource'),
repl = resource.define('repl');

repl.schema.description = "enables an interactive Read-Eval-Print-Loop ( REPL )";

repl.method('start', function(callback) {
  resource.logger.warn('STDIN will now be processed in a Read-Eval-Print-Loop');
  resource.logger.help('try console logging the "resource" object');
  require('repl').start("> ").context.resource = resource;
  if (callback) {
    callback(null, 'started');
  }
});

exports.repl = repl;