// @ts-check
import {test} from '@playwright/test';
import {runScreenshotTest} from './utils/test-utils';

import * as monoBlack from '../packages/mobile-tokens/json/color-semantic-mono-black.json';
import * as monoWhite from '../packages/mobile-tokens/json/color-semantic-mono-white.json';
import * as web from '../packages/mobile-tokens/json/color-semantic-web.json';
import * as mobile from '../packages/mobile-tokens/json/color-semantic-mobile.json';
import * as lgBrand from '../packages/mobile-tokens/json/color-semantic-lg-brand.json';

const cases = [
    {json: monoBlack, title: 'Color semantic mono black tokens for mobile', file: 'reference-mobile-tokens-color-semantic-mono-black.png'},
    {json: monoWhite, title: 'Color semantic mono white tokens for mobile', file: 'reference-mobile-tokens-color-semantic-mono-white.png'},
    {json: web, title: 'Color semantic web tokens for mobile', file: 'reference-mobile-tokens-color-semantic-web.png'},
    {json: mobile, title: 'Color semantic mobile tokens for mobile', file: 'reference-mobile-tokens-color-semantic-mobile.png'},
    {json: lgBrand, title: 'Color semantic LG brand tokens for mobile', file: 'reference-mobile-tokens-color-semantic-lg-brand.png'},
];

for (const c of cases) {
    test(c.title, async ({page}) => {
        await runScreenshotTest(page, c.json, 1280, c.title, c.file);
   });
}
