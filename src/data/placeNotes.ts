// What each stop is, why it is worth the time, and longer profiles of the towns and
// overnight hotels. Stop ids match src/lib/drive.ts; hotel ids match hotels.json.
// History and figures are rounded, from public sources (Wikipedia, state park and
// National Park Service pages). Hours change, so the app never promises one.

export interface StopStory {
  // One line: the thing that makes this stop worth pulling off for.
  hook: string;
  // What you will actually see and do there.
  what: string[];
  // How the stop works with two cats in carriers.
  cats?: string;
  // The town profile that goes with this stop.
  townId?: string;
}

export interface TownProfile {
  id: string;
  name: string;
  tagline: string;
  facts: { label: string; value: string }[];
  about: string[];
  goodToKnow: string[];
}

export interface HotelProfile {
  id: string;
  name: string;
  address: string;
  about: string[];
  tips: string[];
}

export const stopStories: Record<string, StopStory> = {
  "wed-quincy": {
    hook: "The small Florida town that got rich on Coca-Cola stock.",
    what: [
      "In the early 1900s a Quincy banker, Mark Munroe, urged his neighbors to buy shares in a young soft-drink company from Atlanta. Many did and held on, and Quincy became known as the town with more Coca-Cola millionaires per head than anywhere else.",
      "Before that it was shade-tobacco country. Gadsden County farmers grew the thin leaves used to wrap cigars under acres of cheesecloth. The courthouse square, about four miles north of the exit, is lined with brick storefronts from those years.",
      "You come through in the dark, so this stop is dinner and fuel at the exit, with the story for the road.",
    ],
    cats: "A well-lit gas station lot at the exit. One person runs in while the other stays with the carriers.",
    townId: "quincy",
  },
  "thu-davis-bayou": {
    hook: "A quiet piece of the Gulf Islands National Seashore, with live oaks, marsh and a boardwalk over the bayou.",
    what: [
      "Davis Bayou is the mainland part of Gulf Islands National Seashore. Spanish moss hangs from the live oaks, and a short boardwalk and fishing pier look out over salt marsh where herons, egrets and the odd alligator sit in the grass.",
      "The William M. Colmer Visitor Center has exhibits on the barrier islands offshore. Entry to this part of the seashore is free.",
    ],
    cats: "The boardwalk is short and shaded. In November it is cool enough to leave the windows cracked while one person walks it.",
    townId: "ocean-springs",
  },
  "thu-atchafalaya": {
    hook: "A welcome center on stilts in the middle of the country's largest river swamp, halfway across an 18-mile bridge.",
    what: [
      "The Atchafalaya Basin is the largest river swamp in the United States, cypress and tupelo forest flooded by the Atchafalaya River. I-10 crosses it on the Atchafalaya Basin Bridge, about 18 miles long, which opened in 1973.",
      "The welcome center at exit 121 sits right in the swamp. Inside are exhibits on the basin's wildlife and Cajun life on the water. Outside, a short trail runs under the cypress.",
      "This is where Cajun country starts. Lafayette, just ahead, is the capital of Acadiana.",
    ],
    cats: "Picnic tables by the parking lot. Eat lunch in sight of the car.",
  },
  "thu-baytown": {
    hook: "The Texas gas station that is a destination in itself.",
    what: [
      "Buc-ee's started in Lake Jackson, Texas, in 1982 and grew into giant travel centers known for dozens of pumps, spotless restrooms, and a cartoon beaver on everything. The Baytown store opened in 2014.",
      "Inside: brisket sandwiches chopped at a counter in the middle of the store, a wall of jerky, fudge, kolaches, Beaver Nuggets (sweet corn puffs), and every kind of Texas souvenir. The billboards start counting down miles ahead.",
    ],
    cats: "The lot is huge. Park at the far edge near the pumps. One person goes in while the other stays with the car, then swap.",
  },
  "thu-dinner": {
    hook: "A pecan town on the Guadalupe River.",
    what: [
      "Seguin has Tex-Mex, barbecue and chains near the hotel and along I-10. The courthouse square downtown has a five-foot pecan statue, which the town calls the world's largest pecan.",
      "Pick up dinner and eat in the room with the cats. Friday leaves at 6:00 AM.",
    ],
  },
  "fri-junction": {
    hook: "A picnic under the pecans where two clear Hill Country rivers meet.",
    what: [
      "Junction sits where the North and South Llano rivers join. The town calls itself the Land of Living Waters.",
      "South Llano River State Park is five minutes south of I-10. It has a shaded pecan bottom along a spring-fed river that runs clear over limestone. Wild turkeys roost in the bottomland in winter, so part of the park closes to protect them. The picnic areas stay open.",
    ],
    cats: "A small day-use fee per adult. Early on a weekday the park is nearly empty. Pick a spot near the parking lot.",
    townId: "junction",
  },
  "fri-fort-stockton": {
    hook: "Lunch with an 11-foot roadrunner in a frontier fort town.",
    what: [
      "Paisano Pete, an 11-foot-tall, 22-foot-long roadrunner statue from 1980, is two minutes from the exit. He is the town's mascot and a well-loved roadside photo stop.",
      "Fort Stockton grew up around Comanche Springs, once one of the biggest springs in Texas and a watering stop on the Comanche Trail and later the San Antonio–El Paso road. Historic Fort Stockton, a few blocks away, was an Army post from 1859, staffed for years by Buffalo Soldiers.",
    ],
    cats: "Lunch to go from a café or the exit, eaten in sight of the car. Paisano Pete makes a good photo with the cat carriers.",
    townId: "fort-stockton",
  },
  "fri-mesilla": {
    hook: "An adobe plaza where Billy the Kid was sentenced and the Gadsden Purchase made the town American.",
    what: [
      "Mesilla was Mexican until the Gadsden Purchase took effect in 1854, and the American flag was raised on this plaza. Billy the Kid was tried and sentenced here in 1881.",
      "The plaza is ringed by adobe buildings and shaded benches, with the twin towers of the Basilica of San Albino on the north side. It is one of the best-kept old plazas in the Southwest.",
      "Green chile is everywhere. Green chile is everywhere. A snack from a café near the plaza, or a bag of roasted chile to take along.",
    ],
    cats: "Park on a side street off the plaza. A walk around the plaza, one person at a time, with the car in sight.",
    townId: "mesilla",
  },
  "fri-dinner": {
    hook: "A railroad town under the Florida Mountains.",
    what: [
      "Deming has Mexican restaurants and diners along Pine Street and Cedar Street, and chains near the hotel at exit 85. Order green chile anything; this is the edge of Hatch chile country.",
      "On a clear night step outside. The high desert sky here is very dark.",
    ],
  },
  "sat-texas-canyon": {
    hook: "Giant granite boulders stacked beside the interstate like a toddler's blocks.",
    what: [
      "Texas Canyon is a field of rounded granite boulders in the Little Dragoon Mountains, some the size of houses, balanced on top of each other. They weathered into these shapes underground, then the soil around them washed away.",
      "The rest area sits right in the boulders. The Dragoon Mountains to the south were home to the Chiricahua Apache leader Cochise.",
    ],
    cats: "Restrooms and a short loop through the rocks a few steps from the parking spaces.",
  },
  "sat-wickenburg": {
    hook: "A gold-rush town with a tree that served as its jail.",
    what: [
      "Henry Wickenburg found gold at the Vulture Mine in 1863, and the town grew up beside the Hassayampa River. Legend says anyone who drinks from the Hassayampa never tells the truth again.",
      "The town had no jail for years, so prisoners were chained to a big mesquite. The Jail Tree still stands downtown on Tegner Street. Later Wickenburg became the dude-ranch capital of Arizona, and the main street still looks the part.",
    ],
    cats: "Park downtown near the Jail Tree. Lunch from a café on the main street, a short walk, then fill the tank on the way out.",
    townId: "wickenburg",
  },
  "sat-dinner": {
    hook: "Route 66's hometown for one evening.",
    what: [
      "Kingman has plenty of chains near the hotel, and old Route 66 diners downtown on Andy Devine Avenue if you want the classic version. Fill the tank tonight so Sunday is just the drive.",
      "Before bed, read the UDOT forecast for I-15 over the summit north of Beaver and for Provo Canyon, and text the landlord your planned 4:00 PM arrival.",
    ],
  },
  "sun-pioneer-park": {
    hook: "Red sandstone above Utah's Dixie, the DIXIE letters on the rock, and the second snow check.",
    what: [
      "Pioneer Park sits on the red bluff right above downtown St. George. Red Navajo sandstone boulders, small slot canyons and a view over the whole valley. In the late-morning sun the rock glows red against the blue sky.",
      "The big rock called the Sugarloaf has DIXIE painted on it in white letters. Settlers sent here in 1861 to grow cotton named the area Utah's Dixie. Steps cut into the rock lead up to it.",
      "From here you can see the white St. George Temple, finished in 1877, the oldest temple still in use by the Latter-day Saints.",
    ],
    cats: "Parking right at the rocks. Ten minutes, then down to exit 8 for fuel and the UDOT check.",
    townId: "st-george",
  },
  "sun-fillmore": {
    hook: "The capitol of a state that did not exist yet.",
    what: [
      "In 1851 Brigham Young picked Fillmore, near the center of the territory, as Utah's capital. The red sandstone Territorial Statehouse was built for it, and the legislature met here in December 1855.",
      "Fillmore was too remote, and the government moved back to Salt Lake City in 1858. Only the south wing was ever finished. It is now the oldest surviving government building in Utah and a small state park museum.",
    ],
    cats: "The museum's Sunday hours vary, so plan on lunch on the lawn outside. Five minutes from the exit.",
    townId: "fillmore",
  },
  "sun-arrive": {
    hook: "Home. Olympic ski jumps on one side, a wetland preserve on the other.",
    what: [
      "Kimball Junction is the shopping and transit hub at the Park City exit off I-80, at about 6,400 feet. The 2002 Winter Olympics ski jumps at Utah Olympic Park are on the hill just south.",
    ],
    cats: "Cats in first, litter box set up, then everything else.",
    townId: "kimball-junction",
  },
};

