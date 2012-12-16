//
// TODO: Permissions resource
//

var resource = require('resource'),
    permissions = resource.define('permissions');

permissions.schema.description = "for managing permissions";

permissions.property("accountID", {
  "type":"string",
  "default": "my title",
  "key": "account",
  "description": "the account to apply permission to"
});

permissions.property("event", {
  "type":"string",
  "description": "the link to the permissions on a third party site",
  "format": "permissions"
});

exports.permissions = permissions;