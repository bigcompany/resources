var resource = require('resource'),
    logger = resource.logger,
    package = resource.define('package'),
    path = require('path'),
    fs = require('fs');

package.schema.description = 'for generating package files';

function npm (_resource, callback) {

  if(typeof _resource === 'string') {
    _resource = resource.use(_resource);
  }

  // if resource version not set, since it is required
  // for packagejson then use the resource module
  _resource.version = _resource.version || resource.version;

  // default keywords manually
  _resource.keywords = _resource.keywords || [];
  // Add global keywords
  _resource.keywords.push('big.vc', 'resource', 'resources');

  // default dependencies manually
  _resource.dependencies = _resource.dependencies || {};
  // Add resource as dependency
  _resource.dependencies['resource'] = "0.4.x";

  if (resource.validator.validate(_resource, resource.resource.schema)) {
    // https://github.com/isaacs/npm/blob/master/doc/cli/json.md
    // https://github.com/component/component/wiki/Spec
    var packagejson = {
      name: 'resource-' + _resource.name,
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

    // delete any undefined's
    for (var prop in packagejson) {
      if (packagejson[prop] === undefined) {
        delete packagejson[prop];
      }
    }

    // TODO: sort dependencies by alphanumeric order

    return packagejson;

  } else {
    var err = new Error("invalid resource " + _resource.name);
    throw err;
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

  var resources = require('resources').resources;

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
    resource.logger.info('wrote ' + packagePath);

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