export const townProfiles: Record<string, TownProfile> = {
  quincy: {
    id: "quincy",
    name: "Quincy, Florida",
    tagline: "A courthouse-square town in the red hills west of Tallahassee.",
    facts: [
      { label: "Population", value: "About 8,000" },
      { label: "Elevation", value: "About 250 ft" },
      { label: "County", value: "Gadsden County seat" },
      { label: "Known for", value: "Coca-Cola stock, shade tobacco" },
    ],
    about: [
      "Quincy was founded in 1828 and grew rich on shade tobacco, grown under cloth for cigar wrappers. Then came the Coca-Cola shares that made a lot of local families wealthy.",
      "The historic district around the 1913 Gadsden County Courthouse has brick storefronts and old houses with deep porches.",
    ],
    goodToKnow: [
      "You only use the I-10 exit, which has gas and fast food. Quincy is still on Eastern time; Central starts about 20 miles west.",
    ],
  },
  crestview: {
    id: "crestview",
    name: "Crestview, Florida",
    tagline: "The hub city of the western Panhandle, on a ridge above the Blackwater forests.",
    facts: [
      { label: "Population", value: "About 27,000" },
      { label: "Elevation", value: "About 235 ft" },
      { label: "County", value: "Okaloosa County seat" },
      { label: "Known for", value: "Eglin Air Force Base, Blackwater River State Forest" },
    ],
    about: [
      "Crestview grew up on the railroad in the 1880s, on one of the highest ridges in Florida. Today it is a quiet, mostly residential city where many Eglin Air Force Base families live.",
      "Blackwater River State Forest, one of the largest state forests in Florida, starts just west of town.",
    ],
    goodToKnow: [
      "A safe, ordinary small city. The hotel is right at I-10 exit 56 with gas and fast food around it.",
      "You arrive late, about 9:30 PM Central. Park near the lit entrance and bring the cats in first.",
    ],
  },
  "ocean-springs": {
    id: "ocean-springs",
    name: "Ocean Springs, Mississippi",
    tagline: "An old French colony turned arts town on Biloxi Bay.",
    facts: [
      { label: "Population", value: "About 18,000" },
      { label: "Founded", value: "1699, as Fort Maurepas" },
      { label: "Known for", value: "Walter Anderson, Shearwater Pottery, live oaks" },
    ],
    about: [
      "French explorer Pierre Le Moyne d'Iberville built Fort Maurepas here in 1699, one of the first European settlements on the Gulf Coast. The town grew into a resort with mineral springs, which gave it its name.",
      "It is best known as an arts town. The painter Walter Anderson lived and worked here, and his family's Shearwater Pottery is still open. Downtown has galleries and cafés under huge live oaks.",
    ],
    goodToKnow: [
      "A well-kept, low-key town, and the bayou is on the quiet east side away from the casinos in Biloxi.",
      "The visitor center hours are posted on the park's website. The boardwalk and grounds do not depend on them.",
    ],
  },
  seguin: {
    id: "seguin",
    name: "Seguin, Texas",
    tagline: "A river and pecan town just east of San Antonio.",
    facts: [
      { label: "Population", value: "About 30,000" },
      { label: "Elevation", value: "About 520 ft" },
      { label: "County", value: "Guadalupe County seat" },
      { label: "Known for", value: "Pecans, the Guadalupe River" },
    ],
    about: [
      "Founded in 1838 and named for Juan Seguín, a Tejano hero of the Texas Revolution, Seguin is one of the older towns in Texas. Pecan orchards line the Guadalupe River, and the town keeps a giant pecan statue on its courthouse square.",
      "Max Starcke Park runs along the river with big cypress and pecan trees. It is a calm, small-city place to sleep that keeps you out of San Antonio.",
    ],
    goodToKnow: [
      "A safe, quiet town. The hotel is near I-10 with restaurants and gas around it.",
      "You arrive about an hour after dark. Park near the lit entrance and bring the cats in first.",
      "Friday's 6:00 AM start puts you through San Antonio by 6:30, ahead of the rush.",
    ],
  },
  junction: {
    id: "junction",
    name: "Junction, Texas",
    tagline: "A Hill Country river town where the Llanos meet.",
    facts: [
      { label: "Population", value: "About 2,500" },
      { label: "Elevation", value: "About 1,700 ft" },
      { label: "County", value: "Kimble County seat" },
      { label: "Known for", value: "Clear rivers, deer hunting, pecans" },
    ],
    about: [
      "Junction takes its name from the meeting of the North and South Llano rivers. It is the last real town for 100 miles going west, and the edge of the Hill Country before the land flattens into the Edwards Plateau.",
      "In November the town is full of deer hunters, and the cafés open early. Texas Tech has a field campus on the river.",
    ],
    goodToKnow: [
      "Fill the tank here. The next good services are in Fort Stockton, about 2.5 hours west.",
      "Deer are thick on I-10 around Junction at dawn and dusk. Midday is fine.",
    ],
  },
  "fort-stockton": {
    id: "fort-stockton",
    name: "Fort Stockton, Texas",
    tagline: "A spring-fed frontier fort town on the edge of the Trans-Pecos.",
    facts: [
      { label: "Population", value: "About 8,500" },
      { label: "Elevation", value: "About 3,000 ft" },
      { label: "County", value: "Pecos County seat" },
      { label: "Known for", value: "Paisano Pete, Historic Fort Stockton" },
    ],
    about: [
      "Comanche Springs once poured millions of gallons a day out of the ground here, and every trail across West Texas came to it. The Army built a fort beside the springs in 1859. Irrigation pumping dried up the springs by the 1960s.",
      "Today it is a ranching and oil town and the main service stop between San Antonio and El Paso.",
    ],
    goodToKnow: [
      "Friday's lunch stop. Food and gas are at exit 257, and Paisano Pete is two minutes away.",
      "Fill the tank here. Gas is sparse between here and Van Horn.",
    ],
  },
  mesilla: {
    id: "mesilla",
    name: "Mesilla, New Mexico",
    tagline: "A Spanish-colonial plaza town just south of Las Cruces.",
    facts: [
      { label: "Population", value: "About 1,800" },
      { label: "Elevation", value: "About 3,900 ft" },
      { label: "Known for", value: "Mesilla Plaza, San Albino, green chile" },
    ],
    about: [
      "Mesilla was settled in the 1840s by families who wanted to stay in Mexico after the Mexican-American War. It became American a few years later with the Gadsden Purchase. It was a stop on the Butterfield Overland Mail, and briefly the Confederate capital of Arizona Territory in 1861.",
      "The plaza is a National Historic Landmark district. Adobe shops, restaurants and the Basilica of San Albino surround it, and the Mesilla Valley's chile and pecan farms start at the edge of town.",
    ],
    goodToKnow: ["A small, walkable historic village. On a Friday afternoon it is quiet, with a few shops and cafés open."],
  },
  deming: {
    id: "deming",
    name: "Deming, New Mexico",
    tagline: "A high-desert railroad and farm town where the second transcontinental railroad met.",
    facts: [
      { label: "Population", value: "About 14,000" },
      { label: "Elevation", value: "About 4,300 ft" },
      { label: "County", value: "Luna County seat" },
      { label: "Known for", value: "Railroad history, chile fields, the Great American Duck Race" },
    ],
    about: [
      "Deming grew up in 1881 where the Southern Pacific and the Santa Fe railroads met, completing the second rail line across the country. The Deming Luna Mimbres Museum downtown has railroad history and a big collection of Mimbres pottery.",
      "The Florida Mountains rise to the southeast, and Rockhound State Park, where visitors are allowed to collect rocks, sits at their foot. Every August the town holds the Great American Duck Race.",
    ],
    goodToKnow: [
      "A small, quiet town on I-10. The hotel is at exit 85 on the east side, with gas and restaurants nearby.",
      "At 4,300 feet, November nights drop near freezing. Bring the cats and their water inside.",
    ],
  },
  wickenburg: {
    id: "wickenburg",
    name: "Wickenburg, Arizona",
    tagline: "An old gold town that became the dude-ranch capital of Arizona.",
    facts: [
      { label: "Population", value: "About 7,500" },
      { label: "Elevation", value: "About 2,100 ft" },
      { label: "Founded", value: "1863, after the Vulture Mine strike" },
      { label: "Known for", value: "The Jail Tree, dude ranches, Western art" },
    ],
    about: [
      "The Vulture Mine was one of the richest gold mines in Arizona. Wickenburg grew up as its supply town on the Hassayampa River, one of the few places with water between Phoenix and the Colorado River.",
      "In the 1920s and 1930s guest ranches made it a winter escape for city people. The Desert Caballeros Western Museum downtown has one of the better collections of Western art in the state.",
    ],
    goodToKnow: [
      "Fill the tank here. US-93 north has only Wikieup before Kingman.",
      "A small, friendly town that is used to travelers.",
    ],
  },
  kingman: {
    id: "kingman",
    name: "Kingman, Arizona",
    tagline: "The heart of Route 66 in Arizona, on a high desert plateau.",
    facts: [
      { label: "Population", value: "About 33,000" },
      { label: "Elevation", value: "About 3,300 ft" },
      { label: "County", value: "Mohave County seat" },
      { label: "Known for", value: "Route 66, Locomotive Park, the Hualapai Mountains" },
    ],
    about: [
      "Kingman began as a railroad town in the 1880s, named for the surveyor Lewis Kingman. Route 66 made it famous. The longest unbroken stretch of the old highway still left anywhere runs through it.",
      "The 1907 Powerhouse downtown holds the visitor center and the Arizona Route 66 Museum. Across the street, Locomotive Park displays a 1920s Santa Fe steam engine. The Hualapai Mountains rise to 8,000 feet just southeast of town.",
    ],
    goodToKnow: [
      "The hotel is in the newer part of town near shopping. Stay around there in the evening rather than wandering.",
      "Sunday leaves at 7:00 AM, so fill the tank tonight and lay everything out before bed.",
    ],
  },
  "st-george": {
    id: "st-george",
    name: "St. George, Utah",
    tagline: "Red rock, warm winters and pioneer history at the bottom of Utah.",
    facts: [
      { label: "Population", value: "About 100,000" },
      { label: "Elevation", value: "About 2,800 ft" },
      { label: "Founded", value: "1861, the Cotton Mission" },
      { label: "Known for", value: "Utah's Dixie, the gateway to Zion" },
    ],
    about: [
      "Brigham Young sent families here in 1861 to grow cotton, which is why the area is still called Utah's Dixie. He spent his winters here, and his winter home is a museum downtown.",
      "Today it is one of the fastest-growing cities in Utah, warm in winter and ringed by red cliffs. Zion National Park is about an hour east.",
    ],
    goodToKnow: [
      "Sunday's fuel stop and the snow-hold town. If UDOT shows snow on I-15 north of Cedar City, you wait here at 2,800 feet, and the Hilton Garden Inn near exit 6 is the backup bed.",
      "A clean, safe, growing city. Exit 8 has gas stations open early.",
    ],
  },
  fillmore: {
    id: "fillmore",
    name: "Fillmore, Utah",
    tagline: "A farm town that was Utah's first capital.",
    facts: [
      { label: "Population", value: "About 2,600" },
      { label: "Elevation", value: "About 5,100 ft" },
      { label: "County", value: "Millard County seat" },
      { label: "Named for", value: "President Millard Fillmore" },
    ],
    about: [
      "The town and the county are both named for Millard Fillmore, the president who made Brigham Young the territory's first governor. It was meant to be the capital of the state of Deseret.",
      "Now it is a quiet farm and ranch town in the Pahvant Valley, with alfalfa fields running out to the mountains.",
    ],
    goodToKnow: ["Past the summit, so if the road was fine to here, the rest of I-15 is lower and easier."],
  },
  "kimball-junction": {
    id: "kimball-junction",
    name: "Kimball Junction, Utah",
    tagline: "Your new neighborhood: the gateway to Park City, between the Olympic park and a wetland preserve.",
    facts: [
      { label: "Elevation", value: "About 6,400 ft" },
      { label: "Exit", value: "I-80 exit 145" },
      { label: "Park City", value: "About 10 minutes south" },
      { label: "Salt Lake City", value: "About 30 minutes west" },
    ],
    about: [
      "Kimball Junction began as a stagecoach stop on the road through the Wasatch. Today it is the everyday side of Park City: grocery stores, restaurants, the Park City transit center, and bike paths heading off in every direction.",
      "Utah Olympic Park, with the ski jumps and bobsled track from the 2002 Winter Olympics, is on the hill just south. The Swaner Preserve and EcoCenter protects the wetland along I-80, with trails and elk and moose in winter. Historic Main Street, an 1870s silver-mining town turned ski town, is a short drive south.",
    ],
    goodToKnow: [
      "At 6,400 feet, take it easy the first day or two, and drink lots of water. The cats will adjust too.",
      "Free Park City buses connect Kimball Junction to Main Street and the ski resorts.",
    ],
  },
};

