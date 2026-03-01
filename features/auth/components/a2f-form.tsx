"use client";

// React
import { useState, useRef, useCallback, useEffect } from "react";
import { Button, Icon } from "@/components/ui";


/** Props for the A2FForm component */
interface A2FFormProps {
	onSubmit: (code: string) => void | Promise<void>;
	isLoading?: boolean;
	onResend?: () => void | Promise<void>;
}

/**
 * Two-factor authentication code input form with 6-digit OTP
 * @param props - Component props
 * @param props.onSubmit - Callback triggered when a complete code is submitted
 * @param props.isLoading - Whether the form is in a loading state
 * @param props.onResend - Callback to resend the verification code
 * @returns A2F verification form with OTP input fields
 */
export function A2FForm({ onSubmit, isLoading = false, onResend }: A2FFormProps) {
	// State
	const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
	const [resendCooldown, setResendCooldown] = useState(0);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	useEffect(() => {
		inputRefs.current[0]?.focus();
	}, []);

	useEffect(() => {
		if (resendCooldown <= 0) return;
		const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
		return () => clearTimeout(timer);
	}, [resendCooldown]);

	// Handlers
	/**
	 * Handles digit input change and auto-focuses next field
	 * @param index - Index of the digit input field
	 * @param value - Raw input value
	 * @returns Nothing
	 */
	const handleChange = useCallback(
		(index: number, value: string) => {
			const digit = value.replace(/\D/g, "").slice(-1);
			const newDigits = [...digits];
			newDigits[index] = digit;
			setDigits(newDigits);

			if (digit && index < 5) {
				inputRefs.current[index + 1]?.focus();
			}

			if (newDigits.every((d) => d !== "")) {
				onSubmit(newDigits.join(""));
			}
		},
		[digits, onSubmit],
	);

	/**
	 * Handles backspace key to focus previous input
	 * @param index - Index of the digit input field
	 * @param e - Keyboard event
	 * @returns Nothing
	 */
	const handleKeyDown = useCallback(
		(index: number, e: React.KeyboardEvent) => {
			if (e.key === "Backspace" && !digits[index] && index > 0) {
				inputRefs.current[index - 1]?.focus();
			}
		},
		[digits],
	);

	/**
	 * Handles paste event to fill multiple digit inputs at once
	 * @param e - Clipboard paste event
	 * @returns Nothing
	 */
	const handlePaste = useCallback(
		(e: React.ClipboardEvent) => {
			e.preventDefault();
			const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
			if (!pastedData) return;

			const newDigits = [...digits];
			for (let i = 0; i < pastedData.length; i++) {
				newDigits[i] = pastedData[i];
			}
			setDigits(newDigits);

			const nextEmpty = pastedData.length < 6 ? pastedData.length : 5;
			inputRefs.current[nextEmpty]?.focus();

			if (pastedData.length === 6) {
				onSubmit(pastedData);
			}
		},
		[digits, onSubmit],
	);

	/**
	 * Triggers code resend with cooldown
	 * @returns Nothing
	 */
	const handleResend = async () => {
		if (resendCooldown > 0) return;
		setResendCooldown(60);
		onResend?.();
	};

	// Computed
	const code = digits.join("");
	const isComplete = code.length === 6;

	// Render
	return (
		<div className="w-full max-w-md">
			<div className="mb-8 text-center">
				<div className="bg-primary-100 dark:bg-primary-900/20 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
					<Icon name="shield" size="lg" className="text-primary-500" />
				</div>
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vérification en deux étapes</h1>
				<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
					Entrez le code à 6 chiffres envoyé à votre appareil.
				</p>
			</div>

			<div className="mb-6 flex justify-center gap-3" onPaste={handlePaste}>
				{digits.map((digit, index) => (
					<input
						key={index}
						ref={(el) => {
							inputRefs.current[index] = el;
						}}
						type="text"
						inputMode="numeric"
						maxLength={1}
						value={digit}
						onChange={(e) => handleChange(index, e.target.value)}
						onKeyDown={(e) => handleKeyDown(index, e)}
						className={`h-14 w-12 rounded-xl border-2 bg-white text-center text-xl font-bold text-gray-900 transition-all duration-200 focus:outline-none dark:bg-gray-800 dark:text-white ${
							digit
								? "border-primary-500 ring-primary-100 dark:ring-primary-900/30 ring-2"
								: "focus:border-primary-500 dark:focus:border-primary-500 border-gray-300 dark:border-gray-600"
						}`}
					/>
				))}
			</div>

			<Button
				type="button"
				onClick={() => onSubmit(code)}
				isLoading={isLoading}
				disabled={!isComplete}
				className="w-full"
			>
				Vérifier le code
			</Button>

			<div className="mt-6 text-center">
				<p className="text-sm text-gray-500 dark:text-gray-400">
					Vous n&apos;avez pas recu le code ?{" "}
					{resendCooldown > 0 ? (
						<span className="text-gray-400">Renvoyer dans {resendCooldown}s</span>
					) : (
						<button
							type="button"
							onClick={handleResend}
							className="text-primary-600 hover:text-primary-700 font-medium"
						>
							Renvoyer le code
						</button>
					)}
				</p>
			</div>
		</div>
	);
}
