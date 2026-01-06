import { app, BrowserWindow } from "electron";
import * as path from "path";
import { getElectronGodotModules, getPreloadPath } from "./pathResolver.js";
import * as godot_server from "./godot-server.js";
import { readdirSync } from "fs";
import { pathToFileURL } from "url";

app.on("ready", () => {
  const window = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });
  window.loadFile(path.join(app.getAppPath(), "dist-react", "index.html"));

  godot_server.start_serving();
});
