import { slugify, triggerDownload } from "./utils";


/** CSV export configuration options */
export interface CsvExportOptions {
	title: string;
	data: Record<string, unknown>[];
	columns: { key: string; label: string }[];
	separator?: string;
}

/**
 * Generates a CSV blob from the provided data and columns
 * @param options - CSV export configuration
 * @returns CSV blob with UTF-8 BOM
 */
export async function exportToCsv(options: CsvExportOptions): Promise<Blob> {
	await new Promise((r) => setTimeout(r, 500));

	const sep = options.separator ?? ",";
	const header = options.columns.map((c) => escapeCsv(c.label)).join(sep);
	const rows = options.data.map((row) => options.columns.map((c) => escapeCsv(String(row[c.key] ?? ""))).join(sep));

	const content = [header, ...rows].join("\n");

	// Prepend BOM for correct encoding in spreadsheet applications
	return new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
}

/**
 * Exports data as CSV and triggers a browser download
 * @param options - CSV export configuration
 * @returns Resolves when the download is triggered
 */
export async function downloadCsv(options: CsvExportOptions): Promise<void> {
	const blob = await exportToCsv(options);
	triggerDownload(blob, `${slugify(options.title)}.csv`);
}

/**
 * Escapes a value for safe CSV inclusion
 * @param value - Raw string value
 * @returns Escaped CSV-safe string
 */
function escapeCsv(value: string): string {
	if (value.includes(",") || value.includes('"') || value.includes("\n")) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}
