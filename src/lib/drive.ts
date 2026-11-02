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
export const leaveGainesville = "Thu Nov 12, 2026";
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

type HubId = "winnie" | "van_horn" | "kingman";

interface Hub {
  id: HubId;
  label: string;
  shortLabel: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

// Overnights are smaller towns on purpose. Big cities on the route are interstate pass-throughs.
const hubs: Hub[] = [
  {
    id: "winnie",
    label: "Winnie, TX",
    shortLabel: "Winnie",
    city: "Winnie",
    state: "TX",
    lat: 29.8202,
    lng: -94.3846,
  },
  {
    id: "van_horn",
    label: "Van Horn, TX",
    shortLabel: "Van Horn",
    city: "Van Horn",
    state: "TX",
    lat: 31.0399,
    lng: -104.8308,
  },
  {
    id: "kingman",
    label: "Kingman, AZ",
    shortLabel: "Kingman",
    city: "Kingman",
    state: "AZ",
    lat: 35.1894,
    lng: -114.053,
  },
];

// Why the southern corridor: both options side by side. Elevations are rounded highway figures.
export const routeOptions: RouteOption[] = [
  {
    id: "southern",
    label: "Southern: I-10 to Phoenix, US-93 to Las Vegas, I-15 up Utah",
    miles: 2767,
    nights: 3,
    highestFt: 6600,
    highestWhere: "I-15 summit between Beaver and Cove Fort, on Sunday morning",
    milesAbove6000: 40,
    verdict:
      "The plan. About 460 more miles, but Thursday through Saturday stay under 5,000 feet in the driest part of the country in November. Only Sunday morning reaches snow country, after a fuel stop and snow check in St. George at 2,800 feet. Every night is in a smaller town.",
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
      "Retired. Shorter, but Saturday crosses the Kansas and Colorado plains and Sunday spends about 430 miles above 6,000 feet on I-80 in Wyoming, which WYDOT closes for wind and blowing snow more than any other road on either route.",
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
    date: "2026-11-12",
    dateLabel: "Thu Nov 12",
    fromLabel: "Gainesville, FL",
    toLabel: "Winnie, TX",
    departClock: "5:00 AM EST",
    arriveClock: "5:20 PM CST",
    latestSafeDepart: "6:00 AM EST",
    timeZone: "EST to CST",
    miles: 790,
    driveHours: 11.9,
    routeSummary:
      "An early start: I-75 N to Lake City, then I-10 W across the Big Bend, the Panhandle, Mobile and the Mississippi coast, I-12 W around New Orleans, across the Atchafalaya Basin, then on past Lafayette, Lake Charles and Beaumont into Texas to Winnie. Stops: the round lake at DeFuniak Springs, the Davis Bayou, and the Atchafalaya Welcome Center. Tallahassee, Pensacola, Mobile, Baton Rouge, Lafayette, Lake Charles and Beaumont are drive-throughs.",
    hubId: "winnie",
    winterNotes:
      "Sea level all day, so snow is not a factor. The first two hours are in the dark (sunrise is about 6:55 AM EST at Lake City), so watch for deer between Lake City and Tallahassee. Clocks go back an hour at the Apalachicola River, near exit 158. The last half hour past Beaumont is at dusk (sunset is about 5:20 PM). Winnie is a quiet rice-country town of about 3,000 between Beaumont and Houston, and the hotel is right at I-10 exit 829. Stopping here also puts Houston first thing Friday, before the worst of the traffic builds.",
    snowGate: {
      ...weatherGate,
      checkAt: "Wed Nov 11 night, and again before 5:00 AM EST",
      go: "No winter storm, ice storm, or dense fog warning on I-10 or I-12 from Lake City to Beaumont.",
      hold: "Leave up to an hour later. The last hour past Beaumont is then after dark, but it is all interstate.",
    },
    legs: [
      {
        id: "thu-big-bend",
        road: "I-75 N, I-10 W",
        from: "4922 NW 81st Ave",
        to: "DeFuniak Springs (exit 85)",
        miles: 263,
        topElevationFt: 300,
        snowRisk: "none",
        note: "Starts in the dark: I-75 N 45 miles to Lake City, then I-10 W, the road for most of the next three days. Sunrise near Madison. Tallahassee is on the interstate. Central time starts at the Apalachicola River. Then past Marianna and Chipley.",
      },
      {
        id: "thu-coast",
        road: "I-10 W",
        from: "DeFuniak Springs",
        to: "Ocean Springs, MS (exit 50)",
        miles: 171,
        topElevationFt: 300,
        snowRisk: "none",
        note: "Past Crestview, through Pensacola and Mobile on the interstate, including the Wallace Tunnel under the Mobile River, and into Mississippi.",
      },
      {
        id: "thu-louisiana",
        road: "I-10 W, I-12 W, I-10 W",
        from: "Ocean Springs",
        to: "Atchafalaya Welcome Center (exit 121)",
        miles: 184,
        topElevationFt: 100,
        snowRisk: "none",
        note: "I-12 at Slidell keeps New Orleans 30 miles south. Baton Rouge's Mississippi bridge comes early afternoon. Then the Atchafalaya Basin Bridge, 18 miles long with no shoulder.",
      },
      {
        id: "thu-winnie",
        road: "I-10 W",
        from: "Atchafalaya Welcome Center",
        to: "Winnie, TX (exit 829)",
        miles: 172,
        topElevationFt: 100,
        snowRisk: "none",
        note: "Lafayette, Lake Charles and Beaumont all stay on the interstate. Into Texas over the Sabine River at Orange. The Hampton Inn & Suites is on Spur 5 at exit 829.",
      },
    ],
    stops: [
      {
        id: "thu-defuniak",
        kind: "meal",
        place: "Lake DeFuniak, DeFuniak Springs",
        road: "I-10 W exit 85, then about 2 miles north on US-331 into town. Gas at the exit",
        purpose:
          "About 4 hours out, in full daylight. A spring-fed lake so round it looks drawn with a compass, ringed by Victorian houses and an 1887 lakeside library. Breakfast from the cooler on a lakeside bench, a slow lap of Circle Drive, and fuel on the way back to I-10.",
        minutes: 25,
        clock: "8:00 AM CST",
        realisticUsd: 25,
      },
      {
        id: "thu-davis-bayou",
        kind: "rest",
        place: "Davis Bayou, Gulf Islands National Seashore",
        road: "I-10 W exit 50, then about 4 miles south through Ocean Springs to the park road",
        purpose:
          "About 3.5 hours later. A quiet bayou with live oaks and marsh birds. A short boardwalk from the parking lot, leash. Free.",
        minutes: 20,
        clock: "11:00 AM CST",
        realisticUsd: 0,
      },
      {
        id: "thu-atchafalaya",
        kind: "meal",
        place: "Atchafalaya Welcome Center",
        road: "I-10 W exit 121 at Butte La Rose, in the middle of the basin bridge",
        purpose:
          "About 2 hours 45 minutes later. A Louisiana welcome center on stilts in America's largest river swamp, with a short nature walk among the cypress. A late picnic lunch from the cooler. Leash. Free.",
        minutes: 40,
        clock: "2:05 PM CST",
        realisticUsd: 25,
      },
      {
        id: "thu-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-75 N / I-10 W",
        purpose: "Coffee, packed snacks and water. Eat something at Davis Bayou, because lunch is late.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
      {
        id: "thu-dinner",
        kind: "meal",
        place: "Winnie",
        road: "Near 318 Spur 5, after check-in",
        purpose: "Dinner pickup and an early night. Friday starts at 6:00 AM and is through Houston by about 7:30.",
        minutes: 30,
        clock: "5:45 PM CST",
        realisticUsd: 40,
      },
    ],
  },
  {
    date: "2026-11-13",
    dateLabel: "Fri Nov 13",
    fromLabel: "Winnie, TX",
    toLabel: "Van Horn, TX",
    departClock: "6:00 AM CST",
    arriveClock: "5:25 PM CST",
    latestSafeDepart: "6:30 AM CST",
    timeZone: "CST",
    miles: 693,
    driveHours: 10.2,
    routeSummary:
      "I-10 W from Winnie through Houston early in the morning, out through the Czech and German farm towns to the painted church at High Hill, around San Antonio, up into the Hill Country, and across West Texas at 80 mph to Van Horn. Stops: the painted church at High Hill, Junction, and Fort Stockton. Houston and San Antonio are drive-throughs.",
    hubId: "van_horn",
    winterNotes:
      "Sea level to about 4,000 feet and dry, so snow is very unlikely. Houston comes around 7:00 AM, early in the Friday rush, so allow an extra 30 minutes. Westbound out of downtown is the lighter direction. Deer are thick in the Hill Country. You reach Van Horn about 30 minutes before sunset (about 5:55 PM). Services are far apart west of Junction, so never let the tank drop below half. Van Horn is a ranch town of 2,000 on I-10, and the hotel is on the frontage road.",
    snowGate: {
      checkAt: "Thu Nov 12 night, and again before 6:00 AM CST",
      sourceName: "DriveTexas",
      sourceUrl: "https://drivetexas.org",
      go: "No ice, closure, or dense fog warning on I-10 from Orange to Van Horn.",
      hold: "Wait in Winnie. West Texas ice is rare and melts by late morning. An hour's wait still gets you to Van Horn just after dark, on I-10 the whole way, and Saturday's start does not change.",
    },
    legs: [
      {
        id: "fri-houston",
        road: "I-10 W",
        from: "Winnie",
        to: "High Hill, near Schulenburg (exit 674)",
        miles: 158,
        topElevationFt: 450,
        snowRisk: "none",
        note: "Past Baytown, then straight through Houston on the Katy Freeway early in the morning rush, with no exits inside the city. Then Katy, Sealy and Columbus, across the Brazos and Colorado rivers.",
      },
      {
        id: "fri-hill-country",
        road: "I-10 W",
        from: "High Hill",
        to: "Junction (exit 456)",
        miles: 221,
        topElevationFt: 2200,
        snowRisk: "none",
        note: "Back to I-10 at Schulenburg, past Seguin, through San Antonio late in the morning, then up past Boerne and Kerrville into the Hill Country.",
      },
      {
        id: "fri-west-texas",
        road: "I-10 W",
        from: "Junction",
        to: "Fort Stockton (exit 257)",
        miles: 200,
        topElevationFt: 3000,
        snowRisk: "low",
        note: "80 mph and few towns: Sonora and Ozona.",
      },
      {
        id: "fri-van-horn",
        road: "I-10 W",
        from: "Fort Stockton",
        to: "Van Horn (exit 138)",
        miles: 118,
        topElevationFt: 4100,
        snowRisk: "low",
        note: "Past Balmorhea with the Davis Mountains to the south, into the dusk. The Hampton Inn is on the southwest frontage road.",
      },
    ],
    stops: [
      {
        id: "fri-high-hill",
        kind: "rest",
        place: "St. Mary's painted church, High Hill",
        road: "I-10 W exit 674 (Schulenburg), then north on US-77 and out High Hill Road, about 3 miles. Follow the steeple. Gas at the exit",
        purpose:
          "About 2 hours 40 minutes out, well past Houston. A red-brick Gothic church alone in the farm fields, painted inside from floor to ceiling. Walk around it, step in if the door is open, then fuel at the exit.",
        minutes: 20,
        clock: "8:40 AM CST",
        realisticUsd: 5,
      },
      {
        id: "fri-junction",
        kind: "meal",
        place: "Junction",
        road: "I-10 W exit 456, then 5 minutes south to South Llano River State Park",
        purpose:
          "About 3 hours 15 minutes later. Fill the tank at the ramp, then a picnic lunch by the river in a small Hill Country town where two forks of the Llano meet. Leash.",
        minutes: 40,
        clock: "12:15 PM CST",
        realisticUsd: 30,
      },
      {
        id: "fri-fort-stockton",
        kind: "rest",
        place: "Fort Stockton",
        road: "I-10 W exit 257, gas at the ramp",
        purpose:
          "About 2 hours 40 minutes later. Fuel and a short walk. Paisano Pete, the giant roadrunner statue, is two minutes off the exit.",
        minutes: 15,
        clock: "3:35 PM CST",
        realisticUsd: 5,
      },
      {
        id: "fri-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-10 W",
        purpose: "Packed snacks, breakfast in the car, and plenty of water. Services are far apart.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 12,
      },
      {
        id: "fri-dinner",
        kind: "meal",
        place: "Van Horn",
        road: "Near 1921 SW Frontage Rd, after check-in",
        purpose: "Dinner pickup and fill the tank tonight. Saturday leaves at 6:00 AM.",
        minutes: 30,
        clock: "5:45 PM CST",
        realisticUsd: 35,
      },
    ],
  },
  {
    date: "2026-11-14",
    dateLabel: "Sat Nov 14",
    fromLabel: "Van Horn, TX",
    toLabel: "Kingman, AZ",
    departClock: "6:00 AM CST",
    arriveClock: "5:15 PM MST",
    latestSafeDepart: "6:30 AM CST",
    timeZone: "CST to MST",
    miles: 743,
    driveHours: 11,
    routeSummary:
      "I-10 W through El Paso before dawn and into New Mexico, breakfast on the plaza in Old Mesilla, then Deming, Lordsburg and Arizona. Past Tucson, around Phoenix on Loop 202 and Loop 303, US-60 to Wickenburg, and US-93 north through the Joshua tree country to Kingman. Stops: Old Mesilla, lunch at Texas Canyon, and Wickenburg. Picacho Peak is a view from the interstate. El Paso, Las Cruces, Tucson and Phoenix are drive-throughs.",
    hubId: "kingman",
    winterNotes:
      "High desert, 1,000 to 5,000 feet, and dry in November. Snow and ice are rare and melt by midday. Blowing dust between Lordsburg and San Simon is the real hazard. Clocks go back an hour just west of Van Horn, so you leave at 5:00 AM Mountain time. You reach Kingman around sunset (about 5:25 PM). Kingman sits at 3,300 feet on I-40.",
    snowGate: {
      checkAt: "Fri Nov 13 night, and again before 6:00 AM CST",
      sourceName: "AZ 511",
      sourceUrl: "https://www.az511.gov",
      go: "I-10 from Lordsburg to Willcox has no dust or closure warning, and US-93 north of Wickenburg is open.",
      hold: "Wait in Van Horn or at the next exit until the dust warning lifts. Shorten the Texas Canyon lunch to make up time.",
    },
    legs: [
      {
        id: "sat-el-paso",
        road: "I-10 W",
        from: "Van Horn",
        to: "Old Mesilla (exit 140)",
        miles: 162,
        topElevationFt: 4600,
        snowRisk: "low",
        note: "In the dark. Mountain time starts at the Hudspeth County line. Stay on I-10 straight through El Paso, no exits, then into New Mexico.",
      },
      {
        id: "sat-new-mexico",
        road: "I-10 W",
        from: "Old Mesilla",
        to: "Texas Canyon rest area (AZ mile 320)",
        miles: 210,
        topElevationFt: 4975,
        snowRisk: "low",
        note: "Deming, Lordsburg and the dust-storm zone at the Arizona line. Fuel in Deming or Lordsburg.",
      },
      {
        id: "sat-phoenix",
        road: "I-10 W, Loop 202 W, Loop 303 N, US-60 W",
        from: "Texas Canyon",
        to: "Wickenburg",
        miles: 241,
        topElevationFt: 4500,
        snowRisk: "none",
        note: "Down through Benson, straight past Tucson with no exits in the city, and past the spike of Picacho Peak. Then Loop 202 (South Mountain Freeway) and Loop 303 keep you out of downtown Phoenix.",
      },
      {
        id: "sat-us93",
        road: "US-93 N, I-40 W",
        from: "Wickenburg",
        to: "Kingman",
        miles: 130,
        topElevationFt: 4000,
        snowRisk: "low",
        note: "The Joshua Forest Scenic Road, the Burro Creek bridge and Wikieup, then I-40 into Kingman as the sun goes down. Services are thin until Kingman.",
      },
    ],
    stops: [
      {
        id: "sat-mesilla",
        kind: "meal",
        place: "Old Mesilla plaza",
        road: "I-10 W exit 140, then about 2 miles south to the plaza",
        purpose:
          "About 2.5 hours out, just after sunrise. A tiny historic town of adobe shops and the San Albino basilica around an 1850s plaza. Breakfast burritos with green chile to go, and a walk around the plaza with the cats.",
        minutes: 30,
        clock: "7:25 AM MST",
        realisticUsd: 25,
      },
      {
        id: "sat-texas-canyon",
        kind: "rest",
        place: "Texas Canyon rest area",
        road: "I-10 W near mile 320, on the highway",
        purpose: "About 3 hours later. Lunch among huge granite boulders piled up beside the interstate. Picnic from the cooler, then a short walk through the rocks.",
        minutes: 30,
        clock: "10:55 AM MST",
        realisticUsd: 25,
      },
      {
        id: "sat-wickenburg",
        kind: "rest",
        place: "Downtown Wickenburg",
        road: "US-60 into town, where it meets US-93",
        purpose: "About 3.5 hours later. An old Western gold town with the Jail Tree on its main street. Fill the tank, because services are thin until Kingman.",
        minutes: 15,
        clock: "3:00 PM MST",
        realisticUsd: 5,
      },
      {
        id: "sat-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-10 W / US-93 N",
        purpose: "Packed snacks and plenty of water.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
      {
        id: "sat-dinner",
        kind: "meal",
        place: "Kingman",
        road: "Near 1121 Sunrise Ave, after check-in",
        purpose:
          "Dinner pickup, fill the tank, and read tomorrow's forecast for I-15 in Utah. Sunday leaves at 4:00 AM, so set out clothes, coffee and cat food before bed. Text the landlord your planned 1:15 PM arrival.",
        minutes: 30,
        clock: "5:30 PM MST",
        realisticUsd: 40,
      },
    ],
  },
  {
    date: "2026-11-15",
    dateLabel: "Sun Nov 15",
    fromLabel: "Kingman, AZ",
    toLabel: "900 Bitner Road, Apartment E17",
    departClock: "4:00 AM MST",
    arriveClock: "1:15 PM MST",
    latestSafeDepart: "4:45 AM MST",
    timeZone: "MST, with Nevada an hour behind on Pacific time",
    miles: 541,
    driveHours: 8.5,
    routeSummary:
      "Keys by 2:00 PM. US-93 north over the Hoover Dam bridge before dawn, I-11, I-215 and I-15 past Las Vegas and through the Virgin River Gorge to St. George at sunrise. Then I-15 N past Cedar City over the 6,600-foot summit in the morning, and US-189 up Provo Canyon and US-40 to I-80 at Kimball Junction. Stops: Pioneer Park in St. George (sunrise on the red rock, fuel, and the snow check) and Utah's first capitol building in Fillmore. Las Vegas is a drive-through.",
    hubId: null,
    winterNotes:
      "The only day in snow country. The first three hours are dark desert, 1,000 to 3,700 feet. After St. George, I-15 climbs from 2,800 feet to a 6,600-foot summit between Beaver and Cove Fort, which you reach around 9:50 AM in full daylight, and E17 sits near 6,500 feet. Bare or wet pavement is a go. Falling snow, snow-packed pavement, a traction law, or a closure means you call the landlord from St. George and move the key time. The plan arrives about 1:15 PM, so it has about 45 minutes of slack for traffic or a slow canyon. If the morning runs late, skip Pioneer Park and just fuel at exit 8.",
    snowGate: {
      checkAt: "Sat Nov 14 night (forecast), and UDOT at about 7:30 AM MST in St. George",
      sourceName: "UDOT Traffic",
      sourceUrl: "https://udottraffic.utah.gov",
      go: "I-15 from Cedar City to Nephi and US-189 through Provo Canyon are bare or wet, and no snow is forecast before noon.",
      hold: "Call the landlord from St. George before 8:00 AM and move the key time. Wait at 2,800 feet for the plows; I-15 usually clears by late morning. If it is a real storm, stay at the Hilton Garden Inn St. George and finish Monday.",
    },
    legs: [
      {
        id: "sun-gorge",
        road: "US-93 N, I-11 N, I-215 W, I-15 N",
        from: "Kingman",
        to: "St. George",
        miles: 225,
        topElevationFt: 3700,
        snowRisk: "none",
        note: "All in the dark until the gorge. Hoover Dam bridge around 5:10 AM MST. Nevada is Pacific time, then clocks go forward again in Utah. The Virgin River Gorge comes at first light.",
      },
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
        when: "UDOT shows I-15 and US-189 bare or wet at the St. George check. This is the planned road. It skips Salt Lake City and Parleys Summit, and tops out about 6,500 feet at the end.",
        miles: 541,
        driveHours: 8.5,
      },
      {
        id: "parleys",
        label: "I-15 through Salt Lake City, I-80 E up Parleys Canyon",
        when: "Provo Canyon is closed, has a crash, or is snow-packed while Parleys shows bare or wet. Parleys is a six-lane interstate, plowed first, but it climbs to 7,120 feet. About 15 minutes longer.",
        miles: 555,
        driveHours: 8.7,
      },
      {
        id: "hold",
        label: "Wait in St. George and move the key time",
        when: "I-15 north of Cedar City shows falling snow, snow-packed pavement, a traction law, or a closure at the 7:30 AM check. Call the landlord before 8:00 AM.",
        miles: 225,
        driveHours: 3.5,
      },
    ],
    stops: [
      {
        id: "sun-st-george",
        kind: "rest",
        place: "Pioneer Park, St. George",
        road: "I-15 N exit 8, east on St. George Boulevard, left on 1000 East, left on Red Hills Parkway. About 5 minutes each way. Gas at exit 8",
        purpose:
          "About 3.5 hours out, at sunrise. Red sandstone boulders on the bluff above town, with the white DIXIE letters painted on the Sugarloaf rock and the whole valley lit orange below. Ten minutes on the rocks, then fuel, coffee, and the snow check: open UDOT Traffic and read I-15 to Nephi and US-189 before you go on.",
        minutes: 30,
        clock: "7:30 AM MST",
        realisticUsd: 15,
      },
      {
        id: "sun-fillmore",
        kind: "rest",
        place: "Territorial Statehouse, Fillmore",
        road: "I-15 N exit 167, then about a mile into town on Main Street. Gas at the exit",
        purpose:
          "About 2.5 hours later, just over the summit. Utah's oldest surviving government building, a red sandstone capitol from 1855 built for a state that did not exist yet. Walk the lawn with the cats, then fuel at the exit.",
        minutes: 15,
        clock: "10:30 AM MST",
        realisticUsd: 15,
      },
      {
        id: "sun-snacks",
        kind: "meal",
        place: "In the car",
        road: "US-93 N / I-15 N",
        purpose: "Coffee, breakfast from the Kingman hotel, and packed snacks.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
      {
        id: "sun-arrive",
        kind: "meal",
        place: "Kimball Junction",
        road: "900 Bitner Road, Apartment E17",
        purpose: "Meet the landlord by 2:00 PM for the keys. Cats in first, then a late lunch at Kimball Junction.",
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
