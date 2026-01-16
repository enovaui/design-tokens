/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

/// Base structure for mobile semantic surface colors.
abstract class SurfaceBase {
  const SurfaceBase();

  Color get defaultHover;
  Color get defaultFocused;
  Color get defaultPressed;
  Color get defaultSelected;
  Color get defaultHandle;
  Color get defaultIndicator;
  Color get defaultNotification;
  Color get defaultPlaceholder;
  Color get defaultTrack;
  Color get accent;
  Color get badgeDark;
  Color get badgeLight;
  Color get buttonPrimary;
  Color get buttonPrimaryHover;
  Color get buttonPrimaryFocused;
  Color get buttonPrimaryPressed;
  Color get buttonSecondary;
  Color get buttonSecondaryHover;
  Color get buttonSecondaryFocused;
  Color get buttonSecondaryPressed;
  Color get buttonTertiary;
  Color get buttonTertiaryHover;
  Color get buttonTertiaryFocused;
  Color get buttonTertiaryPressed;
  Color get buttonIcon;
  Color get buttonIconPressed;
  Color get chip;
  Color get chipSelected;
  Color get notificationCard;
  Color get selectionActive;
  Color get selectionInactive;
  Color get toast;
  Color get white;
  Color get black;
  Color get main;
  Color get sub;
}
