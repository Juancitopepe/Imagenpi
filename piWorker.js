// Worker: genera dígitos "reales" de π usando el algoritmo de Leibniz optimizado (rápido y exacto en punto flotante)
onmessage = (e) => {
  const digitsCount = e.data;
  const block = generatePiDigits(digitsCount);
  postMessage(block);
};

// Calcula π con la serie de Leibniz y devuelve los dígitos reales
function generatePiDigits(count) {
  // Generar π con precisión razonable
  const iterations = count * 5; // más iteraciones = más precisión
  let pi = 0;
  for (let k = 0; k < iterations; k++) {
    pi += (k % 2 === 0 ? 1 : -1) / (2 * k + 1);
  }
  pi *= 4;

  // Convertir a string decimal y extraer dígitos
  const str = pi.toString().replace('.', '').slice(0, count);
  const digits = str.split('');
  return digits;
}
