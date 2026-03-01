// External libraries
import { z } from "zod";
import { UserRoles, TaskStatus, TaskPriority, ProjectStatus, AbsenceType } from "@/constants";

// Converts an enum-like object to a Zod-compatible tuple [T, ...T[]]
const toZodEnum = <T extends string>(obj: Record<string, T>): [T, ...T[]] => Object.values(obj) as [T, ...T[]];

/** Schema de validation pour le formulaire de connexion */
export const loginSchema = z.object({
	email: z.string().email("Adresse email invalide"),
	password: z.string().min(1, "Le mot de passe est requis"),
	rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/** Schema de validation pour le code d'authentification a deux facteurs */
export const a2fSchema = z.object({
	code: z
		.string()
		.length(6, "Le code doit faire 6 chiffres")
		.regex(/^\d+$/, "Le code ne doit contenir que des chiffres"),
});

export type A2FFormData = z.infer<typeof a2fSchema>;

/** Schema de validation pour la creation d'un utilisateur */
export const createUserSchema = z.object({
	firstName: z.string().min(2, "Minimum 2 caracteres"),
	lastName: z.string().min(2, "Minimum 2 caracteres"),
	email: z.string().email("Adresse email invalide"),
	role: z.enum(toZodEnum(UserRoles)),
	password: z.string().min(8, "Minimum 8 caracteres"),
	groupAccess: z
		.array(
			z.object({
				groupId: z.string(),
				groupName: z.string(),
				role: z.enum(toZodEnum(UserRoles)),
				permissions: z.array(z.string()),
			}),
		)
		.min(1, "Au moins une entite requise"),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

/** Schema de validation pour la mise a jour d'un utilisateur (mot de passe exclu, tous les champs optionnels) */
export const updateUserSchema = createUserSchema.omit({ password: true }).partial();

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

/** Schema de validation pour la creation d'un projet */
export const createProjectSchema = z.object({
	name: z.string().min(2, "Minimum 2 caracteres"),
	description: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	status: z.enum(toZodEnum(ProjectStatus)),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;

/** Schema de validation pour la mise a jour d'un projet (tous les champs optionnels) */
export const updateProjectSchema = createProjectSchema.partial();

export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;

/** Schema de validation pour la creation d'une tache */
export const createTaskSchema = z.object({
	title: z.string().min(2, "Minimum 2 caracteres"),
	description: z.string().optional(),
	projectId: z.string(),
	assigneeId: z.string(),
	status: z.enum(toZodEnum(TaskStatus)),
	priority: z.enum(toZodEnum(TaskPriority)),
	dueDate: z.string().optional(),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

/** Schema de validation pour la mise a jour d'une tache (tous les champs optionnels) */
export const updateTaskSchema = createTaskSchema.partial();

export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;

/** Schema de validation pour la creation d'une reunion */
export const createMeetingSchema = z.object({
	title: z.string().min(2, "Minimum 2 caracteres"),
	description: z.string().optional(),
	date: z.string(),
	time: z.string(),
	duration: z.string().optional(),
	location: z.string().optional(),
	type: z.string().optional(),
	isOnline: z.boolean().optional(),
	link: z.string().url("URL invalide").optional().or(z.literal("")),
	participants: z.array(z.string()).optional(),
});

export type CreateMeetingFormData = z.infer<typeof createMeetingSchema>;

/** Schema de validation pour la mise a jour d'une reunion (tous les champs optionnels) */
export const updateMeetingSchema = createMeetingSchema.partial();

export type UpdateMeetingFormData = z.infer<typeof updateMeetingSchema>;

/** Schema de validation pour la creation d'une absence */
export const createAbsenceSchema = z.object({
	type: z.enum(toZodEnum(AbsenceType)),
	startDate: z.string(),
	endDate: z.string(),
	reason: z.string().optional(),
});

export type CreateAbsenceFormData = z.infer<typeof createAbsenceSchema>;

/** Schema de validation pour le changement de mot de passe avec verification de correspondance */
export const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "Mot de passe actuel requis"),
		newPassword: z.string().min(8, "Minimum 8 caracteres"),
		confirmPassword: z.string().min(8, "Confirmation requise"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Les mots de passe ne correspondent pas",
		path: ["confirmPassword"],
	});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

/** Schema de validation pour l'acces a un groupe */
export const groupAccessSchema = z.object({
	groupId: z.string(),
	groupName: z.string(),
	role: z.enum(toZodEnum(UserRoles)),
	permissions: z.array(z.string()),
});

export type GroupAccess = z.infer<typeof groupAccessSchema>;

/** Schema de validation pour la creation d'un groupement */
export const createGroupSchema = z.object({
	name: z.string().min(2, "Minimum 2 caracteres"),
	description: z.string().optional(),
	logoUrl: z.string().url("URL invalide").optional().or(z.literal("")),
});

export type CreateGroupFormData = z.infer<typeof createGroupSchema>;

/** Schema de validation pour la mise a jour d'un groupement */
export const updateGroupSchema = createGroupSchema.partial();

export type UpdateGroupFormData = z.infer<typeof updateGroupSchema>;
