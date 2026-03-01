type EventHandler<T = unknown> = (payload: T) => void | Promise<void>;

/**
 * Typed event emitter for decoupled communication between modules
 */
export class Event {
	/** Registered listeners indexed by event name */
	private static listeners: Map<string, EventHandler[]> = new Map();

	/**
	 * Register a handler for a specific event
	 * @param eventName Name of the event to listen to
	 * @param handler Callback function invoked when the event fires
	 */
	static on<T = unknown>(eventName: string, handler: EventHandler<T>): void {
		const existing = Event.listeners.get(eventName) ?? [];
		existing.push(handler as EventHandler);
		Event.listeners.set(eventName, existing);
	}

	/**
	 * Register a one-time handler that auto-removes after first call
	 * @param eventName Name of the event to listen to
	 * @param handler Callback function invoked once
	 */
	static once<T = unknown>(eventName: string, handler: EventHandler<T>): void {
		const wrapper: EventHandler<T> = async (payload) => {
			Event.off(eventName, wrapper as EventHandler);
			await handler(payload);
		};

		Event.on(eventName, wrapper);
	}

	/**
	 * Emit an event, calling all registered handlers sequentially
	 * @param eventName Name of the event to emit
	 * @param payload Data to pass to each handler
	 */
	static async emit<T = unknown>(eventName: string, payload?: T): Promise<void> {
		const handlers = Event.listeners.get(eventName) ?? [];

		for (const handler of handlers) {
			await handler(payload);
		}
	}

	/**
	 * Remove a specific handler from an event
	 * @param eventName Name of the event
	 * @param handler Handler to remove
	 */
	static off(eventName: string, handler: EventHandler): void {
		const existing = Event.listeners.get(eventName) ?? [];
		Event.listeners.set(
			eventName,
			existing.filter((h) => h !== handler),
		);
	}

	/**
	 * Remove all handlers for a specific event or all events
	 * @param eventName Optional event name to clear, clears all if omitted
	 */
	static clear(eventName?: string): void {
		if (eventName) {
			Event.listeners.delete(eventName);
		} else {
			Event.listeners.clear();
		}
	}

	/**
	 * Get the count of registered handlers for an event
	 * @param eventName Name of the event
	 * @returns Number of handlers registered
	 */
	static listenerCount(eventName: string): number {
		return (Event.listeners.get(eventName) ?? []).length;
	}
}
