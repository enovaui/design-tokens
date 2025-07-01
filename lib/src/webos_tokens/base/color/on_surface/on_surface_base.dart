/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

import 'overlay/overlay_base.dart';
import 'popup/popup_base.dart';

abstract class OnSurfaceBase {
  const OnSurfaceBase();

  OverlayBase get overlay;
  PopupBase get popup;
  Color get main;
  Color get mainFocused;
  Color get mainSelected;
  Color get sub;
  Color get subFocused;
  Color get subSelected;
  Color get accent;
  Color get highlightGreen;
  Color get highlightYellow;
  Color get inputField;
  Color get white;
  Color get black;
  Color get defaultRec;
}
