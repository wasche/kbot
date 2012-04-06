
var http = require('http')
  , util = require('util')
  , format = util.format
  , plugin = module.exports = {}
  ;

plugin.dingo = function dingo(id, channel) {
  var client = this.bot.client;
  http.get({
    host: this.config.host
  , port: this.config.port
  , path: this.config.path + id
  }, function(res) {
    var buf = [];
    res.on('data', function(d) { buf.push(d); });
    res.on('end', function() {
      var obj;
      buf = buf.join();
      obj = JSON.parse(buf);
      client.say(channel, format('%s | http://go/d%d', obj.name, id));
    });
  }).on('error', function(e) {
    client.say(channel, 'Sorry, unable to process request at this time.');
  });
}

plugin.parseChannelMessage = function parseChannelMessage(from, to, message) {
  if (/!dingo (\d+)/.test(message)) {
    this.dingo(RegExp.$1, to);
  }
}

plugin.commands = function commands() {
  return {
    '!dingo': 'show project summary'
  };
}

plugin.load = function load(bot, config){
  this.config = config;
  this.bot = bot;
  this.bot.client.addListener('message', this.parseChannelMessage.bind(this));
}
