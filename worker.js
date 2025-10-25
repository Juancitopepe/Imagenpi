// --- CÁLCULO DE PI CON CHUDNOVSKY ---
// (usa BigInt y decimales extendidos)

onmessage = async (e) => {
  const digitsCount = e.data;
  const pi = computePi(digitsCount + 2).slice(2); // quitar "3."
  postMessage(pi.split('').slice(0, digitsCount));
};

// Función principal de Chudnovsky (versión simplificada)
function computePi(digits) {
  const Big = bigDecimal;
  const prec = digits + 10;

  const C = Big(426880).multiply(sqrt(Big(10005), prec));
  const M = Big(1);
  let L = Big(13591409);
  let X = Big(1);
  let K = Big(6);
  let S = Big(13591409);

  const big = (n) => Big(n.toString());
  let i = 1;
  while (i < 15) { // más iteraciones = más precisión
    M = M.multiply(big((K.pow(3)).subtract(K.multiply(16)))).divide(big(i).pow(3));
    L = L.add(Big(545140134));
    X = X.multiply(Big(-262537412640768000));
    S = S.add(M.multiply(L).divide(X));
    K = K.add(Big(12));
    i++;
  }

  const pi = C.divide(S, prec);
  return pi.toString();
}

// --- Funciones matemáticas de apoyo ---
function sqrt(value, precision) {
  let x = BigInt(value);
  let y = BigInt((x + 1n) / 2n);
  while (y < x) {
    x = y;
    y = BigInt((x + BigInt(value / x)) / 2n);
  }
  return value;
}
