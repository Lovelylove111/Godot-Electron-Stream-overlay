import { StreamerbotClient } from "@streamerbot/client";

// Create a new client instance
const sb = new StreamerbotClient({
  host: "127.0.0.1", // Streamer.bot WebSocket host
  port: 8080, // Default WebSocket port
});

// type TwitchChatMessage = {
//   message: {
//     internal: boolean;
//     msgId: string;
//     userId: string;
//     username: string;
//     role: number;
//     subscriber: boolean;
//     displayName: string;
//     color: string;
//     channel: string;
//     message: string;
//     isHighlighted: boolean;
//     isMe: boolean;
//     isCustomReward: boolean;
//     isAnonymous: boolean;
//     isReply: boolean;
//     bits: number;
//     firstMessage: boolean;
//     hasBits: boolean;
//     emotes: Array<TwitchEmote>;
//     cheerEmotes: Array<any>;
//     badges: Array<TwitchBadge>;
//     monthsSubscribed: number;
//     isTest: boolean;
//   };
// };

// Listen for Twitch chat messages
sb.on("Twitch.ChatMessage", (data) => {
  const { username, message } = data.data.message;
  console.log(`💬 ${username}: ${message}`);
});

// Start the connection
sb.connect().catch((err) => {
  console.error("Connection error:", err);
});

export const streamer_bot = sb;
