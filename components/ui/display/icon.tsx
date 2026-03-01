import { cn } from "@/lib/utils/cn";
import { getIcon, type IconName, type IconStyle } from "@/core/design/icons";


interface IconProps {
	name: IconName;
	style?: IconStyle;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	className?: string;
}

const sizeMap = {
	xs: "h-3.5 w-3.5",
	sm: "h-4 w-4",
	md: "h-5 w-5",
	lg: "h-6 w-6",
	xl: "h-8 w-8",
} as const;

/**
 * Design system icon.
 * @param {IconProps} props - Component props
 * @param {IconName} props.name - Icon registry name
 * @param {IconStyle} [props.style="outline"] - Outline or solid variant
 * @param {"xs" | "sm" | "md" | "lg" | "xl"} [props.size="md"] - Icon size
 * @param {string} [props.className] - Extra CSS classes
 * @returns {JSX.Element} SVG icon element
 */

export function Icon({ name, style = "outline", size = "md", className }: IconProps) {
	const IconComponent = getIcon(name, style);
	return <IconComponent className={cn(sizeMap[size], className)} />;
}
