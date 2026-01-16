/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

/// Base structure for mobile semantic on-background colors.
abstract class OnBackgroundBase {
  const OnBackgroundBase();

  /// Text/icon color on top of the default background.
  Color get defaultColor;
}
