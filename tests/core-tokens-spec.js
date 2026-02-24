import {test} from '@playwright/test';
import {runScreenshotTest} from './utils/test-utils';

import * as colorToken from '../packages/core-tokens/json/color-primitive.json';
import * as spacingToken from '../packages/core-tokens/json/spacing-primitive.json';
import * as radiusToken from '../packages/core-tokens/json/radius-primitive.json';
import * as typographyToken from '../packages/core-tokens/json/typography-primitive.json';

// For color tokens we need a custom renderer (show color swatches and fixed height).
const cases = [
    {
        json: colorToken,
        title: 'Color primitive tokens',
        file: 'reference-core-tokens-color-primitive.png',
        render: (json, title) => {
            let htmlContent = `<h1>${title}</h1><ul>`;
            for (const [name, value] of Object.entries(json.primitive.color)) {
                htmlContent += `<li>${name}: ${value} <span style="display:inline-block;width:30px;height:20px;border:1px solid #ccc;background:${value};vertical-align:middle;"></span></li>`;
           }
            htmlContent += '</ul>';
            // return html and fixed height to match original behavior
            return {html: htmlContent, height: 12000};
       },
   },
    {json: spacingToken, title: 'Spacing primitive tokens', file: 'reference-core-tokens-spacing-primitive.png'},
    {json: radiusToken, title: 'Radius primitive tokens', file: 'reference-core-tokens-radius-primitive.png'},
    {json: typographyToken, title: 'Typography primitive tokens', file: 'reference-core-tokens-typography-primitive.png'},
];

for (const c of cases) {
    test(c.title, async ({page}) => {
        if (c.render) {
            await runScreenshotTest(page, c.json, 1280, c.title, c.file, {threshold: 0.2}, c.render);
       } else {
            await runScreenshotTest(page, c.json, 1280, c.title, c.file);
       }
   });
}
