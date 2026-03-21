# Repository Layer — `src/repository/`

## Purpose

This folder is the **data access layer (DAL)** of the application. All direct interactions with MongoDB live here. No other layer should query the database directly — everything goes through these functions.

Each file corresponds to one MongoDB collection / domain entity:

| File             | Collection     | Domain Entity              |
| ---------------- | -------------- | -------------------------- |
| `comment.ts`     | `comments`     | User comments on reviews   |
| `like.ts`        | `likes`        | Review likes               |
| `review.ts`      | `reviews`      | Travel destination reviews |
| `user.ts`        | `users`        | Registered user accounts   |
| `userSession.ts` | `userSessions` | Authentication sessions    |

---

## Architecture & Patterns

### 1. Collection Access via Centralized Connector

Every function begins by calling the matching getter from `@/database/mongoDB` (e.g. `getCommentsCollection()`). This keeps connection management isolated from query logic.

```ts
const collection = await getCommentsCollection();
```

### 2. ObjectId Conversion at the Boundary

All IDs cross the boundary as plain `string` values (application layer) and are converted to `bson.ObjectId` exactly at the point of the query. This prevents ObjectId leaking into application types.

```ts
collection.findOne({ _id: new ObjectId(commentId) });
```

### 3. Mapper-Driven Shape Conversion

Raw MongoDB documents (`*DataDocument`) are never returned directly. Every document is passed through the corresponding mapper before leaving this layer, and every application-level object is mapped into a document before being written.

```ts
// Read path  (mongo → app)
return mapCommentDataDocumentToCommentData(commentDataDocument);

// Write path (app → mongo)
const doc = mapCommentDataToCommentDataDocument({ ...commentData, _id: ... });
await collection.insertOne(doc);
```

### 4. Zod Validation Inside Mappers (Double-Validation)

Mappers call validators (`@/validators/*`) on both the input and the output of each conversion. This means data is validated twice at every boundary crossing — once going in, once coming out — so runtime shape correctness is always guaranteed.

### 5. Request-Level Memoisation with `React.cache`

Hot read paths that can be called multiple times during one React Server Component render tree are wrapped in `React.cache`. This prevents redundant round-trips within a single request.

```ts
export const getReviewData = cache(async function (reviewId: string) { ... });
export const getCommentsDataByReviewId = cache(async function ({ reviewId }) { ... });
```

### 6. Idempotent Insert with Duplicate Check (`like.ts`)

`insertLikeData` checks for an existing `(reviewId, likedBy)` pair before inserting. If one exists it returns the existing record instead of duplicating or erroring.

### 7. Atomic Toggle Operations (`comment.ts`)

Like/dislike mutations are issued as single atomic `updateOne` calls using `$addToSet` + `$pull` in the same operation. This ensures a user can never hold a like and dislike simultaneously without an intermediate inconsistent state.

```ts
$addToSet: { idsOfUsersWhoLiked: new ObjectId(userId) },
$pull:     { idsOfUsersWhoDisliked: new ObjectId(userId) },
```

### 8. Parallel Aggregation with `Promise.all` (`user.ts`)

`getUserStats()` fires all seven independent MongoDB queries concurrently via a single `Promise.all`, minimising total latency for the user stats dashboard.

### 9. Session-Based Auth Lookup (`user.ts`)

`getUserDataUsingSession()` reads the `sessionId` cookie, resolves the session document, validates the expiry, then fetches the user. The expiry check (`expiresOn < new Date()`) is enforced here so no expired session can produce a valid `UserData`.

---

## File-by-File Reference

### `comment.ts`

