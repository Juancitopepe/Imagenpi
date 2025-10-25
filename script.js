// --- CONFIGURACIÓN ---
const WIDTH = 1000;
const HEIGHT = 1000;
const PIXELS = WIDTH * HEIGHT;
const ANIMATION_TIME = 5000; // 5 segundos para pintar
const PAUSE_TIME = 2000; // 2 segundos entre imágenes

// Colores según dígitos
const colorMap = {
  '0': '#ff0000',
  '1': '#00ff00',
  '2': '#0000ff',
  '3': '#100000',
  '4': '#001000',
  '5': '#000010',
  '6': '#050000',
  '7': '#000500',
  '8': '#000005',
  '9': '#000000'
};

const canvas = document.getElementById("piCanvas");
const ctx = canvas.getContext("2d");
const contador = document.getElementById("contador");

// --- CÁLCULO DE PI EN SEGUNDO PLANO ---
let worker = new Worker("worker.js");
let totalDigits = 0;
let nextBlock = null;

worker.onmessage = (e) => {
  nextBlock = e.data;
};

// --- FUNCIÓN PRINCIPAL ---
async function start() {
  worker.postMessage(PIXELS); // pedir el primer bloque

  while (true) {
    // Esperar el bloque si todavía no está listo
    while (nextBlock === null) await new Promise(r => setTimeout(r, 100));

    const digits = nextBlock;
    nextBlock = null;

    // Pedir el siguiente bloque mientras se muestra este
    worker.postMessage(PIXELS);

    totalDigits += digits.length;
    contador.textContent = `Dígitos: ${totalDigits.toLocaleString()}`;

    await animateDigits(digits);
    await pause(PAUSE_TIME);
  }
}

// --- ANIMACIÓN DE DIBUJO ---
async function animateDigits(digits) {
  const imgData = ctx.createImageData(WIDTH, HEIGHT);
  const step = Math.ceil(digits.length / (ANIMATION_TIME / 16)); // cada frame pinta una parte

  for (let i = 0; i < digits.length; i += step) {
    for (let j = 0; j < step && i + j < digits.length; j++) {
      const d = digits[i + j];
      const color = hexToRgb(colorMap[d]);
      const idx = (i + j) * 4;
      imgData.data[idx] = color.r;
      imgData.data[idx + 1] = color.g;
      imgData.data[idx + 2] = color.b;
      imgData.data[idx + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
    await new Promise(r => requestAnimationFrame(r));
  }
}

// --- FUNCIONES AUXILIARES ---
function hexToRgb(hex) {
  const val = parseInt(hex.replace("#", ""), 16);
  return {
    r: (val >> 16) & 255,
    g: (val >> 8) & 255,
    b: val & 255
  };
}

function pause(ms) {
  return new Promise(r => setTimeout(r, ms));
}

start();
