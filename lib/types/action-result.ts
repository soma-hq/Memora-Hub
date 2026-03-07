/** Standard server action result — generic to avoid double-cast assertions */
export interface ActionResult<T = unknown> {
	success: boolean;
	error?: string;
	data?: T;
}

/** Shorthand for a successful action result with typed data */
export function actionSuccess<T>(data?: T): ActionResult<T> {
	return data !== undefined ? { success: true, data } : { success: true };
}

/** Shorthand for a failed action result */
export function actionError<T = unknown>(error: string): ActionResult<T> {
	return { success: false, error };
}
