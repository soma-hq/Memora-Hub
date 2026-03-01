import fs from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");

// File storage manager
export class StorageManager {
	/**
	 * Upload a file to storage
	 * @param file Raw file buffer
	 * @param filename Target filename with extension
	 * @param folder Optional subfolder path
	 * @returns Public URL of uploaded file
	 */

	static async upload(file: Buffer, filename: string, folder = ""): Promise<string> {
		const dest = path.join(UPLOAD_DIR, folder, filename);
		await fs.mkdir(path.dirname(dest), { recursive: true });
		await fs.writeFile(dest, file);
		return `/uploads/${folder ? folder + "/" : ""}${filename}`;
	}

	/**
	 * Delete a file by public path
	 * @param filePath Public URL path
	 */

	static async delete(filePath: string): Promise<void> {
		const abs = path.join(process.cwd(), "public", filePath);
		await fs.unlink(abs).catch(() => null);
	}

	/**
	 * Get full URL for a file
	 * @param filePath Public file path
	 * @returns Fully qualified URL
	 */

	static async getUrl(filePath: string): Promise<string> {
		return `${process.env.NEXT_PUBLIC_APP_URL}${filePath}`;
	}
}
