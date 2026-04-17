const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("audioBridge", {
  onLevel(listener) {
    const wrapped = (_event, payload) => listener(payload);
    ipcRenderer.on("audio-level", wrapped);

    return () => {
      ipcRenderer.removeListener("audio-level", wrapped);
    };
  },
  getStatus() {
    return ipcRenderer.invoke("audio-bridge-status");
  }
});
