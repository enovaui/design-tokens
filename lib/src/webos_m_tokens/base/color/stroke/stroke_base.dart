/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

abstract class StrokeBase {
  const StrokeBase();

  Color get defaultError;
  Color get defaultGradientStart;
  Color get defaultGradientStop;
  Color get defaultGradientEnd;
  Color get main;
  Color get mainDisabled;
  Color get mainSupporting;
  Color get mainSupportingDisabled;
  Color get sub;
  Color get subDisabled;
  Color get subSupporting;
  Color get accent;
  Color get accentDisabled;
  Color get navigationBar;
  Color get navigationBarApp;
  Color get pickerColor;
  Color get selectionInactive;
  Color get selectionInactiveDisabled;
  Color get tabActive;
}
