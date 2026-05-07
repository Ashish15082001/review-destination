import { MongoClient } from "mongodb";
import { loadEnvConfig } from "@next/env";

const DATABASE_NAME = "review-destination";
const COMMENTS_COLLECTION_NAME = "comments";

loadEnvConfig(process.cwd());

async function runMigration(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI is missing. Set it before running this migration.",
    );
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();

    const db = client.db(DATABASE_NAME);
    const comments = db.collection(COMMENTS_COLLECTION_NAME);

    const unsetResult = await comments.updateMany(
      { replyCommentIds: { $exists: true } },
      { $unset: { replyCommentIds: "" } },
    );

    await comments.createIndex({ parentCommentId: 1 });

    console.log("Migration completed successfully.");
    console.log(
      `replyCommentIds removed: matched ${unsetResult.matchedCount}, modified ${unsetResult.modifiedCount}`,
    );
    console.log("Index on parentCommentId created.");
  } finally {
    await client.close();
  }
}

runMigration().catch((error) => {
  console.error("Migration failed:", error);
  process.exitCode = 1;
});
