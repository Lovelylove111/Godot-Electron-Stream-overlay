import { registerModule } from "../godot-server.js";
import { streamer_bot } from "../streamerbot.js";

export default () => {
  console.log("yay i can register :D");
  registerModule("GlobalTTS", {
    sendState: (state) => {
      //implementation pending
    },
    subscribeStats: (callback) => {
      //implementation pending
    },
  });
};
