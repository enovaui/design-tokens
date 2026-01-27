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
  Color get defaultHover => ColorPrimitive.instance.warmGray80;
  @override
  Color get defaultFocused => ColorPrimitive.instance.warmGray75;
  @override
  Color get defaultPressed => ColorPrimitive.instance.warmGray75;
  @override
  Color get defaultSelected => ColorPrimitive.instance.warmGray75;
  @override
  Color get defaultHandle => ColorPrimitive.instance.black;
  @override
  Color get defaultIndicator => ColorPrimitive.instance.heritageRed40;
  @override
  Color get defaultNotification => ColorPrimitive.instance.activeRed50;
  @override
  Color get defaultPlaceholder => ColorPrimitive.instance.warmGray60;
  @override
  Color get defaultTrack => ColorPrimitive.instance.warmGray75;
  @override
  Color get accent => ColorPrimitive.instance.activeRed50;
  @override
  Color get badgeDark => ColorPrimitive.instance.warmGray10;
  @override
  Color get badgeLight => ColorPrimitive.instance.warmGray75;
  @override
  Color get buttonPrimary => ColorPrimitive.instance.activeRed50;
  @override
  Color get buttonPrimaryHover => ColorPrimitive.instance.activeRed40;
  @override
  Color get buttonPrimaryFocused => ColorPrimitive.instance.activeRed40;
  @override
  Color get buttonPrimaryPressed => ColorPrimitive.instance.activeRed30;
  @override
  Color get buttonSecondary => ColorPrimitive.instance.warmGray75;
  @override
  Color get buttonSecondaryHover => ColorPrimitive.instance.warmGray60;
  @override
  Color get buttonSecondaryFocused => ColorPrimitive.instance.warmGray60;
  @override
  Color get buttonSecondaryPressed => ColorPrimitive.instance.warmGray60;
  @override
  Color get buttonTertiary => ColorPrimitive.instance.white;
  @override
  Color get buttonTertiaryHover => ColorPrimitive.instance.white;
  @override
  Color get buttonTertiaryFocused => ColorPrimitive.instance.white;
  @override
  Color get buttonTertiaryPressed => ColorPrimitive.instance.warmGray75;
  @override
  Color get buttonIcon => ColorPrimitive.instance.warmGray75;
  @override
  Color get buttonIconPressed => ColorPrimitive.instance.warmGray60;
  @override
  Color get chip => ColorPrimitive.instance.white;
  @override
  Color get chipSelected => ColorPrimitive.instance.activeRed50;
  @override
  Color get notificationCard => ColorPrimitive.instance.warmGray75;
  @override
  Color get selectionActive => ColorPrimitive.instance.warmGray15;
  @override
  Color get selectionInactive => ColorPrimitive.instance.warmGray60;
  @override
  Color get toast => ColorPrimitive.instance.warmGray10;
  @override
  Color get white => ColorPrimitive.instance.white;
  @override
  Color get black => ColorPrimitive.instance.warmGray10;
  @override
  Color get main => ColorPrimitive.instance.white;
  @override
  Color get sub => ColorPrimitive.instance.warmGray75;
}
