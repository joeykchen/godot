/**************************************************************************/
/*  spx_audio_mgr.cpp                                                     */
/**************************************************************************/
/*                         This file is part of:                          */
/*                             GODOT ENGINE                               */
/*                        https://godotengine.org                         */
/**************************************************************************/
/* Copyright (c) 2014-present Godot Engine contributors (see AUTHORS.md). */
/* Copyright (c) 2007-2014 Juan Linietsky, Ariel Manzur.                  */
/*                                                                        */
/* Permission is hereby granted, free of charge, to any person obtaining  */
/* a copy of this software and associated documentation files (the        */
/* "Software"), to deal in the Software without restriction, including    */
/* without limitation the rights to use, copy, modify, merge, publish,    */
/* distribute, sublicense, and/or sell copies of the Software, and to     */
/* permit persons to whom the Software is furnished to do so, subject to  */
/* the following conditions:                                              */
/*                                                                        */
/* The above copyright notice and this permission notice shall be         */
/* included in all copies or substantial portions of the Software.        */
/*                                                                        */
/* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,        */
/* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF     */
/* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. */
/* IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY   */
/* CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,   */
/* TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE      */
/* SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.                 */
/**************************************************************************/

#include "spx_audio_mgr.h"
#include "spx_audio.h"
#include "spx_audio_bus_pool.h"

#include "scene/2d/audio_stream_player_2d.h"
#include "spx_engine.h"
#include "spx_res_mgr.h"


#define check_and_get_audio_v()                                               \
	auto audio = _get_audio(obj);                                             \
	if (audio == nullptr) {                                                   \
		print_error("try to get property of a null audio gid=" + itos(obj));  \
		return;                                                               \
	}

#define check_and_get_audio_r(VALUE)                                          \
	auto audio = _get_audio(obj);                                             \
	if (audio == nullptr) {                                                   \
		print_error("try to get property of a null audio gid=" + itos(obj));  \
		return VALUE;                                                         \
	}

Mutex SpxAudioMgr::lock;

void SpxAudioMgr::on_awake() {
	SpxBaseMgr::on_awake();
	// Initialize SpxAudioBusPool
	SpxAudioBusPool::init();

	root = memnew(Node2D);
	root->set_name("audio_root");
	get_spx_root()->add_child(root);

}

void SpxAudioMgr::on_update(float delta) {
	SpxBaseMgr::on_update(delta);
	lock.lock();
	for (const KeyValue<GdObj, SpxAudio *> &E : id_audios) {
		E.value->on_update(delta);
	}
	lock.unlock();
}

void SpxAudioMgr::on_destroy() {
	lock.lock();
	for (const KeyValue<GdObj, SpxAudio *> &E : id_audios) {
		E.value->on_destroy();
	}
	id_audios.clear();
	if (root) {
		root->queue_free();
		root = nullptr;
	}
	lock.unlock();
	SpxBaseMgr::on_destroy();
}

SpxAudio *SpxAudioMgr::_get_audio(GdObj obj) {
	if (id_audios.has(obj)) {
		return id_audios[obj];
	}
	return nullptr;
}

void SpxAudioMgr::stop_all() {
	lock.lock();
	for (const KeyValue<GdObj, SpxAudio *> &E : id_audios) {
		E.value->stop_all();
	}
	lock.unlock();
}

GdObj SpxAudioMgr::create_audio() {
	auto id = get_unique_id();
	lock.lock();
	SpxAudio *node = memnew(SpxAudio);
	node->on_create(id, root);
	id_audios[id] = node;
	lock.unlock();
	return id;
}

void SpxAudioMgr::destroy_audio(GdObj obj) {
	lock.lock();
	auto audio = _get_audio(obj);
	if (audio != nullptr) {
		id_audios.erase(obj);
		audio->on_destroy();
	}
	lock.unlock();
}

GdBool SpxAudioMgr::is_playing(GdObj obj) {
	check_and_get_audio_r(false)
	return audio->is_playing();
}

void SpxAudioMgr::play(GdObj obj, GdString path) {
	check_and_get_audio_v()
	audio->play(path);
}

void SpxAudioMgr::pause(GdObj obj) {
	check_and_get_audio_v()
	audio->pause();
}

void SpxAudioMgr::resume(GdObj obj) {
	check_and_get_audio_v()
	audio->resume();
}

void SpxAudioMgr::stop(GdObj obj) {
	check_and_get_audio_v()
	audio->stop();
}

void SpxAudioMgr::set_loop(GdObj obj, GdBool loop) {
	check_and_get_audio_v()
	audio->set_loop(loop);
}

GdBool SpxAudioMgr::get_loop(GdObj obj) {
	check_and_get_audio_r(false)
	return audio->get_loop();
}

GdFloat SpxAudioMgr::get_timer(GdObj obj) {
	check_and_get_audio_r(0.0)
	return audio->get_timer();
}

void SpxAudioMgr::set_timer(GdObj obj, GdFloat time) {
	check_and_get_audio_v()
	audio->set_timer(time);
}

void SpxAudioMgr::set_pitch(GdObj obj, GdFloat pitch) {
	check_and_get_audio_v()
	audio->set_pitch(pitch);
}
GdFloat SpxAudioMgr::get_pitch(GdObj obj) {
	check_and_get_audio_r(0.0)
	return audio->get_pitch();
}
void SpxAudioMgr::set_pan(GdObj obj, GdFloat pan) {
	check_and_get_audio_v()
	audio->set_pan(pan);
}
GdFloat SpxAudioMgr::get_pan(GdObj obj) {
	check_and_get_audio_r(0.0)
	return audio->get_pan();
}

void SpxAudioMgr::set_volume(GdObj obj, GdFloat volume) {
	check_and_get_audio_v()
	audio->set_volume(volume);
}

GdFloat SpxAudioMgr::get_volume(GdObj obj) {
	check_and_get_audio_r(0.0)
	return audio->get_volume();
}
