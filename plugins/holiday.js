
var http = require('http')
  , util = require('util')
  , format = util.format
  , plugin = module.exports = {}
  ;

plugin.rb = function rb(channel) {
  var client = this.bot.client;
  http.get({
    host: this.config.host
  , port: this.config.port
  , path: this.config.path
  }, function(res) {
    var buf = [];
    res.on('data', function(d) { buf.push(d); });
    res.on('end', function() {
      var obj = JSON.parse(buf.join())
        , today = new Date()
        , holiday
        , days
        ;

      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);

      // select events in the future
      obj.events = obj.events.filter(function(e, i, arr){
        return e.start >= today.getTime();
      });
      // only show the next one
      holiday = obj.events.shift();
      holiday.start = new Date(holiday.start);
      days = ((holiday.start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)).toFixed();
      client.say(channel, format('There are %s days until %s on %s',
                                    days,
                                    holiday.summary,
                                    holiday.start.toDateString())
                      );
    });
  }).on('error', function(e) {
    client.say(channel, 'Sorry, unable to process request at this time.');
  });
}

plugin.parseChannelMessage = function parseChannelMessage(from, to, message) {
  if (/!holiday/.test(message)) {
    this.rb(to);
  }
}

plugin.commands = function commands() {
  return {
    '!holiday': 'show days until next holiday'
  };
}

plugin.load = function load(bot, config){
  this.config = config;
  this.bot = bot;
  this.bot.client.addListener('message', this.parseChannelMessage.bind(this));
}
