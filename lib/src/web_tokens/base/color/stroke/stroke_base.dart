/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart' show Color;

/// Base structure for web semantic stroke colors.
abstract class StrokeBase {
  const StrokeBase();

  Color get defaultError;
  Color get defaultSuccess;
  Color get main;
  Color get mainFocused;
  Color get sub;
  Color get accent;
  Color get button;
  Color get selectionActive;
  Color get selectionInactive;
  Color get tab;
  Color get badgeGreen;
  Color get badgeGray;
  Color get badgeOrange;
  Color get badgeMagenta;
  Color get badgeRed;
  Color get buttonTertiary;
  Color get buttonIcon;
  Color get cardSelected;
  Color get cardGray;
  Color get chip;
  Color get chipPink;
  Color get chipWhite;
  Color get textField;
  Color get textFieldFocused;
  Color get textFieldDisabled;
  Color get white;
  Color get black;
  Color get defaultSelected;
  Color get tabSegmented;
  Color get mainSupporting;
  Color get subSupporting;
}
