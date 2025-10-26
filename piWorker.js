importScripts('decimal.min.js');

onmessage=e=>{
  const n=e.data;
  const digits=calcPi(n);
  postMessage(digits);
};

// Algoritmo de Chudnovsky simplificado con decimal.js
function calcPi(count){
  const Decimal=self.Decimal;
  Decimal.set({precision:count/2+20});
  let M=new Decimal(1);
  let L=new Decimal(13591409);
  let X=new Decimal(1);
  let K=new Decimal(6);
  let S=new Decimal(13591409);
  const C=new Decimal(426880).times(Decimal.sqrt(new Decimal(10005)));

  for(let i=1;i<8;i++){ // 8 términos = miles de dígitos
    M=M.times(K.pow(3).minus(K.times(16))).dividedBy(new Decimal(i).pow(3));
    L=L.plus(545140134);
    X=X.times(-262537412640768000);
    S=S.plus(M.times(L).dividedBy(X));
    K=K.plus(12);
  }
  const pi=C.dividedBy(S).toString();
  const clean=pi.replace('.','').slice(0,count);
  return clean.split('');
}
