var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var connected = false;

server.listen(8080, function () {
    console.log('Express server listening on port 8080');
});

// Respond to web GET requests with index.html page
app.get('/', function (request, response) {
    response.sendFile(__dirname + '/index.html');
});

// Define route folder for static requests
app.use(express.static(__dirname + '/'));

io.on('connection', function (socket) {
    var stats = fs.statSync('hg38.fa');
    var fileSizeInBytes = stats.size;        

    if (!connected) {
        var readableStream = fs.createReadStream('hg38.fa');

        console.log(fileSizeInBytes);

        connected = true;

        readableStream.on('data', function(chunk) {
            // console.log(readableStream.bytesRead / fileSizeInBytes * 100 + '%');
            io.sockets.emit('genome data', chunk.toString('ascii'));
        });
        
        readableStream.on('close', function(chunk) {
            console.log('Completed');
            io.close();
        });
    }
});