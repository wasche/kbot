#!/usr/bin/env node

var irc = require('irc')
  , fs = require('fs')
  , path = require('path')
  , config = require('./config')
  , kbot = {}
  , client
  ;

process.setgid(config.userGid || 'node');
process.setuid(config.userUid || 'node');

config.host     = config.host || 'irc.example.com';
config.port     = config.port || 6667;
config.nick     = config.nick || 'kbot';
config.channels = config.channels || [];

client = new irc.Client(config.host, config.nick, { channels: config.channels });

process.on('uncaughtException', function(err) {
  console.log('Uncaught Exception: ' + err);
});

fs.readdir(path.join(__dirname, 'plugins'), function(err, files){
  if (err) {
    console.log(err);
    return;
  }

  kbot.client = client;
  kbot.plugins = [];

  files.forEach(function(file){
    if (!/\.js$/.test(file)) { return; }
    var plugin = require(path.join(__dirname, 'plugins', file));
    kbot.plugins.push(plugin);
    plugin.load(kbot, config.plugins[path.basename(file, '.js')]);
  });
});
