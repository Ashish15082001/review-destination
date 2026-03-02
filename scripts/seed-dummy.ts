import { MongoClient, ObjectId } from "mongodb";
import { env } from "process";
import * as fs from "fs";
import * as path from "path";

// Load .env.local (Next.js convention) so ts-node picks up MONGODB_URI
const envLocalPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envLocalPath)) {
  const lines = fs.readFileSync(envLocalPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed
      .slice(eqIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

const uri = env.MONGODB_URI;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getRandomDate(monthsAgo: number = 6): Date {
  const now = new Date();
  const past = new Date();
  past.setMonth(now.getMonth() - monthsAgo);
  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime()),
  );
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[], exclude?: T[]): T {
  const filtered = exclude
    ? arr.filter((x) => !exclude.some((e) => String(e) === String(x)))
    : arr;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function pickRandomN<T>(arr: T[], n: number, exclude?: T[]): T[] {
  const pool = exclude
    ? arr.filter((x) => !exclude.some((e) => String(e) === String(x)))
    : [...arr];
  const result: T[] = [];
  const copy = [...pool];
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

// ─── 15 Users ─────────────────────────────────────────────────────────────────
const userIds = Array.from({ length: 15 }, () => new ObjectId());

const dummyUsers = [
  {
    _id: userIds[0],
    userName: "emma_johnson",
    email: "emma@example.com",
    password: "emma1234",
    registeredAt: getRandomDate(14),
  },
  {
    _id: userIds[1],
    userName: "michael_chen",
    email: "michael@example.com",
    password: "michael1234",
    registeredAt: getRandomDate(13),
  },
  {
    _id: userIds[2],
    userName: "sarah_martinez",
    email: "sarah@example.com",
    password: "sarah1234",
    registeredAt: getRandomDate(12),
  },
  {
    _id: userIds[3],
    userName: "james_wilson",
    email: "james@example.com",
    password: "james1234",
    registeredAt: getRandomDate(11),
  },
  {
    _id: userIds[4],
    userName: "olivia_brown",
    email: "olivia@example.com",
    password: "olivia1234",
    registeredAt: getRandomDate(10),
  },
  {
    _id: userIds[5],
    userName: "david_kim",
    email: "david@example.com",
    password: "david1234",
    registeredAt: getRandomDate(9),
  },
  {
    _id: userIds[6],
    userName: "sophie_anderson",
    email: "sophie@example.com",
    password: "sophie1234",
    registeredAt: getRandomDate(8),
  },
  {
    _id: userIds[7],
    userName: "alex_thompson",
    email: "alex@example.com",
    password: "alex1234",
    registeredAt: getRandomDate(7),
  },
  {
    _id: userIds[8],
    userName: "isabella_garcia",
    email: "isabella@example.com",
    password: "isabella1234",
    registeredAt: getRandomDate(6),
  },
  {
    _id: userIds[9],
    userName: "lucas_miller",
    email: "lucas@example.com",
    password: "lucas1234",
    registeredAt: getRandomDate(5),
  },
  {
    _id: userIds[10],
    userName: "chloe_davis",
    email: "chloe@example.com",
    password: "chloe1234",
    registeredAt: getRandomDate(4),
  },
  {
    _id: userIds[11],
    userName: "noah_taylor",
    email: "noah@example.com",
    password: "noah1234",
    registeredAt: getRandomDate(4),
  },
  {
    _id: userIds[12],
    userName: "ava_white",
    email: "ava@example.com",
    password: "ava1234",
    registeredAt: getRandomDate(3),
  },
  {
    _id: userIds[13],
    userName: "ethan_harris",
    email: "ethan@example.com",
    password: "ethan1234",
    registeredAt: getRandomDate(2),
  },
  {
    _id: userIds[14],
    userName: "mia_clark",
    email: "mia@example.com",
    password: "mia1234",
    registeredAt: getRandomDate(1),
  },
];

// ─── 40 Reviews ───────────────────────────────────────────────────────────────
const reviewIds = Array.from({ length: 40 }, () => new ObjectId());

interface ReviewSeed {
  destinationName: string;
  destinationPhotoUrls: string[];
  whenVisited: string;
  description: string;
  experience: string;
}

const reviewSeeds: ReviewSeed[] = [
  {
    destinationName: "Paris, France",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    ],
    whenVisited: "June 2025",
    description:
      "Paris exceeded all my expectations. The romantic ambiance, stunning architecture, and incredible food made this trip unforgettable.",
    experience:
      "Visited during summer and enjoyed perfect weather. The Seine river cruise was amazing. Locals were friendly and helpful with directions.",
  },
  {
    destinationName: "Tokyo, Japan",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
    ],
    whenVisited: "March 2025",
    description:
      "Tokyo offers an incredible mix of ancient temples and futuristic skyscrapers. The cherry blossoms in spring made it even more special.",
    experience:
      "The public transportation is flawless. Food was exceptional everywhere we went. People are incredibly polite and respectful.",
  },
  {
    destinationName: "Santorini, Greece",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
    ],
    whenVisited: "September 2025",
    description:
      "White-washed buildings with blue domes create a postcard-perfect scene. The volcanic beaches are unique and beautiful.",
    experience:
      "Stayed in Oia and watched the sunset daily. Wine tasting tours were fantastic. Greek hospitality is legendary.",
  },
  {
    destinationName: "Dubai, UAE",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
    ],
    whenVisited: "November 2025",
    description:
      "From towering skyscrapers to pristine beaches, Dubai has it all. The shopping and dining experiences are world-class.",
    experience:
      "Desert safari was thrilling. Burj Khalifa views were spectacular. The blend of traditional souks and modern malls is fascinating.",
  },
  {
    destinationName: "New York City, USA",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
    ],
    whenVisited: "October 2025",
    description:
      "NYC is a melting pot of cultures, cuisines, and experiences. Broadway shows, amazing museums, and iconic landmarks everywhere.",
    experience:
      "Walked through Central Park, caught a Broadway show, explored different neighborhoods. Each area has its own unique vibe.",
  },
  {
    destinationName: "Bali, Indonesia",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    ],
    whenVisited: "July 2025",
    description:
      "Bali offers stunning rice terraces, beautiful beaches, and ancient temples. The Balinese people are incredibly warm and spiritual.",
    experience:
      "Learned to surf in Seminyak, visited the monkey forest in Ubud, and explored waterfalls. The yoga retreats are world-renowned.",
  },
  {
    destinationName: "Rome, Italy",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5",
    ],
    whenVisited: "May 2025",
    description:
      "Rome is an open-air museum. The architecture, art, and food create an unforgettable Italian experience.",
    experience:
      "Tossed a coin in the Trevi Fountain, explored the Colosseum, and ate the best pasta and gelato. Vatican City was awe-inspiring.",
  },
  {
    destinationName: "Machu Picchu, Peru",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1",
    ],
    whenVisited: "August 2025",
    description:
      "Hiking to Machu Picchu was challenging but rewarding. The Inca architecture and mountain views are spectacular.",
    experience:
      "Did the 4-day Inca Trail trek. Watching sunrise over the ruins was magical. Our guide shared fascinating history.",
  },
  {
    destinationName: "Sydney, Australia",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
    ],
    whenVisited: "January 2025",
    description:
      "The harbour is stunning, beaches are pristine, and the food scene is incredible. Great mix of urban and natural beauty.",
    experience:
      "Climbed the Harbour Bridge, visited Bondi Beach, and saw an opera at the Opera House. Wildlife encounters were amazing.",
  },
  {
    destinationName: "Iceland",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1483347756197-71ef80e95f73",
    ],
    whenVisited: "December 2024",
    description:
      "Iceland is otherworldly — glaciers, waterfalls, geysers, and volcanic landscapes. The Blue Lagoon was incredibly relaxing.",
    experience:
      "Drove the Golden Circle, chased the Northern Lights, and bathed in hot springs. Weather was harsh but absolutely worth it.",
  },
  {
    destinationName: "Barcelona, Spain",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216",
    ],
    whenVisited: "April 2025",
    description:
      "Barcelona's unique architecture, vibrant street life, and incredible food scene make it one of Europe's most exciting cities.",
    experience:
      "Visited La Sagrada Família and Park Güell, strolled La Rambla, and enjoyed tapas in the Gothic Quarter. A feast for all the senses.",
  },
  {
    destinationName: "Cape Town, South Africa",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99",
    ],
    whenVisited: "February 2025",
    description:
      "Dramatic mountain scenery, beautiful coastline, and rich cultural diversity make Cape Town truly extraordinary.",
    experience:
      "Took the cable car up Table Mountain, visited Boulders Beach to see penguins, and explored the Winelands. Breathtaking at every turn.",
  },
  {
    destinationName: "Kyoto, Japan",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
    ],
    whenVisited: "November 2024",
    description:
      "Kyoto preserved the soul of old Japan. Thousands of temples, serene bamboo groves, and the famous geisha district of Gion.",
    experience:
      "Cycled through Arashiyama, witnessed a tea ceremony, and got lost in Nishiki Market. Autumn colors in the temples were unforgettable.",
  },
  {
    destinationName: "Maldives",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8",
    ],
    whenVisited: "January 2026",
    description:
      "Crystal-clear turquoise waters, overwater bungalows, and vibrant coral reefs — the Maldives is pure paradise.",
    experience:
      "Snorkeled with manta rays, enjoyed sunset cruises, and relaxed in the most peaceful overwater villa. Time stood still here.",
  },
  {
    destinationName: "Prague, Czech Republic",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1519677100203-a0e668c92439",
    ],
    whenVisited: "March 2025",
    description:
      "Prague's fairy-tale architecture, cobblestone streets, and centuries-old history make it one of Europe's most beautiful cities.",
    experience:
      "Crossed Charles Bridge at dawn, explored Prague Castle, and enjoyed the vibrant nightlife. Czech food and beer exceeded expectations.",
  },
  {
    destinationName: "Rio de Janeiro, Brazil",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325",
    ],
    whenVisited: "July 2025",
    description:
      "Rio is spectacular — from Christ the Redeemer to Copacabana Beach. The energy of the city is infectious and unforgettable.",
    experience:
      "Hiked to Sugarloaf Mountain, danced samba in Lapa, and watched the sunrise from Dois Irmãos hill. Absolutely electrifying city.",
  },
  {
    destinationName: "Marrakech, Morocco",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1548013146-72479768bada",
    ],
    whenVisited: "October 2024",
    description:
      "Marrakech is a sensory feast — vibrant souks, ornate palaces, and the chaos of Djemaa el-Fna square. Like stepping back in time.",
    experience:
      "Got lost in the Medina's maze-like alleys, stayed in a stunning riad, and bargained for spices and textiles. The food was extraordinary.",
  },
  {
    destinationName: "Amsterdam, Netherlands",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017",
    ],
    whenVisited: "May 2025",
    description:
      "Amsterdam's canal network, world-class museums, and cycling culture make it one of the most livable and lovable cities in Europe.",
    experience:
      "Cycled along the canals, visited the Rijksmuseum and Van Gogh Museum, and explored the flower market. Every bridge is a photo opportunity.",
  },
  {
    destinationName: "New Zealand South Island",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1519098901909-b1553a1190af",
    ],
    whenVisited: "December 2025",
    description:
      "The South Island is a breathtaking landscape of fjords, glaciers, mountains, and pristine lakes. Middle Earth brought to life.",
    experience:
      "Drove the Milford Sound road, went bungee jumping in Queenstown, and kayaked in Abel Tasman. Nature here is on another level.",
  },
  {
    destinationName: "Amalfi Coast, Italy",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca",
    ],
    whenVisited: "June 2025",
    description:
      "The cliffside villages, turquoise sea, and lemon groves of the Amalfi Coast create one of Italy's most dramatic landscapes.",
    experience:
      "Took the ferry between Positano, Amalfi, and Ravello. Hiked the Path of the Gods and ate fresh seafood pasta with a sea view every day.",
  },
  {
    destinationName: "Banff, Canada",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    ],
    whenVisited: "September 2024",
    description:
      "Banff National Park is a masterpiece of turquoise lakes, snow-capped mountains, and abundant wildlife in the Canadian Rockies.",
    experience:
      "Kayaked on Lake Louise, spotted bears and elk along the Icefields Parkway, and soaked in the Banff Upper Hot Springs. Utterly breathtaking.",
  },
  {
    destinationName: "Havana, Cuba",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    ],
    whenVisited: "February 2026",
    description:
      "Havana is a vibrant, colourful city frozen in time — vintage cars, colonial architecture, and salsa music fill every street.",
    experience:
      "Took a classic car tour around Old Havana, danced salsa at Casa de la Música, and smoked a proper Cuban cigar on the Malecón. Unforgettable.",
  },
  {
    destinationName: "Patagonia, Argentina",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1546768292-fb12f6c92568",
    ],
    whenVisited: "January 2026",
    description:
      "Patagonia is one of the last true wildernesses on Earth — jagged peaks, massive glaciers, and untouched landscapes as far as the eye can see.",
    experience:
      "Trekked the W Circuit in Torres del Paine, witnessed the Perito Moreno glacier calving, and saw condors soaring overhead. Life-changing.",
  },
  {
    destinationName: "Vienna, Austria",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1516550893923-42d28e5677af",
    ],
    whenVisited: "April 2025",
    description:
      "Vienna is a city of imperial grandeur, classical music, and exceptional coffee houses. Every building tells a story of centuries past.",
    experience:
      "Attended a Mozart concert in Schönbrunn Palace, visited the Kunsthistorisches Museum, and ate the best Sachertorte in its birthplace.",
  },
  {
    destinationName: "Petra, Jordan",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    ],
    whenVisited: "March 2025",
    description:
      "Walking through the Siq to reveal the Treasury is one of the most jaw-dropping moments in all of travel. Petra is truly a wonder.",
    experience:
      "Arrived at sunrise before the crowds, hiked up to the Monastery, and experienced Petra by Night with hundreds of candles lining the path.",
  },
  {
    destinationName: "Queenstown, New Zealand",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad",
    ],
    whenVisited: "February 2025",
    description:
      "The adventure capital of the world delivers on every promise. Stunning lake scenery combined with world-class adrenaline activities.",
    experience:
      "Went skydiving over Lake Wakatipu, did a jet boat ride, and hiked the Ben Lomond trail. Queenstown never sleeps and neither did I.",
  },
  {
    destinationName: "Lisbon, Portugal",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b",
    ],
    whenVisited: "August 2025",
    description:
      "Lisbon charms with its steep hills, colourful tiled buildings, vintage trams, and a warm, relaxed atmosphere unlike anywhere else in Europe.",
    experience:
      "Rode Tram 28 through the historic Alfama district, attended a live Fado show, and took a day trip to the enchanting palaces of Sintra.",
  },
  {
    destinationName: "Istanbul, Turkey",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200",
    ],
    whenVisited: "October 2025",
    description:
      "Istanbul straddles two continents and two worlds. Hagia Sophia, the Grand Bazaar, and the Bosphorus create an incomparable travel experience.",
    experience:
      "Explored the Blue Mosque and Topkapi Palace, haggled in the Spice Bazaar, and took a cruise along the Bosphorus at sunset. Magical.",
  },
  {
    destinationName: "Costa Rica",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1518259102261-b40117eabbc9",
    ],
    whenVisited: "December 2024",
    description:
      "Costa Rica's rainforests, volcanoes, and coastlines offer one of the richest biodiversity experiences in the world. Pura vida indeed.",
    experience:
      "Zip-lined through the Monteverde cloud forest, surfed in Tamarindo, and soaked in hot springs at the base of Arenal Volcano. Paradise.",
  },
  {
    destinationName: "Siem Reap, Cambodia",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e",
    ],
    whenVisited: "January 2025",
    description:
      "Angkor Wat is both the largest religious monument in the world and one of the most awe-inspiring sights a traveler can ever witness.",
    experience:
      "Watched sunrise at Angkor Wat, explored the jungle-enrobed Ta Prohm temple, and navigated the floating villages of the Tonlé Sap lake.",
  },
  {
    destinationName: "Dubrovnik, Croatia",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1555990793-da11153b2473",
    ],
    whenVisited: "July 2025",
    description:
      "Dubrovnik's famous city walls, red-roofed Old Town, and azure Adriatic waters make it one of the most beautiful cities in the world.",
    experience:
      "Walked the entire city walls at golden hour, kayaked around the Old Town, and took the cable car up Mount Srđ for a panoramic view.",
  },
  {
    destinationName: "Serengeti, Tanzania",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5",
    ],
    whenVisited: "August 2024",
    description:
      "Witnessing the Great Migration on the Serengeti is one of the most breathtaking natural spectacles on the planet. Pure wildlife magic.",
    experience:
      "Spent five days on safari, saw the Big Five, witnessed wildebeest crossing the Mara River, and slept under the African stars in a tented camp.",
  },
  {
    destinationName: "Cinque Terre, Italy",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963",
    ],
    whenVisited: "June 2024",
    description:
      "Five pastel-coloured fishing villages clinging to dramatic cliffs above the Ligurian Sea. Cinque Terre is a fairy tale made real.",
    experience:
      "Hiked the trail connecting all five villages, swam in hidden coves, and ate fresh focaccia and pesto in every town. Absolutely charming.",
  },
  {
    destinationName: "Edinburgh, Scotland",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1549877452-9c387954fbc2",
    ],
    whenVisited: "November 2025",
    description:
      "Edinburgh's dramatic castle, hauntingly beautiful Old Town, and vibrant cultural scene make it the jewel of Scotland.",
    experience:
      "Hiked Arthur's Seat at sunrise, explored the Royal Mile, visited Edinburgh Castle, and attended a whisky tasting. Atmosphere was incredible.",
  },
  {
    destinationName: "Phuket, Thailand",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa",
    ],
    whenVisited: "February 2025",
    description:
      "Phuket serves up gorgeous beaches, vibrant nightlife, delicious street food, and nearby island-hopping adventures.",
    experience:
      "Took a longboat to Phi Phi Islands, explored James Bond Island, ate pad thai on the street, and watched fire shows on Bangla Road.",
  },
  {
    destinationName: "Reykjavik, Iceland",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1474690870753-1b92efa1f2d8",
    ],
    whenVisited: "January 2026",
    description:
      "Reykjavik is a small, vibrant city where geothermal energy heats homes, colorful houses dot the hillsides, and the Northern Lights dance overhead.",
    experience:
      "Visited the iconic Hallgrímskirkja church, explored the geothermal pools, and took a whale watching tour. Saw the Northern Lights on night two!",
  },
  {
    destinationName: "Chefchaouen, Morocco",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1553254648-2d58d1bc17b9",
    ],
    whenVisited: "October 2025",
    description:
      "The Blue Pearl of Morocco is unlike anywhere on Earth. Every alley, wall, and staircase is painted in stunning shades of blue.",
    experience:
      "Wandered the blue medina for hours getting wonderfully lost, tried incredible Moroccan mint tea, and hiked up to the Spanish mosque at sunset.",
  },
  {
    destinationName: "Vancouver, Canada",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1559511260-66a654ae982a",
    ],
    whenVisited: "September 2025",
    description:
      "Vancouver seamlessly blends city life with stunning mountain and ocean scenery. A world-class city with nature as its backyard.",
    experience:
      "Cycled Stanley Park, hiked the Grouse Grind, kayaked in Deep Cove, and ate the world's best sushi in Steveston. Could move here tomorrow.",
  },
  {
    destinationName: "Valletta, Malta",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1633158829799-96bb13cab779",
    ],
    whenVisited: "May 2024",
    description:
      "Europe's smallest capital is packed with baroque architecture, Crusader history, and some of the Mediterranean's most dramatic harbour views.",
    experience:
      "Explored the Grand Harbour by boat, visited the Co-Cathedral with Caravaggio's masterpiece, and swam in the ancient St. Peter's Pool.",
  },
  {
    destinationName: "Ha Long Bay, Vietnam",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186",
    ],
    whenVisited: "March 2026",
    description:
      "Ha Long Bay's 1,600 limestone karsts rising from emerald green water create one of the most iconic and magical seascapes in Asia.",
    experience:
      "Spent two nights on a traditional junk boat, kayaked into sea caves, watched sunrise from the top deck, and tasted the freshest seafood of my life.",
  },
  {
    destinationName: "Namibia",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35",
    ],
    whenVisited: "August 2025",
    description:
      "Namibia is a land of extreme landscapes — towering red dunes, ancient deserts, and some of Africa's most magnificent wildlife.",
    experience:
      "Climbed the famous Dune 45 at sunrise in Sossusvlei, explored the ghost town of Kolmanskop, and did a self-drive safari through Etosha National Park.",
  },
];

