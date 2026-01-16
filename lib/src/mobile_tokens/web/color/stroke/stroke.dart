/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart' show Color;

import '../../../../core_tokens/color_primitive.dart';
import '../../../base/color/stroke/stroke_base.dart';

class Stroke extends StrokeBase {
  const Stroke();

  @override
  Color get defaultError => ColorPrimitive.instance.activeRed60;
  @override
  Color get defaultSuccess => ColorPrimitive.instance.green60;
  @override
  Color get main => ColorPrimitive.instance.blueGray80;
  @override
  Color get mainFocused => ColorPrimitive.instance.navy40;
  @override
  Color get sub => ColorPrimitive.instance.blueGray80;
  @override
  Color get accent => ColorPrimitive.instance.blueGreen50;
  @override
  Color get button => ColorPrimitive.instance.blueGray80;
  @override
  Color get selectionActive => ColorPrimitive.instance.navy40;
  @override
  Color get selectionInactive => ColorPrimitive.instance.mistGray70;
  @override
  Color get tab => ColorPrimitive.instance.mistGray10;
}
