// Utils & hooks
import { cn } from "@/lib/utils/cn";


interface LoaderProps {
	size?: "sm" | "md" | "lg";
	className?: string;
	text?: string;
}

const sizeMap = {
	sm: "h-4 w-4 border-2",
	md: "h-8 w-8 border-2",
	lg: "h-12 w-12 border-3",
} as const;

/**
 * Spinning loader indicator with optional text label.
 * @param {LoaderProps} props - Component props
 * @param {"sm" | "md" | "lg"} [props.size="md"] - Spinner size
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.text] - Optional loading text displayed below the spinner
 * @returns {JSX.Element} Loader spinner
 */
export function Loader({ size = "md", className, text }: LoaderProps) {
	return (
		<div className={cn("flex flex-col items-center justify-center gap-3", className)}>
			<div
				className={cn(
					"border-t-primary-500 animate-spin rounded-full border-gray-300 dark:border-gray-700",
					sizeMap[size],
				)}
				style={{ animationDuration: "0.6s" }}
			/>
			{text && <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>}
		</div>
	);
}

/**
 * Full-screen centered loader for page-level loading states.
 * @returns {JSX.Element} Full page loader
 */
export function PageLoader() {
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<Loader size="lg" text="Chargement..." />
		</div>
	);
}
