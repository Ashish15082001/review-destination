# Schema Layer — `src/schema/`

## Purpose

This folder defines **all Zod schemas and their inferred TypeScript types** for the application. It is the single source of truth for data shapes. Every layer — mappers, validators, repository, and actions — imports its types from here.

No validation logic or data transformation lives here. This folder is purely **declarations**.

---

## Architecture & Patterns

### 1. Three-Tier Schema Model

Most entities have **three distinct representations**, each captured by its own schema:

| Tier | Suffix | ID fields | Used in |
|---|---|---|---|
| Browser payload | `*BrowserSchema` | N/A (no `_id`) | Form submissions from the client |
| MongoDB document | `*DataDocumentSchema` | `ObjectId` | `src/repository/*`, `src/mappers/*` |
| Application data | `*DataSchema` | `string` | Actions, API routes, components |

> `comment.ts` and `like.ts` have no browser payload schema — they do not receive raw form submissions directly.

### 2. Types Are Always Inferred from Schemas (Never Written by Hand)

```ts
export type CommentData = z.infer<typeof CommentDataSchema>;
```

TypeScript types are derived with `z.infer`. This guarantees the runtime schema and the compile-time type are always in sync — updating the schema automatically updates the type.

### 3. Base Schema Extension (`extend`) for DRY Field Reuse

Where document and application schemas share all scalar fields, the app-level schema **extends** the document schema and overrides only the ID fields:

```ts
// review.ts
export const ReviewDataSchema = ReviewDataDocumentSchema.extend({
  _id: z.string(),
  userId: z.string(),
});
```

This means scalar fields (`destinationName`, `datePosted`, etc.) are defined once in the document schema and inherited by the app schema.

### 4. `BaseReviewSchema` and `BaseUserFields` for Shared Constraint Reuse

Fields with validation constraints (min length, format, etc.) that appear in multiple schemas are defined once as a base and extended or spread into all consumers:

```ts
// review.ts — shared base for browser, document, and app schemas
const BaseReviewSchema = z.object({
  destinationName: z.string().min(1, "Destination name is required"),
  ...
});

// user.ts — shared field definitions spread into browser schemas
const BaseUserFields = {
  userName: z.string().min(1, "User name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
};
```

### 5. `CommentDataWithCommenterData` — Enriched Schema via `.extend()`

`comment.ts` defines two extra schemas for comment data that has been joined with user profile data at query time:

```ts
export const CommentDataWithCommenterDataSchema = CommentDataSchema.extend({
  commenterName: z.string(),
  profilePictureUrl: z.string(),
});
```

These are used by repository functions that resolve the commenter's name and avatar in a single batch query.

---

## File-by-File Reference

### `comment.ts`

| Export | Kind | Description |
|---|---|---|
| `CommentDataDocumentSchema` | Zod schema | MongoDB document; all IDs as `ObjectId`, arrays of `ObjectId` |
| `CommentDataSchema` | Zod schema | Application data; all IDs as `string`, arrays of `string` |
| `CommentDataWithCommenterDataSchema` | Zod schema | App data enriched with `commenterName` + `profilePictureUrl` |
| `CommentDataWithCommenterDataDocumentSchema` | Zod schema | Document enriched with `commenterName` + `profilePictureUrl` |
| `CommentDataDocument` | TypeScript type | Inferred from `CommentDataDocumentSchema` |
| `CommentData` | TypeScript type | Inferred from `CommentDataSchema` |
| `CommentDataWithCommenterData` | TypeScript type | Inferred from `CommentDataWithCommenterDataSchema` |
| `CommentDataWithCommenterDataDocument` | TypeScript type | Inferred from `CommentDataWithCommenterDataDocumentSchema` |

**Key fields:**
- `parentCommentId` — nullable; `null` for top-level comments, set for replies
- `replyCommentIds[]` — IDs of direct child reply comments
- `idsOfUsersWhoLiked[]` / `idsOfUsersWhoDisliked[]` — reaction tracking arrays
- `comment` — validated: min 1, max 500 characters

### `like.ts`

| Export | Kind | Description |
|---|---|---|
| `LikeDataDocumentSchema` | Zod schema | MongoDB document; IDs as `ObjectId` |
| `LikeDataSchema` | Zod schema | Application data; IDs as `string` |
| `LikeDataDocument` | TypeScript type | Inferred from `LikeDataDocumentSchema` |
| `LikeData` | TypeScript type | Inferred from `LikeDataSchema` |

**Key fields:**
- `reviewId` — the review being liked
- `likedBy` — the user who liked it
- `likedOn` — timestamp of the like

### `review.ts`