// Overnight hotels. Policies come from the listings in hotels.json; the rest is practical.
export const hotelProfiles: Record<string, HotelProfile> = {
  crestview: {
    id: "crestview",
    name: "Hampton Inn Crestview South I-10",
    address: "112 John King Rd, Crestview, FL 32539 (I-10 exit 56)",
    about: [
      "Right at the interstate exit, so there are no town streets to find in the dark. Free hot breakfast and free parking.",
      "Cats and dogs, 2 total, $75 per stay. Pets cannot be left alone in the room.",
    ],
    tips: [
      "You check in about 9:30 PM Central. Call ahead the day before so the room is held for a late arrival.",
      "Ask for a ground-floor room near a side door for the carriers and litter box.",
      "Breakfast may open after your 6:00 AM start. Ask for a grab-and-go bag at check-in.",
    ],
  },
  seguin: {
    id: "seguin",
    name: "Hampton Inn Seguin",
    address: "1130 Larkin Ave, Seguin, TX 78155",
    about: [
      "A Hampton near I-10 on the north side of town, with restaurants and gas close by. Free hot breakfast and free parking.",
      "Cats and dogs, 2 total, $75 per room per day.",
    ],
    tips: [
      "Friday leaves at 6:00 AM. Ask for a grab-and-go breakfast at check-in.",
      "Lay out the carriers and the cooler before bed.",
    ],
  },
  deming: {
    id: "deming",
    name: "Hampton Inn Deming",
    address: "3751 E Cedar St, Deming, NM 88030 (I-10 exit 85)",
    about: [
      "At the east edge of town by the interstate. Free hot breakfast and free parking.",
      "Cats and dogs, 2 total, up to about 24 lb each, $50 per stay.",
    ],
    tips: [
      "Saturday leaves at 7:00 AM, so you can eat the hot breakfast.",
      "It gets cold overnight at 4,300 feet. Bring everything the cats need inside.",
    ],
  },
  kingman: {
    id: "kingman",
    name: "Home2 Suites by Hilton Kingman",
    address: "1121 Sunrise Ave, Kingman, AZ 86401",
    about: [
      "Studio suites with a kitchenette, more room for the cats to stretch out. Free breakfast and free parking.",
      "Dogs and cats, 2 total, 25 lb each. $75 per stay plus a $125 deposit.",
    ],
    tips: [
      "Check UDOT for I-15 and Provo Canyon in the room at 6:30 AM, before you load the car.",
      "Text the landlord your planned 4:00 PM arrival tonight.",
    ],
  },
};

// Town profile for each night's stop, by hotel id. The arrival has no hotel.
export const hotelTown: Record<string, string> = {
  crestview: "crestview",
  seguin: "seguin",
  deming: "deming",
  kingman: "kingman",
  dest: "kimball-junction",
};

// Every town on the route that is a stop or a night, in driving order.
export const routeTownOrder: string[] = [
  "quincy",
  "crestview",
  "ocean-springs",
  "seguin",
  "junction",
  "fort-stockton",
  "mesilla",
  "deming",
  "wickenburg",
  "kingman",
  "st-george",
  "fillmore",
  "kimball-junction",
];
