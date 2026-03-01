/**
 * App footer.
 * @returns {JSX.Element} Footer bar
 */

export function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
			<div className="flex flex-col items-center justify-between gap-2 text-sm text-gray-400 sm:flex-row">
				<p>&copy; {year} Memora Hub. Tous droits reserves.</p>
				<p className="text-xs">v1.0.0</p>
			</div>
		</footer>
	);
}
