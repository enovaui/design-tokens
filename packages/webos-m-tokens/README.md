
# @enovaui/webos-m-tokens
[![npm (scoped)](https://img.shields.io/npm/v/%40enovaui%2Fwebos-m-tokens)](https://www.npmjs.com/package/@enovaui/webos-m-tokens) [![license](https://img.shields.io/github/license/enovaui/design-tokens)](http://www.apache.org/licenses/LICENSE-2.0)

Semantic design tokens for applications in the LG UI Kit design system.

## Overview

This package contains semantic design tokens specifically crafted for applications. These tokens map primitive values from `@enovaui/core-tokens` to meaningful, context-specific design properties for devices.

### What are Semantic Tokens?

Semantic tokens translate primitive values into purpose-driven design tokens. They provide:

* **Meaningful Names**: Tokens are named by their purpose (e.g., `on-background-main`) rather than their value
* **Context-Aware Values**: Values are appropriate for specific UI contexts in application
* **Consistent Theming**: A standardized token structure for theming
* **Platform Optimization**: Values are optimized for display consistency

## Installation


To install the package, use your preferred package manager:

```bash
pnpm install @enovaui/webos-m-tokens
```

or

```bash
yarn add @enovaui/webos-m-tokens
```

### How to Use

To incorporate these design tokens into your project, follow these simple steps:

1. Import the desired token values from this repository.
2. Apply the imported tokens to your components and styles.

### Token Categories


* `color-semantic-dark`: Dark theme color tokens optimized for displays, featuring dark backgrounds with white text and cool gray accents
* `radius-semantic`: Border radius tokens for consistent component shapes
* `effect-semantic`: Effect tokens for shadows and overlays

## Copyright and License Information

Unless otherwise specified, all content, including all source code files and
documentation files in this repository are:

Copyright (c) 2026 LG Electronics

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
