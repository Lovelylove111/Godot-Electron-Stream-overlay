import exp from "express";
import { getElectronGodotModules, getGodotPath } from "./pathResolver.js";
import path from "path";
import { app, ipcMain, ipcRenderer } from "electron";
import { config_table } from "./config.js";
import * as http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { readdirSync } from "fs";
import { pathToFileURL } from "url";

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

  server.listen(expressAppPort, () => {
    console.log(`Godot game running at ${expressAppUrl}`);
  });
}

export const foundModules: Array<keyof gModule_mappings> = [];

wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected");
  ws.send("get?modules");

  ws.once("message", (data, isBinary) => {
    console.log("got data once: " + data + "isBinary " + isBinary);
    const sdata = data.toString();
    if (sdata.includes("modules?")) {
      // Format: "modules?GlobalTTS,VIPTTS,ETCTTS"
      const moduleString = sdata.split("modules?")[1];

      if (moduleString) {
        const modules = moduleString
          .split(",")
          .filter((name) => name.trim() !== "");

        foundModules.push(...(modules as Array<keyof gModule_mappings>));

        console.log("Found modules:", foundModules);
      } else {
        console.warn("No modules found in message");
      }

      importModules();
    } else {
      console.error(
        "First message from Godot was not the modules, closing socket"
      );
      ws.close();
    }
  });
});

async function importModules() {
  const modulesDir = getElectronGodotModules();

  const files = readdirSync(modulesDir).filter(
    (file) => path.extname(file) === ".js"
  );

  console.log("importing modules");

  for (const file of files) {
    const fullPath = path.join(modulesDir, file);
    const fileUrl = pathToFileURL(fullPath).href;

    try {
      console.log("importing module: " + file);
      const module = await import(fileUrl);
      if (typeof module.default === "function") {
        module.default(); // Execute the default export
      }
    } catch (err) {
      console.error(`Failed to load ${file}:`, err);
    }
  }
}

export const godot_webSocket = wss;