| Function                                       | Operation                | Notes                                                                                           |
| ---------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------- |
| `insertCommentData`                            | INSERT                   | Generates a new `ObjectId`, maps to document, inserts                                           |
| `getCommentData`                               | SELECT by ID             | Returns `null` if not found                                                                     |
| `getCommentsDataByReviewId`                    | SELECT by `reviewId`     | Memoised with `React.cache`                                                                     |
| `getCommentsDataWithCommenterDataByReviewId`   | SELECT + JOIN            | Enriches each comment with `userName` + `profilePictureUrl` from the users collection; memoised |
| `getCommentsDataWithCommenterDataByCommentIds` | SELECT by ID list + JOIN | Batch look-up version of the above                                                              |
| `getCommentRepliesData`                        | SELECT replies           | Reads parent's `replyCommentIds` then fetches those documents                                   |
| `addLikeToComment`                             | UPDATE (atomic toggle)   | `$addToSet` liked / `$pull` disliked in one op                                                  |
| `removeLikeFromComment`                        | UPDATE                   | `$pull` from liked set                                                                          |
| `addDislikeToComment`                          | UPDATE (atomic toggle)   | `$addToSet` disliked / `$pull` liked in one op                                                  |
| `removeDislikeFromComment`                     | UPDATE                   | `$pull` from disliked set                                                                       |
| `addReplyToComment`                            | UPDATE                   | `$addToSet` on parent's `replyCommentIds`                                                       |

### `like.ts`

| Function                 | Operation            | Notes                                                           |
| ------------------------ | -------------------- | --------------------------------------------------------------- |
| `insertLikeData`         | INSERT (idempotent)  | Returns existing record if `(reviewId, likedBy)` already exists |
| `getLikeData`            | SELECT by ID         | Returns `null` if not found                                     |
| `getLikesDataByReviewId` | SELECT by `reviewId` | Returns `[]` if none found                                      |
| `deleteLikeData`         | DELETE by ID         | Returns boolean indicating success                              |

### `review.ts`

| Function                 | Operation          | Notes                                             |
| ------------------------ | ------------------ | ------------------------------------------------- |
| `insertReviewData`       | INSERT             | Returns new review's string ID                    |
| `getReviewData`          | SELECT by ID       | Memoised with `React.cache`                       |
| `getReviewsDataByUserId` | SELECT by `userId` | Sorted newest-first                               |
| `getReviewsDataByIds`    | SELECT by ID list  | Sorted newest-first; returns `[]` for empty input |
| `getReviewsCount`        | COUNT              | Total document count                              |
| `getReviewsData`         | SELECT (paginated) | `page` and `pageSize` params; sorted newest-first |
| `getMostRecentReviews`   | SELECT             | Top 4 newest reviews                              |

### `user.ts`

| Function                  | Operation         | Notes                                                           |
| ------------------------- | ----------------- | --------------------------------------------------------------- |
| `getUserDataByEmail`      | SELECT by `email` | Returns `null` if not found                                     |
| `getUserDataByUserId`     | SELECT by `_id`   | Returns `null` if not found                                     |
| `getUsersDataByUserIds`   | SELECT by ID list | Batch look-up; returns `[]` for empty result                    |
| `registerNewUser`         | INSERT            | Returns new user's string ID                                    |
| `getUserDataUsingSession` | AUTH FLOW         | Reads cookie → session → user; validates expiry                 |
| `getUserStats`            | AGGREGATE         | Fires 7 parallel queries via `Promise.all`; returns `UserStats` |

### `userSession.ts`

| Function             | Operation       | Notes                              |
| -------------------- | --------------- | ---------------------------------- |
| `getUserSessionData` | SELECT by `_id` | Returns `null` if not found        |
| `insertUserSession`  | INSERT          | Returns new session's string ID    |
| `deleteUserSession`  | DELETE by `_id` | Returns boolean indicating success |

---

## Dependencies

```
src/repository/*
  ├── @/database/mongoDB          ← collection connector
  ├── @/mappers/*                 ← document ↔ app-data converters (with validation)
  ├── @/schema/*                  ← TypeScript types (app-layer & document)
  ├── @/validators/*              ← Zod validators (called inside mappers)
  └── bson (ObjectId)             ← MongoDB BSON types
```

## Important Notes for AI Agents

- **Never bypass mappers.** All documents must flow through their mapper before being returned or inserted. Direct use of raw MongoDB documents outside this layer is a bug.
- **All IDs are strings at the function boundary.** Convert to `ObjectId` inside the function, never accept or return `ObjectId` in the public API.
- **`React.cache` only deduplicates within one server-render pass.** It provides no cross-request caching. Tagged cache revalidation via `revalidateTag` is stubbed out in comments — do not remove them.
- **`getUserStats` requires an active authenticated session.** It calls `getUserDataUsingSession` internally. If no session exists, it returns `null`.
- **Expired session documents are not automatically deleted.** The expiry check in `getUserDataUsingSession` is purely a read-time guard.
