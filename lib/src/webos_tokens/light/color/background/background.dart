/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../../base/color/background/background_base.dart';
import 'full/full.dart';
import 'overlay/overlay.dart';
import 'popup/popup.dart';

class Background extends BackgroundBase {
  const Background();

  @override
  Full get full => const Full();
  @override
  Overlay get overlay => const Overlay();
  @override
  Popup get popup => const Popup();
}