// ─── Comment pool ─────────────────────────────────────────────────────────────
const commentPool = [
  "This place looks absolutely stunning! Adding it to my bucket list right away.",
  "Great review! We had a very similar experience when we visited last year.",
  "The photos are gorgeous. Did you need to book tickets far in advance?",
  "Thanks for sharing! How was the local food scene? Any restaurant recommendations?",
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
  "Did you feel safe traveling there solo? It's on my list for a solo trip next year.",
  "We almost skipped this destination — so glad we didn't after reading reviews like yours!",
  "The nightlife there is also surprisingly vibrant if you're into that sort of thing.",
  "How was the weather? We're thinking of going in autumn — is that a good time?",
  "I have this destination saved on my travel map. Your review just moved it way up the priority list.",
  "Such an interesting mix of old and new. I love destinations that have that contrast.",
  "We stayed for two weeks and still felt we hadn't seen enough. Highly recommend going slow.",
  "The journey there is half the adventure! Getting to remote places like this is part of the experience.",
  "Do you need to arrange a visa in advance or can you get one on arrival?",
  "The cost of living there surprised me — it was far more affordable than I expected.",
  "We're a family of four — do you think it's suitable for kids as well?",
  "Your photos made my jaw drop. The real thing must be even more incredible.",
  "This is the third glowing review I've read about this place. I think the universe is telling me to go!",
];

