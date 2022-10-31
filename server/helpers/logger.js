/* jslint node: true */
'use strict';
let tempServer;

exports.init = function (server) {
  if (tempServer) {
    return;
  }

  tempServer = server;
};

exports.log = function (level, data, channel) {
  // inject Level logger if when api send logger with channel in 3rd params 
  let Level = level
  if(Array.isArray(Level) && channel){
    if(channel.toLowerCase() == 'lite'){
      Level = Level.concat(channel.toUpperCase())
    }
  }
  tempServer.log(Level, data);
};

[
  'info',
  'error',
  'warn',
  'verbose',
  'debug',
  'profile',
  'fatal'
].forEach(function (level) {
  exports[level] = function (message) {
    this.log(level, message);
  };
});
