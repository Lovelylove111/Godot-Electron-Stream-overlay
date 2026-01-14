extends m_ModuleBase

@export var ttsLabel: Label
@export var ttsUsername: Label
@export var ttsExitTimer: Timer
@export var animPlayer: AnimationPlayer

var msgQueue: Array[Dictionary] = [] # Changed to Array[Dictionary] to store message data
var isProcessingQueue := false
var currentMessage: Dictionary = {}

func v_getNameString() -> String:
	return "GlobalTTS"

func v_request(message: String):
	var pdata = message.split("?")
	var source = pdata[1]
	var data := m_data.new(pdata[2])

	print("recived data from: " + source + " message: " + data.message + " userName: " + data.userName)
	
	# Add message to queue with source and data
	msgQueue.append({
		"source": source,
		"data": data
	})
	
	# If not currently processing a message, start processing queue
	if not isProcessingQueue:
		await _process_next_message()

func _process_next_message() -> void:
	# If queue is empty or already processing, return
	if msgQueue.is_empty() or isProcessingQueue:
		return
	
	isProcessingQueue = true
	
	# Get next message from queue
	var message_info = msgQueue.pop_front()
	currentMessage = message_info
	
	# Show the message
	await _show_message(message_info.data)
	
	# Process next message in queue if available
	isProcessingQueue = false
	if not msgQueue.is_empty():
		await _process_next_message()

func _show_message(data: m_data) -> void:
	# Play animation forward
	animPlayer.play("TTS apear")
	
	# Update UI with message data
	ttsLabel.text = data.message
	ttsUsername.text = data.userName
	
	# Wait for animation to finish
	await animPlayer.animation_finished
	
	# Start exit timer
	ttsExitTimer.start()
	await ttsExitTimer.timeout
	
	# Play animation backwards
	animPlayer.play_backwards("TTS apear")
	await animPlayer.animation_finished

func _ready() -> void:
	if Engine.is_editor_hint():
		pass

################
#DEBUG
################
func _pick_random_string():
	var strings = [
		"Sans",
		"Papyrus",
		"Gaster",
		"Amogus",
        "Impostor"
	]
	var i = randi_range(0, strings.size() - 1)
	return strings[i]

func _input(event: InputEvent) -> void:
	#debug
	if event.is_action_released("TestGlobalTTS"):
		var test_data = m_data.new(JSON.stringify({
			"message": _pick_random_string() + " " + _pick_random_string() + " " + _pick_random_string(),
			"userName": _pick_random_string(),
		}))
		msgQueue.append({
			"source": "youtube",
			"data": test_data
		})
		
		if not isProcessingQueue:
			await _process_next_message()
################
################

# Helper method to get queue status
func get_queue_size() -> int:
	return msgQueue.size()

# Helper method to clear queue
func clear_queue() -> void:
	msgQueue.clear()

# Optional: Method to skip current message
func skip_current_message() -> void:
	if isProcessingQueue:
		ttsExitTimer.stop()
		animPlayer.stop()
		animPlayer.play("RESET")
		isProcessingQueue = false
		
		# Process next message if available
		if not msgQueue.is_empty():
			await _process_next_message()

class m_data:
	var message: String
	var userName: String

	func _init(json_string) -> void:
		var parsed = JSON.parse_string(json_string)
		if typeof(parsed) != TYPE_DICTIONARY:
			push_error("GlobalTTS: invalid message: " + json_string)
			return
		message = parsed.message
		userName = parsed.userName
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
