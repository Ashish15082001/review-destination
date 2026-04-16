# Repository Layer — `clientSession` & `"use cache"` Rules

## The One Rule

> **If the function has `"use cache"` → no `clientSession?`.**
> **Otherwise → always add `clientSession?`.**

---

## Why `"use cache"` blocks `clientSession`

- `"use cache"` serializes and stores the function's return value.
- `ClientSession` is a **live MongoDB connection object** — it's not serializable.
- Next.js will throw at runtime if you pass a non-serializable argument into a cached function.
- Even if it could work, a cached read would return **stale cached data** inside a transaction, completely ignoring the transaction's in-flight state. You'd never want that.

## Why every non-cached function gets `clientSession?`

- It's always optional (`?`) — passing `undefined` behaves identically to not passing it.
- Zero performance cost when unused.
- MongoDB silently ignores `{ session: undefined }`.
- **Eliminates future refactoring risk**: if you later need to use the function inside a transaction, you won't have to change its signature and fix every call site.

## Why even reads need it (when not cached)

Example: `checkIfCommentExists` is a **read**, but it's called inside the `post-comment` transaction to verify the parent comment exists before inserting a reply. Without the session, it reads **committed state** and misses not-yet-committed writes from the same transaction.

---

## `"use cache"` — When to Use

| Scenario | `"use cache"` |
|---|---|
| Fetches **one document** by a stable, specific key (ID, email) | Yes — with a `cacheTag` for precise invalidation |
| Queries a **dynamic list** then delegates to cached single-item fetchers | No — the list has no safe invalidation key |

The **list → batch → single-item** pattern is intentional:

```
getCommentsDataByReviewId        → no cache (queries dynamic list of IDs)
  └─ getCommentDataByCommentId   → "use cache" (single item, stable key)
```

Cache at the **leaf** (individual item), not at the list query.

---

## Quick Reference Table

| Function touches DB? | Has `"use cache"`? | Add `clientSession?`? |
|---|---|---|
| Yes | Yes | **No** (impossible — not serializable) |
| Yes | No | **Yes** (always) |
| No (pure JS, delegates to other fns) | — | Not needed |
