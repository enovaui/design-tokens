/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart' show Color;

import '../../../../core_tokens/color_primitive.dart';
import '../../../base/color/on_surface/on_surface_base.dart';

class OnSurface extends OnSurfaceBase {
  const OnSurface();

  @override
  Color get defaultError => ColorPrimitive.instance.activeRed60;
  @override
  Color get defaultSuccess => ColorPrimitive.instance.green55;
  @override
  Color get main => ColorPrimitive.instance.mistGray10;
  @override
  Color get mainSelected => ColorPrimitive.instance.white;
  @override
  Color get sub => ColorPrimitive.instance.mistGray50;
  @override
  Color get accent => ColorPrimitive.instance.activeRed60;
  @override
  Color get button => ColorPrimitive.instance.mistGray30;
  @override
  Color get white => ColorPrimitive.instance.white;
  @override
  Color get black => ColorPrimitive.instance.mistGray10;
}
