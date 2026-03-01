"use client";

// Components
import { Modal, ModalFooter, Button, Badge, Icon, Avatar, AvatarGroup, Divider } from "@/components/ui";


interface MeetingData {
	id: string;
	title: string;
	description?: string;
	date: string;
	time: string;
	duration: string;
	location: string;
	participants: { name: string; avatar?: string }[];
	status: "upcoming" | "past";
	notes?: string;
}

interface MeetingDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	meeting: MeetingData | null;
}

/**
 * Detail modal for a meeting with schedule info, participants, and notes.
 * @param {MeetingDetailModalProps} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {() => void} props.onClose - Callback to close the modal
 * @param {MeetingData | null} props.meeting - Meeting data to display
 * @returns {JSX.Element | null} Meeting detail modal or null when no meeting
 */
export function MeetingDetailModal({ isOpen, onClose, meeting }: MeetingDetailModalProps) {
	if (!meeting) return null;

	// Render
	return (
		<Modal isOpen={isOpen} onClose={onClose} title={meeting.title} size="lg">
			<div className="space-y-6">
				{/* Status */}
				<div className="flex items-center gap-2">
					<Badge variant={meeting.status === "upcoming" ? "info" : "neutral"}>
						{meeting.status === "upcoming" ? "A venir" : "Passee"}
					</Badge>
				</div>

				{/* Details grid */}
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div className="flex items-center gap-3">
						<div className="bg-primary-100 dark:bg-primary-900/20 rounded-lg p-2">
							<Icon name="calendarDays" size="sm" className="text-primary-500" />
						</div>
						<div>
							<p className="text-xs text-gray-400">Date</p>
							<p className="font-medium text-gray-700 dark:text-gray-300">{meeting.date}</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="bg-info-100 dark:bg-info-900/20 rounded-lg p-2">
							<Icon name="clock" size="sm" className="text-info-500" />
						</div>
						<div>
							<p className="text-xs text-gray-400">Horaire</p>
							<p className="font-medium text-gray-700 dark:text-gray-300">
								{meeting.time} ({meeting.duration})
							</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="bg-success-100 dark:bg-success-900/20 rounded-lg p-2">
							<Icon name="location" size="sm" className="text-success-500" />
						</div>
						<div>
							<p className="text-xs text-gray-400">Lieu</p>
							<p className="font-medium text-gray-700 dark:text-gray-300">{meeting.location}</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="bg-warning-100 dark:bg-warning-900/20 rounded-lg p-2">
							<Icon name="users" size="sm" className="text-warning-500" />
						</div>
						<div>
							<p className="text-xs text-gray-400">Participants</p>
							<p className="font-medium text-gray-700 dark:text-gray-300">
								{meeting.participants.length} personnes
							</p>
						</div>
					</div>
				</div>

				{/* Description */}
				{meeting.description && (
					<>
						<Divider />
						<div>
							<h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Description</h4>
							<p className="text-sm text-gray-500 dark:text-gray-400">{meeting.description}</p>
						</div>
					</>
				)}

				{/* Participants list */}
				<Divider />
				<div>
					<h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Participants</h4>
					<div className="mb-4 flex items-center gap-3">
						<AvatarGroup users={meeting.participants} max={6} size="sm" />
					</div>
					<div className="space-y-2">
						{meeting.participants.map((p, idx) => (
							<div
								key={idx}
								className="flex items-center gap-3 rounded-lg border border-gray-200 p-2.5 dark:border-gray-700"
							>
								<Avatar src={p.avatar} name={p.name} size="sm" />
								<span className="text-sm font-medium text-gray-700 dark:text-gray-300">{p.name}</span>
							</div>
						))}
					</div>
				</div>

				{/* Notes */}
				<Divider />
				<div>
					<h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Notes de reunion</h4>
					<div className="min-h-[80px] rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
						<p className="text-sm text-gray-400 italic">
							{meeting.notes || "Aucune note pour cette reunion."}
						</p>
					</div>
				</div>
			</div>

			<ModalFooter>
				<Button variant="cancel" onClick={onClose}>
					Fermer
				</Button>
				<Button variant="outline-primary">
					<Icon name="edit" size="xs" />
					Modifier
				</Button>
			</ModalFooter>
		</Modal>
	);
}
