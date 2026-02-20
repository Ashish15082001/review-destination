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

// ─── 10 Users ─────────────────────────────────────────────────────────────────
const userIds = Array.from({ length: 10 }, () => new ObjectId());

const dummyUsers = [
  {
    _id: userIds[0],
    userName: "emma_johnson",
    password: "emma1234",
    registeredAt: getRandomDate(12),
  },
  {
    _id: userIds[1],
    userName: "michael_chen",
    password: "michael1234",
    registeredAt: getRandomDate(11),
  },
  {
    _id: userIds[2],
    userName: "sarah_martinez",
    password: "sarah1234",
    registeredAt: getRandomDate(10),
  },
  {
    _id: userIds[3],
    userName: "james_wilson",
    password: "james1234",
    registeredAt: getRandomDate(9),
  },
  {
    _id: userIds[4],
    userName: "olivia_brown",
    password: "olivia1234",
    registeredAt: getRandomDate(8),
  },
  {
    _id: userIds[5],
    userName: "david_kim",
    password: "david1234",
    registeredAt: getRandomDate(7),
  },
  {
    _id: userIds[6],
    userName: "sophie_anderson",
    password: "sophie1234",
    registeredAt: getRandomDate(6),
  },
  {
    _id: userIds[7],
    userName: "alex_thompson",
    password: "alex1234",
    registeredAt: getRandomDate(5),
  },
  {
    _id: userIds[8],
    userName: "isabella_garcia",
    password: "isabella1234",
    registeredAt: getRandomDate(4),
  },
  {
    _id: userIds[9],
    userName: "lucas_miller",
    password: "lucas1234",
    registeredAt: getRandomDate(3),
  },
];

// ─── 10 Reviews ───────────────────────────────────────────────────────────────
const reviewIds = Array.from({ length: 10 }, () => new ObjectId());

const dummyReviews = [
  {
    _id: reviewIds[0],
    userId: userIds[0],
    destinationName: "Paris, France",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    ],
    whenVisited: "June 2025",
    description:
      "Paris exceeded all my expectations. The romantic ambiance, stunning architecture, and incredible food made this trip unforgettable.",
    experience:
      "Visited during summer and enjoyed perfect weather. The Seine river cruise was amazing. Locals were friendly and helpful with directions.",
    datePosted: getRandomDate(6),
  },
  {
    _id: reviewIds[1],
    userId: userIds[1],
    destinationName: "Tokyo, Japan",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
    ],
    whenVisited: "March 2025",
    description:
      "Tokyo offers an incredible mix of ancient temples and futuristic skyscrapers. The cherry blossoms in spring made it even more special.",
    experience:
      "The public transportation is flawless. Food was exceptional everywhere we went. People are incredibly polite and respectful.",
    datePosted: getRandomDate(5),
  },
  {
    _id: reviewIds[2],
    userId: userIds[2],
    destinationName: "Santorini, Greece",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
    ],
    whenVisited: "September 2025",
    description:
      "White-washed buildings with blue domes create a postcard-perfect scene. The volcanic beaches are unique and beautiful.",
    experience:
      "Stayed in Oia and watched the sunset daily. Wine tasting tours were fantastic. Greek hospitality is legendary — everyone was so welcoming.",
    datePosted: getRandomDate(4),
  },
  {
    _id: reviewIds[3],
    userId: userIds[3],
    destinationName: "Dubai, UAE",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
    ],
    whenVisited: "November 2025",
    description:
      "From towering skyscrapers to pristine beaches, Dubai has it all. The shopping and dining experiences are world-class.",
    experience:
      "Desert safari was thrilling. Burj Khalifa views were spectacular. The blend of traditional souks and modern malls is fascinating.",
    datePosted: getRandomDate(3),
  },
  {
    _id: reviewIds[4],
    userId: userIds[4],
    destinationName: "New York City, USA",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
    ],
    whenVisited: "October 2025",
    description:
      "NYC is a melting pot of cultures, cuisines, and experiences. Broadway shows, amazing museums, and iconic landmarks everywhere.",
    experience:
      "Walked through Central Park, caught a Broadway show, explored different neighborhoods. Each area has its own unique vibe.",
    datePosted: getRandomDate(2),
  },
  {
    _id: reviewIds[5],
    userId: userIds[5],
    destinationName: "Bali, Indonesia",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    ],
    whenVisited: "July 2025",
    description:
      "Bali offers stunning rice terraces, beautiful beaches, and ancient temples. The Balinese people are incredibly warm and spiritual.",
    experience:
      "Learned to surf in Seminyak, visited the monkey forest in Ubud, and explored waterfalls. The yoga retreats are world-renowned.",
    datePosted: getRandomDate(2),
  },
  {
    _id: reviewIds[6],
    userId: userIds[6],
    destinationName: "Rome, Italy",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5",
    ],
    whenVisited: "May 2025",
    description:
      "Rome is an open-air museum. The architecture, art, and food create an unforgettable Italian experience.",
    experience:
      "Tossed a coin in the Trevi Fountain, explored the Colosseum, and ate the best pasta and gelato. Vatican City was awe-inspiring.",
    datePosted: getRandomDate(1),
  },
  {
    _id: reviewIds[7],
    userId: userIds[7],
    destinationName: "Machu Picchu, Peru",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1",
    ],
    whenVisited: "August 2025",
    description:
      "Hiking to Machu Picchu was challenging but rewarding. The Inca architecture and mountain views are spectacular.",
    experience:
      "Did the 4-day Inca Trail trek. Watching sunrise over the ruins was magical. Our guide shared fascinating history.",
    datePosted: getRandomDate(1),
  },
  {
    _id: reviewIds[8],
    userId: userIds[8],
    destinationName: "Sydney, Australia",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
    ],
    whenVisited: "January 2025",
    description:
      "The harbour is stunning, beaches are pristine, and the food scene is incredible. Great mix of urban and natural beauty.",
    experience:
      "Climbed the Harbour Bridge, visited Bondi Beach, and saw an opera at the Opera House. Wildlife encounters were amazing.",
    datePosted: getRandomDate(1),
  },
  {
    _id: reviewIds[9],
    userId: userIds[9],
    destinationName: "Iceland",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1483347756197-71ef80e95f73",
    ],
    whenVisited: "December 2024",
    description:
      "Iceland is otherworldly — glaciers, waterfalls, geysers, and volcanic landscapes. The Blue Lagoon was incredibly relaxing.",
    experience:
      "Drove the Golden Circle, chased the Northern Lights, and bathed in hot springs. Weather was harsh but absolutely worth it.",
    datePosted: getRandomDate(1),
  },
];

