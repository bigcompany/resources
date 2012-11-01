var resource  = require('resource'),
    ssh = resource.define('ssh');

ssh.schema.description = "ssh interface resource";

exports.ssh = ssh;
