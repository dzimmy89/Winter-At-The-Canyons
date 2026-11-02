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
  "wed-defuniak": {
    hook: "A lake so round it looks drawn with a compass, in a Victorian town that used to be a winter college.",
    what: [
      "Lake DeFuniak is a spring-fed lake about a mile around, and is often called one of the roundest natural lakes in the world. Circle Drive follows the shore past big Victorian houses with wraparound porches.",
      "From 1885 into the 1920s this was the Florida Chautauqua, a winter camp of lectures, concerts and classes that drew visitors by train from the North. The columned Hall of Brotherhood still stands on the lake.",
      "The small wooden Walton-DeFuniak Library on the shore opened in 1887. It calls itself the oldest library in Florida still running in its original building.",
    ],
    cats: "Park on Circle Drive with the lake in view. One person walks the shore while the other stays with the carriers, then swap.",
    townId: "defuniak",
  },
  "wed-davis-bayou": {
    hook: "A quiet piece of the Gulf Islands National Seashore, with live oaks, marsh and a boardwalk over the bayou.",
    what: [
      "Davis Bayou is the mainland part of Gulf Islands National Seashore. Spanish moss hangs from the live oaks, and a short boardwalk and fishing pier look out over salt marsh where herons, egrets and the odd alligator sit in the grass.",
      "The William M. Colmer Visitor Center has exhibits on the barrier islands offshore. Entry to this part of the seashore is free.",
    ],
    cats: "The boardwalk is short and shaded. In November it is cool enough to leave the windows cracked while one person walks it.",
    townId: "ocean-springs",
  },
  "wed-dinner": {
    hook: "Your first night in Cajun country.",
    what: [
      "Broussard sits on the south edge of Lafayette, the capital of Acadiana. Boudin, crawfish étouffée, gumbo and po'boys are on menus all along East Main Street and US-90, and plenty of places do takeout to eat in the room with the cats.",
    ],
  },
  "thu-blue-elbow": {
    hook: "A boardwalk into a cypress swamp, the first thing you see in Texas.",
    what: [
      "The Texas Travel Information Center in Orange sits right after the Sabine River bridge. Behind it a boardwalk of about 600 feet runs out into Blue Elbow Swamp, a bend of the Sabine full of bald cypress and tupelo with knees poking out of the black water.",
      "Herons, egrets and kingfishers work the swamp, and in November the mosquitoes are mostly gone. Inside are clean restrooms, free Texas highway maps, and staff who can tell you about road work ahead.",
    ],
    cats: "The parking lot is a few steps from the boardwalk. One person walks out while the other stays with the carriers, then swap.",
    townId: "orange",
  },
  "thu-high-hill": {
    hook: "A plain brick church in the cotton fields, painted inside like a cathedral.",
    what: [
      "Czech and German farmers settled this part of Texas in the 1800s and built a handful of country churches that look plain outside and are covered in paint inside. Together they are known as the Painted Churches of Texas.",
      "St. Mary's at High Hill is the grandest. It is a red-brick Gothic church with a 111-foot steeple, finished in 1906. In 1912 two San Antonio artists painted the inside: soft-colored vaulted ceilings with angels, stained glass, a hand-carved altar, and wooden pillars painted to look like marble.",
      "It is still a working parish church. The door is usually open in daylight. If it is locked or a service is on, the outside and the churchyard are still worth the stop.",
    ],
    cats: "A quiet country lot with room to park in the shade. Take turns going inside.",
    townId: "schulenburg",
  },
  "thu-junction": {
    hook: "A picnic under the pecans where two clear Hill Country rivers meet.",
    what: [
      "Junction sits where the North and South Llano rivers join. The town calls itself the Land of Living Waters.",
      "South Llano River State Park is five minutes south of I-10. It has a shaded pecan bottom along a spring-fed river that runs clear over limestone. Wild turkeys roost in the bottomland in winter, so part of the park closes to protect them. The picnic areas stay open.",
    ],
    cats: "A small day-use fee per adult. Pick a picnic table near the parking lot.",
    townId: "junction",
  },
  "thu-dinner": {
    hook: "A frontier fort town and an 11-foot roadrunner.",
    what: [
      "Paisano Pete, Fort Stockton's 11-foot roadrunner statue from 1980, is a few minutes from the hotel if there is still light for a photo. Dinner is a short drive away: Tex-Mex and steak houses on Dickinson Boulevard, and chains along the I-10 frontage road.",
      "Fill the tank tonight. Friday's first stretch to Mesilla has long gaps between towns.",
    ],
  },
  "fri-mesilla": {
    hook: "An adobe plaza where Billy the Kid was sentenced and the Gadsden Purchase made the town American.",
    what: [
      "Mesilla was Mexican until the Gadsden Purchase took effect in 1854, and the American flag was raised on this plaza. Billy the Kid was tried and sentenced here in 1881.",
      "The plaza is ringed by adobe buildings and shaded benches, with the twin towers of the Basilica of San Albino on the north side. It is one of the best-kept old plazas in the Southwest.",
      "Green chile is everywhere. Lunch is green chile: enchiladas or a burrito from a café near the plaza.",
    ],
    cats: "Park on a side street off the plaza. Lunch on a bench in sight of the car.",
    townId: "mesilla",
  },
  "fri-texas-canyon": {
    hook: "Giant granite boulders stacked beside the interstate like a toddler's blocks.",
    what: [
      "Texas Canyon is a field of rounded granite boulders in the Little Dragoon Mountains, some the size of houses, balanced on top of each other. They weathered into these shapes underground, then the soil around them washed away.",
      "The rest area sits right in the boulders. The Dragoon Mountains to the south were home to the Chiricahua Apache leader Cochise.",
    ],
    cats: "Restrooms and a short loop through the rocks a few steps from the parking spaces.",
  },
  "fri-dinner": {
    hook: "A desert-suburb evening with the Tortolita Mountains out the window.",
    what: [
      "The hotel is in Marana Center, a shopping area with sit-down and takeout restaurants within walking distance. The sun sets about 5:30 PM, and the sky over the Tucson Mountains to the south turns pink and orange.",
    ],
  },
  "sat-wickenburg": {
    hook: "A gold-rush town with a tree that served as its jail.",
    what: [
      "Henry Wickenburg found gold at the Vulture Mine in 1863, and the town grew up beside the Hassayampa River. Legend says anyone who drinks from the Hassayampa never tells the truth again.",
      "The town had no jail for years, so prisoners were chained to a big mesquite. The Jail Tree still stands downtown on Tegner Street. Later Wickenburg became the dude-ranch capital of Arizona, and the main street still looks the part.",
    ],
    cats: "Park downtown near the Jail Tree for a short walk, then fill the tank on the way out.",
    townId: "wickenburg",
  },
  "sat-hoover": {
    hook: "Lunch at the car after looking straight down on Hoover Dam from 900 feet up.",
    what: [
      "Hoover Dam was finished in 1936. It stands 726 feet tall, plugs Black Canyon on the Colorado River and holds back Lake Mead. Thousands of men built it in the Depression, working through summers over 110 degrees.",
      "The Mike O'Callaghan–Pat Tillman Memorial Bridge opened in 2010 to carry US-93 over the canyon. A path with stairs and ramps leads from the parking lot onto a walkway on the side facing the dam, with the classic view of the dam's face, the intake towers and the river far below. The state line between Arizona and Nevada runs across the middle.",
      "The bridge parking lot is free. Driving down to the dam itself adds time and a parking fee, so this stop stays on the bridge.",
    ],
    cats: "One person walks out to the middle of the bridge while the other stays with the carriers, then swap. Picnic lunch at the car. November middays are mild, usually in the 60s.",
    townId: "boulder-city",
  },
  "sat-pioneer-park": {
    hook: "Red sandstone above Utah's Dixie in the late-afternoon light, with the DIXIE letters painted on the rock.",
    what: [
      "Pioneer Park sits on the red bluff right above downtown St. George. Red Navajo sandstone boulders, small slot canyons and a view over the whole valley. An hour before sunset the cliffs glow orange.",
      "The big rock called the Sugarloaf has DIXIE painted on it in white letters. Settlers sent here in 1861 to grow cotton named the area Utah's Dixie. Steps cut into the rock lead up to it.",
      "From here you can see the white St. George Temple, finished in 1877, the oldest temple still in use by the Latter-day Saints.",
    ],
    cats: "Settle the cats in the room first. The park is ten minutes from the hotel with parking right at the rocks.",
    townId: "st-george",
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
  defuniak: {
    id: "defuniak",
    name: "DeFuniak Springs, Florida",
    tagline: "A round lake, a Chautauqua hall and a main street of brick storefronts in the Panhandle.",
    facts: [
      { label: "Population", value: "About 7,000" },
      { label: "Elevation", value: "About 250 ft" },
      { label: "County", value: "Walton County seat" },
      { label: "Known for", value: "Lake DeFuniak, the Florida Chautauqua" },
    ],
    about: [
      "The railroad founded the town in the 1880s and named it for Fred DeFuniak, a Louisville and Nashville Railroad official. The Florida Chautauqua made it a winter resort of lectures and concerts for northern visitors for about 40 years.",
      "Today it is a quiet county seat. The historic district around the lake is full of restored Victorian houses, and the downtown has antique shops and cafés along Baldwin Avenue.",
    ],
    goodToKnow: [
      "A small, quiet town, and you are there in daylight on a weekday morning.",
      "Gas and fast food are at the I-10 exit 85 interchange, two miles south of the lake.",
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
  broussard: {
    id: "broussard",
    name: "Broussard, Louisiana",
    tagline: "A quiet small city on the south edge of Lafayette, in the heart of Cajun country.",
    facts: [
      { label: "Population", value: "About 13,000" },
      { label: "Elevation", value: "About 25 ft" },
      { label: "Parish", value: "Lafayette and St. Martin" },
      { label: "Known for", value: "Cajun food, Acadiana" },
    ],
    about: [
      "Broussard grew up as a sugar-cane and railroad town and took its name from the Broussard family, one of the old Acadian families of the area. It is now a growing, mostly residential city a few miles from Lafayette.",
      "Acadiana is the part of Louisiana settled by the Acadians, French colonists forced out of Canada by the British in the 1750s. Cajun French, zydeco and Cajun cooking all come from here.",
    ],
    goodToKnow: [
      "A safe, suburban stop. The hotel is on the main road with restaurants and gas around it, and you arrive in daylight.",
      "Thursday leaves at 6:00 AM, so lay out the carriers and the cooler before bed.",
    ],
  },
  orange: {
    id: "orange",
    name: "Orange, Texas",
    tagline: "The easternmost city in Texas, on the Sabine River at the Louisiana line.",
    facts: [
      { label: "Population", value: "About 19,000" },
      { label: "Elevation", value: "About 10 ft" },
      { label: "County", value: "Orange County seat" },
      { label: "Known for", value: "Shipbuilding, Shangri La Botanical Gardens" },
    ],
    about: [
      "Orange was a lumber town in the 1800s and a shipbuilding center in World War II, when its yards launched hundreds of Navy ships. Its old lumber families left the Stark Museum of Art and the Shangri La Botanical Gardens downtown.",
    ],
    goodToKnow: ["You only use the travel center at the state line. It is right off I-10, open early, and busy with travelers."],
  },
  schulenburg: {
    id: "schulenburg",
    name: "Schulenburg, Texas",
    tagline: "A Czech and German farm town halfway between Houston and San Antonio.",
    facts: [
      { label: "Population", value: "About 2,900" },
      { label: "Elevation", value: "About 350 ft" },
      { label: "Known for", value: "The Painted Churches, kolaches" },
    ],
    about: [
      "German and Czech settlers founded Schulenburg in the 1870s when the railroad came through. It still celebrates both. The bakeries sell kolaches, the sweet and savory Czech pastries Texans eat for breakfast.",
      "Its visitor center hands out maps to the Painted Churches of Texas. High Hill, Ammannsville, Dubina and Praha are all within about 15 minutes.",
    ],
    goodToKnow: [
      "A small, friendly farm town right on I-10, with gas and food at exit 674.",
      "Grab kolaches for the road here. It is the best snack stop of the trip.",
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
      "Thursday's overnight. A small, quiet town and the main stop on the 300 empty miles between San Antonio and El Paso. The hotel is on the I-10 frontage road with other hotels and gas stations next to it.",
      "At 3,000 feet, November nights get cold. Bring the cats and their water inside.",
      "Fill the tank tonight. Gas is sparse between here and Van Horn.",
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
    goodToKnow: ["A small, walkable historic village. On a Friday late morning it is quiet, with the cafés open for lunch."],
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
  marana: {
    id: "marana",
    name: "Marana, Arizona",
    tagline: "A farm town turned quiet suburb on the northwest edge of Tucson.",
    facts: [
      { label: "Population", value: "About 52,000" },
      { label: "Elevation", value: "About 2,000 ft" },
      { label: "County", value: "Pima County" },
      { label: "Known for", value: "Cotton farms, the Tortolita Mountains, saguaros" },
    ],
    about: [
      "Marana was cotton and farm country along the Santa Cruz River for most of the 1900s and became a town in 1977. Today it is a fast-growing, mostly residential suburb on I-10, which lets you stay out of Tucson itself.",
      "Saguaro National Park's western half and the Arizona-Sonora Desert Museum are about 30 minutes south, in the Tucson Mountains.",
    ],
    goodToKnow: [
      "A safe, newer suburb. The hotel is in a shopping center right off I-10 with restaurants in walking distance.",
      "The desert cools fast after sunset. Expect the 40s by morning.",
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
  broussard: {
    id: "broussard",
    name: "Hampton Inn Broussard-Lafayette Area",
    address: "2280 E Main St, Broussard, LA 70518",
    about: [
      "A Hampton on the main road through Broussard, a few minutes off US-90. Free hot breakfast and free parking.",
      "Cats and dogs, 2 total, up to 75 lb, $75 per stay. Check-in 3 PM to 1 AM, checkout 11 AM.",
    ],
    tips: [
      "Ask for a ground-floor room near a side door for the carriers and litter box.",
      "Breakfast may start after your 6:00 AM departure. Ask the front desk for a grab-and-go bag at check-in.",
    ],
  },
  fort_stockton: {
    id: "fort_stockton",
    name: "Hampton Inn Fort Stockton",
    address: "2271 W I-10, Fort Stockton, TX 79735",
    about: [
      "On the I-10 frontage road on the west side of town, so Friday morning is straight onto the interstate. Free hot breakfast and free parking.",
      "One listing says 2 pets up to 34 lb with a $75 fee and a $150 cleaning fee. Another says only 1 pet. Call the hotel to confirm two cats before you book.",
    ],
    tips: [
      "Friday leaves at a relaxed 8:00 AM Central, so you can eat the hot breakfast.",
      "It gets cold overnight at 3,000 feet. Bring everything the cats need inside.",
    ],
  },
  marana: {
    id: "marana",
    name: "Hampton Inn & Suites Tucson Marana",
    address: "6300 W Marana Center Blvd, Tucson, AZ 85742",
    about: [
      "A newer Hampton in the Marana Center shopping area just off I-10, with restaurants in walking distance. Free hot breakfast and free parking.",
      "Pets allowed, 2 per room, $75 per stay. Check-in from 3 PM.",
    ],
    tips: ["Saturday leaves at 7:00 AM. Breakfast opens early enough to eat before you go."],
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
  broussard: "broussard",
  fort_stockton: "fort-stockton",
  marana: "marana",
  st_george: "st-george",
  dest: "kimball-junction",
};

// Every town on the route that is a stop or a night, in driving order.
export const routeTownOrder: string[] = [
  "defuniak",
  "ocean-springs",
  "broussard",
  "orange",
  "schulenburg",
  "junction",
  "fort-stockton",
  "mesilla",
  "marana",
  "wickenburg",
  "boulder-city",
  "st-george",
  "fillmore",
  "kimball-junction",
];
