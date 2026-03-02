import { MongoClient, ObjectId } from "mongodb";
import { env } from "process";
import * as fs from "fs";
import * as path from "path";
import bcrypt from "bcrypt";

// ─── Load .env.local ──────────────────────────────────────────────────────────
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
    if (key && !(key in process.env)) process.env[key] = value;
  }
}

const uri = env.MONGODB_URI;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(monthsAgo: number = 12): Date {
  const now = new Date();
  const past = new Date();
  past.setMonth(now.getMonth() - monthsAgo);
  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime()),
  );
}

/** Pick n distinct items from arr, excluding any items in the exclude list. */
function pickRandomN<T>(arr: T[], n: number, exclude: T[] = []): T[] {
  const excludeSet = new Set(exclude.map(String));
  const pool = arr.filter((x) => !excludeSet.has(String(x)));
  const result: T[] = [];
  const copy = [...pool];
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(...copy.splice(idx, 1));
  }
  return result;
}

// ─── 50 User definitions ──────────────────────────────────────────────────────
const firstNames = [
  "Emma",
  "Liam",
  "Olivia",
  "Noah",
  "Ava",
  "Elijah",
  "Sophia",
  "James",
  "Isabella",
  "Oliver",
  "Mia",
  "William",
  "Charlotte",
  "Benjamin",
  "Amelia",
  "Lucas",
  "Harper",
  "Henry",
  "Evelyn",
  "Alexander",
  "Abigail",
  "Mason",
  "Emily",
  "Ethan",
  "Ella",
  "Daniel",
  "Elizabeth",
  "Logan",
  "Camila",
  "Jackson",
  "Luna",
  "Sebastian",
  "Sofia",
  "Jack",
  "Avery",
  "Aiden",
  "Mila",
  "Owen",
  "Aria",
  "Samuel",
  "Scarlett",
  "Ryan",
  "Penelope",
  "Nathan",
  "Layla",
  "Adam",
  "Chloe",
  "Joshua",
  "Victoria",
  "Dylan",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Rivera",
  "Campbell",
  "Mitchell",
  "Carter",
  "Roberts",
];

// ─── Destination pool (50 entries) ────────────────────────────────────────────
interface DestinationSeed {
  destinationName: string;
  destinationPhotoUrls: string[];
  whenVisited: string;
  description: string;
  experience: string;
}

const visitDates = [
  "January 2025",
  "February 2025",
  "March 2025",
  "April 2025",
  "May 2025",
  "June 2025",
  "July 2025",
  "August 2025",
  "September 2025",
  "October 2025",
  "November 2025",
  "December 2025",
  "January 2026",
  "February 2026",
];

