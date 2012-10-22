## Node Live Reload 0.3

A quick nodejs + socket powered browser reloader for all your frontend dev needs.

### Usage

1. Install via npm `npm install -g node-live-reload` (Make sure to install it globally)
2. Add the following js to your project

````html
<!-- Make sure to remove this in production -->
<!-- include it above the </body> tag -->
<script>
var ws;
function socket() {
  ws = new WebSocket("ws://127.0.0.1:8080");
  ws.onmessage = function ( e ) {
    var data = JSON.parse(e.data);
    if ( data.r ) {
      location.reload();
    }
  };
}
setInterval(function () {
  if ( ws ) {
    if ( ws.readyState !== 1 ) {
      socket();
    }
  } else {
    socket();
  }
}, 1000);
</script>

````

3. Run `node-live-reload` from your project directory to start watching for files in 
the directory it is being run from

#### Options

````
$ node-live-reload --port 9000 --path /some/other/path/to/watch
$ node-live-reload -p 9000 -d /some/other/path/to/watch
````

#### Watch Multiple paths

````
$ node-live-reload -d /some/other/path/to/watch -d /some/other/path/to/watch2
````