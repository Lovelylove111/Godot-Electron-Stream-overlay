class_name WebSocketClient
extends Node

@export var handshake_headers: PackedStringArray
@export var supported_protocols: PackedStringArray

class w_socket:
	var handshake_headers: PackedStringArray
	var supported_protocols: PackedStringArray

	func _init(a_handshake_headers, a_supported_protocols) -> void:
		handshake_headers = a_handshake_headers
		supported_protocols = a_supported_protocols
	var tls_options: TLSOptions = null

	var socket := WebSocketPeer.new()
	var last_state := WebSocketPeer.STATE_CLOSED

	signal connected_to_server()
	signal connection_closed()
	signal message_received(message: Variant)

	func connect_to_url(url: String) -> int:
		socket.supported_protocols = supported_protocols
		socket.handshake_headers = handshake_headers

		var err := socket.connect_to_url(url, tls_options)
		if err != OK:
			return err

		last_state = socket.get_ready_state()
		return OK


	func send(message: String) -> int:
		if typeof(message) == TYPE_STRING:
			return socket.send_text(message)
		return socket.send(var_to_bytes(message))


	func get_message() -> Variant:
		if socket.get_available_packet_count() < 1:
			return null
		var pkt := socket.get_packet()
		if socket.was_string_packet():
			return pkt.get_string_from_utf8()
		return bytes_to_var(pkt)


	func close(code: int = 1000, reason: String = "") -> void:
		socket.close(code, reason)
		last_state = socket.get_ready_state()


	func clear() -> void:
		socket = WebSocketPeer.new()
		last_state = socket.get_ready_state()


	func get_socket() -> WebSocketPeer:
		return socket

	func poll() -> void:
		if socket.get_ready_state() != socket.STATE_CLOSED:
			socket.poll()

		var state := socket.get_ready_state()

		if last_state != state:
			last_state = state
			if state == socket.STATE_OPEN:
				connected_to_server.emit()
			elif state == socket.STATE_CLOSED:
				connection_closed.emit()
		while socket.get_ready_state() == socket.STATE_OPEN and socket.get_available_packet_count():
			message_received.emit(get_message())

var socket
func _ready() -> void:
	var url: String = JavaScriptBridge.eval("window.location.href", true)
	print("Game came from:", url)
	url = url.replace("http", "ws")
	if url:
		socket = w_socket.new(handshake_headers, supported_protocols)
		print("Connecting to:", url)
		socket.connect_to_url(url)
		socket.message_received.connect(func(message: String):
			if message == "get?modules":
				var msg = "modules?"
				var module_names = []
				for child in get_children():
					if child is m_ModuleBase:
						module_names.append(child.v_getNameString())
				
				if module_names.size() > 0:
					msg += ",".join(module_names)
				print("sending modules to, msg sent: " + msg)
				socket.send(msg)
		)
		socket.connection_closed.connect(func():
			get_tree().change_scene_to_file("res://scenes/main.tscn")
		)
	else:
		print("url is nil")

func _process(delta: float) -> void:
	if socket:
		socket.poll()
