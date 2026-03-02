/**
 * Script: seed random likes & dislikes on all comments using real users from DB.
 *
 * Rules enforced:
 *   - A user can only appear in ONE of "liked" or "disliked" per comment (never both).
 *   - Each comment gets a random subset of users who liked it, then a random
 *     subset of the REMAINING users who disliked it.
 *
 * Usage (from project root):
 *   npx ts-node --project tsconfig.scripts.json scripts/seed-comment-likes.ts
 *
 * Optional env vars:
 *   MIN_LIKES_RATIO   – fraction of users that can like (default 0)
 *   MAX_LIKES_RATIO   – fraction of users that can like (default 0.5)
 *   MIN_DISLIKES_RATIO – fraction of remaining users that can dislike (default 0)
 *   MAX_DISLIKES_RATIO – fraction of remaining users that can dislike (default 0.4)
 */

import { MongoClient, ObjectId } from "mongodb";
import * as fs from "fs";
import * as path from "path";

// ─── Load .env.local ──────────────────────────────────────────────────────────
const envLocalPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envLocalPath)) {
  const lines = fs.readFileSync(envLocalPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed
      .slice(eqIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Return a random integer between min and max (inclusive). */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Randomly shuffle an array in‑place (Fisher-Yates) and return it.
 */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Given a pool of items, pick a random number of them between
 * floor(pool.length * minRatio) and floor(pool.length * maxRatio).
 */
function pickRandomFraction<T>(
  pool: T[],
  minRatio: number,
  maxRatio: number,
): T[] {
  const minCount = Math.floor(pool.length * minRatio);
  const maxCount = Math.floor(pool.length * maxRatio);
  const count = randomInt(minCount, maxCount);
  return shuffle([...pool]).slice(0, count);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const uri =
    "mongodb+srv://ashish:12345@cluster0.r2ify.mongodb.net/?retryWrites=true&w=majority";
  if (!uri) {
    throw new Error("MONGODB_URI is not defined. Add it to .env.local");
  }

  const minLikesRatio = parseFloat(process.env.MIN_LIKES_RATIO ?? "0");
  const maxLikesRatio = parseFloat(process.env.MAX_LIKES_RATIO ?? "0.5");
  const minDislikesRatio = parseFloat(process.env.MIN_DISLIKES_RATIO ?? "0");
  const maxDislikesRatio = parseFloat(process.env.MAX_DISLIKES_RATIO ?? "0.4");

  const client = new MongoClient(uri);
  await client.connect();
  console.log("Connected to MongoDB.");

  try {
    const db = client.db("review-destination");
    const usersCol = db.collection("users");
    const commentsCol = db.collection("comments");

    // ── 1. Fetch all real user IDs ──────────────────────────────────────────
    const users = await usersCol.find({}, { projection: { _id: 1 } }).toArray();
    if (users.length === 0) {
      console.warn("No users found in the database. Exiting.");
      return;
    }
    const allUserIds: ObjectId[] = users.map((u) => u._id as ObjectId);
    console.log(`Found ${allUserIds.length} users.`);

    // ── 2. Fetch all comments ───────────────────────────────────────────────
    const comments = await commentsCol.find({}).toArray();
    if (comments.length === 0) {
      console.warn("No comments found in the database. Exiting.");
      return;
    }
    console.log(`Found ${comments.length} comments. Seeding likes/dislikes…`);

    // ── 3. Update each comment ──────────────────────────────────────────────
    let updated = 0;

    for (const comment of comments) {
      // Pick random likers from all users
      const likers = pickRandomFraction(
        allUserIds,
        minLikesRatio,
        maxLikesRatio,
      );

      const likerSet = new Set(likers.map((id) => id.toString()));

      // Remaining users (those who didn't like this comment)
      const remainingUsers = allUserIds.filter(
        (id) => !likerSet.has(id.toString()),
      );

      // Pick random dislikers from the remaining pool (no overlap guaranteed)
      const dislikers = pickRandomFraction(
        remainingUsers,
        minDislikesRatio,
        maxDislikesRatio,
      );

      await commentsCol.updateOne(
        { _id: comment._id },
        {
          $set: {
            idsOfUsersWhoLiked: likers,
            idsOfUsersWhoDisliked: dislikers,
          },
        },
      );

      updated++;
    }

    console.log(
      `Done. Updated ${updated}/${comments.length} comments with random likes & dislikes.`,
    );
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error:", err?.message ?? err);
    process.exit(1);
  });
