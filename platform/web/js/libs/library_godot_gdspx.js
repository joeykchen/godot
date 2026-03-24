const DIRECT_CALLBACK_HANDLER_SLOTS = globalThis.__spxDirectCallbackHandlerSlots || (globalThis.__spxDirectCallbackHandlerSlots = Object.create(null));

const GodotGdspx = {
	$GodotGdspx__deps: ['$GodotConfig', '$GodotRuntime', '$GodotFS'],
	$GodotGdspx: {
		getDirectHandler: function (exportName) {
			const directHandler = DIRECT_CALLBACK_HANDLER_SLOTS[exportName];
			return typeof directHandler === 'function' ? directHandler : null;
		},

		// Direct callbacks use native BigInt object ids to avoid boxing on the hot
		// path. The FFI fallback keeps the legacy { low, high } shape for
		// compatibility with older callback bridges.
		toCallbackInt: function (ptr, directHandler) {
			if (typeof directHandler === 'function') {
				return GodotRuntime.ToJsBigInt(ptr);
			}
			return GodotRuntime.ToJsInt(ptr);
		},

		toCallbackObj: function (ptr, directHandler) {
			if (typeof directHandler === 'function') {
				return GodotRuntime.ToJsBigObj(ptr);
			}
			return GodotRuntime.ToJsObj(ptr);
		},

		callN: function (exportName, eventName, directHandler, ...args) {
			if (typeof directHandler === 'function') {
				directHandler(...args);
				return;
			}
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
			GodotGdspx.callN(exportName, null, null, ...args);
		},

		call0: function (exportName, eventName, directHandler = null) {
			GodotGdspx.callN(exportName, eventName, directHandler);
		},

		call1: function (exportName, eventName, arg0, directHandler = null) {
			GodotGdspx.callN(exportName, eventName, directHandler, arg0);
		},

		call2: function (exportName, eventName, arg0, arg1, directHandler = null) {
			GodotGdspx.callN(exportName, eventName, directHandler, arg0, arg1);
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
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_engine_update");
		GodotGdspx.call1("gdspx_on_engine_update", "OnEngineUpdate", delta, directHandler);
	},

	godot_js_spx_on_engine_fixed_update__sig: 'vf',
	godot_js_spx_on_engine_fixed_update: function (delta) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_engine_fixed_update");
		GodotGdspx.call1("gdspx_on_engine_fixed_update", "OnEngineFixedUpdate", delta, directHandler);
	},

	godot_js_spx_on_engine_destroy__sig: 'v',
	godot_js_spx_on_engine_destroy: function () {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_engine_destroy");
		GodotGdspx.call0("gdspx_on_engine_destroy", "OnEngineDestroy", directHandler);
	},

	godot_js_spx_on_engine_reset__sig: 'v',
	godot_js_spx_on_engine_reset: function () {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_engine_reset");
		GodotGdspx.call0("gdspx_on_engine_reset", "OnEngineReset", directHandler);
	},

	godot_js_spx_on_reset_done__sig: 'vi',
	godot_js_spx_on_reset_done: function (code) {
		// Reset completion uses a dedicated export and has no dispatch-based fallback.
		GodotGdspx.callDirect("gdspx_on_runtime_reset", code);
	},

	godot_js_spx_on_engine_pause__sig: 'vi',
	godot_js_spx_on_engine_pause: function (is_on) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_engine_pause");
		GodotGdspx.call1("gdspx_on_engine_pause", "OnEnginePause", is_on, directHandler);
	},

	godot_js_spx_on_scene_sprite_instantiated__sig: 'vii',
	godot_js_spx_on_scene_sprite_instantiated: function (obj, type_name) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_scene_sprite_instantiated");
		GodotGdspx.call2(
			"gdspx_on_scene_sprite_instantiated",
			"OnSceneSpriteInstantiated",
			GodotGdspx.toCallbackObj(obj, directHandler),
			GodotRuntime.parseString(type_name),
			directHandler
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
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_sprite_ready");
		GodotGdspx.call1("gdspx_on_sprite_ready", "OnSpriteReady", GodotGdspx.toCallbackObj(obj, directHandler), directHandler);
	},

	godot_js_spx_on_sprite_updated__sig: 'vf',
	godot_js_spx_on_sprite_updated: function (delta) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_sprite_updated");
		GodotGdspx.call1("gdspx_on_sprite_updated", "OnSpriteUpdated", delta, directHandler);
	},

	godot_js_spx_on_sprite_fixed_updated__sig: 'vf',
	godot_js_spx_on_sprite_fixed_updated: function (delta) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_sprite_fixed_updated");
		GodotGdspx.call1("gdspx_on_sprite_fixed_updated", "OnSpriteFixedUpdated", delta, directHandler);
	},

	godot_js_spx_on_sprite_destroyed__sig: 'vi',
	godot_js_spx_on_sprite_destroyed: function (obj) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_sprite_destroyed");
		GodotGdspx.call1("gdspx_on_sprite_destroyed", "OnSpriteDestroyed", GodotGdspx.toCallbackObj(obj, directHandler), directHandler);
	},

	godot_js_spx_on_sprite_frames_set_changed__sig: 'vi',
	godot_js_spx_on_sprite_frames_set_changed: function (obj) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_sprite_frames_set_changed");
		GodotGdspx.call1("gdspx_on_sprite_frames_set_changed", "OnSpriteFramesSetChanged", GodotGdspx.toCallbackObj(obj, directHandler), directHandler);
	},

	godot_js_spx_on_sprite_animation_changed__sig: 'vi',
	godot_js_spx_on_sprite_animation_changed: function (obj) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_sprite_animation_changed");
		GodotGdspx.call1("gdspx_on_sprite_animation_changed", "OnSpriteAnimationChanged", GodotGdspx.toCallbackObj(obj, directHandler), directHandler);
	},

	godot_js_spx_on_sprite_frame_changed__sig: 'vi',
	godot_js_spx_on_sprite_frame_changed: function (obj) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_sprite_frame_changed");
		GodotGdspx.call1("gdspx_on_sprite_frame_changed", "OnSpriteFrameChanged", GodotGdspx.toCallbackObj(obj, directHandler), directHandler);
	},

	godot_js_spx_on_sprite_animation_looped__sig: 'vi',
	godot_js_spx_on_sprite_animation_looped: function (obj) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_sprite_animation_looped");
		GodotGdspx.call1("gdspx_on_sprite_animation_looped", "OnSpriteAnimationLooped", GodotGdspx.toCallbackObj(obj, directHandler), directHandler);
	},

	godot_js_spx_on_sprite_animation_finished__sig: 'vi',
	godot_js_spx_on_sprite_animation_finished: function (obj) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_sprite_animation_finished");
		GodotGdspx.call1("gdspx_on_sprite_animation_finished", "OnSpriteAnimationFinished", GodotGdspx.toCallbackObj(obj, directHandler), directHandler);
	},

	godot_js_spx_on_sprite_vfx_finished__sig: 'vi',
	godot_js_spx_on_sprite_vfx_finished: function (obj) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_sprite_vfx_finished");
		GodotGdspx.call1("gdspx_on_sprite_vfx_finished", "OnSpriteVfxFinished", GodotGdspx.toCallbackObj(obj, directHandler), directHandler);
	},

	godot_js_spx_on_sprite_screen_exited__sig: 'vi',
	godot_js_spx_on_sprite_screen_exited: function (obj) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_sprite_screen_exited");
		GodotGdspx.call1("gdspx_on_sprite_screen_exited", "OnSpriteScreenExited", GodotGdspx.toCallbackObj(obj, directHandler), directHandler);
	},

	godot_js_spx_on_sprite_screen_entered__sig: 'vi',
	godot_js_spx_on_sprite_screen_entered: function (obj) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_sprite_screen_entered");
		GodotGdspx.call1("gdspx_on_sprite_screen_entered", "OnSpriteScreenEntered", GodotGdspx.toCallbackObj(obj, directHandler), directHandler);
	},

	godot_js_spx_on_mouse_pressed__sig: 'vi',
	godot_js_spx_on_mouse_pressed: function (keyid) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_mouse_pressed");
		GodotGdspx.call1("gdspx_on_mouse_pressed", "OnMousePressed", GodotGdspx.toCallbackInt(keyid, directHandler), directHandler);
	},

	godot_js_spx_on_mouse_released__sig: 'vi',
	godot_js_spx_on_mouse_released: function (keyid) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_mouse_released");
		GodotGdspx.call1("gdspx_on_mouse_released", "OnMouseReleased", GodotGdspx.toCallbackInt(keyid, directHandler), directHandler);
	},

	godot_js_spx_on_key_pressed__sig: 'vi',
	godot_js_spx_on_key_pressed: function (keyid) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_key_pressed");
		GodotGdspx.call1("gdspx_on_key_pressed", "OnKeyPressed", GodotGdspx.toCallbackInt(keyid, directHandler), directHandler);
	},

	godot_js_spx_on_key_released__sig: 'vi',
	godot_js_spx_on_key_released: function (keyid) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_key_released");
		GodotGdspx.call1("gdspx_on_key_released", "OnKeyReleased", GodotGdspx.toCallbackInt(keyid, directHandler), directHandler);
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
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_collision_enter");
		GodotGdspx.call2("gdspx_on_collision_enter", "OnCollisionEnter", GodotGdspx.toCallbackInt(self_id, directHandler), GodotGdspx.toCallbackInt(other_id, directHandler), directHandler);
	},

	godot_js_spx_on_collision_stay__sig: 'vii',
	godot_js_spx_on_collision_stay: function (self_id, other_id) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_collision_stay");
		GodotGdspx.call2("gdspx_on_collision_stay", "OnCollisionStay", GodotGdspx.toCallbackInt(self_id, directHandler), GodotGdspx.toCallbackInt(other_id, directHandler), directHandler);
	},

	godot_js_spx_on_collision_exit__sig: 'vii',
	godot_js_spx_on_collision_exit: function (self_id, other_id) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_collision_exit");
		GodotGdspx.call2("gdspx_on_collision_exit", "OnCollisionExit", GodotGdspx.toCallbackInt(self_id, directHandler), GodotGdspx.toCallbackInt(other_id, directHandler), directHandler);
	},

	godot_js_spx_on_trigger_enter__sig: 'vii',
	godot_js_spx_on_trigger_enter: function (self_id, other_id) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_trigger_enter");
		GodotGdspx.call2("gdspx_on_trigger_enter", "OnTriggerEnter", GodotGdspx.toCallbackInt(self_id, directHandler), GodotGdspx.toCallbackInt(other_id, directHandler), directHandler);
	},

	godot_js_spx_on_trigger_stay__sig: 'vii',
	godot_js_spx_on_trigger_stay: function (self_id, other_id) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_trigger_stay");
		GodotGdspx.call2("gdspx_on_trigger_stay", "OnTriggerStay", GodotGdspx.toCallbackInt(self_id, directHandler), GodotGdspx.toCallbackInt(other_id, directHandler), directHandler);
	},

	godot_js_spx_on_trigger_exit__sig: 'vii',
	godot_js_spx_on_trigger_exit: function (self_id, other_id) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_trigger_exit");
		GodotGdspx.call2("gdspx_on_trigger_exit", "OnTriggerExit", GodotGdspx.toCallbackInt(self_id, directHandler), GodotGdspx.toCallbackInt(other_id, directHandler), directHandler);
	},

	godot_js_spx_on_ui_ready__sig: 'vi',
	godot_js_spx_on_ui_ready: function (obj) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_ui_ready");
		GodotGdspx.call1("gdspx_on_ui_ready", "OnUiReady", GodotGdspx.toCallbackObj(obj, directHandler), directHandler);
	},

	godot_js_spx_on_ui_updated__sig: 'vi',
	godot_js_spx_on_ui_updated: function (obj) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_ui_updated");
		GodotGdspx.call1("gdspx_on_ui_updated", "OnUiUpdated", GodotGdspx.toCallbackObj(obj, directHandler), directHandler);
	},

	godot_js_spx_on_ui_destroyed__sig: 'vi',
	godot_js_spx_on_ui_destroyed: function (obj) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_ui_destroyed");
		GodotGdspx.call1("gdspx_on_ui_destroyed", "OnUiDestroyed", GodotGdspx.toCallbackObj(obj, directHandler), directHandler);
	},

	godot_js_spx_on_ui_pressed__sig: 'vi',
	godot_js_spx_on_ui_pressed: function (obj) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_ui_pressed");
		GodotGdspx.call1("gdspx_on_ui_pressed", "OnUiPressed", GodotGdspx.toCallbackObj(obj, directHandler), directHandler);
	},

	godot_js_spx_on_ui_released__sig: 'vi',
	godot_js_spx_on_ui_released: function (obj) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_ui_released");
		GodotGdspx.call1("gdspx_on_ui_released", "OnUiReleased", GodotGdspx.toCallbackObj(obj, directHandler), directHandler);
	},

	godot_js_spx_on_ui_hovered__sig: 'vi',
	godot_js_spx_on_ui_hovered: function (obj) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_ui_hovered");
		GodotGdspx.call1("gdspx_on_ui_hovered", "OnUiHovered", GodotGdspx.toCallbackObj(obj, directHandler), directHandler);
	},

	godot_js_spx_on_ui_clicked__sig: 'vi',
	godot_js_spx_on_ui_clicked: function (obj) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_ui_clicked");
		GodotGdspx.call1("gdspx_on_ui_clicked", "OnUiClicked", GodotGdspx.toCallbackObj(obj, directHandler), directHandler);
	},

	godot_js_spx_on_ui_toggle__sig: 'vii',
	godot_js_spx_on_ui_toggle: function (obj, is_on) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_ui_toggle");
		GodotGdspx.call2("gdspx_on_ui_toggle", "OnUiToggle", GodotGdspx.toCallbackObj(obj, directHandler), is_on, directHandler);
	},

	godot_js_spx_on_ui_text_changed__sig: 'vii',
	godot_js_spx_on_ui_text_changed: function (obj, text) {
		const directHandler = GodotGdspx.getDirectHandler("gdspx_on_ui_text_changed");
		GodotGdspx.call2("gdspx_on_ui_text_changed", "OnUiTextChanged", GodotGdspx.toCallbackObj(obj, directHandler), GodotRuntime.parseString(text), directHandler);
	},
};

autoAddDeps(GodotGdspx, '$GodotGdspx');
mergeInto(LibraryManager.library, GodotGdspx);
