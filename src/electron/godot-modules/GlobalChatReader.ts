/* eslint-disable @typescript-eslint/no-explicit-any */
import { streamer_bot } from "../streamerbot.js";
import { godot_webSocket, foundModules } from "../godot-server.js";
import { StreamerbotEventPayload } from "@streamerbot/client";

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
  function send(data: string, source: string) {
    ws.send(`${prefix}?${source}?${data}`);
  }
  streamer_bot.disconnect("GlobalTTS");

  // ws.addEventListener("message", (sdata: MessageEvent) => {
  //   try {
  //     const data = sdata.data.toString();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  streamer_bot.connect("GlobalTTS", "Twitch.ChatMessage", (data) => {
    const message = data.data.message.message;
    const userName = data.data.message.username;
    console.log(`got twitch message: ${message} from ${userName}`);
    send(JSON.stringify({ message, userName }), "twitch");
  });

  streamer_bot.connect("GlobalTTS", "YouTube.Message", (sdata) => {
    const data = sdata.data as YoutubeBroadcastMessage;
    const message = data.message;
    const userName = data.user.name;
    console.log(`got youtube message: ${message} from ${userName}`);
    send(JSON.stringify({ message, userName }), "youtube");
  });
}
