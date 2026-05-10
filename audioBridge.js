const { app } = require("electron");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

function createAudioBridge(sendLevel, onStatusChange = () => {}) {
  let helperProcess = null;
  let helperStatus = {
    mode: "simulated",
    reason: "Helper not started yet."
  };

  function updateStatus(nextStatus) {
    helperStatus = nextStatus;
    onStatusChange(helperStatus);
  }

  function findHelperBinary() {
    const appPath = app.getAppPath();
    const candidates = [
      path.join(process.resourcesPath, "audio-helper", "Paraline.AudioBridge.exe"),
      path.join(appPath, "build", "audio-helper", "Paraline.AudioBridge.exe"),
      path.join(appPath, "audio-helper", "bin", "Release", "net8.0-windows", "win-x64", "publish", "Paraline.AudioBridge.exe"),
      path.join(appPath, "audio-helper", "bin", "Debug", "net8.0-windows", "Paraline.AudioBridge.exe"),
      path.join(appPath, "audio-helper", "bin", "Release", "net8.0-windows", "Paraline.AudioBridge.exe")
    ];

    return candidates.find((candidatePath) => fs.existsSync(candidatePath)) || null;
  }

  function start() {
    const helperBinary = findHelperBinary();

    if (!helperBinary) {
      updateStatus({
        mode: "simulated",
        reason: "C# helper binary not found. Build or package the helper before enabling loopback capture."
      });
      return;
    }

    helperProcess = spawn(helperBinary, [], {
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"]
    });

    updateStatus({
      mode: "helper",
      reason: "C# helper process connected."
    });

    let stdoutBuffer = "";

    helperProcess.stdout.on("data", (chunk) => {
      stdoutBuffer += chunk.toString();

      const lines = stdoutBuffer.split(/\r?\n/);
      stdoutBuffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) {
          continue;
        }

        try {
          const message = JSON.parse(line);

          if (message.type === "level" && typeof message.value === "number") {
            sendLevel(message.value);
          }
        } catch (_error) {
          updateStatus({
            mode: "simulated",
            reason: "Received invalid JSON from helper."
          });
        }
      }
    });

    helperProcess.stderr.on("data", (chunk) => {
      updateStatus({
        mode: "helper-error",
        reason: chunk.toString().trim() || "Helper reported an error."
      });
    });

    helperProcess.on("exit", (code) => {
      helperProcess = null;
      updateStatus({
        mode: "simulated",
        reason: `Helper stopped with exit code ${code}.`
      });
    });
  }

  function stop() {
    if (helperProcess) {
      helperProcess.kill();
      helperProcess = null;
    }

    updateStatus({
      mode: "simulated",
      reason: "Helper stopped."
    });
  }

  function getStatus() {
    return helperStatus;
  }

  return {
    start,
    stop,
    getStatus
  };
}

module.exports = {
  createAudioBridge
};
