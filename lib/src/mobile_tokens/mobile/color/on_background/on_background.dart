/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart' show Color;

import '../../../../core_tokens/color_primitive.dart';
import '../../../base/color/on_background/on_background_base.dart';

class OnBackground extends OnBackgroundBase {
  const OnBackground();

  @override
  Color get defaultColor => ColorPrimitive.instance.mistGray10;
}
