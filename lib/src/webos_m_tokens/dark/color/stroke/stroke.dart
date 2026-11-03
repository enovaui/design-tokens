/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart' show Color;

import '../../../../core_tokens/color_primitive.dart';
import '../../../base/color/stroke/stroke_base.dart';

class Stroke extends StrokeBase {
  const Stroke();

  @override
  Color get defaultError => ColorPrimitive.instance.deepOrange60;
  @override
  Color get defaultGradientStart => ColorPrimitive.instance.white;
  @override
  Color get defaultGradientStop => ColorPrimitive.instance.white;
  @override
  Color get defaultGradientEnd => ColorPrimitive.instance.white;
  @override
  Color get main => ColorPrimitive.instance.coolGray15;
  @override
  Color get mainDisabled => ColorPrimitive.instance.coolGray15;
  @override
  Color get mainSupporting => ColorPrimitive.instance.coolGray10;
  @override
  Color get mainSupportingDisabled => ColorPrimitive.instance.coolGray10;
  @override
  Color get sub => ColorPrimitive.instance.coolGray30;
  @override
  Color get subDisabled => ColorPrimitive.instance.coolGray30;
  @override
  Color get subSupporting => ColorPrimitive.instance.coolGray50;
  @override
  Color get subSupportingDisabled => ColorPrimitive.instance.coolGray50;
  @override
  Color get accent => ColorPrimitive.instance.midBlue60;
  @override
  Color get accentDisabled => ColorPrimitive.instance.midBlue60;
  @override
  Color get accessBar => ColorPrimitive.instance.white;
  @override
  Color get accessBarApp => ColorPrimitive.instance.white;
}
