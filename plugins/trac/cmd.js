
var http = require('http')
  , util = require('util')
  , format = util.format
  , csv = require('csv')
  ;

exports.run = function(info) {
  var cmd = cmds[info.cmdstr];
  if (cmd) {
    cmd(info);
  }
};

var cmds = {
  trac: function(info) {
    var id = info.rest;
    http.get({
      host: info.plugin.options.host
    , path: '/ticket/' + id + '?format=csv'
    }, function(res) {
      var buf = [];
      res.on('data', function(d) { buf.push(d); });
      res.on('end', function() {
        var lines = [];
        csv()
        .from(buf.join(), {columns: true})
        .on('data', function(data, index){
          lines.push(data);
        })
        .on('end', function(count){
          var ticket = lines[0];
          // id, summary, reporter, owner, description, type, status, priority, milestone, component,
          // severity, resolution, keywords, cc, loe, verify_trunk, verify_path, verify_pre,
          // verify_live, code_review
          info.bot.respond(info, format('%s | %s %s (%s) | http://%s/ticket/%s',
                                       ticket.summary,
                                       ticket.status,
                                       ticket.resolution,
                                       ticket.milestone,
                                       info.plugin.options.host,
                                       id));
        })
        .on('error', function(error){
          info.bot.respond("Sorry, I can't find what you're looking for.");
        });
      });
    }).on('error', function(e) {
      info.bot.respond(info, 'Sorry, unable to process request at this time.');
    });
  }
};
