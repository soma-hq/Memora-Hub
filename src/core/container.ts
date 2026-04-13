/**
 * core/container.ts — Point d'entrée IoC client-safe.
 *
 * Ce fichier instancie une seule fois tous les managers et services
 * qui peuvent tourner côté client (pas de Prisma).
 *
 * Règle : aucun autre fichier n'instancie un Manager ni n'importe un Service
 * directement — tout passe par `container`.
 *
 * Pour les services Prisma (UserService, AbsenceService, etc.), voir
 * core/container.server.ts (Phase 31).
 */

import { ConfigLoader } from "@/core/config/ConfigLoader";
import { AbsenceManager } from "@/managers/AbsenceManager";
import { AssistantService } from "@/services/AssistantService";
import type { AssistantResponse } from "@/services/AssistantService";
import type { AssistantContext, ActiveFlow, Suggestion } from "@/features/system/assistant/types";

// ─── Config ──────────────────────────────────────────────────────────────────

const configLoader = new ConfigLoader();

/**
 * Validated application configuration loaded from default JSON files.
 * Can be overridden per-tenant by passing a `TenantOverrides` object to `ConfigLoader.load()`.
 */
export const config = configLoader.load();

// ─── Service interfaces (injectable contracts) ────────────────────────────────

/**
 * Contract for the assistant service consumed by AssistantManager.
 * Defined here so container.ts is the single binding point.
 */
export interface IAssistantService {
	processMessage(content: string, context: AssistantContext, flow: ActiveFlow | null): Promise<AssistantResponse>;
	simulateThinking(): Promise<void>;
	getAutocompleteSuggestions(input: string, context: AssistantContext): Suggestion[];
}

// ─── Container ────────────────────────────────────────────────────────────────

export const container = {
	/** Validated config for all business domains. */
	config,

	/** Singleton managers — instantiated once with their config dependencies. */
	managers: {
		absence: new AbsenceManager(config.absences),
	},

	/**
	 * Client-safe service wrappers.
	 * The concrete class (AssistantService) is only referenced here.
	 * All callers receive the `IAssistantService` interface.
	 */
	services: {
		assistant: {
			processMessage: (
				content: string,
				context: AssistantContext,
				flow: ActiveFlow | null,
			): Promise<AssistantResponse> => AssistantService.processMessage(content, context, flow),
			simulateThinking: (): Promise<void> => AssistantService.simulateThinking(),
			getAutocompleteSuggestions: (input: string, context: AssistantContext): Suggestion[] =>
				AssistantService.getAutocompleteSuggestions(input, context),
		} satisfies IAssistantService,
	},
} as const;

export type Container = typeof container;
