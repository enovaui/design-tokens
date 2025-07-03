/*
 * SPDX-FileCopyrightText: Copyright 2025 LG Electronics Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material.dart';

class ColorPrimitive {
  ColorPrimitive._();

  static ColorPrimitive? _instance;
  static ColorPrimitive get instance => _instance ??= ColorPrimitive._();

  /// black - #000000
  late final Color black = const Color.fromRGBO(0, 0, 0, 1.0);

  /// white - #ffffff
  late final Color white = const Color.fromRGBO(255, 255, 255, 1.0);

  /// neutral-gray-5 - #1a1a1a
  late final Color neutralGray5 = const Color.fromRGBO(26, 26, 26, 1.0);

  /// neutral-gray-10 - #262626
  late final Color neutralGray10 = const Color.fromRGBO(38, 38, 38, 1.0);

  /// neutral-gray-15 - #303030
  late final Color neutralGray15 = const Color.fromRGBO(48, 48, 48, 1.0);

  /// neutral-gray-20 - #3b3b3b
  late final Color neutralGray20 = const Color.fromRGBO(59, 59, 59, 1.0);

  /// neutral-gray-25 - #454545
  late final Color neutralGray25 = const Color.fromRGBO(69, 69, 69, 1.0);

  /// neutral-gray-30 - #4f4f4f
  late final Color neutralGray30 = const Color.fromRGBO(79, 79, 79, 1.0);

  /// neutral-gray-35 - #5c5c5c
  late final Color neutralGray35 = const Color.fromRGBO(92, 92, 92, 1.0);

  /// neutral-gray-40 - #696969
  late final Color neutralGray40 = const Color.fromRGBO(105, 105, 105, 1.0);

  /// neutral-gray-45 - #737373
  late final Color neutralGray45 = const Color.fromRGBO(115, 115, 115, 1.0);

  /// neutral-gray-50 - #7d7d7d
  late final Color neutralGray50 = const Color.fromRGBO(125, 125, 125, 1.0);

  /// neutral-gray-55 - #8a8a8a
  late final Color neutralGray55 = const Color.fromRGBO(138, 138, 138, 1.0);

  /// neutral-gray-60 - #969696
  late final Color neutralGray60 = const Color.fromRGBO(150, 150, 150, 1.0);

  /// neutral-gray-65 - #a6a6a6
  late final Color neutralGray65 = const Color.fromRGBO(166, 166, 166, 1.0);

  /// neutral-gray-70 - #b3b3b3
  late final Color neutralGray70 = const Color.fromRGBO(179, 179, 179, 1.0);

  /// neutral-gray-75 - #bfbfbf
  late final Color neutralGray75 = const Color.fromRGBO(191, 191, 191, 1.0);

  /// neutral-gray-80 - #cccccc
  late final Color neutralGray80 = const Color.fromRGBO(204, 204, 204, 1.0);

  /// neutral-gray-85 - #d9d9d9
  late final Color neutralGray85 = const Color.fromRGBO(217, 217, 217, 1.0);

  /// neutral-gray-90 - #e0e0e0
  late final Color neutralGray90 = const Color.fromRGBO(224, 224, 224, 1.0);

  /// neutral-gray-95 - #f2f2f2
  late final Color neutralGray95 = const Color.fromRGBO(242, 242, 242, 1.0);

  /// neutral-gray-99 - #fafafa
  late final Color neutralGray99 = const Color.fromRGBO(250, 250, 250, 1.0);

  /// mist-gray-5 - #090909
  late final Color mistGray5 = const Color.fromRGBO(9, 9, 9, 1.0);

  /// mist-gray-10 - #111111
  late final Color mistGray10 = const Color.fromRGBO(17, 17, 17, 1.0);

  /// mist-gray-15 - #1f1f1f
  late final Color mistGray15 = const Color.fromRGBO(31, 31, 31, 1.0);

  /// mist-gray-20 - #2d2d2d
  late final Color mistGray20 = const Color.fromRGBO(45, 45, 45, 1.0);

  /// mist-gray-25 - #393939
  late final Color mistGray25 = const Color.fromRGBO(57, 57, 57, 1.0);

  /// mist-gray-30 - #454749
  late final Color mistGray30 = const Color.fromRGBO(69, 71, 73, 1.0);

  /// mist-gray-35 - #4e5255
  late final Color mistGray35 = const Color.fromRGBO(78, 82, 85, 1.0);

  /// mist-gray-40 - #5c5f61
  late final Color mistGray40 = const Color.fromRGBO(92, 95, 97, 1.0);

  /// mist-gray-45 - #697072
  late final Color mistGray45 = const Color.fromRGBO(105, 112, 114, 1.0);

  /// mist-gray-50 - #757779
  late final Color mistGray50 = const Color.fromRGBO(117, 119, 121, 1.0);

  /// mist-gray-55 - #828586
  late final Color mistGray55 = const Color.fromRGBO(130, 133, 134, 1.0);

  /// mist-gray-60 - #8f9193
  late final Color mistGray60 = const Color.fromRGBO(143, 145, 147, 1.0);

  /// mist-gray-65 - #9a9b9e
  late final Color mistGray65 = const Color.fromRGBO(154, 155, 158, 1.0);

  /// mist-gray-70 - #aaabae
  late final Color mistGray70 = const Color.fromRGBO(170, 171, 174, 1.0);

  /// mist-gray-75 - #b4b5b7
  late final Color mistGray75 = const Color.fromRGBO(180, 181, 183, 1.0);

  /// mist-gray-80 - #c5c6c9
  late final Color mistGray80 = const Color.fromRGBO(197, 198, 201, 1.0);

  /// mist-gray-85 - #d3d4d7
  late final Color mistGray85 = const Color.fromRGBO(211, 212, 215, 1.0);

  /// mist-gray-90 - #e1e2e5
  late final Color mistGray90 = const Color.fromRGBO(225, 226, 229, 1.0);

  /// mist-gray-95 - #eff1f4
  late final Color mistGray95 = const Color.fromRGBO(239, 241, 244, 1.0);

  /// mist-gray-99 - #f7f8fa
  late final Color mistGray99 = const Color.fromRGBO(247, 248, 250, 1.0);

  /// cool-gray-5 - #1b1c1f
  late final Color coolGray5 = const Color.fromRGBO(27, 28, 31, 1.0);

  /// cool-gray-10 - #26282b
  late final Color coolGray10 = const Color.fromRGBO(38, 40, 43, 1.0);

  /// cool-gray-15 - #393a40
  late final Color coolGray15 = const Color.fromRGBO(57, 58, 64, 1.0);

  /// cool-gray-20 - #42444a
  late final Color coolGray20 = const Color.fromRGBO(66, 68, 74, 1.0);

  /// cool-gray-25 - #4f5159
  late final Color coolGray25 = const Color.fromRGBO(79, 81, 89, 1.0);

  /// cool-gray-30 - #5b5d66
  late final Color coolGray30 = const Color.fromRGBO(91, 93, 102, 1.0);

  /// cool-gray-35 - #666973
  late final Color coolGray35 = const Color.fromRGBO(102, 105, 115, 1.0);

  /// cool-gray-40 - #727580
  late final Color coolGray40 = const Color.fromRGBO(114, 117, 128, 1.0);

  /// cool-gray-45 - #7b7e8a
  late final Color coolGray45 = const Color.fromRGBO(123, 126, 138, 1.0);

  /// cool-gray-50 - #848894
  late final Color coolGray50 = const Color.fromRGBO(132, 136, 148, 1.0);

  /// cool-gray-55 - #8d909e
  late final Color coolGray55 = const Color.fromRGBO(141, 144, 158, 1.0);

  /// cool-gray-60 - #9b9fab
  late final Color coolGray60 = const Color.fromRGBO(155, 159, 171, 1.0);

  /// cool-gray-65 - #a9adba
  late final Color coolGray65 = const Color.fromRGBO(169, 173, 186, 1.0);

  /// cool-gray-70 - #b4b8c2
  late final Color coolGray70 = const Color.fromRGBO(180, 184, 194, 1.0);

  /// cool-gray-75 - #c2c4cc
  late final Color coolGray75 = const Color.fromRGBO(194, 196, 204, 1.0);

  /// cool-gray-80 - #cecfd6
  late final Color coolGray80 = const Color.fromRGBO(206, 207, 214, 1.0);

  /// cool-gray-85 - #dadce3
  late final Color coolGray85 = const Color.fromRGBO(218, 220, 227, 1.0);

  /// cool-gray-90 - #e8e9ed
  late final Color coolGray90 = const Color.fromRGBO(232, 233, 237, 1.0);

  /// cool-gray-95 - #f2f3f5
  late final Color coolGray95 = const Color.fromRGBO(242, 243, 245, 1.0);

  /// cool-gray-99 - #fcfcfc
  late final Color coolGray99 = const Color.fromRGBO(252, 252, 252, 1.0);

  /// blue-gray-5 - #080e15
  late final Color blueGray5 = const Color.fromRGBO(8, 14, 21, 1.0);

  /// blue-gray-10 - #111c2a
  late final Color blueGray10 = const Color.fromRGBO(17, 28, 42, 1.0);

  /// blue-gray-15 - #1b2735
  late final Color blueGray15 = const Color.fromRGBO(27, 39, 53, 1.0);

  /// blue-gray-20 - #26313f
  late final Color blueGray20 = const Color.fromRGBO(38, 49, 63, 1.0);

  /// blue-gray-25 - #313a46
  late final Color blueGray25 = const Color.fromRGBO(49, 58, 70, 1.0);

  /// blue-gray-30 - #3e454d
  late final Color blueGray30 = const Color.fromRGBO(62, 69, 77, 1.0);

  /// blue-gray-35 - #4a5058
  late final Color blueGray35 = const Color.fromRGBO(74, 80, 88, 1.0);

  /// blue-gray-40 - #555b64
  late final Color blueGray40 = const Color.fromRGBO(85, 91, 100, 1.0);

  /// blue-gray-45 - #5d646d
  late final Color blueGray45 = const Color.fromRGBO(93, 100, 109, 1.0);

  /// blue-gray-50 - #676e78
  late final Color blueGray50 = const Color.fromRGBO(103, 110, 120, 1.0);

  /// blue-gray-55 - #79848f
  late final Color blueGray55 = const Color.fromRGBO(121, 132, 143, 1.0);

  /// blue-gray-60 - #8f98a6
  late final Color blueGray60 = const Color.fromRGBO(143, 152, 166, 1.0);

  /// blue-gray-65 - #9ba2ad
  late final Color blueGray65 = const Color.fromRGBO(155, 162, 173, 1.0);

  /// blue-gray-70 - #a1acbf
  late final Color blueGray70 = const Color.fromRGBO(161, 172, 191, 1.0);

  /// blue-gray-75 - #b6bbd1
  late final Color blueGray75 = const Color.fromRGBO(182, 187, 209, 1.0);

  /// blue-gray-80 - #cad0dd
  late final Color blueGray80 = const Color.fromRGBO(202, 208, 221, 1.0);

  /// blue-gray-85 - #d8d8e5
  late final Color blueGray85 = const Color.fromRGBO(216, 216, 229, 1.0);

  /// blue-gray-90 - #dfe2ec
  late final Color blueGray90 = const Color.fromRGBO(223, 226, 236, 1.0);

  /// blue-gray-95 - #eef1fb
  late final Color blueGray95 = const Color.fromRGBO(238, 241, 251, 1.0);

  /// blue-gray-99 - #fcfdff
  late final Color blueGray99 = const Color.fromRGBO(252, 253, 255, 1.0);

  /// warm-gray-5 - #1a1a1a
  late final Color warmGray5 = const Color.fromRGBO(26, 26, 26, 1.0);

  /// warm-gray-10 - #262626
  late final Color warmGray10 = const Color.fromRGBO(38, 38, 38, 1.0);

  /// warm-gray-15 - #333333
  late final Color warmGray15 = const Color.fromRGBO(51, 51, 51, 1.0);

  /// warm-gray-20 - #3d3d3d
  late final Color warmGray20 = const Color.fromRGBO(61, 61, 61, 1.0);

  /// warm-gray-25 - #4a4a49
  late final Color warmGray25 = const Color.fromRGBO(74, 74, 73, 1.0);

  /// warm-gray-30 - #5c5b5a
  late final Color warmGray30 = const Color.fromRGBO(92, 91, 90, 1.0);

  /// warm-gray-35 - #6b6a68
  late final Color warmGray35 = const Color.fromRGBO(107, 106, 104, 1.0);

  /// warm-gray-40 - #7e7c77
  late final Color warmGray40 = const Color.fromRGBO(126, 124, 119, 1.0);

  /// warm-gray-45 - #878580
  late final Color warmGray45 = const Color.fromRGBO(135, 133, 128, 1.0);

  /// warm-gray-50 - #94928d
  late final Color warmGray50 = const Color.fromRGBO(148, 146, 141, 1.0);

  /// warm-gray-55 - #a19e99
  late final Color warmGray55 = const Color.fromRGBO(161, 158, 153, 1.0);

  /// warm-gray-60 - #aba8a2
  late final Color warmGray60 = const Color.fromRGBO(171, 168, 162, 1.0);

  /// warm-gray-65 - #bdbab5
  late final Color warmGray65 = const Color.fromRGBO(189, 186, 181, 1.0);

  /// warm-gray-70 - #cbc8c2
  late final Color warmGray70 = const Color.fromRGBO(203, 200, 194, 1.0);

  /// warm-gray-75 - #dbd7ce
  late final Color warmGray75 = const Color.fromRGBO(219, 215, 206, 1.0);

  /// warm-gray-80 - #e6e1d6
  late final Color warmGray80 = const Color.fromRGBO(230, 225, 214, 1.0);

  /// warm-gray-85 - #f0ebe2
  late final Color warmGray85 = const Color.fromRGBO(240, 235, 226, 1.0);

  /// warm-gray-90 - #f6f3eb
  late final Color warmGray90 = const Color.fromRGBO(246, 243, 235, 1.0);

  /// warm-gray-95 - #faf9f5
  late final Color warmGray95 = const Color.fromRGBO(250, 249, 245, 1.0);

  /// warm-gray-99 - #fcf9f6
  late final Color warmGray99 = const Color.fromRGBO(252, 249, 246, 1.0);

  /// active-red-5 - #210001
  late final Color activeRed5 = const Color.fromRGBO(33, 0, 1, 1.0);

  /// active-red-10 - #410002
  late final Color activeRed10 = const Color.fromRGBO(65, 0, 2, 1.0);

  /// active-red-15 - #550004
  late final Color activeRed15 = const Color.fromRGBO(85, 0, 4, 1.0);

  /// active-red-20 - #690005
  late final Color activeRed20 = const Color.fromRGBO(105, 0, 5, 1.0);

  /// active-red-25 - #7c0007
  late final Color activeRed25 = const Color.fromRGBO(124, 0, 7, 1.0);

  /// active-red-30 - #93000a
  late final Color activeRed30 = const Color.fromRGBO(147, 0, 10, 1.0);

  /// active-red-35 - #a7000c
  late final Color activeRed35 = const Color.fromRGBO(167, 0, 12, 1.0);

  /// active-red-40 - #c00011
  late final Color activeRed40 = const Color.fromRGBO(192, 0, 17, 1.0);

  /// active-red-45 - #d40b14
  late final Color activeRed45 = const Color.fromRGBO(212, 11, 20, 1.0);

  /// active-red-50 - #ea1917
  late final Color activeRed50 = const Color.fromRGBO(234, 25, 23, 1.0);

  /// active-red-55 - #fd312e
  late final Color activeRed55 = const Color.fromRGBO(253, 49, 46, 1.0);

  /// active-red-60 - #ff5449
  late final Color activeRed60 = const Color.fromRGBO(255, 84, 73, 1.0);

  /// active-red-65 - #ff6b63
  late final Color activeRed65 = const Color.fromRGBO(255, 107, 99, 1.0);

  /// active-red-70 - #ff897d
  late final Color activeRed70 = const Color.fromRGBO(255, 137, 125, 1.0);

  /// active-red-75 - #ffa294
  late final Color activeRed75 = const Color.fromRGBO(255, 162, 148, 1.0);

  /// active-red-80 - #ffb4ab
  late final Color activeRed80 = const Color.fromRGBO(255, 180, 171, 1.0);

  /// active-red-85 - #ffcdbf
  late final Color activeRed85 = const Color.fromRGBO(255, 205, 191, 1.0);

  /// active-red-90 - #ffdad6
  late final Color activeRed90 = const Color.fromRGBO(255, 218, 214, 1.0);

  /// active-red-95 - #ffedea
  late final Color activeRed95 = const Color.fromRGBO(255, 237, 234, 1.0);

  /// active-red-99 - #fffbfb
  late final Color activeRed99 = const Color.fromRGBO(255, 251, 251, 1.0);

  /// red-orange-5 - #200200
  late final Color redOrange5 = const Color.fromRGBO(32, 2, 0, 1.0);

  /// red-orange-10 - #3f0400
  late final Color redOrange10 = const Color.fromRGBO(63, 4, 0, 1.0);

  /// red-orange-15 - #520700
  late final Color redOrange15 = const Color.fromRGBO(82, 7, 0, 1.0);

  /// red-orange-20 - #650b00
  late final Color redOrange20 = const Color.fromRGBO(101, 11, 0, 1.0);

  /// red-orange-25 - #850d00
  late final Color redOrange25 = const Color.fromRGBO(133, 13, 0, 1.0);

  /// red-orange-30 - #a51600
  late final Color redOrange30 = const Color.fromRGBO(165, 22, 0, 1.0);

  /// red-orange-35 - #bb1700
  late final Color redOrange35 = const Color.fromRGBO(187, 23, 0, 1.0);

  /// red-orange-40 - #d11800
  late final Color redOrange40 = const Color.fromRGBO(209, 24, 0, 1.0);

  /// red-orange-45 - #e92600
  late final Color redOrange45 = const Color.fromRGBO(233, 38, 0, 1.0);

  /// red-orange-50 - #f93600
  late final Color redOrange50 = const Color.fromRGBO(249, 54, 0, 1.0);

  /// red-orange-55 - #ff4448
  late final Color redOrange55 = const Color.fromRGBO(255, 68, 72, 1.0);

  /// red-orange-60 - #ff5330
  late final Color redOrange60 = const Color.fromRGBO(255, 83, 48, 1.0);

  /// red-orange-65 - #ff6b4d
  late final Color redOrange65 = const Color.fromRGBO(255, 107, 77, 1.0);

  /// red-orange-70 - #ff8a6e
  late final Color redOrange70 = const Color.fromRGBO(255, 138, 110, 1.0);

  /// red-orange-75 - #ffa58b
  late final Color redOrange75 = const Color.fromRGBO(255, 165, 139, 1.0);

  /// red-orange-80 - #ffb4a2
  late final Color redOrange80 = const Color.fromRGBO(255, 180, 162, 1.0);

  /// red-orange-85 - #ffcdb7
  late final Color redOrange85 = const Color.fromRGBO(255, 205, 183, 1.0);

  /// red-orange-90 - #ffd9d2
  late final Color redOrange90 = const Color.fromRGBO(255, 217, 210, 1.0);

  /// red-orange-95 - #ffede8
  late final Color redOrange95 = const Color.fromRGBO(255, 237, 232, 1.0);

  /// red-orange-99 - #fffcfb
  late final Color redOrange99 = const Color.fromRGBO(255, 252, 251, 1.0);

  /// deep-orange-5 - #1a0b06
  late final Color deepOrange5 = const Color.fromRGBO(26, 11, 6, 1.0);

  /// deep-orange-10 - #33160d
  late final Color deepOrange10 = const Color.fromRGBO(51, 22, 13, 1.0);

  /// deep-orange-15 - #4a2114
  late final Color deepOrange15 = const Color.fromRGBO(74, 33, 20, 1.0);

  /// deep-orange-20 - #662c1a
  late final Color deepOrange20 = const Color.fromRGBO(102, 44, 26, 1.0);

  /// deep-orange-25 - #80361f
  late final Color deepOrange25 = const Color.fromRGBO(128, 54, 31, 1.0);

  /// deep-orange-30 - #994227
  late final Color deepOrange30 = const Color.fromRGBO(153, 66, 39, 1.0);

  /// deep-orange-35 - #b24d2c
  late final Color deepOrange35 = const Color.fromRGBO(178, 77, 44, 1.0);

  /// deep-orange-40 - #cc5834
  late final Color deepOrange40 = const Color.fromRGBO(204, 88, 52, 1.0);

  /// deep-orange-45 - #e8623b
  late final Color deepOrange45 = const Color.fromRGBO(232, 98, 59, 1.0);

  /// deep-orange-50 - #ff6e42
  late final Color deepOrange50 = const Color.fromRGBO(255, 110, 66, 1.0);

  /// deep-orange-55 - #ff7f54
  late final Color deepOrange55 = const Color.fromRGBO(255, 127, 84, 1.0);

  /// deep-orange-60 - #ff8b67
  late final Color deepOrange60 = const Color.fromRGBO(255, 139, 103, 1.0);

  /// deep-orange-65 - #ff9a77
  late final Color deepOrange65 = const Color.fromRGBO(255, 154, 119, 1.0);

  /// deep-orange-70 - #ffa88d
  late final Color deepOrange70 = const Color.fromRGBO(255, 168, 141, 1.0);

  /// deep-orange-75 - #ffb8a0
  late final Color deepOrange75 = const Color.fromRGBO(255, 184, 160, 1.0);

  /// deep-orange-80 - #ffc5b3
  late final Color deepOrange80 = const Color.fromRGBO(255, 197, 179, 1.0);

  /// deep-orange-85 - #ffd3c6
  late final Color deepOrange85 = const Color.fromRGBO(255, 211, 198, 1.0);

  /// deep-orange-90 - #ffe2d9
  late final Color deepOrange90 = const Color.fromRGBO(255, 226, 217, 1.0);

  /// deep-orange-95 - #fff0ec
  late final Color deepOrange95 = const Color.fromRGBO(255, 240, 236, 1.0);

  /// deep-orange-99 - #fffaf9
  late final Color deepOrange99 = const Color.fromRGBO(255, 250, 249, 1.0);

  /// orange-5 - #180a00
  late final Color orange5 = const Color.fromRGBO(24, 10, 0, 1.0);

  /// orange-10 - #301300
  late final Color orange10 = const Color.fromRGBO(48, 19, 0, 1.0);

  /// orange-15 - #401900
  late final Color orange15 = const Color.fromRGBO(64, 25, 0, 1.0);

  /// orange-20 - #502500
  late final Color orange20 = const Color.fromRGBO(80, 37, 0, 1.0);

  /// orange-25 - #602c00
  late final Color orange25 = const Color.fromRGBO(96, 44, 0, 1.0);

  /// orange-30 - #703700
  late final Color orange30 = const Color.fromRGBO(112, 55, 0, 1.0);

  /// orange-35 - #823f00
  late final Color orange35 = const Color.fromRGBO(130, 63, 0, 1.0);

  /// orange-40 - #934b01
  late final Color orange40 = const Color.fromRGBO(147, 75, 1, 1.0);

  /// orange-45 - #a55401
  late final Color orange45 = const Color.fromRGBO(165, 84, 1, 1.0);

  /// orange-50 - #b95f01
  late final Color orange50 = const Color.fromRGBO(185, 95, 1, 1.0);

  /// orange-55 - #cb6600
  late final Color orange55 = const Color.fromRGBO(203, 102, 0, 1.0);

  /// orange-60 - #e07400
  late final Color orange60 = const Color.fromRGBO(224, 116, 0, 1.0);

  /// orange-65 - #f97f0b
  late final Color orange65 = const Color.fromRGBO(249, 127, 11, 1.0);

  /// orange-70 - #ff8b1b
  late final Color orange70 = const Color.fromRGBO(255, 139, 27, 1.0);

  /// orange-75 - #ff9d4c
  late final Color orange75 = const Color.fromRGBO(255, 157, 76, 1.0);

  /// orange-80 - #ffb77f
  late final Color orange80 = const Color.fromRGBO(255, 183, 127, 1.0);

  /// orange-85 - #ffcfa1
  late final Color orange85 = const Color.fromRGBO(255, 207, 161, 1.0);

  /// orange-90 - #ffdcc3
  late final Color orange90 = const Color.fromRGBO(255, 220, 195, 1.0);

  /// orange-95 - #ffede0
  late final Color orange95 = const Color.fromRGBO(255, 237, 224, 1.0);

  /// orange-99 - #fffdfb
  late final Color orange99 = const Color.fromRGBO(255, 253, 251, 1.0);

  /// yellow-5 - #110d03
  late final Color yellow5 = const Color.fromRGBO(17, 13, 3, 1.0);

  /// yellow-10 - #221b06
  late final Color yellow10 = const Color.fromRGBO(34, 27, 6, 1.0);

  /// yellow-15 - #301f04
  late final Color yellow15 = const Color.fromRGBO(48, 31, 4, 1.0);

  /// yellow-20 - #3f2e00
  late final Color yellow20 = const Color.fromRGBO(63, 46, 0, 1.0);

  /// yellow-25 - #4a3900
  late final Color yellow25 = const Color.fromRGBO(74, 57, 0, 1.0);

  /// yellow-30 - #5a4400
  late final Color yellow30 = const Color.fromRGBO(90, 68, 0, 1.0);

  /// yellow-35 - #685000
  late final Color yellow35 = const Color.fromRGBO(104, 80, 0, 1.0);

  /// yellow-40 - #765a00
  late final Color yellow40 = const Color.fromRGBO(118, 90, 0, 1.0);

  /// yellow-45 - #866500
  late final Color yellow45 = const Color.fromRGBO(134, 101, 0, 1.0);

  /// yellow-50 - #967101
  late final Color yellow50 = const Color.fromRGBO(150, 113, 1, 1.0);

  /// yellow-55 - #a87f00
  late final Color yellow55 = const Color.fromRGBO(168, 127, 0, 1.0);

  /// yellow-60 - #b48b00
  late final Color yellow60 = const Color.fromRGBO(180, 139, 0, 1.0);

  /// yellow-65 - #d09f02
  late final Color yellow65 = const Color.fromRGBO(208, 159, 2, 1.0);

  /// yellow-70 - #eeb404
  late final Color yellow70 = const Color.fromRGBO(238, 180, 4, 1.0);

  /// yellow-75 - #f9bf16
  late final Color yellow75 = const Color.fromRGBO(249, 191, 22, 1.0);

  /// yellow-80 - #ffca28
  late final Color yellow80 = const Color.fromRGBO(255, 202, 40, 1.0);

  /// yellow-85 - #ffdc59
  late final Color yellow85 = const Color.fromRGBO(255, 220, 89, 1.0);

  /// yellow-90 - #ffdf8b
  late final Color yellow90 = const Color.fromRGBO(255, 223, 139, 1.0);

  /// yellow-95 - #feefca
  late final Color yellow95 = const Color.fromRGBO(254, 239, 202, 1.0);

  /// yellow-99 - #fffdf2
  late final Color yellow99 = const Color.fromRGBO(255, 253, 242, 1.0);

  /// yellow-green-5 - #090f06
  late final Color yellowGreen5 = const Color.fromRGBO(9, 15, 6, 1.0);

  /// yellow-green-10 - #121f0c
  late final Color yellowGreen10 = const Color.fromRGBO(18, 31, 12, 1.0);

  /// yellow-green-15 - #1b2f11
  late final Color yellowGreen15 = const Color.fromRGBO(27, 47, 17, 1.0);

  /// yellow-green-20 - #263e17
  late final Color yellowGreen20 = const Color.fromRGBO(38, 62, 23, 1.0);

  /// yellow-green-25 - #2d4f1d
  late final Color yellowGreen25 = const Color.fromRGBO(45, 79, 29, 1.0);

  /// yellow-green-30 - #375d23
  late final Color yellowGreen30 = const Color.fromRGBO(55, 93, 35, 1.0);

  /// yellow-green-35 - #427328
  late final Color yellowGreen35 = const Color.fromRGBO(66, 115, 40, 1.0);

  /// yellow-green-40 - #497c2e
  late final Color yellowGreen40 = const Color.fromRGBO(73, 124, 46, 1.0);

  /// yellow-green-45 - #529233
  late final Color yellowGreen45 = const Color.fromRGBO(82, 146, 51, 1.0);

  /// yellow-green-50 - #5b9a3a
  late final Color yellowGreen50 = const Color.fromRGBO(91, 154, 58, 1.0);

  /// yellow-green-55 - #659b40
  late final Color yellowGreen55 = const Color.fromRGBO(101, 155, 64, 1.0);

  /// yellow-green-60 - #6fb946
  late final Color yellowGreen60 = const Color.fromRGBO(111, 185, 70, 1.0);

  /// yellow-green-65 - #7cc155
  late final Color yellowGreen65 = const Color.fromRGBO(124, 193, 85, 1.0);

  /// yellow-green-70 - #86c465
  late final Color yellowGreen70 = const Color.fromRGBO(134, 196, 101, 1.0);

  /// yellow-green-75 - #94d075
  late final Color yellowGreen75 = const Color.fromRGBO(148, 208, 117, 1.0);

  /// yellow-green-80 - #a3da86
  late final Color yellowGreen80 = const Color.fromRGBO(163, 218, 134, 1.0);

  /// yellow-green-85 - #b3e39b
  late final Color yellowGreen85 = const Color.fromRGBO(179, 227, 155, 1.0);

  /// yellow-green-90 - #c4efad
  late final Color yellowGreen90 = const Color.fromRGBO(196, 239, 173, 1.0);

  /// yellow-green-95 - #ddf6cf
  late final Color yellowGreen95 = const Color.fromRGBO(221, 246, 207, 1.0);

  /// yellow-green-99 - #fbfff2
  late final Color yellowGreen99 = const Color.fromRGBO(251, 255, 242, 1.0);

  /// green-5 - #03130b
  late final Color green5 = const Color.fromRGBO(3, 19, 11, 1.0);

  /// green-10 - #062516
  late final Color green10 = const Color.fromRGBO(6, 37, 22, 1.0);

  /// green-15 - #041e13
  late final Color green15 = const Color.fromRGBO(4, 30, 19, 1.0);

  /// green-20 - #013920
  late final Color green20 = const Color.fromRGBO(1, 57, 32, 1.0);

  /// green-25 - #014225
  late final Color green25 = const Color.fromRGBO(1, 66, 37, 1.0);

  /// green-30 - #005231
  late final Color green30 = const Color.fromRGBO(0, 82, 49, 1.0);

  /// green-35 - #00663a
  late final Color green35 = const Color.fromRGBO(0, 102, 58, 1.0);

  /// green-40 - #016d42
  late final Color green40 = const Color.fromRGBO(1, 109, 66, 1.0);

  /// green-45 - #017e4a
  late final Color green45 = const Color.fromRGBO(1, 126, 74, 1.0);

  /// green-50 - #008955
  late final Color green50 = const Color.fromRGBO(0, 137, 85, 1.0);

  /// green-55 - #159d61
  late final Color green55 = const Color.fromRGBO(21, 157, 97, 1.0);

  /// green-60 - #22a56c
  late final Color green60 = const Color.fromRGBO(34, 165, 108, 1.0);

  /// green-65 - #34b178
  late final Color green65 = const Color.fromRGBO(52, 177, 120, 1.0);

  /// green-70 - #46bf85
  late final Color green70 = const Color.fromRGBO(70, 191, 133, 1.0);

  /// green-75 - #51c894
  late final Color green75 = const Color.fromRGBO(81, 200, 148, 1.0);

  /// green-80 - #5cd59b
  late final Color green80 = const Color.fromRGBO(92, 213, 155, 1.0);

  /// green-85 - #89e6b8
  late final Color green85 = const Color.fromRGBO(137, 230, 184, 1.0);

  /// green-90 - #adf5d3
  late final Color green90 = const Color.fromRGBO(173, 245, 211, 1.0);

  /// green-95 - #d9f6e6
  late final Color green95 = const Color.fromRGBO(217, 246, 230, 1.0);

  /// green-99 - #f2fffe
  late final Color green99 = const Color.fromRGBO(242, 255, 254, 1.0);

  /// mint-green-5 - #06130e
  late final Color mintGreen5 = const Color.fromRGBO(6, 19, 14, 1.0);

  /// mint-green-10 - #0c261d
  late final Color mintGreen10 = const Color.fromRGBO(12, 38, 29, 1.0);

  /// mint-green-15 - #101f18
  late final Color mintGreen15 = const Color.fromRGBO(16, 31, 24, 1.0);

  /// mint-green-20 - #184c3b
  late final Color mintGreen20 = const Color.fromRGBO(24, 76, 59, 1.0);

  /// mint-green-25 - #1c6148
  late final Color mintGreen25 = const Color.fromRGBO(28, 97, 72, 1.0);

  /// mint-green-30 - #247258
  late final Color mintGreen30 = const Color.fromRGBO(36, 114, 88, 1.0);

  /// mint-green-35 - #2c8470
  late final Color mintGreen35 = const Color.fromRGBO(44, 132, 112, 1.0);

  /// mint-green-40 - #309876
  late final Color mintGreen40 = const Color.fromRGBO(48, 152, 118, 1.0);

  /// mint-green-45 - #37ac85
  late final Color mintGreen45 = const Color.fromRGBO(55, 172, 133, 1.0);

  /// mint-green-50 - #3dbf94
  late final Color mintGreen50 = const Color.fromRGBO(61, 191, 148, 1.0);

  /// mint-green-55 - #50c5a1
  late final Color mintGreen55 = const Color.fromRGBO(80, 197, 161, 1.0);

  /// mint-green-60 - #63cba9
  late final Color mintGreen60 = const Color.fromRGBO(99, 203, 169, 1.0);

  /// mint-green-65 - #76d1b3
  late final Color mintGreen65 = const Color.fromRGBO(118, 209, 179, 1.0);

  /// mint-green-70 - #8ad8be
  late final Color mintGreen70 = const Color.fromRGBO(138, 216, 190, 1.0);

  /// mint-green-75 - #a0decc
  late final Color mintGreen75 = const Color.fromRGBO(160, 222, 204, 1.0);

  /// mint-green-80 - #b1e5d4
  late final Color mintGreen80 = const Color.fromRGBO(177, 229, 212, 1.0);

  /// mint-green-85 - #c4ece0
  late final Color mintGreen85 = const Color.fromRGBO(196, 236, 224, 1.0);

  /// mint-green-90 - #d8f2e9
  late final Color mintGreen90 = const Color.fromRGBO(216, 242, 233, 1.0);

  /// mint-green-95 - #ebf8f3
  late final Color mintGreen95 = const Color.fromRGBO(235, 248, 243, 1.0);

  /// mint-green-99 - #f5fcfa
  late final Color mintGreen99 = const Color.fromRGBO(245, 252, 250, 1.0);

  /// teal-green-5 - #00100e
  late final Color tealGreen5 = const Color.fromRGBO(0, 16, 14, 1.0);

  /// teal-green-10 - #00201d
  late final Color tealGreen10 = const Color.fromRGBO(0, 32, 29, 1.0);

  /// teal-green-15 - #012d28
  late final Color tealGreen15 = const Color.fromRGBO(1, 45, 40, 1.0);

  /// teal-green-20 - #013733
  late final Color tealGreen20 = const Color.fromRGBO(1, 55, 51, 1.0);

  /// teal-green-25 - #024244
  late final Color tealGreen25 = const Color.fromRGBO(2, 66, 68, 1.0);

  /// teal-green-30 - #00504a
  late final Color tealGreen30 = const Color.fromRGBO(0, 80, 74, 1.0);

  /// teal-green-35 - #005c56
  late final Color tealGreen35 = const Color.fromRGBO(0, 92, 86, 1.0);

  /// teal-green-40 - #006a63
  late final Color tealGreen40 = const Color.fromRGBO(0, 106, 99, 1.0);

  /// teal-green-45 - #007671
  late final Color tealGreen45 = const Color.fromRGBO(0, 118, 113, 1.0);

  /// teal-green-50 - #00867e
  late final Color tealGreen50 = const Color.fromRGBO(0, 134, 126, 1.0);

  /// teal-green-55 - #01918c
  late final Color tealGreen55 = const Color.fromRGBO(1, 145, 140, 1.0);

  /// teal-green-60 - #01a298
  late final Color tealGreen60 = const Color.fromRGBO(1, 162, 152, 1.0);

  /// teal-green-65 - #01aba3
  late final Color tealGreen65 = const Color.fromRGBO(1, 171, 163, 1.0);

  /// teal-green-70 - #02b3a9
  late final Color tealGreen70 = const Color.fromRGBO(2, 179, 169, 1.0);

  /// teal-green-75 - #29c5b9
  late final Color tealGreen75 = const Color.fromRGBO(41, 197, 185, 1.0);

  /// teal-green-80 - #50dbcf
  late final Color tealGreen80 = const Color.fromRGBO(80, 219, 207, 1.0);

  /// teal-green-85 - #83e8dd
  late final Color tealGreen85 = const Color.fromRGBO(131, 232, 221, 1.0);

  /// teal-green-90 - #b6efe7
  late final Color tealGreen90 = const Color.fromRGBO(182, 239, 231, 1.0);

  /// teal-green-95 - #d9f6f2
  late final Color tealGreen95 = const Color.fromRGBO(217, 246, 242, 1.0);

  /// teal-green-99 - #f2fffe
  late final Color tealGreen99 = const Color.fromRGBO(242, 255, 254, 1.0);

  /// blue-green-5 - #000f14
  late final Color blueGreen5 = const Color.fromRGBO(0, 15, 20, 1.0);

  /// blue-green-10 - #001f28
  late final Color blueGreen10 = const Color.fromRGBO(0, 31, 40, 1.0);

  /// blue-green-15 - #022c36
  late final Color blueGreen15 = const Color.fromRGBO(2, 44, 54, 1.0);

  /// blue-green-20 - #003543
  late final Color blueGreen20 = const Color.fromRGBO(0, 53, 67, 1.0);

  /// blue-green-25 - #0a444f
  late final Color blueGreen25 = const Color.fromRGBO(10, 68, 79, 1.0);

  /// blue-green-30 - #155364
  late final Color blueGreen30 = const Color.fromRGBO(21, 83, 100, 1.0);

  /// blue-green-35 - #0c6e81
  late final Color blueGreen35 = const Color.fromRGBO(12, 110, 129, 1.0);

  /// blue-green-40 - #00829e
  late final Color blueGreen40 = const Color.fromRGBO(0, 130, 158, 1.0);

  /// blue-green-45 - #1898a6
  late final Color blueGreen45 = const Color.fromRGBO(24, 152, 166, 1.0);

  /// blue-green-50 - #3191ab
  late final Color blueGreen50 = const Color.fromRGBO(49, 145, 171, 1.0);

  /// blue-green-55 - #42a0b5
  late final Color blueGreen55 = const Color.fromRGBO(66, 160, 181, 1.0);

  /// blue-green-60 - #54aec7
  late final Color blueGreen60 = const Color.fromRGBO(84, 174, 199, 1.0);

  /// blue-green-65 - #60bbd0
  late final Color blueGreen65 = const Color.fromRGBO(96, 187, 208, 1.0);

  /// blue-green-70 - #6bbed6
  late final Color blueGreen70 = const Color.fromRGBO(107, 190, 214, 1.0);

  /// blue-green-75 - #8dd1e4
  late final Color blueGreen75 = const Color.fromRGBO(141, 209, 228, 1.0);

  /// blue-green-80 - #a8e1f4
  late final Color blueGreen80 = const Color.fromRGBO(168, 225, 244, 1.0);

  /// blue-green-85 - #c1eff8
  late final Color blueGreen85 = const Color.fromRGBO(193, 239, 248, 1.0);

  /// blue-green-90 - #daf5fd
  late final Color blueGreen90 = const Color.fromRGBO(218, 245, 253, 1.0);

  /// blue-green-95 - #eafaff
  late final Color blueGreen95 = const Color.fromRGBO(234, 250, 255, 1.0);

  /// blue-green-99 - #f9fdff
  late final Color blueGreen99 = const Color.fromRGBO(249, 253, 255, 1.0);

  /// sky-blue-5 - #000e1a
  late final Color skyBlue5 = const Color.fromRGBO(0, 14, 26, 1.0);

  /// sky-blue-10 - #001d34
  late final Color skyBlue10 = const Color.fromRGBO(0, 29, 52, 1.0);

  /// sky-blue-15 - #01253f
  late final Color skyBlue15 = const Color.fromRGBO(1, 37, 63, 1.0);

  /// sky-blue-20 - #013355
  late final Color skyBlue20 = const Color.fromRGBO(1, 51, 85, 1.0);

  /// sky-blue-25 - #02406b
  late final Color skyBlue25 = const Color.fromRGBO(2, 64, 107, 1.0);

  /// sky-blue-30 - #004a77
  late final Color skyBlue30 = const Color.fromRGBO(0, 74, 119, 1.0);

  /// sky-blue-35 - #00538b
  late final Color skyBlue35 = const Color.fromRGBO(0, 83, 139, 1.0);

  /// sky-blue-40 - #005d95
  late final Color skyBlue40 = const Color.fromRGBO(0, 93, 149, 1.0);

  /// sky-blue-45 - #006dab
  late final Color skyBlue45 = const Color.fromRGBO(0, 109, 171, 1.0);

  /// sky-blue-50 - #007cc3
  late final Color skyBlue50 = const Color.fromRGBO(0, 124, 195, 1.0);

  /// sky-blue-55 - #018bd6
  late final Color skyBlue55 = const Color.fromRGBO(1, 139, 214, 1.0);

  /// sky-blue-60 - #0397e9
  late final Color skyBlue60 = const Color.fromRGBO(3, 151, 233, 1.0);

  /// sky-blue-65 - #26a5f2
  late final Color skyBlue65 = const Color.fromRGBO(38, 165, 242, 1.0);

  /// sky-blue-70 - #4eb2ff
  late final Color skyBlue70 = const Color.fromRGBO(78, 178, 255, 1.0);

  /// sky-blue-75 - #72c1ff
  late final Color skyBlue75 = const Color.fromRGBO(114, 193, 255, 1.0);

  /// sky-blue-80 - #96cbff
  late final Color skyBlue80 = const Color.fromRGBO(150, 203, 255, 1.0);

  /// sky-blue-85 - #b2d8ff
  late final Color skyBlue85 = const Color.fromRGBO(178, 216, 255, 1.0);

  /// sky-blue-90 - #cee5fe
  late final Color skyBlue90 = const Color.fromRGBO(206, 229, 254, 1.0);

  /// sky-blue-95 - #e8f2ff
  late final Color skyBlue95 = const Color.fromRGBO(232, 242, 255, 1.0);

  /// sky-blue-99 - #f2faff
  late final Color skyBlue99 = const Color.fromRGBO(242, 250, 255, 1.0);

  /// cobalt-blue-5 - #11142c
  late final Color cobaltBlue5 = const Color.fromRGBO(17, 20, 44, 1.0);

  /// cobalt-blue-10 - #232959
  late final Color cobaltBlue10 = const Color.fromRGBO(35, 41, 89, 1.0);

  /// cobalt-blue-15 - #2c328c
  late final Color cobaltBlue15 = const Color.fromRGBO(44, 50, 140, 1.0);

  /// cobalt-blue-20 - #343d85
  late final Color cobaltBlue20 = const Color.fromRGBO(52, 61, 133, 1.0);

  /// cobalt-blue-25 - #3f489f
  late final Color cobaltBlue25 = const Color.fromRGBO(63, 72, 159, 1.0);

  /// cobalt-blue-30 - #4a57bf
  late final Color cobaltBlue30 = const Color.fromRGBO(74, 87, 191, 1.0);

  /// cobalt-blue-35 - #4e61d8
  late final Color cobaltBlue35 = const Color.fromRGBO(78, 97, 216, 1.0);

  /// cobalt-blue-40 - #5266f8
  late final Color cobaltBlue40 = const Color.fromRGBO(82, 102, 248, 1.0);

  /// cobalt-blue-45 - #5c73f7
  late final Color cobaltBlue45 = const Color.fromRGBO(92, 115, 247, 1.0);

  /// cobalt-blue-50 - #6c7dfc
  late final Color cobaltBlue50 = const Color.fromRGBO(108, 125, 252, 1.0);

  /// cobalt-blue-55 - #768aff
  late final Color cobaltBlue55 = const Color.fromRGBO(118, 138, 255, 1.0);

  /// cobalt-blue-60 - #8593ff
  late final Color cobaltBlue60 = const Color.fromRGBO(133, 147, 255, 1.0);

  /// cobalt-blue-65 - #9eaaff
  late final Color cobaltBlue65 = const Color.fromRGBO(158, 170, 255, 1.0);

  /// cobalt-blue-70 - #bac2ff
  late final Color cobaltBlue70 = const Color.fromRGBO(186, 194, 255, 1.0);

  /// cobalt-blue-75 - #c8cfff
  late final Color cobaltBlue75 = const Color.fromRGBO(200, 207, 255, 1.0);

  /// cobalt-blue-80 - #d5dbff
  late final Color cobaltBlue80 = const Color.fromRGBO(213, 219, 255, 1.0);

  /// cobalt-blue-85 - #dce0ff
  late final Color cobaltBlue85 = const Color.fromRGBO(220, 224, 255, 1.0);

  /// cobalt-blue-90 - #e0e4ff
  late final Color cobaltBlue90 = const Color.fromRGBO(224, 228, 255, 1.0);

  /// cobalt-blue-95 - #eaedff
  late final Color cobaltBlue95 = const Color.fromRGBO(234, 237, 255, 1.0);

  /// cobalt-blue-99 - #f7f8ff
  late final Color cobaltBlue99 = const Color.fromRGBO(247, 248, 255, 1.0);

  /// navy-5 - #030d19
  late final Color navy5 = const Color.fromRGBO(3, 13, 25, 1.0);

  /// navy-10 - #051a32
  late final Color navy10 = const Color.fromRGBO(5, 26, 50, 1.0);

  /// navy-15 - #101f3c
  late final Color navy15 = const Color.fromRGBO(16, 31, 60, 1.0);

  /// navy-20 - #192b46
  late final Color navy20 = const Color.fromRGBO(25, 43, 70, 1.0);

  /// navy-25 - #21354f
  late final Color navy25 = const Color.fromRGBO(33, 53, 79, 1.0);

  /// navy-30 - #2b3e5b
  late final Color navy30 = const Color.fromRGBO(43, 62, 91, 1.0);

  /// navy-35 - #374a68
  late final Color navy35 = const Color.fromRGBO(55, 74, 104, 1.0);

  /// navy-40 - #405474
  late final Color navy40 = const Color.fromRGBO(64, 84, 116, 1.0);

  /// navy-45 - #4d6182
  late final Color navy45 = const Color.fromRGBO(77, 97, 130, 1.0);

  /// navy-50 - #576d8f
  late final Color navy50 = const Color.fromRGBO(87, 109, 143, 1.0);

  /// navy-55 - #647e9f
  late final Color navy55 = const Color.fromRGBO(100, 126, 159, 1.0);

  /// navy-60 - #7187ac
  late final Color navy60 = const Color.fromRGBO(113, 135, 172, 1.0);

  /// navy-65 - #7e95b9
  late final Color navy65 = const Color.fromRGBO(126, 149, 185, 1.0);

  /// navy-70 - #8ba2ca
  late final Color navy70 = const Color.fromRGBO(139, 162, 202, 1.0);

  /// navy-75 - #9db4d6
  late final Color navy75 = const Color.fromRGBO(157, 180, 214, 1.0);

  /// navy-80 - #a8c0e9
  late final Color navy80 = const Color.fromRGBO(168, 192, 233, 1.0);

  /// navy-85 - #c3d3f4
  late final Color navy85 = const Color.fromRGBO(195, 211, 244, 1.0);

  /// navy-90 - #d8e6fe
  late final Color navy90 = const Color.fromRGBO(216, 230, 254, 1.0);

  /// navy-95 - #e8effe
  late final Color navy95 = const Color.fromRGBO(232, 239, 254, 1.0);

  /// navy-99 - #fcfcff
  late final Color navy99 = const Color.fromRGBO(252, 252, 255, 1.0);

  /// violet-5 - #0e0031
  late final Color violet5 = const Color.fromRGBO(14, 0, 49, 1.0);

  /// violet-10 - #1b0063
  late final Color violet10 = const Color.fromRGBO(27, 0, 99, 1.0);

  /// violet-15 - #260082
  late final Color violet15 = const Color.fromRGBO(38, 0, 130, 1.0);

  /// violet-20 - #30009b
  late final Color violet20 = const Color.fromRGBO(48, 0, 155, 1.0);

  /// violet-25 - #3a12ad
  late final Color violet25 = const Color.fromRGBO(58, 18, 173, 1.0);

  /// violet-30 - #4925b9
  late final Color violet30 = const Color.fromRGBO(73, 37, 185, 1.0);

  /// violet-35 - #5437c5
  late final Color violet35 = const Color.fromRGBO(84, 55, 197, 1.0);

  /// violet-40 - #6243d2
  late final Color violet40 = const Color.fromRGBO(98, 67, 210, 1.0);

  /// violet-45 - #6f51df
  late final Color violet45 = const Color.fromRGBO(111, 81, 223, 1.0);

  /// violet-50 - #7a5eed
  late final Color violet50 = const Color.fromRGBO(122, 94, 237, 1.0);

  /// violet-55 - #8b6eff
  late final Color violet55 = const Color.fromRGBO(139, 110, 255, 1.0);

  /// violet-60 - #967cff
  late final Color violet60 = const Color.fromRGBO(150, 124, 255, 1.0);

  /// violet-65 - #a89afe
  late final Color violet65 = const Color.fromRGBO(168, 154, 254, 1.0);

  /// violet-70 - #b19efe
  late final Color violet70 = const Color.fromRGBO(177, 158, 254, 1.0);

  /// violet-75 - #c4b8ff
  late final Color violet75 = const Color.fromRGBO(196, 184, 255, 1.0);

  /// violet-80 - #ccbdff
  late final Color violet80 = const Color.fromRGBO(204, 189, 255, 1.0);

  /// violet-85 - #d7d3ff
  late final Color violet85 = const Color.fromRGBO(215, 211, 255, 1.0);

  /// violet-90 - #e7ddff
  late final Color violet90 = const Color.fromRGBO(231, 221, 255, 1.0);

  /// violet-95 - #f5edff
  late final Color violet95 = const Color.fromRGBO(245, 237, 255, 1.0);

  /// violet-99 - #fdfbff
  late final Color violet99 = const Color.fromRGBO(253, 251, 255, 1.0);

  /// purple-5 - #1b0021
  late final Color purple5 = const Color.fromRGBO(27, 0, 33, 1.0);

  /// purple-10 - #350042
  late final Color purple10 = const Color.fromRGBO(53, 0, 66, 1.0);

  /// purple-15 - #450055
  late final Color purple15 = const Color.fromRGBO(69, 0, 85, 1.0);

  /// purple-20 - #560069
  late final Color purple20 = const Color.fromRGBO(86, 0, 105, 1.0);

  /// purple-25 - #67007b
  late final Color purple25 = const Color.fromRGBO(103, 0, 123, 1.0);

  /// purple-30 - #790093
  late final Color purple30 = const Color.fromRGBO(121, 0, 147, 1.0);

  /// purple-35 - #8b0da2
  late final Color purple35 = const Color.fromRGBO(139, 13, 162, 1.0);

  /// purple-40 - #9a22b2
  late final Color purple40 = const Color.fromRGBO(154, 34, 178, 1.0);

  /// purple-45 - #a932c0
  late final Color purple45 = const Color.fromRGBO(169, 50, 192, 1.0);

  /// purple-50 - #b642cd
  late final Color purple50 = const Color.fromRGBO(182, 66, 205, 1.0);

  /// purple-55 - #c84eda
  late final Color purple55 = const Color.fromRGBO(200, 78, 218, 1.0);

  /// purple-60 - #d35eea
  late final Color purple60 = const Color.fromRGBO(211, 94, 234, 1.0);

  /// purple-65 - #e26efa
  late final Color purple65 = const Color.fromRGBO(226, 110, 250, 1.0);

  /// purple-70 - #ef7eff
  late final Color purple70 = const Color.fromRGBO(239, 126, 255, 1.0);

  /// purple-75 - #f494ff
  late final Color purple75 = const Color.fromRGBO(244, 148, 255, 1.0);

  /// purple-80 - #f9aaff
  late final Color purple80 = const Color.fromRGBO(249, 170, 255, 1.0);

  /// purple-85 - #fdcfff
  late final Color purple85 = const Color.fromRGBO(253, 207, 255, 1.0);

  /// purple-90 - #ffd5ff
  late final Color purple90 = const Color.fromRGBO(255, 213, 255, 1.0);

  /// purple-95 - #feeafe
  late final Color purple95 = const Color.fromRGBO(254, 234, 254, 1.0);

  /// purple-99 - #fefbff
  late final Color purple99 = const Color.fromRGBO(254, 251, 255, 1.0);

  /// heritage-red-5 - #20000c
  late final Color heritageRed5 = const Color.fromRGBO(32, 0, 12, 1.0);

  /// heritage-red-10 - #400017
  late final Color heritageRed10 = const Color.fromRGBO(64, 0, 23, 1.0);

  /// heritage-red-15 - #530021
  late final Color heritageRed15 = const Color.fromRGBO(83, 0, 33, 1.0);

  /// heritage-red-20 - #66002a
  late final Color heritageRed20 = const Color.fromRGBO(102, 0, 42, 1.0);

  /// heritage-red-25 - #780034
  late final Color heritageRed25 = const Color.fromRGBO(120, 0, 52, 1.0);

  /// heritage-red-30 - #8f003e
  late final Color heritageRed30 = const Color.fromRGBO(143, 0, 62, 1.0);

  /// heritage-red-35 - #a50034
  late final Color heritageRed35 = const Color.fromRGBO(165, 0, 52, 1.0);

  /// heritage-red-40 - #c60449
  late final Color heritageRed40 = const Color.fromRGBO(198, 4, 73, 1.0);

  /// heritage-red-45 - #d91757
  late final Color heritageRed45 = const Color.fromRGBO(217, 23, 87, 1.0);

  /// heritage-red-50 - #db3265
  late final Color heritageRed50 = const Color.fromRGBO(219, 50, 101, 1.0);

  /// heritage-red-55 - #ed3f76
  late final Color heritageRed55 = const Color.fromRGBO(237, 63, 118, 1.0);

  /// heritage-red-60 - #fe4e87
  late final Color heritageRed60 = const Color.fromRGBO(254, 78, 135, 1.0);

  /// heritage-red-65 - #ff6997
  late final Color heritageRed65 = const Color.fromRGBO(255, 105, 151, 1.0);

  /// heritage-red-70 - #ff84a6
  late final Color heritageRed70 = const Color.fromRGBO(255, 132, 166, 1.0);

  /// heritage-red-75 - #ffa0b5
  late final Color heritageRed75 = const Color.fromRGBO(255, 160, 181, 1.0);

  /// heritage-red-80 - #ffb1c3
  late final Color heritageRed80 = const Color.fromRGBO(255, 177, 195, 1.0);

  /// heritage-red-85 - #ffc5d2
  late final Color heritageRed85 = const Color.fromRGBO(255, 197, 210, 1.0);

  /// heritage-red-90 - #ffd9e1
  late final Color heritageRed90 = const Color.fromRGBO(255, 217, 225, 1.0);

  /// heritage-red-95 - #ffecef
  late final Color heritageRed95 = const Color.fromRGBO(255, 236, 239, 1.0);

  /// heritage-red-99 - #fffbfe
  late final Color heritageRed99 = const Color.fromRGBO(255, 251, 254, 1.0);

  /// red-brown-5 - #200001
  late final Color redBrown5 = const Color.fromRGBO(32, 0, 1, 1.0);

  /// red-brown-10 - #410102
  late final Color redBrown10 = const Color.fromRGBO(65, 1, 2, 1.0);

  /// red-brown-15 - #500d0b
  late final Color redBrown15 = const Color.fromRGBO(80, 13, 11, 1.0);

  /// red-brown-20 - #5f1511
  late final Color redBrown20 = const Color.fromRGBO(95, 21, 17, 1.0);

  /// red-brown-25 - #6f201a
  late final Color redBrown25 = const Color.fromRGBO(111, 32, 26, 1.0);

  /// red-brown-30 - #7d2b25
  late final Color redBrown30 = const Color.fromRGBO(125, 43, 37, 1.0);

  /// red-brown-35 - #8e372f
  late final Color redBrown35 = const Color.fromRGBO(142, 55, 47, 1.0);

  /// red-brown-40 - #9b423a
  late final Color redBrown40 = const Color.fromRGBO(155, 66, 58, 1.0);

  /// red-brown-45 - #ab4e45
  late final Color redBrown45 = const Color.fromRGBO(171, 78, 69, 1.0);

  /// red-brown-50 - #bb5a50
  late final Color redBrown50 = const Color.fromRGBO(187, 90, 80, 1.0);

  /// red-brown-55 - #cb685a
  late final Color redBrown55 = const Color.fromRGBO(203, 104, 90, 1.0);

  /// red-brown-60 - #d97167
  late final Color redBrown60 = const Color.fromRGBO(217, 113, 103, 1.0);

  /// red-brown-65 - #e98973
  late final Color redBrown65 = const Color.fromRGBO(233, 137, 115, 1.0);

  /// red-brown-70 - #fa8b80
  late final Color redBrown70 = const Color.fromRGBO(250, 139, 128, 1.0);

  /// red-brown-75 - #ff9d92
  late final Color redBrown75 = const Color.fromRGBO(255, 157, 146, 1.0);

  /// red-brown-80 - #ffb4a9
  late final Color redBrown80 = const Color.fromRGBO(255, 180, 169, 1.0);

  /// red-brown-85 - #ffc4bc
  late final Color redBrown85 = const Color.fromRGBO(255, 196, 188, 1.0);

  /// red-brown-90 - #ffd9d4
  late final Color redBrown90 = const Color.fromRGBO(255, 217, 212, 1.0);

  /// red-brown-95 - #ffede9
  late final Color redBrown95 = const Color.fromRGBO(255, 237, 233, 1.0);

  /// red-brown-99 - #fffbfb
  late final Color redBrown99 = const Color.fromRGBO(255, 251, 251, 1.0);

  /// brown-5 - #150b07
  late final Color brown5 = const Color.fromRGBO(21, 11, 7, 1.0);

  /// brown-10 - #2b160f
  late final Color brown10 = const Color.fromRGBO(43, 22, 15, 1.0);

  /// brown-15 - #361f18
  late final Color brown15 = const Color.fromRGBO(54, 31, 24, 1.0);

  /// brown-20 - #422b22
  late final Color brown20 = const Color.fromRGBO(66, 43, 34, 1.0);

  /// brown-25 - #4d362a
  late final Color brown25 = const Color.fromRGBO(77, 54, 42, 1.0);

  /// brown-30 - #5b4137
  late final Color brown30 = const Color.fromRGBO(91, 65, 55, 1.0);

  /// brown-35 - #684c41
  late final Color brown35 = const Color.fromRGBO(104, 76, 65, 1.0);

  /// brown-40 - #75584e
  late final Color brown40 = const Color.fromRGBO(117, 88, 78, 1.0);

  /// brown-45 - #826358
  late final Color brown45 = const Color.fromRGBO(130, 99, 88, 1.0);

  /// brown-50 - #8f7065
  late final Color brown50 = const Color.fromRGBO(143, 112, 101, 1.0);

  /// brown-55 - #9d7d71
  late final Color brown55 = const Color.fromRGBO(157, 125, 113, 1.0);

  /// brown-60 - #ab8a7e
  late final Color brown60 = const Color.fromRGBO(171, 138, 126, 1.0);

  /// brown-65 - #b89589
  late final Color brown65 = const Color.fromRGBO(184, 149, 137, 1.0);

  /// brown-70 - #c7a297
  late final Color brown70 = const Color.fromRGBO(199, 162, 151, 1.0);

  /// brown-75 - #d6afa4
  late final Color brown75 = const Color.fromRGBO(214, 175, 164, 1.0);

  /// brown-80 - #e4beb1
  late final Color brown80 = const Color.fromRGBO(228, 190, 177, 1.0);

  /// brown-85 - #f1cabc
  late final Color brown85 = const Color.fromRGBO(241, 202, 188, 1.0);

  /// brown-90 - #ffdbcd
  late final Color brown90 = const Color.fromRGBO(255, 219, 205, 1.0);

  /// brown-95 - #ffede6
  late final Color brown95 = const Color.fromRGBO(255, 237, 230, 1.0);

  /// brown-99 - #fcfcfc
  late final Color brown99 = const Color.fromRGBO(252, 252, 252, 1.0);
}
