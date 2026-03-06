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
  Color get defaultError => ColorPrimitive.instance.activeRed50;
  @override
  Color get defaultSuccess => ColorPrimitive.instance.green60;
  @override
  Color get main => ColorPrimitive.instance.warmGray70;
  @override
  Color get mainFocused => ColorPrimitive.instance.warmGray30;
  @override
  Color get sub => ColorPrimitive.instance.warmGray60;
  @override
  Color get badgeGreen => ColorPrimitive.instance.green50;
  @override
  Color get badgeGray => ColorPrimitive.instance.coolGray35;
  @override
  Color get badgeOrange => ColorPrimitive.instance.orange50;
  @override
  Color get badgeMagenta => ColorPrimitive.instance.heritageRed45;
  @override
  Color get accent => ColorPrimitive.instance.activeRed50;
  @override
  Color get badgeRed => ColorPrimitive.instance.activeRed50;
  @override
  Color get button => ColorPrimitive.instance.warmGray50;
  @override
  Color get buttonTertiary => ColorPrimitive.instance.warmGray30;
  @override
  Color get buttonIcon => ColorPrimitive.instance.warmGray35;
  @override
  Color get cardSelected => ColorPrimitive.instance.black;
  @override
  Color get cardGray => ColorPrimitive.instance.neutralGray95;
  @override
  Color get chip => ColorPrimitive.instance.neutralGray90;
  @override
  Color get chipPink => ColorPrimitive.instance.heritageRed35;
  @override
  Color get chipWhite => ColorPrimitive.instance.white;
  @override
  Color get selectionActive => ColorPrimitive.instance.activeRed50;
  @override
  Color get selectionInactive => ColorPrimitive.instance.black;
  @override
  Color get tab => ColorPrimitive.instance.mistGray10;
  @override
  Color get textField => ColorPrimitive.instance.mistGray55;
  @override
  Color get textFieldFocused => ColorPrimitive.instance.warmGray10;
  @override
  Color get textFieldDisabled => ColorPrimitive.instance.warmGray70;
  @override
  Color get white => ColorPrimitive.instance.white;
  @override
  Color get black => ColorPrimitive.instance.black;
  @override
  Color get defaultSelected => ColorPrimitive.instance.black;
  @override
  Color get tabSegmented => ColorPrimitive.instance.mistGray55;
  @override
  Color get mainSupporting => ColorPrimitive.instance.warmGray80;
  @override
  Color get subSupporting => ColorPrimitive.instance.mistGray55;
}
