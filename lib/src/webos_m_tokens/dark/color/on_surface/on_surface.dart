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
  Color get main => ColorPrimitive.instance.white;
  @override
  Color get mainDisabled => ColorPrimitive.instance.white;
  @override
  Color get sub => ColorPrimitive.instance.sandGray65;
  @override
  Color get subDisabled => ColorPrimitive.instance.sandGray65;
  @override
  Color get accentDark => ColorPrimitive.instance.cobaltBlue45;
  @override
  Color get accentDarkDisabled => ColorPrimitive.instance.cobaltBlue45;
  @override
  Color get accentLight => ColorPrimitive.instance.cobaltBlue65;
  @override
  Color get accentLightDisabled => ColorPrimitive.instance.cobaltBlue65;
  @override
  Color get black => ColorPrimitive.instance.black;
  @override
  Color get navigationBarHandleDark => ColorPrimitive.instance.black;
  @override
  Color get navigationBarHandleLight => ColorPrimitive.instance.white;
  @override
  Color get pageIndicatorDark => ColorPrimitive.instance.black;
  @override
  Color get pageIndicatorLight => ColorPrimitive.instance.white;
  @override
  Color get pickerPrimary => ColorPrimitive.instance.white;
  @override
  Color get pickerSecondary => ColorPrimitive.instance.white;
  @override
  Color get pickerTertiary => ColorPrimitive.instance.white;
  @override
  Color get selectionCheckmarkActiveDisabled => ColorPrimitive.instance.sandGray55;
  @override
  Color get sliderHandle => ColorPrimitive.instance.cobaltBlue50;
}
