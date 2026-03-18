/**
 * Migration script for comment documents:
 * 1) rename `repliesIds` to `replyCommentIds` when present
 * 2) set `replyCommentIds: []` when `repliesIds` is absent
 *
 * Usage (from project root):
 *   npx ts-node --project tsconfig.scripts.json scripts/rename-repliesIds-migration.ts
 */

import { MongoClient } from "mongodb";

async function main() {
  const uri =
    "mongodb+srv://ashish:12345@cluster0.r2ify.mongodb.net/?retryWrites=true&w=majority";
  if (!uri) {
    throw new Error("Please add your MongoDB URI to the MONGODB_URI env var");
  }

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db("review-destination");
  const collection = db.collection("comments");

  const renameFilter = { repliesIds: { $exists: true } };
  const initializeFilter = {
    repliesIds: { $exists: false },
    replyCommentIds: { $exists: false },
  };

  console.log("Running migration for reply comment IDs...");

  const renameRes = await collection.updateMany(renameFilter, {
    $rename: { repliesIds: "replyCommentIds" },
  });

  const initializeRes = await collection.updateMany(initializeFilter, {
    $set: { replyCommentIds: [] },
  });

  console.log(
    `Rename step -> Matched ${renameRes.matchedCount}, Modified ${renameRes.modifiedCount}`,
  );
  console.log(
    `Initialize step -> Matched ${initializeRes.matchedCount}, Modified ${initializeRes.modifiedCount}`,
  );

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
