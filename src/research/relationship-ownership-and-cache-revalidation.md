# Relationship Ownership & Cache Revalidation in Transactions

Two connected problems discovered during `postCommentAction` review: cache revalidation firing inside transaction callbacks, and why the transaction was needed in the first place.

---

## 1. The Cache Revalidation Bug

### What was happening

Repository mutation functions (`addReplyToComment`, `addLikeToComment`, etc.) called `revalidateTag` inside their function body. This is fine for standalone operations. But `addReplyToComment` was called inside `clientSession.withTransaction()`:

```ts
await clientSession.withTransaction(async () => {
  const insertedId = await insertCommentData(commentData, clientSession);
  await addReplyToComment(                        // ← revalidateTag fires here
    { parentCommentId, replyCommentId: insertedId },
    clientSession,
  );
});
```

### Why it breaks

`withTransaction` can **retry** the callback on transient errors (`WriteConflictError`, network blip). Each retry fires `revalidateTag` for a DB write that has not committed yet. If the transaction ultimately **aborts**, the cache is invalidated for a change that was never persisted.

```
Retry 1: revalidateTag fires → DB write staged, not committed
Retry 2: revalidateTag fires again → still not committed
Abort:   DB write discarded — cache now points to stale/wrong data
```

**Rule**: `revalidateTag` must only be called after the transaction commits — never inside the `withTransaction` callback.

---

## 2. Why the Transaction Existed

The transaction was needed because inserting a reply required **two document writes**:

1. `insertCommentData` — create the new comment
2. `addReplyToComment` — push the reply ID onto the parent's `replyCommentIds` array

Two documents → two writes → must be atomic → transaction needed.

```ts
// parent document stored child IDs
parent: {
  _id: ObjectId("abc"),
  replyCommentIds: [ObjectId("r1"), ObjectId("r2")]  // ← parent owns the relationship
}

// inserting a reply required updating the parent too
await insertCommentData(replyData, session);           // write 1
await addReplyToComment({ parentId, replyId }, session); // write 2
```

---

## 3. The Root Cause — Relationship on the Wrong Side

Storing `replyCommentIds` on the parent means **every new child forces an update to the parent**. This is the wrong side for a one-to-many relationship.

### The Principle

> **The many side owns the relationship, not the one side.**

In a parent → replies relationship:

| Approach | Who stores what | Writes per insert | Transaction needed? |
|---|---|---|---|
| ❌ Parent stores child IDs | `parent.replyCommentIds[]` | 2 (insert + update parent) | Yes |
| ✅ Child stores parent ID | `reply.parentCommentId` | 1 (insert only) | No |

This is identical to how relational databases work — the foreign key always lives on the "many" table:

```sql
-- relational DB
CREATE TABLE comments (
  id          UUID PRIMARY KEY,
  parent_id   UUID REFERENCES comments(id),  -- ← child stores parent, not the other way
  ...
);
```

### MongoDB equivalent

```ts
// ✅ correct — child stores parent ID
reply: {
  _id: ObjectId("r3"),
  parentCommentId: ObjectId("abc"),   // ← relationship on the many side
  ...
}

// get all replies by querying, not by lookup
db.comments.find({ parentCommentId: ObjectId("abc") })
```

Inserting a reply is now a **single `insertOne`** — no parent update, no transaction, no cache revalidation timing problem.

---

## 4. When to Break the Rule

Store child IDs on the parent (array on the one side) only when:

- The array is **small and bounded** — e.g. a post has at most 5 tags, never grows unboundedly
- You need children **embedded with the parent** in a single read — in that case embed the full documents, not just IDs
- You need a **specific custom order** of children that cannot be derived from a query field

If none of these apply, put the foreign key on the child.

---

## 5. The Signal That You Have It Wrong

> If inserting a child record requires **updating a parent record**, the relationship is on the wrong side.

You will always need a transaction for what should be a simple insert. This is the smell.

---

## 6. Options to Fix the Problem

Three approaches, ordered from best to worst:

### Option A — Remodel the Data (eliminates the problem entirely)

Move the relationship to the child side. The child stores `parentCommentId`; the parent stores nothing. Inserting a reply becomes a single `insertOne` — no parent update, no transaction, no revalidation timing issue. Repository pattern stays intact with zero changes.

