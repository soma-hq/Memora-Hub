#!/bin/bash
# =============================================================================
# Memora Hub — Commit Script
# Execute with: bash scripts/commit.sh
# Branch: dev
# =============================================================================

set -e

echo "=========================================="
echo "  Memora Hub — Commit Script"
echo "=========================================="
echo ""

# Check we are on dev
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "dev" ]; then
  echo "⚠️  Not on dev branch (current: $BRANCH). Switching..."
  git checkout dev
fi

TOTAL=45
N=0

commit_group() {
  N=$((N+1))
  echo "$N/$TOTAL — $1"
  git commit -m "$1"
  echo ""
}

echo "📋 Staging and committing by category..."
echo ""

# ---------------------------------------------------------------------------
# 1 — .gitignore
# ---------------------------------------------------------------------------
git add .gitignore
commit_group "🔧 Updated .gitignore: docs, mock data JSON, env files"

# ---------------------------------------------------------------------------
# 2 — Core config + permissions + constants
# ---------------------------------------------------------------------------
git add \
  constants.ts \
  core/config/capabilities.ts \
  core/config/index.ts \
  core/config/roles.ts \
  core/config/teams.ts \
  core/permissions/capabilityMap.ts \
  core/permissions/guards.ts \
  core/permissions/index.ts \
  core/permissions/roleMap.ts
commit_group "♻️ Refactored core config, roles, capabilities and permissions map"

# ---------------------------------------------------------------------------
# 3 — Core design + i18n
# ---------------------------------------------------------------------------
git add \
  core/design/states.ts \
  core/design/themes.ts \
  core/design/section-colors.ts \
  core/i18n/en.ts \
  core/i18n/fr.ts
commit_group "💄 Updated design tokens, section colors and i18n (en/fr)"

# ---------------------------------------------------------------------------
# 4 — Core engines + structures
# ---------------------------------------------------------------------------
git add \
  core/engines/ScoringEngine.ts \
  core/engines/WorkflowEngine.ts \
  core/structures/Event.ts \
  structures/PageConfig.ts \
  structures/ScriptConfig.ts \
  structures/conventions.ts \
  structures/index.ts
commit_group "✨ Updated ScoringEngine, WorkflowEngine and added shared structures"

# ---------------------------------------------------------------------------
# 5 — Core data types (.ts only — JSON excluded via .gitignore)
# ---------------------------------------------------------------------------
git add \
  core/data/entities.ts \
  core/data/users.ts
commit_group "✨ Added core data type definitions (entities, users)"

# ---------------------------------------------------------------------------
# 6 — Auth, security & middleware
# ---------------------------------------------------------------------------
git add \
  lib/auth/jwt.ts \
  lib/auth/password.ts \
  core/security/a2f.service.ts \
  middleware.ts
commit_group "🔑 Updated JWT, password, A2F service and middleware"

# ---------------------------------------------------------------------------
# 7 — Lib: export, utils, validators
# ---------------------------------------------------------------------------
git add \
  lib/export/csv.ts \
  lib/export/excel.ts \
  lib/export/pdf.ts \
  lib/export/utils.ts \
  lib/utils/toast.ts \
  lib/validators/schemas.ts
commit_group "♻️ Updated export helpers, toast utility and validation schemas"

# ---------------------------------------------------------------------------
# 8 — Managers
# ---------------------------------------------------------------------------
git add \
  managers/AssistantManager.ts \
  managers/CacheManager.ts \
  managers/ConfigurationManager.ts \
  managers/DatabaseManager.ts \
  managers/ErrorManager.ts \
  managers/ExportManager.ts \
  managers/NotificationManager.ts \
  managers/StorageManager.ts
commit_group "♻️ Refactored all managers (Assistant, Cache, DB, Export, ...)"

# ---------------------------------------------------------------------------
# 9 — Services
# ---------------------------------------------------------------------------
git add \
  services/AbsenceService.ts \
  services/AssistantService.ts \
  services/GroupService.ts \
  services/MeetingService.ts \
  services/NotificationService.ts \
  services/ProjectService.ts \
  services/ProgramService.ts \
  services/RecruitmentService.ts \
  services/TaskService.ts \
  services/TrainingService.ts \
  services/UserService.ts
commit_group "✨ Updated all services + added ProgramService"

# ---------------------------------------------------------------------------
# 10 — Store (Zustand)
# ---------------------------------------------------------------------------
git add \
  store/assistant.store.ts \
  store/chat.store.ts \
  store/data.store.ts \
  store/ping.store.ts \
  store/ui.store.ts
commit_group "♻️ Refactored Zustand stores (assistant, chat, data, ping, ui)"

