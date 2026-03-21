# Validators Layer - `src/validators/`

## Purpose

This folder contains runtime validation functions built on top of the Zod schemas in `src/schema/`.

Each validator function accepts typed data (`*Data`, `*DataDocument`, or `*FromBrowser`), runs `safeParse`, and either:

- returns validated data with the same type, or
- throws an `Error` with a descriptive message when the shape is invalid.

Validators are used as boundary guards before data moves between browser payloads, application objects, and MongoDB document shapes.

---

## Architecture & Patterns

### 1. `safeParse` + Throw Pattern

Every validator follows the same structure:

```ts
const parseResult = Schema.safeParse(payload);

if (!parseResult.success)
  throw new Error(`Invalid ...: ${parseResult.error.message}`);

return parseResult.data;
```

This gives explicit runtime failures with a readable message instead of silent coercion.

### 2. Default Export Is the App-Level Validator

Each file's default export validates the application-layer shape (`*Data`) and is named:

```
validateXData
```

This keeps imports short in call sites that mainly operate on application objects.

### 3. Named Exports for Other Boundaries

Additional named validators cover other schema variants where needed:

- `validateXDataDocument` for MongoDB document shape (`*DataDocument`)
- `validateXDataBrowser` / `validate...FromBrowser` for browser form payloads
- entity-specific enriched variants (for example comment + commenter profile data)

### 4. No Data Transformation

Validators only verify structure and constraints declared in the schema layer.

- No ID conversion (`string <-> ObjectId`)
- No business logic
- No database access

Shape conversion belongs in `src/mappers/`, and persistence belongs in `src/repository/`.

### 5. Designed for Product-Grade Runtime Safety

Even when TypeScript types already match at compile time, these functions provide runtime safety at trust boundaries (request input, DB reads/writes, mapper outputs).

---

## File-by-File Reference

### `comment.ts`

| Function                               | Validates                      | Notes                                                 |
| -------------------------------------- | ------------------------------ | ----------------------------------------------------- |
| `default` (`validateCommentData`)      | `CommentData`                  | App-level comment shape                               |
| `validateCommentDataDocument`          | `CommentDataDocument`          | MongoDB document shape                                |
| `validateCommentDataWithCommenterData` | `CommentDataWithCommenterData` | Enriched comment result with commenter profile fields |

### `like.ts`

| Function                       | Validates          | Notes                  |
| ------------------------------ | ------------------ | ---------------------- |
| `default` (`validateLikeData`) | `LikeData`         | App-level like shape   |
| `validateLikeDataDocument`     | `LikeDataDocument` | MongoDB document shape |

### `review.ts`

| Function                         | Validates            | Notes                                           |
| -------------------------------- | -------------------- | ----------------------------------------------- |
| `default` (`validateReviewData`) | `ReviewData`         | App-level review shape                          |
| `validateReviewDataDocument`     | `ReviewDataDocument` | MongoDB document shape                          |
| `validateReviewDataBrowser`      | `ReviewDataBrowser`  | Browser form payload (includes file validation) |

### `user.ts`

| Function                            | Validates                   | Notes                   |
| ----------------------------------- | --------------------------- | ----------------------- |
| `default` (`validateUserData`)      | `UserData`                  | App-level user shape    |
| `validateUserDataDocument`          | `UserDataDocument`          | MongoDB document shape  |
| `validateSignInUserDataFromBrowser` | `SignInUserDataFromBrowser` | Browser sign-in payload |
| `validateSignUpUserDataFromBrowser` | `SignUpUserDataFromBrowser` | Browser sign-up payload |

### `userSession.ts`

| Function                              | Validates                 | Notes                   |
| ------------------------------------- | ------------------------- | ----------------------- |
| `default` (`validateUserSessionData`) | `UserSessionData`         | App-level session shape |
| `validateUserSessionDataDocument`     | `UserSessionDataDocument` | MongoDB document shape  |

---

## Data Flow Diagram

```
Browser Form / External Input
       |
       | validate*FromBrowser() / validate*Browser()
       v
Validated browser payload
       |
       | transformed by action/controller logic
       v
Application data (*Data)
       |
       | validateXData()
       v
Trusted app object
       |
       | mapped by src/mappers/*
       v
MongoDB document (*DataDocument)
       |
       | validateXDataDocument()
       v
Trusted DB-shape object
```

---

## Dependencies

```
src/validators/*
  `-- @/schema/*      <- Zod schemas and inferred types
```

Indirectly, constraints are powered by:

- `zod` (via schema definitions)
- `mongodb/ObjectId` and `File` checks where schemas require them

---

## Important Notes for AI Agents

- Keep validator functions pure and synchronous.
- Do not add mapping logic here (`ObjectId` conversion belongs to mappers).
- Preserve the `safeParse` + throw contract to keep failure behavior consistent.
- Error strings are user/debug facing during development; keep them specific to entity and boundary.
- Browser-specific checks (for example `File` constraints) must remain in browser-payload validators.
- Known schema field names like `savedReviewesIds` are intentional and must not be renamed without migrations.
