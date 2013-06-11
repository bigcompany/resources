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
    name: 'big-' + _resource.name,
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

  if (callback) {
    return callback(null, packagejson);
  } else {
    return packagejson;
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

  var resources = require('resources');

  for (var r in resources) {

    //
    // ignore 'logger' resource for now
    // see: https://github.com/bigcompany/resource/issues/16
    //
    if (r === 'logger') {
      continue;
    }

    //
    // Generate an npm packge.json manifest
    // https://github.com/isaacs/npm/blob/master/doc/cli/json.md
    //
    var pkg = package.npm(resources[r]);

    //
    // Write the package
    //
    var fs = require('fs'),
    path = require('path'),
    packagePath = path.normalize(require.resolve('resources') + '/../' + r + '/package.json');
    fs.writeFileSync(packagePath, JSON.stringify(pkg, true, 2));
    resource.logger.info('wrote ' + packagePath)

  }

  //
  // TODO:
  // Generate a 'global' package.json file for all resources
  //
}
package.method('build', build, {
  description: 'builds package.json files for all resources'
});

exports.package = package;
