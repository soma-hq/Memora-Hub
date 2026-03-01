import { Structure } from "@/core/structures/Structure";


type ConfigCategory = "database" | "encryption" | "global" | "mails" | "redis" | "storage" | "uptime";
type Environment = "development" | "production";

// Centralized Managers and Cached
export class ConfigurationManager extends Structure {
	private static _instance: ConfigurationManager;
	private cache: Map<string, Record<string, unknown>> = new Map();
	private environment: Environment;

	// Initialize the manager
	private constructor() {
		super("ConfigurationManager");
		this.environment = (process.env.NODE_ENV as Environment) || "development";
	}

	/**
	 * Get the singleton instance
	 * @returns The ConfigurationManager singleton
	 */

	static getInstance(): ConfigurationManager {
		if (!ConfigurationManager._instance) {
			ConfigurationManager._instance = new ConfigurationManager();
		}
		return ConfigurationManager._instance;
	}

	// Preload all configuration categories
	protected async onInitialize(): Promise<void> {
		const categories: ConfigCategory[] = [
			"database",
			"encryption",
			"global",
			"mails",
			"redis",
			"storage",
			"uptime",
		];

		// Load each configuration category sequentially
		for (const category of categories) {
			await this.loadConfig(category);
		}
	}

	protected async onDestroy(): Promise<void> {
		this.cache.clear();
	}

	/**
	 * Load a config category with cache and fallback
	 * @param category Config category to load
	 * @returns Resolved configuration object
	 */

	private async loadConfig(category: ConfigCategory): Promise<Record<string, unknown>> {
		// Return cached config if available
		const cacheKey = `${category}.${this.environment}`;
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey)!;
		}

		let config: Record<string, unknown>;

		try {
			// Attempt to load environment-specific config
			config = await this.importConfig(category, this.environment);
		} catch {
			try {
				// Fall back to default config
				config = await this.importDefault(category);
			} catch {
				// Use empty config as last resort
				config = {};
			}
		}

		// Store in cache for subsequent access
		this.cache.set(cacheKey, config);

		return config;
	}

	/**
	 * Import an environment-specific config file
	 * @param category Config category
	 * @param env Target environment
	 * @returns Parsed configuration object
	 * @throws When no config exists for the category and environment
	 */

	private async importConfig(category: ConfigCategory, env: Environment): Promise<Record<string, unknown>> {
		const configs: Record<string, Record<string, () => Promise<{ default: Record<string, unknown> }>>> = {
			development: {
				database: () => import("@/core/configurations/development/database.development.json"),
				encryption: () => import("@/core/configurations/development/encryption.development.json"),
				global: () => import("@/core/configurations/development/global.development.json"),
				mails: () => import("@/core/configurations/development/mails.development.json"),
				redis: () => import("@/core/configurations/development/redis.development.json"),
				storage: () => import("@/core/configurations/development/storage.development.json"),
				uptime: () => import("@/core/configurations/development/uptime.development.json"),
			},
			production: {
				database: () => import("@/core/configurations/production/database.production.json"),
				encryption: () => import("@/core/configurations/production/encryption.production.json"),
				global: () => import("@/core/configurations/production/global.production.json"),
				mails: () => import("@/core/configurations/production/mails.production.json"),
				redis: () => import("@/core/configurations/production/redis.production.json"),
				storage: () => import("@/core/configurations/production/storage.production.json"),
				uptime: () => import("@/core/configurations/production/uptime.production.json"),
			},
		};

		// Resolve the loader for the requested category and environment
		const loader = configs[env]?.[category];
		if (!loader) throw new Error(`No config found for ${category}.${env}`);

		// Execute dynamic import and extract default export
		const module = await loader();
		return module.default;
	}

	/**
	 * Import a default fallback config file
	 * @param category Config category
	 * @returns Parsed default configuration object
	 * @throws When the dynamic import fails
	 */

	private async importDefault(category: ConfigCategory): Promise<Record<string, unknown>> {
		const defaults: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
			database: () => import("@/core/configurations/default/auth.default.json"),
			mails: () => import("@/core/configurations/default/notifications.default.json"),
			storage: () => import("@/core/configurations/default/export.default.json"),
		};

		// Return empty config if no default exists for this category
		const loader = defaults[category];
		if (!loader) return {};

		// Execute dynamic import and extract default export
		const module = await loader();
		return module.default;
	}

	/**
	 * Get a single config value
	 * @param category Config category
	 * @param key Key within the category
	 * @returns Config value or undefined
	 */

	async get<T = unknown>(category: ConfigCategory, key: string): Promise<T | undefined> {
		const config = await this.loadConfig(category);
		return config[key] as T | undefined;
	}

	/**
	 * Get all settings for a category
	 * @param category Config category
	 * @returns Full configuration object
	 */

	async getAll(category: ConfigCategory): Promise<Record<string, unknown>> {
		return this.loadConfig(category);
	}

	/**
	 * Get current runtime environment
	 * @returns Active environment identifier
	 */

	getEnvironment(): Environment {
		return this.environment;
	}

	/**
	 * Check if development mode
	 * @returns True if development
	 */

	isDevelopment(): boolean {
		return this.environment === "development";
	}

	/**
	 * Check if production mode
	 * @returns True if production
	 */

	isProduction(): boolean {
		return this.environment === "production";
	}

	/**
	 * Clear the config cache
	 */

	invalidateCache(): void {
		this.cache.clear();
	}
}
