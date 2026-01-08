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
