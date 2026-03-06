/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

abstract class BackgroundBase {
  const BackgroundBase();

  Color get main;
  Color get sub;
  Color get white;
  Color get black;
  Color get darkGray;
  Color get mainDark;
}
