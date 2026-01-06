import { app, BrowserWindow } from "electron";
import * as path from "path";
import { getPreloadPath } from "./pathResolver.js";
import * as godot_server from "./godot-server.js";

app.on("ready", () => {
  const window = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });
  window.loadFile(path.join(app.getAppPath(), "dist-react", "index.html"));

  godot_server.start_serving();
});
