/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart' show Color;

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
}
