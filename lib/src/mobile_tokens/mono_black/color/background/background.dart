/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart' show Color;

import '../../../../core_tokens/color_primitive.dart';
import '../../../base/color/background/background_base.dart';

class Background extends BackgroundBase {
  const Background();

  @override
  Color get defaultColor => ColorPrimitive.instance.black;
}
