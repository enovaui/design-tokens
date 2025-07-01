/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

abstract class PopupBase {
  const PopupBase();

  Color get defaultColor;
  Color get defaultSelected;
  Color get defaultDisabledFocused;
  Color get defaultGroup;
  Color get defaultTrack;
  Color get inputField;
  Color get inputFieldSuccess;
  Color get scrollHandle;
  Color get toast;
}
