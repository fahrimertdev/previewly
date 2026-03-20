// Re-export Prisma types for use across the app
// This avoids direct @prisma/client imports that can confuse some TS servers before generation
export type { Comment, Preview, Project, User } from '@prisma/client'
