"use client";

// Utils & hooks
import { cn } from "@/lib/utils/cn";


interface ToggleProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	label?: string;
	description?: string;
	disabled?: boolean;
	size?: "sm" | "md";
}

const sizeStyles = {
	sm: { track: "h-5 w-9", thumb: "h-4 w-4", translate: "translate-x-4" },
	md: { track: "h-6 w-11", thumb: "h-5 w-5", translate: "translate-x-5" },
} as const;

/**
 * Toggle switch with optional label and description.
 * @param {ToggleProps} props - Component props
 * @param {boolean} props.checked - Whether the toggle is on
 * @param {(checked: boolean) => void} props.onChange - Callback when state changes
 * @param {string} [props.label] - Label text beside the toggle
 * @param {string} [props.description] - Description text below the label
 * @param {boolean} [props.disabled] - Disable interaction
 * @param {"sm" | "md"} [props.size="md"] - Toggle size
 * @returns {JSX.Element} Toggle switch element
 */
export function Toggle({ checked, onChange, label, description, disabled, size = "md" }: ToggleProps) {
	const { track, thumb, translate } = sizeStyles[size];

	return (
		<div className="flex items-start gap-3">
			<button
				type="button"
				role="switch"
				aria-checked={checked}
				disabled={disabled}
				onClick={() => onChange(!checked)}
				className={cn(
					"relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200",
					track,
					checked ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600",
					disabled && "cursor-not-allowed opacity-50",
				)}
			>
				<span
					className={cn(
						"absolute top-0.5 left-0.5 rounded-full bg-white shadow transition-transform duration-200",
						thumb,
						checked && translate,
					)}
				/>
			</button>
			{(label || description) && (
				<div className="flex flex-col">
					{label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
					{description && <span className="text-xs text-gray-400">{description}</span>}
				</div>
			)}
		</div>
	);
}
