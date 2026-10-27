/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart' show Color;

import '../../../../core_tokens/color_primitive.dart';
import '../../../base/color/on_background/on_background_base.dart';

class OnBackground extends OnBackgroundBase {
  const OnBackground();

  @override
  Color get main => ColorPrimitive.instance.white;
  @override
  Color get mainDisabled => ColorPrimitive.instance.white;
  @override
  Color get sub => ColorPrimitive.instance.coolGray65;
  @override
  Color get subDisabled => ColorPrimitive.instance.coolGray65;
  @override
  Color get accentDark => ColorPrimitive.instance.yellow85;
  @override
  Color get accentDarkDisabled => ColorPrimitive.instance.yellow85;
  @override
  Color get accentLight => ColorPrimitive.instance.yellow95;
  @override
  Color get accentLightDisabled => ColorPrimitive.instance.yellow95;
}
