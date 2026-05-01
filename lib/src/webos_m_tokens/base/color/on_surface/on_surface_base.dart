/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

abstract class OnSurfaceBase {
  const OnSurfaceBase();

  Color get defaultError;
  Color get defaultHandle;
  Color get main;
  Color get mainDisabled;
  Color get sub;
  Color get subDisabled;
  Color get accentDark;
  Color get accentDarkDisabled;
  Color get accentLight;
  Color get accentLightDisabled;
  Color get black;
  Color get navigationBarHandleDark;
  Color get navigationBarHandleLight;
  Color get pageIndicatorDark;
  Color get pageIndicatorLight;
  Color get pickerPrimary;
  Color get pickerSecondary;
  Color get pickerTertiary;
  Color get selectionCheckmarkActiveDisabled;
  Color get sliderHandle;
}
