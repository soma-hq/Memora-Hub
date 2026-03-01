"use client";

import { useState } from "react";
import { Badge, Button, Icon, Tabs, Divider } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { showSuccess, showError } from "@/lib/utils/toast";
import type { Candidate, CandidateAvis, CandidateDecision, AvisAuthorRole } from "../types";
import { decisionVariantMap, avisRoleVariantMap, TALENT_DECISIONS, LEADER_DECISIONS } from "../types";


/** Props for the CandidateDetail component */
interface CandidateDetailProps {
	candidate: Candidate;
	sessionName?: string;
	onAddAvis?: (candidateId: string, avis: Omit<CandidateAvis, "id">) => void;
	className?: string;
}

/**
 * Tabbed candidate detail panel
 * @param props.candidate - Candidate data
 * @param props.sessionName - Optional session name
 * @param props.onAddAvis - Add avis callback
 * @param props.className - Extra CSS classes
 * @returns Candidate detail with candidature, avis, bilan tabs
 */

export function CandidateDetail({ candidate, sessionName, onAddAvis, className }: CandidateDetailProps) {
	// State
	const [activeTab, setActiveTab] = useState("candidature");
	const [showAvisForm, setShowAvisForm] = useState(false);
	const [currentUserRole] = useState<AvisAuthorRole>("Talent");
	const [avisDecision, setAvisDecision] = useState<CandidateDecision | "">("");
	const [avisComment, setAvisComment] = useState("");

	// Computed
	const tabs = [
		{ id: "candidature", label: "Candidature" },
		{ id: "avis", label: "Avis", count: candidate.avis.length },
		{ id: "bilan", label: "Bilan" },
	];

	const availableDecisions: CandidateDecision[] =
		currentUserRole === "Talent" ? [...TALENT_DECISIONS] : [...TALENT_DECISIONS, ...LEADER_DECISIONS];

	// Handlers
	/**
	 * Validates and submits the avis form
	 */

	const handleSubmitAvis = () => {
		if (!avisDecision) {
			showError("Veuillez selectionner une decision");
			return;
		}
		if (onAddAvis) {
			onAddAvis(candidate.id, {
				author: "Utilisateur courant",
				authorRole: currentUserRole,
				decision: avisDecision,
				comment: avisComment || undefined,
				createdAt: new Date().toISOString().split("T")[0],
			});
			showSuccess("Avis ajoute avec succes");
		}
		setShowAvisForm(false);
		setAvisDecision("");
		setAvisComment("");
	};

	// Render
	return (
		<div className={cn("flex flex-col gap-4", className)}>
			{/* Header */}
			<div className="flex items-center gap-4">
				<div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
					{candidate.name
						.split(" ")
						.map((n) => n[0])
						.join("")
						.toUpperCase()}
				</div>
				<div>
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white">{candidate.name}</h2>
					<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
						<span>{candidate.formId}</span>
						{sessionName && (
							<>
								<span className="text-gray-300 dark:text-gray-600">|</span>
								<span>{sessionName}</span>
							</>
						)}
					</div>
				</div>
				{candidate.finalDecision && (
					<div className="ml-auto">
						<Badge variant={decisionVariantMap[candidate.finalDecision]}>{candidate.finalDecision}</Badge>
					</div>
				)}
			</div>

			<Divider />

			<Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

			{activeTab === "candidature" && (
				<div className="space-y-4">
					<div>
						<h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Candidature</h4>
						<div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-300">
							{candidate.candidature}
						</div>
					</div>

					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<div className="rounded-lg border border-gray-100 p-3 dark:border-gray-700">
							<p className="mb-1 text-xs text-gray-400">Recruteur</p>
							<p className="text-sm font-medium text-gray-900 dark:text-white">{candidate.recruiter}</p>
						</div>
						<div className="rounded-lg border border-gray-100 p-3 dark:border-gray-700">
							<p className="mb-1 text-xs text-gray-400">Date d&apos;entretien</p>
							<p className="text-sm font-medium text-gray-900 dark:text-white">
								{candidate.interviewDate || "Non planifie"}{" "}
								{candidate.interviewTime && `a ${candidate.interviewTime}`}
							</p>
						</div>
					</div>

					{candidate.spectators.length > 0 && (
						<div>
							<h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Spectateurs</h4>
							<div className="flex flex-wrap gap-2">
								{candidate.spectators.map((spec, i) => (
									<span
										key={i}
										className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300"
									>
										<Icon name="eye" size="xs" />
										{spec}
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			)}

			{activeTab === "avis" && (
				<div className="space-y-4">
					{!showAvisForm && (
						<Button variant="outline-primary" size="sm" onClick={() => setShowAvisForm(true)}>
							<Icon name="plus" size="xs" />
							Ajouter un avis
						</Button>
					)}

					{showAvisForm && (
						<div className="border-primary-200 bg-primary-50/50 dark:border-primary-800 dark:bg-primary-900/10 rounded-lg border p-4">
							<h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Nouvel avis</h4>

							<p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
								Vous etes connecte en tant que{" "}
								<Badge variant={avisRoleVariantMap[currentUserRole]} showDot={false}>
									{currentUserRole}
								</Badge>
								{currentUserRole === "Talent" && (
									<span className="ml-1 text-gray-400">(Favorable / Defavorable uniquement)</span>
								)}
							</p>

							<div className="mb-3">
								<label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
									Decision
								</label>
								<div className="flex flex-wrap gap-2">
									{availableDecisions.map((d) => (
										<button
											key={d}
											onClick={() => setAvisDecision(d)}
											className={cn(
												"rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
												avisDecision === d
													? "border-primary-400 bg-primary-100 text-primary-700 dark:border-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
													: "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-500",
											)}
										>
											{d}
										</button>
									))}
								</div>
							</div>

							<div className="mb-3">
								<label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
									Commentaire (optionnel)
								</label>
								<textarea
									value={avisComment}
									onChange={(e) => setAvisComment(e.target.value)}
									className="focus:border-primary-500 focus:ring-primary-100 dark:focus:border-primary-500 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
									rows={3}
									placeholder="Votre commentaire sur ce candidat..."
								/>
							</div>

							<div className="flex items-center gap-2">
								<Button variant="primary" size="sm" onClick={handleSubmitAvis}>
									Valider
								</Button>
								<Button variant="cancel" size="sm" onClick={() => setShowAvisForm(false)}>
									Annuler
								</Button>
							</div>
						</div>
					)}

					{candidate.avis.length > 0 ? (
						<div className="space-y-3">
							{candidate.avis.map((avis) => (
								<div
									key={avis.id}
									className="rounded-lg border border-gray-100 p-4 dark:border-gray-700"
								>
									<div className="mb-2 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium text-gray-900 dark:text-white">
												{avis.author}
											</span>
											<Badge variant={avisRoleVariantMap[avis.authorRole]} showDot={false}>
												{avis.authorRole}
											</Badge>
										</div>
										<Badge variant={decisionVariantMap[avis.decision]}>{avis.decision}</Badge>
									</div>
									{avis.comment && (
										<p className="text-sm text-gray-600 dark:text-gray-400">{avis.comment}</p>
									)}
									<p className="mt-2 text-xs text-gray-400 dark:text-gray-500">{avis.createdAt}</p>
								</div>
							))}
						</div>
					) : (
						<p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
							Aucun avis pour le moment.
						</p>
					)}
				</div>
			)}

			{activeTab === "bilan" && (
				<div className="space-y-4">
					<div className="grid grid-cols-3 gap-3">
						<div className="rounded-lg border border-gray-100 p-3 text-center dark:border-gray-700">
							<p className="text-success-600 text-2xl font-bold">
								{candidate.avis.filter((a) => a.decision === "Favorable").length}
							</p>
							<p className="text-xs text-gray-400">Favorable</p>
						</div>
						<div className="rounded-lg border border-gray-100 p-3 text-center dark:border-gray-700">
							<p className="text-error-600 text-2xl font-bold">
								{candidate.avis.filter((a) => a.decision === "Défavorable").length}
							</p>
							<p className="text-xs text-gray-400">Defavorable</p>
						</div>
						<div className="rounded-lg border border-gray-100 p-3 text-center dark:border-gray-700">
							<p className="text-2xl font-bold text-gray-900 dark:text-white">{candidate.avis.length}</p>
							<p className="text-xs text-gray-400">Total avis</p>
						</div>
					</div>

					<div className="rounded-lg border border-gray-100 p-4 dark:border-gray-700">
						<h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Decision finale</h4>
						{candidate.finalDecision ? (
							<Badge variant={decisionVariantMap[candidate.finalDecision]}>
								{candidate.finalDecision}
							</Badge>
						) : (
							<p className="text-sm text-gray-400">En attente de decision</p>
						)}
					</div>

					<div className="rounded-lg border border-gray-100 p-4 dark:border-gray-700">
						<h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Notes</h4>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							{candidate.notes || "Aucune note pour le moment."}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
