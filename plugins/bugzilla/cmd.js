
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
      host: 'bugs.tripadvisor.com'
    , path: '/show_bug.cgi?ctype=xml&id=' + bug
    }, function(res) {
      var buf = [];
      res.on('data', function(d) { buf.push(d); });
      res.on('end', function() {
        var parser = new xml2js.Parser('UTF-8', function(result, error) {
          if (error) { console.log(error); return; }
          var bug = result.bug;
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
        });
        buf = buf.join();
        parser.parseString(buf);
      });
    }).on('error', function(e) {
      info.bot.respond(info, 'Sorry, unable to process request at this time.');
    });
  }
};
