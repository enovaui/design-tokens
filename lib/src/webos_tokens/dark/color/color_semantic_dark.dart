/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../color_semantic.dart';
import 'background/background.dart';
import 'on_background/on_background.dart';
import 'on_surface/on_surface.dart';
import 'scrim/scrim.dart';
import 'stroke/stroke.dart';
import 'surface/surface.dart';

class ColorSemanticDark extends ColorSemantic {
  const ColorSemanticDark._();

  static ColorSemanticDark? _instance;

  static ColorSemanticDark get instance =>
      _instance ??= const ColorSemanticDark._();

  @override
  Background get background => const Background();
  @override
  OnBackground get onBackground => const OnBackground();
  @override
  Surface get surface => const Surface();
  @override
  OnSurface get onSurface => const OnSurface();
  @override
  Stroke get stroke => const Stroke();
  @override
  Scrim get scrim => const Scrim();
}
