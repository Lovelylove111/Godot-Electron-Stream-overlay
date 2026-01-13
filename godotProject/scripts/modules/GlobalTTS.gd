extends m_ModuleBase

func v_getNameString() -> String:
    return "GlobalTTS"

func v_request(data: String):
    var message = parse_twitch_chat_message(data)
    print(message.message)
    pass

class TwitchBadge:
    var name: String
    var version: String
    var image_url: String

    func _init(data: Dictionary = {}):
        name = str(data.get("name", ""))
        version = str(data.get("version", ""))
        image_url = str(data.get("imageUrl", ""))


class TwitchEmote:
    var bits: int
    var color: String
    var type: String
    var name: String
    var start_index: int
    var end_index: int
    var image_url: String

    func _init(data: Dictionary = {}):
        bits = int(data.get("bits", 0))
        color = str(data.get("color", ""))
        type = str(data.get("type", ""))
        name = str(data.get("name", ""))
        start_index = int(data.get("startIndex", -1))
        end_index = int(data.get("endIndex", -1))
        image_url = str(data.get("imageUrl", ""))


class TwitchChatMessage:
    var internal: bool
    var msg_id: String
    var user_id: String
    var username: String
    var role: int
    var subscriber: bool
    var display_name: String
    var color: String
    var channel: String
    var message: String
    var is_highlighted: bool
    var is_me: bool
    var is_custom_reward: bool
    var is_anonymous: bool
    var is_reply: bool
    var bits: int
    var first_message: bool
    var has_bits: bool
    var months_subscribed: int
    var is_test: bool
    var emotes: Array[TwitchEmote]
    var cheer_emotes: Array
    var badges: Array[TwitchBadge]

    func _init(data: Dictionary = {}):
        internal = bool(data.get("internal", false))
        msg_id = str(data.get("msgId", ""))
        user_id = str(data.get("userId", ""))
        username = str(data.get("username", ""))
        role = int(data.get("role", 0))
        subscriber = bool(data.get("subscriber", false))
        display_name = str(data.get("displayName", ""))
        color = str(data.get("color", ""))
        channel = str(data.get("channel", ""))
        message = str(data.get("message", ""))
        is_highlighted = bool(data.get("isHighlighted", false))
        is_me = bool(data.get("isMe", false))
        is_custom_reward = bool(data.get("isCustomReward", false))
        is_anonymous = bool(data.get("isAnonymous", false))
        is_reply = bool(data.get("isReply", false))
        bits = int(data.get("bits", 0))
        first_message = bool(data.get("firstMessage", false))
        has_bits = bool(data.get("hasBits", false))
        months_subscribed = int(data.get("monthsSubscribed", 0))
        is_test = bool(data.get("isTest", false))

        # Parse nested arrays
        emotes = []
        for e in data.get("emotes", []):
            if typeof(e) == TYPE_DICTIONARY:
                emotes.append(TwitchEmote.new(e))

        cheer_emotes = data.get("cheerEmotes", [])

        badges = []
        for b in data.get("badges", []):
            if typeof(b) == TYPE_DICTIONARY:
                badges.append(TwitchBadge.new(b))


# Factory function
func parse_twitch_chat_message(json_string: String) -> TwitchChatMessage:
    var parsed = JSON.parse_string(json_string)
    if typeof(parsed) != TYPE_DICTIONARY or not parsed.has("message"):
        push_error("Invalid TwitchChatMessage JSON")
        return null
    return TwitchChatMessage.new(parsed["message"])
