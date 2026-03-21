import { MongoClient } from "mongodb";
import { loadEnvConfig } from "@next/env";

const DATABASE_NAME = "review-destination";
const USERS_COLLECTION_NAME = "users";

// Existing accounts may not have had a dedicated salt field before this migration.
const DEFAULT_PASSWORD_SALT = "";
const DEFAULT_IS_EMAIL_VERIFIED = false;

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
    const users = db.collection(USERS_COLLECTION_NAME);

    const passwordSaltResult = await users.updateMany(
      { passwordSalt: { $exists: false } },
      { $set: { passwordSalt: DEFAULT_PASSWORD_SALT } },
    );

    const emailVerifiedResult = await users.updateMany(
      { isEmailVerified: { $exists: false } },
      { $set: { isEmailVerified: DEFAULT_IS_EMAIL_VERIFIED } },
    );

    console.log("Migration completed successfully.");
    console.log(
      `passwordSalt -> matched: ${passwordSaltResult.matchedCount}, modified: ${passwordSaltResult.modifiedCount}`,
    );
    console.log(
      `isEmailVerified -> matched: ${emailVerifiedResult.matchedCount}, modified: ${emailVerifiedResult.modifiedCount}`,
    );
  } finally {
    await client.close();
  }
}

runMigration().catch((error) => {
  console.error("Migration failed:", error);
  process.exitCode = 1;
});
