import { MongoClient, ObjectId } from "mongodb";

const uri =
  "mongodb+srv://ashish:12345@cluster0.r2ify.mongodb.net/?retryWrites=true&w=majority";

function getRandomDate(monthsAgo: number = 6): Date {
  const now = new Date();
  const past = new Date();
  past.setMonth(now.getMonth() - monthsAgo);
  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime()),
  );
}

function pickRandom<T>(arr: T[], exclude?: T): T {
  const filtered =
    exclude !== undefined ? arr.filter((x) => x !== exclude) : arr;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

const commentPool = [
  "This place looks absolutely stunning! Adding it to my bucket list right away.",
  "Great review! We had a very similar experience when we visited last year.",
  "The photos are gorgeous. Did you need to book tickets far in advance?",
  "Thanks for sharing! How was the local food scene? Any recommendations?",
  "I've always wanted to go here. Your description makes it sound even more magical.",
  "Wow, this brings back so many memories. We went there for our honeymoon!",
  "Incredible write-up! How long did you stay? Was a week enough to see everything?",
  "The sunsets there are truly unmatched. You captured it perfectly in words.",
  "This is so helpful! I'm planning a trip for next summer and this answers a lot of my questions.",
  "Did you hire a local guide? I'm wondering if it's worth the extra cost.",
  "We visited in winter and it was a completely different vibe — still amazing though!",
  "Any tips on getting around? We're debating renting a car vs using public transit.",
  "One of the most underrated destinations in my opinion. Glad more people are discovering it.",
  "Loved reading your experience! The cultural aspect is what draws me most to places like this.",
  "We had the exact same feelings when we were there. It's indescribable until you see it yourself.",
  "This review convinced me to finally book the trip I've been putting off for years!",
  "Such a well-written review. Your descriptions made me feel like I was right there with you.",
  "How did you handle the language barrier? Did you find most locals speak English?",
  "The food alone is worth the trip. Did you take any cooking classes while you were there?",
  "I stayed at a small local guesthouse and it was far better than the big hotels. Highly recommend!",
  "The history here is just fascinating. Did you explore any of the more off-the-beaten-path spots?",
  "Totally agree about the hospitality. The people there are some of the warmest I've ever met.",
  "What time of year is best to visit? I'd love to avoid the tourist crowds if possible.",
  "Your experience mirrors ours almost exactly. It really is that special of a place!",
  "This is exactly the kind of honest, detailed review I look for before planning a trip. Thank you!",
  "I can't believe how affordable it was compared to other European destinations.",
  "The architecture alone is worth the flight. Every corner is a photo opportunity.",
  "Did you feel safe traveling there solo? It's on my list for a solo trip.",
  "We almost skipped this destination — so glad we didn't after reading reviews like yours!",
  "The nightlife there is also surprisingly vibrant if you're into that sort of thing.",
];

async function seedComments() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("review-destination");
    const usersCollection = db.collection("users");
    const reviewsCollection = db.collection("reviews");
    const commentsCollection = db.collection("comments");

    // Fetch all real users and reviews from DB
    const users = await usersCollection.find({}).toArray();
    const reviews = await reviewsCollection.find({}).toArray();

    if (users.length === 0) {
      console.error("❌ No users found. Please seed users first.");
      return;
    }

    if (reviews.length === 0) {
      console.error("❌ No reviews found. Please seed reviews first.");
      return;
    }

    console.log(`Found ${users.length} users and ${reviews.length} reviews`);

    // Clear existing comments
    await commentsCollection.deleteMany({});
    console.log("Cleared existing comments");

    const userIds = users.map((u) => u._id as ObjectId);
    const allComments = [];

    // Shuffle commentPool to avoid repetition bias; use modulo to cycle through
    let poolIndex = 0;

    for (const review of reviews) {
      const reviewId = review._id as ObjectId;
      const reviewUserId = review.userId as ObjectId;

      const commentCount = Math.floor(Math.random() * 12) + 4; // random 4–15
      for (let i = 0; i < commentCount; i++) {
        // Pick a random user who is not the review author when possible
        const commenter = pickRandom(
          userIds,
          userIds.find((id) => id.equals(reviewUserId)),
        );

        // Random commentedOn date within the last 6 months
        const commentedOn = getRandomDate(6);

        // Cycle through comment pool deterministically for variety
        const comment = commentPool[poolIndex % commentPool.length];
        poolIndex++;

        allComments.push({
          _id: new ObjectId(),
          reviewId,
          commentedBy: commenter,
          commentedOn,
          comment,
        });
      }
    }

    const result = await commentsCollection.insertMany(allComments);
    console.log(
      `✅ Inserted ${result.insertedCount} comments across ${reviews.length} reviews (4–15 each)`,
    );
  } catch (error) {
    console.error("Error seeding comments:", error);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

seedComments();
