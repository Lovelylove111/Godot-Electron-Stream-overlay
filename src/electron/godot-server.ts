import exp from "express";
import { getGodotPath } from "./pathResolver.js";
import path from "path";
import { app } from "electron";
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

// wss.on("connection", (ws: WebSocket) => {
//   console.log("Client connected");
// });

export const godot_webSocket = wss;
