import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://ashish:12345@cluster0.r2ify.mongodb.net/?retryWrites=true&w=majority";

// Helper function to generate random date within the last 6 months
function getRandomDatePosted() {
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  const randomTime =
    sixMonthsAgo.getTime() +
    Math.random() * (now.getTime() - sixMonthsAgo.getTime());
  return new Date(randomTime);
}

const dummyReviews = [
  {
    userName: "Emma Johnson",
    destinationName: "Paris, France",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34"],
    whenVisited: "June 2025",
    review:
      "An absolutely magical experience! The Eiffel Tower at sunset is breathtaking.",
    description:
      "Paris exceeded all my expectations. The romantic ambiance, stunning architecture, and incredible food made this trip unforgettable.",
    experience:
      "Visited during summer, enjoyed perfect weather. The Seine river cruise was amazing. Locals were friendly and helpful with directions.",
    famousLocations:
      "Eiffel Tower, Louvre Museum, Notre-Dame Cathedral, Arc de Triomphe, Champs-Élysées",
    datePosted: getRandomDatePosted(),
  },
  {
    userName: "Michael Chen",
    destinationName: "Tokyo, Japan",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf"],
    whenVisited: "March 2025",
    review:
      "A perfect blend of traditional culture and modern technology. Tokyo is truly unique!",
    description:
      "Tokyo offers an incredible mix of ancient temples and futuristic skyscrapers. The cherry blossoms in spring made it even more special.",
    experience:
      "The public transportation is flawless. Food was exceptional everywhere we went. People are incredibly polite and respectful.",
    famousLocations:
      "Senso-ji Temple, Tokyo Tower, Shibuya Crossing, Meiji Shrine, Imperial Palace",
    datePosted: getRandomDatePosted(),
  },
  {
    userName: "Sarah Martinez",
    destinationName: "Santorini, Greece",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff"],
    whenVisited: "September 2025",
    review:
      "The most stunning sunsets I've ever witnessed. Santorini is paradise on earth!",
    description:
      "White-washed buildings with blue domes create a postcard-perfect scene. The volcanic beaches are unique and beautiful.",
    experience:
      "Stayed in Oia, watched sunset daily. Wine tasting tours were fantastic. Greek hospitality is legendary - everyone was so welcoming.",
    famousLocations:
      "Oia Village, Red Beach, Akrotiri Archaeological Site, Fira Town, Santo Winery",
    datePosted: getRandomDatePosted(),
  },
  {
    userName: "James Wilson",
    destinationName: "Dubai, UAE",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c"],
    whenVisited: "November 2025",
    review:
      "Luxury and innovation at every corner. Dubai is a city of the future!",
    description:
      "From towering skyscrapers to pristine beaches, Dubai has it all. The shopping and dining experiences are world-class.",
    experience:
      "Desert safari was thrilling. Burj Khalifa views were spectacular. The blend of traditional souks and modern malls is fascinating.",
    famousLocations:
      "Burj Khalifa, Dubai Mall, Palm Jumeirah, Burj Al Arab, Dubai Marina",
    datePosted: getRandomDatePosted(),
  },
  {
    userName: "Olivia Brown",
    destinationName: "New York City, USA",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9"],
    whenVisited: "October 2025",
    review:
      "The city that never sleeps lived up to its name! Non-stop energy and excitement.",
    description:
      "NYC is a melting pot of cultures, cuisines, and experiences. Broadway shows, amazing museums, and iconic landmarks everywhere.",
    experience:
      "Walked through Central Park, caught a Broadway show, explored different neighborhoods. Each area has its own unique vibe.",
    famousLocations:
      "Statue of Liberty, Times Square, Central Park, Empire State Building, Brooklyn Bridge",
    datePosted: getRandomDatePosted(),
  },
  {
    userName: "David Kim",
    destinationName: "Bali, Indonesia",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4"],
    whenVisited: "July 2025",
    review:
      "A tropical paradise with rich culture. Perfect for relaxation and adventure!",
    description:
      "Bali offers stunning rice terraces, beautiful beaches, and ancient temples. The Balinese people are incredibly warm and spiritual.",
    experience:
      "Learned to surf in Seminyak, visited monkey forest in Ubud, explored waterfalls. The yoga retreats are world-renowned.",
    famousLocations:
      "Tanah Lot Temple, Tegalalang Rice Terraces, Ubud Monkey Forest, Mount Batur, Seminyak Beach",
    datePosted: getRandomDatePosted(),
  },
  {
    userName: "Sophie Anderson",
    destinationName: "Rome, Italy",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5"],
    whenVisited: "May 2025",
    review:
      "Walking through ancient history! Every corner tells a story thousands of years old.",
    description:
      "Rome is an open-air museum. The architecture, art, and food create an unforgettable Italian experience.",
    experience:
      "Tossed a coin in Trevi Fountain, explored the Colosseum, ate the best pasta and gelato. Vatican City was awe-inspiring.",
    famousLocations:
      "Colosseum, Vatican City, Trevi Fountain, Roman Forum, Pantheon",
    datePosted: getRandomDatePosted(),
  },
  {
    userName: "Alex Thompson",
    destinationName: "Machu Picchu, Peru",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1"],
    whenVisited: "August 2025",
    review:
      "A bucket list destination that exceeded expectations! The ancient ruins are breathtaking.",
    description:
      "Hiking to Machu Picchu was challenging but rewarding. The Inca architecture and mountain views are spectacular.",
    experience:
      "Did the 4-day Inca Trail trek. Watching sunrise over the ruins was magical. Our guide shared fascinating history.",
    famousLocations:
      "Machu Picchu Citadel, Temple of the Sun, Inca Bridge, Huayna Picchu, Sacred Valley",
    datePosted: getRandomDatePosted(),
  },
  {
    userName: "Isabella Garcia",
    destinationName: "Sydney, Australia",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9"],
    whenVisited: "January 2025",
    review:
      "Beautiful beaches, iconic landmarks, and friendly locals. Sydney has it all!",
    description:
      "The harbor is stunning, beaches are pristine, and the food scene is incredible. Great mix of urban and natural beauty.",
    experience:
      "Climbed the Harbour Bridge, visited Bondi Beach, saw an opera at the Opera House. Wildlife encounters were amazing.",
    famousLocations:
      "Sydney Opera House, Harbour Bridge, Bondi Beach, Darling Harbour, Taronga Zoo",
    datePosted: getRandomDatePosted(),
  },
  {
    userName: "Lucas Miller",
    destinationName: "Iceland",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1483347756197-71ef80e95f73"],
    whenVisited: "December 2024",
    review:
      "Nature's most dramatic landscapes! Seeing the Northern Lights was a dream come true.",
    description:
      "Iceland is otherworldly - glaciers, waterfalls, geysers, and volcanic landscapes. The Blue Lagoon was incredibly relaxing.",
    experience:
      "Drove the Golden Circle, chased Northern Lights, bathed in hot springs. Weather was harsh but worth it.",
    famousLocations:
      "Blue Lagoon, Golden Circle, Gullfoss Waterfall, Geysir, Jökulsárlón Glacier Lagoon",
    datePosted: getRandomDatePosted(),
  },
  {
    userName: "Mia Robinson",
    destinationName: "Barcelona, Spain",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1583422409516-2895a77efded"],
    whenVisited: "April 2025",
    review:
      "Gaudí's architecture is mind-blowing! Barcelona is vibrant, artistic, and full of life.",
    description:
      "The combination of beach, culture, and nightlife makes Barcelona perfect. Tapas bars on every corner, each better than the last.",
    experience:
      "Explored Park Güell at sunrise, toured Sagrada Familia, relaxed at Barceloneta Beach. The Gothic Quarter is enchanting.",
    famousLocations:
      "Sagrada Familia, Park Güell, Las Ramblas, Gothic Quarter, Casa Batlló",
    datePosted: getRandomDatePosted(),
  },
  {
    userName: "Ryan O'Connor",
    destinationName: "Cape Town, South Africa",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99"],
    whenVisited: "February 2025",
    review:
      "Stunning natural beauty meets vibrant culture. Table Mountain views are incredible!",
    description:
      "Cape Town offers mountains, beaches, vineyards, and wildlife. The diversity of experiences is unmatched.",
    experience:
      "Hiked Table Mountain, visited penguin colony, toured wine estates. Sunset from Signal Hill was spectacular.",
    famousLocations:
      "Table Mountain, Cape Point, Robben Island, V&A Waterfront, Boulders Beach",
    datePosted: getRandomDatePosted(),
  },
  {
    userName: "Emily White",
    destinationName: "London, England",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad"],
    whenVisited: "August 2024",
    review:
      "History, culture, and modern charm perfectly blended. London is endlessly fascinating!",
    description:
      "From royal palaces to trendy markets, London has something for everyone. The theater scene and museums are world-class.",
    experience:
      "Watched changing of the guard, rode the London Eye, explored British Museum. Afternoon tea was delightful.",
    famousLocations:
      "Big Ben, Tower of London, Buckingham Palace, British Museum, Tower Bridge",
    datePosted: getRandomDatePosted(),
  },
  {
    userName: "Daniel Lee",
    destinationName: "Maldives",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8"],
    whenVisited: "March 2026",
    review:
      "Pure luxury and tranquility. The crystal-clear waters and overwater villas are paradise!",
    description:
      "The Maldives is the ultimate tropical getaway. Pristine beaches, colorful coral reefs, and incredible marine life.",
    experience:
      "Stayed in an overwater bungalow, went snorkeling with manta rays, enjoyed spa treatments. Perfect honeymoon destination.",
    famousLocations:
      "Malé City, Vaadhoo Island, Banana Reef, HP Reef, Maafushi Island",
    datePosted: getRandomDatePosted(),
  },
  {
    userName: "Hannah Scott",
    destinationName: "Cairo, Egypt",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1572252009286-268acec5ca0a"],
    whenVisited: "January 2026",
    review:
      "Standing before the pyramids was surreal! Ancient wonders that truly amaze.",
    description:
      "Egypt's history comes alive in Cairo. The pyramids, sphinx, and Egyptian Museum are incredible.",
    experience:
      "Rode a camel at Giza, explored inside a pyramid, sailed on the Nile. The bazaars are vibrant and colorful.",
    famousLocations:
      "Great Pyramid of Giza, Sphinx, Egyptian Museum, Khan el-Khalili Bazaar, Nile River",
    datePosted: getRandomDatePosted(),
  },
  {
    userName: "Christopher Davis",
    destinationName: "Amsterdam, Netherlands",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017"],
    whenVisited: "September 2024",
    review:
      "Charming canals and rich culture. Biking around Amsterdam is the best way to explore!",
    description:
      "Amsterdam is picturesque and laid-back. The canal houses, museums, and cafe culture create a unique atmosphere.",
    experience:
      "Biked everywhere, visited Anne Frank House, explored Van Gogh Museum. Tulip fields nearby were stunning.",
    famousLocations:
      "Anne Frank House, Van Gogh Museum, Rijksmuseum, Canal Belt, Vondelpark",
    datePosted: getRandomDatePosted(),
  },
  {
    userName: "Zoe Martinez",
    destinationName: "Rio de Janeiro, Brazil",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325"],
    whenVisited: "February 2025",
    review:
      "Vibrant energy and stunning beaches! Christ the Redeemer offers breathtaking views.",
    description:
      "Rio combines natural beauty with lively culture. The beaches, mountains, and samba create an unforgettable experience.",
    experience:
      "Visited Christ the Redeemer, relaxed at Copacabana and Ipanema beaches, took cable car up Sugarloaf Mountain.",
    famousLocations:
      "Christ the Redeemer, Copacabana Beach, Sugarloaf Mountain, Ipanema Beach, Tijuca Forest",
    datePosted: getRandomDatePosted(),
  },
  {
    userName: "Nathan Young",
    destinationName: "Singapore",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd"],
    whenVisited: "December 2025",
    review:
      "A futuristic garden city! Clean, safe, and incredibly efficient with amazing food.",
    description:
      "Singapore is a melting pot of cultures with stunning modern architecture. The hawker centers offer world-class street food.",
    experience:
      "Explored Gardens by the Bay at night, stayed at Marina Bay Sands, visited Sentosa Island. Food was incredible.",
    famousLocations:
      "Marina Bay Sands, Gardens by the Bay, Sentosa Island, Singapore Zoo, Orchard Road",
    datePosted: getRandomDatePosted(),
  },
  {
    userName: "Chloe Taylor",
    destinationName: "Prague, Czech Republic",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1541849546-216549ae216d"],
    whenVisited: "October 2024",
    review:
      "A fairy-tale city with stunning Gothic architecture. Prague is incredibly romantic!",
    description:
      "Prague's old town is magical, especially at night. The castle, bridges, and churches are beautifully preserved.",
    experience:
      "Walked across Charles Bridge at sunset, toured Prague Castle, enjoyed Czech beer and traditional food.",
    famousLocations:
      "Prague Castle, Charles Bridge, Old Town Square, Astronomical Clock, Wenceslas Square",
    datePosted: getRandomDatePosted(),
  },
  {
    userName: "Jack Harrison",
    destinationName: "Banff, Canada",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce"],
    whenVisited: "July 2025",
    review:
      "Mountain paradise! The turquoise lakes and stunning peaks are unforgettable.",
    description:
      "Banff National Park is nature at its finest. Crystal-clear lakes, towering mountains, and abundant wildlife.",
    experience:
      "Hiked to Lake Louise and Moraine Lake, spotted elk and bears, soaked in hot springs. The Icefields Parkway drive was epic.",
    famousLocations:
      "Lake Louise, Moraine Lake, Banff Gondola, Johnston Canyon, Columbia Icefield",
    datePosted: getRandomDatePosted(),
  },
  {
    userName: "Alex Rodriguez",
    destinationName: "Kyoto, Japan",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e"],
    whenVisited: "January 2026",
    review:
      "A serene journey through ancient Japan. The temples and gardens are absolutely mesmerizing!",
    description:
      "Kyoto is the cultural heart of Japan with over 2,000 temples and shrines. The traditional geisha district and bamboo forests create a magical atmosphere.",
    experience:
      "Walked through Fushimi Inari's thousand torii gates, experienced a traditional tea ceremony, explored Arashiyama bamboo grove. The autumn colors were spectacular.",
    famousLocations:
      "Fushimi Inari Shrine, Kinkaku-ji Temple, Arashiyama Bamboo Grove, Kiyomizu-dera Temple, Gion District",
    datePosted: getRandomDatePosted(),
  },
];

async function seedReviews() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("review-destination");
    const collection = db.collection("reviews");

    // Clear existing data
    await collection.deleteMany({});
    console.log("Cleared existing reviews");

    // Insert dummy reviews
    const result = await collection.insertMany(dummyReviews);
    console.log(`✅ Successfully inserted ${result.insertedCount} reviews`);
  } catch (error) {
    console.error("Error seeding reviews:", error);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

// seedReviews();
