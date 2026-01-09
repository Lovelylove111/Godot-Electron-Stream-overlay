import { streamer_bot } from "../streamerbot.js";
import { godot_webSocket, foundModules } from "../godot-server.js";

let godot_end_implemented = false;

export default () => {
  console.log("Loading module: GlobalTTS");
  godot_end_implemented = foundModules.includes("GlobalTTS");
  if (godot_end_implemented) {
    console.log("a");
  }
  console.log(
    `Loaded module: GlobalTTS, is implemented ${godot_end_implemented}`
  );
};
