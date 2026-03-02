/**
 * Migration script: ensure all user documents have the fields defined in
 * UserDataDocumentSchema:
 *   - registeredAt  (Date)
 *   - savedReviewesIds  (ObjectId[])
 *   - postedReviewesIds (ObjectId[])
 *
 * Usage (from project root):
 *   npx ts-node --project tsconfig.scripts.json scripts/add-user-fields-migration.ts
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
  const collection = db.collection("users");

  console.log("Running migration: adding missing fields to user documents...");

  // Add registeredAt where missing
  const registeredAtResult = await collection.updateMany(
    { $or: [{ registeredAt: { $exists: false } }, { registeredAt: null }] },
    { $set: { registeredAt: new Date() } },
  );
  console.log(
    `registeredAt  — Matched: ${registeredAtResult.matchedCount}, Modified: ${registeredAtResult.modifiedCount}`,
  );

  // Add savedReviewesIds where missing
  const savedResult = await collection.updateMany(
    {
      $or: [
        { savedReviewesIds: { $exists: false } },
        { savedReviewesIds: null },
      ],
    },
    { $set: { savedReviewesIds: [] } },
  );
  console.log(
    `savedReviewesIds  — Matched: ${savedResult.matchedCount}, Modified: ${savedResult.modifiedCount}`,
  );

  // Add postedReviewesIds where missing
  const postedResult = await collection.updateMany(
    {
      $or: [
        { postedReviewesIds: { $exists: false } },
        { postedReviewesIds: null },
      ],
    },
    { $set: { postedReviewesIds: [] } },
  );
  console.log(
    `postedReviewesIds — Matched: ${postedResult.matchedCount}, Modified: ${postedResult.modifiedCount}`,
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
