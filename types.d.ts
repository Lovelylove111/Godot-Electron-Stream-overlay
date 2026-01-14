/* eslint-disable @typescript-eslint/no-explicit-any */

type GlobalTTSState = { enabled: boolean };

type gModule_mappings = {
  GlobalTTS: {
    sendState: (state: GlobalTTSState) => void;
    subscribeChangedState: (callback: (state: GlobalTTSState) => void) => void;
    // subscribeStats: (
    //   callback: ({
    //     lastMessage: string,
    //     messageCount: Number,
    //     isReproducing: boolean,
    //   }) => void
    // ) => void;
  };
};

type YoutubeBroadcastMessage = {
  message: string;
  emotes: string[];
  parts: {
    text: string;
  }[];
  broadcast: {
    id: string;
    channelId: string;
    liveChatId: string;
    title: string;
    description: string;
    categoryId: string;
    privacy: string;
    publishedAt: string; // ISO date string
    scheduledStartTime: string; // ISO date string
    scheduledEndTime: string; // ISO date string
    actualStartTime: string; // ISO date string
    actualEndTime: string; // ISO date string
    tags: string[];
    defaultLanguage: string;
    defaultAudioLanguage: string;
    status: string;
  };
  eventId: string;
  user: {
    id: string;
    url: string;
    name: string;
    profileImageUrl: string;
    isOwner: boolean;
    isModerator: boolean;
    isSponsor: boolean;
    isVerified: boolean;
  };
  publishedAt: string; // ISO date string
};

type EventPayloadMapping = {
  "module:GlobalTTS?State": GlobalTTSState;
};

interface Window {
  api: {
    // getModule: <gModule_name extends keyof gModule_mappings>(
    //   moduleName: gModule_name
    // ) => Promise<gModule_mappings[gModule_name] | null>;
    getModule: <gModule_name extends keyof gModule_mappings>(
      moduleName: gModule_name
    ) => gModule_mappings[gModule_name];
    send: (channel: string, ...args: any[]) => any;
    on: (channel: string, func: (...args: any[]) => void) => any;
    // subscribe_godot: <gModule_name extends keyof gModule_mappings>(
    //   module: gModule_name
    // ) => gModule_mappings[gModule_name];
  };
}
