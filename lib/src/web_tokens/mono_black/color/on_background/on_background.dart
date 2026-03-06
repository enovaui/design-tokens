/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart' show Color;

import '../../../../core_tokens/color_primitive.dart';
import '../../../base/color/on_background/on_background_base.dart';

class OnBackground extends OnBackgroundBase {
  const OnBackground();

  @override
  Color get main => ColorPrimitive.instance.mistGray99;
  @override
  Color get mainSupporting => ColorPrimitive.instance.mistGray85;
  @override
  Color get sub => ColorPrimitive.instance.mistGray80;
  @override
  Color get accent => ColorPrimitive.instance.mistGray50;
  @override
  Color get highlight => ColorPrimitive.instance.mistGray95;
  @override
  Color get white => ColorPrimitive.instance.white;
}
