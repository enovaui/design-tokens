// @ts-check
import {test} from '@playwright/test';
import {runScreenshotTest} from './utils/test-utils';

import * as monoBlack from '../packages/web-tokens/json/color-semantic-mono-black.json';
import * as monoWhite from '../packages/web-tokens/json/color-semantic-mono-white.json';
import * as mobile from '../packages/web-tokens/json/color-semantic-mobile.json';
import * as web from '../packages/web-tokens/json/color-semantic-web.json';
import * as radius from '../packages/web-tokens/json/radius-semantic.json';
import * as lgBrand from '../packages/web-tokens/json/color-semantic-lg-brand.json';
import * as typography from '../packages/web-tokens/json/typography-semantic.json';

const cases = [
    {json: monoBlack, title: 'Color semantic mono black tokens for web', file: 'reference-web-tokens-color-semantic-mono-black.png'},
    {json: monoWhite, title: 'Color semantic mono white tokens for web', file: 'reference-web-tokens-color-semantic-mono-white.png'},
    {json: mobile, title: 'Color semantic mobile tokens for web', file: 'reference-web-tokens-color-semantic-mobile.png'},
    {json: web, title: 'Color semantic web tokens for web', file: 'reference-web-tokens-color-semantic-web.png'},
    {json: radius, title: 'Radius semantic tokens for web', file: 'reference-web-tokens-radius-semantic.png'},
    {json: lgBrand, title: 'Color semantic lg brand tokens for web', file: 'reference-web-tokens-color-semantic-lg-brand.png'},
    {json: typography, title: 'Typography semantic tokens for web', file: 'reference-web-tokens-typography-semantic.png'},
];

for (const c of cases) {
    test(c.title, async ({page}) => {
        await runScreenshotTest(page, c.json, 1280, c.title, c.file);
   });
}
