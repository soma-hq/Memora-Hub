/**
 * Base structure class providing common patterns for service-like objects
 */
export abstract class Structure {
	/** Structure name used for logging and identification */
	readonly name: string;

	/** Whether this structure has been initialized */
	private _initialized = false;

	/**
	 * Create a new Structure
	 * @param name Unique name for this structure
	 */
	constructor(name: string) {
		this.name = name;
	}

	/**
	 * Initialize the structure (called once before first use)
	 */
	async initialize(): Promise<void> {
		if (this._initialized) return;

		await this.onInitialize();
		this._initialized = true;
	}

	/**
	 * Override this method to perform initialization logic
	 */
	protected abstract onInitialize(): Promise<void>;

	/**
	 * Tear down the structure and release resources
	 */
	async destroy(): Promise<void> {
		if (!this._initialized) return;

		await this.onDestroy();
		this._initialized = false;
	}

	/**
	 * Override this method to perform cleanup logic
	 */
	protected abstract onDestroy(): Promise<void>;

	/**
	 * Check if this structure has been initialized
	 * @returns True if initialized
	 */
	get initialized(): boolean {
		return this._initialized;
	}

	/**
	 * Ensure the structure is initialized before use
	 * @throws If the structure has not been initialized
	 */
	protected ensureInitialized(): void {
		if (!this._initialized) {
			throw new Error(`${this.name} has not been initialized. Call initialize() first.`);
		}
	}
}
