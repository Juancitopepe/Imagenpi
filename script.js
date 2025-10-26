// Espera asíncrona
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const info = document.getElementById("info");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const size = 1000;
const totalPixels = size * size;

const colors = {
  0: "#ff0000",
  1: "#00ff00",
  2: "#0000ff",
  3: "#100000",
  4: "#001000",
  5: "#000010",
  6: "#050000",
  7: "#000500",
  8: "#000005",
  9: "#000000"
};

const worker = new Worker("piWorker.js");
let digitsBuffer = "";
let totalDigits = 0;

worker.onmessage = async (e) => {
  digitsBuffer = e.data;
  totalDigits += digitsBuffer.length;
  await animateDigits(digitsBuffer);
  await sleep(2000); // pausa 2s
  worker.postMessage("next");
};

async function animateDigits(digits) {
  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;
  const pixelsPerFrame = totalPixels / (5 * 60); // 5s ~60fps

  for (let i = 0; i < digits.length; i++) {
    const color = colors[digits[i]];
    const pixelIndex = i * 4;
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);

    data[pixelIndex] = r;
    data[pixelIndex + 1] = g;
    data[pixelIndex + 2] = b;
    data[pixelIndex + 3] = 255;

    if (i % pixelsPerFrame === 0) {
      ctx.putImageData(imgData, 0, 0);
      await sleep(1000 / 60);
      info.textContent = `Dígitos: ${totalDigits - digits.length + i}`;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  info.textContent = `Dígitos: ${totalDigits}`;
}

worker.postMessage("start");
