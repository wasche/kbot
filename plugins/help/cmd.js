
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
    var commands = [];

    // go through each plugin and ask for its list of commands
    for (pl in info.bot.plugins) {
      if (info.bot.plugins[pl].commands) {
        for (cmd in info.bot.plugins[pl].commands) {
          commands.push(info.bot.plugins[pl].commands[cmd]);
        }
      }
    }

    if (commands.length) {
      info.bot.respond(info, format('%s: %s', info.from, commands.join(' ')));
    }
  }
};
