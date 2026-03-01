import { Avatar } from "./avatar";
import { cn } from "@/lib/utils/cn";


interface AvatarGroupProps {
	users: { name: string; src?: string | null }[];
	max?: number;
	size?: "xs" | "sm" | "md";
	className?: string;
}

const overlapMap = {
	xs: "-ml-1.5",
	sm: "-ml-2",
	md: "-ml-2.5",
} as const;

/**
 * Overlapping avatar group.
 * @param {AvatarGroupProps} props - Component props
 * @param {AvatarGroupProps["users"]} props.users - User list
 * @param {number} [props.max=4] - Max visible avatars
 * @param {"xs" | "sm" | "md"} [props.size="sm"] - Avatar size
 * @param {string} [props.className] - Extra CSS classes
 * @returns {JSX.Element} Grouped avatar stack
 */

export function AvatarGroup({ users, max = 4, size = "sm", className }: AvatarGroupProps) {
	// Computed
	const visible = users.slice(0, max);
	const overflow = users.length - max;

	// Render
	return (
		<div className={cn("flex items-center", className)}>
			{visible.map((user, idx) => (
				<div
					key={idx}
					className={cn("rounded-full ring-2 ring-white dark:ring-gray-800", idx > 0 && overlapMap[size])}
				>
					<Avatar src={user.src} name={user.name} size={size} />
				</div>
			))}
			{overflow > 0 && (
				<div
					className={cn(
						"flex items-center justify-center rounded-full bg-gray-200 font-medium text-gray-600 ring-2 ring-white dark:bg-gray-700 dark:text-gray-300 dark:ring-gray-800",
						overlapMap[size],
						size === "xs"
							? "h-6 w-6 text-[9px]"
							: size === "sm"
								? "h-8 w-8 text-[10px]"
								: "h-10 w-10 text-xs",
					)}
				>
					+{overflow}
				</div>
			)}
		</div>
	);
}
