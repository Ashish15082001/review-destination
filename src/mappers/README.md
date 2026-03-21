# Mappers Layer — `src/mappers/`

## Purpose

This folder contains **bidirectional data converters** (mappers) that translate between the two data representations used throughout the application:

| Representation       | Type suffix                                                         | Where used                                        |
| -------------------- | ------------------------------------------------------------------- | ------------------------------------------------- |
| **MongoDB document** | `*DataDocument` — fields use `ObjectId` for all ID/reference fields | Inside `src/repository/*` only                    |
| **Application data** | `*Data` — all IDs are plain `string` values                         | Everywhere else (actions, components, API routes) |

Mappers are the **only** place where `ObjectId ↔ string` conversion is allowed. This keeps `ObjectId` (a MongoDB/BSON concept) from leaking into application logic.

---

## Architecture & Patterns

### 1. Bidirectional Pair per Entity

Every mapper file exports exactly **two** functions:

```
mapXDataDocumentToXData    (MongoDB → Application)
mapXDataToXDataDocument    (Application → MongoDB)
```

### 2. Validate-on-Both-Sides (Double Fence Pattern)

Each mapper validates its **input** using the corresponding validator (`@/validators/*`) before mapping, and also validates the **output** before returning. This means every piece of data is shape-checked twice at every boundary crossing.

```ts
// Example: Document → App
export function mapCommentDataDocumentToCommentData(
  doc: CommentDataDocument,
): CommentData {
  const validated = validateCommentDataDocument(doc); // ← validate input (document shape)
  return validateCommentData({ ...mapped }); // ← validate output (app-data shape)
}
```

This double fence ensures:

- Corrupt or unexpected data from MongoDB is caught before use.
- Any logic error that produces a malformed app object is caught before it leaves the mapper.

### 3. `toObjectId` Utility for Safe Conversion

When converting `string → ObjectId` (Application → MongoDB direction), mappers use `toObjectId(id, fieldName)` from `@/utils/toObjectId`. This utility throws a descriptive error (including the field name) if the string is not a valid 24-character hex ObjectId, preventing silent failures.

```ts
_id: toObjectId(validatedData._id, "_id"),
```

### 4. Array Field Handling

Both directions map array ID fields element-by-element:

- **Document → App:** Each `ObjectId` in the array is converted via `.toString()`.
- **App → Document:** Each `string` in the array is converted via `toObjectId(id, fieldName)`.

Fields like `replyCommentIds`, `idsOfUsersWhoLiked`, `idsOfUsersWhoDisliked`, and `savedReviewesIds` are all handled this way.

### 5. Nullable References

Optional/nullable reference fields (e.g. `parentCommentId` on a comment) are handled with an explicit null-guard:

```ts
// Document → App
parentCommentId: validatedDoc.parentCommentId?.toString() ?? null,

// App → Document
parentCommentId: validatedData.parentCommentId
  ? toObjectId(validatedData.parentCommentId, "parentCommentId")
  : null,
```

---

## File-by-File Reference

### `comment.ts`

Converts between `CommentData` and `CommentDataDocument`.

Fields mapped (string ↔ ObjectId): `_id`, `parentCommentId` (nullable), `reviewId`, `commentedBy`, `replyCommentIds[]`, `idsOfUsersWhoLiked[]`, `idsOfUsersWhoDisliked[]`.

Scalar fields passed through unchanged: `commentedOn`, `comment`.

### `like.ts`

Converts between `LikeData` and `LikeDataDocument`.

Fields mapped (string ↔ ObjectId): `_id`, `reviewId`, `likedBy`.

Scalar fields passed through unchanged: `likedOn`.

### `review.ts`

Converts between `ReviewData` and `ReviewDataDocument`.

Fields mapped (string ↔ ObjectId): `_id`, `userId`.

Scalar fields passed through unchanged: `destinationName`, `whenVisited`, `description`, `experience`, `destinationPhotoUrls`, `datePosted`.

### `user.ts`

Converts between `UserData` and `UserDataDocument`.

Fields mapped (string ↔ ObjectId): `_id`, `savedReviewesIds[]`.

Scalar fields passed through unchanged: `userName`, `email`, `password`, `registeredAt`, `profilePictureUrl`.

### `userSession.ts`

Converts between `UserSessionData` and `UserSessionDataDocument`.

Fields mapped (string ↔ ObjectId): `_id`, `userId`.

Scalar fields passed through unchanged: `expiresOn`.

---

## Data Flow Diagram

```
MongoDB Collection
       │
       │  raw document (*DataDocument)
       ▼
  mapXDataDocumentToXData()
   ├─ validateXDataDocument(input)    ← guards against bad DB data
   ├─ ObjectId.toString() per ID field
   └─ validateXData(output)           ← guards against mapping bugs
       │
       │  application data (*Data)
       ▼
  Components / Actions / API Routes
       │
       │  application data (*Data)
       ▼
  mapXDataToXDataDocument()
   ├─ validateXData(input)            ← guards against bad app data
   ├─ toObjectId(id, fieldName)       ← throws with field name if invalid
   └─ validateXDataDocument(output)   ← guards against mapping bugs
       │
       │  document (*DataDocument)
       ▼
MongoDB Collection
```

---

## Dependencies

```
src/mappers/*
  ├── @/schema/*        ← TypeScript types for both app-data and documents
  ├── @/validators/*    ← Zod validators for both app-data and documents
  └── @/utils/toObjectId ← Safe string → ObjectId conversion with field-level error messages
```

---

## Important Notes for AI Agents

- **Mappers are not the place to add business logic.** They only convert shapes and validate. Any transformation beyond `string ↔ ObjectId` belongs in the repository or an action.
- **The double-validation pattern is intentional.** Do not collapse it into a single call. Both the input guard (catches bad external data) and the output guard (catches mapper implementation bugs) serve distinct purposes.
- **`toObjectId` will throw** if given an invalid hex string. Always ensure that string IDs passed into the App → Document direction are valid MongoDB ObjectId hex strings (24 characters, hex only).
- **Scalar, non-ID fields are passed through without transformation.** Only reference ID fields require `ObjectId` conversion.
- **Nullable fields must be handled explicitly.** Do not use optional chaining alone — always provide the `?? null` fallback so the output type remains `string | null` rather than `string | undefined`.
- **`savedReviewesIds` is a known typo in the schema** (missing an 'i'). Do not rename it without a corresponding migration — the MongoDB documents use this exact field name.
