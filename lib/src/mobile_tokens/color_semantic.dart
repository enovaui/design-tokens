/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'base/color/background/background_base.dart';
import 'base/color/on_background/on_background_base.dart';
import 'base/color/on_surface/on_surface_base.dart';
import 'base/color/scrim/scrim_base.dart';
import 'base/color/stroke/stroke_base.dart';
import 'base/color/surface/surface_base.dart';

abstract class ColorSemantic {
  const ColorSemantic();

  BackgroundBase get background;
  OnBackgroundBase get onBackground;
  SurfaceBase get surface;
  OnSurfaceBase get onSurface;
  StrokeBase get stroke;
  ScrimBase get scrim;
}
