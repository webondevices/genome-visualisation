var socket = io.connect();

var xLength = 2560;
var yHeight = 10000;
var xCoord = 1;
var yCoord = 1;

var c = document.getElementById('genome');
c.width = xLength;
c.height = yHeight;
var ctx = c.getContext('2d');
ctx.clearRect(0, 0, xLength, yHeight);
var px = ctx.createImageData(1, 1);

function interpretMessage (data) {
    var chunk = data.split('');
    var colour = 'rgb(0, 0, 0)';

    chunk.forEach(function(char){
        switch (true) {
            case (char === 'T' || char === 't'):
                colour = 'rgb(255, 0, 0)';
                break;
            case (char === 'C' || char === 'c'):
                colour = 'rgb(0, 255, 0)';
                break;
            case (char === 'G' || char === 'g'):
                colour = 'rgb(0, 0, 255)';
                break;
            case (char === 'A' || char === 'a'):
                colour = 'rgb(255, 0, 255)';
                break;
            case (char === 'N' || char === 'n'):
                colour = 'rgb(0, 0, 0)';
                break;
            default:
                console.log(char);
                colour = 'rgb(0, 0, 0)';
                break;
        }

        if (colour !== 'rgb(0, 0, 0)') {

            ctx.fillStyle = colour;
            ctx.fillRect(xCoord, yCoord, 1, 1);
        
            if (xCoord + 1 > xLength) {
                xCoord = 1;
                
                if (yCoord + 1 > yHeight) {
                    yCoord = 1;
                } else {
                    yCoord = yCoord + 1;
                }
            } else {
                xCoord = xCoord + 1;
            }
        }
    });
}

function initialise () {
    socket.on('genome data', interpretMessage);
}

window.onload = initialise;

console.log('starting up...');