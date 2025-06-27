/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: LicenseRef-LGE-Proprietary
 */

import 'package:flutter/material.dart' show Color;

import '../../../../core_tokens/color_primitive.dart';
import 'overlay/overlay.dart';
import 'popup/popup.dart';
import '../../../base/color/stroke/stroke_base.dart';

class Stroke extends StrokeBase {
  const Stroke();

  @override
  Overlay get overlay => const Overlay();

  @override
  Popup get popup => const Popup();

  @override
  Color get main => ColorPrimitive.instance.neutralGray35;

  @override
  Color get mainDisabledFocused => ColorPrimitive.instance.neutralGray70;

  @override
  Color get mainFocused => ColorPrimitive.instance.white;

  @override
  Color get mainSelected => ColorPrimitive.instance.coolGray40;

  @override
  Color get sub => ColorPrimitive.instance.neutralGray70;

  @override
  Color get accent => ColorPrimitive.instance.activeRed55;

  @override
  Color get highlight => ColorPrimitive.instance.white;

  @override
  Color get buttonOutline => ColorPrimitive.instance.white;

  @override
  Color get selectionInactive => ColorPrimitive.instance.white;

  @override
  Color get selectionInactiveFocused => ColorPrimitive.instance.neutralGray10;

  @override
  Color get white => ColorPrimitive.instance.white;

  @override
  Color get black => ColorPrimitive.instance.black;
}
