extends CharacterBody2D

@export var colors = [Color.ROYAL_BLUE, Color.DARK_ORANGE, Color.DARK_GREEN, Color.DARK_MAGENTA, Color.ORANGE, Color.CYAN, Color.RED]
@export var initial_speed = 250
@export var speed = 0
@export var can_move = false
@export var direction = Vector2(0, 0)
@export var camera: Camera2D
@export var bonk_sfx: AudioStreamPlayer2D

##
## Godot Methods
##

func _ready():
	get_tree().get_root().set_transparent_background(true)
	start_moving()

func _process(delta):
	if Input.is_action_just_pressed("play_logo"):
		start_moving()
		
	if Input.is_action_just_pressed("increase_speed"):
		increase_speed()
	
	if Input.is_action_just_pressed("decrease_speed"):
		decrease_speed()
		
	if Input.is_action_just_pressed("reset_speed"):
		reset_speed()
	
	if can_move:
		calc_screen_border_collision()

func _physics_process(delta):
	position += direction.normalized() * speed * delta

##
## Game Logic
##

func start_moving():
	position_logo_at_center()
	change_color()
	speed = initial_speed
	can_move = true
	direction = Vector2(1, 1)

func calc_screen_border_collision():
	var screen_size = get_viewport_rect().size
	var collision_box = get_node("CollisionShape2D").get_shape().extents
	
	var collision_right = position.x + collision_box.x * 2
	var collision_left = position.x - collision_box.x * 2
	var collision_down = position.y + collision_box.y * 2
	var collision_up = position.y - collision_box.y * 2
	
	if collision_right > screen_size.x:
		direction = reflect_x_direction(direction)
		change_color()
	
	if collision_left < 0:
		direction = reflect_x_direction(direction)
		change_color()
	
	if collision_down > screen_size.y:
		direction = reflect_y_direction(direction)
		change_color()
		
	if collision_up < 0:
		direction = reflect_y_direction(direction)
		change_color()

	print(Vector2(screen_size.x / 2, screen_size.y / 2))
	camera.position = Vector2(screen_size.x / 2, screen_size.y / 2)

func reflect_x_direction(dir):
	dir.x *= -1
	return dir

func reflect_y_direction(dir):
	dir.y *= -1
	return dir

func change_color():
	var color: Color = colors[randi() % colors.size()]
	get_node("Sprite2D").modulate = color
	
	randomize()
	colors.shuffle()
	bonk_sfx.play()

func randomize_color():
	var color: Color = colors[randi() % colors.size()]
	randomize()
	colors = (func(): colors.shuffle(); return colors).call()

func position_logo_at_center():
	var screen_size = get_viewport_rect().size
	position = Vector2(screen_size.x / 2, screen_size.y / 2)

func increase_speed():
	speed += 100

func decrease_speed():
	speed -= 100

func reset_speed():
	speed = initial_speed
