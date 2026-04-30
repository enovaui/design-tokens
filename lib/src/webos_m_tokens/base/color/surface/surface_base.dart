/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

abstract class SurfaceBase {
  const SurfaceBase();

  Color get defaultGradientStart;
  Color get defaultGradientEnd;
  Color get defaultIndicator;
  Color get defaultNotification;
  Color get defaultPlaceholder;
  Color get defaultPlaceholderDisabled;
  Color get defaultTrack;
  Color get defaultWarning;
  Color get defaultWarningDisabled;
  Color get main;
  Color get sub;
  Color get badgeDark;
  Color get badgeLight;
  Color get buttonPrimary;
  Color get buttonPrimaryDisabled;
  Color get buttonSecondary;
  Color get buttonSecondaryDisabled;
  Color get buttonTertiary;
  Color get buttonTertiaryDisabled;
  Color get buttonTintPressed;
  Color get buttonIcon;
  Color get buttonIconSelected;
  Color get buttonIconDisabled;
  Color get chip;
  Color get chipSelected;
  Color get chipDisabled;
  Color get homeGridIndicatorActive;
  Color get homeGridIndicatorDark;
  Color get homeGridIndicatorLight;
  Color get iconGrid;
  Color get iconGridSelected;
  Color get iconGridDisabled;
  Color get iconGridActive;
  Color get iconGridSelectionCheckbox;
  Color get listSelected;
  Color get menu;
  Color get menuSelected;
  Color get navigationBar;
  Color get navigationBarAppGradientStart;
  Color get navigationBarAppGradientEnd;
  Color get pickerColor;
  Color get pickerDate;
  Color get sliderTickMark;
  Color get scrollBarHandle;
  Color get statusBar;
  Color get selectionActive;
  Color get selectionActiveDisabled;
  Color get selectionInactive;
  Color get selectionInactiveDisabled;
  Color get selectionCheckboxActiveDisabled;
  Color get selectionCheckboxInactive;
  Color get selectionCheckboxInactiveDisabled;
  Color get tabActive;
  Color get toast;
  Color get tooltip;
}
