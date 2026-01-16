/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart' show Color;

/// Base structure for web semantic on-background colors.
abstract class OnBackgroundBase {
  const OnBackgroundBase();

  Color get main;
  Color get mainSupporting;
  Color get sub;
  Color get accent;
  Color get highlight;
  Color get white;
}
