import {test} from '@playwright/test';
import {runScreenshotTest} from './utils/test-utils';

import * as colorSemanticDark from '../packages/webos-m-tokens/json/color-semantic-dark.json';
import * as effectSemanticDarkDefault from '../packages/webos-m-tokens/json/effect-semantic-dark-default.json';
import * as effectSemanticDarkResMedium from '../packages/webos-m-tokens/json/effect-semantic-dark-res-medium.json';
import * as effectSemanticDarkResLow from '../packages/webos-m-tokens/json/effect-semantic-dark-res-low.json';
import * as radiusSemantic from '../packages/webos-m-tokens/json/radius-semantic.json';

const cases = [
    {json: colorSemanticDark, title: 'Color semantic dark tokens for webOS-m', file: 'reference-webos-m-tokens-color-semantic-dark.png'},
    {json: effectSemanticDarkDefault, title: 'Effect semantic dark default tokens for webOS-m', file: 'reference-webos-m-tokens-effect-semantic-dark-default.png'},
    {json: effectSemanticDarkResMedium, title: 'Effect semantic dark res medium tokens for webOS-m', file: 'reference-webos-m-tokens-effect-semantic-dark-res-medium.png'},
    {json: effectSemanticDarkResLow, title: 'Effect semantic dark res low tokens for webOS-m', file: 'reference-webos-m-tokens-effect-semantic-dark-res-low.png'},
    {json: radiusSemantic, title: 'Radius semantic tokens for webOS-m', file: 'reference-webos-m-tokens-radius-semantic.png'},
];

for (const c of cases) {
    test(c.title, async ({page}) => {
        await runScreenshotTest(page, c.json, 1280, c.title, c.file);
   });
}