# ---------------------------------------------------------------------------
# 11 — Hooks
# ---------------------------------------------------------------------------
git add hooks/usePermission.ts
commit_group "♻️ Updated usePermission hook"

# ---------------------------------------------------------------------------
# 12 — App root layout & global pages
# ---------------------------------------------------------------------------
git add \
  "app/layout.tsx" \
  "app/page.tsx" \
  "app/icon.tsx" \
  "app/global-error.tsx" \
  "app/not-found.tsx"
commit_group "♻️ Updated root layout, entry page and global error/not-found"

# ---------------------------------------------------------------------------
# 13 — Auth pages
# ---------------------------------------------------------------------------
git add \
  "app/(auth)/a2f/page.tsx" \
  "app/(auth)/login/page.tsx" \
  "app/(auth)/onboarding/page.tsx"
commit_group "♻️ Updated auth pages (login, A2F, onboarding)"

# ---------------------------------------------------------------------------
# 14 — Admin & owner pages
# ---------------------------------------------------------------------------
git add \
  "app/(owner)/admin/access/page.tsx" \
  "app/(owner)/admin/alerts/page.tsx" \
  "app/(owner)/admin/dev/page.tsx" \
  "app/(owner)/admin/links/page.tsx" \
  "app/(owner)/admin/page.tsx" \
  "app/(owner)/admin/stats/page.tsx" \
  "app/(owner)/admin/trash/page.tsx" \
  "app/(owner)/users/[userId]/page.tsx" \
  "app/(owner)/users/page.tsx" \
  "app/(owner)/stats/page.tsx" \
  "app/(owner)/groups/page.tsx"
commit_group "✨ Updated admin panel pages + added Groups owner page, removed stats page"

# ---------------------------------------------------------------------------
# 15 — Protected layout + settings + profile
# ---------------------------------------------------------------------------
git add \
  "app/(protected)/layout.tsx" \
  "app/(protected)/profile/page.tsx" \
  "app/(protected)/settings/account/page.tsx" \
  "app/(protected)/settings/data/page.tsx" \
  "app/(protected)/settings/notifications/page.tsx" \
  "app/(protected)/settings/preferences/page.tsx" \
  "app/(protected)/settings/security/page.tsx"
commit_group "♻️ Updated protected layout, profile and settings pages"

# ---------------------------------------------------------------------------
# 16 — Hub: core pages (dashboard, chat, logs, patchnotes, meetings)
# ---------------------------------------------------------------------------
git add \
  "app/(protected)/hub/[groupId]/page.tsx" \
  "app/(protected)/hub/[groupId]/chat/page.tsx" \
  "app/(protected)/hub/[groupId]/logs/page.tsx" \
  "app/(protected)/hub/[groupId]/patchnotes/page.tsx" \
  "app/(protected)/hub/[groupId]/meetings/page.tsx"
commit_group "♻️ Updated hub core pages (dashboard, chat, logs, patchnotes, meetings)"

# ---------------------------------------------------------------------------
# 17 — Hub: moderation (generic)
# ---------------------------------------------------------------------------
git add \
  "app/(protected)/hub/[groupId]/moderation/centre-info/echelle/page.tsx" \
  "app/(protected)/hub/[groupId]/moderation/centre-info/page.tsx" \
  "app/(protected)/hub/[groupId]/moderation/centre-info/tickets/page.tsx" \
  "app/(protected)/hub/[groupId]/moderation/centre-info/tips/page.tsx" \
  "app/(protected)/hub/[groupId]/moderation/consignes/page.tsx" \
  "app/(protected)/hub/[groupId]/moderation/marsha-bot/page.tsx" \
  "app/(protected)/hub/[groupId]/moderation/page.tsx" \
  "app/(protected)/hub/[groupId]/moderation/politique/page.tsx" \
  "app/(protected)/hub/[groupId]/moderation/sanctions/page.tsx"
commit_group "♻️ Updated hub moderation module pages"

# ---------------------------------------------------------------------------
# 18 — Hub: mod-polyvalent
# ---------------------------------------------------------------------------
git add \
  "app/(protected)/hub/[groupId]/mod-polyvalent/centre-info/echelle/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-polyvalent/centre-info/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-polyvalent/centre-info/tickets/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-polyvalent/centre-info/tips/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-polyvalent/consignes/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-polyvalent/marsha-bot/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-polyvalent/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-polyvalent/politique/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-polyvalent/sanctions/page.tsx"
commit_group "♻️ Updated hub mod-polyvalent module pages"

