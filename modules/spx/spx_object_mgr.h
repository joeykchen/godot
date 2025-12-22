/**************************************************************************/
/*  spx_object_mgr.h                                                      */
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

#ifndef SPX_OBJECT_MGR_H
#define SPX_OBJECT_MGR_H

#include "spx_base_mgr.h"
#include "core/os/mutex.h"
#include "core/templates/hash_map.h"
#include "gdextension_spx_ext.h"

/**
 * @brief Generic object manager template for SPX objects
 * 
 * This template provides common functionality for managing SPX objects:
 * - Thread-safe object storage and retrieval
 * - Automatic lifecycle management (create, destroy, update)
 * - Common helper macros for null checks
 * 
 * @tparam T The type of object being managed (e.g., SpxAudio, SpxPen)
 */
template <typename T>
class SpxObjectMgr : public SpxBaseMgr {
protected:
	HashMap<GdObj, T *> id_objects;
	Mutex lock;
	Node2D *root = nullptr;
	
	/**
	 * @brief Create and register a new object
	 * Can be called directly from derived classes
	 */
	GdObj _create_object() {
		auto id = get_unique_id();
		T *node = memnew(T);
		lock.lock();
		node->on_create(id, root);
		id_objects[id] = node;
		lock.unlock();
		return id;
	}

	/**
	 * @brief Get object by ID (not thread-safe, caller should lock)
	 */
	T *_get_object(GdObj obj) const {
		if (id_objects.has(obj)) {
			return id_objects[obj];
		}
		return nullptr;
	}

	/**
	 * @brief Create root node for this manager's objects
	 */
	void _create_root(const String &name) {
		root = memnew(Node2D);
		root->set_name(name);
		get_spx_root()->add_child(root);
	}

	/**
	 * @brief Destroy all managed objects and root node
	 */
	void _destroy_all();

	/**
	 * @brief Update all managed objects
	 */
	void _update_all(float delta);

	/**
	 * @brief Reset all managed objects
	 */
	void _reset_all(int reset_code);

public:
	/**
	 * @brief Get object by ID (thread-safe)
	 */
	T *get_object(GdObj obj) {
		lock.lock();
		T *result = _get_object(obj);
		lock.unlock();
		return result;
	}

	/**
	 * @brief Destroy a managed object by ID
	 */
	void destroy_object(GdObj obj);

	/**
	 * @brief Get the number of managed objects
	 */
	int get_object_count() const {
		return id_objects.size();
	}

	virtual ~SpxObjectMgr() = default;
};

// Template method implementations (must be after class definition)
template <typename T>
void SpxObjectMgr<T>::_destroy_all() {
	lock.lock();
	for (const KeyValue<GdObj, T *> &E : id_objects) {
		E.value->on_destroy();
	}
	id_objects.clear();
	
	if (root) {
		root->queue_free();
		root = nullptr;
	}
	lock.unlock();
}

template <typename T>
void SpxObjectMgr<T>::_update_all(float delta) {
	lock.lock();
	for (const KeyValue<GdObj, T *> &E : id_objects) {
		E.value->on_update(delta);
	}
	lock.unlock();
}

template <typename T>
void SpxObjectMgr<T>::_reset_all(int reset_code) {
	lock.lock();
	for (const KeyValue<GdObj, T *> &E : id_objects) {
		E.value->on_reset(reset_code);
	}
	id_objects.clear();
	lock.unlock();
}

template <typename T>
void SpxObjectMgr<T>::destroy_object(GdObj obj) {
	lock.lock();
	T *object = _get_object(obj);
	if (object != nullptr) {
		id_objects.erase(obj);
		object->on_destroy();
	}
	lock.unlock();
}

// Common macros for checking and getting objects with error handling
#define SPX_CHECK_AND_GET_OBJECT_V(obj, getter, obj_type)                     \
	auto obj = getter;                                                         \
	if (obj == nullptr) {                                                      \
		print_error("try to access null " #obj_type " object");                \
		return;                                                                \
	}

#define SPX_CHECK_AND_GET_OBJECT_R(obj, getter, obj_type, ret_value)          \
	auto obj = getter;                                                         \
	if (obj == nullptr) {                                                      \
		print_error("try to access null " #obj_type " object");                \
		return ret_value;                                                      \
	}

#endif // SPX_OBJECT_MGR_H
