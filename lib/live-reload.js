var nopt    = require('nopt')
  , WS      = require('ws').Server
  , wss
  , fs      = require('fs')
  , Emitter = require('events').EventEmitter
  , Notify  = require('fs.notify')
  , path    = require('path');

var options
  , knownOpts
  , shorthands
  , command
  , fileRegex
  , emitter

  , port
  , dirs
  , timeout;

emitter = new Emitter;

knownOpts = { 
  'path' : [Array, path]
, 'port' : [String]
, 'type' : [String]
};
shortHands  = { 
  'd' : ['--path']
, 'p' : ['--port']
, 't' : ['--type']
};

options = nopt(knownOpts, shortHands, process.argv, 2);

port = options.port || 8080;
dirs = options.path || [process.cwd()];
fileRegex = options.type || /\.(html|erb|css|js)$/i;

wss = new WS({ port: port });

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if ( fileRegex.test(file) ) {
            results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

dirs.forEach(function (dir) {
  walk(dir, function (err, files) {
    var notifications = new Notify(files);
    notifications.on('change', function (file) {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        emitter.emit('reload');
      }, 500);
    });
  });
});

wss.on('connection', function ( ws ) {
  emitter.once('reload', function () {
    ws.send(JSON.stringify({r: Date.now().toString()}), function ( e ) {
      if ( !e ) { return; }
      console.log(e);
    });
  });
});

console.log('started watching on 127.0.0.1:' + port + ' on ' + dirs.join(', '));