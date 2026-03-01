"use client";

// React
import { useState, useRef, useEffect, useCallback } from "react";
import { Icon } from "../display/icon";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";


export interface SelectMenuOption {
	label: string;
	value: string;
	icon?: IconName;
}

interface SelectMenuProps {
	options: SelectMenuOption[];
	value: string | string[];
	onChange: (value: string | string[]) => void;
	multiple?: boolean;
	placeholder?: string;
	triggerIcon?: IconName;
	className?: string;
}

/**
 * Custom dropdown select with icon, label, and check-circle pattern supporting single and multi-select.
 * @param {SelectMenuProps} props - Component props
 * @param {SelectMenuOption[]} props.options - Available options
 * @param {string | string[]} props.value - Currently selected value(s)
 * @param {(value: string | string[]) => void} props.onChange - Callback when selection changes
 * @param {boolean} [props.multiple=false] - Enable multi-select mode
 * @param {string} [props.placeholder="Selectionner..."] - Placeholder text
 * @param {IconName} [props.triggerIcon] - Icon shown on the trigger button
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Custom select menu
 */
export function SelectMenu({
	options,
	value,
	onChange,
	multiple = false,
	placeholder = "Sélectionner...",
	triggerIcon,
	className,
}: SelectMenuProps) {
	// State
	const [open, setOpen] = useState(false);
	const [focusIndex, setFocusIndex] = useState(-1);
	const containerRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLDivElement>(null);

	/**
	 * Checks whether an option is currently selected.
	 * @param {string} optionValue - Option value to check
	 * @returns {boolean} True if selected
	 */
	const isSelected = useCallback(
		(optionValue: string): boolean => {
			if (multiple) {
				return Array.isArray(value) && value.includes(optionValue);
			}
			return value === optionValue;
		},
		[value, multiple],
	);

	// Handlers
	/**
	 * Toggles the selected state of an option.
	 * @param {string} optionValue - Option value to toggle
	 * @returns {void}
	 */
	const handleSelect = useCallback(
		(optionValue: string) => {
			if (multiple) {
				const currentArr = Array.isArray(value) ? value : [];
				const newValue = currentArr.includes(optionValue)
					? currentArr.filter((v) => v !== optionValue)
					: [...currentArr, optionValue];
				onChange(newValue);
			} else {
				onChange(optionValue);
				setOpen(false);
			}
		},
		[value, multiple, onChange],
	);

	/**
	 * Computes the display label for the trigger button.
	 * @returns {string} Trigger label text
	 */
	const triggerLabel = useCallback((): string => {
		if (multiple && Array.isArray(value) && value.length > 0) {
			if (value.length === 1) {
				return options.find((o) => o.value === value[0])?.label ?? placeholder;
			}
			return `${value.length} sélectionnés`;
		}
		if (!multiple && typeof value === "string" && value) {
			return options.find((o) => o.value === value)?.label ?? placeholder;
		}
		return placeholder;
	}, [value, multiple, options, placeholder]);

	// Close on click outside
	useEffect(() => {
		if (!open) return;

		/**
		 * Closes the menu on outside click.
		 * @param {MouseEvent} e - Mouse event
		 * @returns {void}
		 */
		const handleClickOutside = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [open]);

	// Keyboard navigation
	useEffect(() => {
		if (!open) return;

		/**
		 * Navigates options with arrow keys and selects with Enter.
		 * @param {KeyboardEvent} e - Keyboard event
		 * @returns {void}
		 */
		const handleKeyDown = (e: KeyboardEvent) => {
			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					setFocusIndex((prev) => Math.min(prev + 1, options.length - 1));
					break;
				case "ArrowUp":
					e.preventDefault();
					setFocusIndex((prev) => Math.max(prev - 1, 0));
					break;
				case "Enter":
					e.preventDefault();
					if (focusIndex >= 0 && focusIndex < options.length) {
						handleSelect(options[focusIndex].value);
					}
					break;
				case "Escape":
					e.preventDefault();
					setOpen(false);
					break;
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [open, focusIndex, options, handleSelect]);

	// Scroll focused item into view
	useEffect(() => {
		if (focusIndex >= 0 && listRef.current) {
			const items = listRef.current.querySelectorAll("[data-option]");
			items[focusIndex]?.scrollIntoView({ block: "nearest" });
		}
	}, [focusIndex]);

	// Reset focus when opening
	useEffect(() => {
		if (open) setFocusIndex(-1);
	}, [open]);

	// Computed
	const hasSelection = multiple
		? Array.isArray(value) && value.length > 0
		: typeof value === "string" && value !== "" && value !== "all";

	// Render
	return (
		<div ref={containerRef} className={cn("relative", className)}>
			{/* Trigger */}
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className={cn(
					"flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-200",
					"hover:border-primary-300 focus:border-primary-500 focus:ring-primary-100 focus:ring-2 focus:outline-none",
					"dark:hover:border-primary-600 dark:focus:border-primary-500",
					hasSelection
						? "border-primary-300 bg-primary-50/50 dark:border-primary-700 dark:bg-primary-900/10 text-gray-900 dark:text-white"
						: "border-gray-300 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300",
				)}
			>
				{triggerIcon && <Icon name={triggerIcon} size="sm" className="shrink-0 text-gray-400" />}
				<span className="flex-1 truncate text-left">{triggerLabel()}</span>
				<Icon
					name="chevronDown"
					size="xs"
					className={cn("shrink-0 text-gray-400 transition-transform duration-200", open && "rotate-180")}
				/>
			</button>

			{/* Dropdown */}
			{open && (
				<div
					ref={listRef}
					className={cn(
						"absolute right-0 z-50 mt-1 w-full min-w-[200px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg",
						"animate-scale-in",
						"dark:border-gray-700 dark:bg-gray-800",
					)}
				>
					<div className="max-h-60 overflow-y-auto p-1">
						{options.map((option, index) => {
							const selected = isSelected(option.value);
							const focused = index === focusIndex;

							return (
								<button
									key={option.value}
									type="button"
									data-option
									onClick={() => handleSelect(option.value)}
									className={cn(
										"flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-100",
										focused && "bg-gray-100 dark:bg-gray-700",
										selected && !focused && "bg-primary-50/50 dark:bg-primary-900/10",
										!focused && !selected && "hover:bg-gray-50 dark:hover:bg-gray-700/50",
									)}
								>
									{/* Left icon */}
									<div
										className={cn(
											"flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
											selected
												? "bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
												: "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500",
										)}
									>
										{option.icon ? (
											<Icon name={option.icon} size="xs" />
										) : (
											<span className="text-xs font-medium">{option.label.charAt(0)}</span>
										)}
									</div>

									{/* Label */}
									<span
										className={cn(
											"flex-1 text-left",
											selected
												? "font-medium text-gray-900 dark:text-white"
												: "text-gray-600 dark:text-gray-300",
										)}
									>
										{option.label}
									</span>

									{/* Check circle */}
									<div className="shrink-0">
										{selected ? (
											<div className="bg-primary-500 flex h-5 w-5 items-center justify-center rounded-full">
												<Icon name="check" size="xs" className="text-white" />
											</div>
										) : (
											<div className="h-5 w-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
										)}
									</div>
								</button>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
