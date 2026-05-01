/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

abstract class BackgroundBase {
  const BackgroundBase();
  
  Color get defaultColor;
  Color get white;
  Color get defaultGradientStart;
  Color get defaultGradientStop1;
  Color get defaultGradientStop2;
  Color get defaultGradientEnd;
}
