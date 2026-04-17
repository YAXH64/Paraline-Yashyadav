const { app } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

function createAudioBridge(sendLevel) {
  let helperProcess = null;
  let helperStatus = {
    mode: "simulated",
    reason: "Helper not started yet."
  };

  function findHelperBinary() {
    const helperPath = path.join(
      app.getAppPath(),
      "audio-helper",
      "bin",
      "Debug",
      "net8.0-windows",
      "Paraline.AudioBridge.exe"
    );

    return helperPath;
  }

  function start() {
    const helperBinary = findHelperBinary();

    if (!require("fs").existsSync(helperBinary)) {
      helperStatus = {
        mode: "simulated",
        reason: "C# helper binary not found. Build it before enabling loopback capture."
      };
      return;
    }

    helperProcess = spawn(helperBinary, [], {
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"]
    });

    helperStatus = {
      mode: "helper",
      reason: "C# helper process connected."
    };

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
          helperStatus = {
            mode: "simulated",
            reason: "Received invalid JSON from helper."
          };
        }
      }
    });

    helperProcess.stderr.on("data", (chunk) => {
      helperStatus = {
        mode: "helper-error",
        reason: chunk.toString().trim() || "Helper reported an error."
      };
    });

    helperProcess.on("exit", (code) => {
      helperProcess = null;
      helperStatus = {
        mode: "simulated",
        reason: `Helper stopped with exit code ${code}.`
      };
    });
  }

  function stop() {
    if (helperProcess) {
      helperProcess.kill();
      helperProcess = null;
    }
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
