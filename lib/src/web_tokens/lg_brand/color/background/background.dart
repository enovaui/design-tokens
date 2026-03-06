/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart' show Color;

import '../../../../core_tokens/color_primitive.dart';
import '../../../base/color/background/background_base.dart';

class Background extends BackgroundBase {
  const Background();

  @override
  Color get main => ColorPrimitive.instance.warmGray85;
  @override
  Color get sub => ColorPrimitive.instance.neutralGray95;
  @override
  Color get white => ColorPrimitive.instance.white;
  @override
  Color get black => ColorPrimitive.instance.black;
  @override
  Color get darkGray => ColorPrimitive.instance.warmGray15;
  @override
  Color get mainDark => ColorPrimitive.instance.warmGray80;
}
