const fs = require("fs");
const Jimp = require("jimp");

const totalFiles = 24;
const getFile = (index) => `Homo_sapiens.GRCh38.dna.chromosome.${index}.fa`;
const imageWidth = 7016;
const imageHeight = 9933;

let partIndex = 1;
let fileIndex = 1;

const allowedChars = ["T", "C", "G", "A", "N"];

function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return Number(`0x${f(0)}${f(8)}${f(4)}ff`);
}

function getColorFromChar(char) {
  const c = char.toUpperCase();
  const hue = 360 / totalFiles;

  switch (c) {
    case "T":
      return hslToHex(hue * fileIndex, 75, 30);
    case "C":
      return hslToHex(hue * fileIndex, 75, 45);
    case "G":
      return hslToHex(hue * fileIndex, 75, 60);
    case "A":
      return hslToHex(hue * fileIndex, 75, 75);
    default:
      return 0x000000ff;
  }
}

let imageBuffer = [];
let x = 0;
let y = 0;

function writeFile(buffer, isFinal = false) {
  new Jimp(buffer[0].length, buffer.length, (err, image) => {
    if (err) return err;
    buffer.forEach((row, y) => {
      row.forEach((color, x) => {
        image.setPixelColor(color, x, y);
      });
    });

    image.write(`output/chr${fileIndex}-part${partIndex}.png`, (err) => {
      if (err) return err;
      console.log("written file ", partIndex);

      if (isFinal) {
        if (fileIndex < totalFiles) {
          fileIndex = fileIndex + 1;
          partIndex = 1;
          imageBuffer = [];
          x = 0;
          y = 0;
          loadFile(getFile(fileIndex));
        } else {
          console.log("all done");
        }
      } else {
        partIndex = partIndex + 1;
      }
    });
  });
}

function handleData(chunk) {
  const rawData = chunk.toString("ascii").split("");
  const data = rawData.filter((d) => allowedChars.includes(d));

  data.forEach((c) => {
    if (x >= imageWidth) {
      y = y + 1;
      x = 0;
    }

    if (!imageBuffer[y]) {
      if (y >= imageHeight) {
        console.log("write file");
        writeFile([...imageBuffer]);
        imageBuffer = [];
        x = 0;
        y = 0;
      }
      imageBuffer[y] = [];
    }

    imageBuffer[y].push(getColorFromChar(c));

    x = x + 1;
  });
  console.log(
    `chr${fileIndex}-prt${partIndex}: ${Math.round(
      (y / imageHeight) * 100
    )}% done`
  );
}

function loadFile(fileName) {
  const readableStream = fs.createReadStream(fileName);

  console.log("reading file number ", fileName);

  readableStream.on("data", (chunk) => {
    readableStream.pause();
    handleData(chunk);
    readableStream.resume();
  });

  readableStream.on("close", () => {
    console.log("final write");
    writeFile([...imageBuffer], true);
  });
}

loadFile(getFile(fileIndex));
