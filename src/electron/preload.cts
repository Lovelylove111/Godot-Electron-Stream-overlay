const { contextBridge, ipcRenderer } = require("electron");

console.log("Interface executed");

const brideTable = {
  send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
  on: (channel: string, func: (...args: any[]) => void) =>
    ipcRenderer.on(
      channel,
      (event: Electron.IpcRendererEvent, ...args: any[]) => func(...args)
    ),
};

contextBridge.exposeInMainWorld("api", brideTable);
