/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart' show Color;

import '../../../../core_tokens/color_primitive.dart';
import '../../../base/color/surface/surface_base.dart';
import 'overlay/overlay.dart';
import 'popup/popup.dart';

class Surface extends SurfaceBase {
  const Surface();

  @override
  Overlay get overlay => const Overlay();
  @override
  Popup get popup => const Popup();
  @override
  Color get defaultColor => ColorPrimitive.instance.coolGray55;
  @override
  Color get defaultFocused => ColorPrimitive.instance.white;
  @override
  Color get defaultSelected => ColorPrimitive.instance.coolGray40;
  @override
  Color get defaultDisabledFocused => ColorPrimitive.instance.coolGray80;
  @override
  Color get defaultGroup => ColorPrimitive.instance.neutralGray50;
  @override
  Color get defaultNotification => ColorPrimitive.instance.deepOrange50;
  @override
  Color get defaultTrack => ColorPrimitive.instance.coolGray55;
  @override
  Color get defaultTranslucent => ColorPrimitive.instance.neutralGray50;
  @override
  Color get subNotification => ColorPrimitive.instance.mintGreen40;
  @override
  Color get accent => ColorPrimitive.instance.activeRed55;
  @override
  Color get contextGroup => ColorPrimitive.instance.coolGray80;
  @override
  Color get inputField => ColorPrimitive.instance.neutralGray80;
  @override
  Color get inputFieldSuccess => ColorPrimitive.instance.neutralGray90;
  @override
  Color get scrollHandle => ColorPrimitive.instance.coolGray60;
  @override
  Color get toggle => ColorPrimitive.instance.neutralGray45;
  @override
  Color get toggleActive => ColorPrimitive.instance.mintGreen50;
  @override
  Color get toggleHandle => ColorPrimitive.instance.neutralGray70;
  @override
  Color get white => ColorPrimitive.instance.white;
  @override
  Color get black => ColorPrimitive.instance.black;
  @override
  Color get defaultHandle => ColorPrimitive.instance.activeRed70;
  @override
  Color get defaultIndicator => ColorPrimitive.instance.neutralGray10;
  @override
  Color get defaultPlaceholder => ColorPrimitive.instance.coolGray15;
}
