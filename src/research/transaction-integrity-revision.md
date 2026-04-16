# Transaction Integrity — Revision Reference

Quick-revision summary of the MongoDB transaction integrity challenge, how sessions work, and the rules for `clientSession` / `"use cache"` in the repository layer.

---

## 1. The Problem

`postCommentAction` performs 4 database operations that must be atomic:

```
checkIfCommentExists  → guard read
checkIfReviewExists   → guard read
insertCommentData     → write
addReplyToComment     → write
```

**Original code**: No `ClientSession`, no `withTransaction`. Each call was an independent auto-committed operation.

**What could go wrong**:

- Server crashes after `insertCommentData` but before `addReplyToComment` → **orphaned comment** (exists but not linked to parent).
- Another request deletes the parent between `checkIfCommentExists` and `addReplyToComment` → **TOCTOU race** (guard passes, write hits a deleted doc).
- `addReplyToComment` returns `null` when parent is gone, but return value was never checked → **silent data loss**.

---

## 2. The Fix

```ts
const clientSession = (await getClientPromise()).startSession();

await clientSession.withTransaction(async () => {
  await checkIfCommentExists({ ... }, clientSession);
  await checkIfReviewExists({ ... }, clientSession);
  const id = await insertCommentData(data, clientSession);
  const result = await addReplyToComment({ ... }, clientSession);
  if (!result) throw new Error("Parent deleted"); // ← forces rollback
});

await clientSession.endSession();
```

**Three changes**:

1. Wrap everything in `withTransaction` — all-or-nothing.
2. Pass `clientSession` to every repository call and forward it to the MongoDB driver via `{ session: clientSession }`.
3. Check `addReplyToComment` return for `null` — throw to abort on TOCTOU.

---

## 3. How MongoDB Sessions Actually Work

### Reads inside a transaction

- MongoDB records a **snapshot timestamp** (T=0) when the transaction starts.
- Every `findOne({ ... }, { session })` returns data as it existed at T=0.
- Concurrent writes by other clients are **invisible** — snapshot isolation.

### Writes inside a transaction

- `insertOne(doc, { session })` stages the write in a **buffer tied to the session**.
- The write is **invisible to all other clients** until commit.
- On commit: all staged writes become visible atomically.
- On abort: all staged writes are discarded.

### What happens without `{ session }`

- The operation runs **outside the transaction** even if called inside the `withTransaction` callback.
- Reads see latest committed state (not the snapshot).
- Writes auto-commit immediately (not staged, not rollbackable).

### WriteConflictError

- Happens when **two transactions** try to modify the same document.
- MongoDB detects the conflict and throws `WriteConflictError`.
- `withTransaction` **auto-retries** — the callback runs again with a fresh snapshot.
- Only triggers when **both** operations use sessions. A non-transactional write won't conflict — it just commits instantly.

---

## 4. Concurrent Deletion — Two Cases

### Case 1: Delete WITHOUT transaction

```
T=0  Guard read sees parent ✓
T=1  External deleteOne() — no session → instant commit
T=2  addReplyToComment → null (parent gone)
T=3  Transaction commits ✓
```

**Result**: Orphaned reply. No conflict detected.
**Mitigation**: Null-check on `addReplyToComment` → throw → rollback.

### Case 2: Delete INSIDE a transaction

```
T=0  Guard read sees parent ✓
T=1  Tx B: deleteOne(session) — staged
T=2  Tx B commits → delete visible
T=3  Tx A write → WriteConflictError → auto-retry
T=4  Retry: guard read sees parent is gone → clean error
```

**Result**: Safe. MongoDB catches it automatically.

---

## 5. `clientSession` — When to Add

| Function has `"use cache"`? | Add `clientSession?` param?                                             |
| --------------------------- | ----------------------------------------------------------------------- |
| **Yes**                     | **No** — `ClientSession` is not serializable, Next.js throws at runtime |
| **No**                      | **Yes** — always, even if not used in a transaction today               |

**Why always add it when no cache?**

- `clientSession?` is optional — passing `undefined` is identical to not passing it.
- Zero runtime cost. MongoDB ignores `{ session: undefined }`.
- Prevents future refactoring: no signature changes needed when you later call it inside `withTransaction`.

---

## 6. `"use cache"` — When to Use

| Scenario                                             | Cache?                                     |
| ---------------------------------------------------- | ------------------------------------------ |
| Single document by stable key (ID, email)            | **Yes** — with `cacheTag` for invalidation |
| Dynamic list query that delegates to cached fetchers | **No** — no safe invalidation key          |

**Pattern**: Cache at the leaf, not the list.

```
getCommentsDataByReviewId()          → no cache (dynamic list of IDs)
  └─ getCommentDataByCommentId()     → "use cache" (single item, stable key)
```

---

## 7. Applied to `comment.ts`

| Function                                       | Type       | `"use cache"` | `clientSession?` | Why                      |
| ---------------------------------------------- | ---------- | ------------- | ---------------- | ------------------------ |
| `insertCommentData`                            | Write      | No            | **Yes**          | Used in transaction      |
| `getCommentDataWithCommenterInfoByCommentId`   | Read       | **Yes**       | No               | Cached leaf              |
| `getCommentsDataWithCommenterInfoByCommentIds` | Delegator  | No            | No               | Pure JS, calls cached fn |
| `getCommentsDataWithCommenterInfoByReviewId`   | List query | No            | No\*             | Delegates to cached fns  |
| `getCommentRepliesDataWithCommenterInfo`       | List query | No            | No\*             | Delegates to cached fns  |
| `addLikeToComment`                             | Write      | No            | **Yes**          | Should have it           |
| `removeLikeFromComment`                        | Write      | No            | **Yes**          | Should have it           |
| `addDislikeToComment`                          | Write      | No            | **Yes**          | Should have it           |
| `removeDislikeFromComment`                     | Write      | No            | **Yes**          | Should have it           |
| `addReplyToComment`                            | Write      | No            | **Yes**          | Used in transaction      |
| `checkIfCommentExists`                         | Read       | No            | **Yes**          | Used in transaction      |

\*List queries that only fetch IDs then delegate to cached single-item fetchers don't need `clientSession` because they never run inside transactions — they're UI-facing reads.

---

## 8. Key Takeaways

1. **`withTransaction` is meaningless** unless every operation inside it receives `{ session: clientSession }`.
2. **Snapshot isolation is a timestamp**, not a data copy. Reads use it; writes use latest committed state.
3. **`"use cache"` and `clientSession` are mutually exclusive** — one serializes, the other is a live connection.
4. **Always check write return values** inside transactions — `null` means the target was deleted (TOCTOU).
5. **`WriteConflictError` only fires** when both parties use transactions. Non-transactional deletes slip through silently.
