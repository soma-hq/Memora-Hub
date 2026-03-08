import {
	absencesConfigSchema,
	type AbsencesConfig,
	tasksConfigSchema,
	type TasksConfig,
	meetingsConfigSchema,
	type MeetingsConfig,
	notificationsConfigSchema,
	type NotificationsConfig,
	paginationConfigSchema,
	type PaginationConfig,
	authConfigSchema,
	type AuthConfig,
	usersConfigSchema,
	type UsersConfig,
	exportConfigSchema,
	type ExportConfig,
	projectsConfigSchema,
	type ProjectsConfig,
	recruitmentConfigSchema,
	type RecruitmentConfig,
	searchConfigSchema,
	type SearchConfig,
	trainingConfigSchema,
	type TrainingConfig,
	assistantConfigSchema,
	type AssistantConfig,
	sectionBannersConfigSchema,
	type SectionBannersConfig,
} from "./schemas";

import absencesDefault from "@/core/configurations/default/config/absences.default.json";
import tasksDefault from "@/core/configurations/default/config/tasks.default.json";
import meetingsDefault from "@/core/configurations/default/config/meetings.default.json";
import notificationsDefault from "@/core/configurations/default/config/notifications.default.json";
import paginationDefault from "@/core/configurations/default/config/pagination.default.json";
import authDefault from "@/core/configurations/default/config/auth.default.json";
import usersDefault from "@/core/configurations/default/config/users.default.json";
import exportDefault from "@/core/configurations/default/config/export.default.json";
import projectsDefault from "@/core/configurations/default/config/projects.default.json";
import recruitmentDefault from "@/core/configurations/default/config/recruitment.default.json";
import searchDefault from "@/core/configurations/default/config/search.default.json";
import trainingDefault from "@/core/configurations/default/config/training.default.json";
import assistantDefault from "@/core/configurations/default/config/assistant.default.json";
import sectionBannersDefault from "@/core/configurations/default/config/section-banners.default.json";

export interface AppConfig {
	absences: AbsencesConfig;
	tasks: TasksConfig;
	meetings: MeetingsConfig;
	notifications: NotificationsConfig;
	pagination: PaginationConfig;
	auth: AuthConfig;
	users: UsersConfig;
	export: ExportConfig;
	projects: ProjectsConfig;
	recruitment: RecruitmentConfig;
	search: SearchConfig;
	training: TrainingConfig;
	assistant: AssistantConfig;
	sectionBanners: SectionBannersConfig;
}

export type TenantOverrides = {
	[K in keyof AppConfig]?: Partial<AppConfig[K]>;
};

export class ConfigLoader {
	load(overrides?: TenantOverrides): AppConfig {
		return {
			absences: absencesConfigSchema.parse({ ...absencesDefault, ...overrides?.absences }),
			tasks: tasksConfigSchema.parse({ ...tasksDefault, ...overrides?.tasks }),
			meetings: meetingsConfigSchema.parse({ ...meetingsDefault, ...overrides?.meetings }),
			notifications: notificationsConfigSchema.parse({ ...notificationsDefault, ...overrides?.notifications }),
			pagination: paginationConfigSchema.parse({ ...paginationDefault, ...overrides?.pagination }),
			auth: authConfigSchema.parse({ ...authDefault, ...overrides?.auth }),
			users: usersConfigSchema.parse({ ...usersDefault, ...overrides?.users }),
			export: exportConfigSchema.parse({ ...exportDefault, ...overrides?.export }),
			projects: projectsConfigSchema.parse({ ...projectsDefault, ...overrides?.projects }),
			recruitment: recruitmentConfigSchema.parse({ ...recruitmentDefault, ...overrides?.recruitment }),
			search: searchConfigSchema.parse({ ...searchDefault, ...overrides?.search }),
			training: trainingConfigSchema.parse({ ...trainingDefault, ...overrides?.training }),
			assistant: assistantConfigSchema.parse({ ...assistantDefault, ...overrides?.assistant }),
			sectionBanners: sectionBannersConfigSchema.parse({
				...sectionBannersDefault,
				...overrides?.sectionBanners,
			}),
		};
	}
}
