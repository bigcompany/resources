var resource = require('resource'),
    logger = resource.logger,
    packager = resource.define('packager'),
    path = require('path'),
    fs = require('fs');

packager.schema.description = 'for generating packager files';

function npm (_resource) {
  //logger.info(".npm(", _resource, callback, ")");

  if(typeof _resource === 'string') {
    _resource = resource.use(_resource);
  }

  // https://github.com/isaacs/npm/blob/master/doc/cli/json.md
  // https://github.com/component/component/wiki/Spec
  var packagerjson = {
    name: 'resource-' + _resource.name,
    version: _resource.version || resource.version,
    description: _resource.schema.description,
    keywords: _resource.keywords || [],
    license: _resource.license,
    main: './index.js',
    dependencies: _resource.dependencies
    // TODO: standardize tests into resource format and
    // set devDependencies as dependencies of associated test resource
    //devDependencies: _resource.devDependencies || _resource.development
  };

  // Add global keywords
  packagerjson.keywords.push('big.vc', 'resource', 'resources');

  // Add resource as dependency
  packagerjson.dependencies = packagerjson.dependencies || {};
  packagerjson.dependencies['resource'] = "0.4.x";

  // TODO: sort dependencies by alphanumeric order
  return packagerjson;

}
packager.method('npm', npm, {
  description: 'generates packager.json for a single resource',
  properties: {
    resource: {
      description: 'the resource to generate packager.json for',
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
    var pkg = packager.npm(resources[r]);

    //
    // Write the packager
    //
    var fs = require('fs'),
    path = require('path'),
    packagerPath = path.normalize(require.resolve('resources') + '/../' + r + '/package.json');
    fs.writeFileSync(packagerPath, JSON.stringify(pkg, true, 2));
    resource.logger.info('wrote ' + packagerPath)

  }

  //
  // TODO:
  // Generate a 'global' packager.json file for all resources
  //
}
packager.method('build', build, {
  description: 'builds packager.json files for all resources'
});

exports.packager = packager;
