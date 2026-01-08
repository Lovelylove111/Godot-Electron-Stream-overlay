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

const gModules: {
  [K in keyof gModule_mappings]: gModule_mappings[K];
} = {
  GlobalTTS: {
    sendState: (state) => {
      // console.log("sent state :D");
      ipcSend("module:GlobalTTS?State", state);
    },
    subscribeChangedState: (callback) => {
      ipcOn("module:GlobalTTS?State", callback);
    },
  },
};

contextBridge.exposeInMainWorld("api", {
  getModule: <g extends keyof gModule_mappings>(moduleName: g) => {
    return gModules[moduleName];
  },
  send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
  on: (channel: string, func: (...args: any[]) => void) =>
    ipcRenderer.on(
      channel,
      (event: Electron.IpcRendererEvent, ...args: any[]) => func(...args)
    ),
} satisfies Window[`api`]);

function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key
): Promise<EventPayloadMapping[Key]> {
  return ipcRenderer.invoke(key);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
  ipcRenderer.on(key, cb);
  return () => ipcRenderer.off(key, cb);
}

function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key]
) {
  ipcRenderer.send(key, payload);
}
