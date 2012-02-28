var http = require('http')
  , util = require('util')
  , format = util.format
  ;

function parseLine(from, to, msg) {
  if (msg[0] === '!' && msg.length > 1) {
    var args = msg.split(' ')
      , cmdstr = args[0].substr(1)
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
      while (/\$(\d+)/.test(uri)) {
        n = parseInt(RegExp.$1);
        uri = RegExp.leftContext + (args[n] || '') + RegExp.rightContext;
      }
      console.log(plugin.options.host + ':' + plugin.options.port + uri);
      http.get({
        host: plugin.options.host
      , port: plugin.options.port || 80
      , path: uri
      }, function(res) {
        var buf = [];
        res.on('data', function(d) { buf.push(d); });
        res.on('end', function() {
          var obj = JSON.parse(buf.join())
            , str = ops.text
            ;
          // replace ${key} with obj[key]
          while (/\$\{([_\w\d]+)\}/.test(str)) {
            str = RegExp.leftContext + (obj[RegExp.$1] || '') + RegExp.rightContext;
          }
          bot.respond(info, str);
        });
      }).on('error', function(e) {
        console.log(e);
        bot.respond(info, 'Sorry, unable to process request at this time.');
      });
    }
  }
}

var plugin = module.exports = {
  listeners: {
    message: parseLine
  }
};

Object.defineProperty(plugin, 'commands', {
  enumberable: true
, get: function() {
    var ret = {};
    for (prop in plugin.options) {
      if ('host' === prop || 'port' === prop) { continue; }
      ret['!' + prop] = '!' + prop + ' ' + plugin.options[prop].description;
    }
    return ret;
  }
});
