const socket = io.connect();
let rowsTotal = 0;
let canvases = [];
let currentCanvas = 0;

class Canvas {
  constructor(id) {
    this.el = document.getElementById(id);
    this.xLength = 4000;
    this.yHeight = 10000;
    this.xCoord = 0.5;
    this.yCoord = 0.5;
    this.pSize = 0.5;

    this.el.width = this.xLength;
    this.el.height = this.yHeight;

    this.ctx = this.el.getContext("2d");
    this.ctx.clearRect(0, 0, this.xLength, this.yHeight);
    this.ctx.createImageData(1, 1);

    console.log("Starting canvas ", currentCanvas);
  }

  draw(colour) {
    this.ctx.fillStyle = colour;
    this.ctx.fillRect(this.xCoord, this.yCoord, this.pSize, this.pSize);

    if (this.xCoord + 1 > this.xLength) {
      this.xCoord = 1;

      if (this.yCoord + 1 > this.yHeight * (currentCanvas + 1)) {
        currentCanvas = currentCanvas + 1;
        console.log("Y overflow to canvas ", currentCanvas);
      } else {
        this.yCoord = this.yCoord + this.pSize;
      }
    } else {
      this.xCoord = this.xCoord + 0.5;
    }
  }
}

function getCurrentCanvas() {
  if (!canvases[currentCanvas]) {
    canvases[currentCanvas] = new Canvas(`genome-${currentCanvas + 1}`);
  }

  return canvases[currentCanvas];
}

function interpretMessage(data) {
  const chunk = data.split("");
  let colour = "rgb(0, 0, 0)";

  chunk.forEach((char) => {
    const c = char.toUpperCase();

    switch (true) {
      case c === "T":
        colour = "rgb(255, 0, 0)";
        break;
      case c === "C":
        colour = "rgb(0, 255, 0)";
        break;
      case c === "G":
        colour = "rgb(0, 0, 255)";
        break;
      case c === "A":
        colour = "rgb(255, 0, 255)";
        break;
      case c === "N":
        colour = "rgb(0, 255, 255)";
        break;
      default:
        colour = "rgb(0, 0, 0)";
        break;
    }

    if (colour !== "rgb(0, 0, 0)") {
      const currentCanvas = getCurrentCanvas();
      currentCanvas.draw(colour);
    }
  });
}

function initialise() {
  socket.on("genome data", interpretMessage);
}

window.onload = initialise;
