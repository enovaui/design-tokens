/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

import '../../../../core_tokens/color_primitive.dart';
import '../../../base/color/scrim/scrim_base.dart';

class Scrim extends ScrimBase {
  const Scrim();

  @override
  Color get defaultColor => ColorPrimitive.instance.black;
}