# ---------------------------------------------------------------------------
# 19 — Hub: mod-twitch
# ---------------------------------------------------------------------------
git add \
  "app/(protected)/hub/[groupId]/mod-twitch/centre-info/echelle/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-twitch/centre-info/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-twitch/centre-info/tickets/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-twitch/centre-info/tips/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-twitch/consignes/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-twitch/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-twitch/politique/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-twitch/sanctions/page.tsx"
commit_group "♻️ Updated hub mod-twitch module pages"

# ---------------------------------------------------------------------------
# 20 — Hub: mod-youtube
# ---------------------------------------------------------------------------
git add \
  "app/(protected)/hub/[groupId]/mod-youtube/centre-info/echelle/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-youtube/centre-info/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-youtube/centre-info/tickets/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-youtube/centre-info/tips/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-youtube/consignes/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-youtube/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-youtube/politique/page.tsx" \
  "app/(protected)/hub/[groupId]/mod-youtube/sanctions/page.tsx"
commit_group "♻️ Updated hub mod-youtube module pages"

# ---------------------------------------------------------------------------
# 21 — Hub: momentum
# ---------------------------------------------------------------------------
git add \
  "app/(protected)/hub/[groupId]/momentum/management/page.tsx" \
  "app/(protected)/hub/[groupId]/momentum/sessions/[sessionId]/page.tsx" \
  "app/(protected)/hub/[groupId]/momentum/sessions/page.tsx" \
  "app/(protected)/hub/[groupId]/momentum/space/page.tsx"
commit_group "♻️ Updated hub momentum module pages"

# ---------------------------------------------------------------------------
# 22 — Hub: personnel
# ---------------------------------------------------------------------------
git add \
  "app/(protected)/hub/[groupId]/personnel/absences/page.tsx" \
  "app/(protected)/hub/[groupId]/personnel/planning/page.tsx" \
  "app/(protected)/hub/[groupId]/personnel/projects/page.tsx" \
  "app/(protected)/hub/[groupId]/personnel/tasks/page.tsx"
commit_group "♻️ Updated hub personnel module pages"

# ---------------------------------------------------------------------------
# 23 — Hub: projects
# ---------------------------------------------------------------------------
git add \
  "app/(protected)/hub/[groupId]/projects/[projectId]/page.tsx" \
  "app/(protected)/hub/[groupId]/projects/page.tsx"
commit_group "♻️ Updated hub projects pages"

# ---------------------------------------------------------------------------
# 24 — Hub: recruitment
# ---------------------------------------------------------------------------
git add \
  "app/(protected)/hub/[groupId]/recruitment/admin/page.tsx" \
  "app/(protected)/hub/[groupId]/recruitment/calendar/page.tsx" \
  "app/(protected)/hub/[groupId]/recruitment/candidates/page.tsx" \
  "app/(protected)/hub/[groupId]/recruitment/espace/page.tsx" \
  "app/(protected)/hub/[groupId]/recruitment/page.tsx" \
  "app/(protected)/hub/[groupId]/recruitment/sessions/[sessionId]/page.tsx"
commit_group "♻️ Updated hub recruitment module pages"

# ---------------------------------------------------------------------------
# 25 — Hub: tasks
# ---------------------------------------------------------------------------
git add \
  "app/(protected)/hub/[groupId]/tasks/[taskId]/page.tsx" \
  "app/(protected)/hub/[groupId]/tasks/page.tsx"
commit_group "♻️ Updated hub tasks pages"

# ---------------------------------------------------------------------------
# 26 — Hub: new modules (permissions, programs)
# ---------------------------------------------------------------------------
git add \
  "app/(protected)/hub/[groupId]/permissions/page.tsx" \
  "app/(protected)/hub/[groupId]/programs/page.tsx"
commit_group "✨ Added hub permissions and programs pages"

# ---------------------------------------------------------------------------
# 27 — Legacy mode
# ---------------------------------------------------------------------------
git add \
  "app/(legacy)/layout.tsx" \
  "app/(legacy)/legacy/page.tsx" \
  components/layout/legacy-mode-popover.tsx
commit_group "✨ Added legacy mode layout and popover component"

# ---------------------------------------------------------------------------
# 28 — API routes
# ---------------------------------------------------------------------------
git add \
  "app/api/groups/[id]/route.ts" \
  "app/api/meetings/[id]/attendees/route.ts" \
  "app/api/meetings/[id]/route.ts" \
  "app/api/tasks/[id]/route.ts" \
  "app/api/tasks/[id]/subtasks/[subtaskId]/route.ts" \
  "app/api/tasks/[id]/subtasks/route.ts"
commit_group "♻️ Updated API routes (groups, meetings, tasks, subtasks)"

