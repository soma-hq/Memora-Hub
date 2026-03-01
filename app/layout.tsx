// Next.js
import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, DM_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/providers/toast-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";


// Fonts
const dmSans = DM_Sans({
	variable: "--font-dm-sans",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

const dmSerif = DM_Serif_Display({
	variable: "--font-dm-serif",
	subsets: ["latin"],
	weight: "400",
});

const dmMono = DM_Mono({
	variable: "--font-dm-mono",
	subsets: ["latin"],
	weight: ["300", "400", "500"],
});

// Metadata
export const metadata: Metadata = {
	title: "Memora Hub",
	description: "Plateforme de gestion multi-entités",
};

/**
 * Root layout wrapping all pages with fonts, theme and toast providers.
 * @param props - Component props
 * @param props.children - Nested page content
 * @returns The root HTML layout
 */
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr" suppressHydrationWarning>
			<body
				className={`${dmSans.variable} ${dmSerif.variable} ${dmMono.variable} bg-gray-50 font-sans text-gray-700 antialiased dark:bg-gray-900 dark:text-gray-300`}
			>
				<ThemeProvider>
					<ToastProvider />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
