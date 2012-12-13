var resource = require('resource'),
repl = resource.define('repl');

repl.method('start', function() {
  resource.logger.info('resource repl enabled!');
  resource.logger.warn('STDIN will now be processed in a read-eval-print-loop');
  resource.logger.help('hint: try console logging the "resource" object');
  require('repl').start("> ").context.resource = resource;
});

exports.repl = repl;