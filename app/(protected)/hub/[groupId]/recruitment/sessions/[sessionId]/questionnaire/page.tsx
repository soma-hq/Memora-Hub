"use client";

// Next.js
import { useRouter } from "next/navigation";
import { QuestionnaireCarousel } from "@/features/recruitment/components/questionnaire-carousel";


/**
 * Full-screen questionnaire page for reviewing recruitment questions.
 * @returns The questionnaire carousel view
 */
export default function QuestionnairePage() {
	const router = useRouter();

	return (
		<div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
			<div className="flex-1 p-4 md:p-6 lg:p-8">
				<QuestionnaireCarousel onBack={() => router.back()} />
			</div>
		</div>
	);
}
