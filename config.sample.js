
exports.userGid = 'node';

exports.userUid = 'node';

exports.host = 'irc.example.com';

exports.port = 6667;

exports.secure = false;

exports.name = 'kbot';

exports.channels = [];

exports.plugins = {
  admin: {
    nick: ['admin']
  }
, json: {
    host: 'http://example.com'
  , cmd: {
      path: '/obj/$1'
    , text: '${id} name is ${name}'
    }
  }
};
