"use client";

// React
import { Component } from "react";
import { Card, Button, Icon } from "@/components/ui";
import type { ReactNode, ErrorInfo } from "react";


interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

/**
 * Class-based error boundary that catches render errors and shows a fallback UI.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	/**
	 * Initializes error boundary state.
	 * @param {ErrorBoundaryProps} props - Component props
	 */
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	/**
	 * Updates state to capture the thrown error.
	 * @param {Error} error - The error that was thrown
	 * @returns {ErrorBoundaryState} New error state
	 */
	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	/**
	 * Logs error details to the console.
	 * @param {Error} error - The error that was thrown
	 * @param {ErrorInfo} errorInfo - React error info with component stack
	 * @returns {void}
	 */
	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error("ErrorBoundary caught:", error, errorInfo);
	}

	/**
	 * Resets the error state so the component tree can re-render.
	 * @returns {void}
	 */
	handleRetry = () => {
		this.setState({ hasError: false, error: null });
	};

	/**
	 * Renders children or the error fallback UI.
	 * @returns {ReactNode} Children or error card
	 */
	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="flex min-h-[400px] items-center justify-center p-6">
					<Card padding="lg" className="w-full max-w-md text-center">
						<div className="bg-error-100 dark:bg-error-900/20 mx-auto mb-4 w-fit rounded-full p-3">
							<Icon name="warning" size="lg" className="text-error-500" />
						</div>
						<h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
							Quelque chose s&apos;est mal passe
						</h3>
						<p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
							Une erreur inattendue s&apos;est produite lors du rendu de ce composant.
						</p>
						{this.state.error && (
							<pre className="text-error-600 dark:text-error-400 mb-4 max-h-32 overflow-auto rounded-lg bg-gray-50 p-3 text-left text-xs dark:bg-gray-800">
								{this.state.error.message}
							</pre>
						)}
						<Button onClick={this.handleRetry} size="sm">
							<Icon name="refresh" size="xs" />
							Reessayer
						</Button>
					</Card>
				</div>
			);
		}

		return this.props.children;
	}
}
