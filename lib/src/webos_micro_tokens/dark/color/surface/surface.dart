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
  Color get defaultGradientStart => ColorPrimitive.instance.white;
  @override
  Color get defaultGradientEnd => ColorPrimitive.instance.white;
  @override
  Color get defaultIndicator => ColorPrimitive.instance.cobaltBlue50;
  @override
  Color get defaultNotification => ColorPrimitive.instance.activeRed55;
  @override
  Color get defaultPlaceholder => ColorPrimitive.instance.sandGray40;
  @override
  Color get defaultPlaceholderDisabled => ColorPrimitive.instance.sandGray40;
  @override
  Color get defaultTrack => ColorPrimitive.instance.sandGray30;
  @override
  Color get defaultWarning => ColorPrimitive.instance.deepOrange40;
  @override
  Color get defaultWarningDisabled => ColorPrimitive.instance.deepOrange40;
  @override
  Color get main => ColorPrimitive.instance.sandGray25;
  @override
  Color get sub => ColorPrimitive.instance.sandGray5;
  @override
  Color get badgeDark => ColorPrimitive.instance.black;
  @override
  Color get badgeLight => ColorPrimitive.instance.white;
  @override
  Color get buttonPrimary => ColorPrimitive.instance.cobaltBlue40;
  @override
  Color get buttonPrimaryDisabled => ColorPrimitive.instance.cobaltBlue40;
  @override
  Color get buttonSecondary => ColorPrimitive.instance.cobaltBlue20;
  @override
  Color get buttonSecondaryDisabled => ColorPrimitive.instance.cobaltBlue20;
  @override
  Color get buttonTertiary => ColorPrimitive.instance.sandGray30;
  @override
  Color get buttonTertiaryDisabled => ColorPrimitive.instance.sandGray30;
  @override
  Color get buttonTintPressed => ColorPrimitive.instance.black;
  @override
  Color get buttonIcon => ColorPrimitive.instance.sandGray30;
  @override
  Color get buttonIconSelected => ColorPrimitive.instance.cobaltBlue45;
  @override
  Color get buttonIconDisabled => ColorPrimitive.instance.sandGray30;
  @override
  Color get chip => ColorPrimitive.instance.sandGray30;
  @override
  Color get chipSelected => ColorPrimitive.instance.cobaltBlue40;
  @override
  Color get chipDisabled => ColorPrimitive.instance.sandGray30;
  @override
  Color get homegridIndicatorActive => ColorPrimitive.instance.cobaltBlue45;
  @override
  Color get homegridIndicatorDark => ColorPrimitive.instance.black;
  @override
  Color get homegridIndicatorLight => ColorPrimitive.instance.white;
  @override
  Color get iconGrid => ColorPrimitive.instance.sandGray30;
  @override
  Color get iconGridSelected => ColorPrimitive.instance.cobaltBlue45;
  @override
  Color get iconGridDisabled => ColorPrimitive.instance.sandGray30;
  @override
  Color get iconGridActive => ColorPrimitive.instance.cobaltBlue50;
  @override
  Color get iconGridSelectionCheckbox => ColorPrimitive.instance.sandGray5;
  @override
  Color get listSelected => ColorPrimitive.instance.sandGray85;
  @override
  Color get menu => ColorPrimitive.instance.sandGray25;
  @override
  Color get menuSelected => ColorPrimitive.instance.sandGray85;
  @override
  Color get navigationBar => ColorPrimitive.instance.sandGray50;
  @override
  Color get navigationBarAppGradientStart => ColorPrimitive.instance.sandGray10;
  @override
  Color get navigationBarAppGradientEnd => ColorPrimitive.instance.sandGray25;
  @override
  Color get pickerColor => ColorPrimitive.instance.white;
  @override
  Color get pickerDate => ColorPrimitive.instance.cobaltBlue45;
  @override
  Color get sliderTickmark => ColorPrimitive.instance.sandGray55;
  @override
  Color get scrollBarHandle => ColorPrimitive.instance.sandGray55;
  @override
  Color get statusBar => ColorPrimitive.instance.sandGray25;
  @override
  Color get selectionActive => ColorPrimitive.instance.cobaltBlue45;
  @override
  Color get selectionActiveDisabled => ColorPrimitive.instance.cobaltBlue45;
  @override
  Color get selectionInactive => ColorPrimitive.instance.sandGray55;
  @override
  Color get selectionInactiveDisabled => ColorPrimitive.instance.sandGray55;
  @override
  Color get selectionCheckboxActiveDisabled => ColorPrimitive.instance.sandGray55;
  @override
  Color get selectionCheckboxInactive => ColorPrimitive.instance.sandGray5;
  @override
  Color get selectionCheckboxInactiveDisabled => ColorPrimitive.instance.sandGray5;
  @override
  Color get tabActive => ColorPrimitive.instance.activeRed55;
  @override
  Color get toast => ColorPrimitive.instance.sandGray25;
  @override
  Color get tooltip => ColorPrimitive.instance.sandGray25;
}
