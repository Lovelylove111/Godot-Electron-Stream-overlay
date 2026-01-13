/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  StreamerbotClient,
  StreamerbotEventPayload,
  StreamerbotEventName,
  StreamerbotEventSource,
  StreamerbotEventType,
} from "@streamerbot/client";

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
// sb.on("Twitch.ChatMessage", (data) => {
//   const { username, message } = data.data.message;
//   console.log(`💬 ${username}: ${message}`);
// });

// Start the connection
sb.connect().catch((err) => {
  console.error("Connection error:", err);
});

class StreamerBotWrapper {
  private sb: StreamerbotClient;
  private handlers: Map<
    string,
    Array<{
      eventPattern: string;
      handler: (data: any) => void;
    }>
  > = new Map();

  constructor(a_sb: StreamerbotClient) {
    this.sb = a_sb;

    // Listen to all events and route them to appropriate handlers
    this.sb.on("*", (ev: StreamerbotEventPayload<any>) => {
      const eventSource = ev.event.source;
      const eventType = ev.event.type;
      const fullEvent = `${eventSource}.${eventType}`;

      // Route event to all handlers
      this.routeEvent(fullEvent, ev);
    });
  }

  /**
   * Connect a handler to a specific event pattern
   * @param id - Unique identifier for this handler (used for disconnecting)
   * @param eventPattern - Event pattern to match (e.g., "Twitch.ChatMessage", "Twitch.*")
   * @param handler - Function to call when event occurs
   */
  async connect<TEvent extends StreamerbotEventName | "*">(
    id: string,
    eventPattern: TEvent,
    handler: (
      data: TEvent extends StreamerbotEventName
        ? StreamerbotEventPayload<TEvent>
        : StreamerbotEventPayload<StreamerbotEventName>
    ) => void
  ): Promise<void> {
    // Validate event pattern format
    if (!this.isValidEventPattern(eventPattern)) {
      throw new Error(
        `Invalid event pattern: ${eventPattern}. Expected format: "Source.Type" or "Source.*"`
      );
    }

    // Get or create handler array for this ID
    if (!this.handlers.has(id)) {
      this.handlers.set(id, []);
    }

    const handlerList = this.handlers.get(id)!;

    // Check if this exact pattern is already registered for this ID
    const existingIndex = handlerList.findIndex(
      (h) => h.eventPattern === eventPattern
    );
    if (existingIndex >= 0) {
      // Replace existing handler
      handlerList[existingIndex].handler = handler;
    } else {
      // Add new handler
      handlerList.push({ eventPattern, handler });
    }

    console.log(
      `Connected handler for ID "${id}" to event pattern "${eventPattern}"`
    );
  }

  /**
   * Connect a handler to a specific event pattern (source wildcard version)
   * This supports patterns like "Twitch.*" which match all Twitch events
   */
  // async connectSourceWildcard<TEventSource extends StreamerbotEventSource>(
  //   id: string,
  //   eventSource: TEventSource,
  //   handler: <TEvent>(
  //     data: StreamerbotEventPayload<
  //       TEvent extends StreamerbotEventName ? TEvent : StreamerbotEventName
  //     >
  //   ) => void
  // ): Promise<void> {
  //   const eventPattern = `${eventSource}.*` as const;
  //   return this.connect(id, eventPattern, handler);
  // }

  /**
   * Connect a handler to all events
   */
  async connectAll(
    id: string,
    handler: (data: StreamerbotEventPayload<StreamerbotEventName>) => void
  ): Promise<void> {
    return this.connect(id, "*", handler);
  }

  /**
   * Disconnect all handlers for a specific ID
   * @param id - Unique identifier to disconnect
   */
  disconnect(id: string): void {
    if (this.handlers.has(id)) {
      const removedCount = this.handlers.get(id)!.length;
      this.handlers.delete(id);
      console.log(`Disconnected ${removedCount} handler(s) for ID "${id}"`);
    } else {
      console.warn(`No handlers found for ID "${id}"`);
    }
  }

  /**
   * Disconnect a specific handler pattern for an ID
   */
  disconnectPattern(id: string, eventPattern: string): boolean {
    if (!this.handlers.has(id)) {
      return false;
    }

    const handlerList = this.handlers.get(id)!;
    const initialLength = handlerList.length;

    // Remove handlers matching the pattern
    this.handlers.set(
      id,
      handlerList.filter((h) => h.eventPattern !== eventPattern)
    );

    const removed = initialLength - this.handlers.get(id)!.length;
    if (removed > 0) {
      console.log(
        `Disconnected ${removed} handler(s) for ID "${id}" with pattern "${eventPattern}"`
      );
      return true;
    }

    return false;
  }

  /**
   * Get all connected handlers (for debugging/monitoring)
   */
  getConnectedHandlers(): Map<
    string,
    Array<{ eventPattern: string; handler: (data: any) => void }>
  > {
    return new Map(this.handlers);
  }

  /**
   * Get handler count for a specific ID
   */
  getHandlerCount(id: string): number {
    return this.handlers.get(id)?.length || 0;
  }

  /**
   * Get handlers for a specific ID and pattern
   */
  getHandlers(
    id: string,
    eventPattern?: string
  ): Array<{ eventPattern: string; handler: (data: any) => void }> {
    const handlers = this.handlers.get(id);
    if (!handlers) return [];

    if (eventPattern) {
      return handlers.filter((h) => h.eventPattern === eventPattern);
    }

    return [...handlers];
  }

  /**
   * Route an incoming event to all matching handlers
   */
  private routeEvent(fullEvent: string, eventData: any): void {
    const [source, type] = fullEvent.split(".") as [
      StreamerbotEventSource,
      StreamerbotEventType
    ];

    // Iterate through all IDs and their handlers
    for (const [id, handlerList] of this.handlers.entries()) {
      for (const { eventPattern, handler } of handlerList) {
        if (this.eventMatchesPattern(source, type, eventPattern)) {
          try {
            // Call the handler with the typed event data
            handler(eventData);
          } catch (error) {
            console.error(
              `Error in handler for ID "${id}" on event "${fullEvent}":`,
              error
            );
          }
        }
      }
    }
  }

  /**
   * Check if an event matches a pattern
   */
  private eventMatchesPattern(
    source: StreamerbotEventSource,
    type: StreamerbotEventType,
    pattern: string
  ): boolean {
    const [patternSource, patternType] = pattern.split(".") as [string, string];

    // Check source match
    if (patternSource !== source && patternSource !== "*") {
      return false;
    }

    // Check type match
    if (patternType !== type && patternType !== "*") {
      return false;
    }

    return true;
  }

  /**
   * Validate event pattern format
   */
  private isValidEventPattern(pattern: string): boolean {
    // Pattern should be in format "Source.Type" or "Source.*" or "*"
    const parts = pattern.split(".");

    if (pattern === "*") {
      return true;
    }

    return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;
  }

  /**
   * Direct access to the underlying StreamerbotClient (optional)
   */
  get client(): StreamerbotClient {
    return this.sb;
  }
}

export const streamer_bot = new StreamerBotWrapper(sb);
// sb.on()
