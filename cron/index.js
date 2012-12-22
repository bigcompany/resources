var resource = require('resource'),
    cron = resource.define('cron');

cron.schema.description = "for managing cron jobs";

cron.property("pattern", {
  "type":"string",
  "default": "* * * * * *",
  "description": "the pattern of the cron job"
});

cron.property("event", {
  "type": "string",
  "default": "logger:log",
  "description": "the event to be emitted each time the cron runs"
});

function run (_cron) {
  resource.emit(_cron.event);
};

cron.method('run', run);

//
// TODO: add test case for using .before and .after methods during a resource definition
// TODO: remove process.next line ( should not be needed )
//
process.nextTick(function(){
  cron.after('create', function(result){
    var cronJob = require('cron').CronJob;
    new cronJob(result.pattern, function() {
      cron.run(result);
    }, null, true);
  });
  
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

cron.method('start', start);

exports.dependencies = {
  "cron": "*"
};

exports.cron = cron;