// ─── Comment pool ─────────────────────────────────────────────────────────────
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

// ─── Seed function ─────────────────────────────────────────────────────────────
async function seedAll() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("review-destination");
    const usersCollection = db.collection("users");
    const reviewsCollection = db.collection("reviews");
    const likesCollection = db.collection("likes");
    const commentsCollection = db.collection("comments");

    // ── Users ──────────────────────────────────────────────────────────────────
    const existingUsersCount = await usersCollection.countDocuments();
    if (existingUsersCount === 0) {
      const usersResult = await usersCollection.insertMany(dummyUsers);
      console.log(`✅ Inserted ${usersResult.insertedCount} users`);
    } else {
      console.log(`⏭️  Skipped users (${existingUsersCount} already exist)`);
    }

    // ── Reviews ────────────────────────────────────────────────────────────────
    const existingReviewsCount = await reviewsCollection.countDocuments();
    if (existingReviewsCount === 0) {
      const reviewsResult = await reviewsCollection.insertMany(dummyReviews);
      console.log(`✅ Inserted ${reviewsResult.insertedCount} reviews`);
    } else {
      console.log(
        `⏭️  Skipped reviews (${existingReviewsCount} already exist)`,
      );
    }

    // ── Likes ──────────────────────────────────────────────────────────────────
    const existingReviews = await reviewsCollection
      .find({}, { projection: { _id: 1 } })
      .toArray();

    await likesCollection.deleteMany({});
    console.log("Cleared existing likes");

    const dummyLikes = existingReviews.flatMap((review) => {
      const likeCount = Math.floor(Math.random() * 81) + 20; // 20–100
      return Array.from({ length: likeCount }, () => ({
        _id: new ObjectId(),
        reviewId: review._id,
        likedBy: new ObjectId(),
        likedOn: getRandomDate(6),
      }));
    });

    const likesResult = await likesCollection.insertMany(dummyLikes);
    console.log(
      `✅ Inserted ${likesResult.insertedCount} likes across ${existingReviews.length} reviews`,
    );

    // ── Comments ───────────────────────────────────────────────────────────────
    const users = await usersCollection.find({}).toArray();
    const reviews = await reviewsCollection.find({}).toArray();

    await commentsCollection.deleteMany({});
    console.log("Cleared existing comments");

    const allUserIds = users.map((u) => u._id as ObjectId);
    const allComments = [];
    let poolIndex = 0;

    for (const review of reviews) {
      const reviewId = review._id as ObjectId;
      const reviewUserId = review.userId as ObjectId;
      const commentCount = Math.floor(Math.random() * 12) + 4; // 4–15

      for (let i = 0; i < commentCount; i++) {
        const commenter = pickRandom(
          allUserIds,
          allUserIds.find((id) => id.equals(reviewUserId)),
        );

        allComments.push({
          _id: new ObjectId(),
          reviewId,
          commentedBy: commenter,
          commentedOn: getRandomDate(6),
          comment: commentPool[poolIndex % commentPool.length],
        });

        poolIndex++;
      }
    }

    const commentsResult = await commentsCollection.insertMany(allComments);
    console.log(
      `✅ Inserted ${commentsResult.insertedCount} comments across ${reviews.length} reviews (4–15 each)`,
    );
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

seedAll();
