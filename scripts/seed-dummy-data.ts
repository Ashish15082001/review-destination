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

// ─── 10 Users ───────────────────────────────────────────────────────────────
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

// ─── 10 Reviews (each userId maps to one of the users above) ─────────────────
const dummyReviews = [
  {
    _id: new ObjectId(),
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
    _id: new ObjectId(),
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
    _id: new ObjectId(),
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
    _id: new ObjectId(),
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
    _id: new ObjectId(),
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
    _id: new ObjectId(),
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
    _id: new ObjectId(),
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
    _id: new ObjectId(),
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
    _id: new ObjectId(),
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
    _id: new ObjectId(),
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

// ─── Seed function ────────────────────────────────────────────────────────────
async function seedDummyData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("review-destination");
    const usersCollection = db.collection("users");
    const reviewsCollection = db.collection("reviews");

    // Clear existing data
    await usersCollection.deleteMany({});
    console.log("Cleared existing users");

    await reviewsCollection.deleteMany({});
    console.log("Cleared existing reviews");

    // Insert users first so userId references are valid
    const usersResult = await usersCollection.insertMany(dummyUsers);
    console.log(`✅ Inserted ${usersResult.insertedCount} users`);

    // Insert reviews — every review.userId points to an existing user
    const reviewsResult = await reviewsCollection.insertMany(dummyReviews);
    console.log(`✅ Inserted ${reviewsResult.insertedCount} reviews`);

    // Quick validation: confirm each review's userId exists in users
    for (const review of dummyReviews) {
      const matchingUser = dummyUsers.find((u) => u._id.equals(review.userId));
      if (!matchingUser) {
        console.error(
          `❌ Review for "${review.destinationName}" has no matching user!`,
        );
      }
    }
    console.log("✅ All reviews have a valid userId");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

seedDummyData();
