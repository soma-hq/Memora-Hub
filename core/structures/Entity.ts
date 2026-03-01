/**
 * Base entity class for all domain models
 * @template T The shape of the entity data
 */
export abstract class Entity<T extends Record<string, unknown> = Record<string, unknown>> {
	/** Unique identifier */
	readonly id: string;

	/** Creation timestamp */
	readonly createdAt: Date;

	/** Last update timestamp */
	updatedAt: Date;

	/** Raw entity data */
	protected data: T;

	/**
	 * Create a new Entity instance
	 * @param id Unique identifier
	 * @param data Entity data payload
	 * @param createdAt Optional creation date
	 */
	constructor(id: string, data: T, createdAt?: Date) {
		this.id = id;
		this.data = data;
		this.createdAt = createdAt ?? new Date();
		this.updatedAt = this.createdAt;
	}

	/**
	 * Get the entity data as a plain object
	 * @returns Serialized entity data with metadata
	 */
	toJSON(): T & { id: string; createdAt: string; updatedAt: string } {
		return {
			...this.data,
			id: this.id,
			createdAt: this.createdAt.toISOString(),
			updatedAt: this.updatedAt.toISOString(),
		};
	}

	/**
	 * Update entity fields and refresh the updatedAt timestamp
	 * @param fields Partial fields to merge into entity data
	 */
	update(fields: Partial<T>): void {
		this.data = { ...this.data, ...fields };
		this.updatedAt = new Date();
	}

	/**
	 * Get a specific field value from the entity data
	 * @param key Field name to retrieve
	 * @returns The value of the requested field
	 */
	get<K extends keyof T>(key: K): T[K] {
		return this.data[key];
	}

	/**
	 * Check if this entity is the same as another by ID
	 * @param other Entity to compare against
	 * @returns True if both entities share the same ID
	 */
	equals(other: Entity): boolean {
		return this.id === other.id;
	}
}