# ---------------------------------------------------------------------------
# 29 — Components: layout + navigation + providers
# ---------------------------------------------------------------------------
git add \
  components/layout/header.tsx \
  components/layout/mobile-sidebar.tsx \
  components/layout/page-container.tsx \
  components/layout/sidebar.tsx \
  components/navigation/mobile-nav.tsx \
  components/navigation/role-guard.tsx \
  components/providers/theme-provider.tsx
commit_group "♻️ Updated layout components, navigation guards and theme provider"

# ---------------------------------------------------------------------------
# 30 — Components: modals
# ---------------------------------------------------------------------------
git add \
  components/modals/entity-modal.tsx \
  components/modals/group-detail-modal.tsx \
  components/modals/meeting-detail-modal.tsx \
  components/modals/search-modal.tsx \
  components/modals/task-detail-modal.tsx \
  components/modals/user-modal.tsx
commit_group "♻️ Updated all modal components"

# ---------------------------------------------------------------------------
# 31 — Components: UI display, feedback, inputs
# ---------------------------------------------------------------------------
git add \
  components/ui/display/avatar.tsx \
  components/ui/display/avatar-group.tsx \
  components/ui/display/card.tsx \
  components/ui/display/stat-card.tsx \
  components/ui/display/index.ts \
  components/ui/display/section-header-banner.tsx \
  components/ui/display/styled-empty-state.tsx \
  components/ui/feedback/index.ts \
  components/ui/feedback/wizard-modal.tsx \
  components/ui/inputs/select-menu.tsx \
  components/feedback/alert.tsx \
  components/feedback/confirm-action.tsx
commit_group "♻️ Updated UI components: display, feedback, inputs + new SectionHeaderBanner, StyledEmptyState, WizardModal"

# ---------------------------------------------------------------------------
# 32 — Features: auth + users
# ---------------------------------------------------------------------------
git add \
  features/auth/components/login-form.tsx \
  features/users/components/user-archives.tsx \
  features/users/components/user-form.tsx \
  features/users/components/user-list.tsx \
  features/users/hooks.ts \
  features/users/permissions.ts \
  features/users/types.ts
commit_group "♻️ Updated auth login form and users feature (components, hooks, types)"

# ---------------------------------------------------------------------------
# 33 — Features: groups
# ---------------------------------------------------------------------------
git add \
  features/groups/actions.ts \
  features/groups/components/group-form.tsx \
  features/groups/components/group-list.tsx \
  features/groups/components/group-members.tsx \
  features/groups/hooks.ts \
  features/groups/permissions.ts \
  features/groups/types.ts
commit_group "♻️ Updated groups feature (actions, components, hooks, permissions)"

# ---------------------------------------------------------------------------
# 34 — Features: tasks + meetings
# ---------------------------------------------------------------------------
git add \
  features/tasks/actions.ts \
  features/tasks/components/task-board.tsx \
  features/tasks/components/task-form.tsx \
  features/tasks/components/task-list.tsx \
  features/tasks/hooks.ts \
  features/tasks/permissions.ts \
  features/tasks/types.ts \
  features/meetings/actions.ts \
  features/meetings/components/calendar-widget.tsx \
  features/meetings/components/meeting-form.tsx \
  features/meetings/components/meeting-list.tsx \
  features/meetings/hooks.ts \
  features/meetings/permissions.ts \
  features/meetings/types.ts
commit_group "♻️ Updated tasks and meetings features"

# ---------------------------------------------------------------------------
# 35 — Features: projects
# ---------------------------------------------------------------------------
git add \
  features/projects/actions.ts \
  features/projects/components/project-board-view.tsx \
  features/projects/components/project-card.tsx \
  features/projects/components/project-creation-wizard.tsx \
  features/projects/components/project-form.tsx \
  features/projects/components/project-list.tsx \
  features/projects/components/project-relations.tsx \
  features/projects/components/project-timeline.tsx
commit_group "♻️ Updated projects feature (board, timeline, wizard, relations)"

# ---------------------------------------------------------------------------
# 36 — Features: dashboard
# ---------------------------------------------------------------------------
git add \
  features/dashboard/components/briefing-section.tsx \
  features/dashboard/components/meetings-widget.tsx \
  features/dashboard/components/pending-actions.tsx \
  features/dashboard/components/projects-widget.tsx \
  features/dashboard/components/stat-widget.tsx \
  features/dashboard/components/tasks-widget.tsx \
  features/dashboard/components/today-schedule.tsx \
  features/dashboard/components/welcome-banner.tsx \
  features/dashboard/hooks.ts \
  features/dashboard/utils/briefing-engine.ts
