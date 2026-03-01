import { slugify, triggerDownload } from "./utils";


/** PDF export configuration options */
export interface PdfExportOptions {
	title: string;
	data: Record<string, unknown>[];
	columns: { key: string; label: string; width?: number }[];
	orientation?: "portrait" | "landscape";
	includeHeader?: boolean;
	includeFooter?: boolean;
}

/**
 * Generates a PDF blob from the provided data (stub implementation)
 * @param options - PDF export configuration
 * @returns PDF-typed blob with formatted text content
 */
export async function exportToPdf(options: PdfExportOptions): Promise<Blob> {
	// Simulate PDF generation delay
	await new Promise((r) => setTimeout(r, 1500));

	const content = [
		`=== ${options.title} ===`,
		`Generated: ${new Date().toLocaleDateString("fr-FR")}`,
		`Orientation: ${options.orientation ?? "portrait"}`,
		"",
		options.columns.map((c) => c.label).join(" | "),
		"-".repeat(80),
		...options.data.map((row) => options.columns.map((c) => String(row[c.key] ?? "")).join(" | ")),
		"",
		options.includeFooter !== false ? "Memora Hub — Export PDF" : "",
	].join("\n");

	return new Blob([content], { type: "application/pdf" });
}

/**
 * Exports data as PDF and triggers a browser download
 * @param options - PDF export configuration
 * @returns Resolves when the download is triggered
 */
export async function downloadPdf(options: PdfExportOptions): Promise<void> {
	const blob = await exportToPdf(options);
	triggerDownload(blob, `${slugify(options.title)}.pdf`);
}
