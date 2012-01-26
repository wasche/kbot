
var xml2js = require('xml2js-expat')
  , https = require('https')
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
  bug: function(info) {
    var bug = info.rest;
    https.get({
      host: info.plugin.options.host
    , path: '/show_bug.cgi?ctype=xml&id=' + bug
    }, function(res) {
      var buf = [];
      res.on('data', function(d) { buf.push(d); });
      res.on('end', function() {
        var parser = new xml2js.Parser('UTF-8', function(result, error) {
          if (error) { console.log(error); return; }
          var bug = result.bug;
          if (bug['@'] && bug['@'].error) {
            info.bot.respond(info, format("I'm sorry, bug %s seems to have scampered off.", bug.bug_id));
          }
          else {
            info.bot.respond(info, format('%s | %s -> %s | %s (%s) | %s%s%s',
                                          bug.short_desc,
                                          bug.reporter['#'],
                                          bug.assigned_to['#'],
                                          bug.bug_status,
                                          bug.priority,
                                          result['@'].urlbase,
                                          'show_bug.cgi?id=',
                                          bug.bug_id
                                         ));
          }
        });
        buf = buf.join();
        parser.parseString(buf);
      });
    }).on('error', function(e) {
      info.bot.respond(info, 'Sorry, unable to process request at this time.');
    });
  }
};
