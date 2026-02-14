function extractLastKeyValue(value, key = '') {
	let htmlContent = '';
	if (typeof value === 'object' && value !== null) {
		for (const [k, v] of Object.entries(value)) {
			htmlContent += extractLastKeyValue(v, k);
		}
	} else {
		htmlContent += `<li>${key}: ${value}</li>`;
	}
	return htmlContent;
}

export async function setupViewport(page, jsonData, width = 1280, title) {
	const listHtml = extractLastKeyValue(jsonData);
	await page.setContent(`<h1>${title}</h1><ul style=\"margin:0; padding:0;\">${listHtml}</ul>`);

	const rowCount = await page.locator('li').count();
	// default browser font size 16, header font size 40
	const totalHeight = rowCount * 24 + 40;

	await page.setViewportSize({width, height: totalHeight});

	return totalHeight;
}
