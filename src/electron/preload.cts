const { contextBridge, ipcRenderer } = require("electron");

console.log("Interface executed");

// const brideTable = {
//   send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
//   on: (channel: string, func: (...args: any[]) => void) =>
//     ipcRenderer.on(
//       channel,
//       (event: Electron.IpcRendererEvent, ...args: any[]) => func(...args)
//     ),
// } satisfies Window[`api`];

contextBridge.exposeInMainWorld("api", {
  getModule: <g extends keyof gModule_mappings>(moduleName: g) => {
    return ipcRenderer.invoke(`get:module?${moduleName}`) as Promise<
      gModule_mappings[g]
    >;
  },
  send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
  on: (channel: string, func: (...args: any[]) => void) =>
    ipcRenderer.on(
      channel,
      (event: Electron.IpcRendererEvent, ...args: any[]) => func(...args)
    ),
} satisfies Window[`api`]);
