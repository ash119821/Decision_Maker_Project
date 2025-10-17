
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spin");
const resetBtn = document.getElementById("reset");
const resultBox = document.getElementById("result");

let choices = JSON.parse(localStorage.getItem("choices") || "[]");
if (!Array.isArray(choices)) choices = [];

const WIDTH = canvas.width || 300;
const HEIGHT = canvas.height || 300;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;
const RADIUS = Math.min(WIDTH, HEIGHT) / 2 - 6;

let arc = choices.length > 0 ? (2 * Math.PI) / choices.length : 2 * Math.PI;

const COLORS = [
  "#ff4757", "#ffa502", "#2ed573", "#1e90ff",
  "#9b59b6", "#e84393", "#74b9ff", "#55efc4",
  "#fdcb6e", "#ff7f50", "#7bed9f", "#a29bfe"
];

let spinAngle = 0;        
let spinning = false;
let velocity = 0;         

function drawWheel() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  for (let i = 0; i < choices.length; i++) {
    const startAngle = i * arc;
    const endAngle = startAngle + arc;

    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.arc(CX, CY, RADIUS, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = COLORS[i % COLORS.length];
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.12)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    const mid = startAngle + arc / 2;
    const tx = CX + Math.cos(mid) * (RADIUS * 0.62);
    const ty = CY + Math.sin(mid) * (RADIUS * 0.62);
    ctx.translate(tx, ty);
    ctx.rotate(mid + Math.PI / 2);
    ctx.fillStyle = "white";
    ctx.font = "bold 13px Poppins, sans-serif";
    ctx.textAlign = "center";
    const text = String(choices[i] || "");
    wrapText(ctx, text, 0, -6, 100, 14);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(CX, CY, 36, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(CX, CY, 20, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fill();

  ctx.fillStyle = "white";
  ctx.fill();
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let testY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = context.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      context.fillText(line, x, testY);
      line = words[n] + " ";
      testY += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, testY);
}

function getSelectedIndex(finalAngle) {
  if (choices.length === 0) return -1;
  const TWO = 2 * Math.PI;
  let a = (-Math.PI / 2 - finalAngle) % TWO;
  if (a < 0) a += TWO;
  const idx = Math.floor(a / arc) % choices.length;
  return (idx + choices.length) % choices.length;
}

function animateSpin() {
  if (!spinning) return;
  spinAngle += velocity;
  velocity *= 0.985;

  ctx.save();
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.translate(CX, CY);
  ctx.rotate(spinAngle);
  ctx.translate(-CX, -CY);
  drawWheel();
  ctx.restore();

  if (Math.abs(velocity) < 0.0006) {
    spinning = false;
    const TWO = 2 * Math.PI;
    let final = spinAngle % TWO;
    if (final < 0) final += TWO;

    const selected = getSelectedIndex(final);
    if (selected >= 0) {
      resultBox.textContent = `🎯 Result: ${choices[selected]}`;
    } else {
      resultBox.textContent = "No choices provided.";
    }
    return;
  }

  requestAnimationFrame(animateSpin);
}

function startSpin() {
  if (spinning || choices.length === 0) return;
  resultBox.textContent = "";
  spinning = true;
  velocity = (Math.random() * 0.38 + 0.45);
  if (Math.random() < 0.2) velocity *= -1;
  requestAnimationFrame(animateSpin);
}

function resetWheel() {
  spinning = false;
  velocity = 0;
  spinAngle = 0;
  resultBox.textContent = "";
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawWheel();
}

spinBtn.addEventListener("click", startSpin);
resetBtn.addEventListener("click", () => {
  localStorage.removeItem("choices"); 
  resetWheel();
});

arc = choices.length > 0 ? (2 * Math.PI) / choices.length : 2 * Math.PI;
drawWheel();
