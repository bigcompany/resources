var resource = require('resource'),
    cron = resource.define('cron');

cron.schema.description = "for managing cron jobs";

cron.persist('memory');

cron.property("pattern", {
  "type":"string",
  "default": "*/5 * * * * *",
  "description": "the pattern of the cron job"
});

cron.property("event", {
  "type": "string",
  "default": "logger::log",
  "description": "the event to be emitted each time the cron runs"
});

cron.property("with", {
  "type": "object",
  "description": "metadata to execute the cron with"
});

function run (_cron) {
  resource.emit(_cron.event, _cron.with);
};

cron.method('run', run, {
  "description": "runs / starts a cron job"
});

cron.after('create', function(result){
  var cronJob = require('cron').CronJob;
  new cronJob(result.pattern, function() {
    cron.run(result);
  }, null, true);
});

function start () {
  //
  // Load all previously saved crons,
  // and start running them
  //
  cron.all(function(err, results){
    results.forEach(function(result){
      var cronJob = require('cron').CronJob;
      new cronJob(result.pattern, function() {
        cron.run(result);
      }, null, true);
    });
  });
};

cron.method('start', start, {
  "description": "starts the cron resource ( which will run all cron jobs )"
});

cron.dependencies = {
  "cron": "1.0.1"
};

exports.cron = cron;