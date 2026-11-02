import { destination, townById } from "../data/towns";
import type {
  BudgetTierId,
  DriveCapHours,
  DriveDay,
  DriveLeg,
  DriveStopEvent,
  HotelNight,
  RouteOption,
  RouteRecord,
  SnowGate,
  SundayCorridor,
  TownId,
  WorkBlock,
} from "../data/types";

export interface DriveStop {
  id: string;
  label: string;
  shortLabel: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export interface DrivePlan {
  townId: TownId;
  destLabel: string;
  cap: DriveCapHours;
  days: DriveDay[];
  nights: number;
  totalMiles: number;
  totalHours: number;
  corridor: RouteRecord["corridor"];
  summary: string;
  stops: DriveStop[];
}

export interface TripBudget {
  id: BudgetTierId;
  name: string;
  fuel: number;
  lodging: number;
  lodgingTax: number;
  parking: number;
  food: number;
  catSupplies: number;
  tolls: number;
  contingency: number;
  petFees: number;
  total: number;
  notes: string;
  pointsStart: number;
  pointsUsed: number;
  pointsRemaining: number;
  awardNightsPaid: number;
  cashLodgingNights: number;
}

export const mpg = 23;
export const HILTON_HONORS_POINTS_BANK = 150_000;
export const DESTINATION_TOWN_ID: TownId = "park_city";
export const DRIVE_CAP: DriveCapHours = 13;
export const leaveGainesville = "Wed Nov 11, 2026";
export const arriveParkCity = "Sun Nov 15, 2026";

const realisticFoodPerDay = 110;
const lodgingTaxRate = 0.13;

interface TierRates {
  id: BudgetTierId;
  name: string;
  gallonUsd: number;
  foodPerDay: number;
  catSupplies: number;
  tolls: number;
  contingency: number;
  notes: string;
}

const tiers: TierRates[] = [
  {
    id: "conservative",
    name: "Conservative",
    gallonUsd: 3.3,
    foodPerDay: 70,
    catSupplies: 40,
    tolls: 15,
    contingency: 100,
    notes: "Lowest fuel, packed food, cats confirmed by phone before prepay.",
  },
  {
    id: "realistic",
    name: "Realistic",
    gallonUsd: 3.6,
    foodPerDay: 110,
    catSupplies: 80,
    tolls: 30,
    contingency: 200,
    notes: "Default. Hilton Honors award nights plus cash pet fees.",
  },
  {
    id: "upscale",
    name: "Upscale",
    gallonUsd: 4.15,
    foodPerDay: 180,
    catSupplies: 120,
    tolls: 50,
    contingency: 400,
    notes: "Hilton Honors award nights, higher food, more storm slack.",
  },
];

type HubId = "broussard" | "fort_stockton" | "marana" | "st_george";

interface Hub {
  id: HubId;
  label: string;
  shortLabel: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

// Overnights are smaller towns or quiet suburbs on purpose. Big cities on the route are interstate pass-throughs.
const hubs: Hub[] = [
  {
    id: "broussard",
    label: "Broussard, LA",
    shortLabel: "Broussard",
    city: "Broussard",
    state: "LA",
    lat: 30.1471,
    lng: -91.9612,
  },
  {
    id: "fort_stockton",
    label: "Fort Stockton, TX",
    shortLabel: "Fort Stockton",
    city: "Fort Stockton",
    state: "TX",
    lat: 30.894,
    lng: -102.8793,
  },
  {
    id: "marana",
    label: "Marana, AZ",
    shortLabel: "Marana",
    city: "Marana",
    state: "AZ",
    lat: 32.39,
    lng: -111.13,
  },
  {
    id: "st_george",
    label: "St. George, UT",
    shortLabel: "St. George",
    city: "St. George",
    state: "UT",
    lat: 37.0965,
    lng: -113.5684,
  },
];

// Why the southern corridor: both options side by side. Elevations are rounded highway figures.
export const routeOptions: RouteOption[] = [
  {
    id: "southern",
    label: "Southern: I-10 to Tucson, US-93 past Hoover Dam, I-15 up Utah",
    miles: 2789,
    nights: 4,
    highestFt: 6600,
    highestWhere: "I-15 summit between Beaver and Cove Fort, on Sunday morning",
    milesAbove6000: 40,
    verdict:
      "The plan. About 490 more miles, but Wednesday through Saturday stay under 5,000 feet in the driest part of the country in November. Only Sunday morning reaches snow country, and you check the road from the hotel in St. George at 2,800 feet before you leave. Every night is in a smaller town or a quiet suburb.",
    chosen: true,
  },
  {
    id: "northern",
    label: "Northern: I-24 and I-70 across Kansas, I-25 and I-80 across Wyoming",
    miles: 2303,
    nights: 3,
    highestFt: 8640,
    highestWhere: "Sherman Summit on I-80, with Elk Mountain and the Continental Divide after it",
    milesAbove6000: 430,
    verdict:
      "Retired. Shorter, but it crosses the Kansas and Colorado plains and spends about 430 miles above 6,000 feet on I-80 in Wyoming, which WYDOT closes for wind and blowing snow more than any other road on either route.",
    chosen: false,
  },
];

interface DayDraft {
  date: string;
  dateLabel: string;
  fromLabel: string;
  toLabel: string;
  departClock: string;
  arriveClock: string;
  latestSafeDepart: string;
  timeZone: string;
  miles: number;
  driveHours: number;
  routeSummary: string;
  hubId: HubId | null;
  // Nights booked at this hub, when a workday needs the room for a second night.
  hotelNights?: number;
  work?: WorkBlock;
  winterNotes: string;
  legs: DriveLeg[];
  stops: DriveStopEvent[];
  snowGate: SnowGate;
  corridors?: SundayCorridor[];
}

const weatherGate: SnowGate = {
  checkAt: "The night before, and again before departure",
  sourceName: "National Weather Service",
  sourceUrl: "https://www.weather.gov",
  go: "No winter storm, ice storm, or dense fog warning on the next stretch of I-10.",
  hold: "Wait at the hotel until the warning lifts. These are low, warm days, so a hold is hours, not a night.",
};

const dayDrafts: DayDraft[] = [
  {
    date: "2026-11-11",
    dateLabel: "Wed Nov 11",
    fromLabel: "Gainesville, FL",
    toLabel: "Broussard, LA",
    departClock: "6:30 AM EST",
    arriveClock: "4:25 PM CST",
    latestSafeDepart: "7:15 AM EST",
    timeZone: "EST to CST",
    miles: 646,
    driveHours: 10,
    routeSummary:
      "I-75 N to Lake City, then I-10 W across the Big Bend, the Panhandle, Mobile and the Mississippi coast, I-12 W around New Orleans, across the 18-mile Atchafalaya Basin Bridge, and US-90 south from Lafayette to Broussard. Stops: the round lake at DeFuniak Springs and lunch at the Davis Bayou. Tallahassee, Pensacola, Mobile, Baton Rouge and Lafayette are drive-throughs.",
    hubId: "broussard",
    winterNotes:
      "Sea level all day, so snow is not a factor. The first half hour is before sunrise (about 6:55 AM EST at Lake City). Clocks go back an hour at the Apalachicola River, near exit 158. You reach Broussard about 45 minutes before sunset (about 5:10 PM). Broussard is a quiet small city on the south edge of Lafayette, and the hotel is on East Main Street, just off US-90.",
    snowGate: {
      ...weatherGate,
      checkAt: "Tue Nov 10 night, and again before 6:30 AM EST",
      go: "No winter storm, ice storm, or dense fog warning on I-10 or I-12 from Lake City to Lafayette.",
      hold: "Leave up to 45 minutes later and still reach Broussard before dark.",
    },
    legs: [
      {
        id: "wed-panhandle",
        road: "I-75 N, I-10 W",
        from: "4922 NW 81st Ave",
        to: "DeFuniak Springs (exit 85)",
        miles: 263,
        topElevationFt: 300,
        snowRisk: "none",
        note: "I-75 N 45 miles to Lake City, then I-10 W, the road for most of the trip. Sunrise near Lake City. Tallahassee is on the interstate. Central time starts at the Apalachicola River. Then past Marianna and Chipley.",
      },
      {
        id: "wed-coast",
        road: "I-10 W",
        from: "DeFuniak Springs",
        to: "Ocean Springs, MS (exit 50)",
        miles: 171,
        topElevationFt: 300,
        snowRisk: "none",
        note: "Past Crestview, through Pensacola and Mobile on the interstate, including the Wallace Tunnel under the Mobile River, and into Mississippi.",
      },
      {
        id: "wed-louisiana",
        road: "I-10 W, I-12 W, I-10 W, US-90 E",
        from: "Ocean Springs",
        to: "Broussard",
        miles: 212,
        topElevationFt: 100,
        snowRisk: "none",
        note: "I-12 at Slidell keeps New Orleans 30 miles south. Baton Rouge's Mississippi bridge, then the Atchafalaya Basin Bridge, 18 miles over the swamp with no shoulder. At Lafayette, US-90 (the Evangeline Thruway) south 10 miles to Broussard.",
      },
    ],
    stops: [
      {
        id: "wed-defuniak",
        kind: "meal",
        place: "Lake DeFuniak, DeFuniak Springs",
        road: "I-10 W exit 85, then about 2 miles north on US-331 into town. Gas at the exit",
        purpose:
          "About 4 hours out. A spring-fed lake so round it looks drawn with a compass, ringed by Victorian houses and an 1887 lakeside library. Breakfast from the cooler on a lakeside bench, a slow lap of Circle Drive, and fuel on the way back to I-10.",
        minutes: 25,
        clock: "9:30 AM CST",
        realisticUsd: 25,
      },
      {
        id: "wed-davis-bayou",
        kind: "meal",
        place: "Davis Bayou, Gulf Islands National Seashore",
        road: "I-10 W exit 50, then about 4 miles south through Ocean Springs to the park road",
        purpose:
          "About 2.5 hours later. A quiet bayou with live oaks and marsh birds, and a picnic lunch at a table under the moss. A short boardwalk from the parking lot, leash. Free.",
        minutes: 30,
        clock: "12:30 PM CST",
        realisticUsd: 25,
      },
      {
        id: "wed-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-75 N / I-10 W",
        purpose: "Coffee, packed snacks and water.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
      {
        id: "wed-dinner",
        kind: "meal",
        place: "Broussard",
        road: "Near 2280 E Main St, after check-in",
        purpose: "Cajun dinner pickup and an early night. Thursday leaves at 6:00 AM and is the longest day.",
        minutes: 30,
        clock: "5:00 PM CST",
        realisticUsd: 40,
      },
    ],
  },
  {
    date: "2026-11-12",
    dateLabel: "Thu Nov 12",
    fromLabel: "Broussard, LA",
    toLabel: "Fort Stockton, TX",
    departClock: "6:00 AM CST",
    arriveClock: "6:05 PM CST",
    latestSafeDepart: "6:30 AM CST",
    timeZone: "CST",
    miles: 742,
    driveHours: 10.9,
    routeSummary:
      "The longest day. US-90 back to I-10 at Lafayette, west into Texas at Orange, through Houston after the morning rush, out through the Czech and German farm towns to the painted church at High Hill, around San Antonio, up into the Hill Country, and across West Texas at 80 mph to Fort Stockton. Stops: the Blue Elbow Swamp boardwalk at Orange, High Hill and Schulenburg, and Junction. Lake Charles, Beaumont, Houston and San Antonio are drive-throughs.",
    hubId: "fort_stockton",
    winterNotes:
      "Sea level to 3,000 feet and dry, so snow is very unlikely. Leaving at 6:00 AM puts Houston around 9:45 AM, after the rush. Deer are thick in the Hill Country. The last few minutes into Fort Stockton are at dusk (sunset about 6:00 PM), on I-10. Services are far apart west of Junction, so never let the tank drop below half. Fort Stockton is a ranch and oil town of 8,500, and the hotel is on the I-10 frontage road.",
    snowGate: {
      checkAt: "Wed Nov 11 night, and again before 6:00 AM CST",
      sourceName: "DriveTexas",
      sourceUrl: "https://drivetexas.org",
      go: "No ice, closure, or dense fog warning on I-10 from Lake Charles to Fort Stockton.",
      hold: "Wait in Broussard. West Texas ice is rare and melts by late morning. An hour's wait puts the last hour after dark, on I-10 the whole way. Shorten the Schulenburg lunch to make some of it up.",
    },
    legs: [
      {
        id: "thu-orange",
        road: "US-90 W, I-10 W",
        from: "Broussard",
        to: "Texas Travel Information Center, Orange",
        miles: 114,
        topElevationFt: 100,
        snowRisk: "none",
        note: "US-90 (the Evangeline Thruway) north through Lafayette to I-10, then west past Jennings and Lake Charles and over the Sabine River into Texas.",
      },
      {
        id: "thu-houston",
        road: "I-10 W",
        from: "Orange",
        to: "High Hill, near Schulenburg (exit 674)",
        miles: 207,
        topElevationFt: 450,
        snowRisk: "none",
        note: "Beaumont, Winnie and Baytown, then straight through Houston on the Katy Freeway in mid-morning traffic, with no exits inside the city. Then Katy, Sealy and Columbus, across the Brazos and Colorado rivers.",
      },
      {
        id: "thu-hill-country",
        road: "I-10 W",
        from: "High Hill",
        to: "Junction (exit 456)",
        miles: 221,
        topElevationFt: 2200,
        snowRisk: "none",
        note: "Back to I-10 at Schulenburg, past Seguin, through San Antonio early in the afternoon, then up past Boerne and Kerrville into the Hill Country.",
      },
      {
        id: "thu-west-texas",
        road: "I-10 W",
        from: "Junction",
        to: "Fort Stockton",
        miles: 200,
        topElevationFt: 3000,
        snowRisk: "low",
        note: "80 mph and few towns: Sonora and Ozona. The Hampton Inn is on the I-10 frontage road on the west side of Fort Stockton.",
      },
    ],
    stops: [
      {
        id: "thu-blue-elbow",
        kind: "rest",
        place: "Blue Elbow Swamp boardwalk, Orange",
        road: "I-10 W, the Texas Travel Information Center just past the Sabine River bridge",
        purpose:
          "About 1 hour 45 minutes out, just inside Texas. A boardwalk from the welcome center out over a cypress and tupelo swamp. Restrooms, free Texas maps, and a stretch.",
        minutes: 20,
        clock: "7:45 AM CST",
        realisticUsd: 0,
      },
      {
        id: "thu-high-hill",
        kind: "meal",
        place: "St. Mary's painted church, High Hill, and Schulenburg",
        road: "I-10 W exit 674 (Schulenburg), then north on US-77 and out High Hill Road, about 3 miles. Follow the steeple. Gas and kolache bakeries at the exit",
        purpose:
          "About 3 hours 15 minutes later, past Houston. A red-brick Gothic church alone in the farm fields, painted inside from floor to ceiling. Then lunch in Schulenburg: kolaches and barbecue at the exit, and fuel.",
        minutes: 35,
        clock: "11:20 AM CST",
        realisticUsd: 30,
      },
      {
        id: "thu-junction",
        kind: "rest",
        place: "Junction and the South Llano River",
        road: "I-10 W exit 456, then 5 minutes south on US-377 to South Llano River State Park. Gas at the ramp",
        purpose:
          "About 3 hours 15 minutes later. Fill the tank and stretch under the pecans by a clear Hill Country river where two forks of the Llano meet. Leash.",
        minutes: 15,
        clock: "3:10 PM CST",
        realisticUsd: 10,
      },
      {
        id: "thu-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-10 W",
        purpose: "Breakfast in the car, packed snacks, and plenty of water. Services are far apart west of Junction.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 12,
      },
      {
        id: "thu-dinner",
        kind: "meal",
        place: "Fort Stockton",
        road: "Near 2271 W I-10, after check-in",
        purpose: "Dinner pickup and fill the tank tonight. Friday leaves at a relaxed 8:00 AM.",
        minutes: 30,
        clock: "6:20 PM CST",
        realisticUsd: 35,
      },
    ],
  },
  {
    date: "2026-11-13",
    dateLabel: "Fri Nov 13",
    fromLabel: "Fort Stockton, TX",
    toLabel: "Marana, AZ",
    departClock: "8:00 AM CST",
    arriveClock: "3:55 PM MST",
    latestSafeDepart: "9:00 AM CST",
    timeZone: "CST to MST",
    miles: 560,
    driveHours: 8.1,
    routeSummary:
      "I-10 W past Balmorhea and Van Horn, through El Paso before lunch and into New Mexico, lunch on the plaza in Old Mesilla, then Deming, Lordsburg and Arizona, the Texas Canyon boulders, and Tucson to Marana. Stops: Old Mesilla and Texas Canyon. El Paso, Las Cruces and Tucson are drive-throughs.",
    hubId: "marana",
    winterNotes:
      "High desert, 2,000 to 5,000 feet, and dry in November. Snow and ice are rare and melt by midday. Blowing dust between Lordsburg and San Simon is the real hazard. Clocks go back an hour at the Hudspeth County line west of Van Horn. You reach Marana well before sunset (about 5:25 PM). Marana is a newer, quiet suburb on the northwest edge of Tucson, and the hotel is next to the Marana Center shops off I-10.",
    snowGate: {
      checkAt: "Thu Nov 12 night, and again before 8:00 AM CST",
      sourceName: "NMRoads",
      sourceUrl: "https://www.nmroads.com",
      go: "I-10 from Las Cruces to the Arizona line has no dust, wind or closure warning.",
      hold: "Wait in Fort Stockton, or at the next exit, until a dust warning lifts. Friday has an hour of daylight to spare.",
    },
    legs: [
      {
        id: "fri-el-paso",
        road: "I-10 W",
        from: "Fort Stockton",
        to: "Old Mesilla (exit 140)",
        miles: 280,
        topElevationFt: 4600,
        snowRisk: "low",
        note: "Past Balmorhea with the Davis Mountains to the south, and Van Horn. Mountain time starts at the Hudspeth County line. Stay on I-10 straight through El Paso, no exits, then into New Mexico.",
      },
      {
        id: "fri-new-mexico",
        road: "I-10 W",
        from: "Old Mesilla",
        to: "Texas Canyon rest area (AZ mile 320)",
        miles: 210,
        topElevationFt: 4975,
        snowRisk: "low",
        note: "Deming, Lordsburg and the dust-storm zone at the Arizona line. Fuel in Deming or Lordsburg.",
      },
      {
        id: "fri-tucson",
        road: "I-10 W",
        from: "Texas Canyon",
        to: "Marana",
        miles: 70,
        topElevationFt: 4500,
        snowRisk: "none",
        note: "Down through Benson and straight past Tucson on the interstate, with no exits in the city, to Marana on the northwest side.",
      },
    ],
    stops: [
      {
        id: "fri-mesilla",
        kind: "meal",
        place: "Old Mesilla plaza",
        road: "I-10 W exit 140, then about 2 miles south to the plaza",
        purpose:
          "About 4 hours out. A tiny historic town of adobe shops and the San Albino basilica around an 1850s plaza. Lunch with green chile on the plaza, and a walk around it with the cats.",
        minutes: 35,
        clock: "11:00 AM MST",
        realisticUsd: 35,
      },
      {
        id: "fri-texas-canyon",
        kind: "rest",
        place: "Texas Canyon rest area",
        road: "I-10 W near mile 320, on the highway",
        purpose: "About 3 hours later. Huge granite boulders piled up beside the interstate. A short walk through the rocks with the cats.",
        minutes: 15,
        clock: "2:35 PM MST",
        realisticUsd: 0,
      },
      {
        id: "fri-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-10 W",
        purpose: "Breakfast from the Fort Stockton hotel, packed snacks and plenty of water.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
      {
        id: "fri-dinner",
        kind: "meal",
        place: "Marana",
        road: "Near 6300 W Marana Center Blvd, after check-in",
        purpose: "Dinner from the Marana Center restaurants next to the hotel, and an easy evening. Saturday leaves at 7:00 AM.",
        minutes: 30,
        clock: "5:00 PM MST",
        realisticUsd: 40,
      },
    ],
  },
  {
    date: "2026-11-14",
    dateLabel: "Sat Nov 14",
    fromLabel: "Marana, AZ",
    toLabel: "St. George, UT",
    departClock: "7:00 AM MST",
    arriveClock: "4:05 PM MST",
    latestSafeDepart: "8:00 AM MST",
    timeZone: "MST, with Nevada an hour behind on Pacific time",
    miles: 525,
    driveHours: 8.1,
    routeSummary:
      "Past Picacho Peak, around Phoenix on Loop 202 and Loop 303, US-60 to Wickenburg, US-93 north through the Joshua tree country and past Kingman to Hoover Dam, then I-11, I-215 and I-15 past Las Vegas and through the Virgin River Gorge to St. George. Stops: Wickenburg and the Hoover Dam bridge. Phoenix, Kingman and Las Vegas are drive-throughs.",
    hubId: "st_george",
    winterNotes:
      "Desert all day, 1,000 to 4,000 feet. Snow is very rare on this route. Wind can close US-93 at Hoover Dam for an hour or two. Nevada is on Pacific time, an hour behind Arizona and Utah. You reach St. George about an hour before sunset (about 5:10 PM), with time for Pioneer Park. St. George sits at 2,800 feet in Utah's warm southwest corner.",
    snowGate: {
      checkAt: "Fri Nov 13 night, and again before 7:00 AM MST",
      sourceName: "AZ 511",
      sourceUrl: "https://www.az511.gov",
      go: "US-93 from Wickenburg to Hoover Dam is open with no wind closure, and I-15 through the Virgin River Gorge is open.",
      hold: "Wait in Wickenburg or Kingman until a wind closure lifts. Saturday has about an hour of daylight to spare.",
    },
    legs: [
      {
        id: "sat-phoenix",
        road: "I-10 W, Loop 202 W, Loop 303 N, US-60 W",
        from: "Marana",
        to: "Wickenburg",
        miles: 170,
        topElevationFt: 2500,
        snowRisk: "none",
        note: "Past the volcanic spike of Picacho Peak 20 minutes in. Then Loop 202 (South Mountain Freeway) and Loop 303 keep you out of downtown Phoenix.",
      },
      {
        id: "sat-us93",
        road: "US-93 N, I-40 W, US-93 N",
        from: "Wickenburg",
        to: "Hoover Dam bridge",
        miles: 205,
        topElevationFt: 4000,
        snowRisk: "low",
        note: "The Joshua Forest Scenic Road, the Burro Creek bridge and Wikieup, a few miles of I-40 through Kingman, then US-93 north across the desert to Hoover Dam. Fuel in Kingman if the tank is under half.",
      },
      {
        id: "sat-gorge",
        road: "I-11 N, I-215 W, I-15 N",
        from: "Hoover Dam",
        to: "St. George",
        miles: 150,
        topElevationFt: 3700,
        snowRisk: "none",
        note: "Around the south side of Las Vegas, then I-15 north past Mesquite and through the Virgin River Gorge, 29 miles of tight canyon, into Utah. Clocks go forward an hour.",
      },
    ],
    stops: [
      {
        id: "sat-wickenburg",
        kind: "rest",
        place: "Downtown Wickenburg",
        road: "US-60 into town, where it meets US-93",
        purpose: "About 2.5 hours out. An old Western gold town with the Jail Tree on its main street. Fill the tank and walk the main street.",
        minutes: 20,
        clock: "9:35 AM MST",
        realisticUsd: 5,
      },
      {
        id: "sat-hoover",
        kind: "meal",
        place: "Hoover Dam and the Memorial Bridge",
        road: "Over the bridge into Nevada, then exit 2 (Hoover Dam) and about 2 miles down the dam road to the bridge parking lot. There may be a quick security check",
        purpose:
          "About 3 hours 10 minutes later. Walk out onto the bridge 900 feet above the Colorado River for the classic view straight down onto Hoover Dam. Picnic lunch at the car.",
        minutes: 40,
        clock: "1:05 PM MST",
        realisticUsd: 25,
      },
      {
        id: "sat-snacks",
        kind: "meal",
        place: "In the car",
        road: "US-93 N / I-15 N",
        purpose: "Breakfast from the hotel, packed snacks and plenty of water.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
      {
        id: "sat-pioneer-park",
        kind: "rest",
        place: "Pioneer Park, St. George",
        road: "Red Hills Parkway above downtown, about 10 minutes from the hotel",
        purpose:
          "After check-in, in the late-afternoon light. Red sandstone boulders on the bluff above town, with the white DIXIE letters painted on the Sugarloaf rock and the valley glowing below. Settle the cats in the room first.",
        minutes: 40,
        clock: "4:35 PM MST",
        realisticUsd: 0,
      },
      {
        id: "sat-dinner",
        kind: "meal",
        place: "St. George",
        road: "Near 1731 S Convention Center Dr",
        purpose:
          "Dinner and fill the tank. Read tomorrow's forecast for I-15 and Provo Canyon, and text the landlord your planned 1:15 PM arrival.",
        minutes: 40,
        clock: "5:45 PM MST",
        realisticUsd: 45,
      },
    ],
  },
  {
    date: "2026-11-15",
    dateLabel: "Sun Nov 15",
    fromLabel: "St. George, UT",
    toLabel: "900 Bitner Road, Apartment E17",
    departClock: "8:00 AM MST",
    arriveClock: "1:15 PM MST",
    latestSafeDepart: "8:45 AM MST",
    timeZone: "MST",
    miles: 316,
    driveHours: 5,
    routeSummary:
      "Keys by early afternoon. I-15 N past Cedar City over the 6,600-foot summit in daylight, the Territorial Statehouse in Fillmore, then Utah Valley, US-189 up Provo Canyon and US-40 to I-80 at Kimball Junction. Stop: Utah's first capitol building in Fillmore.",
    hubId: null,
    winterNotes:
      "The only day in snow country. You check UDOT at the hotel at 7:30 AM, in St. George at 2,800 feet, before you commit. I-15 climbs to a 6,600-foot summit between Beaver and Cove Fort, which you reach around 9:45 AM in full daylight, and E17 sits near 6,500 feet. Bare or wet pavement is a go. Falling snow, snow-packed pavement, a traction law, or a closure means you stay another night at the Hilton Garden Inn and move the key time. The plan arrives about 1:15 PM.",
    snowGate: {
      checkAt: "Sat Nov 14 night (forecast), and UDOT at 7:30 AM MST from the hotel in St. George",
      sourceName: "UDOT Traffic",
      sourceUrl: "https://udottraffic.utah.gov",
      go: "I-15 from Cedar City to Nephi and US-189 through Provo Canyon are bare or wet, and no snow is forecast before noon.",
      hold: "Call the landlord before 8:00 AM and move the key time. Keep the room at the Hilton Garden Inn; I-15 usually clears by late morning. If it is a real storm, stay another night and finish Monday.",
    },
    legs: [
      {
        id: "sun-i15-summit",
        road: "I-15 N",
        from: "St. George",
        to: "Fillmore (exit 167)",
        miles: 163,
        topElevationFt: 6600,
        snowRisk: "watch",
        note: "The snow check of the trip. Cedar City, Beaver, then the 6,600-foot summit before Cove Fort in the morning.",
      },
      {
        id: "sun-provo-canyon",
        road: "I-15 N, US-189 N, US-40 N, I-80 W",
        from: "Fillmore",
        to: "900 Bitner Road, Apartment E17",
        miles: 153,
        topElevationFt: 6500,
        snowRisk: "watch",
        note: "Scipio and Nephi, then down into Utah Valley and off I-15 at Orem (exit 272). Up Provo Canyon past Deer Creek Reservoir to Heber, north on US-40 past Jordanelle to I-80, then west to Kimball Junction (exit 145).",
      },
    ],
    corridors: [
      {
        id: "provo_canyon",
        label: "I-15 to Orem, US-189 Provo Canyon, US-40, I-80 to Kimball Junction",
        when: "UDOT shows I-15 and US-189 bare or wet at the 7:30 AM check. This is the planned road. It skips Salt Lake City and Parleys Summit, and tops out about 6,500 feet at the end.",
        miles: 316,
        driveHours: 5,
      },
      {
        id: "parleys",
        label: "I-15 through Salt Lake City, I-80 E up Parleys Canyon",
        when: "Provo Canyon is closed, has a crash, or is snow-packed while Parleys shows bare or wet. Parleys is a six-lane interstate, plowed first, but it climbs to 7,120 feet. About 15 minutes longer.",
        miles: 330,
        driveHours: 5.2,
      },
      {
        id: "hold",
        label: "Stay in St. George and move the key time",
        when: "I-15 north of Cedar City shows falling snow, snow-packed pavement, a traction law, or a closure at the 7:30 AM check. Call the landlord before 8:00 AM.",
        miles: null,
        driveHours: null,
      },
    ],
    stops: [
      {
        id: "sun-fillmore",
        kind: "rest",
        place: "Territorial Statehouse, Fillmore",
        road: "I-15 N exit 167, then about a mile into town on Main Street. Gas at the exit",
        purpose:
          "About 2.5 hours out, just over the summit. Utah's oldest surviving government building, a red sandstone capitol from 1855 built for a state that did not exist yet. Walk the lawn with the cats, then fuel at the exit.",
        minutes: 15,
        clock: "10:30 AM MST",
        realisticUsd: 15,
      },
      {
        id: "sun-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-15 N",
        purpose: "Breakfast at the St. George hotel before you leave, coffee, and packed snacks.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
      {
        id: "sun-arrive",
        kind: "meal",
        place: "Kimball Junction",
        road: "900 Bitner Road, Apartment E17",
        purpose: "Meet the landlord for the keys. Cats in first, then a late lunch at Kimball Junction.",
        minutes: 30,
        clock: "1:15 PM MST",
        realisticUsd: 30,
      },
    ],
  },
];

function toDriveStop(hub: Hub): DriveStop {
  return {
    id: hub.id,
    label: hub.label,
    shortLabel: hub.shortLabel,
    city: hub.city,
    state: hub.state,
    lat: hub.lat,
    lng: hub.lng,
  };
}

export function routeForTown(routes: RouteRecord[], townId: TownId): RouteRecord {
  const found = routes.find((row) => row.townId === townId);
  if (!found) {
    throw new Error(`No cached route for ${townId}`);
  }
  return found;
}

export function hotelStale(hotel: HotelNight, now = new Date()): boolean {
  const age = now.getTime() - new Date(hotel.retrievedAt).getTime();
  return age > 30 * 24 * 60 * 60 * 1000;
}

export function isHiltonHonorsBrand(brand: string): boolean {
  const b = brand.toLowerCase();
  if (b.includes("home2") || b.includes("homewood") || b.includes("hampton")) {
    return true;
  }
  if (b.includes("hilton garden") || b.includes("embassy") || b.includes("doubletree") || b.includes("double tree")) {
    return true;
  }
  if (b.includes("tru by hilton") || b.includes("tru ")) {
    return true;
  }
  return b.includes("hilton") && !b.includes("marriott");
}

export function isStayHotel(hotel: HotelNight): boolean {
  if (!isHiltonHonorsBrand(hotel.brand) || hotel.catsAllowed !== true) {
    return false;
  }
  return hotel.maxPets !== "unknown" && hotel.maxPets >= 2;
}

export function longestDriveHours(days: DriveDay[]): number {
  return days.reduce((max, day) => Math.max(max, day.driveHours), 0);
}

function missingCatHilton(hub: Hub): HotelNight {
  return {
    id: `missing-${hub.id}`,
    brand: "Hilton Honors",
    propertyName: `No cat-allowed Hilton in ${hub.label}`,
    city: hub.city,
    state: hub.state,
    nights: 1,
    petPolicyQuote:
      "No Hilton Honors hotel in this city quotes two cats allowed. Night left unassigned. No Marriott fallback.",
    catsAllowed: false,
    maxPets: "unknown",
    petFeeUsd: null,
    petFeeRefundable: "unknown",
    weightLimitLbs: null,
    sourceUrl: `https://www.hilton.com/en/search/?query=${encodeURIComponent(hub.label)}`,
    retrievedAt: new Date(0).toISOString(),
    callToConfirmTwoCats: true,
    awardPointsPerNight: null,
    awardPointsQuote: "No Hilton Honors property in this hub publishes a two-cat stay or an award night.",
    parkingUsd: null,
  };
}

function pickHotel(properties: HotelNight[], hub: Hub, nights: number): HotelNight {
  const match =
    properties.find((h) => h.city.toLowerCase() === hub.city.toLowerCase() && h.state === hub.state) ??
    properties.find((h) => h.id === hub.id);
  if (!match || !isStayHotel(match)) {
    return missingCatHilton(hub);
  }
  return { ...match, nights };
}

function hubById(id: HubId): Hub {
  const found = hubs.find((hub) => hub.id === id);
  if (!found) {
    throw new Error(`Unknown hub ${id}`);
  }
  return found;
}

export function destinationLabelFor(townId: TownId, listings: { townId: TownId; address: string }[]): string {
  const atTown = listings.filter((row) => row.townId === townId);
  if (atTown.length === 1 && atTown[0].address.trim()) {
    return atTown[0].address.trim();
  }
  return destination.label;
}

export function planDrive(
  townId: TownId,
  route: RouteRecord,
  hotels: HotelNight[],
  gallonUsd: number,
  foodPerDay: number,
  contingencyTotal: number,
  destLabel?: string,
): DrivePlan {
  const town = townById[townId];
  const dest = destLabel?.trim() || destination.label;
  const foodScale = foodPerDay / realisticFoodPerDay;
  const contingencyEach = contingencyTotal / dayDrafts.length;
  const days: DriveDay[] = dayDrafts.map((draft, index) => {
    const hotel = draft.hubId ? pickHotel(hotels, hubById(draft.hubId), draft.hotelNights ?? 1) : null;
    const realisticFood = draft.stops.reduce((sum, stop) => sum + stop.realisticUsd, 0);
    const day: DriveDay = {
      day: index + 1,
      date: draft.date,
      dateLabel: draft.dateLabel,
      fromLabel: draft.fromLabel,
      toLabel: draft.hubId ? hubById(draft.hubId).label : dest,
      departClock: draft.departClock,
      arriveClock: draft.arriveClock,
      latestSafeDepart: draft.latestSafeDepart,
      timeZone: draft.timeZone,
      miles: draft.miles,
      driveHours: draft.driveHours,
      stoppedMinutes: draft.stops.reduce((sum, stop) => sum + stop.minutes, 0),
      routeSummary: draft.routeSummary,
      hotel,
      fuelUsd: Math.round((draft.miles / mpg) * gallonUsd),
      foodUsd: Math.round(realisticFood * foodScale),
      contingencyUsd: Math.round(contingencyEach),
      winterNotes: draft.hubId ? draft.winterNotes : `${draft.winterNotes} ${town.winterNotes}`,
      legs: draft.legs,
      stops: draft.stops,
      snowGate: draft.snowGate,
      corridors: draft.corridors,
      work: draft.work,
    };
    if (day.driveHours > DRIVE_CAP) {
      throw new Error(`Day ${day.day} is ${day.driveHours} h, over the ${DRIVE_CAP} h cap`);
    }
    return day;
  });
  const totalMiles = days.reduce((sum, day) => sum + day.miles, 0);
  const totalHours = round2(days.reduce((sum, day) => sum + day.driveHours, 0));
  return {
    townId,
    destLabel: dest,
    cap: DRIVE_CAP,
    days,
    nights: days.reduce((sum, day) => sum + (day.hotel?.nights ?? 0), 0),
    totalMiles,
    totalHours,
    corridor: route.corridor,
    summary: route.summary,
    stops: hubs.map(toDriveStop),
  };
}

export function tripBudget(plan: DrivePlan, tierId: BudgetTierId): TripBudget {
  const tier = tiers.find((t) => t.id === tierId);
  if (!tier) {
    throw new Error(`Unknown tier ${tierId}`);
  }
  const fuel = Math.round((plan.totalMiles / mpg) * tier.gallonUsd);
  let pointsRemaining = HILTON_HONORS_POINTS_BANK;
  let pointsUsed = 0;
  let lodging = 0;
  let parking = 0;
  let awardNightsPaid = 0;
  let cashLodgingNights = 0;
  let petFees = 0;
  let previousStayId: string | null = null;
  for (const day of plan.days) {
    const hotel = day.hotel;
    if (!hotel || !isStayHotel(hotel)) {
      previousStayId = null;
      continue;
    }
    const sameStay = previousStayId === hotel.id;
    previousStayId = hotel.id;
    if (!sameStay) {
      petFees += hotel.petFeeUsd ?? 0;
    }
    parking += hotel.parkingUsd ?? 0;
    const nights = hotel.nights;
    const award = hotel.awardPointsPerNight;
    const awardCost = award == null ? null : award * nights;
    if (awardCost != null && pointsRemaining >= awardCost) {
      pointsRemaining -= awardCost;
      pointsUsed += awardCost;
      awardNightsPaid += nights;
      continue;
    }
    lodging += impliedNightly(hotel) * nights;
    cashLodgingNights += nights;
  }
  const lodgingTax = Math.round((lodging + petFees) * lodgingTaxRate);
  const food = plan.days.reduce((sum, day) => sum + day.foodUsd, 0);
  const total = fuel + lodging + lodgingTax + parking + food + tier.catSupplies + tier.tolls + tier.contingency + petFees;
  return {
    id: tier.id,
    name: tier.name,
    fuel,
    lodging,
    lodgingTax,
    parking,
    food,
    catSupplies: tier.catSupplies,
    tolls: tier.tolls,
    contingency: tier.contingency,
    petFees,
    total,
    notes: tier.notes,
    pointsStart: HILTON_HONORS_POINTS_BANK,
    pointsUsed,
    pointsRemaining,
    awardNightsPaid,
    cashLodgingNights,
  };
}

export const budgetTiers = tiers;

export function tierById(id: BudgetTierId): TierRates {
  const found = tiers.find((t) => t.id === id);
  if (!found) {
    throw new Error(`Unknown tier ${id}`);
  }
  return found;
}

function impliedNightly(hotel: HotelNight): number {
  const brand = hotel.brand.toLowerCase();
  if (brand.includes("hampton") || brand.includes("home2") || brand.includes("tru")) {
    return 145;
  }
  if (brand.includes("garden") || brand.includes("doubletree") || brand.includes("double tree")) {
    return 160;
  }
  if (brand.includes("homewood") || brand.includes("embassy") || brand.includes("hilton")) {
    return 180;
  }
  return 160;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
