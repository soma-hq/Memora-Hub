import type { RecruitmentSession, QuestionnaireStage, Consigne, RecruiterStats } from "./types";


/** Recruitment sessions array */
export const sessions: RecruitmentSession[] = [];

/** Questionnaire stages for the interview process */
export const questionnaireStages: QuestionnaireStage[] = [];

/** Consignes from leadership */
export const consignes: Consigne[] = [];

/** Default empty recruiter statistics */
export const recruiterStats: RecruiterStats = {
	totalCandidates: 0,
	favorable: 0,
	unfavorable: 0,
	pending: 0,
	todayInterviews: 0,
};
