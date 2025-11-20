/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

class RadiusPrimitive {
  RadiusPrimitive._();

  static RadiusPrimitive? _instance;
  static RadiusPrimitive get instance => _instance ??= RadiusPrimitive._();

  late final Radius radiusBannerXs = const Radius.circular(8);
  late final Radius radiusCardFull = const Radius.circular(999);
  late final Radius radiusCardXxl = const Radius.circular(28);
  late final Radius radiusCardXl = const Radius.circular(20);
  late final Radius radiusHeader = const Radius.circular(8);
  late final Radius radiusTabXl = const Radius.circular(16);
  late final Radius radiusThumbnailXl = const Radius.circular(28);
  late final Radius radiusThumbnailM = const Radius.circular(16);
  late final Radius radiusThumbnailXs = const Radius.circular(8);
}
