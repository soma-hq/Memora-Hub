// Next.js
import { redirect } from "next/navigation";


/**
 * Root page that redirects to the default hub dashboard.
 * @returns Never renders, redirects immediately
 */
export default function RootPage() {
	redirect("/hub/default");
}
