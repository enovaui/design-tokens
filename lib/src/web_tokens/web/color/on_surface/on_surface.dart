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
  Color get main => ColorPrimitive.instance.mistGray10;
  @override
  Color get mainSelected => ColorPrimitive.instance.white;
  @override
  Color get sub => ColorPrimitive.instance.mistGray45;
  @override
  Color get accent => ColorPrimitive.instance.blueGreen50;
  @override
  Color get white => ColorPrimitive.instance.white;
  @override
  Color get black => ColorPrimitive.instance.mistGray10;
  @override
  Color get defaultDisabled => ColorPrimitive.instance.coolGray70;
  @override
  Color get mainError => ColorPrimitive.instance.activeRed60;
  @override
  Color get mainSuccess => ColorPrimitive.instance.green55;
  @override
  Color get subError => ColorPrimitive.instance.activeRed45;
  @override
  Color get subSuccess => ColorPrimitive.instance.green55;
  @override
  Color get highlight => ColorPrimitive.instance.blueGreen40;
  @override
  Color get badgeRed => ColorPrimitive.instance.activeRed50;
  @override
  Color get badgeOrange => ColorPrimitive.instance.orange50;
  @override
  Color get badgeGreen => ColorPrimitive.instance.green50;
  @override
  Color get badgeMagenta => ColorPrimitive.instance.heritageRed45;
  @override
  Color get buttonPrimary => ColorPrimitive.instance.white;
  @override
  Color get buttonPrimaryHover => ColorPrimitive.instance.white;
  @override
  Color get buttonPrimaryDisabled => ColorPrimitive.instance.white;
  @override
  Color get buttonSecondary => ColorPrimitive.instance.mistGray30;
  @override
  Color get buttonSecondaryHover => ColorPrimitive.instance.mistGray30;
  @override
  Color get buttonTertiary => ColorPrimitive.instance.mistGray30;
  @override
  Color get cardGray => ColorPrimitive.instance.warmGray65;
  @override
  Color get cardYellow => ColorPrimitive.instance.yellow70;
  @override
  Color get footer => ColorPrimitive.instance.blueGray20;
  @override
  Color get index => ColorPrimitive.instance.blueGray80;
  @override
  Color get pageIndicatorDot => ColorPrimitive.instance.coolGray70;
  @override
  Color get textFieldInactive => ColorPrimitive.instance.mistGray45;
  @override
  Color get mainSupporting => ColorPrimitive.instance.mistGray20;
  @override
  Color get badgeDarkGray => ColorPrimitive.instance.blueGray20;
  @override
  Color get header => ColorPrimitive.instance.mistGray45;
  @override
  Color get buttonLabelDisabled => ColorPrimitive.instance.mistGray45;
  @override
  Color get cardOrange => ColorPrimitive.instance.orange40;
  @override
  Color get menu => ColorPrimitive.instance.blueGray80;
  @override
  Color get pageIndicator => ColorPrimitive.instance.mistGray45;
  @override
  Color get selectionActiveDisabled => ColorPrimitive.instance.mistGray70;
  @override
  Color get textFieldAssistive => ColorPrimitive.instance.coolGray55;
  @override
  Color get cardDark => ColorPrimitive.instance.blueGray20;
  @override
  Color get cardLight => ColorPrimitive.instance.blueGray80;
  @override
  Color get subSupporting => ColorPrimitive.instance.blueGray20;
}
