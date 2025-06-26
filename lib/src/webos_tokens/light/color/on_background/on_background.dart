/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: LicenseRef-LGE-Proprietary
 */

import "package:flutter/material.dart";
import "../../../../core_tokens/color_primitive.dart";
import "popup/popup.dart";
import "../../../base/on_background/on_background_base.dart";

class OnBackground extends OnBackgroundBase {
  const OnBackground();

  @override
  Popup get popup => const Popup();
  @override
  Color get accent => ColorPrimitive.instance.activeRed55;
  @override
  Color get actionguide => ColorPrimitive.instance.neutralGray50;
  @override
  Color get black => ColorPrimitive.instance.black;
  @override
  Color get heading => ColorPrimitive.instance.neutralGray50;
  @override
  Color get highlightGreen => ColorPrimitive.instance.mintGreen50;
  @override
  Color get highlightYellow => ColorPrimitive.instance.yellow80;
  @override
  Color get main => ColorPrimitive.instance.neutralGray10;
  @override
  Color get sub => ColorPrimitive.instance.neutralGray35;
  @override
  Color get white => ColorPrimitive.instance.white;
  @override
  Color get defaultError => ColorPrimitive.instance.deepOrange50;
}