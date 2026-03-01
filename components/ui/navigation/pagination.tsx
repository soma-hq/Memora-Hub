"use client";

// Components
import { Icon } from "../display/icon";
import { cn } from "@/lib/utils/cn";


interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
}

/**
 * Page navigation with numbered buttons and ellipsis for large page counts.
 * @param {PaginationProps} props - Component props
 * @param {number} props.currentPage - Currently active page number
 * @param {number} props.totalPages - Total number of pages
 * @param {(page: number) => void} props.onPageChange - Callback when a page is selected
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Pagination controls
 */
export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
	/**
	 * Builds the array of page numbers and ellipsis markers.
	 * @returns {(number | "...")[]} Page indicators
	 */
	const getPageNumbers = () => {
		const pages: (number | "...")[] = [];
		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			pages.push(1);
			if (currentPage > 3) pages.push("...");
			for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
				pages.push(i);
			}
			if (currentPage < totalPages - 2) pages.push("...");
			pages.push(totalPages);
		}
		return pages;
	};

	// Render
	return (
		<div className={cn("flex items-center justify-center gap-1", className)}>
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage <= 1}
				className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-gray-700"
			>
				<Icon name="chevronLeft" size="sm" />
			</button>

			{getPageNumbers().map((page, idx) =>
				page === "..." ? (
					<span key={`dots-${idx}`} className="px-2 text-sm text-gray-400">
						...
					</span>
				) : (
					<button
						key={page}
						onClick={() => onPageChange(page)}
						className={cn(
							"h-9 w-9 rounded-lg text-sm font-medium transition-colors",
							page === currentPage
								? "bg-primary-500 text-white shadow-sm"
								: "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
						)}
					>
						{page}
					</button>
				),
			)}

			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage >= totalPages}
				className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-gray-700"
			>
				<Icon name="chevronRight" size="sm" />
			</button>
		</div>
	);
}
