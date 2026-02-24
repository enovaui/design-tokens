import {test} from '@playwright/test';
import {runScreenshotTest} from './utils/test-utils';

import * as colorSemanticMonoBlack from '../packages/mobile-tokens/json/color-semantic-mono-black.json';
import * as colorSemanticMonoWhite from '../packages/mobile-tokens/json/color-semantic-mono-white.json';
import * as colorSemanticWeb from '../packages/mobile-tokens/json/color-semantic-web.json';
import * as colorSemanticMobile from '../packages/mobile-tokens/json/color-semantic-mobile.json';
import * as colorSemanticLgBrand from '../packages/mobile-tokens/json/color-semantic-lg-brand.json';

const cases = [
    {json: colorSemanticMonoBlack, title: 'Color semantic mono black tokens for mobile', file: 'reference-mobile-tokens-color-semantic-mono-black.png'},
    {json: colorSemanticMonoWhite, title: 'Color semantic mono white tokens for mobile', file: 'reference-mobile-tokens-color-semantic-mono-white.png'},
    {json: colorSemanticWeb, title: 'Color semantic web tokens for mobile', file: 'reference-mobile-tokens-color-semantic-web.png'},
    {json: colorSemanticMobile, title: 'Color semantic mobile tokens for mobile', file: 'reference-mobile-tokens-color-semantic-mobile.png'},
    {json: colorSemanticLgBrand, title: 'Color semantic LG brand tokens for mobile', file: 'reference-mobile-tokens-color-semantic-lg-brand.png'},
];

for (const c of cases) {
    test(c.title, async ({page}) => {
        await runScreenshotTest(page, c.json, 1280, c.title, c.file);
   });
}
