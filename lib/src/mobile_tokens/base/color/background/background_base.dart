/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

/// Base structure for mobile semantic background colors.
abstract class BackgroundBase {
  const BackgroundBase();

  /// Default background color.
  Color get defaultColor;
}
