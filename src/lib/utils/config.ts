// Constants & types
import authDefaults from "@/core/configurations/default/auth.default.json";
import paginationDefaults from "@/core/configurations/default/pagination.default.json";
import notificationsDefaults from "@/core/configurations/default/notifications.default.json";
import absencesDefaults from "@/core/configurations/default/absences.default.json";
import exportDefaults from "@/core/configurations/default/export.default.json";


/**
 * Returns authentication config merged with environment overrides
 * @returns Auth configuration object
 */
export function getAuthConfig() {
	return {
		...authDefaults,
		maxLoginAttempts: Number(process.env.MAX_LOGIN_ATTEMPTS) || authDefaults.maxLoginAttempts,
		sessionDurationDays: Number(process.env.SESSION_DURATION_DAYS) || authDefaults.sessionDurationDays,
	};
}

/**
 * Returns pagination configuration defaults
 * @returns Pagination configuration object
 */
export const getPaginationConfig = () => paginationDefaults;

/**
 * Returns notifications configuration defaults
 * @returns Notifications configuration object
 */
export const getNotificationsConfig = () => notificationsDefaults;

/**
 * Returns absences configuration defaults
 * @returns Absences configuration object
 */
export const getAbsencesConfig = () => absencesDefaults;

/**
 * Returns export configuration defaults
 * @returns Export configuration object
 */
export const getExportConfig = () => exportDefaults;
