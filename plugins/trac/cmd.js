
var nodeio = require('node.io')
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
  trac: function(info) {
    var id = info.rest;

    nodeio.scrape(function() {
      this.get('http://' + info.plugin.options.host + '/ticket/' + id + '?format=csv', function(err, data) {
        if (err) {
          info.bot.respond(info, "Sorry, I can't find what you're looking for.");
          return;
        }

        var lines = data.split('\n');
        for (var line, i = 1/* skip header line */, l = lines.length; i < l; i++) {
          // id, summary, reporter, owner, description, type, status, priority, milestone, component, severity, resolution, keywords, cc, loe, verify_trunk, verify_path, verify_pre, verify_live, code_review
          line = this.parseValues(lines[i]);

          info.bot.respond(info, format('%s | %s %s (%s) | http://%s/ticket/%s',
                                       line[1],
                                       line[6],
                                       line[11],
                                       line[8],
                                       info.plugin.options.host,
                                       id));
        }
        skip();
      });
    });
  }
};
