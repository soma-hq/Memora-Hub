#!/bin/bash
# =============================================================================
# Memora Dashboard — Category Commit Script
# Execute with: bash scripts/commit.sh
# Branch target: dev
# Strategy: commits by category + 2 pushes total
# =============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

TOTAL_PUSHES=2
PUSH_COUNT=0
COMMIT_COUNT=0

print_header() {
  echo "=========================================="
  echo "  Memora Dashboard — Commit Script"
  echo "=========================================="
  echo ""
}

ensure_dev_branch() {
  local branch
  branch="$(git rev-parse --abbrev-ref HEAD)"
  if [[ "$branch" != "dev" ]]; then
    echo "Switching from '$branch' to 'dev'..."
    git checkout dev
  fi
}

stage_existing_paths() {
  local staged_any=1
  local path

  for path in "$@"; do
    if [[ -e "$path" ]] || git ls-files --error-unmatch "$path" >/dev/null 2>&1; then
      git add -A -- "$path"
      staged_any=0
    fi
  done

  return $staged_any
}

commit_category() {
  local message="$1"
  shift

  stage_existing_paths "$@" || true

  if git diff --cached --quiet; then
    echo "Skipped: $message"
    return 1
  fi

  git commit -m "$message"
  COMMIT_COUNT=$((COMMIT_COUNT + 1))
  return 0
}

push_dev() {
  PUSH_COUNT=$((PUSH_COUNT + 1))
  echo ""
  echo "Push $PUSH_COUNT/$TOTAL_PUSHES -> origin/dev"
  git push origin dev
  echo ""
}

phase_older_changes() {
  echo "Phase 1/2 — Older changes by category"

  commit_category "🔧 Updated project config and dependencies" \
    "package.json" \
    "yarn.lock" \
    ".yarnrc.yml" \
    "next.config.ts" \
    "middleware.ts"

  commit_category "🗃️ Updated prisma schema and seed files" \
    "prisma/schema.prisma" \
    "prisma/seed.ts"

  commit_category "♻️ Updated auth and session foundations" \
    "lib/auth" \
    "app/(auth)/layout.tsx" \
    "app/(auth)/a2f/page.tsx" \
    "app/(auth)/onboarding/page.tsx"

  commit_category "🔌 Updated API routes for core resources" \
    "app/api/absences" \
    "app/api/groups" \
    "app/api/projects"

  commit_category "♻️ Updated services and feature actions" \
    "services" \
    "features/absences/actions.ts" \
    "features/auth/actions.ts" \
    "features/groups/actions.ts" \
    "features/meetings/actions.ts" \
    "features/notifications/actions.ts" \
    "features/programs/actions.ts" \
    "features/projects/actions.ts" \
    "features/recruitment/actions.ts" \
    "features/tasks/actions.ts" \
    "features/training/actions.ts" \
    "features/users/actions.ts"

  commit_category "♻️ Updated stores and shared hooks" \
    "store" \
    "hooks/usePermission.ts" \
    "hooks/useModePalette.ts"

  commit_category "🏗️ Updated core data and design modules" \
    "core/data" \
    "core/design" \
    "core/configurations" \
    "core/engines"

  commit_category "💄 Updated owner and hub shell pages" \
    "app/global-error.tsx" \
    "app/globals.css" \
    "app/icon.tsx" \
    "app/(owner)" \
    "app/(protected)/hub/[groupId]/layout.tsx" \
    "app/(protected)/hub/[groupId]/page.tsx" \
    "app/(protected)/hub/[groupId]/chat/page.tsx" \
    "app/(protected)/hub/[groupId]/logs/page.tsx" \
    "app/(protected)/hub/[groupId]/meetings/page.tsx" \
    "app/(protected)/hub/[groupId]/mod-polyvalent" \
    "app/(protected)/hub/[groupId]/mod-twitch" \
    "app/(protected)/hub/[groupId]/error.tsx" \
    "app/(protected)/hub/[groupId]/loading.tsx"

  commit_category "💄 Updated shared layout and UI components" \
    "components/cards" \
    "components/feedback" \
    "components/layout/footer.tsx" \
    "components/layout/header.tsx" \
    "components/layout/mobile-sidebar.tsx" \
    "components/layout/page-container.tsx" \
    "components/layout/mode-popover.tsx" \
    "components/navigation" \
    "components/overlays" \
    "components/modals/entity-modal.tsx" \
    "components/modals/group-detail-modal.tsx" \
    "components/modals/meeting-detail-modal.tsx" \
    "components/modals/search-modal.tsx" \
    "components/ui"

  commit_category "♻️ Updated dashboard and notification widgets" \
    "features/dashboard" \
    "features/notifications/components/notification-bell.tsx" \
    "features/patchnotes/components/patchnote-widget.tsx" \
    "features/ping/components/ping-bubble.tsx"

  commit_category "♻️ Updated scripts, utilities and assets" \
    "scripts/onboarding/welcome-onboarding.ts" \
    "scripts/tutorial/tutorial-overlay.tsx" \
    "lib/server" \
    "lib/types" \
    "lib/utils/date.ts" \
    "public/icons/memora-ai.svg"

  push_dev
}

phase_recent_changes() {
  echo "Phase 2/2 — Recent UI and recap changes by category"

  commit_category "💄 Updated sidebar mode controls and labels" \
    "components/layout/sidebar.tsx" \
    "components/layout/admin-mode-popover.tsx" \
    "components/layout/legacy-mode-popover.tsx" \
    "components/layout/streamer-mode-popover.tsx" \
    "components/layout/right-sidebar.tsx"

  commit_category "✨ Added post-login recap briefing modal flow" \
    "components/modals/missed-events-modal.tsx" \
    "scripts/onboarding/missed-events-briefing.ts" \
    "app/(auth)/login/page.tsx" \
    "app/(protected)/layout.tsx" \
    "app/(owner)/layout.tsx" \
    "app/(legacy)/layout.tsx" \
    "features/auth/components/login-form.tsx"

  commit_category "🔧 Updated commit automation for two pushes" \
    "scripts/commit.sh"

  push_dev
}

main() {
  print_header
  ensure_dev_branch

  phase_older_changes
  phase_recent_changes

  echo "=========================================="
  echo "Done: $COMMIT_COUNT commits, $PUSH_COUNT pushes"
  echo "=========================================="
}

main
