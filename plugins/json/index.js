var http = require('http')
  , util = require('util')
  , format = util.format
  ;

function parseLine(from, to, msg) {
  if (msg[0] === '!' && msg.length > 1) {
    var sp = msg.split(' ')
      , cmdstr = sp[0].substr(1)
      , args = sp.slice(1)
      , bot = plugin.bot
      , ops = plugin.options[cmdstr]
      , info = {
          from: from
        , to: to
      }
      , uri
      , n
      ;

    if (ops) {
      // replace $N with args[N]
      uri = ops.path;
      while (uri.test(/\$(\d+)/)) {
        n = parseInt(RegExp.$1);
        uri = RegExp.leftContext + (args[n] || '') + RegExp.rightContext;
      }
      http.get({
        host: plugin.options.host
      , path: uri
      }, function(res) {
        var buf = [];
        res.on('data', function(d) { buf.push(d); });
        res.on('end', function() {
          var obj = JSON.parse(buf.join())
            , str = ops.text
            ;
          // replace ${key} with obj[key]
          while (str.text/\$\{([_\w\d]+)\}/) {
            str = RegExp.leftContext + (obj[RegExp.$1] || '') + RegExp.rightContext;
          }
          bot.respond(info, str);
        });
      }).on('error', function(e) {
        bot.respond(info, 'Sorry, unable to process request at this time.');
      });
    }
  }
}

var plugin = module.exports = {
  listeners: {
    message: parseLine
  }
, commands: {
//      '!rb': '!rb NNN - show information about ReviewBoard review # NNN'
  }
};
