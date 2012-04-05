
exports.userGid = 'node';

exports.userUid = 'node';

exports.host = 'irc.example.com';

exports.port = 6667;

exports.nick = 'kbot';

exports.channels = ['#test'];

// plugins

exports.plugins = {
  bugzilla: {
    host: 'bugs.example.com'
  }
, reviewboard: {
    host: 'reviewboard.example.com'
  }
, trac: {
    host: 'trac.example.com'
  }
, holiday: {
    host: 'example.com'
  , port: 80
  , path: '/holidays.ics'
  }
};
