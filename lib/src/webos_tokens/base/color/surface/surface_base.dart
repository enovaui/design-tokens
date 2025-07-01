/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

import 'overlay/overlay_base.dart';
import 'popup/popup_base.dart';

abstract class SurfaceBase {
  const SurfaceBase();

  OverlayBase get overlay;
  PopupBase get popup;
  Color get defaultColor;
  Color get defaultFocused;
  Color get defaultSelected;
  Color get defaultDisabledFocused;
  Color get defaultGroup;
  Color get defaultNotification;
  Color get defaultTrack;
  Color get defaultTranslucent;
  Color get subNotification;
  Color get accent;
  Color get contextGroup;
  Color get inputField;
  Color get inputFieldSuccess;
  Color get scrollHandle;
  Color get toggle;
  Color get toggleActive;
  Color get toggleHandle;
  Color get white;
  Color get black;
  Color get defaultHandle;
  Color get defaultIndicator;
  Color get defaultPlaceholder;
}
