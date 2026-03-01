import { AbsenceModeValues } from "@/constants";


// Re-export from centralized constants
export type { AbsenceMode } from "@/constants";

export const ABSENCE_MODE_OPTIONS = [
	{ mode: AbsenceModeValues.None, label: "Aucun", icon: "check" as const, description: "Vous etes disponible" },
	{
		mode: AbsenceModeValues.Partial,
		label: "Partiel",
		icon: "clock" as const,
		description: "Disponibilite reduite",
	},
	{
		mode: AbsenceModeValues.Complete,
		label: "Complet",
		icon: "absence" as const,
		description: "Totalement absent",
	},
] as const;
