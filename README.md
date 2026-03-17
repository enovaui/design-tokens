# @enovaui/design-tokens
[![npm (scoped)](https://img.shields.io/npm/v/%40enovaui%2Fcore-tokens)](https://www.npmjs.com/package/@enovaui/core-tokens) [![license](https://img.shields.io/github/license/enovaui/design-tokens)](http://www.apache.org/licenses/LICENSE-2.0)

A centralized repository of design tokens for LG Electronics' UI Kit.

## Overview

This repository contains design tokens that define visual attributes for LG applications, specifically for the LG UI Kit design system. Design tokens help maintain consistency and enable theming across the ecosystem.

### What are Design Tokens?

Design tokens are essential building blocks that define the visual attributes of a project. They include colors, typography, spacing, and more. By using design tokens, you can ensure consistency and maintainability across your UI.

### Token Hierarchy

Our design tokens are organized in a three-level hierarchy:

![Token Hierarchy](https://github.com/user-attachments/assets/bdb0a867-b0fa-43a9-8102-fecb0b6093a3)

1. **Component Tokens** (Top Layer)
   - Purpose: Define component-specific design properties
   - Example: `header-label-sub-color`
   - Always reference semantic tokens, never primitive tokens directly
   - Located in component-specific packages

2. **Semantic Tokens** (Middle Layer)
   - Purpose: Provide context-aware design values
   - Example: `on-background-sub`
   - Reference primitive tokens to maintain consistency
   - Located in platform-specific packages (e.g., `webos-tokens`, `web-tokens`, `mobile-tokens`)
   - Acts as a bridge between primitive and component tokens

3. **Primitive Tokens** (Bottom Layer)
   - Purpose: Define raw design values
   - Example: `neutral-gray-70` with value `#b3b3b3`
   - Contain actual CSS values (hex colors, pixel values, etc.)
   - Located in `core-tokens` package

### Monorepo Structure

This repository is structured as a monorepo, containing multiple packages:

* **core-tokens**: Provides the foundational, primitive design tokens used across all Enovaui projects. These tokens define the raw values for colors, typography, spacing, and other visual attributes.
* **webos-tokens**: Contains semantic design tokens specific to the webOS platform. These tokens map the primitive tokens to specific use cases within the platform's applications.
* **web-tokens**: Contains semantic design tokens specific to web applications. These tokens provide consistent theming across web interfaces.
* **mobile-tokens**: Contains semantic design tokens specific to mobile applications. These tokens are optimized for mobile displays.

### How to Use

Our design tokens are available in three formats to support different development environments:

#### 1. JSON Format (C++ Applications)

JSON tokens can be parsed and used in C++ applications.

**Installation:**

Use one of these methods:
```bash
# Option 1: Git Submodule
git submodule add https://github.com/enovaui/design-tokens.git third_party/design-tokens

# Option 2: Direct download and copy JSON files to your project
# Copy packages/core-tokens/json/* and packages/webos-tokens/json/* to your source tree
```

**Example - Loading Primitive Tokens:**
```cpp
#include <nlohmann/json.hpp>
#include <fstream>

// Load primitive typography tokens
std::ifstream file("third_party/design-tokens/packages/core-tokens/json/typography-primitive.json");

nlohmann::json primitiveTokens;
file >> primitiveTokens;

// Access primitive font-size values
std::string fontSize24 = primitiveTokens["primitive"]["font-size-24"];
// Returns: "24px"

std::string fontSize32 = primitiveTokens["primitive"]["font-size-32"];
// Returns: "32px"
```

**Example - Loading Semantic Tokens:**
```cpp
// Load semantic tokens for dark theme
std::ifstream semanticFile("third_party/design-tokens/packages/webos-tokens/json/color-semantic-dark.json");
nlohmann::json semanticTokens;
semanticFile >> semanticTokens;

// Access semantic color values (with $ref resolution required)
auto onBackgroundMain = semanticTokens["semantic"]["color"]["on"]["background"]["main"];
// References: "core-tokens/json/color-primitive.json#/primitive/color/white"
```

**Note:** JSON tokens use `$ref` to reference primitive tokens. The `$ref` paths are relative to the repository root (e.g., `core-tokens/json/...` resolves to `packages/core-tokens/json/...`). When implementing a resolver:
- If using git submodule: resolve `core-tokens/json/...` as `third_party/design-tokens/packages/core-tokens/json/...`
- If copying files: maintain the `packages/` directory structure or adjust your resolver to prepend `packages/` to the $ref paths

#### 2. CSS Format (Web Applications)

CSS tokens are provided as CSS custom properties (variables) for web-based projects.

**Installation:**

For webOS web applications:
```bash
npm install @enovaui/core-tokens @enovaui/webos-tokens
```

For general web applications:
```bash
npm install @enovaui/core-tokens @enovaui/web-tokens
```

**Note:** The examples below use `@enovaui/webos-tokens` for webOS platforms. For general web applications, replace with `@enovaui/web-tokens` (e.g., `color-semantic-web.css`, `color-semantic-lg-brand.css`, etc.).

**Example - Using Primitive Tokens:**
```css
/* Import primitive tokens */
@import "@enovaui/core-tokens/css/typography-primitive.css";
@import "@enovaui/core-tokens/css/spacing-primitive.css";

.my-element {
  /* Use primitive tokens directly (not recommended for components) */
  font-size: var(--primitive-font-size-24);
  padding: var(--primitive-spacing-300);
}
```

**Example - Using Semantic Tokens:**
```css
/* Import semantic tokens (automatically imports primitives) */
@import "@enovaui/webos-tokens/css/color-semantic-dark.css";

.my-component {
  /* Use semantic tokens - recommended approach */
  color: var(--semantic-color-on-background-main);
  background: var(--semantic-color-background-full-default);
}
```

**Example - Theme Switching:**

**Option 1: Dynamically swap a `<link>` stylesheet**
```javascript
// main.js - dynamically set theme CSS via <link>
function setTheme(theme) {
  // Remove previous theme stylesheet
  const THEME_LINK_ID = 'theme-stylesheet';
  const href = `/node_modules/@enovaui/webos-tokens/css/color-semantic-${theme}.css`;

  // Import new theme
  let link = document.getElementById(THEME_LINK_ID);
  if (!link) {
    link = document.createElement('link');
    link.id = THEME_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  link.href = href;
  console.log(`Theme switched to ${theme}`);
}

// Usage: setTheme('light') or setTheme('dark')
```

**Option 2: Pre-load both themes with scoped selectors**
```css
/* Import both themes in your main CSS */
@import "@enovaui/webos-tokens/css/color-semantic-light.css" (prefers-color-scheme: light);
@import "@enovaui/webos-tokens/css/color-semantic-dark.css" (prefers-color-scheme: dark);
```

Or define theme-scoped custom properties:
```css
/* theme-tokens.css */
:root[data-theme="light"] {
  --semantic-color-on-background-main: var(--primitive-color-black);
  --semantic-color-background-full-default: var(--primitive-color-white);
  /* ... other light theme tokens */
}

:root[data-theme="dark"] {
  --semantic-color-on-background-main: var(--primitive-color-white);
  --semantic-color-background-full-default: var(--primitive-color-black);
  /* ... other dark theme tokens */
}
```

**Note:** Bare package specifiers like `@enovaui/webos-tokens` require a bundler (Vite, Webpack, etc.) or import maps to resolve. For runtime loading without a bundler, serve the CSS files and use absolute/relative URLs.

#### 3. Dart Format (Flutter Applications)

Dart tokens are provided as Flutter Color objects for mobile and Flutter applications.

**Installation:**
Add to your `pubspec.yaml`:
```yaml
dependencies:
  design_tokens: # package name
    git:
      url: https://github.com/enovaui/design-tokens.git # git url
      ref: 0.15.0 # tag name, Adjust If needed
```

**Example - Using Primitive Tokens:**
```dart
import 'package:flutter/material.dart';
import 'package:design_tokens/design_tokens.dart';

class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16),
      child: Text(
        'Hello World',
        style: TextStyle(
          // Use primitive font-size tokens
          fontSize: FontSizePrimitive.instance.size24,
          fontWeight: FontWeightPrimitive.instance.medium,
        ),
      ),
    );
  }
}
```

**Example - Using Semantic Tokens:**
```dart
import 'package:flutter/material.dart';
import 'package:design_tokens/design_tokens.dart';

class ThemedWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Use semantic tokens - recommended approach
    final semanticColors = ColorSemanticDark.instance;
    
    return Container(
      color: semanticColors.background.full.defaultColor,
      child: Text(
        'Themed Content',
        style: TextStyle(
          color: semanticColors.onBackground.main,
        ),
      ),
    );
  }
}
```

#### Creating Component Tokens

Component tokens should always reference semantic tokens, never primitive tokens directly. Here's how to create them in each format:

**CSS Component Token Example:**
```css
/* Import semantic tokens */
@import "@enovaui/webos-tokens/css/color-semantic-dark.css";

:root {
  /* Component tokens reference semantic tokens */
  --header-label-main-color: var(--semantic-color-on-background-main);
  --header-label-sub-color: var(--semantic-color-on-background-sub);
  --header-background-color: var(--semantic-color-surface-default);
  
  --button-primary-text-color: var(--semantic-color-on-background-main);
  --button-primary-bg-color: var(--semantic-color-surface-default);
  --button-primary-border-color: var(--semantic-color-stroke-main);
}

/* Usage in component */
.header {
  background-color: var(--header-background-color);
}

.header__title {
  color: var(--header-label-main-color);
}

.header__subtitle {
  color: var(--header-label-sub-color);
}
```

**JSON Component Token Example:**
```json
{
  "component": {
    "header": {
      "label": {
        "main": {
          "color": {
            "$ref": "webos-tokens/json/color-semantic-dark.json#/semantic/color/on/background/main"
          }
        },
        "sub": {
          "color": {
            "$ref": "webos-tokens/json/color-semantic-dark.json#/semantic/color/on/background/sub"
          }
        }
      },
      "background": {
        "color": {
          "$ref": "webos-tokens/json/color-semantic-dark.json#/semantic/color/surface/default"
        }
      }
    },
    "button": {
      "primary": {
        "text": {
          "color": {
            "$ref": "webos-tokens/json/color-semantic-dark.json#/semantic/color/on/background/main"
          }
        },
        "background": {
          "color": {
            "$ref": "webos-tokens/json/color-semantic-dark.json#/semantic/color/surface/default"
          }
        }
      }
    }
  }
}
```

**Note:** Component token `$ref` paths should use the same format as semantic tokens. Adjust paths based on your file structure if using a git submodule or copied files.

```cpp
/* Usage example */
#include <nlohmann/json.hpp>
#include <fstream>
#include <string>

// Helper function to resolve $ref paths
nlohmann::json resolveRef(const std::string& refPath) {
  // Parse the reference path (e.g., "webos-tokens/json/color-semantic-dark.json#/semantic/color/on/background/main")
  size_t hashPos = refPath.find('#');
  std::string filePath = refPath.substr(0, hashPos);
  std::string jsonPath = refPath.substr(hashPos + 1);

  // Load the referenced file
  std::ifstream file("third_party/design-tokens/packages/" + filePath);
  nlohmann::json refJson;
  file >> refJson;

  // Navigate to the specific value using json pointer
  return refJson[nlohmann::json::json_pointer(jsonPath)];
}

// Load component tokens
std::ifstream componentFile("my-app/tokens/component-tokens.json");
nlohmann::json componentTokens;
componentFile >> componentTokens;

// Access component tokens and resolve references
auto headerLabelMainRef = componentTokens["component"]["header"]["label"]["main"]["color"]["$ref"];
nlohmann::json headerLabelMainColor = resolveRef(headerLabelMainRef);
// Use the resolved color value

auto buttonPrimaryBgRef = componentTokens["component"]["button"]["primary"]["background"]["color"]["$ref"];
nlohmann::json buttonPrimaryBgColor = resolveRef(buttonPrimaryBgRef);
// Use the resolved color value
```

**Dart Component Token Example:**
```dart
import 'package:flutter/material.dart';
import 'package:design_tokens/design_tokens.dart';

class HeaderTokens {
  HeaderTokens._();
  
  static HeaderTokens? _instance;
  static HeaderTokens get instance => _instance ??= HeaderTokens._();
  
  // Reference semantic tokens, not primitive
  final semanticColors = ColorSemanticDark.instance;
  
  // Component tokens
  late final Color labelMainColor = semanticColors.onBackground.main;
  late final Color labelSubColor = semanticColors.onBackground.sub;
  late final Color backgroundColor = semanticColors.surface.defaultColor;
}

class ButtonTokens {
  ButtonTokens._();
  
  static ButtonTokens? _instance;
  static ButtonTokens get instance => _instance ??= ButtonTokens._();
  
  final semanticColors = ColorSemanticDark.instance;
  
  // Primary button tokens
  late final Color primaryTextColor = semanticColors.onBackground.main;
  late final Color primaryBgColor = semanticColors.surface.defaultColor;
  late final Color primaryBorderColor = semanticColors.stroke.main;
}

// Usage in components
class MyHeader extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final tokens = HeaderTokens.instance;
    
    return Container(
      color: tokens.backgroundColor,
      child: Column(
        children: [
          Text(
            'Main Title',
            style: TextStyle(color: tokens.labelMainColor),
          ),
          Text(
            'Subtitle',
            style: TextStyle(color: tokens.labelSubColor),
          ),
        ],
      ),
    );
  }
}
```

#### Best Practices

1. **Always use the token hierarchy correctly:**
   - Component tokens → Semantic tokens → Primitive tokens
   - Never reference primitive tokens directly in components

2. **Choose the right token level:**
   - Use component tokens in your UI components
   - Use semantic tokens when component tokens don't exist yet
   - Only reference primitive tokens when defining semantic tokens

3. **Theme-aware development:**
   - Use semantic tokens to ensure your components work across different themes
   - Test your components with different theme variants (light, dark, high-contrast)

### Automated Screenshot Testing

This project includes the [Playwright](https://playwright.dev/) configurations for executing automated Screenshot tests from design tokens library packages.

#### Prerequisites

```bash
pnpm install
```

#### Install Playwright browsers (one-time)

Playwright browser binaries are required for screenshot tests. Run the installer once locally or in CI using:

```bash
# local (run once)
pnpm run prepare:test-ss

# CI (recommended step in your pipeline)
pnpm exec playwright install --with-deps
```

If you prefer to control the download location, set `PLAYWRIGHT_BROWSERS_PATH` before running the command. See Playwright docs for details.

#### Creating Screenshot Tests

Within the repository, create a corresponding test in /tests/**-specs.js.

The test-utils from /utils/ contains useful methods for loading tests.

#### Test Commands

```bash
# Screenshot Tests
pnpm run test-ss          # Run all screenshot tests
pnpm run test-ss:update   # Update reference images (must be run before the first test)
```

#### Viewing Test Results

After a test runs, if there are test failures, a page is created with links automatically. And we can view the report by opening the provided link or inputting command:

```bash
 Serving HTML report at http://localhost:9323. Press Ctrl+C to quit. # Automatically created link
 pnpm exec playwright show-report tests\result\reports\html # Command to view report
```

## Copyright and License Information

Unless otherwise specified, all content, including all source code files and
documentation files in this repository are:

Copyright (c) 2025 LG Electronics

Unless otherwise specified or set forth in the NOTICE file, all content,
including all source code files and documentation files in this repository are:
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this content except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
