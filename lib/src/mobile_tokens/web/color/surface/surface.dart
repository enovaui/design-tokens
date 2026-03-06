/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart' show Color;

import '../../../../core_tokens/color_primitive.dart';
import '../../../base/color/surface/surface_base.dart';

class Surface extends SurfaceBase {
  const Surface();

  @override
  Color get defaultHover => ColorPrimitive.instance.blueGray95;
  @override
  Color get defaultFocused => ColorPrimitive.instance.blueGray90;
  @override
  Color get defaultPressed => ColorPrimitive.instance.blueGray90;
  @override
  Color get defaultSelected => ColorPrimitive.instance.blueGray90;
  @override
  Color get defaultHandle => ColorPrimitive.instance.blueGray80;
  @override
  Color get defaultIndicator => ColorPrimitive.instance.navy40;
  @override
  Color get defaultNotification => ColorPrimitive.instance.blueGreen40;
  @override
  Color get defaultPlaceholder => ColorPrimitive.instance.mistGray80;
  @override
  Color get defaultTrack => ColorPrimitive.instance.blueGray80;
  @override
  Color get accent => ColorPrimitive.instance.blueGreen40;
  @override
  Color get badgeDark => ColorPrimitive.instance.blueGray10;
  @override
  Color get badgeLight => ColorPrimitive.instance.blueGray90;
  @override
  Color get buttonPrimary => ColorPrimitive.instance.blueGreen40;
  @override
  Color get buttonPrimaryHover => ColorPrimitive.instance.blueGreen30;
  @override
  Color get buttonPrimaryFocused => ColorPrimitive.instance.blueGreen30;
  @override
  Color get buttonPrimaryPressed => ColorPrimitive.instance.blueGreen20;
  @override
  Color get buttonSecondary => ColorPrimitive.instance.blueGray90;
  @override
  Color get buttonSecondaryHover => ColorPrimitive.instance.blueGray80;
  @override
  Color get buttonSecondaryFocused => ColorPrimitive.instance.blueGray80;
  @override
  Color get buttonSecondaryPressed => ColorPrimitive.instance.blueGray70;
  @override
  Color get buttonTertiary => ColorPrimitive.instance.white;
  @override
  Color get buttonTertiaryHover => ColorPrimitive.instance.white;
  @override
  Color get buttonTertiaryFocused => ColorPrimitive.instance.white;
  @override
  Color get buttonTertiaryPressed => ColorPrimitive.instance.blueGray90;
  @override
  Color get buttonIcon => ColorPrimitive.instance.blueGray90;
  @override
  Color get buttonIconPressed => ColorPrimitive.instance.blueGray70;
  @override
  Color get chip => ColorPrimitive.instance.white;
  @override
  Color get chipSelected => ColorPrimitive.instance.navy40;
  @override
  Color get notificationCard => ColorPrimitive.instance.blueGray90;
  @override
  Color get selectionActive => ColorPrimitive.instance.blueGreen50;
  @override
  Color get selectionInactive => ColorPrimitive.instance.mistGray70;
  @override
  Color get toast => ColorPrimitive.instance.blueGray10;
  @override
  Color get white => ColorPrimitive.instance.white;
  @override
  Color get black => ColorPrimitive.instance.blueGray10;
  @override
  Color get main => ColorPrimitive.instance.white;
  @override
  Color get sub => ColorPrimitive.instance.blueGray90;
}
