/**************************************************************************/
/*  spx_sprite_collision.cpp                                              */
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
/* MERCHANTABILITY AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR  */
/* COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, */
/* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT */
/* OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN  */
/* THE SOFTWARE.                                                          */
/**************************************************************************/

#include "spx_sprite.h"

#include "scene/2d/physics/area_2d.h"
#include "scene/2d/physics/collision_shape_2d.h"
#include "scene/resources/2d/capsule_shape_2d.h"
#include "scene/resources/2d/circle_shape_2d.h"
#include "scene/resources/2d/convex_polygon_shape_2d.h"
#include "scene/resources/2d/rectangle_shape_2d.h"

#include "spx_base_mgr.h"

namespace {

template <typename TShape>
void apply_shape(CollisionShape2D *collision_shape, const Ref<TShape> &shape, GdVec2 center) {
	if (collision_shape == nullptr) {
		return;
	}

	collision_shape->set_shape(shape);
	collision_shape->set_position(center);
}

bool build_polygon_points(GdArray points, GdBool invert_y, Vector<Vector2> &r_points) {
	if (!points || points->size < 6) {
		return false;
	}

	const float *data = SpxBaseMgr::get_array<float>(points, 0);
	int point_count = points->size / 2;

	for (int i = 0; i < point_count; ++i) {
		float y = data[i * 2 + 1];
		r_points.push_back(Vector2(data[i * 2], invert_y ? -y : y));
	}

	return true;
}

} // namespace

bool SpxSprite::_can_enable_collider() const {
	return physics_mode != NO_PHYSICS && _is_collision_enabled && is_visible();
}

void SpxSprite::_update_collider_disabled_state() {
	if (collider2d != nullptr) {
		collider2d->set_disabled(!_can_enable_collider());
	}
}

void SpxSprite::_update_trigger_disabled_state() {
	if (trigger2d != nullptr) {
		trigger2d->set_disabled(!(_is_trigger_enabled && is_visible()));
	}
}

void SpxSprite::set_trigger_layer(GdInt layer) {
	area2d->set_collision_layer((uint32_t)layer);
}

GdInt SpxSprite::get_trigger_layer() {
	return area2d->get_collision_layer();
}

void SpxSprite::set_trigger_mask(GdInt mask) {
	area2d->set_collision_mask((uint32_t)mask);
}

GdInt SpxSprite::get_trigger_mask() {
	return area2d->get_collision_mask();
}

void SpxSprite::set_collider_rect(GdVec2 center, GdVec2 size) {
	Ref<RectangleShape2D> rect = memnew(RectangleShape2D);
	rect->set_size(size);
	apply_shape(collider2d, rect, center);
}

void SpxSprite::on_set_visible(GdBool) {
	_update_collider_disabled_state();
	_update_trigger_disabled_state();
}

void SpxSprite::set_collider_circle(GdVec2 center, GdFloat radius) {
	Ref<CircleShape2D> circle = memnew(CircleShape2D);
	circle->set_radius(radius);
	apply_shape(collider2d, circle, center);
}

void SpxSprite::set_collider_capsule(GdVec2 center, GdVec2 size) {
	Ref<CapsuleShape2D> capsule = memnew(CapsuleShape2D);
	capsule->set_radius(size.x / 2);
	capsule->set_height(size.y);
	apply_shape(collider2d, capsule, center);
}

void SpxSprite::set_collider_polygon(GdVec2 center, GdArray points) {
	Vector<Vector2> polygon_points;
	if (!build_polygon_points(points, false, polygon_points)) {
		print_error("set_collider_polygon: need at least 3 points");
		return;
	}

	Ref<ConvexPolygonShape2D> polygon = memnew(ConvexPolygonShape2D);
	polygon->set_points(polygon_points);
	apply_shape(collider2d, polygon, center);
}

void SpxSprite::set_collision_enabled(GdBool enabled) {
	_is_collision_enabled = enabled;
	_update_collider_disabled_state();
}

GdBool SpxSprite::is_collision_enabled() {
	return _is_collision_enabled;
}

void SpxSprite::set_trigger_capsule(GdVec2 center, GdVec2 size) {
	Ref<CapsuleShape2D> capsule = memnew(CapsuleShape2D);
	capsule->set_radius(size.x / 2);
	capsule->set_height(size.y);
	apply_shape(trigger2d, capsule, center);
}

void SpxSprite::set_trigger_rect(GdVec2 center, GdVec2 size) {
	Ref<RectangleShape2D> rect = memnew(RectangleShape2D);
	rect->set_size(size);
	apply_shape(trigger2d, rect, center);
}

void SpxSprite::set_trigger_circle(GdVec2 center, GdFloat radius) {
	Ref<CircleShape2D> circle = memnew(CircleShape2D);
	circle->set_radius(radius);
	apply_shape(trigger2d, circle, center);
}

void SpxSprite::set_trigger_polygon(GdVec2 center, GdArray points) {
	Vector<Vector2> polygon_points;
	if (!build_polygon_points(points, true, polygon_points)) {
		print_error("set_trigger_polygon: need at least 3 points");
		return;
	}

	Ref<ConvexPolygonShape2D> polygon = memnew(ConvexPolygonShape2D);
	polygon->set_points(polygon_points);
	apply_shape(trigger2d, polygon, center);
}

void SpxSprite::set_trigger_enabled(GdBool trigger) {
	_is_trigger_enabled = trigger;
	_update_trigger_disabled_state();
}

GdBool SpxSprite::is_trigger_enabled() {
	return _is_trigger_enabled;
}

CollisionShape2D *SpxSprite::get_collider(bool is_trigger) {
	return is_trigger ? trigger2d : collider2d;
}

GdBool SpxSprite::check_collision(SpxSprite *other, GdBool is_src_trigger, GdBool is_dst_trigger) {
	if (other == nullptr) {
		return false;
	}

	CollisionShape2D *this_shape = is_src_trigger ? trigger2d : collider2d;
	CollisionShape2D *other_shape = is_dst_trigger ? other->trigger2d : other->collider2d;
	if (this_shape == nullptr || other_shape == nullptr) {
		return false;
	}

	if (!this_shape->get_shape().is_valid() || !other_shape->get_shape().is_valid()) {
		return false;
	}

	return this_shape->get_shape()->collide(this_shape->get_global_transform(), other_shape->get_shape(), other_shape->get_global_transform());
}

GdBool SpxSprite::check_collision_with_point(GdVec2 point, GdBool is_trigger) {
	CollisionShape2D *shape = is_trigger ? trigger2d : collider2d;
	if (shape == nullptr || !shape->get_shape().is_valid()) {
		return false;
	}

	Ref<CircleShape2D> point_shape;
	point_shape.instantiate();
	point_shape->set_radius(3);

	Transform2D point_transform(0, point);
	return shape->get_shape()->collide(shape->get_global_transform(), point_shape, point_transform);
}

void SpxSprite::set_debug_collision_visible(GdBool enabled) {
	debug_collision_visible = enabled;
	queue_redraw();
}

GdBool SpxSprite::is_debug_collision_visible() const {
	return debug_collision_visible;
}
