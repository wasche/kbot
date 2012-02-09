
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
  help: function(info) {
    if (info.rest){
      for (pl in info.bot.plugins) {
        if (info.bot.plugins[pl].commands && info.bot.plugins[pl].commands[info.rest]) {
          var desc = info.bot.plugins[pl].commands[info.rest];
          if (desc instanceof Array) {
            for (var i = 0, l = desc.length; i < l; i++) {
              info.bot.respond(info, format('%s: %s', info.from, desc[i]));
            }
          } else {
            info.bot.respond(info, format('%s: %s', info.from, desc));
          }
        }
      }
    } else {
      var commands = [];

      // go through each plugin and ask for its list of commands
      for (pl in info.bot.plugins) {
        if (info.bot.plugins[pl].commands) {
          for (cmd in info.bot.plugins[pl].commands) {
            commands.push(cmd);
          }
        }
      }

      if (commands.length) {
        info.bot.respond(info, format('%s: %s', info.from, commands.join(' ')));
      }
    }
  }
};
