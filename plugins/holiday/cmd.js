
var http = require('http')
  , util = require('util')
  , format = util.format
  ;

exports.run = function(info) {
  var cmd = cmds[info.cmdstr];
  if (cmd) {
    cmd(info);
  }
};

var cmds = {
  holiday: function(info) {
    var id = info.rest;
    http.get({
      host: info.plugin.options.host
    , port: info.plugin.options.port
    , path: info.plugin.options.path
    }, function(res) {
      var buf = [];
      res.on('data', function(d) { buf.push(d); });
      res.on('end', function() {
        var obj = JSON.parse(buf.join())
          , today = new Date()
          , holiday
          , days
          ;

        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        // select events in the future
        obj.events = obj.events.filter(function(e, i, arr){
          return e.start >= today.getTime();
        });
        // only show the next one
        holiday = obj.events.shift();
        holiday.start = new Date(holiday.start);
        days = ((holiday.start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)).toFixed();
        info.bot.respond(info, format('There are %s days until %s on %s',
                                      days,
                                      holiday.summary,
                                      holiday.start.toDateString())
                        );
      });
    }).on('error', function(e) {
      info.bot.respond(info, 'Sorry, unable to process request at this time.');
    });
  }
};
