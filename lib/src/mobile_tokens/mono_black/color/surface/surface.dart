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
  Color get defaultHover => ColorPrimitive.instance.mistGray95;
  @override
  Color get defaultFocused => ColorPrimitive.instance.mistGray95;
  @override
  Color get defaultPressed => ColorPrimitive.instance.mistGray90;
  @override
  Color get defaultSelected => ColorPrimitive.instance.mistGray50;
  @override
  Color get defaultHandle => ColorPrimitive.instance.mistGray60;
  @override
  Color get defaultIndicator => ColorPrimitive.instance.mistGray90;
  @override
  Color get defaultNotification => ColorPrimitive.instance.redOrange60;
  @override
  Color get defaultPlaceholder => ColorPrimitive.instance.mistGray60;
  @override
  Color get defaultTrack => ColorPrimitive.instance.mistGray40;
  @override
  Color get accent => ColorPrimitive.instance.mistGray50;
  @override
  Color get badgeDark => ColorPrimitive.instance.mistGray60;
  @override
  Color get badgeLight => ColorPrimitive.instance.mistGray40;
  @override
  Color get buttonPrimary => ColorPrimitive.instance.mistGray50;
  @override
  Color get buttonPrimaryHover => ColorPrimitive.instance.mistGray90;
  @override
  Color get buttonPrimaryFocused => ColorPrimitive.instance.mistGray90;
  @override
  Color get buttonPrimaryPressed => ColorPrimitive.instance.mistGray30;
  @override
  Color get buttonSecondary => ColorPrimitive.instance.mistGray50;
  @override
  Color get buttonSecondaryHover => ColorPrimitive.instance.mistGray90;
  @override
  Color get buttonSecondaryFocused => ColorPrimitive.instance.mistGray90;
  @override
  Color get buttonSecondaryPressed => ColorPrimitive.instance.mistGray30;
  @override
  Color get buttonTertiary => ColorPrimitive.instance.mistGray50;
  @override
  Color get buttonTertiaryHover => ColorPrimitive.instance.mistGray90;
  @override
  Color get buttonTertiaryFocused => ColorPrimitive.instance.mistGray90;
  @override
  Color get buttonTertiaryPressed => ColorPrimitive.instance.mistGray30;
  @override
  Color get buttonIcon => ColorPrimitive.instance.mistGray40;
  @override
  Color get buttonIconPressed => ColorPrimitive.instance.mistGray50;
  @override
  Color get chip => ColorPrimitive.instance.mistGray40;
  @override
  Color get chipSelected => ColorPrimitive.instance.mistGray90;
  @override
  Color get notificationCard => ColorPrimitive.instance.mistGray40;
  @override
  Color get selectionActive => ColorPrimitive.instance.green60;
  @override
  Color get selectionInactive => ColorPrimitive.instance.mistGray50;
  @override
  Color get toast => ColorPrimitive.instance.mistGray60;
  @override
  Color get white => ColorPrimitive.instance.white;
  @override
  Color get black => ColorPrimitive.instance.mistGray10;
  @override
  Color get main => ColorPrimitive.instance.mistGray30;
  @override
  Color get sub => ColorPrimitive.instance.mistGray90;
}
