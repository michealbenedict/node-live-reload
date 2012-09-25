var nopt    = require('nopt')
  , WS      = require('ws').Server
  , wss     = new WS({port: 8080})
  , Emitter = require('events').EventEmitter
  , watchr  = require('watchr')
  , path    = require('path');

var options
  , knownOpts
  , shorthands
  , command
  , fileRegex
  , emitter;

emitter = new Emitter;

fileRegex = /\.(html|erb|css|js)$/i;

knownOpts = { 
  'path' : path
, 'port' : [Number, 8080]
};
shortHands  = { 
  'd' : ['--path']
, 'p' : ['--port']
};

process.title = 'node-browser-reloader';

options = nopt(knownOpts, shorthands, process.argv, 2);

command = options.argv.remain && options.argv.remain.shift();

watchr.watch({
  path: options.path || process.cwd()
, listener: function( eventName, filePath, fileCurrentStat, filePreviousStat ){
    if ( !fileRegex.test(filePath) ) return;
    emitter.emit('reload');
  }
, ignoreHiddenFiles: true
, ignorePatterns: true
});

wss.on('connection', function ( ws ) {
  try {
    emitter.once('reload', function () {
      ws.send('r');
    });
  }
  catch (e) {
    console.log(e);
  }
});

console.log('started watching on 127.0.0.1:8080');