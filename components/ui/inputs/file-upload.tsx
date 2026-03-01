"use client";

// React
import { useState, useRef } from "react";
import { Icon } from "../display/icon";
import { cn } from "@/lib/utils/cn";


interface FileUploadProps {
	label?: string;
	accept?: string;
	multiple?: boolean;
	maxSize?: number;
	hint?: string;
	onChange?: (files: File[]) => void;
	className?: string;
}

/**
 * Drag-and-drop file upload zone with file list and size validation.
 * @param {FileUploadProps} props - Component props
 * @param {string} [props.label] - Label text above the drop zone
 * @param {string} [props.accept] - Accepted MIME types
 * @param {boolean} [props.multiple] - Allow multiple file selection
 * @param {number} [props.maxSize=5] - Maximum file size in MB
 * @param {string} [props.hint] - Custom hint text below the drop zone
 * @param {(files: File[]) => void} [props.onChange] - Callback with selected files
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} File upload component
 */
export function FileUpload({ label, accept, multiple, maxSize = 5, hint, onChange, className }: FileUploadProps) {
	// State
	const [files, setFiles] = useState<File[]>([]);
	const [dragActive, setDragActive] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	// Handlers
	/**
	 * Filters files by max size and updates the file list.
	 * @param {FileList | null} newFiles - Native file list from input or drop
	 * @returns {void}
	 */
	const handleFiles = (newFiles: FileList | null) => {
		if (!newFiles) return;
		const arr = Array.from(newFiles).filter((f) => f.size <= maxSize * 1024 * 1024);
		const updated = multiple ? [...files, ...arr] : arr.slice(0, 1);
		setFiles(updated);
		onChange?.(updated);
	};

	/**
	 * Removes a file from the list by index.
	 * @param {number} index - Index of the file to remove
	 * @returns {void}
	 */
	const removeFile = (index: number) => {
		const updated = files.filter((_, i) => i !== index);
		setFiles(updated);
		onChange?.(updated);
	};

	// Render
	return (
		<div className={cn("flex flex-col gap-2", className)}>
			{label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}

			{/* Drop zone */}
			<div
				onDragOver={(e) => {
					e.preventDefault();
					setDragActive(true);
				}}
				onDragLeave={() => setDragActive(false)}
				onDrop={(e) => {
					e.preventDefault();
					setDragActive(false);
					handleFiles(e.dataTransfer.files);
				}}
				onClick={() => inputRef.current?.click()}
				className={cn(
					"flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 transition-all duration-200",
					dragActive
						? "border-primary-400 bg-primary-50 dark:bg-primary-900/10"
						: "border-gray-300 bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500",
				)}
			>
				<Icon name="upload" size="lg" className={dragActive ? "text-primary-500" : "text-gray-400"} />
				<div className="text-center">
					<p className="text-sm text-gray-600 dark:text-gray-400">
						<span className="text-primary-600 font-medium">Cliquez pour parcourir</span> ou glissez-deposez
					</p>
					<p className="mt-1 text-xs text-gray-400">{hint || `Max. ${maxSize} Mo par fichier`}</p>
				</div>
				<input
					ref={inputRef}
					type="file"
					accept={accept}
					multiple={multiple}
					onChange={(e) => handleFiles(e.target.files)}
					className="hidden"
				/>
			</div>

			{/* File list */}
			{files.length > 0 && (
				<div className="space-y-2">
					{files.map((file, idx) => (
						<div
							key={idx}
							className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2.5 dark:border-gray-700 dark:bg-gray-800"
						>
							<div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-700">
								<Icon name="document" size="sm" className="text-gray-500" />
							</div>
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
									{file.name}
								</p>
								<p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} Mo</p>
							</div>
							<button
								onClick={() => removeFile(idx)}
								className="hover:bg-error-50 dark:hover:bg-error-900/20 hover:text-error-500 rounded-lg p-1 text-gray-400 transition-colors"
							>
								<Icon name="close" size="sm" />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