| Export | Kind | Description |
|---|---|---|
| `ReviewDataBrowserSchema` | Zod schema | Browser form payload; includes `File[]` for photo uploads |
| `ReviewDataDocumentSchema` | Zod schema | MongoDB document; extends `BaseReviewSchema`; IDs as `ObjectId` |
| `ReviewDataSchema` | Zod schema | Application data; extends document schema, overrides IDs to `string` |
| `ReviewDataBrowser` | TypeScript type | Inferred from `ReviewDataBrowserSchema` |
| `ReviewDataDocument` | TypeScript type | Inferred from `ReviewDataDocumentSchema` |
| `ReviewData` | TypeScript type | Inferred from `ReviewDataSchema` |

**Key fields:**
- `destinationPhotos` (`ReviewDataBrowser` only) — array of `File` objects, min 1, non-empty file size validated
- `destinationPhotoUrls` — array of uploaded photo URLs (present after server-side upload)
- `experience` / `description` — both required, min 1 character

### `user.ts`

| Export | Kind | Description |
|---|---|---|
| `SignInUserDataFromBrowserSchema` | Zod schema | Sign-in form: `email` + `password` |
| `SignUpUserDataFromBrowserSchema` | Zod schema | Sign-up form: `userName`, `email`, `password`, `confirmPassword`, `profilePicture` (File) |
| `UserDataDocumentSchema` | Zod schema | MongoDB document; `_id` + `savedReviewesIds[]` as `ObjectId` |
| `UserDataSchema` | Zod schema | Application data; extends document schema, overrides IDs to `string` |
| `SignInUserDataFromBrowser` | TypeScript type | Inferred from `SignInUserDataFromBrowserSchema` |
| `SignUpUserDataFromBrowser` | TypeScript type | Inferred from `SignUpUserDataFromBrowserSchema` |
| `UserDataDocument` | TypeScript type | Inferred from `UserDataDocumentSchema` |
| `UserData` | TypeScript type | Inferred from `UserDataSchema` |

**Key fields:**
- `confirmPassword` — browser-only, not stored; used for client-side match validation
- `profilePicture` (`SignUpUserDataFromBrowser`) — `File` object, non-empty size validated
- `profilePictureUrl` — stored URL after server-side upload
- `savedReviewesIds[]` — array of saved review IDs (**note:** `savedException` typo in field name is intentional — must match the MongoDB collection field name)

### `userSession.ts`

| Export | Kind | Description |
|---|---|---|
| `UserSessionDataDocumentSchema` | Zod schema | MongoDB document; `_id` + `userId` as `ObjectId` |
| `UserSessionDataSchema` | Zod schema | Application data; extends document schema, overrides IDs to `string` |
| `UserSessionDataDocument` | TypeScript type | Inferred from `UserSessionDataDocumentSchema` |
| `UserSessionData` | TypeScript type | Inferred from `UserSessionDataSchema` |

**Key fields:**
- `userId` — links the session to its owner
- `expiresOn` — expiry timestamp; checked at read time in `src/repository/user.ts`

---

## Dependencies

```
src/schema/*
  ├── zod          ← Schema definition and runtime validation
  └── mongodb      ← ObjectId (used in *DocumentSchema definitions)
```

This folder has no internal dependencies — it does **not** import from any other `src/` folder.

---

## Important Notes for AI Agents

- **This folder is the single source of truth for all types.** Never define a `*Data` or `*DataDocument` type by hand elsewhere — always import from here.
- **Never write TypeScript types manually for schema-backed entities.** Use `z.infer<typeof XSchema>` so the type always stays in sync with the runtime schema.
- **`*DocumentSchema` uses `z.instanceof(ObjectId)` from `mongodb`.** Do not confuse this with `ObjectId` from `bson` — both exist in the project but the schema uses `mongodb`.
- **`*DataSchema` always uses `z.string()` for IDs.** ObjectId never appears in the application-layer schemas.
- **Browser schemas (`*BrowserSchema`) contain `File` fields** (`z.instanceof(File)`). These types are only valid in a browser environment and must never be passed to server-side code directly — actions extract the values and process them separately.
- **`confirmPassword` is browser-only.** It is not stored and does not appear in `UserDataSchema` or `UserDataDocumentSchema`. Cross-field match validation (password === confirmPassword) is the responsibility of the validator layer (`src/validators/user.ts`), not the schema.
- **`savedReviewesIds` is a known typo** (missing 'i'). Do not rename it without a corresponding database migration.
- **Do not add business logic to this folder.** Constraints like `.min()`, `.max()`, and `.refine()` that describe the field's invariant are acceptable. Constraints that depend on other services or runtime context belong in the validator or action layer.
