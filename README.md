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

Documentation and developer samples are coming soon. In the meantime, you can:

1. Browse through the token definitions in each package
2. Explore the JSON and CSS implementations
3. Use the tokens in your projects by importing them from the respective packages

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
