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
export const arriveParkCity = "Mon Nov 16, 2026";

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

type HubId = "crestview" | "seguin" | "deming" | "st_george";

interface Hub {
  id: HubId;
  label: string;
  shortLabel: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

// Overnights are smaller towns on purpose. Big cities on the route are interstate pass-throughs in daylight.
const hubs: Hub[] = [
  {
    id: "crestview",
    label: "Crestview, FL",
    shortLabel: "Crestview",
    city: "Crestview",
    state: "FL",
    lat: 30.7621,
    lng: -86.5705,
  },
  {
    id: "seguin",
    label: "Seguin, TX",
    shortLabel: "Seguin",
    city: "Seguin",
    state: "TX",
    lat: 29.5688,
    lng: -97.9647,
  },
  {
    id: "deming",
    label: "Deming, NM",
    shortLabel: "Deming",
    city: "Deming",
    state: "NM",
    lat: 32.2687,
    lng: -107.7586,
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
    label: "Southern: I-10 to Phoenix, US-93 to Las Vegas, I-15 up Utah",
    miles: 2793,
    nights: 4,
    highestFt: 6600,
    highestWhere: "I-15 summit between Beaver and Cove Fort, on the last day",
    milesAbove6000: 40,
    verdict:
      "The plan. About 490 more miles and one more night, but the first four days stay under 5,000 feet in the driest part of the country in November. Only Sunday reaches snow country, and it has a low-altitude hold in St. George. Every night is in a smaller town.",
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
  // Nights booked at this hub. St. George keeps the room through Monday's workday.
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
    toLabel: "Crestview, FL",
    departClock: "5:30 PM EST",
    arriveClock: "9:30 PM CST",
    latestSafeDepart: "7:00 PM EST",
    timeZone: "EST to CST",
    miles: 292,
    driveHours: 4.5,
    routeSummary:
      "A workday at home, then the evening run: I-75 N to Lake City and I-10 W across the Big Bend and the Panhandle to Crestview. One dinner and fuel stop in Marianna. Tallahassee is a drive-through.",
    hubId: "crestview",
    work: {
      where: "At home, 4922 NW 81st Ave",
      hours: "Your normal day, until 5:00 PM EST",
      notes: [
        "Pack the car Wednesday night so only the cats, the litter box and the cooler go in after work.",
        "Cats in their carriers by 5:15 PM. Leave by 5:30.",
      ],
    },
    winterNotes:
      "All of it after dark and at sea level, so snow is not a factor. The hazards are deer on the rural stretches between Lake City and Tallahassee and drowsiness. Clocks go back an hour at the Apalachicola River, near exit 158. Crestview is a small town on I-10, and the hotel is right at the exit.",
    snowGate: {
      ...weatherGate,
      checkAt: "Thu Nov 12 at lunch, and again before 5:30 PM EST",
      hold: "Leave an hour or two later, or stop early at Marianna. Friday is your day off, so nothing is lost.",
    },
    legs: [
      {
        id: "thu-i75",
        road: "I-75 N",
        from: "4922 NW 81st Ave",
        to: "I-10 at Lake City",
        miles: 45,
        topElevationFt: 200,
        snowRisk: "none",
        note: "Take I-10 W at exit 435. It is the road for most of the next three days.",
      },
      {
        id: "thu-big-bend",
        road: "I-10 W",
        from: "Lake City",
        to: "Marianna (exit 142)",
        miles: 161,
        topElevationFt: 300,
        snowRisk: "none",
        note: "Dark, rural and straight. Tallahassee is about an hour in, on the interstate. Central time starts at the Apalachicola River, just before Marianna.",
      },
      {
        id: "thu-crestview",
        road: "I-10 W",
        from: "Marianna",
        to: "Crestview (exit 56)",
        miles: 86,
        topElevationFt: 300,
        snowRisk: "none",
        note: "Past Chipley and DeFuniak Springs. The Hampton Inn is on John King Road right off exit 56.",
      },
    ],
    stops: [
      {
        id: "thu-marianna",
        kind: "meal",
        place: "Marianna, I-10 exit 142",
        road: "I-10 W exit 142 (SR-71), gas and food at the ramp",
        purpose:
          "About 3 hours out. Fuel and a quick dinner at the exit. One person stays with the cats. Ten minutes of walking around the lot keeps you awake for the last 80 minutes.",
        minutes: 30,
        clock: "7:40 PM CST",
        realisticUsd: 35,
      },
      {
        id: "thu-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-75 N / I-10 W",
        purpose: "Coffee, packed snacks and water. Put tomorrow's lunch fixings in the cooler.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
    ],
  },
  {
    date: "2026-11-13",
    dateLabel: "Fri Nov 13",
    fromLabel: "Crestview, FL",
    toLabel: "Seguin, TX",
    departClock: "6:00 AM CST",
    arriveClock: "6:30 PM CST",
    latestSafeDepart: "6:30 AM CST",
    timeZone: "CST",
    miles: 729,
    driveHours: 11,
    routeSummary:
      "Your day off, and the longest drive on the plan. I-10 W along the Gulf through Mobile, I-12 W around New Orleans, across the Atchafalaya Basin, into Texas at Orange, through Houston mid-afternoon, and on to Seguin. Stops: the Davis Bayou, the Atchafalaya Welcome Center, the Texas welcome center boardwalk, and San Felipe de Austin. Mobile, Baton Rouge, Lafayette, Lake Charles, Beaumont, Houston and San Antonio's suburbs are drive-throughs.",
    hubId: "seguin",
    winterNotes:
      "Under 600 feet all day, so snow is not a factor. The risk is Houston on a Friday afternoon. The plan has you on the Katy Freeway around 3:00 PM, before the worst of it, but allow an extra 30 to 45 minutes. The last hour, from Columbus to Seguin, is after sunset (about 5:35 PM), so watch for deer. Seguin is a small river town east of San Antonio.",
    snowGate: {
      ...weatherGate,
      checkAt: "Thu Nov 12 night, and again before 6:00 AM CST",
      go: "No winter storm, ice storm, or dense fog warning on I-10 from Mobile to San Antonio.",
    },
    legs: [
      {
        id: "fri-coast",
        road: "I-10 W",
        from: "Crestview",
        to: "Ocean Springs, MS (exit 50)",
        miles: 151,
        topElevationFt: 300,
        snowRisk: "none",
        note: "Pensacola and Mobile stay on the interstate, including the Wallace Tunnel under the Mobile River. Leave after first light.",
      },
      {
        id: "fri-louisiana",
        road: "I-10 W, I-12 W, I-10 W",
        from: "Ocean Springs",
        to: "Atchafalaya Welcome Center (exit 121)",
        miles: 184,
        topElevationFt: 100,
        snowRisk: "none",
        note: "I-12 at Slidell keeps New Orleans 30 miles south. Baton Rouge's Mississippi bridge comes late morning, after the rush. Then the Atchafalaya Basin Bridge, 18 miles long with no shoulder.",
      },
      {
        id: "fri-sabine",
        road: "I-10 W",
        from: "Atchafalaya Welcome Center",
        to: "Orange, TX (exit 880)",
        miles: 122,
        topElevationFt: 100,
        snowRisk: "none",
        note: "Lafayette and Lake Charles stay on the interstate. Fuel in Sulphur, the last exits before Texas.",
      },
      {
        id: "fri-houston",
        road: "I-10 W",
        from: "Orange",
        to: "San Felipe (exit 723)",
        miles: 157,
        topElevationFt: 150,
        snowRisk: "none",
        note: "Beaumont, then straight through Houston on the Katy Freeway in the middle of the afternoon. No exits inside the city.",
      },
      {
        id: "fri-seguin",
        road: "I-10 W",
        from: "San Felipe",
        to: "Seguin (exit 610)",
        miles: 115,
        topElevationFt: 600,
        snowRisk: "none",
        note: "Past Columbus and Schulenburg into the dark. Deer are common on this stretch after sunset.",
      },
    ],
    stops: [
      {
        id: "fri-davis-bayou",
        kind: "rest",
        place: "Davis Bayou, Gulf Islands National Seashore",
        road: "I-10 W exit 50, then about 4 miles south through Ocean Springs to the park road",
        purpose:
          "About 2 hours 15 minutes out. A quiet bayou with live oaks and marsh birds in the morning light. A short boardwalk from the parking lot, leash. Free.",
        minutes: 20,
        clock: "8:15 AM CST",
        realisticUsd: 0,
      },
      {
        id: "fri-atchafalaya",
        kind: "meal",
        place: "Atchafalaya Welcome Center",
        road: "I-10 W exit 121 at Butte La Rose, in the middle of the basin bridge",
        purpose:
          "About 2 hours 45 minutes later. A Louisiana welcome center built on stilts in America's largest river swamp, with exhibits and a short nature walk among the cypress. Picnic lunch from the cooler. Leash. Free.",
        minutes: 40,
        clock: "11:20 AM CST",
        realisticUsd: 25,
      },
      {
        id: "fri-orange",
        kind: "rest",
        place: "Texas Travel Information Center, Orange",
        road: "I-10 W exit 880, right after the Sabine River",
        purpose: "About 1 hour 50 minutes later, at the state line. A boardwalk runs out over a cypress swamp behind the building. Leash, free.",
        minutes: 15,
        clock: "1:50 PM CST",
        realisticUsd: 0,
      },
      {
        id: "fri-san-felipe",
        kind: "rest",
        place: "San Felipe de Austin State Historic Site",
        road: "I-10 W exit 723, then about 2 miles north on FM 1458",
        purpose:
          "About 2 hours 25 minutes later, just past Houston. The town Stephen F. Austin founded in 1824, on a bluff above the Brazos. Walk the grounds and the river overlook with the cats before the last stretch.",
        minutes: 15,
        clock: "4:30 PM CST",
        realisticUsd: 0,
      },
      {
        id: "fri-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-10 W",
        purpose: "Packed snacks and water.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 12,
      },
      {
        id: "fri-dinner",
        kind: "meal",
        place: "Seguin",
        road: "Near 1130 Larkin Ave, after check-in",
        purpose:
          "Dinner pickup. Downtown Seguin, with its courthouse square and giant pecan statue, is a few minutes away if you want a short walk after a long day.",
        minutes: 30,
        clock: "7:00 PM CST",
        realisticUsd: 45,
      },
    ],
  },
  {
    date: "2026-11-14",
    dateLabel: "Sat Nov 14",
    fromLabel: "Seguin, TX",
    toLabel: "Deming, NM",
    departClock: "6:30 AM CST",
    arriveClock: "4:55 PM MST",
    latestSafeDepart: "7:15 AM CST",
    timeZone: "CST to MST",
    miles: 705,
    driveHours: 9.9,
    routeSummary:
      "I-10 W around San Antonio on a quiet Saturday morning, up into the Hill Country, then across West Texas at 80 mph: Junction, Ozona, Fort Stockton, Van Horn, through El Paso and into New Mexico. Stops: Junction, Balmorhea's desert spring pool, and the 1850s plaza in Old Mesilla. San Antonio, El Paso and Las Cruces are drive-throughs.",
    hubId: "deming",
    winterNotes:
      "High desert, 600 to 4,600 feet, and dry in November. Snow and ice are rare and melt by midday. The first half hour is before sunrise (about 7:00 AM), and deer are thick in the Hill Country at dawn. Towns are far apart: never let the tank drop below half. Clocks go back an hour at the Hudspeth County line, east of El Paso. Deming is a small ranch town off I-10.",
    snowGate: {
      checkAt: "Fri Nov 13 night, and again before 6:30 AM CST",
      sourceName: "DriveTexas",
      sourceUrl: "https://drivetexas.org",
      go: "I-10 from Kerrville to El Paso shows no ice, closure, or blowing-dust warning.",
      hold: "Wait in Seguin. West Texas ice is rare and usually gone by late morning, and Deming is still reachable by about 6:00 PM with an 8:00 AM start.",
    },
    legs: [
      {
        id: "sat-hill-country",
        road: "I-10 W",
        from: "Seguin",
        to: "Junction (exit 456)",
        miles: 154,
        topElevationFt: 2200,
        snowRisk: "none",
        note: "Through San Antonio with no Saturday rush, then up past Boerne and Kerrville into the Hill Country.",
      },
      {
        id: "sat-west-texas",
        road: "I-10 W, TX-17",
        from: "Junction",
        to: "Balmorhea State Park",
        miles: 255,
        topElevationFt: 3300,
        snowRisk: "low",
        note: "80 mph and few towns. Fuel in Junction, Ozona or Fort Stockton. Exit 209 for TX-17.",
      },
      {
        id: "sat-el-paso",
        road: "TX-17, I-10 W",
        from: "Balmorhea State Park",
        to: "Old Mesilla (exit 140)",
        miles: 238,
        topElevationFt: 4600,
        snowRisk: "low",
        note: "Past Van Horn, the highest stretch of the day. Mountain time starts at the Hudspeth County line. Stay on I-10 straight through El Paso, no exits, then into New Mexico.",
      },
      {
        id: "sat-deming",
        road: "I-10 W",
        from: "Old Mesilla",
        to: "Deming (exit 85)",
        miles: 58,
        topElevationFt: 4400,
        snowRisk: "none",
        note: "Open desert with the Florida Mountains to the south. The hotel is on East Cedar Street near exit 85.",
      },
    ],
    stops: [
      {
        id: "sat-junction",
        kind: "rest",
        place: "Junction",
        road: "I-10 W exit 456, gas and food at the ramp",
        purpose:
          "About 2 hours 20 minutes out. Fuel and stretch in a small Hill Country town where two forks of the Llano River meet. South Llano River State Park is 5 minutes south if you want a short river walk.",
        minutes: 15,
        clock: "8:50 AM CST",
        realisticUsd: 5,
      },
      {
        id: "sat-balmorhea",
        kind: "meal",
        place: "Balmorhea State Park",
        road: "I-10 W exit 209, then about 7 miles on TX-17 through Balmorhea to Toyahvale",
        purpose:
          "About 3 hours 20 minutes later. A clear, spring-fed desert pool full of fish, with the Davis Mountains behind it. Picnic lunch from the cooler. Leashed pets are fine on the grounds, not in the pool. Buy the day pass online from Texas State Parks the night before.",
        minutes: 45,
        clock: "12:25 PM CST",
        realisticUsd: 30,
      },
      {
        id: "sat-mesilla",
        kind: "rest",
        place: "Old Mesilla plaza",
        road: "I-10 W exit 140, then about 2 miles south to the plaza",
        purpose:
          "About 3 hours 20 minutes later. A tiny historic town of adobe shops and the San Albino basilica around an 1850s plaza, next to Las Cruces but its own place. Walk the plaza with the cats and grab red or green chile to go.",
        minutes: 30,
        clock: "3:30 PM MST",
        realisticUsd: 25,
      },
      {
        id: "sat-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-10 W",
        purpose: "Packed snacks and plenty of water. Services are far apart.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
      {
        id: "sat-dinner",
        kind: "meal",
        place: "Deming",
        road: "Near 3751 E Cedar St",
        purpose:
          "Dinner pickup. You arrive right around sunset, about 5:05 PM. Fill the tank tonight, because Sunday is the long desert day.",
        minutes: 30,
        clock: "5:30 PM MST",
        realisticUsd: 40,
      },
    ],
  },
  {
    date: "2026-11-15",
    dateLabel: "Sun Nov 15",
    fromLabel: "Deming, NM",
    toLabel: "St. George, UT",
    departClock: "6:15 AM MST",
    arriveClock: "7:25 PM MST",
    latestSafeDepart: "6:45 AM MST",
    timeZone: "MST, with Nevada an hour behind on Pacific time",
    miles: 740,
    driveHours: 11.3,
    routeSummary:
      "I-10 W into Arizona past Tucson, around Phoenix on Loop 202 and Loop 303, US-60 to Wickenburg, US-93 north through the Joshua tree country to Kingman and over the Hoover Dam bridge, then I-11, I-215 and I-15 past Las Vegas and through the Virgin River Gorge to St. George. Stops: Texas Canyon, Picacho Peak, Wickenburg, Kingman and Hoover Dam. Tucson, Phoenix and Las Vegas are drive-throughs.",
    hubId: "st_george",
    hotelNights: 2,
    winterNotes:
      "Desert all day, 2,000 to 5,000 feet, so snow is very unlikely. It is a long day: sunset is about 4:35 PM Nevada time at Hoover Dam, so Las Vegas and the Virgin River Gorge come after dark. The gorge is a curvy interstate canyon, so hold the speed limit and no stopping. Blowing dust between Lordsburg and San Simon is the morning hazard. St. George sits at 2,800 feet and almost never snows, which is why it is the workday stop.",
    snowGate: {
      checkAt: "Sat Nov 14 night, and again before 6:15 AM MST",
      sourceName: "AZ 511",
      sourceUrl: "https://www.az511.gov",
      go: "I-10 from Lordsburg to Willcox has no dust or closure warning, and US-93 north of Wickenburg is open.",
      hold: "Wait in Deming until the dust warning lifts. A late start means more of the Nevada stretch after dark, so drop the Hoover Dam stop to make it up.",
    },
    legs: [
      {
        id: "sun-texas-canyon",
        road: "I-10 W",
        from: "Deming",
        to: "Texas Canyon rest area (AZ mile 320)",
        miles: 152,
        topElevationFt: 4975,
        snowRisk: "low",
        note: "Dust-storm zone near the state line. Leave Deming with a full tank.",
      },
      {
        id: "sun-picacho",
        road: "I-10 W",
        from: "Texas Canyon",
        to: "Picacho Peak (exit 219)",
        miles: 101,
        topElevationFt: 4500,
        snowRisk: "none",
        note: "Down through Benson and straight past Tucson on the interstate. No exits in the city.",
      },
      {
        id: "sun-phoenix",
        road: "I-10 W, Loop 202 W, Loop 303 N, US-60 W",
        from: "Picacho Peak",
        to: "Wickenburg",
        miles: 134,
        topElevationFt: 2500,
        snowRisk: "none",
        note: "Sunday traffic is light. Loop 202 (South Mountain Freeway) and Loop 303 keep you out of downtown Phoenix.",
      },
      {
        id: "sun-us93",
        road: "US-93 N, I-40 W",
        from: "Wickenburg",
        to: "Kingman",
        miles: 130,
        topElevationFt: 4000,
        snowRisk: "low",
        note: "The Joshua Forest Scenic Road, the Burro Creek bridge and Wikieup, then I-40 into Kingman. Fuel in Wickenburg first, because services are thin until Kingman.",
      },
      {
        id: "sun-hoover",
        road: "US-93 N",
        from: "Kingman",
        to: "Hoover Dam (exit 2)",
        miles: 75,
        topElevationFt: 3700,
        snowRisk: "none",
        note: "Divided highway to the Colorado River. Nevada is Pacific time, so clocks read an hour earlier across the bridge.",
      },
      {
        id: "sun-gorge",
        road: "I-11 N, I-215 W, I-15 N",
        from: "Hoover Dam",
        to: "St. George",
        miles: 148,
        topElevationFt: 3000,
        snowRisk: "none",
        note: "The beltway skips the Strip. After Mesquite, I-15 threads the Virgin River Gorge in the dark. Clocks go forward an hour into Utah.",
      },
    ],
    stops: [
      {
        id: "sun-texas-canyon",
        kind: "rest",
        place: "Texas Canyon rest area",
        road: "I-10 W near mile 320, on the highway",
        purpose:
          "About 2 hours 15 minutes out. Huge granite boulders piled up beside the interstate. Walk among them with the cats for 15 minutes.",
        minutes: 15,
        clock: "8:30 AM MST",
        realisticUsd: 0,
      },
      {
        id: "sun-picacho",
        kind: "rest",
        place: "Picacho Peak State Park",
        road: "I-10 W exit 219, the park road starts at the exit",
        purpose:
          "About 1.5 hours later. A volcanic spire rising out of a forest of saguaro cactus. Drive part of the park loop and stretch at a picnic stop, leash. About $7 per vehicle.",
        minutes: 20,
        clock: "10:15 AM MST",
        realisticUsd: 7,
      },
      {
        id: "sun-wickenburg",
        kind: "meal",
        place: "Downtown Wickenburg",
        road: "US-60 into town, where it meets US-93",
        purpose:
          "About 2 hours later. An old Western gold town of 8,000 with a walkable main street and the Jail Tree. Lunch, then fill the tank.",
        minutes: 40,
        clock: "12:40 PM MST",
        realisticUsd: 40,
      },
      {
        id: "sun-kingman",
        kind: "rest",
        place: "Kingman, on Route 66",
        road: "I-40 W into Kingman, then Andy Devine Avenue (Route 66)",
        purpose: "About 2 hours later. Fuel and a stretch on old Route 66 before Nevada.",
        minutes: 15,
        clock: "3:20 PM MST",
        realisticUsd: 5,
      },
      {
        id: "sun-hoover",
        kind: "rest",
        place: "Hoover Dam and the Pat Tillman Memorial Bridge",
        road: "US-93 exit 2 onto the Hoover Dam road, past the security check, to the free bridge-walkway lot",
        purpose:
          "About 1 hour 10 minutes later, near sunset. Walk out on the bypass bridge for the view straight down onto the dam. One person walks and one stays with the cats. Skip it if you are running late.",
        minutes: 20,
        clock: "3:45 PM Nevada time (4:45 PM MST)",
        realisticUsd: 0,
      },
      {
        id: "sun-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-10 W / US-93 N / I-15 N",
        purpose: "Packed snacks and water.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
      {
        id: "sun-dinner",
        kind: "meal",
        place: "St. George",
        road: "Near 1731 S Convention Center Dr, after check-in",
        purpose:
          "Dinner pickup. Before bed, set up tomorrow's office: test the room Wi-Fi with a video call, find the business center, and ask the desk to confirm the second night is on the reservation.",
        minutes: 30,
        clock: "7:45 PM MST",
        realisticUsd: 45,
      },
    ],
  },
  {
    date: "2026-11-16",
    dateLabel: "Mon Nov 16",
    fromLabel: "St. George, UT",
    toLabel: "900 Bitner Road, Apartment E17",
    departClock: "3:10 PM MST",
    arriveClock: "8:25 PM MST",
    latestSafeDepart: "3:30 PM MST",
    timeZone: "MST",
    miles: 316,
    driveHours: 5,
    routeSummary:
      "A workday at the Hilton Garden Inn in St. George, then I-15 N up Utah past Cedar City and over the 6,600-foot summit near sunset, and US-189 up Provo Canyon and US-40 to I-80 at Kimball Junction in the dark. One fuel stop in Fillmore.",
    hubId: null,
    work: {
      where: "Hilton Garden Inn St. George, in your room",
      hours: "7:00 AM to 3:00 PM MST (9 to 5 Eastern)",
      notes: [
        "The room is booked for Sunday and Monday nights. Hilton's listings say pets cannot be left alone in the room, so working in the business center while the cats stay upstairs is not an option. Keeping the room means you work at the desk with the cats beside you.",
        "Use the business center for printing, or as a quiet room for a call while one person stays with the cats.",
        "Rooms have a desk and free Wi-Fi. Keep your phone hotspot ready as a backup.",
        "Breakfast is in the restaurant downstairs. Check UDOT at 2:00 PM, load the car at 2:45, and check out at 3:00.",
        "This assumes you work Eastern hours. If your hours follow local time, you would leave at 5:10 PM and reach E17 about 10:25 PM.",
      ],
    },
    winterNotes:
      "The only day that reaches snow country, and the only drive after a workday. I-15 climbs from 2,800 feet to a 6,600-foot summit between Beaver and Cove Fort, and you reach it around sunset (about 5:10 PM). Fillmore to E17 is in the dark, including Provo Canyon, and E17 sits near 6,500 feet. Bare or wet pavement is a go. Falling snow, snow-packed pavement, a traction law, or a closure means you stay the second night, which is already booked.",
    snowGate: {
      checkAt: "Mon Nov 16 at 2:00 PM MST, before you check out",
      sourceName: "UDOT Traffic",
      sourceUrl: "https://udottraffic.utah.gov",
      go: "I-15 from Cedar City to Nephi and US-189 through Provo Canyon are bare or wet, and no snow is forecast for tonight.",
      hold: "Stay in the room. You booked Monday night, so nothing changes but the date. Work Tuesday from the same room, check UDOT again at 2:00 PM, and drive Tuesday after work. Keys slip one day.",
    },
    legs: [
      {
        id: "mon-i15-summit",
        road: "I-15 N",
        from: "St. George",
        to: "Fillmore (exit 167)",
        miles: 163,
        topElevationFt: 6600,
        snowRisk: "watch",
        note: "The snow check of the trip. Cedar City, Beaver, then the 6,600-foot summit before Cove Fort around sunset.",
      },
      {
        id: "mon-utah-valley",
        road: "I-15 N",
        from: "Fillmore",
        to: "Orem (exit 272)",
        miles: 105,
        topElevationFt: 5300,
        snowRisk: "watch",
        note: "Scipio and Nephi in the dark, then down into Utah Valley. Leave I-15 at exit 272 (800 North, Orem) for US-189.",
      },
      {
        id: "mon-provo-canyon",
        road: "US-189 N, US-40 N, I-80 W",
        from: "Orem",
        to: "900 Bitner Road, Apartment E17",
        miles: 48,
        topElevationFt: 6500,
        snowRisk: "watch",
        note: "Up Provo Canyon past Deer Creek Reservoir to Heber, north on US-40 past Jordanelle to I-80, then west to Kimball Junction (exit 145). Watch for deer and elk in the canyon at night.",
      },
    ],
    corridors: [
      {
        id: "provo_canyon",
        label: "I-15 to Orem, US-189 Provo Canyon, US-40, I-80 to Kimball Junction",
        when: "UDOT shows I-15 and US-189 bare or wet. This is the planned road. It skips Salt Lake City traffic and Parleys Summit, and tops out about 6,500 feet at the end.",
        miles: 316,
        driveHours: 5,
      },
      {
        id: "parleys",
        label: "I-15 through Salt Lake City, I-80 E up Parleys Canyon",
        when: "Provo Canyon is closed, has a crash, or is snow-packed while Parleys shows bare or wet. Parleys is a six-lane interstate, lit near the city and plowed first, but it climbs to 7,120 feet.",
        miles: 330,
        driveHours: 5.2,
      },
      {
        id: "hold",
        label: "Stay the second night in St. George",
        when: "I-15 north of Cedar City shows falling snow, snow-packed pavement, a traction law, or a closure at 2:00 PM. You already have the room.",
        miles: 0,
        driveHours: 0,
      },
    ],
    stops: [
      {
        id: "mon-fillmore",
        kind: "rest",
        place: "Fillmore, I-15 exit 167",
        road: "I-15 N exit 167, gas at the ramp",
        purpose:
          "About 2.5 hours out, just after dark. Fuel, a short walk for the cats, and a drive-through dinner. Fillmore was Utah's first territorial capital and is a quiet town of 2,500.",
        minutes: 15,
        clock: "5:40 PM MST",
        realisticUsd: 30,
      },
      {
        id: "mon-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-15 N",
        purpose: "Coffee, packed snacks and water.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
      {
        id: "mon-arrive",
        kind: "meal",
        place: "Kimball Junction",
        road: "After the keys at 900 Bitner Road, Apartment E17",
        purpose: "Cats in first, then a late snack if you skipped dinner in Fillmore.",
        minutes: 20,
        clock: "8:45 PM MST",
        realisticUsd: 20,
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
