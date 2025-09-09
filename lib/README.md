## @enovaui/design-tokens for Flutter

A centralized repository of design tokens for LG Electronics' UI Kit, especially for Flutter applications.

## Overview

This repository contains design tokens that define visual attributes for LG Flutter applications, specifically for the LG UI Kit design system. Design tokens help maintain consistency and enable theming across the ecosystem.

## Token Categories

### Primitive Tokens (Core Tokens)

Primitive tokens are the basic building blocks of the design system:

- **`ColorPrimitive`**: Basic color palette

  - `neutral-gray`: Neutral gray scale (from level 5 to 99)
  - `mist-gray`: Mist gray scale
  - `cool-gray`: Cool gray scale
  - `blue-gray`: Blue gray scale
  - Other brand and functional colors

- **`RadiusPrimitive`**: Basic border radius values
- **`SpacingPrimitive`**: Basic margin and spacing values
- **`TypographyPrimitive`**: Basic typography styles

### Semantic Tokens (e.g. webOS Tokens)

Semantic tokens are meaningfully named tokens based on their purpose.
As of now, there are only `webos_tokens` but it will be added later for other platforms.
Below describes `webos_tokens` case:

- **`ColorSemanticDark`**: Dark theme colors optimized for webOS TV displays

  - Dark backgrounds with white text
  - Cool gray UI elements

- **`ColorSemanticLight`**: Light theme colors

  - Neutral backgrounds with dark text
  - Cool gray UI elements

- **`RadiusSemantic`**: Border radius tokens for consistent component shapes

### Token Structure

Semantic tokens have the following hierarchical structure:

```dart
ColorSemantic
├── background (background colors)
├── onBackground (content colors on background)
├── surface (surface colors)
├── onSurface (content colors on surface)
├── stroke (border colors)
└── scrim (scrim/overlay colors)
```

## Usage

### 1. Add dependency to pubspec.yaml

```yaml
dependencies:
  design_tokens:
    git:
      url: git@github.com:enovaui/design-tokens.git
      ref: v0.8.2
```

### 2. Import library

```dart
import 'package:design_tokens/design_tokens.dart';
```

### 3. Token usage examples

#### Using primitive tokens

```dart
// Using color primitive tokens
Container(
  color: ColorPrimitive.instance.neutralGray20,
  child: Text(
    'Hello World',
    style: TextStyle(color: ColorPrimitive.instance.white),
  ),
)

// Using spacing primitive tokens
Padding(
  padding: EdgeInsets.all(SpacingPrimitive.instance.spacing16),
  child: ...,
)
```

#### Using semantic tokens

```dart
// Using dark theme semantic tokens
final darkColors = ColorSemanticDark();

Container(
  color: darkColors.background.main,
  child: Text(
    'Hello World',
    style: TextStyle(color: darkColors.onBackground.main),
  ),
)
```

## Best Practices

1. **Prefer semantic tokens**: Use semantic tokens whenever possible to clarify meaning.
2. **Theme support**: Choose appropriate semantic tokens to support dark/light themes.
3. **Maintain consistency**: Use tokens instead of direct color values to maintain consistency.

## Copyright and License Information

Unless otherwise specified, all content, including all source code files and documentation files in this repository are:

Copyright (c) 2025 LG Electronics

Unless otherwise specified or set forth in the NOTICE file, all content, including all source code files and documentation files in this repository are:
Licensed under the LicenseRef-LGE-Proprietary license.

Please refer to the corresponding license document for detailed license terms.
