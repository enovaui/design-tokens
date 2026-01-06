
export function extractLastKeyValue (value, key = '') {
    let htmlContent = '';
	if(typeof value === 'object' && value !== null) {
		for (const [k, v] of Object.entries(value)) {
			htmlContent += extractLastKeyValue(v, k);	
		}
	} else {
		htmlContent += `<li>${key}: ${value}</li>`;
	}
    return htmlContent;
}
