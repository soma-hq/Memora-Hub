import { slugify, triggerDownload } from "./utils";


/** Excel export configuration options */
export interface ExcelExportOptions {
	title: string;
	sheets: ExcelSheet[];
}

/** Single sheet definition for Excel export */
export interface ExcelSheet {
	name: string;
	data: Record<string, unknown>[];
	columns: { key: string; label: string }[];
}

/**
 * Generates an Excel blob from the provided sheets (stub implementation)
 * @param options - Excel export configuration
 * @returns Excel-typed blob with tab-separated content
 */
export async function exportToExcel(options: ExcelExportOptions): Promise<Blob> {
	await new Promise((r) => setTimeout(r, 1200));

	const sheets = options.sheets.map((sheet) => {
		const header = sheet.columns.map((c) => c.label).join("\t");
		const rows = sheet.data.map((row) => sheet.columns.map((c) => String(row[c.key] ?? "")).join("\t"));
		return `--- ${sheet.name} ---\n${header}\n${rows.join("\n")}`;
	});

	const content = [`${options.title}`, `Export: ${new Date().toLocaleDateString("fr-FR")}`, "", ...sheets].join(
		"\n\n",
	);

	return new Blob([content], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}

/**
 * Exports data as Excel and triggers a browser download
 * @param options - Excel export configuration
 * @returns Resolves when the download is triggered
 */
export async function downloadExcel(options: ExcelExportOptions): Promise<void> {
	const blob = await exportToExcel(options);
	triggerDownload(blob, `${slugify(options.title)}.xlsx`);
}
