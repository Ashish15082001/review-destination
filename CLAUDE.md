# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint
npm run seed:all     # Seed database (all data)
npm run seed:dummy   # Seed dummy data only
```

No test suite is configured — there are no unit or integration tests.

Database migration scripts are run via `npm run migrate:<name>` using `ts-node` with `tsconfig.scripts.json`.

## Architecture Overview

**Review Destination** is a Next.js 16 App Router application where users can post and browse destination reviews, comment, and react. It uses MongoDB directly (no ORM), Zod for runtime validation, and Tailwind CSS v4.

### Three-Layer Data Model

Every entity lives in three forms. Using `Review` as an example:

| Layer | Type | ID type | Where used |
|---|---|---|---|
| Browser | `ReviewDataBrowser` / `ReviewDataBrowserSchema` | — | Form payloads, contains `File[]` |
| Application | `ReviewData` / `ReviewDataSchema` | `string` | All in-memory code, server actions, components |
| Database | `ReviewDocument` / `ReviewDocumentSchema` | `ObjectId` | MongoDB only, never leaves the repository layer |

Schemas live in [src/schema/](src/schema/). Types are inferred from Zod schemas — never written manually.

### Data Flow

```
Form → Server Action (validates via *BrowserSchema, sanitizes with DOMPurify)
     → Repository function (maps Application → Document via mapper)
       → MongoDB
     ← Repository function (maps Document → Application via mapper)
  ← Server Action returns ApiResponse to client
```

### Mappers (Double-Fence Validation)

Every mapper in [src/mappers/](src/mappers/) validates **both** input and output — it calls the validator on the source type before converting, then validates the result type after. This catches both corrupt DB data and mapper bugs. `ObjectId` never escapes the repository layer.

Validators in [src/validators/](src/validators/) are thin wrappers that call `schema.parse()` and throw on failure.

### Repository Layer

[src/repository/](src/repository/) — one file per collection. All functions accept application types, return application types, and call mappers at each boundary. Functions that participate in transactions accept an optional `clientSession?: ClientSession` parameter. The repository **never** exposes `ObjectId` to callers.

Cached read functions use `"use cache"` + `cacheTag(...)` from `next/cache`. Call `revalidateTag(...)` after any mutation that should invalidate a cached read.

### Server Actions

[src/actions/](src/actions/) — all mutations. Each action:
1. Validates the session via `getUserDataUsingSession()` from the user repository
2. Sanitizes user-supplied text with DOMPurify (`src/utils/domPurify.ts`)
3. Validates form data against the relevant Zod schema
4. Calls repository functions (wrapped in a MongoDB transaction when multiple writes are needed)
5. Returns `ApiResponse` (`{ type: "success" | "error", message, fields? }`)

### Route Groups

```
src/app/
  (public)/            — All visitors: landing, reviews list, review detail
  (public-only)/       — Redirects authenticated users: auth, password reset
  (private-only)/      — Requires authentication: add review, profile, verify email
  api/                 — Route handlers for paginated/reactive data fetches
```

Auth gating is handled by `CheckAuth` (a Suspense-wrapped server component that reads the session cookie). Route group layouts import it with the appropriate `visibility` prop.

### API Routes

Used for data that is fetched on interaction or needs to avoid RSC re-renders:

- `GET /api/reviews` — paginated review list
- `POST/DELETE /api/like-review` — like toggle
- `POST/DELETE /api/like-comment`, `/api/dislike-comment` — comment reactions
- `GET /api/comment-replies` — nested replies
- `GET /api/comments-with-commenter-name-by-commentIds` — batch comment+user join

### Authentication

Cookie-based sessions stored in the `userSessions` MongoDB collection. The cookie contains a session ID and an HMAC signature (verified via `getSignature`/`verifySignature` in `src/utils/`). Sessions expire after 7 days. Password hashing uses bcrypt with a separately stored salt.

Email verification and password reset use tokens stored in dedicated collections (`emailVerification`, `PasswordReset`) and sent via the Resend API with React Email templates.

### Key Environment Variables

```
MONGODB_URI              # MongoDB connection string
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
RESEND_API_KEY
COOKIE_SECRET            # HMAC signing key for session cookies
```

### Notable Utilities

- `src/utils/domPurify.ts` — server-side DOMPurify (via jsdom) for stripping HTML from user input
- `src/utils/toObjectId.ts` — converts string → `ObjectId`, throws with field name on failure
- `src/utils/uploadImageToCloudinary.ts` — handles Cloudinary uploads from server actions
- `src/utils/hashPassword.ts` / `src/utils/verifyPassword.ts` — bcrypt wrappers

### MongoDB Collections

`reviews`, `comments`, `likes`, `users`, `userSessions`, `emailVerification`, `PasswordReset`

Database name: `review-destination`. Connection is pooled and cached in `src/database/mongoDB.ts` — use `getClientPromise()` for transactions, `get*Collection()` helpers for normal queries.
