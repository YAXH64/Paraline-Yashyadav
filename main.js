const { app, BrowserWindow, ipcMain, screen } = require("electron");
const { createAudioBridge } = require("./audioBridge");

let overlayWindow;
let audioBridge;
let fakeTimer;

function createOverlayWindow() {
  const { bounds } = screen.getPrimaryDisplay();

  overlayWindow = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    fullscreenable: false,
    skipTaskbar: true,
    hasShadow: false,
    focusable: false,
    backgroundColor: "#00000000",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: require("path").join(__dirname, "preload.js")
    }
  });

  overlayWindow.setAlwaysOnTop(true, "screen-saver");
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  overlayWindow.setIgnoreMouseEvents(true, { forward: true });
  overlayWindow.loadFile("index.html");

  overlayWindow.on("closed", () => {
    overlayWindow = null;
  });
}

function sendAudioLevel(value, source) {
  if (!overlayWindow || overlayWindow.isDestroyed()) {
    return;
  }

  overlayWindow.webContents.send("audio-level", {
    value,
    source
  });
}

function startSimulatedAudioFallback() {
  stopSimulatedAudioFallback();

  fakeTimer = setInterval(() => {
    const now = Date.now();
    const level = 0.15 + (Math.sin(now * 0.001 * 0.45) + 1) * 0.08;
    sendAudioLevel(level, "simulated");
  }, 33);
}

function stopSimulatedAudioFallback() {
  if (fakeTimer) {
    clearInterval(fakeTimer);
    fakeTimer = null;
  }
}

function resizeOverlayToPrimaryDisplay() {
  if (!overlayWindow) {
    return;
  }

  const { bounds } = screen.getPrimaryDisplay();
  overlayWindow.setBounds(bounds);
}

app.whenReady().then(() => {
  createOverlayWindow();
  audioBridge = createAudioBridge((value) => {
    stopSimulatedAudioFallback();
    sendAudioLevel(value, "helper");
  });
  audioBridge.start();
  startSimulatedAudioFallback();

  screen.on("display-metrics-changed", resizeOverlayToPrimaryDisplay);
  screen.on("display-added", resizeOverlayToPrimaryDisplay);
  screen.on("display-removed", resizeOverlayToPrimaryDisplay);

  ipcMain.handle("audio-bridge-status", () => {
    if (!audioBridge) {
      return {
        mode: "simulated",
        reason: "Audio bridge not created yet."
      };
    }

    return audioBridge.getStatus();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createOverlayWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (audioBridge) {
    audioBridge.stop();
  }

  stopSimulatedAudioFallback();

  if (process.platform !== "darwin") {
    app.quit();
  }
});
