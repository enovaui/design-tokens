/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

import 'popup/popup_base.dart';

abstract class OnBackgroundBase {
  const OnBackgroundBase();

  PopupBase get popup;
  Color get main;
  Color get sub;
  Color get accent;
  Color get highlightGreen;
  Color get highlightYellow;
  Color get actionguide;
  Color get heading;
  Color get white;
  Color get black;
  Color get defaultError;
}
