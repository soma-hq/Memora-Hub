/**
 * Converts text to a URL-friendly slug
 * @param text - Text to slugify
 * @returns Lowercase hyphenated string
 */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

/**
 * Creates a temporary link element and triggers a file download
 * @param blob - File blob to download
 * @param filename - Name for the downloaded file
 */
export function triggerDownload(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();

	// Clean up DOM element and object URL
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
