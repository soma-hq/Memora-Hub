import Image from "next/image";
import { cn } from "@/lib/utils/cn";


interface AvatarProps {
	src?: string | null;
	name: string;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	className?: string;
}

const sizeMap = {
	xs: "h-6 w-6 text-[10px]",
	sm: "h-8 w-8 text-xs",
	md: "h-10 w-10 text-sm",
	lg: "h-12 w-12 text-base",
	xl: "h-16 w-16 text-lg",
} as const;

const imageSizeMap = {
	xs: 24,
	sm: 32,
	md: 40,
	lg: 48,
	xl: 64,
} as const;

/**
 * Extracts name initials.
 * @param {string} name - Display name
 * @returns {string} Uppercase initials
 */

function getInitials(name: string) {
	return name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

const bgColors = [
	"bg-primary-200 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
	"bg-info-200 text-info-700 dark:bg-info-900/30 dark:text-info-400",
	"bg-success-200 text-success-700 dark:bg-success-900/30 dark:text-success-400",
	"bg-warning-200 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400",
	"bg-error-200 text-error-700 dark:bg-error-900/30 dark:text-error-400",
];

/**
 * Name-based color picker.
 * @param {string} name - Name to hash
 * @returns {string} Color class string
 */

function hashColor(name: string) {
	let hash = 0;
	for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
	return bgColors[Math.abs(hash) % bgColors.length];
}

/**
 * User avatar.
 * @param {AvatarProps} props - Component props
 * @param {string | null} [props.src] - Image URL or null
 * @param {string} props.name - User name
 * @param {"xs" | "sm" | "md" | "lg" | "xl"} [props.size="md"] - Avatar size
 * @param {string} [props.className] - Extra CSS classes
 * @returns {JSX.Element} Avatar image or initials circle
 */

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
	if (src) {
		return (
			<Image
				src={src}
				alt={name}
				width={imageSizeMap[size]}
				height={imageSizeMap[size]}
				className={cn("shrink-0 rounded-full object-cover", sizeMap[size], className)}
			/>
		);
	}

	return (
		<div
			className={cn(
				"flex shrink-0 items-center justify-center rounded-full font-medium",
				sizeMap[size],
				hashColor(name),
				className,
			)}
			title={name}
		>
			{getInitials(name)}
		</div>
	);
}
