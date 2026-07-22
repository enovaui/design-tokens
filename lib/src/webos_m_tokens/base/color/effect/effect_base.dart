/*
 * SPDX-FileCopyrightText: Copyright 2026 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

abstract class EffectBase {
  const EffectBase();

  Color get defaultDropShadow;
  Color get defaultInnerShadow;
  Color get homeGridDropShadowDark;
  Color get homeGridDropShadowLight;
  Color get pageIndicatorDropShadowDark;
  Color get pageIndicatorDropShadowLight;
  Color get statusBarDropShadowDark;
  Color get statusBarDropShadowLight;
}
