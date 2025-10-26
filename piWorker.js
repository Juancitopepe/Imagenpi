// Worker: calcula dígitos reales de π con el algoritmo Chudnovsky usando Decimal.js

self.importScripts("decimal.min.js");

const { Decimal } = self.Decimal || self; // compatibilidad

Decimal.set({ precision: 1050000 });

function calcPi(nDigits) {
  const C = new Decimal(426880).times(new Decimal(10005).sqrt());
  let M = new Decimal(1);
  let L = new Decimal(13591409);
  let X = new Decimal(1);
  let K = new Decimal(6);
  let S = new Decimal(13591409);

  for (let i = 1; i < 20; i++) { // 20 iteraciones ≈ 1M dígitos visibles
    M = M.times((K.pow(3).minus(16 * K)).dividedBy((i ** 3)));
    L = L.plus(545140134);
    X = X.times(-262537412640768000);
    S = S.plus(M.times(L).dividedBy(X));
    K = K.plus(12);
  }

  const pi = C.dividedBy(S);
  return pi.toString().replace(".", "").slice(0, nDigits);
}

self.onmessage = (e) => {
  if (e.data === "start" || e.data === "next") {
    const digits = calcPi(1000000); // 1 millón
    postMessage(digits);
  }
};
