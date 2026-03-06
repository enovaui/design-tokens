/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart' show Color;

import '../../../../../core_tokens/color_primitive.dart';
import '../../../../base/color/surface/popup/popup_base.dart';

class Popup extends PopupBase {
  const Popup();

  @override
  Color get defaultColor => ColorPrimitive.instance.coolGray30;
  @override
  Color get defaultSelected => ColorPrimitive.instance.coolGray10;
  @override
  Color get defaultDisabledFocused => ColorPrimitive.instance.neutralGray70;
  @override
  Color get defaultGroup => ColorPrimitive.instance.white;
  @override
  Color get defaultTrack => ColorPrimitive.instance.neutralGray40;
  @override
  Color get inputField => ColorPrimitive.instance.neutralGray30;
  @override
  Color get inputFieldSuccess => ColorPrimitive.instance.neutralGray40;
  @override
  Color get scrollHandle => ColorPrimitive.instance.neutralGray50;
  @override
  Color get toast => ColorPrimitive.instance.black;
}
