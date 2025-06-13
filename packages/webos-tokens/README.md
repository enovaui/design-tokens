# @enovaui/webos-tokens
[![npm (scoped)](https://img.shields.io/npm/v/%40enovaui%2Fwebos-tokens)](https://www.npmjs.com/package/@enovaui/webos-tokens) [![license](https://img.shields.io/github/license/enovaui/design-tokens)](http://www.apache.org/licenses/LICENSE-2.0)

Semantic design tokens for webOS applications in the LG UI Kit design system.

## Overview

This package contains semantic design tokens specifically crafted for webOS applications. These tokens map primitive values from `@enovaui/core-tokens` to meaningful, context-specific design properties.

### What are Semantic Tokens?

Semantic tokens translate primitive values into purpose-driven design tokens. They provide:

* **Meaningful Names**: Tokens are named by their purpose (e.g., `on-background-main`) rather than their value
* **Context-Aware Values**: Values are appropriate for specific UI contexts in webOS
* **Consistent Theming**: A standardized token structure for webOS theming
* **Platform Optimization**: Values are optimized for webOS displays

## Installation

To install the package, use your preferred package manager:

```bash
npm install @enovaui/webos-tokens
```

or

```bash
yarn add @enovaui/webos-tokens
```

### How to Use

To incorporate these design tokens into your project, follow these simple steps:

1. Import the desired token values from this repository.
2. Apply the imported tokens to your components and styles.

### Token Categories

* `color-semantic-dark`: Dark theme color tokens optimized for webOS TV displays, featuring dark backgrounds with white text and cool gray accents
* `color-semantic-light`: Light theme color tokens with neutral backgrounds and dark text, using cool grays for UI elements
* `radius-semantic`: Border radius tokens for consistent component shapes

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
