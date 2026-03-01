import { ExportService } from "@/services/ExportService";
import { LogService } from "@/services/LogService";
import { getExportConfig } from "@/lib/utils/config";
import type { ExportFormatValue } from "@/constants";


// Represents an export job with its current state
interface ExportJob {
	id: string;
	format: ExportFormatValue;
	data: Record<string, unknown>[];
	options: {
		title?: string;
		columns?: { key: string; label: string }[];
		filename?: string;
	};
	performedBy?: string;
	status: "pending" | "processing" | "done" | "error";
	result?: Blob;
	error?: string;
}

// Manages export job creation, processing, and retrieval
export class ExportManager {
	private static _instance: ExportManager;
	private jobs: Map<string, ExportJob> = new Map();
	private jobCounter = 0;

	/**
	 * Get the singleton instance
	 * @returns The ExportManager singleton
	 */

	static getInstance(): ExportManager {
		if (!ExportManager._instance) {
			ExportManager._instance = new ExportManager();
		}
		return ExportManager._instance;
	}

	/**
	 * Create and start an export job
	 * @param format Target export format
	 * @param data Records to export
	 * @param options Export configuration
	 * @param performedBy Initiating user ID
	 * @returns Generated job ID
	 */

	async createJob(
		format: ExportFormatValue,
		data: Record<string, unknown>[],
		options: {
			title?: string;
			columns?: { key: string; label: string }[];
			filename?: string;
		},
		performedBy?: string,
	): Promise<string> {
		// Load export limits from configuration
		const config = getExportConfig();

		// Generate a unique job ID
		const id = `export-${++this.jobCounter}`;

		// Build the job with row count capped by config
		const job: ExportJob = {
			id,
			format,
			data: data.slice(0, config.maxRowsPerExport),
			options,
			performedBy,
			status: "pending",
		};

		// Register the job in the tracking map
		this.jobs.set(id, job);

		// Start asynchronous processing
		this.processJob(id);

		return id;
	}

	/**
	 * Execute the export for a job
	 * @param jobId Job ID to process
	 */

	private async processJob(jobId: string): Promise<void> {
		const job = this.jobs.get(jobId);
		if (!job) return;

		// Mark job as actively processing
		job.status = "processing";

		try {
			// Delegate export generation to the service layer
			job.result = await ExportService.exportData(job.format, job.data, job.options, job.performedBy);

			// Mark job as successfully completed
			job.status = "done";
		} catch (error) {
			// Record the failure on the job
			job.status = "error";
			job.error = (error as Error).message;

			// Log the error for observability
			await LogService.logError("ExportManager", error as Error);
		}
	}

	/**
	 * Get current status of a job
	 * @param jobId Job ID to check
	 * @returns Job status or null
	 */

	getJobStatus(jobId: string): Pick<ExportJob, "id" | "status" | "error"> | null {
		const job = this.jobs.get(jobId);
		if (!job) return null;

		return { id: job.id, status: job.status, error: job.error };
	}

	/**
	 * Get exported file from a completed job
	 * @param jobId Completed job ID
	 * @returns Exported Blob or null
	 */

	getJobResult(jobId: string): Blob | null {
		const job = this.jobs.get(jobId);
		if (!job || job.status !== "done") return null;

		return job.result ?? null;
	}

	/**
	 * Remove completed and failed jobs
	 */

	cleanup(): void {
		for (const [id, job] of this.jobs) {
			if (job.status === "done" || job.status === "error") {
				this.jobs.delete(id);
			}
		}
	}
}
