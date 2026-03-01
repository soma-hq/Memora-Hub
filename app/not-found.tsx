// Next.js
import Link from "next/link";
import { Icon, Button } from "@/components/ui";


/**
 * Custom 404 page displayed when a route is not found.
 * @returns A centered error page with navigation links
 */
export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 dark:bg-gray-900">
			<div className="max-w-md text-center">
				<div className="mb-6 flex justify-center">
					<div className="bg-primary-100 dark:bg-primary-900/20 rounded-2xl p-5">
						<Icon name="search" size="xl" className="text-primary-500" />
					</div>
				</div>
				<h1 className="mb-2 font-serif text-7xl font-bold text-gray-900 dark:text-white">404</h1>
				<h2 className="mb-3 text-xl font-semibold text-gray-700 dark:text-gray-300">Page introuvable</h2>
				<p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
					La page que vous recherchez n&apos;existe pas ou a ete deplacee.
				</p>
				<div className="flex items-center justify-center gap-3">
					<Link href="/hub/default">
						<Button>
							<Icon name="home" size="sm" />
							Retour au dashboard
						</Button>
					</Link>
					<Link href="/hub/default">
						<Button variant="outline-neutral">
							<Icon name="back" size="sm" />
							Page precedente
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