// ─── Build dummyReviews ───────────────────────────────────────────────────────
const dummyReviews = reviewSeeds.map((seed, i) => ({
  _id: reviewIds[i],
  userId: userIds[i % userIds.length],
  ...seed,
  datePosted: getRandomDate(randomInt(1, 12)),
}));

// ─── Seed function ─────────────────────────────────────────────────────────────
async function seedDummy() {
  if (!uri) {
    console.error("❌  Error: MONGODB_URI environment variable is not set.");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅  Connected to MongoDB");

    const db = client.db("review-destination");
    const usersCol = db.collection("users");
    const reviewsCol = db.collection("reviews");
    const likesCol = db.collection("likes");
    const commentsCol = db.collection("comments");

    // ── Users ──────────────────────────────────────────────────────────────────
    const existingUsers = await usersCol.countDocuments();
    if (existingUsers === 0) {
      const r = await usersCol.insertMany(dummyUsers);
      console.log(`✅  Inserted ${r.insertedCount} users`);
    } else {
      console.log(`⏭️   Skipped users (${existingUsers} already exist)`);
    }

    // ── Reviews ────────────────────────────────────────────────────────────────
    const existingReviews = await reviewsCol.countDocuments();
    if (existingReviews === 0) {
      const r = await reviewsCol.insertMany(dummyReviews);
      console.log(`✅  Inserted ${r.insertedCount} reviews`);
    } else {
      console.log(`⏭️   Skipped reviews (${existingReviews} already exist)`);
    }

    // ── Likes (5–10 per review) ────────────────────────────────────────────────
    await likesCol.deleteMany({});
    console.log("🗑️   Cleared existing likes");

    const allLikes = dummyReviews.flatMap((review) => {
      const likeCount = randomInt(5, 10);
      // Pick distinct users who are NOT the review author
      const likers = pickRandomN(userIds, likeCount, [review.userId]);
      return likers.map((userId) => ({
        _id: new ObjectId(),
        reviewId: review._id,
        likedBy: userId,
        likedOn: getRandomDate(6),
      }));
    });

    const likesResult = await likesCol.insertMany(allLikes);
    console.log(
      `✅  Inserted ${likesResult.insertedCount} likes across ${dummyReviews.length} reviews (5–10 each)`,
    );

    // ── Comments (5–10 per review) ─────────────────────────────────────────────
    await commentsCol.deleteMany({});
    console.log("🗑️   Cleared existing comments");

    let poolIdx = 0;
    const allComments = dummyReviews.flatMap((review) => {
      const commentCount = randomInt(5, 10);
      // Pick distinct commenters who are NOT the review author
      const commenters = pickRandomN(userIds, commentCount, [review.userId]);
      return commenters.map((userId) => {
        const comment = {
          _id: new ObjectId(),
          reviewId: review._id,
          commentedBy: userId,
          commentedOn: getRandomDate(6),
          comment: commentPool[poolIdx % commentPool.length],
          idsOfUsersWhoLiked: [] as ObjectId[],
          idsOfUsersWhoDisliked: [] as ObjectId[],
        };
        poolIdx++;
        return comment;
      });
    });

    const commentsResult = await commentsCol.insertMany(allComments);
    console.log(
      `✅  Inserted ${commentsResult.insertedCount} comments across ${dummyReviews.length} reviews (5–10 each)`,
    );

    // ── Summary ────────────────────────────────────────────────────────────────
    console.log("\n📊  Seed Summary:");
    console.log(`   Users    : ${await usersCol.countDocuments()}`);
    console.log(`   Reviews  : ${await reviewsCol.countDocuments()}`);
    console.log(`   Likes    : ${await likesCol.countDocuments()}`);
    console.log(`   Comments : ${await commentsCol.countDocuments()}`);
  } catch (error) {
    console.error("❌  Error seeding data:", error);
  } finally {
    await client.close();
    console.log("\n🔌  Connection closed");
  }
}

seedDummy();
