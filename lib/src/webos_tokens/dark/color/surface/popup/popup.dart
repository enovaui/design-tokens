/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

import '../../../../../core_tokens/color_primitive.dart';
import '../../../../base/color/surface/popup/popup_base.dart';

class Popup extends PopupBase {
  const Popup();

  @override
  Color get defaultColor => ColorPrimitive.instance.coolGray55;
  @override
  Color get defaultSelected => ColorPrimitive.instance.coolGray40;
  @override
  Color get defaultDisabledFocused => ColorPrimitive.instance.coolGray80;
  @override
  Color get defaultGroup => ColorPrimitive.instance.neutralGray50;
  @override
  Color get defaultTrack => ColorPrimitive.instance.coolGray50;
  @override
  Color get inputField => ColorPrimitive.instance.neutralGray80;
  @override
  Color get inputFieldSuccess => ColorPrimitive.instance.neutralGray90;
  @override
  Color get scrollHandle => ColorPrimitive.instance.coolGray60;
  @override
  Color get toast => ColorPrimitive.instance.neutralGray90;
}
