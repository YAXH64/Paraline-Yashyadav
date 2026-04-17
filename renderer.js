const canvas = document.getElementById("visualizer");
const context = canvas.getContext("2d");

let width = 0;
let height = 0;
let deviceScale = 1;
let time = 0;
let smoothedLevel = 0.24;
let incomingLevel = 0.24;

const THEMES = {
  blue: {
    topLine: "rgba(145, 220, 255, 0.34)",
    topGlow: "rgba(120, 205, 255, 0.12)",
    bottomLine: "rgba(168, 232, 255, 0.22)",
    bottomGlow: "rgba(120, 205, 255, 0.08)",
    hazeTop: "rgba(115, 200, 255, 0.10)",
    hazeBottom: "rgba(115, 200, 255, 0.06)"
  },
  purple: {
    topLine: "rgba(202, 168, 255, 0.32)",
    topGlow: "rgba(180, 140, 255, 0.12)",
    bottomLine: "rgba(232, 196, 255, 0.20)",
    bottomGlow: "rgba(180, 140, 255, 0.08)",
    hazeTop: "rgba(186, 146, 255, 0.10)",
    hazeBottom: "rgba(186, 146, 255, 0.06)"
  },
  warm: {
    topLine: "rgba(255, 208, 156, 0.32)",
    topGlow: "rgba(255, 188, 128, 0.12)",
    bottomLine: "rgba(255, 224, 196, 0.20)",
    bottomGlow: "rgba(255, 188, 128, 0.08)",
    hazeTop: "rgba(255, 190, 124, 0.10)",
    hazeBottom: "rgba(255, 190, 124, 0.06)"
  }
};

const params = new URLSearchParams(window.location.search);
const themeName = params.get("theme") || "blue";
const theme = THEMES[themeName] || THEMES.blue;

function resizeCanvas() {
  deviceScale = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = Math.floor(width * deviceScale);
  canvas.height = Math.floor(height * deviceScale);
  context.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
}

function updateAudioLevel(now) {
  const breathing = 0.028 * (Math.sin(now * 0.00023) + 1);
  smoothedLevel += ((incomingLevel + breathing) - smoothedLevel) * 0.018;
}

function drawWave(yBase, amplitude, frequency, speed, color, lineWidth, opacity) {
  context.beginPath();

  for (let x = 0; x <= width; x += 14) {
    const waveA = Math.sin(x * frequency + time * speed);
    const waveB = Math.sin(x * frequency * 0.42 - time * speed * 0.52);
    const lift = (waveA + waveB) * amplitude;
    const y = yBase + lift;

    if (x === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  }

  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.globalAlpha = opacity;
  context.shadowBlur = 22 + amplitude * 0.45;
  context.shadowColor = color;
  context.stroke();
}

function drawGlowBand() {
  const edgeFade = context.createLinearGradient(0, 0, 0, height);
  edgeFade.addColorStop(0, theme.hazeTop);
  edgeFade.addColorStop(0.16, "rgba(0, 0, 0, 0)");
  edgeFade.addColorStop(0.5, "rgba(0, 0, 0, 0)");
  edgeFade.addColorStop(0.84, "rgba(0, 0, 0, 0)");
  edgeFade.addColorStop(1, theme.hazeBottom);

  context.globalAlpha = 1;
  context.shadowBlur = 0;
  context.fillStyle = edgeFade;
  context.fillRect(0, 0, width, height);
}

function drawSoftFill(yBase, amplitude, frequency, speed, color, thickness) {
  const gradient = context.createLinearGradient(0, yBase - thickness, 0, yBase + thickness);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(0.5, color);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  context.beginPath();
  context.moveTo(0, yBase);

  for (let x = 0; x <= width; x += 18) {
    const waveA = Math.sin(x * frequency + time * speed);
    const waveB = Math.sin(x * frequency * 0.35 - time * speed * 0.45);
    context.lineTo(x, yBase + (waveA + waveB) * amplitude);
  }

  context.lineTo(width, yBase + thickness);
  context.lineTo(0, yBase + thickness);
  context.closePath();

  context.globalAlpha = 1;
  context.shadowBlur = 0;
  context.fillStyle = gradient;
  context.fill();
}

