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
  Color get defaultError => ColorPrimitive.instance.deepOrange60;
  @override
  Color get defaultGradientStart => ColorPrimitive.instance.white;
  @override
  Color get defaultGradientStop => ColorPrimitive.instance.white;
  @override
  Color get defaultGradientEnd => ColorPrimitive.instance.white;
  @override
  Color get main => ColorPrimitive.instance.sandGray35;
  @override
  Color get mainDisabled => ColorPrimitive.instance.sandGray35;
  @override
  Color get mainSupporting => ColorPrimitive.instance.sandGray20;
  @override
  Color get mainSupportingDisabled => ColorPrimitive.instance.sandGray20;
  @override
  Color get sub => ColorPrimitive.instance.sandGray40;
  @override
  Color get subDisabled => ColorPrimitive.instance.sandGray40;
  @override
  Color get subSupporting => ColorPrimitive.instance.sandGray45;
  @override
  Color get accent => ColorPrimitive.instance.cobaltBlue45;
  @override
  Color get accentDisabled => ColorPrimitive.instance.cobaltBlue45;
  @override
  Color get navigationBar => ColorPrimitive.instance.white;
  @override
  Color get navigationBarApp => ColorPrimitive.instance.white;
  @override
  Color get pickerColor => ColorPrimitive.instance.sandGray55;
  @override
  Color get selectionInactive => ColorPrimitive.instance.sandGray55;
  @override
  Color get selectionInactiveDisabled => ColorPrimitive.instance.sandGray55;
  @override
  Color get tabActive => ColorPrimitive.instance.activeRed55;
}
