/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

/* Generated from packages/lupa-tokens/json/color-semantic-dark-blue.json. */
#ifndef LUPA_TOKENS_COLOR_SEMANTIC_DARK_BLUE_H
#define LUPA_TOKENS_COLOR_SEMANTIC_DARK_BLUE_H

#include <stdint.h>
#include "color_primitive.h"

#define SEMANTIC_DARK_BLUE_TOKEN_LIST(X) \
    X(COLOR_ACCENT_DEFAULT, PRIMITIVE_COLOR_MID_BLUE_65, "accent.default", "mid-blue-65") \
    X(COLOR_ACCENT_DEFAULT_DISABLED, PRIMITIVE_COLOR_MID_BLUE_65_A35, "accent.default-disabled", "mid-blue-65-a35") \
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
    X(COLOR_BACKGROUND_DEFAULT, PRIMITIVE_COLOR_BLACK, "background.default", "black") \
    X(COLOR_FILL_FLOATING, PRIMITIVE_COLOR_BLACK_A60, "fill.floating", "black-a60") \
    X(COLOR_FILL_HIGHLIGHT, PRIMITIVE_COLOR_WHITE, "fill.highlight", "white") \
    X(COLOR_FILL_HIGHLIGHT_DISABLED, PRIMITIVE_COLOR_WHITE_A35, "fill.highlight-disabled", "white-a35") \
    X(COLOR_FILL_MAIN, PRIMITIVE_COLOR_HS_COOL_GRAY_20, "fill.main", "hs-cool-gray-20") \
    X(COLOR_FILL_MAIN_DISABLED, PRIMITIVE_COLOR_HS_COOL_GRAY_20_A35, "fill.main-disabled", "hs-cool-gray-20-a35") \
    X(COLOR_FILL_MAIN_TRANSLUCENT, PRIMITIVE_COLOR_HS_COOL_GRAY_20_A80, "fill.main-translucent", "hs-cool-gray-20-a80") \
    X(COLOR_FILL_MAIN_VARIANT1, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_35, "fill.main-variant1", "hs-neutral-gray-35") \
    X(COLOR_FILL_MAIN_VARIANT1_DISABLED, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_35_A35, "fill.main-variant1-disabled", "hs-neutral-gray-35-a35") \
    X(COLOR_FILL_MAIN_VARIANT2, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_45, "fill.main-variant2", "hs-neutral-gray-45") \
    X(COLOR_FILL_MAIN_VARIANT3, PRIMITIVE_COLOR_BLACK, "fill.main-variant3", "black") \
    X(COLOR_FILL_MAIN_VARIANT4, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_65_A40, "fill.main-variant4", "hs-neutral-gray-65-a40") \
    X(COLOR_FILL_MAIN_VARIANT5, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_40, "fill.main-variant5", "hs-neutral-gray-40") \
    X(COLOR_FILL_MAIN_VARIANT5_DISABLED, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_40_A50, "fill.main-variant5-disabled", "hs-neutral-gray-40-a50") \
    X(COLOR_ON_BACKGROUND_MAIN, PRIMITIVE_COLOR_WHITE, "on.background.main", "white") \
    X(COLOR_ON_BACKGROUND_MAIN_DISABLED, PRIMITIVE_COLOR_WHITE_A35, "on.background.main-disabled", "white-a35") \
    X(COLOR_ON_BACKGROUND_MAIN_MUTED, PRIMITIVE_COLOR_WHITE_A70, "on.background.main-muted", "white-a70") \
    X(COLOR_ON_BACKGROUND_SUB, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_55, "on.background.sub", "hs-neutral-gray-55") \
    X(COLOR_ON_BACKGROUND_SUB_DISABLED, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_55_A35, "on.background.sub-disabled", "hs-neutral-gray-55-a35") \
    X(COLOR_ON_SURFACE_MAIN, PRIMITIVE_COLOR_WHITE, "on.surface.main", "white") \
    X(COLOR_ON_SURFACE_MAIN_DISABLED, PRIMITIVE_COLOR_WHITE_A35, "on.surface.main-disabled", "white-a35") \
    X(COLOR_ON_SURFACE_MAIN_OPACITY20, PRIMITIVE_COLOR_WHITE_A20, "on.surface.main-opacity20", "white-a20") \
    X(COLOR_ON_SURFACE_MAIN_OPACITY35, PRIMITIVE_COLOR_WHITE_A35, "on.surface.main-opacity35", "white-a35") \
    X(COLOR_ON_SURFACE_MAIN_OPACITY50, PRIMITIVE_COLOR_WHITE_A50, "on.surface.main-opacity50", "white-a50") \
    X(COLOR_ON_SURFACE_MAIN_OPACITY70, PRIMITIVE_COLOR_WHITE_A70, "on.surface.main-opacity70", "white-a70") \
    X(COLOR_ON_SURFACE_MAIN_OPACITY80, PRIMITIVE_COLOR_WHITE_A80, "on.surface.main-opacity80", "white-a80") \
    X(COLOR_ON_SURFACE_MAIN_OPACITY85, PRIMITIVE_COLOR_WHITE_A85, "on.surface.main-opacity85", "white-a85") \
    X(COLOR_ON_SURFACE_SUB, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_55, "on.surface.sub", "hs-neutral-gray-55") \
    X(COLOR_ON_SURFACE_SUB_VARIANT1, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_75, "on.surface.sub-variant1", "hs-neutral-gray-75") \
    X(COLOR_ON_SURFACE_SUB_VARIANT1_DISABLED, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_75_A35, "on.surface.sub-variant1-disabled", "hs-neutral-gray-75-a35") \
    X(COLOR_ON_SURFACE_WHITE, PRIMITIVE_COLOR_WHITE, "on.surface.white", "white") \
    X(COLOR_ON_ACCENT_DEFAULT, PRIMITIVE_COLOR_WHITE, "on-accent.default", "white") \
    X(COLOR_ON_ACCENT_DEFAULT_DISABLED, PRIMITIVE_COLOR_WHITE_A35, "on-accent.default-disabled", "white-a35") \
    X(COLOR_ON_FILL_HIGHLIGHT, PRIMITIVE_COLOR_BLACK, "on-fill.highlight", "black") \
    X(COLOR_ON_FILL_HIGHLIGHT_DISABLED, PRIMITIVE_COLOR_BLACK_A35, "on-fill.highlight-disabled", "black-a35") \
    X(COLOR_ON_FILL_MAIN, PRIMITIVE_COLOR_WHITE, "on-fill.main", "white") \
    X(COLOR_ON_FILL_MAIN_DISABLED, PRIMITIVE_COLOR_WHITE_A35, "on-fill.main-disabled", "white-a35") \
    X(COLOR_ON_FILL_MAIN_MUTED, PRIMITIVE_COLOR_WHITE_A30, "on-fill.main-muted", "white-a30") \
    X(COLOR_ON_FILL_MAIN_VARIANT1, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_65, "on-fill.main-variant1", "hs-neutral-gray-65") \
    X(COLOR_SCRIM_BACKDROP, PRIMITIVE_COLOR_BLACK, "scrim.backdrop", "black") \
    X(COLOR_SCRIM_OVERLAY_DIM, PRIMITIVE_COLOR_BLACK_A50, "scrim.overlay-dim", "black-a50") \
    X(COLOR_SCRIM_OVERLAY_HIGHLIGHT, PRIMITIVE_COLOR_WHITE_A40, "scrim.overlay-highlight", "white-a40") \
    X(COLOR_SCRIM_OVERLAY_HIGHLIGHT_INVERT, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_65_A40, "scrim.overlay-highlight-invert", "hs-neutral-gray-65-a40") \
    X(COLOR_STROKE_HIGHLIGHT, PRIMITIVE_COLOR_WHITE, "stroke.highlight", "white") \
    X(COLOR_STROKE_HIGHLIGHT_DISABLED, PRIMITIVE_COLOR_WHITE_A35, "stroke.highlight-disabled", "white-a35") \
    X(COLOR_STROKE_HIGHLIGHT_MUTED, PRIMITIVE_COLOR_WHITE_A40, "stroke.highlight-muted", "white-a40") \
    X(COLOR_STROKE_MAIN, PRIMITIVE_COLOR_WHITE_A30, "stroke.main", "white-a30") \
    X(COLOR_STROKE_MAIN_VARIANT1, PRIMITIVE_COLOR_WHITE_A50, "stroke.main-variant1", "white-a50") \
    X(COLOR_STROKE_MAIN_VARIANT2, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_35, "stroke.main-variant2", "hs-neutral-gray-35") \
    X(COLOR_STROKE_MAIN_VARIANT3, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_25, "stroke.main-variant3", "hs-neutral-gray-25") \
    X(COLOR_SURFACE_DEFAULT, PRIMITIVE_COLOR_HS_COOL_GRAY_15, "surface.default", "hs-cool-gray-15") \
    X(COLOR_SURFACE_DEFAULT_TRANSLUCENT, PRIMITIVE_COLOR_HS_COOL_GRAY_15_A80, "surface.default-translucent", "hs-cool-gray-15-a80") \
    X(COLOR_SURFACE_DEFAULT_VARIANT1, PRIMITIVE_COLOR_HS_COOL_GRAY_20, "surface.default-variant1", "hs-cool-gray-20") \
    X(COLOR_SURFACE_DEFAULT_VARIANT2, PRIMITIVE_COLOR_BLACK, "surface.default-variant2", "black") \
    X(COLOR_SURFACE_DEFAULT_VARIANT2_TRANSLUCENT, PRIMITIVE_COLOR_BLACK_A50, "surface.default-variant2-translucent", "black-a50") \
    X(COLOR_SURFACE_DEFAULT_VARIANT3, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_20, "surface.default-variant3", "hs-neutral-gray-20") \
    X(COLOR_SURFACE_DEFAULT_VARIANT4, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_15, "surface.default-variant4", "hs-neutral-gray-15") \
    X(COLOR_SURFACE_DEFAULT_VARIANT5, PRIMITIVE_COLOR_HS_NEUTRAL_GRAY_35, "surface.default-variant5", "hs-neutral-gray-35") \
    X(COLOR_SURFACE_DEFAULT_VARIANT6, PRIMITIVE_COLOR_BLACK_A30, "surface.default-variant6", "black-a30")

#ifndef LUPA_TOKENS_DISABLE_CONVENIENCE_CONSTANTS
#define LUPA_TOKENS_DECLARE_COLOR(name, value, semantic_name, primitive_name) \
    static const uint32_t TOKEN_##name = value;
SEMANTIC_DARK_BLUE_TOKEN_LIST(LUPA_TOKENS_DECLARE_COLOR)
#undef LUPA_TOKENS_DECLARE_COLOR
#endif

#endif /* LUPA_TOKENS_COLOR_SEMANTIC_DARK_BLUE_H */
