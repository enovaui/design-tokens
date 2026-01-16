/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

/// Base structure for mobile semantic on-surface colors.
abstract class OnSurfaceBase {
  const OnSurfaceBase();

  Color get defaultError;
  Color get defaultSuccess;
  Color get main;
  Color get mainSelected;
  Color get sub;
  Color get accent;
  Color get button;
  Color get white;
  Color get black;
}
