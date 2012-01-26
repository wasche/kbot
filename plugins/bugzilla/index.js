var commands = require('./cmd');

function parseLine(from, to, msg) {
  if (msg[0] === '!' && msg.length > 1) {
    var sp = msg.split(' ', 2)
      , info = {
          from: from
        , to: to
        , msg: msg
        , cmdstr: sp[0].substr(1)
        , rest: sp[1]
        , bot: plugin.bot
        , plugin: plugin
        }
      ;

    commands.run(info);
  }
}

var plugin = module.exports = {
  listeners: {
    message: parseLine
  }
, reload: ['./cmd'].map(require.resolve)
};
