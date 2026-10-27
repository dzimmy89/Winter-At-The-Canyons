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

type HubId = "covington" | "kerrville" | "deming" | "kingman";

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
    id: "covington",
    label: "Covington, LA",
    shortLabel: "Covington",
    city: "Covington",
    state: "LA",
    lat: 30.4755,
    lng: -90.1009,
  },
  {
    id: "kerrville",
    label: "Kerrville, TX",
    shortLabel: "Kerrville",
    city: "Kerrville",
    state: "TX",
    lat: 30.0474,
    lng: -99.1403,
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
    toLabel: "Covington, LA",
    departClock: "6:00 AM EST",
    arriveClock: "2:20 PM CST",
    latestSafeDepart: "7:00 AM EST",
    timeZone: "EST to CST",
    miles: 540,
    driveHours: 8.2,
    routeSummary:
      "I-75 N to Lake City, then I-10 W across the Panhandle and the Mississippi coast, and I-12 W along the north shore of Lake Pontchartrain to Covington. Stops: Falling Waters and the Davis Bayou in Ocean Springs. Pensacola and Mobile are drive-throughs. New Orleans stays 30 miles south.",
    hubId: "covington",
    winterNotes:
      "Sea level all day. Snow is not a factor. Covington is a quiet north-shore town, so the evening is a walk on the Mandeville lakefront instead of a city. Clocks go back an hour at the Apalachicola River.",
    snowGate: {
      ...weatherGate,
      checkAt: "Tue Nov 10 night, and again before 6:00 AM EST",
    },
    legs: [
      {
        id: "wed-i75",
        road: "I-75 N",
        from: "4922 NW 81st Ave",
        to: "I-10 at Lake City",
        miles: 45,
        topElevationFt: 200,
        snowRisk: "none",
        note: "Take I-10 W at exit 435. It is the road for most of the next four days.",
      },
      {
        id: "wed-panhandle",
        road: "I-10 W",
        from: "Lake City",
        to: "Chipley (exit 120)",
        miles: 185,
        topElevationFt: 300,
        snowRisk: "none",
        note: "Through Tallahassee on the interstate before the morning rush. Central time starts at the Apalachicola River, near exit 158.",
      },
      {
        id: "wed-coast",
        road: "I-10 W",
        from: "Chipley",
        to: "Ocean Springs, MS (exit 50)",
        miles: 236,
        topElevationFt: 300,
        snowRisk: "none",
        note: "Pensacola and Mobile stay on the interstate, including the Wallace Tunnel under the Mobile River. Fuel in Crestview or Daphne, not in town.",
      },
      {
        id: "wed-north-shore",
        road: "I-10 W, I-12 W",
        from: "Ocean Springs",
        to: "Covington (exit 63)",
        miles: 74,
        topElevationFt: 100,
        snowRisk: "none",
        note: "At Slidell take I-12 W, which keeps New Orleans south of you. Exit 63 to the hotel on the US-190 service road.",
      },
    ],
    stops: [
      {
        id: "wed-falling-waters",
        kind: "rest",
        place: "Falling Waters State Park",
        road: "I-10 W exit 120, then 3 miles south on SR-77 in Chipley",
        purpose:
          "About 3.5 hours out. Florida's tallest waterfall drops 73 feet into a sinkhole, seen from a short boardwalk through the sinkhole forest. Leashed pets are fine on the boardwalk. About $5 to enter. After a dry fall the waterfall can be a trickle, and the sinkholes are still worth the stop.",
        minutes: 30,
        clock: "8:25 AM CST",
        realisticUsd: 5,
      },
      {
        id: "wed-davis-bayou",
        kind: "meal",
        place: "Davis Bayou, Gulf Islands National Seashore",
        road: "I-10 W exit 50, then about 4 miles south through Ocean Springs to the park road",
        purpose:
          "About 3.5 hours after Falling Waters. Pick up lunch at the exit, then eat at the picnic area on a quiet bayou with live oaks and marsh birds. Short boardwalk and a free visitor center. Leash. Ocean Springs is a small, walkable arts town, not a city stop.",
        minutes: 40,
        clock: "12:25 PM CST",
        realisticUsd: 30,
      },
      {
        id: "wed-lakefront",
        kind: "rest",
        place: "Mandeville Lakefront",
        road: "Lakeshore Drive in Mandeville, about 10 minutes from the hotel",
        purpose: "After check-in. A seawall walk on Lake Pontchartrain with the causeway running off to the horizon. Leash.",
        minutes: 40,
        clock: "4:00 PM CST",
        realisticUsd: 0,
      },
      {
        id: "wed-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-75 N / I-10 W",
        purpose: "Packed snacks and water.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 12,
      },
      {
        id: "wed-dinner",
        kind: "meal",
        place: "Covington",
        road: "Downtown Covington, about 10 minutes from 68700 Hwy 190 Service Rd",
        purpose: "Dinner pickup. Louisiana food without the New Orleans crowds. Cats stay with a person.",
        minutes: 30,
        clock: "6:00 PM CST",
        realisticUsd: 50,
      },
    ],
  },
  {
    date: "2026-11-12",
    dateLabel: "Thu Nov 12",
    fromLabel: "Covington, LA",
    toLabel: "Kerrville, TX",
    departClock: "6:00 AM CST",
    arriveClock: "4:30 PM CST",
    latestSafeDepart: "6:30 AM CST",
    timeZone: "CST",
    miles: 605,
    driveHours: 9.1,
    routeSummary:
      "I-12 W and I-10 W across Louisiana over the Atchafalaya Basin, into Texas at Orange, through Houston at midday, and into the Hill Country through San Antonio. Stops: the Texas welcome-center boardwalk, San Felipe de Austin, and Luling barbecue. Baton Rouge, Lafayette, Lake Charles, Houston, and San Antonio are drive-throughs.",
    hubId: "kerrville",
    winterNotes:
      "The longest day, all under 2,000 feet, so snow is not a factor. The 6:00 AM start gets you across the Mississippi in Baton Rouge before most of the rush and into Houston late morning. Kerrville is a small river town in the Hill Country. Watch for deer near dusk.",
    snowGate: {
      ...weatherGate,
      checkAt: "Wed Nov 11 night, and again before 6:00 AM CST",
    },
    legs: [
      {
        id: "thu-louisiana",
        road: "I-12 W, I-10 W",
        from: "Covington",
        to: "Orange, TX (exit 880)",
        miles: 218,
        topElevationFt: 100,
        snowRisk: "none",
        note: "Baton Rouge's Mississippi bridge, then the 18-mile Atchafalaya Basin Bridge with no shoulder. Lafayette and Lake Charles stay on the interstate. Fuel in Sulphur, just before Texas.",
      },
      {
        id: "thu-houston",
        road: "I-10 W",
        from: "Orange",
        to: "San Felipe (exit 723)",
        miles: 157,
        topElevationFt: 150,
        snowRisk: "none",
        note: "Beaumont, then straight through Houston on the Katy Freeway around late morning. No exits inside the city.",
      },
      {
        id: "thu-luling",
        road: "I-10 W, US-183 N",
        from: "San Felipe",
        to: "Luling",
        miles: 102,
        topElevationFt: 500,
        snowRisk: "none",
        note: "Exit 632, then 6 miles north on US-183 into Luling. Look for the painted oil pumpjacks around town.",
      },
      {
        id: "thu-hill-country",
        road: "US-183 S, I-10 W",
        from: "Luling",
        to: "Kerrville (exit 508)",
        miles: 128,
        topElevationFt: 1900,
        snowRisk: "none",
        note: "Back to I-10 and through San Antonio on the interstate, then up into the Hill Country.",
      },
    ],
    stops: [
      {
        id: "thu-orange",
        kind: "rest",
        place: "Texas Travel Information Center, Orange",
        road: "I-10 W exit 880, right after the Sabine River",
        purpose:
          "About 3.3 hours out, at the state line. A boardwalk runs out over a cypress swamp behind the welcome center. Leash, 15 minutes, free.",
        minutes: 20,
        clock: "9:20 AM CST",
        realisticUsd: 0,
      },
      {
        id: "thu-san-felipe",
        kind: "rest",
        place: "San Felipe de Austin State Historic Site",
        road: "I-10 W exit 723, then about 2 miles north on FM 1458",
        purpose:
          "About 2.5 hours later, past Houston. The town Stephen F. Austin founded in 1824, on a bluff above the Brazos. Walk the grounds and the river overlook with the cats.",
        minutes: 20,
        clock: "12:05 PM CST",
        realisticUsd: 0,
      },
      {
        id: "thu-luling",
        kind: "meal",
        place: "City Market, Luling",
        road: "633 E Davis St, about 6 miles north of I-10 exit 632",
        purpose:
          "About 1.5 hours later. One of the classic Central Texas barbecue rooms, in a town of 5,000. One person stays with the cats while the other eats or orders to go.",
        minutes: 45,
        clock: "1:55 PM CST",
        realisticUsd: 45,
      },
      {
        id: "thu-river-trail",
        kind: "rest",
        place: "Kerrville River Trail",
        road: "Louise Hays Park on the Guadalupe River, a few minutes from the hotel",
        purpose: "After check-in, before sunset. A paved walk along the Guadalupe under the cypress trees. Leash.",
        minutes: 30,
        clock: "4:50 PM CST",
        realisticUsd: 0,
      },
      {
        id: "thu-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-12 W / I-10 W",
        purpose: "Packed snacks and water.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 12,
      },
      {
        id: "thu-dinner",
        kind: "meal",
        place: "Kerrville",
        road: "Near 2038 Sidney Baker St, after the walk",
        purpose: "Dinner pickup.",
        minutes: 20,
        clock: "6:00 PM CST",
        realisticUsd: 40,
      },
    ],
  },
  {
    date: "2026-11-13",
    dateLabel: "Fri Nov 13",
    fromLabel: "Kerrville, TX",
    toLabel: "Deming, NM",
    departClock: "7:00 AM CST",
    arriveClock: "3:35 PM MST",
    latestSafeDepart: "7:30 AM CST",
    timeZone: "CST to MST",
    miles: 603,
    driveHours: 8.2,
    routeSummary:
      "I-10 W across West Texas at 80 mph: Junction, Ozona, Fort Stockton, Van Horn, then through El Paso and into New Mexico. Stops: Balmorhea's desert spring pool and the 1850s plaza in Old Mesilla. El Paso and Las Cruces are drive-throughs.",
    hubId: "deming",
    winterNotes:
      "High desert, 1,600 to 4,600 feet, and dry in November. Snow and ice are rare and melt by midday. The real hazards are deer at dawn west of Kerrville and long gaps between gas stations. Clocks go back an hour at the Hudspeth County line, east of El Paso. Deming is a small ranch town off I-10.",
    snowGate: {
      checkAt: "Thu Nov 12 night, and again before 7:00 AM CST",
      sourceName: "DriveTexas",
      sourceUrl: "https://drivetexas.org",
      go: "I-10 from Junction to El Paso shows no ice, closure, or blowing-dust warning.",
      hold: "Wait in Kerrville. West Texas ice is rare and usually gone by late morning, and Deming is still reachable by dark with a 9:00 AM start.",
    },
    legs: [
      {
        id: "fri-west-texas",
        road: "I-10 W, TX-17",
        from: "Kerrville",
        to: "Balmorhea State Park",
        miles: 307,
        topElevationFt: 3300,
        snowRisk: "low",
        note: "80 mph limit and few towns. Fuel in Junction or Ozona and do not let the tank drop below half. Deer are active until the sun is well up. Exit 209 for TX-17.",
      },
      {
        id: "fri-el-paso",
        road: "TX-17, I-10 W",
        from: "Balmorhea State Park",
        to: "Old Mesilla (exit 140)",
        miles: 238,
        topElevationFt: 4600,
        snowRisk: "low",
        note: "Past Van Horn, the highest stretch of the day. Mountain time starts at the Hudspeth County line. Stay on I-10 straight through El Paso, no exits, then into New Mexico.",
      },
      {
        id: "fri-deming",
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
        id: "fri-balmorhea",
        kind: "meal",
        place: "Balmorhea State Park",
        road: "I-10 W exit 209, then about 7 miles on TX-17 through Balmorhea to Toyahvale",
        purpose:
          "About 4 hours out. A clear, spring-fed desert pool full of fish, with the Davis Mountains behind it. Picnic lunch from the cooler. Leashed pets are fine on the grounds, not in the pool. Buy the day pass online from Texas State Parks the night before.",
        minutes: 50,
        clock: "11:00 AM CST",
        realisticUsd: 30,
      },
      {
        id: "fri-mesilla",
        kind: "rest",
        place: "Old Mesilla plaza",
        road: "I-10 W exit 140, then about 2 miles south to the plaza",
        purpose:
          "About 3 hours after Balmorhea. A tiny historic town of adobe shops and the San Albino basilica around an 1850s plaza, next to Las Cruces but its own place. Walk the plaza with the cats and grab red or green chile to go.",
        minutes: 40,
        clock: "2:00 PM MST",
        realisticUsd: 25,
      },
      {
        id: "fri-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-10 W",
        purpose: "Packed snacks and plenty of water. Services are far apart.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
      {
        id: "fri-dinner",
        kind: "meal",
        place: "Deming",
        road: "Near 3751 E Cedar St",
        purpose:
          "Dinner pickup. If there is light left, Rockhound State Park is 15 minutes southeast for a short desert walk at sunset.",
        minutes: 30,
        clock: "5:30 PM MST",
        realisticUsd: 40,
      },
    ],
  },
  {
    date: "2026-11-14",
    dateLabel: "Sat Nov 14",
    fromLabel: "Deming, NM",
    toLabel: "Kingman, AZ",
    departClock: "7:00 AM MST",
    arriveClock: "4:30 PM MST",
    latestSafeDepart: "7:45 AM MST",
    timeZone: "MST (Arizona does not change clocks)",
    miles: 517,
    driveHours: 7.8,
    routeSummary:
      "I-10 W through Lordsburg into Arizona, past Tucson and around Phoenix on Loop 202 and Loop 303 to US-60 and Wickenburg, then US-93 north through the Joshua tree country to Kingman. Stops: the Texas Canyon boulders, Picacho Peak, Wickenburg, and the Burro Creek bridge. Tucson and Phoenix are drive-throughs.",
    hubId: "kingman",
    winterNotes:
      "Sonoran desert, 2,000 to 5,000 feet. Snow is very unlikely. The hazard is blowing dust between Lordsburg and San Simon. If a dust storm hits, pull fully off the road, lights off, foot off the brake. Texas Canyon at about 4,975 feet is the high point of the day. Kingman is a small Route 66 town.",
    snowGate: {
      checkAt: "Fri Nov 13 night, and again before 7:00 AM MST",
      sourceName: "AZ 511",
      sourceUrl: "https://www.az511.gov",
      go: "I-10 from Lordsburg to Willcox has no dust or closure warning, and US-93 north of Wickenburg is open.",
      hold: "Wait in Deming until the dust warning lifts. Kingman is still reachable by dark with a 9:00 AM start.",
    },
    legs: [
      {
        id: "sat-texas-canyon",
        road: "I-10 W",
        from: "Deming",
        to: "Texas Canyon rest area (AZ mile 320)",
        miles: 152,
        topElevationFt: 4975,
        snowRisk: "low",
        note: "Dust-storm zone near the state line. Fuel in Deming before you leave or in Lordsburg.",
      },
      {
        id: "sat-picacho",
        road: "I-10 W",
        from: "Texas Canyon",
        to: "Picacho Peak (exit 219)",
        miles: 101,
        topElevationFt: 4500,
        snowRisk: "none",
        note: "Down through Benson and straight past Tucson on the interstate. No exits in the city.",
      },
      {
        id: "sat-phoenix",
        road: "I-10 W, Loop 202 W, Loop 303 N, US-60 W",
        from: "Picacho Peak",
        to: "Wickenburg",
        miles: 134,
        topElevationFt: 2500,
        snowRisk: "none",
        note: "Saturday traffic is light. Loop 202 (South Mountain Freeway) and Loop 303 keep you out of downtown Phoenix.",
      },
      {
        id: "sat-us93",
        road: "US-93 N",
        from: "Wickenburg",
        to: "Burro Creek bridge",
        miles: 60,
        topElevationFt: 4000,
        snowRisk: "low",
        note: "Joshua Forest Scenic Road. Fuel in Wickenburg first, because services are thin until Kingman.",
      },
      {
        id: "sat-kingman",
        road: "US-93 N, I-40 W",
        from: "Burro Creek bridge",
        to: "Kingman",
        miles: 70,
        topElevationFt: 3600,
        snowRisk: "low",
        note: "Wikieup, then US-93 joins I-40 into Kingman. Divided highway most of the way.",
      },
    ],
    stops: [
      {
        id: "sat-texas-canyon",
        kind: "rest",
        place: "Texas Canyon rest area",
        road: "I-10 W near mile 320, on the highway",
        purpose:
          "About 2.2 hours out. Huge granite boulders piled up beside the interstate. Walk among them with the cats for 15 minutes. The Thing, the kitschy roadside museum at exit 322, is two minutes on if you want it.",
        minutes: 20,
        clock: "9:15 AM MST",
        realisticUsd: 0,
      },
      {
        id: "sat-picacho",
        kind: "rest",
        place: "Picacho Peak State Park",
        road: "I-10 W exit 219, the park road starts at the exit",
        purpose:
          "About 1.5 hours later. A volcanic spire rising out of a forest of saguaro cactus. Drive the park loop and stretch at a picnic stop, leash. About $7 per vehicle.",
        minutes: 25,
        clock: "11:05 AM MST",
        realisticUsd: 7,
      },
      {
        id: "sat-wickenburg",
        kind: "meal",
        place: "Downtown Wickenburg",
        road: "US-60 into town, where it meets US-93",
        purpose:
          "About 2 hours after Picacho. An old Western gold town of 8,000 with a walkable main street, the Jail Tree, and the Hassayampa River. Lunch, then a short walk. Fill the tank here.",
        minutes: 45,
        clock: "1:35 PM MST",
        realisticUsd: 40,
      },
      {
        id: "sat-burro-creek",
        kind: "rest",
        place: "Burro Creek bridge vista",
        road: "US-93 N pullout at the Burro Creek bridge, on the highway",
        purpose: "About an hour after Wickenburg. A tall arch bridge over a desert canyon. Ten minutes at the overlook, leash, then 70 miles to Kingman.",
        minutes: 15,
        clock: "3:20 PM MST",
        realisticUsd: 0,
      },
      {
        id: "sat-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-10 W / US-93 N",
        purpose: "Packed snacks and water.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
      {
        id: "sat-dinner",
        kind: "meal",
        place: "Kingman",
        road: "Historic Route 66 downtown, a few minutes from 1121 Sunrise Ave",
        purpose: "Dinner on Route 66. Fill the tank tonight so Sunday starts full.",
        minutes: 30,
        clock: "6:00 PM MST",
        realisticUsd: 45,
      },
    ],
  },
  {
    date: "2026-11-15",
    dateLabel: "Sun Nov 15",
    fromLabel: "Kingman, AZ",
    toLabel: "900 Bitner Road, Apartment E17",
    departClock: "6:15 AM MST",
    arriveClock: "4:20 PM MST",
    latestSafeDepart: "7:00 AM MST",
    timeZone: "MST, with Nevada an hour behind on Pacific time",
    miles: 528,
    driveHours: 8.3,
    routeSummary:
      "US-93 N over the Hoover Dam bypass bridge, I-11 and I-215 around Las Vegas, I-15 N through the Virgin River Gorge and up Utah to Provo, then US-189 up Provo Canyon and US-40 to I-80 at Kimball Junction. Stops: Hoover Dam, Zion's Kolob Canyons, and Bridal Veil Falls.",
    hubId: null,
    winterNotes:
      "The only day that reaches snow country. I-15 climbs from St. George at 2,800 feet to a 6,600-foot summit between Beaver and Cove Fort, and E17 sits near 6,500 feet. Provo Canyon replaces Parleys Summit at 7,120 feet. Bare or wet pavement is a go. Falling snow, snow-packed pavement, a traction law, or a closure means the St. George hold. Arrive before sunset, about 5:05 PM.",
    snowGate: {
      checkAt: "Sat Nov 14 night, and again at 5:45 AM MST",
      sourceName: "UDOT Traffic",
      sourceUrl: "https://udottraffic.utah.gov",
      go: "I-15 from Cedar City to Nephi and US-189 through Provo Canyon are bare or wet.",
      hold: "Drive to St. George anyway. It is 2,800 feet, almost never snows, and is one of the safest cities in Utah. Check again there. If I-15 north of Cedar City still shows snow, a traction law, or a closure, sleep at the Hampton Inn & Suites St. George and finish Monday morning. Keys slip one day.",
    },
    legs: [
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
        road: "I-11 N, I-215, I-15 N",
        from: "Hoover Dam",
        to: "Kolob Canyons (Utah exit 40)",
        miles: 180,
        topElevationFt: 5300,
        snowRisk: "low",
        note: "The beltway skips the Strip. After Mesquite, I-15 threads the Virgin River Gorge in Arizona, one of the most dramatic stretches of interstate in the country. No stopping in the gorge. Fuel in St. George.",
      },
      {
        id: "sun-cedar",
        road: "I-15 N",
        from: "Kolob Canyons",
        to: "Cedar City (exit 57)",
        miles: 17,
        topElevationFt: 5800,
        snowRisk: "low",
        note: "A short hop to lunch and fuel before the summit.",
      },
      {
        id: "sun-i15-summit",
        road: "I-15 N, US-189 N",
        from: "Cedar City",
        to: "Bridal Veil Falls, Provo Canyon",
        miles: 216,
        topElevationFt: 6600,
        snowRisk: "watch",
        note: "The snow check of the trip. Beaver, then the 6,600-foot summit before Cove Fort, then Fillmore, Nephi, and Provo. Leave I-15 at exit 272 (800 North, Orem) for US-189 into Provo Canyon.",
      },
      {
        id: "sun-provo-canyon",
        road: "US-189 N, US-40 N, I-80 W",
        from: "Provo Canyon",
        to: "900 Bitner Road, Apartment E17",
        miles: 40,
        topElevationFt: 6500,
        snowRisk: "watch",
        note: "Past Deer Creek Reservoir to Heber, north on US-40 past Jordanelle to I-80, then west to Kimball Junction (exit 145).",
      },
    ],
    corridors: [
      {
        id: "provo_canyon",
        label: "I-15 to Provo, US-189 Provo Canyon, US-40, I-80 to Kimball Junction",
        when: "UDOT shows I-15 and US-189 bare or wet. This is the planned road. It skips Salt Lake City traffic and Parleys Summit, and tops out about 6,500 feet at the end.",
        miles: 528,
        driveHours: 8.3,
      },
      {
        id: "parleys",
        label: "I-15 through Salt Lake City, I-80 E up Parleys Canyon",
        when: "Provo Canyon is closed, has a crash, or is snow-packed while Parleys shows bare or wet. Parleys is a six-lane interstate and plowed first, but it climbs to 7,120 feet.",
        miles: 553,
        driveHours: 8.8,
      },
      {
        id: "hold",
        label: "Stay in St. George",
        when: "I-15 north of Cedar City shows falling snow, snow-packed pavement, a traction law, or a closure. The hold night is the last 30,000 points in the bank.",
        miles: 0,
        driveHours: 0,
      },
    ],
    stops: [
      {
        id: "sun-hoover",
        kind: "rest",
        place: "Hoover Dam and the Pat Tillman Memorial Bridge",
        road: "US-93 exit 2 onto the Hoover Dam road, past the security check, to the free bridge-walkway lot",
        purpose:
          "About 1.2 hours out, at sunrise. Walk out on the bypass bridge for the view straight down onto the dam and Lake Mead's canyon. One person walks and one stays with the cats, then trade. Early for a stop, but it is right on the road and hard to beat.",
        minutes: 30,
        clock: "7:25 AM MST (6:25 AM Nevada time)",
        realisticUsd: 0,
      },
      {
        id: "sun-kolob",
        kind: "rest",
        place: "Kolob Canyons, Zion National Park",
        road: "I-15 N exit 40. The visitor center is at the exit, and the 5-mile scenic drive starts there",
        purpose:
          "About 3 hours after Hoover Dam. Red sandstone finger canyons with almost no crowds. Drive to the Timber Creek overlook at about 6,200 feet and back. Pets are allowed in the car and at parking areas, not on trails. Skip the drive if it is snowy and look from the visitor center lot. Zion vehicle pass is about $35, or free with an America the Beautiful pass.",
        minutes: 40,
        clock: "10:35 AM MST",
        realisticUsd: 35,
      },
      {
        id: "sun-cedar-city",
        kind: "meal",
        place: "Cedar City",
        road: "I-15 N exit 57 or 59, 17 miles after Kolob",
        purpose: "Drive-through lunch and fuel before the summit.",
        minutes: 20,
        clock: "11:35 AM MST",
        realisticUsd: 32,
      },
      {
        id: "sun-bridal-veil",
        kind: "rest",
        place: "Bridal Veil Falls",
        road: "US-189 N, about 3 miles up Provo Canyon. Parking lot on the right",
        purpose:
          "About 3.5 hours after Cedar City. A 600-foot double cascade down the canyon wall, a few steps from the car. Leash. Forty minutes from here to the keys.",
        minutes: 20,
        clock: "3:05 PM MST",
        realisticUsd: 0,
      },
      {
        id: "sun-snacks",
        kind: "meal",
        place: "In the car",
        road: "US-93 N / I-15 N",
        purpose: "Packed snacks and water.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
      {
        id: "sun-dinner",
        kind: "meal",
        place: "Kimball Junction",
        road: "After the keys at 900 Bitner Road, Apartment E17",
        purpose: "Dinner.",
        minutes: 30,
        clock: "5:30 PM MST",
        realisticUsd: 50,
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

function pickHotel(properties: HotelNight[], hub: Hub): HotelNight {
  const match =
    properties.find((h) => h.city.toLowerCase() === hub.city.toLowerCase() && h.state === hub.state) ??
    properties.find((h) => h.id === hub.id);
  if (!match || !isStayHotel(match)) {
    return missingCatHilton(hub);
  }
  return { ...match, nights: 1 };
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
    const hotel = draft.hubId ? pickHotel(hotels, hubById(draft.hubId)) : null;
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
    nights: hubs.length,
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
