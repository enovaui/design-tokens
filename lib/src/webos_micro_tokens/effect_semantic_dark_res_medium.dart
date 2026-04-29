/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

import '../core_tokens/effect_primitive.dart';

class MediumEffectSemantic {
  MediumEffectSemantic._();

  int get defaultBackgroundBlur => EffectPrimitive.instance.effect0;
  int get defaultDropShadowBlur => EffectPrimitive.instance.effect40;
  int get defaultDropShadowSpread => EffectPrimitive.instance.effect0;
  int get defaultDropShadowX => EffectPrimitive.instance.effect0;
  int get defaultDropShadowY => EffectPrimitive.instance.effect10;
  int get defaultInnerShadowBlur => EffectPrimitive.instance.effect0;
  int get defaultInnerShadowSpread => EffectPrimitive.instance.effect0;
  int get defaultInnerShadowX => EffectPrimitive.instance.effect0;
  int get defaultInnerShadowY => EffectPrimitive.instance.effect0;
  int get statusBarBackgroundBlur => EffectPrimitive.instance.effect0;
}
