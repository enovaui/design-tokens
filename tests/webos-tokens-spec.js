import {test} from '@playwright/test';
import {runScreenshotTest} from './utils/test-utils';

import * as colorSemanticLight from '../packages/webos-tokens/json/color-semantic-light.json';
import * as colorSemanticHighContrast from '../packages/webos-tokens/json/color-semantic-high-contrast.json';
import * as colorSemanticDark from '../packages/webos-tokens/json/color-semantic-dark.json';
import * as radiusSemantic from '../packages/webos-tokens/json/radius-semantic.json';

const cases = [
    {json: colorSemanticLight, title: 'Color semantic light tokens for webOS', file: 'reference-webos-tokens-color-semantic-light.png'},
    {json: colorSemanticHighContrast, title: 'Color semantic high contrast tokens for webOS', file: 'reference-webos-tokens-color-semantic-high-contrast.png'},
    {json: colorSemanticDark, title: 'Color semantic dark tokens for webOS', file: 'reference-webos-tokens-color-semantic-dark.png'},
    {json: radiusSemantic, title: 'Radius semantic tokens for webOS', file: 'reference-webos-tokens-radius-semantic.png'},
];

for (const c of cases) {
    test(c.title, async ({page}) => {
        await runScreenshotTest(page, c.json, 1280, c.title, c.file);
   });
}
