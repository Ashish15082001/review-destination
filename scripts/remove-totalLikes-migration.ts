/**
 * Migration script: remove `totalLikes` field from all review documents.
 *
 * Usage (from project root):
 *   npx ts-node src/scripts/remove-totalLikes-migration.ts
 */

import { MongoClient } from "mongodb";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please add your MongoDB URI to the MONGODB_URI env var");
  }

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db("review-destination");
  const collection = db.collection("reviews");

  const filter = { totalLikes: { $exists: true } };

  console.log(
    "Running migration: removing `totalLikes` field from matching documents...",
  );

  const res = await collection.updateMany(filter, {
    $unset: { totalLikes: "" },
  });

  console.log(`Matched ${res.matchedCount}, Modified ${res.modifiedCount}`);

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
