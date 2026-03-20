import {test} from '@playwright/test';
import {runScreenshotTest} from './utils/test-utils';

import * as colorSemanticMonoBlack from '../packages/web-tokens/json/color-semantic-mono-black.json';
import * as colorSemanticMonoWhite from '../packages/web-tokens/json/color-semantic-mono-white.json';
import * as colorSemanticMobile from '../packages/web-tokens/json/color-semantic-mobile.json';
import * as colorSemanticWeb from '../packages/web-tokens/json/color-semantic-web.json';
import * as radiusSemantic from '../packages/web-tokens/json/radius-semantic.json';
import * as colorSemanticLGBrand from '../packages/web-tokens/json/color-semantic-lg-brand.json';
import * as typographySemantic from '../packages/web-tokens/json/typography-semantic.json';

const cases = [
    {json: colorSemanticMonoBlack, title: 'Color semantic mono black tokens for web', file: 'reference-web-tokens-color-semantic-mono-black.png'},
    {json: colorSemanticMonoWhite, title: 'Color semantic mono white tokens for web', file: 'reference-web-tokens-color-semantic-mono-white.png'},
    {json: colorSemanticMobile, title: 'Color semantic mobile tokens for web', file: 'reference-web-tokens-color-semantic-mobile.png'},
    {json: colorSemanticWeb, title: 'Color semantic web tokens for web', file: 'reference-web-tokens-color-semantic-web.png'},
    {json: radiusSemantic, title: 'Radius semantic tokens for web', file: 'reference-web-tokens-radius-semantic.png'},
    {json: colorSemanticLGBrand, title: 'Color semantic lg brand tokens for web', file: 'reference-web-tokens-color-semantic-lg-brand.png'},
    {json: typographySemantic, title: 'Typography semantic tokens for web', file: 'reference-web-tokens-typography-semantic.png'},
];

for (const c of cases) {
    test(c.title, async ({page}) => {
        await runScreenshotTest(page, c.json, 1280, c.title, c.file);
   });
}
