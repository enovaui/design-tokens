/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

class RadiusPrimitive {
  RadiusPrimitive._();

  static RadiusPrimitive? _instance;
  static RadiusPrimitive get instance => _instance ??= RadiusPrimitive._();

  late final Radius radius0 = Radius.zero;
  late final Radius radius2 = const Radius.circular(2);
  late final Radius radius4 = const Radius.circular(4);
  late final Radius radius6 = const Radius.circular(6);
  late final Radius radius8 = const Radius.circular(8);
  late final Radius radius10 = const Radius.circular(10);
  late final Radius radius12 = const Radius.circular(12);
  late final Radius radius16 = const Radius.circular(16);
  late final Radius radius20 = const Radius.circular(20);
  late final Radius radius24 = const Radius.circular(24);
  late final Radius radius30 = const Radius.circular(30);
  late final Radius radius36 = const Radius.circular(36);
  late final Radius radius40 = const Radius.circular(40);
  late final Radius radius44 = const Radius.circular(44);
  late final Radius radius48 = const Radius.circular(48);
  late final Radius radius60 = const Radius.circular(60);
  late final Radius radius999 = const Radius.circular(999);
}
