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
  "thu-atchafalaya": {
    hook: "A welcome center on stilts in the middle of the country's largest river swamp, halfway across an 18-mile bridge.",
    what: [
      "The Atchafalaya Basin is the largest river swamp in the United States, cypress and tupelo forest flooded by the Atchafalaya River. I-10 crosses it on the Atchafalaya Basin Bridge, about 18 miles long, which opened in 1973.",
      "The welcome center at exit 121 sits right in the swamp. Inside are exhibits on the basin's wildlife and Cajun life on the water. Outside, a short trail runs under the cypress.",
      "This is where Cajun country starts. Lafayette, just ahead, is the capital of Acadiana.",
    ],
    cats: "Picnic tables by the parking lot. Eat brunch in sight of the car.",
  },
  "thu-baytown": {
    hook: "The Texas gas station that is a destination in itself.",
    what: [
      "Buc-ee's started in Lake Jackson, Texas, in 1982 and grew into giant travel centers known for dozens of pumps, spotless restrooms, and a cartoon beaver on everything. The Baytown store opened in 2014.",
      "Inside: brisket sandwiches chopped at a counter in the middle of the store, a wall of jerky, fudge, kolaches, Beaver Nuggets (sweet corn puffs), and every kind of Texas souvenir. The billboards start counting down miles ahead.",
    ],
    cats: "The lot is huge. Park at the far edge near the pumps. One person goes in while the other stays with the car, then swap.",
  },
  "thu-luling": {
    hook: "An oil-boom town where the pumpjacks wear costumes.",
    what: [
      "Luling was a rough cattle-trail railroad town in the 1870s. In 1922 Edgar B. Davis, after years of dry holes, struck oil just outside town, and the Luling field turned it into an oil town almost overnight.",
      "Pumpjacks still nod all over town, and many are painted as cartoon characters, from a grasshopper to a cow jumping over the moon. The Central Texas Oil Patch Museum sits in an old storefront on Davis Street.",
      "City Market, a block away, is one of the classic old Texas barbecue halls: brisket and sausage on butcher paper, ordered in a smoky back room. It keeps short hours, so take it as a bonus if it is open.",
    ],
    cats: "Park on Davis Street with the car in sight. One person walks a block of pumpjacks while the other stays, then swap.",
    townId: "luling",
  },
  "thu-dinner": {
    hook: "A Hill Country river town for the night.",
    what: [
      "Kerrville has Tex-Mex, barbecue and chains along Sidney Baker Street near the hotel, and more downtown by the river. Brisket from Luling, warmed up in the room, also counts.",
      "Pick up dinner and eat in the room with the cats. Friday leaves at 6:00 AM.",
    ],
  },
  "fri-fort-stockton": {
    hook: "Breakfast with an 11-foot roadrunner in a frontier fort town.",
    what: [
      "Paisano Pete, an 11-foot-tall, 22-foot-long roadrunner statue from 1980, is two minutes from the exit. He is the town's mascot and a well-loved roadside photo stop.",
      "Fort Stockton grew up around Comanche Springs, once one of the biggest springs in Texas and a watering stop on the Comanche Trail and later the San Antonio–El Paso road. Historic Fort Stockton, a few blocks away, was an Army post from 1859, staffed for years by Buffalo Soldiers.",
    ],
    cats: "Breakfast to go from a café or the exit, eaten in sight of the car. Paisano Pete makes a good photo with the cat carriers.",
    townId: "fort-stockton",
  },
  "fri-mesilla": {
    hook: "An adobe plaza where Billy the Kid was sentenced and the Gadsden Purchase made the town American.",
    what: [
      "Mesilla was Mexican until the Gadsden Purchase took effect in 1854, and the American flag was raised on this plaza. Billy the Kid was tried and sentenced here in 1881.",
      "The plaza is ringed by adobe buildings and shaded benches, with the twin towers of the Basilica of San Albino on the north side. It is one of the best-kept old plazas in the Southwest.",
      "Green chile is everywhere. Lunch at a café on or near the plaza, and maybe a bag of roasted chile to take along.",
    ],
    cats: "Park on a side street off the plaza. Lunch to go on a plaza bench in sight of the car, and a walk around the plaza one person at a time.",
    townId: "mesilla",
  },
  "fri-texas-canyon": {
    hook: "Giant granite boulders stacked beside the interstate like a toddler's blocks.",
    what: [
      "Texas Canyon is a field of rounded granite boulders in the Little Dragoon Mountains, some the size of houses, balanced on top of each other. They weathered into these shapes underground, then the soil around them washed away.",
      "The rest area sits right in the boulders, and at this hour the low sun turns them orange. The Dragoon Mountains to the south were home to the Chiricahua Apache leader Cochise.",
    ],
    cats: "Restrooms and a short loop through the rocks a few steps from the parking spaces.",
  },
  "fri-dinner": {
    hook: "A sit-down dinner after the longest day.",
    what: [
      "The Marana Center around the hotel has restaurants in walking distance, and the Tucson Premium Outlets next door has more. Takeout back to the room works well with the cats.",
      "Saturday leaves at 7:30 AM, so there is time for a real night's sleep and the hotel breakfast.",
    ],
  },
  "sat-wickenburg": {
    hook: "A gold-rush town with a tree that served as its jail.",
    what: [
      "Henry Wickenburg found gold at the Vulture Mine in 1863, and the town grew up beside the Hassayampa River. Legend says anyone who drinks from the Hassayampa never tells the truth again.",
      "The town had no jail for years, so prisoners were chained to a big mesquite. The Jail Tree still stands downtown on Tegner Street. Later Wickenburg became the dude-ranch capital of Arizona, and the main street still looks the part.",
    ],
    cats: "Park downtown near the Jail Tree. Brunch from a café on the main street, a short walk, then fill the tank on the way out.",
    townId: "wickenburg",
  },
  "sat-hoover": {
    hook: "A late lunch at the car after looking straight down on Hoover Dam from 900 feet up.",
    what: [
      "Hoover Dam was finished in 1936. It stands 726 feet tall, plugs Black Canyon on the Colorado River and holds back Lake Mead. Thousands of men built it in the Depression, working through summers over 110 degrees.",
      "The Mike O'Callaghan–Pat Tillman Memorial Bridge opened in 2010 to carry US-93 over the canyon. A path with stairs and ramps leads from the parking lot onto a walkway on the side facing the dam, with the classic view of the dam's face, the intake towers and the river far below. The state line between Arizona and Nevada runs across the middle.",
      "The bridge parking lot is free. Driving down to the dam itself adds time and a parking fee, so this stop stays on the bridge.",
    ],
    cats: "One person walks out to the middle of the bridge while the other stays with the carriers, then swap. Picnic lunch at the car. November middays are mild, usually in the 60s.",
    townId: "boulder-city",
  },
  "sat-dinner": {
    hook: "A real dinner on the last night of the road.",
    what: [
      "St. George has plenty of restaurants near the convention center and along St. George Boulevard downtown, from Mexican and barbecue to sit-down steak houses. Takeout back to the room works well with the cats after a long day.",
    ],
  },
  "sun-fillmore": {
    hook: "The capitol of a state that did not exist yet.",
    what: [
      "In 1851 Brigham Young picked Fillmore, near the center of the territory, as Utah's capital. The red sandstone Territorial Statehouse was built for it, and the legislature met here in December 1855.",
      "Fillmore was too remote, and the government moved back to Salt Lake City in 1858. Only the south wing was ever finished. It is now the oldest surviving government building in Utah and a small state park museum.",
    ],
    cats: "The museum's Sunday hours vary, so plan on the outside and the lawn. Five minutes from the exit.",
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
  daphne: {
    id: "daphne",
    name: "Daphne, Alabama",
    tagline: "A quiet bluff-top town on the Eastern Shore of Mobile Bay.",
    facts: [
      { label: "Population", value: "About 28,000" },
      { label: "Elevation", value: "About 150 ft" },
      { label: "County", value: "Baldwin County" },
      { label: "Violent crime", value: "About 0.6 per 1,000 residents a year (US about 3.7)" },
      { label: "Known for", value: "Mobile Bay jubilees, Village Point Park" },
    ],
    about: [
      "Daphne sits on bluffs along the Eastern Shore, across Mobile Bay from the city. It was the Baldwin County seat until 1901, when Bay Minette took the job, and, the local story goes, the county records too, in the middle of the night.",
      "On a few summer nights the bay does something almost nowhere else does: a jubilee, when crabs, shrimp and flounder crowd into the shallows at dawn and people wade out with buckets. Village Point Park keeps the Jackson Oak, where Andrew Jackson is said to have camped.",
      "Today it is a mostly residential suburb with some of the lowest crime numbers on the whole route.",
    ],
    goodToKnow: [
      "One of the safest stops of the trip. The hotel is on US-98 a minute from I-10 exit 35, with gas and food around it.",
      "You arrive late, about 10:40 PM Central. Park near the lit entrance and bring the cats in first.",
      "Thursday starts on the Jubilee Parkway causeway across the top of the bay, right as the sun comes up behind you.",
    ],
  },
  luling: {
    id: "luling",
    name: "Luling, Texas",
    tagline: "An old oil and cattle town where the pumpjacks are painted like cartoons.",
    facts: [
      { label: "Population", value: "About 5,500" },
      { label: "Elevation", value: "About 420 ft" },
      { label: "County", value: "Caldwell County" },
      { label: "Known for", value: "The 1922 oil strike, City Market barbecue, the Watermelon Thump" },
    ],
    about: [
      "Luling began in 1874 at the end of a railroad line, and for a while trail drivers called it one of the toughest towns in Texas. Edgar B. Davis's oil strike in 1922 changed everything, and oil money built the brick downtown on Davis Street.",
      "Every June the Watermelon Thump fills the streets with seed-spitting contests. The rest of the year it is a small, quiet county town with some of the best-known barbecue in Texas.",
    ],
    goodToKnow: [
      "About 6 miles north of I-10 on US-183, so this stop costs about 12 extra minutes of driving.",
      "Fill the tank here or at the big Buc-ee's at the I-10 exit. San Antonio's rush is next.",
    ],
  },
  kerrville: {
    id: "kerrville",
    name: "Kerrville, Texas",
    tagline: "A Hill Country river town on the Guadalupe.",
    facts: [
      { label: "Population", value: "About 24,000" },
      { label: "Elevation", value: "About 1,650 ft" },
      { label: "County", value: "Kerr County seat" },
      { label: "Violent crime", value: "About 1.5 per 1,000 residents a year (US about 3.7)" },
      { label: "Known for", value: "The Guadalupe River, the Kerrville Folk Festival, Western art" },
    ],
    about: [
      "Kerrville started in the 1850s as a camp of cypress-shingle makers on the Guadalupe River. Charles Schreiner, a Confederate veteran turned merchant and rancher, built much of the town, and his old store still stands downtown.",
      "Today it is a retirement and summer-camp town with a river trail through cypress and limestone bluffs, the Museum of Western Art, and the Kerrville Folk Festival every late spring.",
      "The Guadalupe flooded catastrophically on July 4, 2025, and Kerr County lost more than a hundred people, many of them children at camps upriver. The town is still rebuilding, and you will see memorials.",
    ],
    goodToKnow: [
      "A safe, calm small city. The hotel is right at I-10 exit 508 with gas and restaurants around it, so you never drive into town in the dark.",
      "You arrive about 7:25 PM, well after dark. Park near the lit entrance and bring the cats in first.",
      "Deer are thick on I-10 west of town at dawn. Friday's first hour is the time to watch.",
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
      "Friday's breakfast stop. Food and gas are at exit 257, and Paisano Pete is two minutes away.",
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
    goodToKnow: ["A small, walkable historic village. On a Friday at lunchtime it is quiet, with a few shops and cafés open."],
  },
  marana: {
    id: "marana",
    name: "Marana, Arizona",
    tagline: "A farm town turned quiet suburb on the northwest edge of Tucson.",
    facts: [
      { label: "Population", value: "About 55,000" },
      { label: "Elevation", value: "About 2,000 ft" },
      { label: "County", value: "Pima County" },
      { label: "Violent crime", value: "About 1.1 per 1,000 residents a year (US about 3.7)" },
      { label: "Known for", value: "Cotton farms, the Tortolita Mountains, saguaros" },
    ],
    about: [
      "Marana was cotton and farm country along the Santa Cruz River for most of the 1900s and became a town in 1977. Today it is a fast-growing, mostly residential suburb on I-10, which lets you stay out of Tucson itself. The town is regularly ranked among Arizona's safest.",
      "Saguaro National Park's western half and the Arizona-Sonora Desert Museum are about 30 minutes south, in the Tucson Mountains.",
    ],
    goodToKnow: [
      "A safe, newer suburb. The hotel is in a shopping center right off I-10 with restaurants in walking distance.",
      "The desert cools fast after sunset. Expect the 40s by morning.",
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
  "boulder-city": {
    id: "boulder-city",
    name: "Boulder City and Hoover Dam, Nevada",
    tagline: "The town built to house the dam builders, and the dam itself.",
    facts: [
      { label: "Dam finished", value: "1936" },
      { label: "Dam height", value: "726 ft" },
      { label: "Bridge opened", value: "2010" },
      { label: "Time zone", value: "Pacific, an hour behind Arizona" },
    ],
    about: [
      "Boulder City was built by the federal government in 1931 to house the workers building Hoover Dam. It is still one of only two towns in Nevada where gambling is not allowed.",
      "The dam created Lake Mead, the largest reservoir in the country when full, and still makes power for Nevada, Arizona and California.",
    ],
    goodToKnow: [
      "Nevada is on Pacific time, so the clock reads an hour earlier here than in Arizona. Utah puts the hour back tonight.",
      "Wind can gust hard on the bridge. Hold onto hats and phones.",
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
      "Saturday's overnight, and the snow-hold town. If UDOT shows snow on I-15 at 7:30 AM Sunday, you keep the room and wait here at 2,800 feet.",
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
  daphne: {
    id: "daphne",
    name: "Hilton Garden Inn Mobile East Bay/Daphne",
    address: "29546 N Main St, Daphne, AL 36526 (US-98, by I-10 exit 35)",
    about: [
      "On US-98 a minute south of the interstate, so there are no town streets to find in the dark. Free parking.",
      "Dogs and cats only, 2 total, $75 per stay.",
    ],
    tips: [
      "You check in about 10:45 PM Central. Call ahead the day before so the room is held for a late arrival.",
      "Ask for a ground-floor room near a side door for the carriers and litter box.",
      "Thursday leaves at 6:30 AM. Ask what time breakfast opens, and get coffee and something to go if it is later.",
    ],
  },
  kerrville: {
    id: "kerrville",
    name: "Hampton Inn Kerrville",
    address: "2038 Sidney Baker St, Kerrville, TX 78028 (I-10 exit 508)",
    about: [
      "Right at the interstate exit on TX-16, a few minutes north of downtown and the river, with restaurants and gas around it. Free hot breakfast and free parking.",
      "Cats and dogs, 2 total, $75 per stay.",
    ],
    tips: [
      "Friday leaves at 6:00 AM. Ask for a grab-and-go breakfast at check-in.",
      "Fill the tank tonight at the exit, and lay out the carriers and the cooler before bed.",
    ],
  },
  marana: {
    id: "marana",
    name: "Hampton Inn & Suites Tucson Marana",
    address: "6300 W Marana Center Blvd, Tucson, AZ 85742 (I-10 exit 240)",
    about: [
      "A newer Hampton in the Marana Center shopping area just off I-10, with restaurants in walking distance. Free hot breakfast and free parking.",
      "Cats and dogs, 2 total, $75 per stay.",
    ],
    tips: [
      "Saturday leaves at 7:30 AM, so you can eat the hot breakfast before you go.",
      "After the longest day, unload only the cats, litter and one bag.",
    ],
  },
  st_george: {
    id: "st_george",
    name: "Hilton Garden Inn St. George",
    address: "1731 S Convention Center Dr, St. George, UT 84790 (near I-15 exit 6)",
    about: [
      "Saturday's night, and the snow-hold bed. If Sunday's 7:30 AM UDOT check shows snow, ice or a closure on I-15 north of Cedar City, you keep the room another night.",
      "Dogs and cats, 2 total, $75 for 1 to 4 nights, so a second night costs no more pet fee. A desk and free Wi-Fi in every room.",
    ],
    tips: [
      "Check the road at 7:30 AM in the room before you load the car.",
      "If you hold, call the landlord before 8:00 AM to move the key time, then tell the front desk you are staying.",
    ],
  },
};

// Town profile for each night's stop, by hotel id. The arrival has no hotel.
export const hotelTown: Record<string, string> = {
  daphne: "daphne",
  kerrville: "kerrville",
  marana: "marana",
  st_george: "st-george",
  dest: "kimball-junction",
};

// Every town on the route that is a stop or a night, in driving order.
export const routeTownOrder: string[] = [
  "quincy",
  "daphne",
  "luling",
  "kerrville",
  "fort-stockton",
  "mesilla",
  "marana",
  "wickenburg",
  "boulder-city",
  "st-george",
  "fillmore",
  "kimball-junction",
];
