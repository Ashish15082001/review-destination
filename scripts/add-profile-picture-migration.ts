/**
 * Migration script: assign a profile picture URL (from Unsplash) to every
 * user document that is missing one.
 *
 * Usage (from project root):
 *   npx ts-node --project tsconfig.scripts.json scripts/add-profile-picture-migration.ts
 */

import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI =
  "mongodb+srv://ashish:12345@cluster0.r2ify.mongodb.net/?retryWrites=true&w=majority";

/**
 * 100 avatar URLs:
 *   - #1–70  : real portrait photos from pravatar.cc (img=1..70)
 *   - #71–100: generated illustrated avatars from DiceBear (avataaars style)
 */
const UNSPLASH_AVATARS = [
  // ── real portrait photos (pravatar.cc) ──────────────────────────────────
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=6",
  "https://i.pravatar.cc/150?img=7",
  "https://i.pravatar.cc/150?img=8",
  "https://i.pravatar.cc/150?img=9",
  "https://i.pravatar.cc/150?img=10",
  "https://i.pravatar.cc/150?img=11",
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=13",
  "https://i.pravatar.cc/150?img=14",
  "https://i.pravatar.cc/150?img=15",
  "https://i.pravatar.cc/150?img=16",
  "https://i.pravatar.cc/150?img=17",
  "https://i.pravatar.cc/150?img=18",
  "https://i.pravatar.cc/150?img=19",
  "https://i.pravatar.cc/150?img=20",
  "https://i.pravatar.cc/150?img=21",
  "https://i.pravatar.cc/150?img=22",
  "https://i.pravatar.cc/150?img=23",
  "https://i.pravatar.cc/150?img=24",
  "https://i.pravatar.cc/150?img=25",
  "https://i.pravatar.cc/150?img=26",
  "https://i.pravatar.cc/150?img=27",
  "https://i.pravatar.cc/150?img=28",
  "https://i.pravatar.cc/150?img=29",
  "https://i.pravatar.cc/150?img=30",
  "https://i.pravatar.cc/150?img=31",
  "https://i.pravatar.cc/150?img=32",
  "https://i.pravatar.cc/150?img=33",
  "https://i.pravatar.cc/150?img=34",
  "https://i.pravatar.cc/150?img=35",
  "https://i.pravatar.cc/150?img=36",
  "https://i.pravatar.cc/150?img=37",
  "https://i.pravatar.cc/150?img=38",
  "https://i.pravatar.cc/150?img=39",
  "https://i.pravatar.cc/150?img=40",
  "https://i.pravatar.cc/150?img=41",
  "https://i.pravatar.cc/150?img=42",
  "https://i.pravatar.cc/150?img=43",
  "https://i.pravatar.cc/150?img=44",
  "https://i.pravatar.cc/150?img=45",
  "https://i.pravatar.cc/150?img=46",
  "https://i.pravatar.cc/150?img=47",
  "https://i.pravatar.cc/150?img=48",
  "https://i.pravatar.cc/150?img=49",
  "https://i.pravatar.cc/150?img=50",
  "https://i.pravatar.cc/150?img=51",
  "https://i.pravatar.cc/150?img=52",
  "https://i.pravatar.cc/150?img=53",
  "https://i.pravatar.cc/150?img=54",
  "https://i.pravatar.cc/150?img=55",
  "https://i.pravatar.cc/150?img=56",
  "https://i.pravatar.cc/150?img=57",
  "https://i.pravatar.cc/150?img=58",
  "https://i.pravatar.cc/150?img=59",
  "https://i.pravatar.cc/150?img=60",
  "https://i.pravatar.cc/150?img=61",
  "https://i.pravatar.cc/150?img=62",
  "https://i.pravatar.cc/150?img=63",
  "https://i.pravatar.cc/150?img=64",
  "https://i.pravatar.cc/150?img=65",
  "https://i.pravatar.cc/150?img=66",
  "https://i.pravatar.cc/150?img=67",
  "https://i.pravatar.cc/150?img=68",
  "https://i.pravatar.cc/150?img=69",
  "https://i.pravatar.cc/150?img=70",
  // ── illustrated avatars (DiceBear avataaars) ────────────────────────────
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Edward",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Fiona",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=George",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Hannah",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Julia",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Nina",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Paula",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Quinn",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Samuel",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Tina",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Ulrich",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Walter",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Xena",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Zara",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Archer",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Dena",
];

function pickAvatar(userId: ObjectId): string {
  // Use the last byte of the ObjectId as a deterministic index so the same
  // user always gets the same avatar even if the script is re-run.
  const bytes = userId.id; // Buffer / Uint8Array of 12 bytes
  const index = bytes[bytes.length - 1] % UNSPLASH_AVATARS.length;
  return UNSPLASH_AVATARS[index];
}

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();

  const db = client.db("review-destination");
  const collection = db.collection("users");

  // Find all users that have no profilePictureUrl (missing, null, or empty).
  const usersWithoutPicture = await collection
    .find<{ _id: ObjectId }>({
      $or: [
        { profilePictureUrl: { $exists: false } },
        { profilePictureUrl: null },
        { profilePictureUrl: "" },
      ],
    })
    .project<{ _id: ObjectId }>({ _id: 1 })
    .toArray();

  console.log(
    `Found ${usersWithoutPicture.length} user(s) without a profile picture.`,
  );

  if (usersWithoutPicture.length === 0) {
    console.log("Nothing to update.");
    await client.close();
    return;
  }

  let updatedCount = 0;

  for (const user of usersWithoutPicture) {
    const avatarUrl = pickAvatar(user._id);
    await collection.updateOne(
      { _id: user._id },
      { $set: { profilePictureUrl: avatarUrl } },
    );
    updatedCount++;
    console.log(`  Updated user ${user._id} → ${avatarUrl}`);
  }

  console.log(`\nMigration complete. Updated ${updatedCount} user(s).`);
  await client.close();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration error:", err?.message ?? err);
    process.exit(1);
  });
