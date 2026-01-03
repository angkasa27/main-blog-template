# AI Coding Agent Instructions

## Architecture Overview

This is a Next.js 16 App Router project with Better Auth authentication and Prisma ORM. Key characteristics:
- **Authentication**: Better Auth (NOT NextAuth) with email/password via Prisma adapter
- **Database**: PostgreSQL with Prisma, custom output to `src/generated/prisma/`
- **UI**: shadcn/ui components using base-vega style with Base UI React + Tailwind CSS 4
- **Package Manager**: pnpm with workspace configuration

## Critical Patterns

### Database & Prisma
- Prisma client generated to **custom location**: `src/generated/prisma/` (see [prisma/schema.prisma](prisma/schema.prisma#L8-L10))
- Import from `@/generated/prisma/client`, NOT `@prisma/client`
- Prisma instance configured with PG adapter in [src/lib/prisma.ts](src/lib/prisma.ts) using `@prisma/adapter-pg`
- Schema changes require: `pnpm prisma migrate dev` (uses [prisma.config.ts](prisma.config.ts))
- All database models (User, Session, Account, Verification) are Better Auth-specific schemas

### Authentication Flow
**Server-side** ([src/lib/auth.ts](src/lib/auth.ts)):
```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
```

**Client-side** ([src/lib/auth-client.ts](src/lib/auth-client.ts)):
```typescript
import { createAuthClient } from "better-auth/react";
export const { signIn, signUp, signOut, useSession } = createAuthClient();
```

**API Route**: [src/app/api/auth/\[...all\]/route.ts](src/app/api/auth/[...all]/route.ts) using `toNextJsHandler(auth)`

### Component & Import Patterns
- shadcn components: Import from `@/components/ui/*` (configured in [components.json](components.json))
- Path aliases: `@/lib`, `@/components`, `@/generated` (see [tsconfig.json](tsconfig.json))
- Theme provider wrapped in [src/providers/index.tsx](src/providers/index.tsx), included in root layout
- Client components use `"use client"` directive (e.g., [sign-in/page.tsx](src/app/sign-in/page.tsx))

### Styling
- Tailwind CSS 4 with PostCSS (@tailwindcss/postcss)
- Custom animations via `tw-animate-css`
- Theme system via `next-themes` with class attribute strategy
- Global styles in [src/app/globals.css](src/app/globals.css)

## Development Workflow

**Start dev server**: `pnpm dev` (NOT npm)

**Database migrations**:
```bash
pnpm prisma migrate dev --name <migration_name>
pnpm prisma generate  # Regenerates to src/generated/prisma/
```

**Add shadcn components**: `pnpm shadcn add <component>`

**Linting**: `pnpm lint` (ESLint 9 with flat config)

## Environment Setup
- Requires `DATABASE_URL` environment variable (PostgreSQL connection string)
- Used in [prisma.config.ts](prisma.config.ts) and [src/lib/prisma.ts](src/lib/prisma.ts)
- No .env file committed; create locally with PostgreSQL credentials

## Common Gotchas
1. **Never import from `@prisma/client`** - always use `@/generated/prisma/client`
2. **Better Auth ≠ NextAuth** - completely different APIs and patterns
3. **React 19 + React Compiler** enabled - babel-plugin-react-compiler in use
4. **Prisma adapter initialization** requires both PG pool and Prisma adapter layers
5. **Auth routes** must use `toNextJsHandler` wrapper for Next.js compatibility
