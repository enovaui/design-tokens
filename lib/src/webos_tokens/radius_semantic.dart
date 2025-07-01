/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

import '../core_tokens/radius_primitive.dart';

class RadiusSemantic {
  const RadiusSemantic();

  Radius get full => RadiusPrimitive.instance.radius999;
  Radius get button => RadiusPrimitive.instance.radius24;
  Radius get container => RadiusPrimitive.instance.radius36;
  Radius get overlay => RadiusPrimitive.instance.radius60;
  Radius get popup => RadiusPrimitive.instance.radius60;
}
