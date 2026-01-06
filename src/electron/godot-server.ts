import exp from "express";
import { getGodotPath } from "./pathResolver.js";
import path from "path";
import { app, ipcMain, ipcRenderer } from "electron";
import { config_table } from "./config.js";
import * as http from "http";
import WebSocket, { WebSocketServer } from "ws";

const expressApp = exp();
const expressAppPort = config_table.ExpressAppPort;
export const expressAppUrl = `http://localhost:${expressAppPort}`;
const server = http.createServer(expressApp);
const wss = new WebSocketServer({ server: server });

export function start_serving() {
  expressApp.use(exp.static(path.join(getGodotPath())));

  // Fallback to index.html for SPA routing
  expressApp.get("all", (req, res) => {
    const p = path.join(getGodotPath(), "index.html");
    res.sendFile(p);
  });

  expressApp.listen(expressAppPort, () => {
    console.log(`Godot game running at ${expressAppUrl}`);
  });
}

const gModules: Partial<{
  [K in keyof gModule_mappings]: gModule_mappings[K];
}> = {};

export function registerModule<gModule_name extends keyof gModule_mappings>(
  moduleName: gModule_name,
  callbacks: gModule_mappings[gModule_name]
) {
  console.log(`registering module ${moduleName}`);
  gModules[moduleName] = callbacks;
  ipcMain.handle(`get:module?${moduleName}`, () => {
    return callbacks;
  });
}

export const getModule: <gModule_name extends keyof gModule_mappings>(
  moduleName: gModule_name
) => gModule_mappings[gModule_name] | null = (moduleName) => {
  const foundModule = gModules[moduleName];
  if (foundModule) {
    return foundModule;
  } else {
    return null;
  }
};

// wss.on("connection", (ws: WebSocket) => {
//   console.log("Client connected");
// });

export const godot_webSocket = wss;
