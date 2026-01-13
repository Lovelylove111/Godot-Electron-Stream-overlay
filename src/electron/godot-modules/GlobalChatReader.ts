/* eslint-disable @typescript-eslint/no-explicit-any */
import { streamer_bot } from "../streamerbot.js";
import { godot_webSocket, foundModules } from "../godot-server.js";

let godot_end_implemented = false;
const prefix = "GlobalTTS";

export default (ws: WebSocket) => {
  console.log("Loading module: GlobalTTS");
  godot_end_implemented = foundModules.includes("GlobalTTS");
  if (godot_end_implemented) {
    onImplemented(ws);
  }
  console.log(
    `Loaded module: GlobalTTS, is implemented ${godot_end_implemented}`
  );
};

function onImplemented(ws: WebSocket) {
  function send(data: string) {
    ws.send(`${prefix}?${data}`);
  }

  ws.addEventListener("message", (sdata: MessageEvent) => {
    try {
      const data = sdata.data.toString();
    } catch (error) {
      console.log(error);
    }
  });

  streamer_bot.connect("GlobalTTS", "Twitch.ChatMessage", (data) => {
    const message = data.data.message;
    send(JSON.stringify(message));
  });
}
