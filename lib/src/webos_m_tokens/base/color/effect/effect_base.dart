/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

abstract class EffectBase {
  const EffectBase();

  Color get innerShadow;
  Color get dropShadow;
  Color get homeGridDropShadow;
  Color get pageIndicatorDropShadow;
}
