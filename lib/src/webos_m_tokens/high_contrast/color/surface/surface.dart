/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
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
  Color get defaultIndicator => ColorPrimitive.instance.yellow85;
  @override
  Color get defaultNotification => ColorPrimitive.instance.activeRed55;
  @override
  Color get defaultPlaceholder => ColorPrimitive.instance.coolGray15;
  @override
  Color get defaultPlaceholderDisabled => ColorPrimitive.instance.sandGray40;
  @override
  Color get defaultTrack => ColorPrimitive.instance.coolGray15;
  @override
  Color get defaultWarning => ColorPrimitive.instance.activeRed60;
  @override
  Color get defaultWarningDisabled => ColorPrimitive.instance.activeRed60;
  @override
  Color get main => ColorPrimitive.instance.coolGray5;
  @override
  Color get mainSupporting => ColorPrimitive.instance.coolGray5;
  @override
  Color get sub => ColorPrimitive.instance.coolGray15;
  @override
  Color get accent => ColorPrimitive.instance.yellow85;
  @override
  Color get accessBar => ColorPrimitive.instance.coolGray40;
  @override
  Color get accessBarAppGradientStart => ColorPrimitive.instance.sandGray10;
  @override
  Color get accessBarAppGradientEnd => ColorPrimitive.instance.sandGray25;
  @override
  Color get badgeDark => ColorPrimitive.instance.black;
  @override
  Color get badgeLight => ColorPrimitive.instance.white;
  @override
  Color get buttonPrimary => ColorPrimitive.instance.yellow85;
  @override
  Color get buttonPrimaryDisabled => ColorPrimitive.instance.yellow85;
  @override
  Color get buttonPrimaryTintPressed => ColorPrimitive.instance.white;
  @override
  Color get buttonSecondary => ColorPrimitive.instance.coolGray15;
  @override
  Color get buttonSecondaryDisabled => ColorPrimitive.instance.coolGray15;
  @override
  Color get buttonSecondaryTintPressed => ColorPrimitive.instance.sandGray85;
  @override
  Color get buttonIconFocused => ColorPrimitive.instance.white;
  @override
  Color get buttonIconDisabled => ColorPrimitive.instance.sandGray30;
  @override
  Color get buttonIconTintPressed => ColorPrimitive.instance.white;
  @override
  Color get buttonLabelTintPressed => ColorPrimitive.instance.white;
  @override
  Color get chip => ColorPrimitive.instance.coolGray15;
  @override
  Color get chipDisabled => ColorPrimitive.instance.coolGray15;
  @override
  Color get homeGridIndicatorDark => ColorPrimitive.instance.black;
  @override
  Color get homeGridIndicatorLight => ColorPrimitive.instance.white;
  @override
  Color get iconGridSelected => ColorPrimitive.instance.yellow85;
  @override
  Color get iconGridDisabled => ColorPrimitive.instance.sandGray30;
  @override
  Color get iconGridActive => ColorPrimitive.instance.yellow85;
  @override
  Color get iconGridSelectionCheckbox => ColorPrimitive.instance.sandGray5;
  @override
  Color get listSelected => ColorPrimitive.instance.sandGray85;
  @override
  Color get menu => ColorPrimitive.instance.sandGray5;
  @override
  Color get navigationPressed => ColorPrimitive.instance.sandGray85;
  @override
  Color get menuSelected => ColorPrimitive.instance.sandGray85;
  @override
  Color get peekViewActive => ColorPrimitive.instance.yellow85;
  @override
  Color get pickerColor => ColorPrimitive.instance.white;
  @override
  Color get pickerDate => ColorPrimitive.instance.yellow85;
  @override
  Color get sliderTickMark => ColorPrimitive.instance.sandGray55;
  @override
  Color get scrollBarHandle => ColorPrimitive.instance.coolGray50;
  @override
  Color get selectionActive => ColorPrimitive.instance.yellow85;
  @override
  Color get selectionActiveDisabled => ColorPrimitive.instance.yellow85;
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
  Color get subSupporting => ColorPrimitive.instance.coolGray10;
}
