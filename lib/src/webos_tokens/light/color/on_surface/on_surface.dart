/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart' show Color;

import '../../../../core_tokens/color_primitive.dart';
import '../../../base/color/on_surface/on_surface_base.dart';
import 'overlay/overlay.dart';
import 'popup/popup.dart';

class OnSurface extends OnSurfaceBase {
  const OnSurface();

  @override
  Overlay get overlay => const Overlay();
  @override
  Popup get popup => const Popup();
  @override
  Color get defaultRec => ColorPrimitive.instance.activeRed55;
  @override
  Color get main => ColorPrimitive.instance.white;
  @override
  Color get mainFocused => ColorPrimitive.instance.neutralGray10;
  @override
  Color get mainSelected => ColorPrimitive.instance.white;
  @override
  Color get sub => ColorPrimitive.instance.neutralGray70;
  @override
  Color get subFocused => ColorPrimitive.instance.coolGray30;
  @override
  Color get subSelected => ColorPrimitive.instance.white;
  @override
  Color get accent => ColorPrimitive.instance.activeRed55;
  @override
  Color get highlightGreen => ColorPrimitive.instance.mintGreen50;
  @override
  Color get highlightYellow => ColorPrimitive.instance.yellow80;
  @override
  Color get inputField => ColorPrimitive.instance.neutralGray10;
  @override
  Color get white => ColorPrimitive.instance.white;
  @override
  Color get black => ColorPrimitive.instance.black;
}
