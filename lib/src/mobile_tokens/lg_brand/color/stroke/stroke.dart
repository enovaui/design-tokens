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
  Color get defaultError => ColorPrimitive.instance.redOrange60;
  @override
  Color get defaultSuccess => ColorPrimitive.instance.green60;
  @override
  Color get main => ColorPrimitive.instance.warmGray75;
  @override
  Color get mainFocused => ColorPrimitive.instance.warmGray30;
  @override
  Color get sub => ColorPrimitive.instance.warmGray60;
  @override
  Color get accent => ColorPrimitive.instance.activeRed50;
  @override
  Color get button => ColorPrimitive.instance.warmGray30;
  @override
  Color get selectionActive => ColorPrimitive.instance.warmGray15;
  @override
  Color get selectionInactive => ColorPrimitive.instance.warmGray60;
  @override
  Color get tab => ColorPrimitive.instance.mistGray10;
}
