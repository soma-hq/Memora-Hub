import { prisma } from "@/lib/prisma";
import { Prisma, type Role } from "@prisma/client";

export class DatabaseManager {
	/**
	 * Run a transaction
	 * @param fn - Transaction callback
	 * @returns Callback return value
	 */

	static async transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
		return prisma.$transaction(fn);
	}

	/**
	 * Find user by ID
	 * @param id - User ID
	 * @returns User or null
	 */

	static async findUserById(id: string) {
		return prisma.user.findUnique({ where: { id } });
	}

	/**
	 * Find user by email
	 * @param email - User email
	 * @returns User or null
	 */

	static async findUserByEmail(email: string) {
		return prisma.user.findUnique({ where: { email } });
	}

	/**
	 * Get all users
	 * @returns All users
	 */

	static async findAllUsers() {
		return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
	}

	/**
	 * Create a user
	 * @param data - User data
	 * @returns Created user
	 */

	static async createUser(data: Prisma.UserCreateInput) {
		return prisma.user.create({ data });
	}

	/**
	 * Update a user
	 * @param id - User ID
	 * @param data - Fields to update
	 * @returns Updated user
	 */

	static async updateUser(id: string, data: Prisma.UserUpdateInput) {
		return prisma.user.update({ where: { id }, data });
	}

	/**
	 * Delete a user
	 * @param id - User ID
	 * @returns Deleted user
	 */

	static async deleteUser(id: string) {
		return prisma.user.delete({ where: { id } });
	}

	/**
	 * Create a session
	 * @param data - Session data
	 * @returns Created session
	 */

	static async createSession(data: Prisma.SessionCreateInput) {
		return prisma.session.create({ data });
	}

	/**
	 * Find session by token
	 * @param token - Session token
	 * @returns Session with user or null
	 */

	static async findSessionByToken(token: string) {
		return prisma.session.findUnique({
			where: { token },
			include: { user: true },
		});
	}

	/**
	 * Delete session by token
	 * @param token - Session token
	 * @returns Deleted session
	 */

	static async deleteSession(token: string) {
		return prisma.session.delete({ where: { token } });
	}

	/**
	 * Delete all user sessions
	 * @param userId - User ID
	 * @returns Deleted count
	 */

	static async deleteAllUserSessions(userId: string) {
		return prisma.session.deleteMany({ where: { userId } });
	}

	/**
	 * Delete expired sessions
	 * @returns Deleted count
	 */

	static async deleteExpiredSessions() {
		return prisma.session.deleteMany({
			where: { expiresAt: { lt: new Date() } },
		});
	}

	/**
	 * Find group by ID
	 * @param id - Group ID
	 * @returns Group with members or null
	 */

	static async findGroupById(id: string) {
		return prisma.group.findUnique({
			where: { id },
			include: { members: true },
		});
	}

	/**
	 * Get all groups
	 * @returns All groups
	 */

	static async findAllGroups() {
		return prisma.group.findMany({ orderBy: { createdAt: "desc" } });
	}

	/**
	 * Create a group
	 * @param data - Group data
	 * @returns Created group
	 */

	static async createGroup(data: Prisma.GroupCreateInput) {
		return prisma.group.create({ data });
	}

	/**
	 * Update a group
	 * @param id - Group ID
	 * @param data - Fields to update
	 * @returns Updated group
	 */

	static async updateGroup(id: string, data: Prisma.GroupUpdateInput) {
		return prisma.group.update({ where: { id }, data });
	}

	/**
	 * Delete a group
	 * @param id - Group ID
	 * @returns Deleted group
	 */

	static async deleteGroup(id: string) {
		return prisma.group.delete({ where: { id } });
	}

	/**
	 * Add group member
	 * @param data - Membership data
	 * @returns Created member record
	 */

	static async addGroupMember(data: Prisma.GroupMemberCreateInput) {
		return prisma.groupMember.create({ data });
	}

	/**
	 * Remove group member
	 * @param userId - User ID
	 * @param groupId - Group ID
	 * @returns Deleted member record
	 */

	static async removeGroupMember(userId: string, groupId: string) {
		return prisma.groupMember.delete({
			where: { userId_groupId: { userId, groupId } },
		});
	}

	/**
	 * Update member role
	 * @param userId - User ID
	 * @param groupId - Group ID
	 * @param role - New role to assign
	 * @returns Updated member record
	 */

	static async updateGroupMemberRole(userId: string, groupId: string, role: Role) {
		return prisma.groupMember.update({
			where: { userId_groupId: { userId, groupId } },
			data: { role },
		});
	}

	/**
	 * Get group members
	 * @param groupId - Group ID
	 * @returns Group member records
	 */

	static async findGroupMembers(groupId: string) {
		return prisma.groupMember.findMany({ where: { groupId } });
	}

	/**
	 * Get user groups
	 * @param userId - User ID
	 * @returns User member records
	 */

	static async findUserGroups(userId: string) {
		return prisma.groupMember.findMany({ where: { userId } });
	}

	/**
	 * Find project by ID
	 * @param id - Project ID
	 * @returns Project with related data or null
	 */

	static async findProjectById(id: string) {
		return prisma.project.findUnique({
			where: { id },
			include: { tasks: true, members: true, createdBy: true },
		});
	}

	/**
	 * Get projects by group
	 * @param groupId - Group ID
	 * @returns Projects for the group
	 */

	static async findProjectsByGroup(groupId: string) {
		return prisma.project.findMany({
			where: { groupId },
			orderBy: { createdAt: "desc" },
		});
	}

	/**
	 * Create a project
	 * @param data - Project data
	 * @returns Created project
	 */

	static async createProject(data: Prisma.ProjectCreateInput) {
		return prisma.project.create({ data });
	}

	/**
	 * Update a project
	 * @param id - Project ID
	 * @param data - Fields to update
	 * @returns Updated project
	 */

	static async updateProject(id: string, data: Prisma.ProjectUpdateInput) {
		return prisma.project.update({ where: { id }, data });
	}

	/**
	 * Delete a project
	 * @param id - Project ID
	 * @returns Deleted project
	 */

	static async deleteProject(id: string) {
		return prisma.project.delete({ where: { id } });
	}

	/**
	 * Add project member
	 * @param data - Membership data
	 * @returns Created member record
	 */

	static async addProjectMember(data: Prisma.ProjectMemberCreateInput) {
		return prisma.projectMember.create({ data });
	}

	/**
	 * Remove project member
	 * @param projectId - Project ID
	 * @param userId - User ID
	 * @returns Deleted member record
	 */

	static async removeProjectMember(projectId: string, userId: string) {
		return prisma.projectMember.delete({
			where: { projectId_userId: { projectId, userId } },
		});
	}

	/**
	 * Find task by ID
	 * @param id - Task ID
	 * @returns Task with subtasks or null
	 */

	static async findTaskById(id: string) {
		return prisma.task.findUnique({
			where: { id },
			include: { subtasks: true },
		});
	}

	/**
	 * Get tasks by project
	 * @param projectId - Project ID
	 * @returns Tasks for the project
	 */

	static async findTasksByProject(projectId: string) {
		return prisma.task.findMany({
			where: { projectId },
			orderBy: { createdAt: "desc" },
		});
	}

	/**
	 * Get tasks by user
	 * @param userId - User ID
	 * @returns Tasks assigned to user
	 */

	static async findTasksByUser(userId: string) {
		return prisma.task.findMany({
			where: { assigneeId: userId },
			orderBy: { createdAt: "desc" },
		});
	}

	/**
	 * Create a task
	 * @param data - Task data
	 * @returns Created task
	 */

	static async createTask(data: Prisma.TaskCreateInput) {
		return prisma.task.create({ data });
	}

	/**
	 * Update a task
	 * @param id - Task ID
	 * @param data - Fields to update
	 * @returns Updated task
	 */

	static async updateTask(id: string, data: Prisma.TaskUpdateInput) {
		return prisma.task.update({ where: { id }, data });
	}

	/**
	 * Delete a task
	 * @param id - Task ID
	 * @returns Deleted task
	 */

	static async deleteTask(id: string) {
		return prisma.task.delete({ where: { id } });
	}

	/**
	 * Create a subtask
	 * @param data - Subtask data
	 * @returns Created subtask
	 */

	static async createSubtask(data: Prisma.SubtaskCreateInput) {
		return prisma.subtask.create({ data });
	}

	/**
	 * Update a subtask
	 * @param id - Subtask ID
	 * @param data - Fields to update
	 * @returns Updated subtask
	 */

	static async updateSubtask(id: string, data: Prisma.SubtaskUpdateInput) {
		return prisma.subtask.update({ where: { id }, data });
	}

	/**
	 * Delete a subtask
	 * @param id - Subtask ID
	 * @returns Deleted subtask
	 */

	static async deleteSubtask(id: string) {
		return prisma.subtask.delete({ where: { id } });
	}

	/**
	 * Find meeting by ID
	 * @param id - Meeting ID
	 * @returns Meeting with attendees or null
	 */

	static async findMeetingById(id: string) {
		return prisma.meeting.findUnique({
			where: { id },
			include: { attendees: { include: { user: true } } },
		});
	}

	/**
	 * Get meetings by group
	 * @param groupId - Group ID
	 * @returns Meetings for the group
	 */

	static async findMeetingsByGroup(groupId: string) {
		return prisma.meeting.findMany({
			where: { groupId },
			orderBy: { date: "asc" },
		});
	}

	/**
	 * Create a meeting
	 * @param data - Meeting data
	 * @returns Created meeting
	 */

	static async createMeeting(data: Prisma.MeetingCreateInput) {
		return prisma.meeting.create({ data });
	}

	/**
	 * Update a meeting
	 * @param id - Meeting ID
	 * @param data - Fields to update
	 * @returns Updated meeting
	 */

	static async updateMeeting(id: string, data: Prisma.MeetingUpdateInput) {
		return prisma.meeting.update({ where: { id }, data });
	}

	/**
	 * Delete a meeting
	 * @param id - Meeting ID
	 * @returns Deleted meeting
	 */

	static async deleteMeeting(id: string) {
		return prisma.meeting.delete({ where: { id } });
	}

	/**
	 * Add meeting attendee
	 * @param data - Attendance data
	 * @returns Created attendee record
	 */

	static async addMeetingAttendee(data: Prisma.MeetingAttendeeCreateInput) {
		return prisma.meetingAttendee.create({ data });
	}

	/**
	 * Remove meeting attendee
	 * @param meetingId - Meeting ID
	 * @param userId - User ID
	 * @returns Deleted attendee record
	 */

	static async removeMeetingAttendee(meetingId: string, userId: string) {
		return prisma.meetingAttendee.delete({
			where: { meetingId_userId: { meetingId, userId } },
		});
	}

	/**
	 * Find absence by ID
	 * @param id - Absence ID
	 * @returns Absence or null
	 */

	static async findAbsenceById(id: string) {
		return prisma.absence.findUnique({ where: { id } });
	}

	/**
	 * Get absences by user
	 * @param userId - User ID
	 * @returns Absences for the user
	 */

	static async findAbsencesByUser(userId: string) {
		return prisma.absence.findMany({
			where: { userId },
			orderBy: { startDate: "desc" },
		});
	}

	/**
	 * Get pending absences
	 * @returns Pending absence records
	 */

	static async findPendingAbsences() {
		return prisma.absence.findMany({
			where: { status: "pending" },
			orderBy: { startDate: "desc" },
		});
	}

	/**
	 * Create an absence
	 * @param data - Absence data
	 * @returns Created absence
	 */

	static async createAbsence(data: Prisma.AbsenceCreateInput) {
		return prisma.absence.create({ data });
	}

	/**
	 * Update an absence
	 * @param id - Absence ID
	 * @param data - Fields to update
	 * @returns Updated absence
	 */

	static async updateAbsence(id: string, data: Prisma.AbsenceUpdateInput) {
		return prisma.absence.update({ where: { id }, data });
	}

	/**
	 * Get notifications by user
	 * @param userId - User ID
	 * @returns Notifications for the user
	 */

	static async findNotificationsByUser(userId: string) {
		return prisma.notification.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
		});
	}

	/**
	 * Create a notification
	 * @param data - Notification data
	 * @returns Created notification
	 */

	static async createNotification(data: Prisma.NotificationCreateInput) {
		return prisma.notification.create({ data });
	}

	/**
	 * Mark notification as read
	 * @param id - Notification ID
	 * @returns Updated notification
	 */

	static async markNotificationAsRead(id: string) {
		return prisma.notification.update({
			where: { id },
			data: { isRead: true },
		});
	}

	/**
	 * Mark all notifications read
	 * @param userId - User ID
	 * @returns Updated count
	 */

	static async markAllNotificationsAsRead(userId: string) {
		return prisma.notification.updateMany({
			where: { userId, isRead: false },
			data: { isRead: true },
		});
	}

	/**
	 * Delete a notification
	 * @param id - Notification ID
	 * @returns Deleted notification
	 */

	static async deleteNotification(id: string) {
		return prisma.notification.delete({ where: { id } });
	}

	/**
	 * Count unread notifications
	 * @param userId - User ID
	 * @returns Unread notification count
	 */

	static async countUnreadNotifications(userId: string) {
		return prisma.notification.count({
			where: { userId, isRead: false },
		});
	}

	/**
	 * Create a log entry
	 * @param data - Log data
	 * @returns Created log
	 */

	static async createLog(data: Prisma.LogCreateInput) {
		return prisma.log.create({ data });
	}

	/**
	 * Get logs by user
	 * @param userId - User ID
	 * @returns Logs for the user
	 */

	static async findLogsByUser(userId: string) {
		return prisma.log.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
		});
	}

	/**
	 * Get recent logs
	 * @param limit - Max entries to return
	 * @returns Recent log records
	 */

	static async findRecentLogs(limit: number = 50) {
		return prisma.log.findMany({
			orderBy: { createdAt: "desc" },
			take: limit,
		});
	}

	/**
	 * Find job offer by ID
	 * @param id - Job offer ID
	 * @returns Job offer with candidates or null
	 */

	static async findJobOfferById(id: string) {
		return prisma.jobOffer.findUnique({
			where: { id },
			include: { candidates: true },
		});
	}

	/**
	 * Get job offers by group
	 * @param groupId - Group ID
	 * @returns Job offers for the group
	 */

	static async findJobOffersByGroup(groupId: string) {
		return prisma.jobOffer.findMany({
			where: { groupId },
			orderBy: { createdAt: "desc" },
		});
	}

	/**
	 * Create a job offer
	 * @param data - Job offer data
	 * @returns Created job offer
	 */

	static async createJobOffer(data: Prisma.JobOfferCreateInput) {
		return prisma.jobOffer.create({ data });
	}

	/**
	 * Update a job offer
	 * @param id - Job offer ID
	 * @param data - Fields to update
	 * @returns Updated job offer
	 */

	static async updateJobOffer(id: string, data: Prisma.JobOfferUpdateInput) {
		return prisma.jobOffer.update({ where: { id }, data });
	}

	/**
	 * Delete a job offer
	 * @param id - Job offer ID
	 * @returns Deleted job offer
	 */

	static async deleteJobOffer(id: string) {
		return prisma.jobOffer.delete({ where: { id } });
	}

	/**
	 * Find candidate by ID
	 * @param id - Candidate ID
	 * @returns Candidate or null
	 */

	static async findCandidateById(id: string) {
		return prisma.candidate.findUnique({ where: { id } });
	}

	/**
	 * Get candidates by offer
	 * @param offerId - Job offer ID
	 * @returns Candidates for the offer
	 */

	static async findCandidatesByOffer(offerId: string) {
		return prisma.candidate.findMany({
			where: { offerId },
			orderBy: { appliedAt: "desc" },
		});
	}

	/**
	 * Create a candidate
	 * @param data - Candidate data
	 * @returns Created candidate
	 */

	static async createCandidate(data: Prisma.CandidateCreateInput) {
		return prisma.candidate.create({ data });
	}

	/**
	 * Update a candidate
	 * @param id - Candidate ID
	 * @param data - Fields to update
	 * @returns Updated candidate
	 */

	static async updateCandidate(id: string, data: Prisma.CandidateUpdateInput) {
		return prisma.candidate.update({ where: { id }, data });
	}

	/**
	 * Delete a candidate
	 * @param id - Candidate ID
	 * @returns Deleted candidate
	 */

	static async deleteCandidate(id: string) {
		return prisma.candidate.delete({ where: { id } });
	}

	/**
	 * Find training by ID
	 * @param id - Training ID
	 * @returns Training with participants or null
	 */

	static async findTrainingById(id: string) {
		return prisma.training.findUnique({
			where: { id },
			include: { participants: { include: { user: true } } },
		});
	}

	/**
	 * Get trainings by group
	 * @param groupId - Group ID
	 * @returns Trainings for the group
	 */

	static async findTrainingsByGroup(groupId: string) {
		return prisma.training.findMany({
			where: { groupId },
			orderBy: { createdAt: "desc" },
		});
	}

	/**
	 * Create a training
	 * @param data - Training data
	 * @returns Created training
	 */

	static async createTraining(data: Prisma.TrainingCreateInput) {
		return prisma.training.create({ data });
	}

	/**
	 * Update a training
	 * @param id - Training ID
	 * @param data - Fields to update
	 * @returns Updated training
	 */

	static async updateTraining(id: string, data: Prisma.TrainingUpdateInput) {
		return prisma.training.update({ where: { id }, data });
	}

	/**
	 * Delete a training
	 * @param id - Training ID
	 * @returns Deleted training
	 */

	static async deleteTraining(id: string) {
		return prisma.training.delete({ where: { id } });
	}

	/**
	 * Enroll in a training
	 * @param data - Participant data
	 * @returns Created participant record
	 */

	static async enrollInTraining(data: Prisma.TrainingParticipantCreateInput) {
		return prisma.trainingParticipant.create({ data });
	}

	/**
	 * Unenroll from a training
	 * @param trainingId - Training ID
	 * @param userId - User ID
	 * @returns Deleted participant record
	 */

	static async unenrollFromTraining(trainingId: string, userId: string) {
		return prisma.trainingParticipant.delete({
			where: { trainingId_userId: { trainingId, userId } },
		});
	}
}
