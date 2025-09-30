/**************************************************************************/
/*  spx_layer_sorter.cpp                                                  */
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
#include "spx_layer_sorter.h"

void SpxLayerSorter::update(const RBMap<GdObj, SpxSprite*>& id_objects) {
    if(sort_mode == LayerSortMode::NONE) return;

    _collect_sprites(id_objects);

    if (dirty.empty()) return;

    float ratio = float(dirty.size()) / float(sorted.size());
    if (ratio > full_sort_ratio) {
        _full_sort();
    } else {
        _incremental_sort();
    }

    _apply_z_index();
}

void SpxLayerSorter::_mark_dirty(SpxSprite* sp) {
    if (!sp) return;
    if (dirty_ids.find(sp->get_gid()) != dirty_ids.end()) return;

    dirty.push_back({sp->get_gid(), sp->get_position(), sp});
    dirty_ids.insert(sp->get_gid());
}

void SpxLayerSorter::_collect_sprites(const RBMap<GdObj, SpxSprite*>& id_objects) {
    sorted.erase(
        std::remove_if(sorted.begin(), sorted.end(),
            [&](const SortInfo &s) { return id_objects.find(s.id) == nullptr; }),
        sorted.end()
    );

    if (sorted.empty()) {
        sorted.reserve(id_objects.size());
        for (auto &[key, sp] : id_objects) {
            if (!sp) continue;
            sorted.push_back({sp->get_gid(), sp->get_position(), sp});
        }
        std::sort(sorted.begin(), sorted.end(), sprite_cmp);
    } else {
        for (auto &pair : id_objects) {

            auto &sp  = pair.value;
            if (!sp) continue;

            auto sorted_it = std::find_if(sorted.begin(), sorted.end(),
                [&](const SortInfo &s) { return s.id == sp->get_gid(); });

            if (sorted_it != sorted.end()) {
                Point2 cur_pos = sp->get_position();
                if (sorted_it->pos != cur_pos) {
                    sorted_it->pos = cur_pos;
                    _mark_dirty(sp);
                }
            } else {
                sorted.push_back({sp->get_gid(), sp->get_position(), sp});
                _mark_dirty(sp);
            }
        }
    }
}

void SpxLayerSorter::_incremental_sort() {
    sorted.erase(std::remove_if(sorted.begin(), sorted.end(),
    [&](const SortInfo &s) {
        return dirty_ids.find(s.id) != dirty_ids.end();
    }), sorted.end());

    for (auto &d : dirty) {
        auto pos = std::lower_bound(sorted.begin(), sorted.end(), d, sprite_cmp);
        sorted.insert(pos, d);
    }

    dirty.clear();
    dirty_ids.clear();
}

void SpxLayerSorter::_full_sort() {
    for (auto &s : sorted) {
        if (s.sprite) {
            s.pos = s.sprite->get_position();
        }
    }
    std::sort(sorted.begin(), sorted.end(), sprite_cmp);
    dirty.clear();
    dirty_ids.clear();
}

void SpxLayerSorter::_apply_z_index() {
    int z = 1;
    for (auto &s : sorted) {
        if (s.sprite && s.sprite->get_z_index() != z){
            s.sprite->set_z_index(z);
        }
        ++z;
    }
}
