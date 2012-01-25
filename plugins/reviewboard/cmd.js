
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
  rb: function(info) {
    var id = info.rest;
    http.get({
      host: 'rb.tripadvisor.com'
    , path: '/api/review-requests/' + id + '/'
    }, function(res) {
      var buf = [];
      res.on('data', function(d) { buf.push(d); });
      res.on('end', function() {
        buf = buf.join();
        var obj = JSON.parse(buf);
        if (obj.stat && 'ok' === obj.stat) {
          var rr = obj.review_request;
          info.bot.respond(info, format('%s | %s | %s | %s',
                                        rr.summary,
                                        rr.links.submitter && rr.links.submitter.title,
                                        rr.status,
                                        rr.branch));
        }
      });
    }).on('error', function(e) {
      info.bot.respond(info, 'Sorry, unable to process request at this time.');
    });
  }
};
