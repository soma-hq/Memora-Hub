import type { DetectedIntent, IntentCategory, IntentAction } from "./types";
import { INTENT_KEYWORDS } from "./constants";


/** Match result from scanning a single keyword entry */
interface KeywordMatch {
	category: string;
	action: string;
	weight: number;
	matchLength: number;
}

/**
 * Normalize input for matching
 * @param input Raw user input
 * @returns Normalized lowercase string
 */

function normalizeInput(input: string): string {
	return input
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/['']/g, "'")
		.replace(/[^\w\s'-]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

/**
 * Extract entities from input
 * @param input Normalized user input
 * @param category Detected intent category
 * @param action Detected intent action
 * @returns Extracted entity map
 */

function extractEntities(input: string, category: string, action: string): Record<string, string> {
	const entities: Record<string, string> = {};

	// Extract dates (YYYY-MM-DD format)
	const dateMatch = input.match(/(\d{4}-\d{2}-\d{2})/g);
	if (dateMatch) {
		entities.date = dateMatch[0];
		if (dateMatch.length > 1) {
			entities.endDate = dateMatch[1];
		}
	}

	// Extract time (HH:MM format)
	const timeMatch = input.match(/(\d{1,2}[h:]\d{2})/);
	if (timeMatch) {
		entities.time = timeMatch[1].replace("h", ":");
	}

	// Extract quoted strings as the primary entity
	const quotedMatch = input.match(/"([^"]+)"|«([^»]+)»|'([^']+)'/);
	if (quotedMatch) {
		entities.name = quotedMatch[1] || quotedMatch[2] || quotedMatch[3];
	}

	// Extract search queries
	if (category === "search") {
		const searchPatterns = [
			/(?:rechercher|chercher|trouver|ou est|ou se trouve)\s+(.+)/i,
			/(?:search|find)\s+(.+)/i,
		];
		for (const pattern of searchPatterns) {
			const match = input.match(pattern);
			if (match) {
				entities.query = match[1].trim();
				break;
			}
		}
	}

	// Extract navigation target
	if (category === "navigation" || action === "navigate_to") {
		const navPatterns = [
			/(?:aller (?:a|vers|sur)|emmene[- ]moi (?:vers|a|sur)|naviguer vers|ouvrir(?: la page)?|va sur|montre[- ]moi)\s+(?:la page |le |la |les |l')?(.+)/i,
			/(?:go to|navigate to|open)\s+(.+)/i,
		];
		for (const pattern of navPatterns) {
			const match = input.match(pattern);
			if (match) {
				entities.target = match[1].trim();
				break;
			}
		}
	}

	// Extract assignee names
	if (action === "assign_task" || action === "create_task") {
		const assignPatterns = [/(?:assigner? (?:a|pour))\s+(.+)/i, /(?:pour|a)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/];
		for (const pattern of assignPatterns) {
			const match = input.match(pattern);
			if (match) {
				entities.assignee = match[1].trim();
				break;
			}
		}
	}

	// Extract priority mentions
	const priorityMap: Record<string, string> = {
		haute: "Haute",
		urgente: "Haute",
		important: "Haute",
		moyenne: "Moyenne",
		basse: "Basse",
		faible: "Basse",
	};
	for (const [keyword, priority] of Object.entries(priorityMap)) {
		if (input.includes(keyword)) {
			entities.priority = priority;
			break;
		}
	}

	// Extract status mentions
	const statusMap: Record<string, string> = {
		"a faire": "A faire",
		"en cours": "En cours",
		termine: "Termine",
		fait: "Termine",
		fini: "Termine",
	};
	for (const [keyword, status] of Object.entries(statusMap)) {
		if (input.includes(keyword)) {
			entities.status = status;
			break;
		}
	}

	// Extract absence type
	if (category === "absence") {
		const absenceTypeMap: Record<string, string> = {
			"conge paye": "conge_paye",
			rtt: "rtt",
			maladie: "maladie",
			vacances: "conge_paye",
		};
		for (const [keyword, type] of Object.entries(absenceTypeMap)) {
			if (input.includes(keyword)) {
				entities.absenceType = type;
				break;
			}
		}
	}

	// Extract meeting type
	if (category === "meeting") {
		const meetingTypeMap: Record<string, string> = {
			standup: "standup",
			retrospective: "retrospective",
			revue: "revue",
			entretien: "entretien",
		};
		for (const [keyword, type] of Object.entries(meetingTypeMap)) {
			if (input.includes(keyword)) {
				entities.meetingType = type;
				break;
			}
		}
	}

	// Extract export format
	if (category === "export") {
		if (input.includes("pdf")) entities.format = "pdf";
		else if (input.includes("excel")) entities.format = "excel";
		else if (input.includes("csv")) entities.format = "csv";
	}

	// Extract theme preference
	if (action === "change_theme") {
		if (input.includes("sombre") || input.includes("dark")) entities.theme = "dark";
		else if (input.includes("clair") || input.includes("light")) entities.theme = "light";
		else if (input.includes("systeme") || input.includes("system")) entities.theme = "system";
	}

	return entities;
}

/**
 * Find keyword matches in input
 * @param normalized Normalized user input
 * @returns Sorted keyword matches
 */

function findKeywordMatches(normalized: string): KeywordMatch[] {
	const matches: KeywordMatch[] = [];

	// Check each keyword group against the input
	for (const [keyword, intents] of Object.entries(INTENT_KEYWORDS)) {
		const normalizedKeyword = normalizeInput(keyword);

		if (normalized.includes(normalizedKeyword)) {
			for (const intent of intents) {
				matches.push({
					category: intent.category,
					action: intent.action,
					weight: intent.weight,
					matchLength: normalizedKeyword.length,
				});
			}
		}
	}

	// Sort by weight (highest first), then by match length (longest first)
	return matches.sort((a, b) => {
		if (b.weight !== a.weight) return b.weight - a.weight;
		return b.matchLength - a.matchLength;
	});
}

/**
 * Detect action verbs in input
 * @param input Normalized user input
 * @returns Detected verb set
 */

function detectActionVerbs(input: string): Set<string> {
	const verbs = new Set<string>();

	const verbMap: Record<string, string[]> = {
		create: ["creer", "ajouter", "nouveau", "nouvelle", "planifier", "organiser", "demander", "poser", "publier"],
		update: ["modifier", "changer", "mettre a jour", "editer", "corriger"],
		delete: ["supprimer", "retirer", "enlever", "annuler"],
		list: ["lister", "voir", "afficher", "montrer", "mes", "liste", "prochaines", "prochains"],
		complete: ["terminer", "finir", "completer", "valider", "marquer"],
		navigate: ["aller", "naviguer", "emmene", "ouvrir", "va"],
		search: ["rechercher", "chercher", "trouver", "ou"],
		assign: ["assigner", "attribuer", "deleguer"],
		approve: ["approuver", "accepter", "valider"],
		reject: ["refuser", "rejeter", "decliner"],
	};

	for (const [verb, keywords] of Object.entries(verbMap)) {
		for (const keyword of keywords) {
			if (input.includes(keyword)) {
				verbs.add(verb);
				break;
			}
		}
	}

	return verbs;
}

/**
 * Refine action using verbs
 * @param matches Keyword matches found
 * @param verbs Detected action verbs
 * @param category Intent category
 * @returns Refined action string
 */

function refineAction(matches: KeywordMatch[], verbs: Set<string>, category: string): string {
	if (matches.length === 0) return "unknown";

	const topMatch = matches[0];
	let action = topMatch.action;

	// Use verb detection to refine the action
	if (category === "task") {
		if (verbs.has("create")) action = "create_task";
		else if (verbs.has("update")) action = "update_task";
		else if (verbs.has("delete")) action = "delete_task";
		else if (verbs.has("complete")) action = "complete_task";
		else if (verbs.has("assign")) action = "assign_task";
		else if (verbs.has("list")) action = "list_tasks";
	} else if (category === "project") {
		if (verbs.has("create")) action = "create_project";
		else if (verbs.has("update")) action = "update_project";
		else if (verbs.has("delete")) action = "delete_project";
		else if (verbs.has("list")) action = "list_projects";
	} else if (category === "meeting") {
		if (verbs.has("create")) action = "create_meeting";
		else if (verbs.has("delete")) action = "cancel_meeting";
		else if (verbs.has("list")) action = "list_meetings";
	} else if (category === "absence") {
		if (verbs.has("create")) action = "request_absence";
		else if (verbs.has("approve")) action = "approve_absence";
		else if (verbs.has("reject")) action = "reject_absence";
		else if (verbs.has("list")) action = "list_absences";
	}

	return action;
}

/**
 * Detect intent from user input
 * @param rawInput Raw user message
 * @returns Detected intent object
 */

export function detectIntent(rawInput: string): DetectedIntent {
	// Normalize the input
	const normalized = normalizeInput(rawInput);

	// Short circuit for empty input
	if (!normalized || normalized.length < 2) {
		return {
			category: "unknown",
			action: "unknown",
			confidence: 0,
			entities: {},
			rawQuery: rawInput,
		};
	}

	// Find keyword matches
	const matches = findKeywordMatches(normalized);

	// No matches found
	if (matches.length === 0) {
		return {
			category: "unknown",
			action: "unknown",
			confidence: 0.1,
			entities: {},
			rawQuery: rawInput,
		};
	}

	// Get top match and determine category
	const topMatch = matches[0];
	const category = topMatch.category as IntentCategory;

	// Detect verbs for action refinement
	const verbs = detectActionVerbs(normalized);

	// Refine the action based on verbs
	const action = refineAction(matches, verbs, category) as IntentAction;

	// Calculate confidence score based on match quality
	let confidence = topMatch.weight;

	// Boost confidence if multiple matches agree on category
	const agreeingMatches = matches.filter((m) => m.category === category);
	if (agreeingMatches.length > 1) {
		confidence = Math.min(confidence + 0.1, 1.0);
	}

	// Boost if verb aligns with action
	if (verbs.size > 0) {
		confidence = Math.min(confidence + 0.05, 1.0);
	}

	// Extract entities from input
	const entities = extractEntities(rawInput, category, action);

	return {
		category,
		action,
		confidence,
		entities,
		rawQuery: rawInput,
	};
}

/**
 * Check if action needs guided flow
 * @param action Intent action to check
 * @returns True if flow needed
 */

export function requiresFlow(action: IntentAction): boolean {
	const flowActions: IntentAction[] = [
		"create_task",
		"create_project",
		"create_meeting",
		"request_absence",
		"create_job_offer",
		"create_training",
	];
	return flowActions.includes(action);
}

/**
 * Check if action needs navigation
 * @param action Intent action to check
 * @returns True if navigation needed
 */

export function requiresNavigation(action: IntentAction): boolean {
	return action === "navigate_to" || action === "show_stats";
}
