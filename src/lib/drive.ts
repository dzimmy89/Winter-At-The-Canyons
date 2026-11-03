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

type HubId = "crestview" | "seguin" | "lordsburg" | "st_george";

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
    id: "lordsburg",
    label: "Lordsburg, NM",
    shortLabel: "Lordsburg",
    city: "Lordsburg",
    state: "NM",
    lat: 32.3504,
    lng: -108.7087,
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
    miles: 2777,
    nights: 4,
    highestFt: 6600,
    highestWhere: "I-15 summit between Beaver and Cove Fort, on Sunday morning",
    milesAbove6000: 40,
    verdict:
      "The plan. About 470 more miles, but Wednesday through Saturday stay under 5,000 feet in the driest part of the country in November. Only Sunday morning reaches snow country, and you check the road from the hotel in St. George at 2,800 feet before you leave. Every night is in a smaller town or a quiet suburb.",
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
    toLabel: "Crestview, FL",
    departClock: "5:30 PM EST",
    arriveClock: "9:25 PM CST",
    latestSafeDepart: "7:00 PM EST",
    timeZone: "EST to CST",
    miles: 294,
    driveHours: 4.4,
    routeSummary:
      "After work. I-75 N to Lake City, then I-10 W across the Big Bend and the Panhandle to Crestview. One stop: dinner and fuel at Quincy. Tallahassee is a drive-through. The car is packed the night before, so this is just cats, litter and the cooler.",
    hubId: "crestview",
    winterNotes:
      "Sea level and dark the whole way: sunset in Gainesville is about 5:35 PM EST, right as you leave. I-10 across the Panhandle is wide and well lit at the exits, but long and empty between them, so keep the tank above half. Clocks go back an hour at the Apalachicola River, near exit 158. You reach Crestview about 9:25 PM Central (10:25 PM by your Florida body clock). The hotel is right at I-10 exit 56.",
    snowGate: {
      ...weatherGate,
      checkAt: "Wed Nov 11 afternoon, before you leave work",
      go: "No dense fog or severe storm warning on I-10 from Lake City to Crestview.",
      hold: "Leave up to 90 minutes later. It only moves bedtime, not Thursday.",
    },
    legs: [
      {
        id: "wed-big-bend",
        road: "I-75 N, I-10 W",
        from: "4922 NW 81st Ave",
        to: "Quincy (exit 181)",
        miles: 172,
        topElevationFt: 300,
        snowRisk: "none",
        note: "I-75 N 45 miles to Lake City, then I-10 W, the road for most of the trip. Live Oak, Madison, then Tallahassee on the interstate with no exits.",
      },
      {
        id: "wed-panhandle",
        road: "I-10 W",
        from: "Quincy",
        to: "Crestview",
        miles: 122,
        topElevationFt: 300,
        snowRisk: "none",
        note: "Over the Apalachicola River into Central time, past Marianna, Chipley and DeFuniak Springs to exit 56.",
      },
    ],
    stops: [
      {
        id: "wed-quincy",
        kind: "meal",
        place: "Quincy, Florida",
        road: "I-10 W exit 181 (FL-267). Gas and food at the exit; the historic courthouse square is about 4 miles north",
        purpose:
          "About 2.5 hours out, in the dark. Dinner and fuel. Quincy is the little town that got rich on early Coca-Cola stock, and its story is better than its exit, so this one is mostly for the tank and a stretch.",
        minutes: 30,
        clock: "8:05 PM EST",
        realisticUsd: 30,
      },
      {
        id: "wed-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-75 N / I-10 W",
        purpose: "Coffee for the drive, packed snacks and water.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 8,
      },
    ],
  },
  {
    date: "2026-11-12",
    dateLabel: "Thu Nov 12",
    fromLabel: "Crestview, FL",
    toLabel: "Seguin, TX",
    departClock: "6:00 AM CST",
    arriveClock: "6:50 PM CST",
    latestSafeDepart: "6:30 AM CST",
    timeZone: "CST",
    miles: 720,
    driveHours: 11.4,
    routeSummary:
      "The longest day. I-10 W through Pensacola and Mobile to breakfast at the Davis Bayou, I-12 around New Orleans to lunch in the Atchafalaya swamp, past Lafayette and Beaumont to Buc-ee's in Baytown, then straight through Houston on I-10 and on to Seguin. Pensacola, Mobile, Baton Rouge, Lafayette and Houston are drive-throughs.",
    hubId: "seguin",
    winterNotes:
      "Sea level to 600 feet, so snow is not a factor. Sunrise is about 6:15 AM. The weak spot is Houston: you cross it about 4:00 PM, when the westbound Katy Freeway starts to fill, so the plan already allows 20 extra minutes. The last hour into Seguin is after sunset (about 5:35 PM). Seguin is a quiet river town 35 miles east of San Antonio, and the hotel is just off I-10.",
    snowGate: {
      ...weatherGate,
      checkAt: "Wed Nov 11 night, and again before 6:00 AM CST",
      go: "No dense fog, ice storm or severe storm warning on I-10 or I-12 from Crestview to Houston.",
      hold: "Fog on the coast usually lifts by 8:00 AM. Leave up to 30 minutes later and shorten lunch.",
    },
    legs: [
      {
        id: "thu-coast",
        road: "I-10 W",
        from: "Crestview",
        to: "Ocean Springs, MS (exit 50)",
        miles: 146,
        topElevationFt: 300,
        snowRisk: "none",
        note: "Sunrise over Pensacola Bay. Through Mobile on the interstate, including the Wallace Tunnel under the Mobile River, and into Mississippi.",
      },
      {
        id: "thu-louisiana",
        road: "I-10 W, I-12 W, I-10 W",
        from: "Ocean Springs",
        to: "Atchafalaya Welcome Center (exit 121)",
        miles: 184,
        topElevationFt: 100,
        snowRisk: "none",
        note: "I-12 at Slidell keeps New Orleans 30 miles south. Baton Rouge's Mississippi River bridge, then onto the 18-mile Atchafalaya Basin Bridge to the welcome center halfway across.",
      },
      {
        id: "thu-texas-line",
        road: "I-10 W",
        from: "Atchafalaya",
        to: "Buc-ee's, Baytown, TX",
        miles: 208,
        topElevationFt: 100,
        snowRisk: "none",
        note: "Lafayette, Lake Charles and the Calcasieu River bridge, the Sabine River into Texas at Orange, then Beaumont and the rice country past Winnie.",
      },
      {
        id: "thu-houston",
        road: "I-10 W",
        from: "Baytown",
        to: "Seguin",
        miles: 182,
        topElevationFt: 600,
        snowRisk: "none",
        note: "Straight through Houston on I-10, the Katy Freeway, with no exits inside the city. Then Katy, Sealy, Columbus and Schulenburg, and the last hour in the dark past Luling.",
      },
    ],
    stops: [
      {
        id: "thu-davis-bayou",
        kind: "meal",
        place: "Davis Bayou, Gulf Islands National Seashore",
        road: "I-10 W exit 50, then about 4 miles south through Ocean Springs to the park road",
        purpose:
          "About 2 hours 15 minutes out. A quiet bayou with live oaks and marsh birds in the morning light. Breakfast from the cooler at a picnic table under the moss, and a short boardwalk. Free.",
        minutes: 25,
        clock: "8:15 AM CST",
        realisticUsd: 15,
      },
      {
        id: "thu-atchafalaya",
        kind: "meal",
        place: "Atchafalaya Welcome Center",
        road: "I-10 W exit 121 at Butte La Rose, in the middle of the basin bridge",
        purpose:
          "About 2 hours 50 minutes later. A Louisiana welcome center in the middle of America's largest river swamp, with a short nature walk among the cypress. Picnic lunch from the cooler. Free.",
        minutes: 35,
        clock: "11:30 AM CST",
        realisticUsd: 25,
      },
      {
        id: "thu-baytown",
        kind: "rest",
        place: "Buc-ee's, Baytown",
        road: "I-10 W in Baytown, about exit 790. The beaver billboards count down to it",
        purpose:
          "About 3 hours 10 minutes later. The Texas road-trip institution: dozens of gas pumps, famously clean restrooms, brisket sandwiches carved at the counter, and a wall of jerky. Fuel and snacks before Houston.",
        minutes: 25,
        clock: "3:15 PM CST",
        realisticUsd: 25,
      },
      {
        id: "thu-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-10 W",
        purpose: "Coffee and something to go from the Crestview hotel, packed snacks and water.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
      {
        id: "thu-dinner",
        kind: "meal",
        place: "Seguin",
        road: "Near the hotel, after check-in",
        purpose: "Dinner pickup and an early night. Friday leaves at 6:00 AM.",
        minutes: 30,
        clock: "7:15 PM CST",
        realisticUsd: 35,
      },
    ],
  },
  {
    date: "2026-11-13",
    dateLabel: "Fri Nov 13",
    fromLabel: "Seguin, TX",
    toLabel: "Lordsburg, NM",
    departClock: "6:00 AM CST",
    arriveClock: "5:15 PM MST",
    latestSafeDepart: "6:15 AM CST",
    timeZone: "CST to MST",
    miles: 757,
    driveHours: 10.9,
    routeSummary:
      "I-10 W through San Antonio before the rush, up into the Hill Country to Junction, across West Texas at 80 mph to lunch in Fort Stockton, through Van Horn and El Paso to Old Mesilla, then past Deming to Lordsburg. San Antonio, El Paso and Las Cruces are drive-throughs.",
    hubId: "lordsburg",
    winterNotes:
      "Climbs from 500 feet to about 4,500, dry in November. Snow and ice are rare and melt by midday. Deer are thick in the Hill Country around dawn, so the first hour is the time to watch. Clocks go back an hour at the Hudspeth County line west of Van Horn. You reach Lordsburg right around sunset (about 5:05 PM MST). Lordsburg is a small railroad and ranching town, and the hotel is just off I-10.",
    snowGate: {
      checkAt: "Thu Nov 12 night, and again before 6:00 AM CST",
      sourceName: "DriveTexas",
      sourceUrl: "https://drivetexas.org",
      go: "I-10 from San Antonio to El Paso is open with no ice or closure.",
      hold: "West Texas ice melts by late morning. Wait in Seguin or Junction and shorten the Fort Stockton lunch.",
    },
    legs: [
      {
        id: "fri-hill-country",
        road: "I-10 W",
        from: "Seguin",
        to: "Junction (exit 456)",
        miles: 155,
        topElevationFt: 2200,
        snowRisk: "low",
        note: "Through San Antonio at 6:30 AM, ahead of the rush. Then northwest into the Hill Country past Boerne, Comfort and Kerrville as the sun comes up.",
      },
      {
        id: "fri-west-texas",
        road: "I-10 W",
        from: "Junction",
        to: "Fort Stockton (exit 257)",
        miles: 202,
        topElevationFt: 2700,
        snowRisk: "low",
        note: "Sonora and Ozona. The limit is 80 mph and towns are 60 to 100 miles apart.",
      },
      {
        id: "fri-el-paso",
        road: "I-10 W",
        from: "Fort Stockton",
        to: "Old Mesilla (exit 140)",
        miles: 281,
        topElevationFt: 4600,
        snowRisk: "low",
        note: "Past Balmorhea with the Davis Mountains to the south, and Van Horn. Mountain time starts at the Hudspeth County line. Stay on I-10 straight through El Paso, no exits, then into New Mexico.",
      },
      {
        id: "fri-lordsburg",
        road: "I-10 W",
        from: "Old Mesilla",
        to: "Lordsburg",
        miles: 119,
        topElevationFt: 4600,
        snowRisk: "low",
        note: "West across the open Chihuahuan Desert, past Deming and the Florida Mountains, into the sunset to Lordsburg.",
      },
    ],
    stops: [
      {
        id: "fri-junction",
        kind: "rest",
        place: "Junction and the South Llano River",
        road: "I-10 W exit 456, then 5 minutes south on US-377 to South Llano River State Park. Gas at the ramp",
        purpose:
          "About 2 hours 20 minutes out. Fill the tank and stretch under the pecans by a clear Hill Country river where two forks of the Llano meet. Leash.",
        minutes: 15,
        clock: "8:20 AM CST",
        realisticUsd: 10,
      },
      {
        id: "fri-fort-stockton",
        kind: "meal",
        place: "Fort Stockton",
        road: "I-10 W exit 257, gas at the ramp. Paisano Pete is two minutes off the exit on Dickinson Boulevard",
        purpose:
          "About 2 hours 50 minutes later. Lunch, fuel, and a photo with Paisano Pete, the town's 11-foot roadrunner. The next good services are in Van Horn.",
        minutes: 35,
        clock: "11:25 AM CST",
        realisticUsd: 30,
      },
      {
        id: "fri-mesilla",
        kind: "rest",
        place: "Old Mesilla plaza",
        road: "I-10 W exit 140, then about 2 miles south to the plaza",
        purpose:
          "About 3 hours 55 minutes later, after El Paso. A tiny historic town of adobe shops and the San Albino basilica around an 1850s plaza. A walk around the plaza and a green-chile snack.",
        minutes: 30,
        clock: "2:55 PM MST",
        realisticUsd: 15,
      },
      {
        id: "fri-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-10 W",
        purpose: "Breakfast to go from the Seguin hotel, packed snacks and plenty of water. Services are far apart west of Junction.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
      {
        id: "fri-dinner",
        kind: "meal",
        place: "Lordsburg",
        road: "Near 412 W Wabash St, after check-in",
        purpose: "Dinner pickup, fill the tank, and an early night. Saturday leaves at 6:00 AM.",
        minutes: 30,
        clock: "5:45 PM MST",
        realisticUsd: 35,
      },
    ],
  },
  {
    date: "2026-11-14",
    dateLabel: "Sat Nov 14",
    fromLabel: "Lordsburg, NM",
    toLabel: "St. George, UT",
    departClock: "6:00 AM MST",
    arriveClock: "5:45 PM MST",
    latestSafeDepart: "6:30 AM MST",
    timeZone: "MST, with Nevada an hour behind on Pacific time",
    miles: 690,
    driveHours: 10.5,
    routeSummary:
      "I-10 W into Arizona past Willcox and Tucson to Picacho Peak, around Phoenix on Loop 202 and Loop 303, US-60 to Wickenburg, US-93 north through the Joshua tree country and past Kingman to Hoover Dam, then I-11, I-215 and I-15 past Las Vegas and through the Virgin River Gorge to St. George. Stops: Picacho Peak, lunch in Wickenburg, and the Hoover Dam bridge. Tucson, Phoenix, Kingman and Las Vegas are drive-throughs.",
    hubId: "st_george",
    winterNotes:
      "Desert all day, 1,000 to 4,500 feet. Snow is very rare on this route. Blowing dust between Lordsburg and San Simon is the hazard in the first hour, and wind can close US-93 at Hoover Dam for an hour or two. The first 45 minutes are before sunrise (about 6:45 AM). Nevada is on Pacific time, an hour behind Arizona and Utah. The Virgin River Gorge comes around sunset (about 5:10 PM in St. George), so the last 30 minutes are at dusk. St. George sits at 2,800 feet in Utah's warm southwest corner.",
    snowGate: {
      checkAt: "Fri Nov 13 night, and again before 6:00 AM MST",
      sourceName: "AZ 511",
      sourceUrl: "https://www.az511.gov",
      go: "I-10 from Lordsburg to Willcox has no dust warning, US-93 from Wickenburg to Hoover Dam has no wind closure, and I-15 through the Virgin River Gorge is open.",
      hold: "Wait in Lordsburg until a dust warning lifts, or in Kingman for a wind closure. If Saturday runs more than an hour late, skip the Hoover Dam stop.",
    },
    legs: [
      {
        id: "sat-picacho",
        road: "I-10 W",
        from: "Lordsburg",
        to: "Picacho Peak (exit 219)",
        miles: 195,
        topElevationFt: 4975,
        snowRisk: "low",
        note: "Into Arizona at first light past San Simon, Willcox and the Texas Canyon boulders, down through Benson, then straight past Tucson with no exits in the city.",
      },
      {
        id: "sat-phoenix",
        road: "I-10 W, Loop 202 W, Loop 303 N, US-60 W",
        from: "Picacho Peak",
        to: "Wickenburg",
        miles: 138,
        topElevationFt: 2500,
        snowRisk: "none",
        note: "Past Casa Grande, then Loop 202 (South Mountain Freeway) and Loop 303 keep you out of downtown Phoenix. US-60 northwest into Wickenburg.",
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
        id: "sat-picacho",
        kind: "rest",
        place: "Picacho Peak State Park",
        road: "I-10 W exit 219, then a few hundred yards to the park entrance. Small vehicle fee",
        purpose:
          "About 2 hours 55 minutes out. A volcanic spike rising 1,500 feet straight out of the desert, and the site of the westernmost Civil War battle. A short walk among the saguaros near the visitor center.",
        minutes: 20,
        clock: "8:55 AM MST",
        realisticUsd: 10,
      },
      {
        id: "sat-wickenburg",
        kind: "meal",
        place: "Downtown Wickenburg",
        road: "US-60 into town, where it meets US-93",
        purpose: "About 2 hours later. An old Western gold town with the Jail Tree on its main street. Lunch, a walk down the main street, and fill the tank before US-93.",
        minutes: 35,
        clock: "11:20 AM MST",
        realisticUsd: 30,
      },
      {
        id: "sat-hoover",
        kind: "rest",
        place: "Hoover Dam and the Memorial Bridge",
        road: "Over the bridge into Nevada, then exit 2 (Hoover Dam) and about 2 miles down the dam road to the bridge parking lot. There may be a quick security check",
        purpose:
          "About 3 hours 10 minutes later. Walk out onto the bridge 900 feet above the Colorado River for the classic view straight down onto Hoover Dam, then a snack at the car.",
        minutes: 20,
        clock: "3:05 PM MST",
        realisticUsd: 5,
      },
      {
        id: "sat-snacks",
        kind: "meal",
        place: "In the car",
        road: "US-93 N / I-15 N",
        purpose: "Breakfast to go from the Lordsburg hotel, packed snacks and plenty of water.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
      {
        id: "sat-dinner",
        kind: "meal",
        place: "St. George",
        road: "Near 1731 S Convention Center Dr",
        purpose:
          "Dinner and fill the tank. Read tomorrow's forecast for I-15 and Provo Canyon, and text the landlord your planned 1:15 PM arrival.",
        minutes: 40,
        clock: "6:15 PM MST",
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
      "Keys by 2:00 PM. I-15 N past Cedar City over the 6,600-foot summit in daylight, the Territorial Statehouse in Fillmore, then Utah Valley, US-189 up Provo Canyon and US-40 to I-80 at Kimball Junction. Stop: Utah's first capitol building in Fillmore.",
    hubId: null,
    winterNotes:
      "The only day in snow country. You check UDOT at the hotel at 7:30 AM, in St. George at 2,800 feet, before you commit. I-15 climbs to a 6,600-foot summit between Beaver and Cove Fort, which you reach around 9:45 AM in full daylight, and E17 sits near 6,500 feet. Bare or wet pavement is a go. Falling snow, snow-packed pavement, a traction law, or a closure means you stay another night at the Hilton Garden Inn and move the key time. The plan arrives about 1:15 PM, 45 minutes before the 2:00 PM limit.",
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
