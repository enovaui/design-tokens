/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart' show Color;

import '../../../../core_tokens/color_primitive.dart';
import '../../../base/color/on_surface/on_surface_base.dart';

class OnSurface extends OnSurfaceBase {
  const OnSurface();

  @override
  Color get defaultError => ColorPrimitive.instance.deepOrange60;
  @override
  Color get defaultHandle => ColorPrimitive.instance.sandGray40;
  @override
  Color get defaultWarning => ColorPrimitive.instance.activeRed60;
  @override
  Color get defaultWarningDisabled => ColorPrimitive.instance.activeRed60;
  @override
  Color get main => ColorPrimitive.instance.white;
  @override
  Color get mainDisabled => ColorPrimitive.instance.white;
  @override
  Color get sub => ColorPrimitive.instance.sandGray65;
  @override
  Color get subDisabled => ColorPrimitive.instance.sandGray65;
  @override
  Color get accentDark => ColorPrimitive.instance.yellow85;
  @override
  Color get accentDarkDisabled => ColorPrimitive.instance.yellow85;
  @override
  Color get accentLight => ColorPrimitive.instance.yellow95;
  @override
  Color get accentLightDisabled => ColorPrimitive.instance.yellow95;
  @override
  Color get black => ColorPrimitive.instance.black;
  @override
  Color get accessBarHandleDark => ColorPrimitive.instance.black;
  @override
  Color get accessBarHandleLight => ColorPrimitive.instance.white;
  @override
  Color get buttonPrimary => ColorPrimitive.instance.black;
  @override
  Color get buttonPrimaryDisabled => ColorPrimitive.instance.black;
  @override
  Color get buttonSecondary => ColorPrimitive.instance.white;
  @override
  Color get buttonSecondaryDisabled => ColorPrimitive.instance.white;
  @override
  Color get buttonIconSelected => ColorPrimitive.instance.black;
  @override
  Color get chip => ColorPrimitive.instance.black;
  @override
  Color get chipDisabled => ColorPrimitive.instance.black;
  @override
  Color get pageIndicatorDark => ColorPrimitive.instance.black;
  @override
  Color get pageIndicatorLight => ColorPrimitive.instance.white;
  @override
  Color get pickerSelected => ColorPrimitive.instance.black;
  @override
  Color get pickerPrimary => ColorPrimitive.instance.white;
  @override
  Color get pickerSecondary => ColorPrimitive.instance.white;
  @override
  Color get pickerTertiary => ColorPrimitive.instance.white;
  @override
  Color get selection => ColorPrimitive.instance.black;
  @override
  Color get selectionDisabled => ColorPrimitive.instance.black;
  @override
  Color get selectionCheckmarkActiveDisabled => ColorPrimitive.instance.sandGray55;
  @override
  Color get slider => ColorPrimitive.instance.black;
  @override
  Color get sliderHandle => ColorPrimitive.instance.yellow85;
  @override
  Color get statusBarFloatingOrange => ColorPrimitive.instance.deepOrange40;
  @override
  Color get statusBarFloatingRed => ColorPrimitive.instance.activeRed55;
}
