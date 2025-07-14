/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

import '../../../../../core_tokens/color_primitive.dart';
import '../../../../base/color/on_surface/overlay/overlay_base.dart';

class Overlay extends OverlayBase {
  const Overlay();

  @override
  Color get main => ColorPrimitive.instance.white;
  @override
  Color get sub => ColorPrimitive.instance.neutralGray70;
}
