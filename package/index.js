var resource = require('resource'),
    logger = resource.logger,
    package = resource.define('package'),
    path = require('path'),
    fs = require('fs');

package.schema.description = 'for generating package files';

function generate (_resource, callback) {
  logger.info(".generate(", _resource, callback, ")");

  if(typeof _resource === 'string') {
    _resource = resource.use(_resource);
  }

  // https://github.com/isaacs/npm/blob/master/doc/cli/json.md
  var packagejson = {
    name: _resource.name + '-resource',
    version: _resource.version,
    description: _resource.schema.description,
    keywords: _resource.keywords,
    homepage: _resource.homepage,
    bugs: _resource.bugs,
    license: _resource.license,
    author: _resource.author,
    contributors: _resource.contributors,
    files: _resource.files,
    main: _resource.main || './index',
    bin: _resource.bin,
    man: _resource.man,
    directories: _resource.directories,
    repository: _resource.repository,
    scripts: _resource.scripts,
    //config: _resource.config,
    dependencies: _resource.dependencies,
    devDependencies: _resource.devDependencies,
    bundledDependencies: _resource.bundledDependencies,
    optionalDependencies: _resource.optionalDependencies,
    engines: _resource.engines,
    engineStrict: _resource.engineStrict,
    os: _resource.os,
    cpu: _resource.cpu,
    preferGlobal: _resource.preferGlobal,
    private: _resource.private,
    publishConfig: _resource.publishConfig
  };

  logger.info("generated package.json for", _resource.name);
  logger.info(JSON.stringify(packagejson));

  if(callback) {
    return callback(null, packagejson);
  } else {
    return packagejson;
  }
}
package.method('generate', generate, {
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
          var packagejson = package.generate(_resource, fs.readFileSync(__dirname + '/template.md').toString());

          //
          // Write resource documentation to disk
          //
          var _path = resourcePath + '/package.json';

          fs.writeFileSync(_path, packagejson);
          logger.info('wrote resource documentation: ' + path.resolve(_path).grey);
        }
      } catch(err) {
        delete _resources[p];
        logger.error('could not generate documentation for resource: ' + p);
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