commit_group "♻️ Updated dashboard widgets, briefing engine and hooks"

# ---------------------------------------------------------------------------
# 37 — Features: recruitment + momentum
# ---------------------------------------------------------------------------
git add \
  features/recruitment/components/candidate-detail.tsx \
  features/recruitment/components/timeline-recruitment.tsx \
  features/recruitment/types.ts \
  features/momentum/components/competency-grid.tsx \
  features/momentum/components/fsi-panel.tsx \
  features/momentum/components/launch-form.tsx \
  features/momentum/hooks.ts \
  features/momentum/types.ts
commit_group "♻️ Updated recruitment and momentum features"

# ---------------------------------------------------------------------------
# 38 — Features: notifications + alerts + ping
# ---------------------------------------------------------------------------
git add \
  features/notifications/components/activity-log.tsx \
  features/notifications/components/notification-center.tsx \
  features/notifications/components/notification-item.tsx \
  features/notifications/components/notification-list.tsx \
  features/notifications/components/ping-section.tsx \
  features/notifications/types.ts \
  features/alerts/components/alert-banner.tsx \
  features/alerts/components/alert-bell-admin.tsx \
  features/alerts/types.ts \
  features/ping/components/ping-bubble.tsx \
  features/ping/types.ts
commit_group "♻️ Updated notifications, alerts and ping features"

# ---------------------------------------------------------------------------
# 39 — Features: moderation (new)
# ---------------------------------------------------------------------------
git add features/moderation/
commit_group "✨ Added moderation feature (politique content component)"

# ---------------------------------------------------------------------------
# 40 — Features: programs (new)
# ---------------------------------------------------------------------------
git add \
  features/programs/actions.ts \
  features/programs/permissions.ts \
  features/programs/types.ts
commit_group "✨ Added programs feature (actions, permissions, types)"

# ---------------------------------------------------------------------------
# 41 — Features: personnel + absences
# ---------------------------------------------------------------------------
git add \
  features/absences/components/absence-form.tsx \
  features/absences/components/absence-list.tsx \
  features/personnel/components/absence-card.tsx \
  features/personnel/hooks.ts
commit_group "♻️ Updated personnel and absences features"

# ---------------------------------------------------------------------------
# 42 — Features: assistant
# ---------------------------------------------------------------------------
git add \
  features/assistant/action-engine.ts \
  features/assistant/components/assistant-action-card.tsx \
  features/assistant/components/assistant-message.tsx \
  features/assistant/components/assistant-typing-indicator.tsx \
  features/assistant/components/assistant-welcome.tsx \
  features/assistant/constants.ts \
  features/assistant/context-engine.ts \
  features/assistant/history-manager.ts \
  features/assistant/hooks.ts \
  features/assistant/intent-engine.ts \
  features/assistant/response-templates.ts \
  features/assistant/smart-commands.ts \
  features/assistant/suggestion-engine.ts \
  features/assistant/types.ts
commit_group "♻️ Refactored assistant feature (engines, components, hooks)"

# ---------------------------------------------------------------------------
# 43 — Features: patchnotes + chat + tutorial
# ---------------------------------------------------------------------------
git add \
  features/chat/types.ts \
  features/patchnotes/components/patchnote-bell.tsx \
  features/patchnotes/components/patchnote-panel.tsx \
  features/patchnotes/components/patchnote-widget.tsx \
  features/patchnotes/components/update-announcement.tsx \
  features/patchnotes/data/patchnotes.ts \
  features/patchnotes/types.ts \
  features/tutorial/data/tutorial-steps.ts
commit_group "♻️ Updated patchnotes, chat and tutorial features"

# ---------------------------------------------------------------------------
# 44 — Scripts + onboarding + tutorial overlay
# ---------------------------------------------------------------------------
git add \
  scripts/onboarding/welcome-onboarding.ts \
  scripts/tutorial/hub-tutorial.ts \
  scripts/tutorial/tutorial-overlay.tsx \
  scripts/types.ts \
  scripts/commit.sh
commit_group "♻️ Updated scripts (onboarding, tutorial) and commit script"

# ---------------------------------------------------------------------------
# 45 — Public assets
# ---------------------------------------------------------------------------
git add public/banners/memora-banner.png
commit_group "🖼️ Added Memora banner asset"

# ---------------------------------------------------------------------------
# Done — push
# ---------------------------------------------------------------------------
echo "=========================================="
echo "  ✅ $TOTAL commits created"
echo "=========================================="
echo ""
git log --oneline -"$TOTAL"
echo ""
echo "🚀 Pushing to dev..."
git push origin dev
echo ""
echo "✅ Pushed to dev successfully."
