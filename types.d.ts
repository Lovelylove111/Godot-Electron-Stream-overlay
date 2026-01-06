import { ipcRenderer } from "electron";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type BridgeTable = {
  send: (channel: string, ...args: any[]) => typeof ipcRenderer.send;
  on: (
    channel: string,
    func: (...args: any[]) => void
  ) => typeof ipcRenderer.on;
};

interface Window {
  api: BridgeTable;
}
