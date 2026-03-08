-- Add Program domain persistence for Memora Dashboard

-- Enums
CREATE TYPE "ProgramEnrollmentStatus" AS ENUM ('pending', 'active', 'paused', 'completed', 'cancelled');
CREATE TYPE "ProgramPhase" AS ENUM ('onboarding', 'discovery', 'training', 'practice', 'evaluation', 'graduation');
CREATE TYPE "ProgramInvitationStatus" AS ENUM ('pending', 'accepted', 'expired', 'cancelled');

-- Tables
CREATE TABLE "program_definitions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "defaultDurationDays" INTEGER NOT NULL,
    "enrollmentRoles" TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "banner" TEXT,
    "accentColor" TEXT NOT NULL,
    "prerequisites" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_definitions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "program_tracks" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "function" TEXT NOT NULL,
    "requiredCompetencies" TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
    "accompanimentLevel" TEXT NOT NULL,
    "formationIds" TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
    "phases" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_tracks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "program_enrollments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "status" "ProgramEnrollmentStatus" NOT NULL DEFAULT 'pending',
    "currentPhase" "ProgramPhase" NOT NULL DEFAULT 'onboarding',
    "startDate" TIMESTAMP(3) NOT NULL,
    "expectedEndDate" TIMESTAMP(3) NOT NULL,
    "actualEndDate" TIMESTAMP(3),
    "mentorId" TEXT NOT NULL,
    "milestoneProgress" JSONB NOT NULL,
    "accompanimentLog" JSONB NOT NULL,
    "phaseHistory" JSONB NOT NULL,
    "notes" JSONB NOT NULL,
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_enrollments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "program_invitations" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "inviteeEmail" TEXT NOT NULL,
    "inviteeName" TEXT NOT NULL,
    "assignedRoleId" TEXT NOT NULL,
    "mentorId" TEXT,
    "welcomeMessage" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "status" "ProgramInvitationStatus" NOT NULL DEFAULT 'pending',
    "createdBy" TEXT NOT NULL,
    "acceptedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_invitations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "program_training_spaces" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "modules" JSONB NOT NULL,
    "requiredPhase" "ProgramPhase" NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_training_spaces_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX "program_definitions_isOpen_idx" ON "program_definitions"("isOpen");
CREATE INDEX "program_tracks_programId_idx" ON "program_tracks"("programId");
CREATE INDEX "program_enrollments_userId_idx" ON "program_enrollments"("userId");
CREATE INDEX "program_enrollments_mentorId_idx" ON "program_enrollments"("mentorId");
CREATE INDEX "program_enrollments_entityId_idx" ON "program_enrollments"("entityId");
CREATE INDEX "program_enrollments_status_idx" ON "program_enrollments"("status");
CREATE INDEX "program_enrollments_programId_trackId_idx" ON "program_enrollments"("programId", "trackId");
CREATE INDEX "program_invitations_programId_idx" ON "program_invitations"("programId");
CREATE INDEX "program_invitations_trackId_idx" ON "program_invitations"("trackId");
CREATE INDEX "program_invitations_entityId_idx" ON "program_invitations"("entityId");
CREATE INDEX "program_invitations_status_idx" ON "program_invitations"("status");
CREATE INDEX "program_invitations_inviteeEmail_idx" ON "program_invitations"("inviteeEmail");
CREATE INDEX "program_training_spaces_programId_idx" ON "program_training_spaces"("programId");
CREATE INDEX "program_training_spaces_trackId_idx" ON "program_training_spaces"("trackId");

-- Foreign Keys
ALTER TABLE "program_tracks"
    ADD CONSTRAINT "program_tracks_programId_fkey"
    FOREIGN KEY ("programId") REFERENCES "program_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "program_enrollments"
    ADD CONSTRAINT "program_enrollments_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "program_enrollments"
    ADD CONSTRAINT "program_enrollments_mentorId_fkey"
    FOREIGN KEY ("mentorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "program_enrollments"
    ADD CONSTRAINT "program_enrollments_programId_fkey"
    FOREIGN KEY ("programId") REFERENCES "program_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "program_enrollments"
    ADD CONSTRAINT "program_enrollments_trackId_fkey"
    FOREIGN KEY ("trackId") REFERENCES "program_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "program_invitations"
    ADD CONSTRAINT "program_invitations_programId_fkey"
    FOREIGN KEY ("programId") REFERENCES "program_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "program_invitations"
    ADD CONSTRAINT "program_invitations_trackId_fkey"
    FOREIGN KEY ("trackId") REFERENCES "program_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "program_invitations"
    ADD CONSTRAINT "program_invitations_createdBy_fkey"
    FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "program_invitations"
    ADD CONSTRAINT "program_invitations_acceptedBy_fkey"
    FOREIGN KEY ("acceptedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "program_training_spaces"
    ADD CONSTRAINT "program_training_spaces_programId_fkey"
    FOREIGN KEY ("programId") REFERENCES "program_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "program_training_spaces"
    ADD CONSTRAINT "program_training_spaces_trackId_fkey"
    FOREIGN KEY ("trackId") REFERENCES "program_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
