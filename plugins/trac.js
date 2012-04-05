
var http = require('http')
  , util = require('util')
  , format = util.format
  , csv = require('csv')
  , plugin = module.exports = {}
  ;

plugin.trac = function trac(id, channel) {
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
          this.client.say(channel, format('%s | %s %s (%s) | http://%s/ticket/%s',
                                       ticket.summary,
                                       ticket.status,
                                       ticket.resolution,
                                       ticket.milestone,
                                       this.config.host,
                                       id));
      })
      .on('error', function(error){
        this.client.say(channel, "Sorry, I can't find what you're looking for.");
      });
    });
  }).on('error', function(e) {
    this.client.say(channel, 'Sorry, unable to process request at this time.');
  });
}

plugin.parseChannelMessage = function parseChannelMessage(from, to, message) {
  if (/!trac (\d+)/.test(message)) {
    this.trac(RegExp.$1, to);
  }
}

plugin.load = {
  load: function load(client, config){
    this.config = config;
    this.client = client;
    client.addListener('message', this.parseChannelMessage);
  }
}
