// Next.js
import { redirect } from "next/navigation";
import { definePageConfig } from "@/core/structures";

const PAGE_CONFIG = definePageConfig({
	name: "home",
	section: "public",
	description: "Page d'accueil de Memora Hub.",
});

/**
 * Root page
 * @returns Never renders
 */
export default function RootPage() {
	redirect("/hub");
}
