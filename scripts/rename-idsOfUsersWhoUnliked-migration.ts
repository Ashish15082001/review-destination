/**
 * Migration script: rename `idsOfUsersWhoUnliked` to `idsOfUsersWhoDisliked`
 * in all comment documents.
 *
 * Usage (from project root):
 *   npx ts-node --project tsconfig.scripts.json scripts/rename-idsOfUsersWhoUnliked-migration.ts
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
  const collection = db.collection("comments");

  const filter = { idsOfUsersWhoUnliked: { $exists: true } };

  console.log(
    "Running migration: renaming `idsOfUsersWhoUnliked` → `idsOfUsersWhoDisliked`...",
  );

  const res = await collection.updateMany(filter, {
    $rename: { idsOfUsersWhoUnliked: "idsOfUsersWhoDisliked" },
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
