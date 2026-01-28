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
  Color get defaultDisabled => ColorPrimitive.instance.warmGray55;
  @override
  Color get main => ColorPrimitive.instance.black;
  @override
  Color get mainError => ColorPrimitive.instance.activeRed50;
  @override
  Color get mainSuccess => ColorPrimitive.instance.yellowGreen40;
  @override
  Color get mainSelected => ColorPrimitive.instance.white;
  @override
  Color get sub => ColorPrimitive.instance.warmGray35;
  @override
  Color get subError => ColorPrimitive.instance.heritageRed35;
  @override
  Color get subSuccess => ColorPrimitive.instance.yellowGreen35;
  @override
  Color get accent => ColorPrimitive.instance.activeRed50;
  @override
  Color get highlight => ColorPrimitive.instance.heritageRed35;
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
  Color get buttonPrimaryHover => ColorPrimitive.instance.black;
  @override
  Color get buttonPrimaryDisabled => ColorPrimitive.instance.black;
  @override
  Color get buttonSecondary => ColorPrimitive.instance.black;
  @override
  Color get buttonSecondaryHover => ColorPrimitive.instance.white;
  @override
  Color get buttonTertiary => ColorPrimitive.instance.black;
  @override
  Color get cardGray => ColorPrimitive.instance.warmGray65;
  @override
  Color get cardYellow => ColorPrimitive.instance.yellow70;
  @override
  Color get footer => ColorPrimitive.instance.neutralGray25;
  @override
  Color get index => ColorPrimitive.instance.warmGray70;
  @override
  Color get pageIndicatorDot => ColorPrimitive.instance.warmGray70;
  @override
  Color get textFieldInactive => ColorPrimitive.instance.warmGray35;
  @override
  Color get white => ColorPrimitive.instance.white;
  @override
  Color get black => ColorPrimitive.instance.black;
  @override
  Color get mainSupporting => ColorPrimitive.instance.warmGray15;
  @override
  Color get badgeDarkGray => ColorPrimitive.instance.coolGray20;
  @override
  Color get header => ColorPrimitive.instance.warmGray35;
  @override
  Color get buttonLabelDisabled => ColorPrimitive.instance.warmGray35;
  @override
  Color get cardOrange => ColorPrimitive.instance.orange40;
  @override
  Color get menu => ColorPrimitive.instance.warmGray70;
  @override
  Color get pageIndicator => ColorPrimitive.instance.warmGray35;
  @override
  Color get selectionActiveDisabled => ColorPrimitive.instance.warmGray55;
  @override
  Color get textFieldAssistive => ColorPrimitive.instance.warmGray45;
  @override
  Color get cardDark => ColorPrimitive.instance.neutralGray25;
  @override
  Color get cardLight => ColorPrimitive.instance.warmGray70;
  @override
  Color get subSupporting => ColorPrimitive.instance.neutralGray25;
}
