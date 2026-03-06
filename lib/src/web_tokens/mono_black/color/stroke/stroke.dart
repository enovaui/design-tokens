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
  Color get defaultSuccess => ColorPrimitive.instance.green70;
  @override
  Color get main => ColorPrimitive.instance.mistGray50;
  @override
  Color get mainFocused => ColorPrimitive.instance.white;
  @override
  Color get sub => ColorPrimitive.instance.mistGray50;
  @override
  Color get accent => ColorPrimitive.instance.white;
  @override
  Color get button => ColorPrimitive.instance.mistGray95;
  @override
  Color get selectionActive => ColorPrimitive.instance.green60;
  @override
  Color get selectionInactive => ColorPrimitive.instance.white;
  @override
  Color get tab => ColorPrimitive.instance.mistGray99;
  @override
  Color get badgeGreen => ColorPrimitive.instance.green50;
  @override
  Color get badgeGray => ColorPrimitive.instance.coolGray35;
  @override
  Color get badgeOrange => ColorPrimitive.instance.orange50;
  @override
  Color get badgeMagenta => ColorPrimitive.instance.heritageRed45;
  @override
  Color get badgeRed => ColorPrimitive.instance.activeRed50;
  @override
  Color get buttonTertiary => ColorPrimitive.instance.mistGray95;
  @override
  Color get buttonIcon => ColorPrimitive.instance.mistGray95;
  @override
  Color get cardSelected => ColorPrimitive.instance.white;
  @override
  Color get cardGray => ColorPrimitive.instance.mistGray40;
  @override
  Color get chip => ColorPrimitive.instance.neutralGray90;
  @override
  Color get chipPink => ColorPrimitive.instance.heritageRed35;
  @override
  Color get chipWhite => ColorPrimitive.instance.white;
  @override
  Color get textField => ColorPrimitive.instance.mistGray90;
  @override
  Color get textFieldFocused => ColorPrimitive.instance.mistGray35;
  @override
  Color get textFieldDisabled => ColorPrimitive.instance.mistGray70;
  @override
  Color get white => ColorPrimitive.instance.white;
  @override
  Color get black => ColorPrimitive.instance.mistGray10;
  @override
  Color get defaultSelected => ColorPrimitive.instance.white;
  @override
  Color get tabSegmented => ColorPrimitive.instance.mistGray90;
  @override
  Color get mainSupporting => ColorPrimitive.instance.mistGray50;
  @override
  Color get subSupporting => ColorPrimitive.instance.mistGray65;
}
