import { registerModule } from "../godot-server.js";
import { streamer_bot } from "../streamerbot.js";

export default () => {
  registerModule("GlobalTTS", {
    sendState: (state) => {
      //implementation pending
    },
    subscribeStats: (callback) => {
      //implementation pending
    },
  });
};
