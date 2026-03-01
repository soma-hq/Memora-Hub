// Components
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { alertClasses, type AlertVariant } from "@/core/design/states";


interface AlertProps {
	variant?: AlertVariant;
	title?: string;
	children: React.ReactNode;
	className?: string;
}

const iconMap: Record<AlertVariant, "success" | "error" | "warning" | "info"> = {
	success: "success",
	error: "error",
	warning: "warning",
	info: "info",
};

/**
 * Displays a contextual alert banner with icon and optional title.
 * @param {AlertProps} props - Component props
 * @param {AlertVariant} [props.variant="info"] - Alert severity level
 * @param {string} [props.title] - Optional bold heading text
 * @param {React.ReactNode} props.children - Alert body content
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Alert banner
 */
export function Alert({ variant = "info", title, children, className }: AlertProps) {
	return (
		<div className={cn("flex gap-3 rounded-lg p-4", alertClasses[variant], className)}>
			{/* Icon */}
			<div className="mt-0.5 shrink-0">
				<Icon name={iconMap[variant]} style="solid" size="md" />
			</div>

			{/* Content */}
			<div className="flex-1">
				{title && <p className="mb-1 font-medium">{title}</p>}
				<div className="text-sm opacity-90">{children}</div>
			</div>
		</div>
	);
}
