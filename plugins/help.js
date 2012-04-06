var util = require('util')
  , format = util.format
  , plugin = module.exports = {}
  ;

plugin.showHelp = function showHelp(channel, user) {
  var commands = [];

  this.bot.plugins.forEach(function(plugin){
    if (!plugin.commands) { return; }
    for (cmd in plugin.commands()) {
      commands.push(cmd);
    };
  });

  this.bot.client.say(channel, format('%s, I support: ' + commands.join(' '), user));
}

plugin.parseChannelMessage = function parseChannelMessage(from, to, message) {
  if (/^!help$/.test(message)) {
    this.showHelp(to, from);
  }
}

plugin.load = function load(bot, config) {
  this.config = config;
  this.bot = bot;
  this.bot.client.addListener('message', this.parseChannelMessage.bind(this));
}
