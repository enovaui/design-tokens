// @ts-check
import {test} from '@playwright/test';
import {runScreenshotTest} from './utils/test-utils';

import * as light from '../packages/webos-tokens/json/color-semantic-light.json';
import * as highContrast from '../packages/webos-tokens/json/color-semantic-high-contrast.json';
import * as dark from '../packages/webos-tokens/json/color-semantic-dark.json';
import * as radius from '../packages/webos-tokens/json/radius-semantic.json';

const cases = [
    {json: light, title: 'Color semantic light tokens for webOS', file: 'reference-webos-tokens-color-semantic-light.png'},
    {json: highContrast, title: 'Color semantic high contrast tokens for webOS', file: 'reference-webos-tokens-color-semantic-high-contrast.png'},
    {json: dark, title: 'Color semantic dark tokens for webOS', file: 'reference-webos-tokens-color-semantic-dark.png'},
    {json: radius, title: 'Radius semantic tokens for webOS', file: 'reference-webos-tokens-radius-semantic.png'},
];

for (const c of cases) {
    test(c.title, async ({page}) => {
        await runScreenshotTest(page, c.json, 1280, c.title, c.file);
   });
}
