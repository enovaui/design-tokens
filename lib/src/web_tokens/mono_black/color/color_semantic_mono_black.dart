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

class ColorSemanticMonoBlack extends ColorSemantic {
  const ColorSemanticMonoBlack._();

  static ColorSemanticMonoBlack? _instance;

  static ColorSemanticMonoBlack get instance =>
    _instance ??= const ColorSemanticMonoBlack._();

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
