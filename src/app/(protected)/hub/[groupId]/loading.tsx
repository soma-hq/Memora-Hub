"use client";

/**
 * Loading state displayed while hub page content is being fetched
 * @returns A centered loading bar with shimmer animation
 */
export default function HubLoading() {
	return (
		<div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-6">
			<div className="bg-primary-100 dark:bg-primary-900/20 relative h-1 w-64 overflow-hidden rounded-full">
				<div className="from-primary-400 via-primary-500 to-primary-400 absolute inset-y-0 left-0 w-1/3 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r" />
			</div>
			<p className="text-primary-500 dark:text-primary-400 text-sm">Chargement...</p>

			<style jsx>{`
				@keyframes shimmer {
					0% {
						transform: translateX(-100%);
					}
					100% {
						transform: translateX(400%);
					}
				}
			`}</style>
		</div>
	);
}
