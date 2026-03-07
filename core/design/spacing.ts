/** Spacing scale tokens (in px) for consistent layout spacing */
export const SPACING = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
	"2xl": 48,
	"3xl": 64,
} as const;

export type SpacingKey = keyof typeof SPACING;

/** Convert spacing token to Tailwind-compatible class suffix */
export const spacingToTw: Record<SpacingKey, string> = {
	xs: "1",
	sm: "2",
	md: "4",
	lg: "6",
	xl: "8",
	"2xl": "12",
	"3xl": "16",
};
