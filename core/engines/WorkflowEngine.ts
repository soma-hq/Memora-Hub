export type WorkflowStepStatus = "pending" | "in_progress" | "completed" | "failed";

export interface WorkflowStep {
	id: string;
	name: string;
	execute: (context: Record<string, unknown>) => Promise<void>;
}

export interface WorkflowDefinition {
	steps: WorkflowStep[];
	onError?: (stepId: string, error: Error) => void;
}

export interface WorkflowResult {
	entityId: string;
	completedSteps: string[];
	failedStep: string | null;
	status: "completed" | "failed";
}

export class WorkflowEngine {
	/**
	 * Runs a multi-step workflow pipeline sequentially
	 * @param entityId - The entity being processed
	 * @param workflow - Workflow definition with steps and error handler
	 * @returns Execution result with completed/failed steps
	 */
	static async run(entityId: string, workflow: WorkflowDefinition): Promise<WorkflowResult> {
		const completedSteps: string[] = [];
		const context: Record<string, unknown> = { entityId };

		for (const step of workflow.steps) {
			try {
				await step.execute(context);
				completedSteps.push(step.id);
			} catch (error) {
				if (workflow.onError) workflow.onError(step.id, error as Error);
				return { entityId, completedSteps, failedStep: step.id, status: "failed" };
			}
		}
		return { entityId, completedSteps, failedStep: null, status: "completed" };
	}
}
