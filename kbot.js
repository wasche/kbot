#!/usr/bin/env node

var bot = require('ircbot')
  , repl = require('repl')
  , daemon = require('daemon')
  , kbot
  , r
  ;

process.on('uncaughtException', function(err) {
  console.log('Uncaught Exception: ' + err);
});

kbot = new bot('irc.tripadvisor.com', 'kbot', {
  port: 6667
, userName: 'kbot'
, realName: 'kbot'
, debug: true
, secure: false
, channels: ['#social']
});

//kbot.loadPlugin('admin', {nick: ['wasche']});
kbot.loadPlugin('bugzilla');

daemon.daemonize('daemon.log', '/tmp/kbot.pid', function(err, pid) {
  if (err) { return console.log('Error starting daemon: ' + err); }
  console.log('Daemon started with pid: ' + pid);
});
