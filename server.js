var http = require('http');
var fs = require('fs');
var server = http.createServer(function (req, res) {
  fs.readFile(__dirname + '/public/' + req.url, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
}).listen(9000);

var BinaryServer = require('binaryjs').BinaryServer,
    fs = require('fs');

// Create a BinaryServer attached to our existing server
var binaryServer = new BinaryServer({server: server, path: '/binary-endpoint'});

var importantStream = null;

binaryServer.on('connection', function(client){
  console.log('Binary Server connection started');

  // var fileWriter = new wav.FileWriter(outFile, {
  //   channels: 1,
  //   sampleRate: 48000,
  //   bitDepth: 16
  // });

  if (importantStream) {
    var feedback = client.createStream(importantStream.meta);
    importantStream.stream.pipe(feedback);
  }

  client.on('stream', function(stream, meta) {

    importantStream = importantStream || {
      stream: stream,
      meta: meta
    };

    // stream.pipe(fileWriter);

    console.log('>>>Incoming audio stream');
    //
    // // broadcast to all other clients
    // for(var id in binaryServer.clients){
    //   if(binaryServer.clients.hasOwnProperty(id)){
    //     var otherClient = binaryServer.clients[id];
    //     if(otherClient != client){
    //       var send = otherClient.createStream(meta);
    //       console.log('streaming to another client')
    //       stream.pipe(send);
    //     } // if (otherClient...
    //   } // if (binaryserver...
    // } // for (var id in ...

    stream.on('end', function() {
      // fileWriter.end();
      console.log('||| Audio stream ended');
    });

  }); //client.on
}); //binaryserver.on





// binaryServer.on('connection', function(client) {
//   console.log('new connection');
//
//   var fileWriter = new wav.FileWriter(outFile, {
//     channels: 1,
//     sampleRate: 48000,
//     bitDepth: 16
//   });
//
//   client.on('stream', function(stream, meta) {
//     console.log('new stream');
//     stream.pipe(fileWriter);
//
//     if (!importantStream) {
//       importantStream = stream;
//     }
//
//     stream.on('end', function() {
//       fileWriter.end();
//       console.log('wrote to file ' + outFile);
//     });
//   });
// });
//
// app.get('/music', function(req, res){
//     res.set({'Content-Type': 'audio/wav'});
//     if (importantStream) {
//       var readStream = fs.createReadStream('demo.wav');
//       readStream.pipe(res);
//       console.log('sending stream');
//     }
// });
