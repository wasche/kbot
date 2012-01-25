#!/usr/bin/env node

var bot = require('ircbot')
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
kbot.loadPlugin('reviewboard');
