
var http = require('http')
  , util = require('util')
  , format = util.format
  , csv = require('csv')
  , plugin = module.exports = {}
  ;

plugin.trac = function trac(id, channel) {
  var config = this.config
    , client = this.bot.client
    ;
  http.get({
    host: this.config.host
  , path: '/ticket/' + id + '?format=csv'
  }, function(res) {
    var buf = [];
    res.on('data', function(d) { buf.push(d); });
    res.on('end', function() {
      var lines = [];
      csv()
        .from(buf.join(), {columns: true})
        .on('data', function(data, index){
          lines.push(data);
        })
        .on('end', function(count){
          var ticket = lines[0];
          // id, summary, reporter, owner, description, type, status, priority, milestone,
          // component,
          // severity, resolution, keywords, cc, loe, verify_trunk, verify_path, verify_pre,
          // verify_live, code_review
          client.say(channel, format('%s | %s %s (%s) | http://%s/ticket/%s',
                                       ticket.summary,
                                       ticket.status,
                                       ticket.resolution,
                                       ticket.milestone,
                                       config.host,
                                       id));
      })
      .on('error', function(error){
        client.say(channel, "Sorry, I can't find what you're looking for.");
      });
    });
  }).on('error', function(e) {
    client.say(channel, 'Sorry, unable to process request at this time.');
  });
}

plugin.parseChannelMessage = function parseChannelMessage(from, to, message) {
  if (/!trac (\d+)/.test(message)) {
    this.trac(RegExp.$1, to);
  }
}

plugin.commands = function commands() {
  return {
    '!trac': 'show summary of trac ticket'
  };
}

plugin.load = function load(bot, config){
  this.config = config;
  this.bot = bot;
  this.bot.client.addListener('message', this.parseChannelMessage.bind(this));
}
