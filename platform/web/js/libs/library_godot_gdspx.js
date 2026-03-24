const GodotGdspx = {
	$GodotGdspx__deps: ['$GodotConfig', '$GodotRuntime', '$GodotFS'],
	$GodotGdspx: {
		callN: function (exportName, eventName, ...args) {
			if (!FFI) {
				return;
			}
			const direct = FFI[exportName];
			if (typeof direct === 'function') {
				direct.call(FFI, ...args);
				return;
			}
			if (eventName) {
				FFI.gdspx_dispatch(eventName, ...args);
			}
		},

		callDirect: function (exportName, ...args) {
			GodotGdspx.callN(exportName, null, ...args);
		},

		call0: function (exportName, eventName) {
			GodotGdspx.callN(exportName, eventName);
		},

		call1: function (exportName, eventName, arg0) {
			GodotGdspx.callN(exportName, eventName, arg0);
		},

		call2: function (exportName, eventName, arg0, arg1) {
			GodotGdspx.callN(exportName, eventName, arg0, arg1);
		},
	},

	// godot gdspx extensions
	godot_js_spx_on_engine_start__sig: 'v',
	godot_js_spx_on_engine_start: async function () {
		FFI = null;
		if (typeof self.initExtensionWasm === 'function') {
			await self.initExtensionWasm();
			return;
		}
		GodotRuntime.error('Missing self.initExtensionWasm for gdspx web callbacks.');
	},

	godot_js_spx_on_engine_update__sig: 'vf',
	godot_js_spx_on_engine_update: function (delta) {
		GodotGdspx.call1("gdspx_on_engine_update", "OnEngineUpdate", delta);
	},

	godot_js_spx_on_engine_fixed_update__sig: 'vf',
	godot_js_spx_on_engine_fixed_update: function (delta) {
		GodotGdspx.call1("gdspx_on_engine_fixed_update", "OnEngineFixedUpdate", delta);
	},

	godot_js_spx_on_engine_destroy__sig: 'v',
	godot_js_spx_on_engine_destroy: function () {
		GodotGdspx.call0("gdspx_on_engine_destroy", "OnEngineDestroy");
	},

	godot_js_spx_on_engine_reset__sig: 'v',
	godot_js_spx_on_engine_reset: function () {
		GodotGdspx.call0("gdspx_on_engine_reset", "OnEngineReset");
	},

	godot_js_spx_on_reset_done__sig: 'vi',
	godot_js_spx_on_reset_done: function (code) {
		// Reset completion uses a dedicated export and has no dispatch-based fallback.
		GodotGdspx.callDirect("gdspx_on_runtime_reset", code);
	},

	godot_js_spx_on_engine_pause__sig: 'vi',
	godot_js_spx_on_engine_pause: function (is_on) {
		GodotGdspx.call1("gdspx_on_engine_pause", "OnEnginePause", is_on);
	},

	godot_js_spx_on_scene_sprite_instantiated__sig: 'vii',
	godot_js_spx_on_scene_sprite_instantiated: function (obj, type_name) {
		GodotGdspx.call2(
			"gdspx_on_scene_sprite_instantiated",
			"OnSceneSpriteInstantiated",
			GodotRuntime.ToJsObj(obj),
			GodotRuntime.parseString(type_name)
		);
	},

	godot_js_spx_on_runtime_panic__sig: 'vi',
	godot_js_spx_on_runtime_panic: function (msg) {
		GodotGdspx.callDirect("gdspx_on_runtime_panic", GodotRuntime.parseString(msg));
	},

	godot_js_spx_on_runtime_exit__sig: 'vi',
	godot_js_spx_on_runtime_exit: function (code) {
		GodotGdspx.callDirect("gdspx_on_runtime_exit", code);
	},

	godot_js_spx_on_sprite_ready__sig: 'vi',
	godot_js_spx_on_sprite_ready: function (obj) {
		GodotGdspx.call1("gdspx_on_sprite_ready", "OnSpriteReady", GodotRuntime.ToJsObj(obj));
	},

	godot_js_spx_on_sprite_updated__sig: 'vf',
	godot_js_spx_on_sprite_updated: function (delta) {
		GodotGdspx.call1("gdspx_on_sprite_updated", "OnSpriteUpdated", delta);
	},

	godot_js_spx_on_sprite_fixed_updated__sig: 'vf',
	godot_js_spx_on_sprite_fixed_updated: function (delta) {
		GodotGdspx.call1("gdspx_on_sprite_fixed_updated", "OnSpriteFixedUpdated", delta);
	},

	godot_js_spx_on_sprite_destroyed__sig: 'vi',
	godot_js_spx_on_sprite_destroyed: function (obj) {
		GodotGdspx.call1("gdspx_on_sprite_destroyed", "OnSpriteDestroyed", GodotRuntime.ToJsObj(obj));
	},

	godot_js_spx_on_sprite_frames_set_changed__sig: 'vi',
	godot_js_spx_on_sprite_frames_set_changed: function (obj) {
		GodotGdspx.call1("gdspx_on_sprite_frames_set_changed", "OnSpriteFramesSetChanged", GodotRuntime.ToJsObj(obj));
	},

	godot_js_spx_on_sprite_animation_changed__sig: 'vi',
	godot_js_spx_on_sprite_animation_changed: function (obj) {
		GodotGdspx.call1("gdspx_on_sprite_animation_changed", "OnSpriteAnimationChanged", GodotRuntime.ToJsObj(obj));
	},

	godot_js_spx_on_sprite_frame_changed__sig: 'vi',
	godot_js_spx_on_sprite_frame_changed: function (obj) {
		GodotGdspx.call1("gdspx_on_sprite_frame_changed", "OnSpriteFrameChanged", GodotRuntime.ToJsObj(obj));
	},

	godot_js_spx_on_sprite_animation_looped__sig: 'vi',
	godot_js_spx_on_sprite_animation_looped: function (obj) {
		GodotGdspx.call1("gdspx_on_sprite_animation_looped", "OnSpriteAnimationLooped", GodotRuntime.ToJsObj(obj));
	},

	godot_js_spx_on_sprite_animation_finished__sig: 'vi',
	godot_js_spx_on_sprite_animation_finished: function (obj) {
		GodotGdspx.call1("gdspx_on_sprite_animation_finished", "OnSpriteAnimationFinished", GodotRuntime.ToJsObj(obj));
	},

	godot_js_spx_on_sprite_vfx_finished__sig: 'vi',
	godot_js_spx_on_sprite_vfx_finished: function (obj) {
		GodotGdspx.call1("gdspx_on_sprite_vfx_finished", "OnSpriteVfxFinished", GodotRuntime.ToJsObj(obj));
	},

	godot_js_spx_on_sprite_screen_exited__sig: 'vi',
	godot_js_spx_on_sprite_screen_exited: function (obj) {
		GodotGdspx.call1("gdspx_on_sprite_screen_exited", "OnSpriteScreenExited", GodotRuntime.ToJsObj(obj));
	},

	godot_js_spx_on_sprite_screen_entered__sig: 'vi',
	godot_js_spx_on_sprite_screen_entered: function (obj) {
		GodotGdspx.call1("gdspx_on_sprite_screen_entered", "OnSpriteScreenEntered", GodotRuntime.ToJsObj(obj));
	},

	godot_js_spx_on_mouse_pressed__sig: 'vi',
	godot_js_spx_on_mouse_pressed: function (keyid) {
		GodotGdspx.call1("gdspx_on_mouse_pressed", "OnMousePressed", GodotRuntime.ToJsInt(keyid));
	},

	godot_js_spx_on_mouse_released__sig: 'vi',
	godot_js_spx_on_mouse_released: function (keyid) {
		GodotGdspx.call1("gdspx_on_mouse_released", "OnMouseReleased", GodotRuntime.ToJsInt(keyid));
	},

	godot_js_spx_on_key_pressed__sig: 'vi',
	godot_js_spx_on_key_pressed: function (keyid) {
		GodotGdspx.call1("gdspx_on_key_pressed", "OnKeyPressed", GodotRuntime.ToJsInt(keyid));
	},

	godot_js_spx_on_key_released__sig: 'vi',
	godot_js_spx_on_key_released: function (keyid) {
		GodotGdspx.call1("gdspx_on_key_released", "OnKeyReleased", GodotRuntime.ToJsInt(keyid));
	},

	godot_js_spx_on_action_pressed__sig: 'vi',
	godot_js_spx_on_action_pressed: function (action_name) {
		GodotGdspx.call1("gdspx_on_action_pressed", "OnActionPressed", GodotRuntime.parseString(action_name));
	},

	godot_js_spx_on_action_just_pressed__sig: 'vi',
	godot_js_spx_on_action_just_pressed: function (action_name) {
		GodotGdspx.call1("gdspx_on_action_just_pressed", "OnActionJustPressed", GodotRuntime.parseString(action_name));
	},

	godot_js_spx_on_action_just_released__sig: 'vi',
	godot_js_spx_on_action_just_released: function (action_name) {
		GodotGdspx.call1("gdspx_on_action_just_released", "OnActionJustReleased", GodotRuntime.parseString(action_name));
	},

	godot_js_spx_on_axis_changed__sig: 'vif',
	godot_js_spx_on_axis_changed: function (action_name, value) {
		GodotGdspx.call2("gdspx_on_axis_changed", "OnAxisChanged", GodotRuntime.parseString(action_name), value);
	},

	godot_js_spx_on_collision_enter__sig: 'vii',
	godot_js_spx_on_collision_enter: function (self_id, other_id) {
		GodotGdspx.call2("gdspx_on_collision_enter", "OnCollisionEnter", GodotRuntime.ToJsInt(self_id), GodotRuntime.ToJsInt(other_id));
	},

	godot_js_spx_on_collision_stay__sig: 'vii',
	godot_js_spx_on_collision_stay: function (self_id, other_id) {
		GodotGdspx.call2("gdspx_on_collision_stay", "OnCollisionStay", GodotRuntime.ToJsInt(self_id), GodotRuntime.ToJsInt(other_id));
	},

	godot_js_spx_on_collision_exit__sig: 'vii',
	godot_js_spx_on_collision_exit: function (self_id, other_id) {
		GodotGdspx.call2("gdspx_on_collision_exit", "OnCollisionExit", GodotRuntime.ToJsInt(self_id), GodotRuntime.ToJsInt(other_id));
	},

	godot_js_spx_on_trigger_enter__sig: 'vii',
	godot_js_spx_on_trigger_enter: function (self_id, other_id) {
		GodotGdspx.call2("gdspx_on_trigger_enter", "OnTriggerEnter", GodotRuntime.ToJsInt(self_id), GodotRuntime.ToJsInt(other_id));
	},

	godot_js_spx_on_trigger_stay__sig: 'vii',
	godot_js_spx_on_trigger_stay: function (self_id, other_id) {
		GodotGdspx.call2("gdspx_on_trigger_stay", "OnTriggerStay", GodotRuntime.ToJsInt(self_id), GodotRuntime.ToJsInt(other_id));
	},

	godot_js_spx_on_trigger_exit__sig: 'vii',
	godot_js_spx_on_trigger_exit: function (self_id, other_id) {
		GodotGdspx.call2("gdspx_on_trigger_exit", "OnTriggerExit", GodotRuntime.ToJsInt(self_id), GodotRuntime.ToJsInt(other_id));
	},

	godot_js_spx_on_ui_ready__sig: 'vi',
	godot_js_spx_on_ui_ready: function (obj) {
		GodotGdspx.call1("gdspx_on_ui_ready", "OnUiReady", GodotRuntime.ToJsObj(obj));
	},

	godot_js_spx_on_ui_updated__sig: 'vi',
	godot_js_spx_on_ui_updated: function (obj) {
		GodotGdspx.call1("gdspx_on_ui_updated", "OnUiUpdated", GodotRuntime.ToJsObj(obj));
	},

	godot_js_spx_on_ui_destroyed__sig: 'vi',
	godot_js_spx_on_ui_destroyed: function (obj) {
		GodotGdspx.call1("gdspx_on_ui_destroyed", "OnUiDestroyed", GodotRuntime.ToJsObj(obj));
	},

	godot_js_spx_on_ui_pressed__sig: 'vi',
	godot_js_spx_on_ui_pressed: function (obj) {
		GodotGdspx.call1("gdspx_on_ui_pressed", "OnUiPressed", GodotRuntime.ToJsObj(obj));
	},

	godot_js_spx_on_ui_released__sig: 'vi',
	godot_js_spx_on_ui_released: function (obj) {
		GodotGdspx.call1("gdspx_on_ui_released", "OnUiReleased", GodotRuntime.ToJsObj(obj));
	},

	godot_js_spx_on_ui_hovered__sig: 'vi',
	godot_js_spx_on_ui_hovered: function (obj) {
		GodotGdspx.call1("gdspx_on_ui_hovered", "OnUiHovered", GodotRuntime.ToJsObj(obj));
	},

	godot_js_spx_on_ui_clicked__sig: 'vi',
	godot_js_spx_on_ui_clicked: function (obj) {
		GodotGdspx.call1("gdspx_on_ui_clicked", "OnUiClicked", GodotRuntime.ToJsObj(obj));
	},

	godot_js_spx_on_ui_toggle__sig: 'vii',
	godot_js_spx_on_ui_toggle: function (obj, is_on) {
		GodotGdspx.call2("gdspx_on_ui_toggle", "OnUiToggle", GodotRuntime.ToJsObj(obj), is_on);
	},

	godot_js_spx_on_ui_text_changed__sig: 'vii',
	godot_js_spx_on_ui_text_changed: function (obj, text) {
		GodotGdspx.call2("gdspx_on_ui_text_changed", "OnUiTextChanged", GodotRuntime.ToJsObj(obj), GodotRuntime.parseString(text));
	},
};

autoAddDeps(GodotGdspx, '$GodotGdspx');
mergeInto(LibraryManager.library, GodotGdspx);
