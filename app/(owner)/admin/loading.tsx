"use client";

/**
 * Loading spinner displayed while admin page content is being fetched.
 * @returns A centered loading bar with shimmer animation
 */
export default function AdminLoading() {
	return (
		<div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-6">
			{/* Red loading bar */}
			<div className="relative h-1 w-64 overflow-hidden rounded-full bg-red-100 dark:bg-red-900/20">
				<div className="absolute inset-y-0 left-0 w-1/3 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-red-400 via-red-500 to-red-400" />
			</div>
			<p className="text-sm text-red-500 dark:text-red-400">Chargement de l&apos;interface Admin...</p>

			{/* Shimmer keyframes */}
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