**Before (parent stores child IDs):**

```ts
// schema
type CommentDocument = {
  _id: ObjectId;
  replyCommentIds: ObjectId[];   // ← parent owns the relationship
  ...
};

// inserting a reply — two writes, transaction required
await insertCommentData(replyData, session);                          // write 1
await addReplyToComment({ parentCommentId, replyCommentId }, session); // write 2
```

**After (child stores parent ID):**

```ts
// schema — remove replyCommentIds entirely
type CommentDocument = {
  _id: ObjectId;
  parentCommentId: ObjectId | null;  // ← child owns the relationship
  ...
};

// inserting a reply — one write, no transaction needed
await insertCommentData(replyData); // write 1, done
```

**Fetching replies changes from lookup to query:**

```ts
// before — fetch IDs from parent, then fetch each reply
const parent = await collection.findOne({ _id: parentId }, { projection: { replyCommentIds: 1 } });
const replies = await Promise.all(parent.replyCommentIds.map(id => fetchComment(id)));

// after — single query, simpler and cheaper
const replies = await collection.find({ parentCommentId: parentId }).toArray();
```

**What changes in the codebase:**

| Change | Details |
|---|---|
| Remove `replyCommentIds` from schema | `CommentDocument`, `CommentData`, Zod schemas |
| Update `getCommentRepliesDataWithCommenterInfo` | Query by `parentCommentId` instead of lookup |
| Remove `addReplyToComment` | No longer needed |
| Simplify `postCommentTransaction` | Becomes a plain `insertCommentData` call — no transaction |
| Add DB index on `parentCommentId` | Required for query performance |

**Trade-off**: requires a data migration for existing documents (remove `replyCommentIds` field). New documents just stop writing it.

---

### Option B — AsyncLocalStorage (keeps repository pattern intact)

A custom transaction wrapper uses `AsyncLocalStorage` to detect when code runs inside a transaction. Repository functions call a shared `scheduleRevalidation` helper instead of `revalidateTag` directly. Inside a transaction the tag is queued. After commit it is flushed.

```ts
// utils/revalidation.ts
import { AsyncLocalStorage } from "async_hooks";
import { revalidateTag as nextRevalidateTag } from "next/cache";

const pendingTagsStore = new AsyncLocalStorage<Set<string>>();

export function scheduleRevalidation(tag: string) {
  const pending = pendingTagsStore.getStore();
  if (pending) {
    pending.add(tag);           // inside a transaction — defer
  } else {
    nextRevalidateTag(tag);     // outside a transaction — fire immediately
  }
}

export async function withCacheAwareTransaction(session, callback) {
  const pendingTags = new Set<string>();

  await pendingTagsStore.run(pendingTags, async () => {
    await session.withTransaction(callback);
  });

  // only reached after successful commit
  for (const tag of pendingTags) {
    nextRevalidateTag(tag);
  }
}
```

Repository functions change one import — `scheduleRevalidation` instead of `revalidateTag`. Everything else is identical.

### Option C — Action layer owns revalidation timing

Remove `revalidateTag` from repository functions. Export a named helper that encapsulates the tag string. Actions call the helper after successful operations.

```ts
// repository/comment.ts
export function revalidateCommentCache(commentId: string) {
  revalidateTag(`commentDataWithCommenterInfo-commentId-${commentId}`);
}
// no revalidateTag calls inside mutation functions
```

```ts
// action or route
await withTransaction(session, async () => { ... });
revalidateCommentCache(parentCommentId);   // after commit
```

Tag string lives in one place (repository). Action controls timing. Not repetitive.

---

## 7. Key Takeaways

1. **`revalidateTag` inside `withTransaction` is always wrong** — callbacks can retry, transactions can abort.
2. **The many side owns the foreign key** — child stores `parentId`, parent does not store `childIds[]`.
3. **If inserting a child requires updating the parent, the relationship is on the wrong side.**
4. **Unbounded arrays on parent documents are a MongoDB anti-pattern** — they grow forever and force multi-document writes.
5. **Single-document writes are naturally atomic** — no transaction needed, no revalidation timing problem.
