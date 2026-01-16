/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

/// Base structure for web semantic scrim colors.
abstract class ScrimBase {
  const ScrimBase();

  Color get defaultColor;
}
