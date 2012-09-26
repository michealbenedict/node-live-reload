## Node Browser Reloader

A quick nodejs + socket powered browser reloader for all your frontend dev needs.

### Usage

1. Install via npm `npm install -g nbr` (Make sure to install it globally)
2. Add the following js to your project

````html
<!-- Make sure to remove this in production -->
<!-- include it above the </body> tag -->
<script src='http://code.jquery.com/jquery-1.8.2.min.js'></script>
<script src='https://raw.github.com/flowersinthesand/jquery-socket/master/jquery.socket.js'></script>
<script>
$(function() {
  $.socket.defaults.transports = ["ws"];
  $.socket("ws://127.0.0.1:8080", {
    prepare: function( connect ) {
      connect()
    }
  , inbound: function(data) {
      if (data === "h") {
          return {type: "heartbeat"};
      }
      data = JSON.parse(data);
      if ( data.r ) {
        $.socket.finalize();
        location.reload();
      }
      return data;
    }
  })
});
</script>

````

3. Run `nbr` from your project directory to start watching for files

#### Options

````
$ nbr --port 9000 --path /some/other/path/to/watch
````