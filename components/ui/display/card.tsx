import { cn } from "@/lib/utils/cn";
import { themeClasses } from "@/core/design/themes";


interface CardProps {
	children: React.ReactNode;
	className?: string;
	hover?: boolean;
	padding?: "sm" | "md" | "lg";
	onClick?: () => void;
}

const paddingMap = {
	sm: "p-3",
	md: "p-4",
	lg: "p-6",
} as const;

/**
 * Card container.
 * @param {CardProps} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.className] - Extra CSS classes
 * @param {boolean} [props.hover=false] - Enable hover elevation
 * @param {"sm" | "md" | "lg"} [props.padding="md"] - Inner padding size
 * @param {() => void} [props.onClick] - Click handler
 * @returns {JSX.Element} Card wrapper
 */

export function Card({ children, className, hover = false, padding = "md", onClick }: CardProps) {
	return (
		<div
			className={cn(
				"rounded-xl shadow-sm",
				themeClasses.card,
				paddingMap[padding],
				hover && "cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
				onClick && "cursor-pointer",
				className,
			)}
			onClick={onClick}
		>
			{children}
		</div>
	);
}

/**
 * Card header.
 * @param {{ children: React.ReactNode; className?: string }} props - Component props
 * @param {React.ReactNode} props.children - Header content
 * @param {string} [props.className] - Extra CSS classes
 * @returns {JSX.Element} Card header
 */

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<div
			className={cn(
				"flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700",
				className,
			)}
		>
			{children}
		</div>
	);
}

/**
 * Card body.
 * @param {{ children: React.ReactNode; className?: string }} props - Component props
 * @param {React.ReactNode} props.children - Body content
 * @param {string} [props.className] - Extra CSS classes
 * @returns {JSX.Element} Card body
 */

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
	return <div className={cn("py-4", className)}>{children}</div>;
}

/**
 * Card footer.
 * @param {{ children: React.ReactNode; className?: string }} props - Component props
 * @param {React.ReactNode} props.children - Footer content
 * @param {string} [props.className] - Extra CSS classes
 * @returns {JSX.Element} Card footer
 */

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<div
			className={cn(
				"flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700",
				className,
			)}
		>
			{children}
		</div>
	);
}
