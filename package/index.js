var resource = require('resource'),
    logger = resource.logger,
    package = resource.define('package'),
    path = require('path'),
    fs = require('fs');

package.schema.description = 'for generating package files';

function npm (_resource, callback) {
  //logger.info(".npm(", _resource, callback, ")");

  if(typeof _resource === 'string') {
    _resource = resource.use(_resource);
  }

  // https://github.com/isaacs/npm/blob/master/doc/cli/json.md
  // https://github.com/component/component/wiki/Spec
  var packagejson = {
    name: 'big-' + _resource.name + '-resource',
    version: _resource.version,
    description: _resource.schema.description,
    keywords: _resource.keywords,
    license: _resource.license,
    main: './index.js',
    dependencies: _resource.dependencies
    // TODO: standardize tests into resource format and
    // set devDependencies as dependencies of associated test resource
    //devDependencies: _resource.devDependencies || _resource.development
  };
  //logger.info("generated package.json for", _resource.name);

  var str = JSON.stringify(packagejson, null, 2);
  //logger.info(str);

  if(callback) {
    return callback(null, str);
  } else {
    return str;
  }
}
package.method('npm', npm, {
  description: 'generates package.json for a single resource',
  properties: {
    resource: {
      description: 'the resource to generate package.json for',
      type: 'any'
    },
    callback: {
      type: 'function'
    }
  }
});

function build () {
  var _resources = {};

  //
  // Attempt to load /resources/ folder from current resources directory
  //
  var resourcesPath = (path.resolve(require.resolve('resources') + '/../'));
  var dirs = fs.readdirSync(resourcesPath);

  //
  // Generate a README file for every resource
  //
  dirs.forEach(function(p){
    var stat,
        resourcePath,
        resourceModule;

    resourcePath = resourcesPath + '/' + p;

    //
    // Check if path is actually a resource
    //
    if (resource.isResource(resourcePath)) {
      //
      // If file is a resource, then attempt to generate documentation for it
      //
      try {

        var _resource = require(resourcesPath + '/' + p);
        _resources[p] = {};
        if(typeof _resource[p] !== 'undefined') {
          _resource = _resource[p];

          //
          // Generate resource documentation
          //
          //logger.info("generating package.json for", JSON.stringify(_resource));
          package.npm(_resource, function(err, packagejson) {
            if (err) { throw err; }
            //
            // Write resource documentation to disk
            //
            var _path = resourcePath + '/package.json';
            fs.writeFileSync(_path, packagejson);
            logger.info('wrote package.json: ' + path.resolve(_path).grey);
          });
        }
      } catch(err) {
        delete _resources[p];
        logger.error('could not generate package.json for resource: ' + p);
        console.log(err);
      }
    }
  });

  // TODO:
  // Generate a 'global' package.json file for all resources
  //
}
package.method('build', build, {
  description: 'builds package.json files for all resources'
});

exports.package = package;
