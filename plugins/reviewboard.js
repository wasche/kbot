
var http = require('http')
  , util = require('util')
  , format = util.format
  , plugin = module.exports = {}
  ;

plugin.rb = function rb(id, channel) {
  http.get({
    host: this.config.host
  , path: '/api/review-requests/' + id + '/'
  }, function(res) {
    var buf = [];
    res.on('data', function(d) { buf.push(d); });
    res.on('end', function() {
      var obj, rr;
      buf = buf.join();
      obj = JSON.parse(buf);
      if (obj.stat && 'ok' === obj.stat) {
        rr = obj.review_request;
        this.client.say(channel, format('%s | %s | %s | %s | http://%s/r/%s/',
                                      rr.summary,
                                      rr.links.submitter && rr.links.submitter.title,
                                      rr.status,
                                      rr.branch || 'no branch',
                                      this.config.host,
                                      id));
      } else {
        this.client.say(channel, 'Sorry, I can\'t find what you\'re looking for.');
      }
    });
  }).on('error', function(e) {
    this.client.say(channel, 'Sorry, unable to process request at this time.');
  });
}

plugin.parseChannelMessage = function parseChannelMessage(from, to, message) {
  if (/!rb (\d+)/.test(message)) {
    this.rb(RegExp.$1, to);
  }
}

plugin.load = {
  load: function load(client, config){
    this.config = config;
    this.client = client;
    client.addListener('message', this.parseChannelMessage);
  }
}
