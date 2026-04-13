"use client";

// External
import { create } from "zustand";
import { persist } from "zustand/middleware";
import fr from "./fr";
import en from "./en";
import type { TranslationKeys } from "./fr";

export type Locale = "fr" | "en";

const translations: Record<Locale, TranslationKeys> = { fr, en };

interface LocaleState {
	locale: Locale;
	setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
	persist(
		(set) => ({
			locale: "fr",
			setLocale: (locale) => set({ locale }),
		}),
		{ name: "memora-locale" },
	),
);

// Get translation object for current locale
export function useTranslations(): TranslationKeys {
	const { locale } = useLocaleStore();
	return translations[locale];
}

// Get current locale code
export function useLocale(): Locale {
	const { locale } = useLocaleStore();
	return locale;
}

export { fr, en };

export type { TranslationKeys };
