var nopt    = require('nopt')
  , WS      = require('ws').Server
  , wss
  , Emitter = require('events').EventEmitter
  , watchr  = require('watchr')
  , path    = require('path');

var options
  , knownOpts
  , shorthands
  , command
  , fileRegex
  , emitter

  , port
  , dir
  , timeout;

emitter = new Emitter;

fileRegex = /\.(html|erb|css|js)$/i;

knownOpts = { 
  'path' : path
, 'port' : Number
};
shortHands  = { 
  'd' : '--path'
, 'p' : '--port'
};

options = nopt(knownOpts, shorthands, process.argv, 2);

port = options.port || 8080;
dir = options.path || process.cwd();

wss = new WS({ port: port });

watchr.watch({
  path: dir
, listener: function( eventName, filePath, fileCurrentStat, filePreviousStat ){
    if ( !fileRegex.test(filePath) ) return;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      emitter.emit('reload');
    }, 500);
  }
, ignoreHiddenFiles: true
, ignorePatterns: true
});

wss.on('connection', function ( ws ) {
  emitter.once('reload', function () {
    ws.send(JSON.stringify({r: Date.now().toString()}), function (e) {
      if ( !e ) { return }
      console.log(e);
    });
  });
});

console.log('started watching on 127.0.0.1:' + port + ' on ' + dir);