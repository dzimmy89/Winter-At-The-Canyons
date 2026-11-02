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
  "thu-defuniak": {
    hook: "A lake so round it looks drawn with a compass, in a Victorian town that used to be a winter college.",
    what: [
      "Lake DeFuniak is a spring-fed lake about a mile around, and is often called one of the roundest natural lakes in the world. Circle Drive follows the shore past big Victorian houses with wraparound porches.",
      "From 1885 into the 1920s this was the Florida Chautauqua, a winter camp of lectures, concerts and classes that drew visitors by train from the North. The columned Hall of Brotherhood still stands on the lake.",
      "The small wooden Walton-DeFuniak Library on the shore opened in 1887. It calls itself the oldest library in Florida still running in its original building.",
    ],
    cats: "Park on Circle Drive with the lake in view. One person walks the shore while the other stays with the carriers, then swap.",
    townId: "defuniak",
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
  "fri-high-hill": {
    hook: "A plain brick church in the cotton fields, painted inside like a cathedral.",
    what: [
      "Czech and German farmers settled this part of Texas in the 1800s and built a handful of country churches that look plain outside and are covered in paint inside. Together they are known as the Painted Churches of Texas.",
      "St. Mary's at High Hill is the grandest. It is a red-brick Gothic church with a 111-foot steeple, finished in 1906. In 1912 two San Antonio artists painted the inside: soft-colored vaulted ceilings with angels, stained glass, a hand-carved altar, and wooden pillars painted to look like marble.",
      "It is still a working parish church. The door is usually open in daylight. If it is locked or a service is on, the outside and the churchyard are still worth the stop.",
    ],
    cats: "A quiet country lot with room to park in the shade. Take turns going inside.",
    townId: "schulenburg",
  },
  "fri-junction": {
    hook: "A picnic under the pecans where two clear Hill Country rivers meet.",
    what: [
      "Junction sits where the North and South Llano rivers join. The town calls itself the Land of Living Waters.",
      "South Llano River State Park is five minutes south of I-10. It has a shaded pecan bottom along a spring-fed river that runs clear over limestone. Wild turkeys roost in the bottomland in winter, so part of the park closes to protect them. The picnic areas stay open.",
    ],
    cats: "A small day-use fee per adult. Pick a picnic table near the parking lot.",
    townId: "junction",
  },
  "fri-fort-stockton": {
    hook: "An 11-foot roadrunner, a frontier fort, and the springs that made West Texas travel possible.",
    what: [
      "Paisano Pete, an 11-foot-tall, 22-foot-long roadrunner statue from 1980, is two minutes from the exit. He is the town's mascot and a well-loved roadside photo stop.",
      "Fort Stockton grew up around Comanche Springs, once one of the biggest springs in Texas and a watering stop on the Comanche Trail and later the San Antonio–El Paso road. Historic Fort Stockton, a few blocks away, was an Army post from 1859, staffed for years by Buffalo Soldiers.",
    ],
    cats: "A quick photo stop. Fuel and a stretch by the car.",
    townId: "fort-stockton",
  },
  "sat-mesilla": {
    hook: "An adobe plaza where Billy the Kid was sentenced and the Gadsden Purchase made the town American.",
    what: [
      "Mesilla was Mexican until the Gadsden Purchase took effect in 1854, and the American flag was raised on this plaza. Billy the Kid was tried and sentenced here in 1881.",
      "The plaza is ringed by adobe buildings and shaded benches, with the twin towers of the Basilica of San Albino on the north side. It is one of the best-kept old plazas in the Southwest.",
      "Green chile is everywhere. A breakfast burrito from a café near the plaza is the meal.",
    ],
    cats: "Park on a side street off the plaza. Breakfast on a bench in sight of the car.",
    townId: "mesilla",
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
    cats: "Park downtown near the Jail Tree for a short walk, then fill the tank on the way out.",
    townId: "wickenburg",
  },
  "sun-st-george": {
    hook: "Sunrise on red sandstone above Utah's Dixie, with the DIXIE letters painted on the rock.",
    what: [
      "Pioneer Park sits on the red bluff right above downtown St. George. Red Navajo sandstone boulders, small slot canyons and a view over the whole valley. At 7:30 AM the cliffs glow orange.",
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
  "thu-dinner": {
    hook: "Gulf Coast cooking in rice country.",
    what: [
      "Winnie sits between Cajun Louisiana and Houston, so the local menus run to fried catfish, shrimp, boudin and gumbo. The fast-food and gas cluster at exit 829 is next to the hotel.",
    ],
  },
  "fri-dinner": {
    hook: "A ranch-town dinner under very dark skies.",
    what: [
      "Van Horn has a handful of diners and Mexican restaurants along Broadway and the frontage roads. On a clear night, step outside after dinner. Far West Texas has some of the darkest skies in the country.",
    ],
  },
  "sat-dinner": {
    hook: "Route 66's hometown for one evening.",
    what: [
      "Kingman has plenty of chains near the hotel, and old Route 66 diners downtown on Andy Devine Avenue if you want the classic version. Fill the tank tonight, because Sunday starts at 4:00 AM.",
    ],
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
    goodToKnow: ["Fuel up here. Gas between Fort Stockton and Van Horn is sparse."],
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
    goodToKnow: ["A small, walkable historic village. Early Saturday it is quiet, with a few cafés opening."],
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
      "Last good fuel before Kingman. US-93 north has only Wikieup in between.",
      "A small, friendly town that is used to travelers.",
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
      "It is the snow-hold town. If UDOT shows snow on I-15 at 7:30 AM, you wait here at 2,800 feet, and the Hilton Garden Inn near exit 6 is the backup bed.",
      "Exit 8 has gas stations open early.",
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
  winnie: {
    id: "winnie",
    name: "Winnie, Texas",
    tagline: "A rice-farming town between Beaumont and Houston, and the gateway to the upper Texas coast.",
    facts: [
      { label: "Population", value: "About 3,000" },
      { label: "Elevation", value: "About 25 ft" },
      { label: "County", value: "Chambers County" },
      { label: "Known for", value: "Rice farming, the Texas Rice Festival" },
    ],
    about: [
      "Winnie grew up around a railroad stop in the 1890s and was named for a railroad man, Fox Winnie. Rice has been the crop ever since. The Texas Rice Festival comes to town every fall.",
      "It is the turnoff for the upper Texas coast: Anahuac National Wildlife Refuge, the High Island bird sanctuaries and the Bolivar Peninsula are all within about 30 miles. In November the rice fields fill with migrating geese and sandhill cranes.",
    ],
    goodToKnow: [
      "A small, quiet country town, not a suburb. The hotel is right at the I-10 exit, with gas, fast food and other chain hotels next to it.",
      "You arrive around sunset. Park near the lit entrance and bring the cats in with you.",
      "Houston is an hour west, so Friday's 6:00 AM start puts you through the city early in the rush.",
    ],
  },
  "van-horn": {
    id: "van-horn",
    name: "Van Horn, Texas",
    tagline: "A high-desert ranch town under some of the darkest skies in Texas.",
    facts: [
      { label: "Population", value: "About 1,900" },
      { label: "Elevation", value: "About 4,000 ft" },
      { label: "County", value: "Culberson County seat" },
      { label: "Known for", value: "Hotel El Capitan, Guadalupe Mountains, dark skies" },
    ],
    about: [
      "Van Horn grew up around wells on the old San Antonio–El Paso road, then as a stop on the Texas and Pacific Railway. It sits in a wide basin between the Sierra Diablo and the Van Horn Mountains.",
      "The Hotel El Capitan on Broadway, designed in 1930 by the El Paso architect Henry Trost, has been restored, and its lobby is worth a look. Guadalupe Mountains National Park, with the highest point in Texas, is about an hour north. Blue Origin launches rockets from a ranch north of town.",
    ],
    goodToKnow: [
      "A very small, quiet town with little crime. It is remote, not rough. The hotel is on the I-10 frontage road with other motels and gas stations around it.",
      "At 4,000 feet, November nights drop near freezing. Bring the cats and their water inside.",
      "Van Horn is on Central time, and Mountain time starts just west of town.",
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
      "Sunday starts at 4:00 AM, so fill the tank tonight and lay everything out before bed.",
    ],
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
  winnie: {
    id: "winnie",
    name: "Hampton Inn & Suites Winnie",
    address: "318 Spur 5, Winnie, TX 77665 (I-10 exit 829)",
    about: [
      "A modern Hampton right at the interstate exit, so there are no town streets to find in the dark. Free hot breakfast starts early enough for a 6:00 AM start with something to go, and parking is free.",
      "Cats and dogs are allowed, 2 total, at $75 per pet per night, so $150 for both cats. Check-in from 3 PM, checkout at noon.",
    ],
    tips: [
      "Ask for a ground-floor room near a side door. It makes carrying in the litter box and carriers easier.",
      "Grab breakfast to go at 5:45 AM. Friday is a 6:00 AM start.",
    ],
  },
  van_horn: {
    id: "van_horn",
    name: "Hampton Inn Van Horn",
    address: "1921 SW Frontage Rd, Van Horn, TX 79855 (I-10 exit 138)",
    about: [
      "On the I-10 frontage road on the west side of town, the most comfortable stop in a long empty stretch. Free hot breakfast and free parking.",
      "Cats and dogs, 2 total, up to 50 lb each, $50 per stay. Check-in from 3 PM to midnight.",
    ],
    tips: [
      "Fill the tank tonight. Saturday leaves at 6:00 AM Central, which is 5:00 AM Mountain once you cross the county line.",
      "It gets cold overnight at 4,000 feet. Bring everything the cats need inside.",
    ],
  },
  kingman: {
    id: "kingman",
    name: "Home2 Suites by Hilton Kingman",
    address: "1121 Sunrise Ave, Kingman, AZ 86401",
    about: [
      "Studio suites with a kitchenette, more room for the cats to stretch out after a long day. Free breakfast and free parking.",
      "Dogs and cats, 2 total, 25 lb each. $75 per stay plus a $125 deposit.",
    ],
    tips: [
      "Breakfast starts after your 4:00 AM departure. Ask the front desk for a grab-and-go bag when you check in.",
      "Read the UDOT forecast for I-15 tonight, and text the landlord your planned 1:15 PM arrival.",
    ],
  },
  st_george: {
    id: "st_george",
    name: "Hilton Garden Inn St. George",
    address: "1731 S Convention Center Dr, St. George, UT 84790 (near I-15 exit 6)",
    about: [
      "The snow-hold bed. You only book it if Sunday's 7:30 AM check shows snow, ice or a closure on I-15 north of Cedar City.",
      "Dogs and cats, 2 total, $75 for 1 to 4 nights. A desk and free Wi-Fi in every room.",
    ],
    tips: ["Call the landlord before 8:00 AM to move the key time, then call the hotel."],
  },
};

// Town profile for each night's stop, by hotel id. The arrival has no hotel.
export const hotelTown: Record<string, string> = {
  winnie: "winnie",
  van_horn: "van-horn",
  kingman: "kingman",
  st_george: "st-george",
  dest: "kimball-junction",
};

// Every town on the route that is a stop or a night, in driving order.
export const routeTownOrder: string[] = [
  "defuniak",
  "ocean-springs",
  "winnie",
  "schulenburg",
  "junction",
  "fort-stockton",
  "van-horn",
  "mesilla",
  "wickenburg",
  "kingman",
  "st-george",
  "fillmore",
  "kimball-junction",
];
