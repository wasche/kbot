#!/usr/bin/env node

var bot = require('ircbot')
  , kbot
  , r
  ;

process.on('uncaughtException', function(err) {
  console.log('Uncaught Exception: ' + err);
});

kbot = new bot('irc.tripadvisor.com', 'nbot', {
  port: 6667
, userName: 'nbot'
, realName: 'nbot'
, debug: true
, secure: false
, channels: ['#testing']
});

//kbot.loadPlugin('admin', {nick: ['wasche']});
kbot.loadPlugin('bugzilla');
kbot.loadPlugin('reviewboard');
