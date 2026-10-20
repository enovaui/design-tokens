/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

abstract class OnSurfaceBase {
  const OnSurfaceBase();

  Color get defaultError;
  Color get defaultHandle;
  Color get defaultWarning;
  Color get defaultWarningDisabled;
  Color get main;
  Color get mainDisabled;
  Color get sub;
  Color get subDisabled;
  Color get accentDark;
  Color get accentDarkDisabled;
  Color get accentLight;
  Color get accentLightDisabled;
  Color get black;
  Color get accessBarHandleDark;
  Color get accessBarHandleLight;
  Color get buttonPrimary;
  Color get buttonPrimaryDisabled;
  Color get buttonSecondary;
  Color get buttonSecondaryDisabled;
  Color get buttonIconSelected;
  Color get chip;
  Color get chipDisabled;
  Color get pageIndicatorDark;
  Color get pageIndicatorLight;
  Color get pickerSelected;
  Color get pickerPrimary;
  Color get pickerSecondary;
  Color get pickerTertiary;
  Color get selection;
  Color get selectionDisabled;
  Color get selectionCheckmarkActiveDisabled;
  Color get slider;
  Color get sliderHandle;
  Color get statusBarFloatingOrange;
  Color get statusBarFloatingRed;
}
