/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

class FontSizePrimitive {
  FontSizePrimitive._();

  static FontSizePrimitive? _instance;
  static FontSizePrimitive get instance => _instance ??= FontSizePrimitive._();

  late final double size10 = 10;
  late final double size11 = 11;
  late final double size12 = 12;
  late final double size13 = 13;
  late final double size14 = 14;
  late final double size15 = 15;
  late final double size16 = 16;
  late final double size18 = 18;
  late final double size20 = 20;
  late final double size22 = 22;
  late final double size24 = 24;
  late final double size26 = 26;
  late final double size28 = 28;
  late final double size30 = 30;
  late final double size32 = 32;
  late final double size34 = 34;
  late final double size36 = 36;
  late final double size38 = 38;
  late final double size40 = 40;
  late final double size42 = 42;
  late final double size44 = 44;
  late final double size46 = 46;
  late final double size48 = 48;
  late final double size50 = 50;
  late final double size52 = 52;
  late final double size54 = 54;
  late final double size56 = 56;
  late final double size58 = 58;
  late final double size60 = 60;
  late final double size64 = 64;
  late final double size66 = 66;
  late final double size68 = 68;
  late final double size72 = 72;
  late final double size78 = 78;
  late final double size80 = 80;
  late final double size82 = 82;
  late final double size84 = 84;
  late final double size90 = 90;
  late final double size96 = 96;
  late final double size100 = 100;
  late final double size102 = 102;
  late final double size108 = 108;
  late final double size120 = 120;
  late final double size140 = 140;
  late final double size156 = 156;
  late final double size180 = 180;
}

class FontWeightPrimitive {
  FontWeightPrimitive._();

  static FontWeightPrimitive? _instance;
  static FontWeightPrimitive get instance => _instance ??= FontWeightPrimitive._();

  late final FontWeight thin = FontWeight.w100;
  late final FontWeight extralight = FontWeight.w200;
  late final FontWeight light = FontWeight.w300;
  late final FontWeight regular = FontWeight.w400;
  late final FontWeight medium = FontWeight.w500;
  late final FontWeight semiBold = FontWeight.w600;
  late final FontWeight bold = FontWeight.w700;
  late final FontWeight extrabold = FontWeight.w800;
  late final FontWeight black = FontWeight.w900;
}

class FontFamilyPrimitive {
  FontFamilyPrimitive._();

  static FontFamilyPrimitive? _instance;
  static FontFamilyPrimitive get instance => _instance ??= FontFamilyPrimitive._();

  late final String ios = 'Apple SD Gothic Neo';
  late final String android = 'Noto Sans CJK KR';
  late final String lgSmartUiDefault = 'LG Smart UI';
  late final String lgSmartUiCondensed = 'LG Smart UI Condensed';
  late final String lgSmartUiDingbat = 'LG Smart UI Dingbat';
  late final String lgSmartUiNumber = 'LG Smart UI Number';
  late final String lgEiText = 'LGEI Text';
  late final String lgEiHeadline = 'LGEI Headline';
}
