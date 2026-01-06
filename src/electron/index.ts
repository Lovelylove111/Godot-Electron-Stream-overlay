import { app, BrowserWindow } from "electron";
import * as path from "path";
import { getPreloadPath } from "./pathResolver.js";

app.on("ready", () => {
  const window = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });
  window.loadFile(path.join(app.getAppPath(), "dist-react", "index.html"));
});
