interface QueueItem<T> {
	data: T;
	priority: number;
	addedAt: Date;
}

/**
 * Generic priority queue for async job processing
 * @template T The type of items in the queue
 */
export class Queue<T = unknown> {
	/** Internal item storage */
	private items: QueueItem<T>[] = [];

	/** Whether the queue is currently being processed */
	private processing = false;

	/** Maximum concurrent items to process */
	private concurrency: number;

	/** Handler function for processing each item */
	private handler: ((item: T) => Promise<void>) | null = null;

	/** Error handler function */
	private errorHandler: ((error: Error, item: T) => void) | null = null;

	/**
	 * Create a new Queue instance
	 * @param concurrency Maximum number of items to process concurrently
	 */
	constructor(concurrency = 1) {
		this.concurrency = concurrency;
	}

	/**
	 * Set the handler function for processing items
	 * @param fn Async function to process each item
	 * @returns This queue instance for chaining
	 */
	process(fn: (item: T) => Promise<void>): Queue<T> {
		this.handler = fn;
		return this;
	}

	/**
	 * Set the error handler function
	 * @param fn Function to handle processing errors
	 * @returns This queue instance for chaining
	 */
	onError(fn: (error: Error, item: T) => void): Queue<T> {
		this.errorHandler = fn;
		return this;
	}

	/**
	 * Add an item to the queue
	 * @param data Item data to enqueue
	 * @param priority Priority level (higher is processed first)
	 */
	enqueue(data: T, priority = 0): void {
		this.items.push({ data, priority, addedAt: new Date() });

		// Sort by priority descending
		this.items.sort((a, b) => b.priority - a.priority);

		// Start processing if not already running
		if (!this.processing && this.handler) {
			this.run();
		}
	}

	/**
	 * Remove and return the next item from the queue
	 * @returns Next item data or undefined if empty
	 */
	dequeue(): T | undefined {
		return this.items.shift()?.data;
	}

	/**
	 * Run the queue processing loop
	 */
	private async run(): Promise<void> {
		if (!this.handler) return;

		this.processing = true;

		while (this.items.length > 0) {
			// Take up to concurrency items
			const batch = this.items.splice(0, this.concurrency);

			// Process batch concurrently
			const promises = batch.map(async (item) => {
				try {
					await this.handler!(item.data);
				} catch (error) {
					if (this.errorHandler) {
						this.errorHandler(error as Error, item.data);
					}
				}
			});

			await Promise.all(promises);
		}

		this.processing = false;
	}

	/**
	 * Get the current number of items in the queue
	 * @returns Queue length
	 */
	get size(): number {
		return this.items.length;
	}

	/**
	 * Check if the queue is empty
	 * @returns True if no items are queued
	 */
	get isEmpty(): boolean {
		return this.items.length === 0;
	}

	/**
	 * Check if the queue is currently processing items
	 * @returns True if processing
	 */
	get isProcessing(): boolean {
		return this.processing;
	}

	/**
	 * Clear all items from the queue
	 */
	clear(): void {
		this.items = [];
	}
}
