/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart' show Color;

import '../../../../core_tokens/color_primitive.dart';
import '../../../base/color/effect/effect_base.dart';

class Effect extends EffectBase {
  const Effect();

  @override
  Color get innerShadow => ColorPrimitive.instance.white;
  @override
  Color get dropShadow => ColorPrimitive.instance.black;
  @override
  Color get homeGridDropShadowDark => ColorPrimitive.instance.black;
  @override
  Color get homeGridDropShadowLight => ColorPrimitive.instance.white;
  @override
  Color get pageIndicatorDropShadowDark => ColorPrimitive.instance.black;
  @override
  Color get pageIndicatorDropShadowLight => ColorPrimitive.instance.white;
  @override
  Color get statusBarDropShadowDark => ColorPrimitive.instance.black;
  @override
  Color get statusBarDropShadowLight => ColorPrimitive.instance.white;
}
