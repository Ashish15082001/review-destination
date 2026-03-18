/**
 * Script: seed random replies (1–5 per comment) on all top-level comments
 * using real users that already exist in the MongoDB database.
 *
 * For each top-level comment (parentCommentId === null):
 *   1. Pick 1–5 random existing users as repliers.
 *   2. Insert a new reply comment document for each replier.
 *   3. Push the new reply's _id into the parent comment's `replyCommentIds` array.
 *
 * Usage (from project root):
 *   npx ts-node --project tsconfig.scripts.json scripts/seed-comment-replies.ts
 *
 * Optional env vars:
 *   MIN_REPLIES  – minimum replies per comment (default 1)
 *   MAX_REPLIES  – maximum replies per comment (default 5)
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

// ─── Sample reply texts ───────────────────────────────────────────────────────
const REPLY_TEXTS = [
  "Totally agree with you on this!",
  "Thanks for sharing your thoughts.",
  "I had a similar experience, very insightful.",
  "That's a great point, hadn't thought of it that way.",
  "Completely disagree — my experience was much better.",
  "Interesting perspective! I'll keep this in mind.",
  "This matches what I heard from others too.",
  "You make a fair point, I'd have to reconsider.",
  "Couldn't have said it better myself!",
  "I'm not sure I fully agree, but I see where you're coming from.",
  "Very helpful, thank you!",
  "Have you tried contacting their support? They were responsive for me.",
  "Great feedback, really appreciate the detail.",
  "I wish I had read this before visiting!",
  "Same here — it was exactly as you described.",
  "Appreciate the honest review!",
  "Your comment helped me make up my mind.",
  "That's surprising, I had a completely different experience.",
  "Thanks for the heads‑up!",
  "This is really useful to know.",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandomText(): string {
  return REPLY_TEXTS[Math.floor(Math.random() * REPLY_TEXTS.length)];
}

function getRandomDate(after: Date): Date {
  const now = new Date();
  // Random timestamp between the parent comment's date and now
  return new Date(
    after.getTime() + Math.random() * (now.getTime() - after.getTime()),
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined. Add it to .env.local");
  }

  const minReplies = parseInt(process.env.MIN_REPLIES ?? "1", 10);
  const maxReplies = parseInt(process.env.MAX_REPLIES ?? "5", 10);

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

    // ── 2. Fetch all top-level comments (not replies themselves) ────────────
    const topLevelComments = await commentsCol
      .find({ parentCommentId: null })
      .toArray();

    if (topLevelComments.length === 0) {
      console.warn("No top-level comments found in the database. Exiting.");
      return;
    }
    console.log(
      `Found ${topLevelComments.length} top-level comments. Seeding replies…`,
    );

    // ── 3. Seed replies for each top-level comment ──────────────────────────
    let totalRepliesInserted = 0;

    for (const parentComment of topLevelComments) {
      const replyCount = randomInt(
        minReplies,
        Math.min(maxReplies, allUserIds.length),
      );

      // Pick unique repliers (no duplicate user per comment)
      const repliers = shuffle(allUserIds).slice(0, replyCount);

      const parentDate: Date =
        parentComment.commentedOn instanceof Date
          ? parentComment.commentedOn
          : new Date(parentComment.commentedOn);

      // Build reply documents
      const replyDocs = repliers.map((userId) => ({
        _id: new ObjectId(),
        parentCommentId: parentComment._id as ObjectId,
        reviewId: parentComment.reviewId as ObjectId,
        commentedBy: userId,
        commentedOn: getRandomDate(parentDate),
        comment: pickRandomText(),
        replyCommentIds: [] as ObjectId[],
        idsOfUsersWhoLiked: [] as ObjectId[],
        idsOfUsersWhoDisliked: [] as ObjectId[],
      }));

      // Insert replies
      await commentsCol.insertMany(replyDocs);

      // Push reply IDs into parent's replyCommentIds
      const replyIds = replyDocs.map((r) => r._id);
      await commentsCol.updateOne(
        { _id: parentComment._id },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { $push: { replyCommentIds: { $each: replyIds } } } as any,
      );

      totalRepliesInserted += replyDocs.length;
      console.log(
        `  Comment ${parentComment._id}: inserted ${replyDocs.length} repl${replyDocs.length === 1 ? "y" : "ies"}.`,
      );
    }

    console.log(
      `\nDone! Inserted ${totalRepliesInserted} replies across ${topLevelComments.length} comments.`,
    );
  } finally {
    await client.close();
    console.log("Connection closed.");
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
