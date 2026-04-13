// External libraries
import fs from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");

// File storage manager
export class StorageManager {
	/**
	 * Upload a file buffer to persistent storage
	 * @param file Raw file contents as a Buffer
	 * @param filename Target filename including extension
	 * @param folder Optional subfolder within the uploads directory
	 * @returns Public URL path to the uploaded file
	 */

	static async upload(file: Buffer, filename: string, folder = ""): Promise<string> {
		const dest = path.join(UPLOAD_DIR, folder, filename);
		await fs.mkdir(path.dirname(dest), { recursive: true });
		await fs.writeFile(dest, file);
		return `/uploads/${folder ? folder + "/" : ""}${filename}`;
	}

	/**
	 * Delete a file from storage by its public path
	 * @param filePath Public URL path of the file to delete
	 */

	static async delete(filePath: string): Promise<void> {
		const abs = path.join(process.cwd(), "public", filePath);
		await fs.unlink(abs).catch(() => null);
	}

	/**
	 * Resolve the full public URL for a stored file
	 * @param filePath Public path of the file
	 * @returns Fully qualified URL
	 */

	static async getUrl(filePath: string): Promise<string> {
		return `${process.env.NEXT_PUBLIC_APP_URL}${filePath}`;
	}
}
