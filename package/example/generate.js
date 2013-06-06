var resource = require('resource'),
    package = resource.use('package');

package.generate(process.argv[2], function(err, result) {
  resource.logger.info(JSON.stringify(result));
});
