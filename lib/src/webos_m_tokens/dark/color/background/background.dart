/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart' show Color;

import '../../../../core_tokens/color_primitive.dart';
import '../../../base/color/background/background_base.dart';

class Background extends BackgroundBase {
  const Background();

  @override
  Color get defaultColor => ColorPrimitive.instance.black;
  @override
  Color get white => ColorPrimitive.instance.white;
  @override
  Color get defaultGradientStart => ColorPrimitive.instance.black;
  @override
  Color get defaultGradientStop1 => ColorPrimitive.instance.black;
  @override
  Color get defaultGradientStop2 => ColorPrimitive.instance.black;
  @override
  Color get defaultGradientEnd => ColorPrimitive.instance.black;
}
