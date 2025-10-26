const WIDTH = 1000, HEIGHT = 1000, PIXELS = WIDTH * HEIGHT;
const ANIMATION_TIME = 5000, PAUSE_TIME = 2000;

const colorMap = {
  '0':'#ff0000','1':'#00ff00','2':'#0000ff','3':'#100000','4':'#001000',
  '5':'#000010','6':'#050000','7':'#000500','8':'#000005','9':'#000000'
};

const canvas=document.getElementById("piCanvas");
const ctx=canvas.getContext("2d");
const contador=document.getElementById("contador");

let worker=new Worker("piWorker.js");
let total=0, next=null;
worker.onmessage=e=>next=e.data;

(async function run(){
  worker.postMessage(PIXELS);
  while(true){
    while(!next) await sleep(100);
    const digits=next; next=null;
    worker.postMessage(PIXELS);
    total+=digits.length;
    contador.textContent=`Dígitos: ${total.toLocaleString()}`;
    await draw(digits);
    await sleep(PAUSE_TIME);
  }
})();

async function draw(digits){
  const img=ctx.createImageData(WIDTH,HEIGHT);
  const step=Math.ceil(digits.length/(ANIMATION_TIME/16));
  for(let i=0;i<digits.length;i+=step){
    for(let j=0;j<step&&i+j<digits.length;j++){
      const d=digits[i+j],c=hexToRgb(colorMap[d]);
      const p=(i+j)*4;
      img.data[p]=c.r;img.data[p+1]=c.g;img.data[p+2]=c.b;img.data[p+3]=255;
    }
    ctx.putImageData(img,0,0);
    await new Promise(r=>requestAnimationFrame(r));
  }
}
function hexToRgb(hex){
  const v=parseInt(hex.slice(1),16);
  return{r:(v>>16)&255,g:(v>>8)&255,b:v&255};
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
