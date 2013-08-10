
var http = require('http')
, util = require('util')
, format = util.format
, plugin = module.exports = {}
;

plugin.git = function git(project_name, merge_request_id, channel) {
    var config = this.config;
    var client = this.bot.client;
    var parent = this;

    http.get({host: this.config.host, path: '/api/v3/projects?private_token=' + this.config.token},
             function(res) {
                 var buf = [];
                 res.on('data', function(d) { buf.push(d); });
                 res.on('end', function() {
                     var obj, rr;
                     buf = buf.join();
                     obj = JSON.parse(buf);
                     if (obj.length != 0) {
                         var length = obj.length;
                         for (var i = 0; i < length; ++i) {
                             if (obj[i]["name"] == project_name) {
                                 parent.displayDetails(obj[i]["id"], merge_request_id, obj[i]["web_url"], channel);
                                 return;
                             }
                         }
                     } else {
                         client.say(channel, 'Sorry, I can\'t find what you\'re looking for.');
                     }
                 }).on('error', function(e) {
                     client.say(channel, 'Sorry, unable to process request at this time.');
                 });
             });
}

plugin.displayDetails = function displayDetails(project_id, merge_request_id, web_url, channel) {
    var config = this.config;
    var client = this.bot.client;
    http.get({host: this.config.host, path: format('/api/v3/projects/%d/merge_request/%d?private_token=%s', project_id, merge_request_id, this.config.token)},
             function(res) {
                 var buf = [];
                 res.on('data', function(d) { buf.push(d); });
                 res.on('end', function() {
                     var obj, rr;
                     buf = buf.join();
                     obj = JSON.parse(buf);
                     client.say(channel, format('%s | %s -> %s | %s -> %s | %s/merge_requests/%d',
                                                obj.title,
                                                obj.source_branch,
                                                obj.target_branch,
                                                obj.author.name,
                                                obj.assignee.name,
                                                web_url,
                                                merge_request_id));
                 }).on('error', function(e) {
                     client.say(channel, 'Sorry, unable to process request at this time.');
                 });
             });
}

plugin.parseChannelMessage = function parseChannelMessage(from, to, message) {
    if (/!git ([^\s]+) (\d+)/.test(message)) {
        this.git(RegExp.$1, RegExp.$2, to);
    }
}

plugin.commands = function commands() {
    return {
        '!git': 'show summary of gitlab merge requests'
    };
}

plugin.load = function load(bot, config){
    this.config = config;
    this.bot = bot;
    this.bot.client.addListener('message', this.parseChannelMessage.bind(this));
}
