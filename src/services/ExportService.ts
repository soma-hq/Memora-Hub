import { LogService } from "@/services/LogService";
import { LogAction } from "@/constants";
import type { ExportFormatValue } from "@/constants";
import { getExportConfig } from "@/lib/utils/config";


/** Data export service */
export class ExportService {
	/**
	 * Export data to file
	 * @param format Export format
	 * @param data Records to export
	 * @param options Export options
	 * @param performedBy Actor user ID
	 * @throws Error if the export format is not supported
	 * @returns Generated file blob
	 */

	static async exportData(
		format: ExportFormatValue,
		data: Record<string, unknown>[],
		options: {
			title?: string;
			columns?: { key: string; label: string }[];
			filename?: string;
		},
		performedBy?: string,
	): Promise<Blob> {
		// Load export configuration limits
		const config = getExportConfig();

		// Enforce the maximum row limit on exported data
		const limitedData = data.slice(0, config.maxRowsPerExport);

		let blob: Blob;

		// Generate file blob based on the requested format
		switch (format) {
			case "pdf": {
				const { exportToPdf } = await import("@/lib/export/pdf");
				blob = await exportToPdf({
					title: options.title || "Export",
					data: limitedData,
					columns: options.columns || [],
				});
				break;
			}
			case "excel": {
				const { exportToExcel } = await import("@/lib/export/excel");
				blob = await exportToExcel({
					title: options.title || "Export",
					sheets: [
						{
							name: options.title || "Data",
							data: limitedData,
							columns: options.columns || [],
						},
					],
				});
				break;
			}
			case "csv": {
				const { exportToCsv } = await import("@/lib/export/csv");
				blob = await exportToCsv({
					title: options.title || "Export",
					data: limitedData,
					columns: options.columns || [],
				});
				break;
			}
			default:
				throw new Error(`Unsupported export format: ${format}`);
		}

		// Log the export action with row count
		await LogService.log(LogAction.Create, "export", format, performedBy, `rows:${limitedData.length}`);

		return blob;
	}
}
