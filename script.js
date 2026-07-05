const video = document.getElementById("camera");
const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");
const category = document.getElementById("category");
const overlayType = document.getElementById("overlayType");
const captureBtn = document.getElementById("capture");

navigator.mediaDevices.getUserMedia({
  video: { facingMode: "environment" }
}).then(stream => video.srcObject = stream);

video.onloadedmetadata = () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  drawOverlay();
};

category.onchange = overlayType.onchange = drawOverlay;

function drawOverlay() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 1;

  let type = overlayType.value;
  if (type === "auto") type = smart(category.value);

  ({
    thirds, golden, diagonal, center, symmetry,
    leading, triangle, horizon, square, reels
  }[type] || thirds)();

  voiceTip(type);
}

function smart(cat) {
  return {
    Food: "center",
    Nature: "thirds",
    River: "leading",
    Temple: "symmetry",
    Building: "symmetry",
    Sky: "horizon",
    Mountain: "triangle"
  }[cat] || "thirds";
}

/* OVERLAYS */
function thirds(){line(w()/3,0,w()/3,h());line(2*w()/3,0,2*w()/3,h());line(0,h()/3,w(),h()/3);line(0,2*h()/3,w(),2*h()/3);}
function golden(){line(w()*0.618,0,w()*0.618,h());line(0,h()*0.618,w(),h()*0.618);}
function diagonal(){line(0,0,w(),h());line(w(),0,0,h());}
function center(){ctx.strokeRect(w()*0.25,h()*0.25,w()*0.5,h()*0.5);}
function symmetry(){line(w()/2,0,w()/2,h());}
function leading(){line(0,h(),w()/2,h()/2);line(w(),h(),w()/2,h()/2);}
function triangle(){line(w()/2,0,0,h());line(w()/2,0,w(),h());line(0,h(),w(),h());}
function horizon(){line(0,h()*0.6,w(),h()*0.6);}
function square(){let s=Math.min(w(),h());ctx.strokeRect((w()-s)/2,(h()-s)/2,s,s);}
function reels(){ctx.strokeRect(w()*0.1,h()*0.1,w()*0.8,h()*0.8);}

function line(x1,y1,x2,y2){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
function w(){return canvas.width;}
function h(){return canvas.height;}

/* CAPTURE */
captureBtn.onclick = () => {
  const photo = document.createElement("canvas");
  photo.width = w(); photo.height = h();
  const p = photo.getContext("2d");
  p.drawImage(video,0,0,w(),h());
  p.drawImage(canvas,0,0);
  const a = document.createElement("a");
  a.download = "lensly-photo.png";
  a.href = photo.toDataURL();
  a.click();
};

/* VOICE */
function speak(text){
  if(!speechSynthesis) return;
  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}
function voiceTip(type){
  const tips={
    center:"Center framing works best for food",
    thirds:"Rule of thirds adds balance",
    leading:"Leading lines guide the eye",
    symmetry:"Symmetry suits temples and buildings",
    horizon:"Keep horizon straight",
    triangle:"Triangle adds strength"
  };
  if(tips[type]) speak(tips[type]);
}

/* SERVICE WORKER */
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("service-worker.js");
}
