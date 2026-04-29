/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

abstract class OnBackgroundBase {
  const OnBackgroundBase();

  Color get main;
  Color get mainDisabled;
  Color get sub;
  Color get subDisabled;
  Color get accentDark;
  Color get accentDarkDisabled;
  Color get accentLight;
  Color get accentLightDisabled;
}
