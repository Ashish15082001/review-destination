/**
 * Migration script: ensure all comment documents have a `parentCommentId` field.
 *
 * Steps:
 *  1. Set `parentCommentId = null` for every comment that is missing the field.
 *  2. For each comment that has entries in `repliesIds`, set the `parentCommentId`
 *     of each referenced reply to the current comment's `_id`.
 *
 * Usage (from project root):
 *   npx ts-node --project tsconfig.scripts.json scripts/add-parentCommentId-migration.ts
 */
import { MongoClient, ObjectId } from "mongodb";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please add your MongoDB URI to the MONGODB_URI env var");
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("review-destination");
  const collection = db.collection("comments");

  // Step 1: initialise missing parentCommentId to null
  console.log(
    "Step 1: setting parentCommentId = null for documents missing the field...",
  );
  const initRes = await collection.updateMany(
    { parentCommentId: { $exists: false } },
    { $set: { parentCommentId: null } },
  );
  console.log(
    `  Matched ${initRes.matchedCount}, Modified ${initRes.modifiedCount}`,
  );

  // Step 2: for every parent comment with replies, stamp the correct parentCommentId
  console.log(
    "Step 2: stamping parentCommentId on reply comments via repliesIds...",
  );

  const parents = await collection
    .find(
      { repliesIds: { $exists: true, $not: { $size: 0 } } },
      { projection: { _id: 1, repliesIds: 1 } },
    )
    .toArray();

  let totalUpdated = 0;

  for (const parent of parents) {
    const replyIds: ObjectId[] = parent.repliesIds ?? [];
    if (replyIds.length === 0) continue;

    const res = await collection.updateMany(
      { _id: { $in: replyIds } },
      { $set: { parentCommentId: parent._id } },
    );
    totalUpdated += res.modifiedCount;
  }

  console.log(`  Updated ${totalUpdated} reply comment(s).`);

  await client.close();
}

main()
  .then(() => {
    console.log("Migration finished.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Migration error:", err?.message ?? err);
    process.exit(1);
  });