const destinationPool: DestinationSeed[] = [
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
    whenVisited: "April 2025",
    description:
      "Tokyo is a city of extraordinary contrasts — ancient temples stand beside neon-lit skyscrapers. It's unlike any place on Earth.",
    experience:
      "Cherry blossom season was breathtaking. The ramen shops, street food markets, and the calm of Senso-ji at dawn made every day magical.",
  },
  {
    destinationName: "Santorini, Greece",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1507501336603-6260fac72431",
    ],
    whenVisited: "July 2025",
    description:
      "Whitewashed buildings cascading down volcanic cliffs and sunsets over the caldera — Santorini is the Mediterranean dream made real.",
    experience:
      "Stayed in Oia and watched the famous sunset with a glass of local wine. Boat tour of the caldera and hot springs was a highlight.",
  },
  {
    destinationName: "Bali, Indonesia",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    ],
    whenVisited: "September 2025",
    description:
      "Bali's spiritual energy, lush rice terraces, and warm hospitality create a travel experience that stays with you long after you leave.",
    experience:
      "Uluwatu temple at sunset, early morning yoga in Ubud, and surfing lessons in Kuta. The Balinese people are incredibly welcoming.",
  },
  {
    destinationName: "New York City, USA",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625",
    ],
    whenVisited: "October 2025",
    description:
      "There's truly no city like New York. The energy, diversity, and sheer scale of everything makes every visit feel like a new discovery.",
    experience:
      "Central Park in fall colours, the High Line at dusk, and a Broadway show rounded out an unforgettable long weekend.",
  },
  {
    destinationName: "Machu Picchu, Peru",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1",
    ],
    whenVisited: "August 2025",
    description:
      "Standing atop Machu Picchu with clouds rolling through the ruins is one of those rare travel moments that genuinely takes your breath away.",
    experience:
      "Took the train from Cusco and hiked the Sun Gate trail. Arriving at the citadel at dawn before the crowds was absolutely worth the early start.",
  },
  {
    destinationName: "Safari in Kenya",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e",
    ],
    whenVisited: "July 2025",
    description:
      "Witnessing the Great Migration in the Masai Mara is one of the most humbling natural spectacles on the planet.",
    experience:
      "Game drives twice daily, sleeping in a tented camp under the stars, and meeting the Maasai community were transformative experiences.",
  },
  {
    destinationName: "Iceland",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1531168486276-f3a37b4da82e",
    ],
    whenVisited: "February 2025",
    description:
      "Iceland is another world entirely — geysers, waterfalls, volcanic landscapes, and the Northern Lights dancing overhead.",
    experience:
      "Drove the Golden Circle, soaked in the Blue Lagoon, and spent three nights chasing the aurora borealis with incredible success.",
  },
  {
    destinationName: "The Amalfi Coast, Italy",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963",
    ],
    whenVisited: "May 2025",
    description:
      "Cliffside villages clinging to steep hillsides above a turquoise sea — the Amalfi Coast is the most cinematic coastline in Europe.",
    experience:
      "Hired a scooter and rode between Positano and Ravello, stopping at every viewpoint. The limoncello and fresh pasta were divine.",
  },
  {
    destinationName: "Kyoto, Japan",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
    ],
    whenVisited: "March 2025",
    description:
      "Kyoto is Japan's cultural soul — bamboo groves, golden pavilions, geisha districts, and thousands of shrines create a timeless atmosphere.",
    experience:
      "Walked the Philosopher's Path at dusk, attended a traditional tea ceremony, and got wonderfully lost in Gion's lantern-lit alleys.",
  },
  {
    destinationName: "Cape Town, South Africa",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99",
    ],
    whenVisited: "December 2025",
    description:
      "Cape Town is one of the world's most dramatically beautiful cities with Table Mountain as a constant, majestic backdrop.",
    experience:
      "Cable car up Table Mountain, penguin colony at Boulders Beach, and a wine tour through Stellenbosch made for a perfect week.",
  },
  {
    destinationName: "Petra, Jordan",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1539768942893-daf53448371c",
    ],
    whenVisited: "November 2025",
    description:
      "Petra is one of history's greatest wonders. Walking through the Siq and seeing the Treasury emerge before you is utterly jaw-dropping.",
    experience:
      "Arrived at dawn to have the Treasury to ourselves. Spent the full day exploring the mountain trails and the Monastery at the top.",
  },
  {
    destinationName: "Marrakech, Morocco",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1597211684565-dca64d72bdfe",
    ],
    whenVisited: "January 2025",
    description:
      "Marrakech is a full sensory explosion — the souks, the spices, the call to prayer echoing across the medina, and the vibrant Djemaa el-Fna.",
    experience:
      "Stayed in a beautiful riad, took a half-day cooking class, and spent hours getting blissfully lost in the winding lanes of the medina.",
  },
  {
    destinationName: "Patagonia, Argentina",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    ],
    whenVisited: "January 2026",
    description:
      "Patagonia is raw, wild, and immense. Towering glaciers, jagged granite peaks, and vast emptiness make it feel like the edge of the world.",
    experience:
      "Trekked the W circuit in Torres del Paine, saw the Perito Moreno glacier calving, and wild-camped in landscapes of staggering beauty.",
  },
  {
    destinationName: "Dubrovnik, Croatia",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1555990538-1e5c1f76e667",
    ],
    whenVisited: "September 2025",
    description:
      "The walled Old Town of Dubrovnik is so impossibly picturesque it almost looks like a film set. Because, well, it is — Game of Thrones was filmed here.",
    experience:
      "Walked the city walls at sunrise before the crowds arrived, kayaked around the cliffs, and took a day trip to the Elafiti islands.",
  },
  {
    destinationName: "Banff, Canada",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1561134643-668f9057cce4",
    ],
    whenVisited: "August 2025",
    description:
      "Banff National Park is a masterpiece of Canadian wilderness — turquoise glacial lakes, endless mountain views, and rich wildlife around every bend.",
    experience:
      "Canoed on Lake Louise at 7am, hiked to the Plain of Six Glaciers teahouse, and spotted a black bear on the Icefields Parkway drive.",
  },
  {
    destinationName: "Chefchaouen, Morocco",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1553254648-2d58d1bc17b9",
    ],
    whenVisited: "October 2025",
    description:
      "The Blue Pearl of Morocco — every alley, wall, and staircase painted in dreamy shades of blue. One of the most photogenic towns on Earth.",
    experience:
      "Spent three days wandering the medina without a map, sipping mint tea on rooftop cafes, and chasing the perfect golden-hour shot.",
  },
  {
    destinationName: "Ha Long Bay, Vietnam",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186",
    ],
    whenVisited: "March 2026",
    description:
      "Ha Long Bay's 1,600 limestone karsts rising from emerald water create one of the most iconic and magical seascapes in the world.",
    experience:
      "Two nights on a traditional junk boat, kayaking into sea caves at dawn, watching sunrise from the top deck, and eating the freshest seafood imaginable.",
  },
  {
    destinationName: "Prague, Czech Republic",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1541849546-216549ae216d",
    ],
    whenVisited: "December 2025",
    description:
      "Prague's medieval Old Town, stunning castle complex, and fairy-tale bridges make it one of Europe's most achingly beautiful cities.",
    experience:
      "The Christmas market in the Old Town Square was magical. We crossed Charles Bridge at midnight — utterly deserted and unforgettable.",
  },
  {
    destinationName: "Maldives",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8",
    ],
    whenVisited: "February 2026",
    description:
      "Overwater bungalows, crystal-clear lagoons, and some of the best snorkelling on Earth — the Maldives is paradise, pure and simple.",
    experience:
      "Woke up and jumped straight into the ocean from our deck, snorkelled with manta rays, and watched bioluminescent plankton glow at night.",
  },
  {
    destinationName: "Edinburgh, Scotland",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1506377585622-bedcbb5a9d47",
    ],
    whenVisited: "August 2025",
    description:
      "Edinburgh is a city of dramatic beauty, rich history, and lively culture. The Castle looming over the Royal Mile is an enduring icon.",
    experience:
      "Visited during the Fringe Festival — the city was electric. Climbed Arthur's Seat at dawn for panoramic views and toured the whisky distillery.",
  },
  {
    destinationName: "Zhangjiajie, China",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1593158700108-c9c77db7e4b9",
    ],
    whenVisited: "October 2025",
    description:
      "The towering sandstone pillars shrouded in mist inspired the floating mountains of Avatar. In real life, they're even more surreal.",
    experience:
      "Rode the world's longest cable car, walked the glass bridge over the canyon, and hiked six hours through mist with almost no other tourists.",
  },
  {
    destinationName: "Amsterdam, Netherlands",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017",
    ],
    whenVisited: "April 2025",
    description:
      "Amsterdam in tulip season is a masterpiece. Canals, cycling culture, world-class museums, and liberal atmosphere combine perfectly.",
    experience:
      "Cycled through the Keukenhof tulip gardens at peak bloom, took a canal boat tour at dusk, and spent a morning in the Van Gogh Museum.",
  },
  {
    destinationName: "Serengeti, Tanzania",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6",
    ],
    whenVisited: "July 2025",
    description:
      "The Serengeti's endless golden plains filled with wildlife is the Africa of imagination — and the reality is even more powerful.",
    experience:
      "Witnessed a lion pride taking down a wildebeest, hot air ballooned over the plains at sunrise, and camped under a sky dense with stars.",
  },
  {
    destinationName: "New Zealand South Island",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
    ],
    whenVisited: "January 2025",
    description:
      "Fiordland, glaciers, turquoise lakes, and dramatic mountains — the South Island delivers some of the most breathtaking scenery on Earth.",
    experience:
      "Kayaked in Milford Sound in the rain (which is the best time to visit), drove the Queenstown–Wanaka highway, and bungee jumped over the Kawarau gorge.",
  },
  {
    destinationName: "Lisbon, Portugal",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1548707309-dcebeab9ea9b",
    ],
    whenVisited: "May 2025",
    description:
      "Lisbon's hills, tram bells, azulejo tiles, and soul-stirring fado music make it one of Europe's most charming and underrated capitals.",
    experience:
      "Rode Tram 28 through the Alfama, ate pastéis de nata warm from the oven at Belém, and watched sunset over the 25 de Abril bridge.",
  },
  {
    destinationName: "Havana, Cuba",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1500759285222-a95626b934cb",
    ],
    whenVisited: "February 2025",
    description:
      "Havana is a city frozen in time — crumbling baroque buildings, vibrant street murals, classic cars, and the sound of salsa on every corner.",
    experience:
      "Hired a 1957 Chevrolet for a city tour, sipped mojitos at Hemingway's favourite bar, and danced salsa in a Vedado courtyard till midnight.",
  },
  {
    destinationName: "Cappadocia, Turkey",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1527838832700-5059252407fa",
    ],
    whenVisited: "September 2025",
    description:
      "Cappadocia's fairy chimneys, cave hotels carved into volcanic rock, and the spectacle of hot air balloons drifting at sunrise are utterly unique.",
    experience:
      "Flew over fairy chimneys in a hot air balloon at dawn, explored the Derinkuyu underground city, and slept in a stunning cave suite in Göreme.",
  },
  {
    destinationName: "Queenstown, New Zealand",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad",
    ],
    whenVisited: "December 2025",
    description:
      "Queenstown is the adventure capital of the world — bungee jumping, skydiving, jetboating, all wrapped in jaw-dropping alpine scenery.",
    experience:
      "Did the 134m Nevis bungee jump, skydived over Lake Wakatipu, and finished the day with the world's best Fergburger. What a place.",
  },
  {
    destinationName: "The Scottish Highlands",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1506377585622-bedcbb5a9d47",
    ],
    whenVisited: "June 2025",
    description:
      "Misty glens, ancient lochs, dramatic castles, and an almost mystical silence — the Scottish Highlands are unlike anywhere in Western Europe.",
    experience:
      "Drove the North Coast 500, stayed in a converted castle, witnessed the most dramatic sunsets over Loch Torridon, and hiked Glencoe in the rain.",
  },
  {
    destinationName: "Barcelona, Spain",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216",
    ],
    whenVisited: "October 2025",
    description:
      "Barcelona is a city that has it all — Gaudí's audacious modernist architecture, sandy beaches, world-class cuisine, and electrifying nightlife.",
    experience:
      "Sunrise at Park Güell (before the crowds), lunch at the Boqueria market, and late dinner by the sea. The Sagrada Família left me genuinely speechless.",
  },
  {
    destinationName: "Kruger National Park, South Africa",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e",
    ],
    whenVisited: "July 2025",
    description:
      "Kruger is Africa's premier safari destination — vast, wild, and teeming with the Big Five and thousands of other species.",
    experience:
      "Self-drove over five days, ticking off all Big Five. A leopard with a kill up a tree right next to our car was an utterly surreal moment.",
  },
  {
    destinationName: "Angkor Wat, Cambodia",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1539494869016-0a8ac90c1bbc",
    ],
    whenVisited: "November 2025",
    description:
      "Angkor Wat at sunrise — reflections of stone towers in the moat, monks in saffron robes, mist in the jungle — is one of earth's great spectacles.",
    experience:
      "Three-day temple pass, cycling between complexes before dawn, and watching the light change over Ta Prohm's tree-swallowed ruins was magical.",
  },
  {
    destinationName: "Vienna, Austria",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1516550893923-42d28e5677af",
    ],
    whenVisited: "December 2024",
    description:
      "Vienna is grand, cultured, and supremely liveable. Imperial palaces, concert halls, coffee houses, and art museums at every turn.",
    experience:
      "Attended a Mozart concert at the Musikverein, had apple strudel at Café Central, and admired the Klimt paintings at the Belvedere museum.",
  },
  {
    destinationName: "Sahara Desert, Morocco",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35",
    ],
    whenVisited: "March 2025",
    description:
      "Sleeping under billions of stars in the Sahara, waking before dawn to climb a dune and watch the sun rise over a sea of sand, is simply life-changing.",
    experience:
      "Rode camels to a Berber camp, drank mint tea by the fire, and experienced a silence so profound it was almost overwhelming. Pure magic.",
  },
  {
    destinationName: "Rio de Janeiro, Brazil",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325",
    ],
    whenVisited: "February 2025",
    description:
      "Rio is a city of staggering natural drama — Sugarloaf Mountain, the Christ statue, Copacabana and Ipanema beaches all meeting the jungle-clad hills.",
    experience:
      "Carnival weekend: the energy was indescribable. Hiked up to Christ the Redeemer at dawn and had the platform to ourselves for twenty minutes.",
  },
  {
    destinationName: "Galápagos Islands, Ecuador",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1548484352-ea579e5233a8",
    ],
    whenVisited: "August 2025",
    description:
      "The Galápagos changed how I see the natural world. Animals here have no fear of humans — you snorkel with sea lions and walk past marine iguanas.",
    experience:
      "Snorkelled with sea lions and hammerheads, watched blue-footed boobies dance, and held a giant tortoise at the Darwin Research Station.",
  },
  {
    destinationName: "Yosemite, USA",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    ],
    whenVisited: "May 2025",
    description:
      "Yosemite Valley — Half Dome, El Capitan, Bridalveil Fall — is quintessential American grandeur. I now understand why Ansel Adams photographed it obsessively.",
    experience:
      "Hiked Half Dome's cables in one day (14 miles), watched free climbers on El Capitan from the meadow, and drove through a tunnel tree. Iconic.",
  },
  {
    destinationName: "Phi Phi Islands, Thailand",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a",
    ],
    whenVisited: "January 2025",
    description:
      "Turquoise water, white sand, towering limestone cliffs, and long-tail boats — the Phi Phi Islands are the classic Southeast Asian paradise.",
    experience:
      "Snorkelled in Maya Bay, watched fire dancers on the beach, and took a sunrise kayak tour through the stillness before the tourist boats arrived.",
  },
  {
    destinationName: "Cusco, Peru",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1580746738099-b2c8e2a45dac",
    ],
    whenVisited: "September 2025",
    description:
      "Cusco is a living museum — Inca stonework under colonial plazas, ancient markets, and the gateway to the Sacred Valley and Machu Picchu.",
    experience:
      "Acclimatised with coca tea, explored the Inca walls in San Blas, trekked to Pisac ruins above the market town, and ate the best ceviche of my life.",
  },
  {
    destinationName: "Bruges, Belgium",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1491557345352-5929e343eb89",
    ],
    whenVisited: "April 2025",
    description:
      "Bruges is the best-preserved medieval city in Belgium, often called the Venice of the North for its beautiful canal network.",
    experience:
      "Cycled the quiet canal paths at dawn, drank at a centuries-old monastery brewing its own Trappist beer, and ate waffles on the Markt square.",
  },
  {
    destinationName: "Oman",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1578895101408-1a36b37f9e63",
    ],
    whenVisited: "November 2025",
    description:
      "Oman is the Middle East's most welcoming secret — ancient forts, dramatic wadis, vast deserts, and the warmest hospitality imaginable.",
    experience:
      "4x4 drove the Wahiba Sands, swam in the Wadi Shab canyon pools, explored the Grand Mosque in Muscat, and camped under the clearest sky of my life.",
  },
  {
    destinationName: "Lombok, Indonesia",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    ],
    whenVisited: "October 2025",
    description:
      "Lombok is Bali's quieter, wilder sibling. A real volcano to climb, pristine pink-sand beaches, and no crowds.",
    experience:
      "Summited Mount Rinjani for the most dramatic crater lake view possible, snorkelled the Gili Islands, and slept in a rice-paddy hut for £12 a night.",
  },
  {
    destinationName: "St Petersburg, Russia",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1548438294-1ad5d5f4f063",
    ],
    whenVisited: "June 2025",
    description:
      "St Petersburg during White Nights — when the sun barely sets — is a genuinely other-worldly experience. The city glows all night long.",
    experience:
      "The Hermitage took three full days and I still didn't see everything. Watching the palace bridges rise at 2am with thousands of locals was unforgettable.",
  },
  {
    destinationName: "Cinque Terre, Italy",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963",
    ],
    whenVisited: "September 2025",
    description:
      "Five pastel villages clinging to dramatic Ligurian cliffs above a glittering sea — Cinque Terre is the most beautiful stretch of Italian coastline.",
    experience:
      "Hiked the entire coastal trail over two days, ate pesto pasta in every village, swam off the rocks in Riomaggiore, and took a sunset train back.",
  },
  {
    destinationName: "Bhutan",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1553272725-086100aecf5e",
    ],
    whenVisited: "April 2025",
    description:
      "The Kingdom of Bhutan measures Gross National Happiness, and you feel it everywhere — in the monastery bells, the mountain air, and the kindness of locals.",
    experience:
      "Hiked to the Tiger's Nest monastery clinging to a 3,000m cliff face, attended a local tshechu festival, and meditated with monks at dawn.",
  },
  {
    destinationName: "Havana Old Town, Cuba",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1500759285222-a95626b934cb",
    ],
    whenVisited: "December 2025",
    description:
      "Old Havana's UNESCO-listed streets are a living monument to colonial grandeur and revolutionary history, filled with music, colour, and life.",
    experience:
      "Salsa dancing in a courtyard, a horse-carriage tour through Havana Vieja, and long conversations with locals over rum and cigars on the Malecón.",
  },
  {
    destinationName: "Namibia",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35",
    ],
    whenVisited: "August 2025",
    description:
      "Namibia is a land of extreme, otherworldly landscapes — towering red dunes, ancient deserts, and some of Africa's most magnificent wildlife.",
    experience:
      "Climbed Dune 45 at sunrise in Sossusvlei, explored the ghost town of Kolmanskop, and self-drove Etosha National Park over four days.",
  },
  {
    destinationName: "Georgia (Country)",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1571992966350-d6e8fd1c1e1f",
    ],
    whenVisited: "May 2025",
    description:
      "Georgia is the hidden gem of the Caucasus — ancient cave monasteries, spectacular mountain scenery, world-class wine, and legendary hospitality.",
    experience:
      "Hiked to Gergeti Trinity Church above the clouds, explored old Tbilisi's sulfur bath district, and ate khinkali dumplings with local wine every night.",
  },
  {
    destinationName: "Faroe Islands",
    destinationPhotoUrls: [
      "https://images.unsplash.com/photo-1531168486276-f3a37b4da82e",
    ],
    whenVisited: "July 2025",
    description:
      "The Faroe Islands feel like they exist outside of time — dramatic sea cliffs, grass-roofed villages, puffins, and no crowds whatsoever.",
    experience:
      "Hiked to the cliff edge at Trælanípa above the 'infinity lake', photographed the iconic red houses of Gásadalur, and saw the lowest waterfall in the world.",
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

// ─── Main seed function ───────────────────────────────────────────────────────
async function seedLarge() {
  if (!uri) {
    console.error("❌  MONGODB_URI environment variable is not set.");
    return;
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

    // ── Step 1: Add 50 Users ──────────────────────────────────────────────────
    console.log("\n📝  Step 1: Creating 50 users...");

    const SALT_ROUNDS = 10;
    const usersToInsert = [];

    for (let i = 0; i < 50; i++) {
      const firstName = firstNames[i];
      const lastName = lastNames[i];
      const userName = `${firstName.toLowerCase()} ${lastName.toLowerCase()}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
      const plainPassword = `${firstName.toLowerCase()}pass${i + 100}`;
      const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);

      usersToInsert.push({
        _id: new ObjectId(),
        userName,
        email,
        password: hashedPassword,
        registeredAt: getRandomDate(randomInt(1, 18)),
      });

      // Progress log every 10 users since hashing takes time
      if ((i + 1) % 10 === 0) {
        process.stdout.write(`   Hashed passwords for ${i + 1}/50 users...\r`);
      }
    }

    const usersResult = await usersCol.insertMany(usersToInsert);
    console.log(`\n✅  Inserted ${usersResult.insertedCount} users`);

    // Fetch all inserted user IDs (newly added + existing for likes/comments)
    const allUsers = await usersCol
      .find({}, { projection: { _id: 1 } })
      .toArray();
    const allUserIds = allUsers.map((u) => u._id as ObjectId);
    const totalUsers = allUserIds.length;
    console.log(`   Total users in DB: ${totalUsers}`);

    // ── Step 2: Add 1–5 reviews per new user ─────────────────────────────────
    console.log("\n📝  Step 2: Creating 1–5 reviews per new user...");

    const allReviews: Array<{
      _id: ObjectId;
      userId: ObjectId;
      destinationName: string;
      destinationPhotoUrls: string[];
      whenVisited: string;
      description: string;
      experience: string;
      datePosted: Date;
    }> = [];

    let destIndex = 0;

    for (const user of usersToInsert) {
      const reviewCount = randomInt(1, 5);
      for (let r = 0; r < reviewCount; r++) {
        const dest = destinationPool[destIndex % destinationPool.length];
        destIndex++;
        const visitDate = visitDates[randomInt(0, visitDates.length - 1)];
        allReviews.push({
          _id: new ObjectId(),
          userId: user._id,
          destinationName: dest.destinationName,
          destinationPhotoUrls: dest.destinationPhotoUrls,
          whenVisited: visitDate,
          description: dest.description,
          experience: dest.experience,
          datePosted: getRandomDate(randomInt(1, 12)),
        });
      }
    }

    const reviewsResult = await reviewsCol.insertMany(allReviews);
    console.log(
      `✅  Inserted ${reviewsResult.insertedCount} reviews for ${usersToInsert.length} users (1–5 each)`,
    );

    // ── Step 3: Add likes and comments to each new review ────────────────────
    console.log("\n📝  Step 3: Adding likes and comments to each review...");

    const allLikes: Array<{
      _id: ObjectId;
      reviewId: ObjectId;
      likedBy: ObjectId;
      likedOn: Date;
    }> = [];

    const allComments: Array<{
      _id: ObjectId;
      reviewId: ObjectId;
      commentedBy: ObjectId;
      commentedOn: Date;
      comment: string;
      idsOfUsersWhoLiked: ObjectId[];
      idsOfUsersWhoUnliked: ObjectId[];
    }> = [];

    let commentPoolIdx = 0;

    for (const review of allReviews) {
      // Random number of likes: 0 up to totalUsers (excluding the review author)
      const maxLikes = Math.min(totalUsers - 1, totalUsers);
      const likeCount = randomInt(0, maxLikes);
      const likers = pickRandomN(allUserIds, likeCount, [review.userId]);

      for (const likerId of likers) {
        allLikes.push({
          _id: new ObjectId(),
          reviewId: review._id,
          likedBy: likerId,
          likedOn: getRandomDate(randomInt(1, 12)),
        });
      }

      // Random number of comments: 0 up to totalUsers
      const commentCount = randomInt(0, totalUsers);
      // Multiple comments per user are realistic, but we pick distinct users
      const commenters = pickRandomN(allUserIds, commentCount, [review.userId]);

      for (const commenterId of commenters) {
        allComments.push({
          _id: new ObjectId(),
          reviewId: review._id,
          commentedBy: commenterId,
          commentedOn: getRandomDate(randomInt(1, 12)),
          comment: commentPool[commentPoolIdx % commentPool.length],
          idsOfUsersWhoLiked: [],
          idsOfUsersWhoUnliked: [],
        });
        commentPoolIdx++;
      }
    }

    // Insert likes in batches to avoid potential large payload issues
    if (allLikes.length > 0) {
      const BATCH = 500;
      let likeInsertedCount = 0;
      for (let i = 0; i < allLikes.length; i += BATCH) {
        const batch = allLikes.slice(i, i + BATCH);
        const r = await likesCol.insertMany(batch);
        likeInsertedCount += r.insertedCount;
      }
      console.log(
        `✅  Inserted ${likeInsertedCount} likes across ${allReviews.length} reviews`,
      );
    } else {
      console.log("   No likes to insert.");
    }

    // Insert comments in batches
    if (allComments.length > 0) {
      const BATCH = 500;
      let commentInsertedCount = 0;
      for (let i = 0; i < allComments.length; i += BATCH) {
        const batch = allComments.slice(i, i + BATCH);
        const r = await commentsCol.insertMany(batch);
        commentInsertedCount += r.insertedCount;
      }
      console.log(
        `✅  Inserted ${commentInsertedCount} comments across ${allReviews.length} reviews`,
      );
    } else {
      console.log("   No comments to insert.");
    }

    // ── Summary ───────────────────────────────────────────────────────────────
    console.log("\n📊  Final DB Summary:");
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

seedLarge();
