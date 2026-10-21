/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

/* Generated from packages/lupa-tokens/json/color-semantic-light-orange.json. */
#ifndef LUPA_TOKENS_COLOR_SEMANTIC_LIGHT_ORANGE_H
#define LUPA_TOKENS_COLOR_SEMANTIC_LIGHT_ORANGE_H

#include <stdint.h>
#include "color_primitive.h"

#define SEMANTIC_LIGHT_ORANGE_TOKEN_LIST(X) \
    X(COLOR_ACCENT_DEFAULT, PRIMITIVE_COLOR_DEEP_ORANGE_40, "accent.default", "deep-orange-40") \
    X(COLOR_ACCENT_DEFAULT_DISABLED, PRIMITIVE_COLOR_DEEP_ORANGE_40_A35, "accent.default-disabled", "deep-orange-40-a35") \
    X(COLOR_AI_DEFAULT, PRIMITIVE_COLOR_MAGENTA_PINK_40, "ai.default", "magenta-pink-40") \
    X(COLOR_AI_DEFAULT_DISABLED, PRIMITIVE_COLOR_MAGENTA_PINK_40_A35, "ai.default-disabled", "magenta-pink-40-a35") \
    X(COLOR_AI_DEFAULT_VARIANT1, PRIMITIVE_COLOR_ACTIVE_RED_55, "ai.default-variant1", "active-red-55") \
    X(COLOR_AI_DEFAULT_VARIANT2, PRIMITIVE_COLOR_MAGENTA_PINK_50, "ai.default-variant2", "magenta-pink-50") \
    X(COLOR_AI_DEFAULT_VARIANT3, PRIMITIVE_COLOR_MAGENTA_PINK_45, "ai.default-variant3", "magenta-pink-45") \
    X(COLOR_AI_DEFAULT_VARIANT4, PRIMITIVE_COLOR_PURPLE_50, "ai.default-variant4", "purple-50") \
    X(COLOR_AI_DEFAULT_VARIANT5, PRIMITIVE_COLOR_VIOLET_45, "ai.default-variant5", "violet-45") \
    X(COLOR_AI_DEFAULT_VARIANT5_DISABLED, PRIMITIVE_COLOR_VIOLET_45_A35, "ai.default-variant5-disabled", "violet-45-a35") \
    X(COLOR_AI_DEFAULT_VARIANT6, PRIMITIVE_COLOR_VIOLET_10, "ai.default-variant6", "violet-10") \
    X(COLOR_AI_DEFAULT_VARIANT6_DISABLED, PRIMITIVE_COLOR_VIOLET_10_A35, "ai.default-variant6-disabled", "violet-10-a35") \
    X(COLOR_BACKGROUND_DEFAULT, PRIMITIVE_COLOR_WHITE, "background.default", "white") \
    X(COLOR_FILL_FLOATING, PRIMITIVE_COLOR_WHITE_A60, "fill.floating", "white-a60") \
    X(COLOR_FILL_HIGHLIGHT, PRIMITIVE_COLOR_BLACK, "fill.highlight", "black") \
    X(COLOR_FILL_HIGHLIGHT_DISABLED, PRIMITIVE_COLOR_BLACK_A35, "fill.highlight-disabled", "black-a35") \
    X(COLOR_FILL_MAIN, PRIMITIVE_COLOR_HS_COOL_GRAY_80, "fill.main", "hs-cool-gray-80") \
    X(COLOR_FILL_MAIN_DISABLED, PRIMITIVE_COLOR_HS_COOL_GRAY_80_A35, "fill.main-disabled", "hs-cool-gray-80-a35") \
    X(COLOR_FILL_MAIN_TRANSLUCENT, PRIMITIVE_COLOR_HS_COOL_GRAY_80_A80, "fill.main-translucent", "hs-cool-gray-80-a80") \
    X(COLOR_FILL_MAIN_VARIANT1, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_65, "fill.main-variant1", "hs-neutral-gray-65") \
    X(COLOR_FILL_MAIN_VARIANT1_DISABLED, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_65_A35, "fill.main-variant1-disabled", "hs-neutral-gray-65-a35") \
    X(COLOR_FILL_MAIN_VARIANT2, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_55, "fill.main-variant2", "hs-neutral-gray-55") \
    X(COLOR_FILL_MAIN_VARIANT3, PRIMITIVE_COLOR_WHITE, "fill.main-variant3", "white") \
    X(COLOR_FILL_MAIN_VARIANT4, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_35_A40, "fill.main-variant4", "hs-neutral-gray-35-a40") \
    X(COLOR_FILL_MAIN_VARIANT5, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_60, "fill.main-variant5", "hs-neutral-gray-60") \
    X(COLOR_FILL_MAIN_VARIANT5_DISABLED, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_60_A50, "fill.main-variant5-disabled", "hs-neutral-gray-60-a50") \
    X(COLOR_ON_BACKGROUND_MAIN, PRIMITIVE_COLOR_BLACK, "on.background.main", "black") \
    X(COLOR_ON_BACKGROUND_MAIN_DISABLED, PRIMITIVE_COLOR_BLACK_A35, "on.background.main-disabled", "black-a35") \
    X(COLOR_ON_BACKGROUND_MAIN_MUTED, PRIMITIVE_COLOR_BLACK_A70, "on.background.main-muted", "black-a70") \
    X(COLOR_ON_BACKGROUND_SUB, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_45, "on.background.sub", "hs-neutral-gray-45") \
    X(COLOR_ON_BACKGROUND_SUB_DISABLED, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_45_A35, "on.background.sub-disabled", "hs-neutral-gray-45-a35") \
    X(COLOR_ON_SURFACE_MAIN, PRIMITIVE_COLOR_BLACK, "on.surface.main", "black") \
    X(COLOR_ON_SURFACE_MAIN_DISABLED, PRIMITIVE_COLOR_BLACK_A35, "on.surface.main-disabled", "black-a35") \
    X(COLOR_ON_SURFACE_MAIN_OPACITY20, PRIMITIVE_COLOR_BLACK_A20, "on.surface.main-opacity20", "black-a20") \
    X(COLOR_ON_SURFACE_MAIN_OPACITY35, PRIMITIVE_COLOR_BLACK_A35, "on.surface.main-opacity35", "black-a35") \
    X(COLOR_ON_SURFACE_MAIN_OPACITY50, PRIMITIVE_COLOR_BLACK_A50, "on.surface.main-opacity50", "black-a50") \
    X(COLOR_ON_SURFACE_MAIN_OPACITY70, PRIMITIVE_COLOR_BLACK_A70, "on.surface.main-opacity70", "black-a70") \
    X(COLOR_ON_SURFACE_MAIN_OPACITY80, PRIMITIVE_COLOR_BLACK_A80, "on.surface.main-opacity80", "black-a80") \
    X(COLOR_ON_SURFACE_MAIN_OPACITY85, PRIMITIVE_COLOR_BLACK_A85, "on.surface.main-opacity85", "black-a85") \
    X(COLOR_ON_SURFACE_SUB, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_45, "on.surface.sub", "hs-neutral-gray-45") \
    X(COLOR_ON_SURFACE_SUB_VARIANT1, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_25, "on.surface.sub-variant1", "hs-neutral-gray-25") \
    X(COLOR_ON_SURFACE_SUB_VARIANT1_DISABLED, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_25_A35, "on.surface.sub-variant1-disabled", "hs-neutral-gray-25-a35") \
    X(COLOR_ON_SURFACE_WHITE, PRIMITIVE_COLOR_WHITE, "on.surface.white", "white") \
    X(COLOR_ON_ACCENT_DEFAULT, PRIMITIVE_COLOR_BLACK, "on-accent.default", "black") \
    X(COLOR_ON_ACCENT_DEFAULT_DISABLED, PRIMITIVE_COLOR_BLACK_A35, "on-accent.default-disabled", "black-a35") \
    X(COLOR_ON_FILL_HIGHLIGHT, PRIMITIVE_COLOR_WHITE, "on-fill.highlight", "white") \
    X(COLOR_ON_FILL_HIGHLIGHT_DISABLED, PRIMITIVE_COLOR_WHITE_A35, "on-fill.highlight-disabled", "white-a35") \
    X(COLOR_ON_FILL_MAIN, PRIMITIVE_COLOR_BLACK, "on-fill.main", "black") \
    X(COLOR_ON_FILL_MAIN_DISABLED, PRIMITIVE_COLOR_BLACK_A35, "on-fill.main-disabled", "black-a35") \
    X(COLOR_ON_FILL_MAIN_MUTED, PRIMITIVE_COLOR_BLACK_A30, "on-fill.main-muted", "black-a30") \
    X(COLOR_ON_FILL_MAIN_VARIANT1, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_35, "on-fill.main-variant1", "hs-neutral-gray-35") \
    X(COLOR_SCRIM_BACKDROP, PRIMITIVE_COLOR_BLACK, "scrim.backdrop", "black") \
    X(COLOR_SCRIM_OVERLAY_DIM, PRIMITIVE_COLOR_WHITE_A50, "scrim.overlay-dim", "white-a50") \
    X(COLOR_SCRIM_OVERLAY_HIGHLIGHT, PRIMITIVE_COLOR_BLACK_A35, "scrim.overlay-highlight", "black-a35") \
    X(COLOR_SCRIM_OVERLAY_HIGHLIGHT_INVERT, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_35_A40, "scrim.overlay-highlight-invert", "hs-neutral-gray-35-a40") \
    X(COLOR_STROKE_HIGHLIGHT, PRIMITIVE_COLOR_BLACK, "stroke.highlight", "black") \
    X(COLOR_STROKE_HIGHLIGHT_DISABLED, PRIMITIVE_COLOR_BLACK_A35, "stroke.highlight-disabled", "black-a35") \
    X(COLOR_STROKE_HIGHLIGHT_MUTED, PRIMITIVE_COLOR_BLACK_A40, "stroke.highlight-muted", "black-a40") \
    X(COLOR_STROKE_MAIN, PRIMITIVE_COLOR_BLACK_A30, "stroke.main", "black-a30") \
    X(COLOR_STROKE_MAIN_VARIANT1, PRIMITIVE_COLOR_BLACK_A50, "stroke.main-variant1", "black-a50") \
    X(COLOR_STROKE_MAIN_VARIANT2, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_65, "stroke.main-variant2", "hs-neutral-gray-65") \
    X(COLOR_STROKE_MAIN_VARIANT3, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_75, "stroke.main-variant3", "hs-neutral-gray-75") \
    X(COLOR_SURFACE_DEFAULT, PRIMITIVE_COLOR_HS_COOL_GRAY_85, "surface.default", "hs-cool-gray-85") \
    X(COLOR_SURFACE_DEFAULT_TRANSLUCENT, PRIMITIVE_COLOR_HS_COOL_GRAY_85_A80, "surface.default-translucent", "hs-cool-gray-85-a80") \
    X(COLOR_SURFACE_DEFAULT_VARIANT1, PRIMITIVE_COLOR_HS_COOL_GRAY_80, "surface.default-variant1", "hs-cool-gray-80") \
    X(COLOR_SURFACE_DEFAULT_VARIANT2, PRIMITIVE_COLOR_WHITE, "surface.default-variant2", "white") \
    X(COLOR_SURFACE_DEFAULT_VARIANT2_TRANSLUCENT, PRIMITIVE_COLOR_WHITE_A50, "surface.default-variant2-translucent", "white-a50") \
    X(COLOR_SURFACE_DEFAULT_VARIANT3, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_80, "surface.default-variant3", "hs-neutral-gray-80") \
    X(COLOR_SURFACE_DEFAULT_VARIANT4, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_85, "surface.default-variant4", "hs-neutral-gray-85") \
    X(COLOR_SURFACE_DEFAULT_VARIANT5, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_65, "surface.default-variant5", "hs-neutral-gray-65") \
    X(COLOR_SURFACE_DEFAULT_VARIANT6, PRIMITIVE_COLOR_WHITE_A30, "surface.default-variant6", "white-a30")

#ifndef LUPA_TOKENS_DISABLE_CONVENIENCE_CONSTANTS
#define LUPA_TOKENS_DECLARE_COLOR(name, value, semantic_name, primitive_name) \
    static const uint32_t TOKEN_##name = value;
SEMANTIC_LIGHT_ORANGE_TOKEN_LIST(LUPA_TOKENS_DECLARE_COLOR)
#undef LUPA_TOKENS_DECLARE_COLOR
#endif

#endif /* LUPA_TOKENS_COLOR_SEMANTIC_LIGHT_ORANGE_H */
