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

type HubId = "daphne" | "sulphur" | "fort_stockton" | "goodyear";

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
    id: "daphne",
    label: "Daphne, AL",
    shortLabel: "Daphne",
    city: "Daphne",
    state: "AL",
    lat: 30.6035,
    lng: -87.9036,
  },
  {
    id: "sulphur",
    label: "Sulphur, LA",
    shortLabel: "Sulphur",
    city: "Sulphur",
    state: "LA",
    lat: 30.2366,
    lng: -93.3774,
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
    id: "goodyear",
    label: "Goodyear, AZ",
    shortLabel: "Goodyear",
    city: "Goodyear",
    state: "AZ",
    lat: 33.4353,
    lng: -112.3577,
  },
];

// Why the southern corridor: both options side by side. Elevations are rounded highway figures.
export const routeOptions: RouteOption[] = [
  {
    id: "southern",
    label: "Southern: I-10 to Phoenix, US-93 to Las Vegas, I-15 up Utah",
    miles: 2780,
    nights: 4,
    highestFt: 6600,
    highestWhere: "I-15 summit between Beaver and Cove Fort, on Sunday afternoon",
    milesAbove6000: 40,
    verdict:
      "The plan. About 480 more miles and one more night, but Wednesday through Saturday stay under 5,000 feet in the driest part of the country in November. Only Sunday afternoon reaches snow country, and it passes a low-altitude hold in St. George at lunch. Every night is in a smaller town.",
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
    date: "2026-11-11",
    dateLabel: "Wed Nov 11",
    fromLabel: "Gainesville, FL",
    toLabel: "Daphne, AL",
    departClock: "4:00 PM EST",
    arriveClock: "9:15 PM CST",
    latestSafeDepart: "5:00 PM EST",
    timeZone: "EST to CST",
    miles: 379,
    driveHours: 5.7,
    routeSummary:
      "A workday at home, then the evening run: I-75 N to Lake City and I-10 W across the Big Bend, the Panhandle and Pensacola to Daphne on Mobile Bay. One dinner and fuel stop in Marianna. Tallahassee and Pensacola are drive-throughs.",
    hubId: "daphne",
    work: {
      where: "At home, 4922 NW 81st Ave",
      hours: "Your normal day, until 4:00 PM EST",
      notes: [
        "Pack the car Tuesday night so only the cats, the litter box, the cooler and your work bag go in after work.",
        "Cats in their carriers by 3:45 PM. Leave by 4:00.",
      ],
    },
    winterNotes:
      "Sea level and dry, so snow is not a factor. The first hour and a half is in daylight. Sunset is about 5:35 PM EST, so the Big Bend and the Panhandle are after dark. Watch for deer on the rural stretches and for drowsiness after a full workday. Clocks go back an hour at the Apalachicola River, near exit 158. Daphne is a small town on the east shore of Mobile Bay, and the hotel is at I-10 exit 35.",
    snowGate: {
      ...weatherGate,
      checkAt: "Wed Nov 11 at lunch, and again before 4:00 PM EST",
      hold: "Leave an hour later, or stop early in Crestview. Thursday's workday keeps you in the hotel anyway, so nothing is lost.",
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
        id: "wed-big-bend",
        road: "I-10 W",
        from: "Lake City",
        to: "Marianna (exit 142)",
        miles: 161,
        topElevationFt: 300,
        snowRisk: "none",
        note: "Rural and straight, dark after Madison. Tallahassee is about an hour in, on the interstate. Central time starts at the Apalachicola River, just before Marianna.",
      },
      {
        id: "wed-panhandle",
        road: "I-10 W",
        from: "Marianna",
        to: "Daphne (exit 35)",
        miles: 173,
        topElevationFt: 300,
        snowRisk: "none",
        note: "Past Chipley, DeFuniak Springs and Crestview, through Pensacola on the interstate, and into Alabama. The Hilton Garden Inn is on North Main Street at exit 35.",
      },
    ],
    stops: [
      {
        id: "wed-marianna",
        kind: "meal",
        place: "Marianna, I-10 exit 142",
        road: "I-10 W exit 142 (SR-71), gas and food at the ramp",
        purpose:
          "About 3 hours out. Fuel and a quick dinner at the exit. One person stays with the cats. Ten minutes of walking around the lot keeps you awake for the last 2.5 hours.",
        minutes: 30,
        clock: "6:05 PM CST",
        realisticUsd: 35,
      },
      {
        id: "wed-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-75 N / I-10 W",
        purpose: "Coffee, packed snacks and water. Put Thursday's lunch fixings in the cooler, since you eat at your desk.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
    ],
  },
  {
    date: "2026-11-12",
    dateLabel: "Thu Nov 12",
    fromLabel: "Daphne, AL",
    toLabel: "Sulphur, LA",
    departClock: "3:10 PM CST",
    arriveClock: "9:05 PM CST",
    latestSafeDepart: "4:00 PM CST",
    timeZone: "CST",
    miles: 340,
    driveHours: 5.2,
    routeSummary:
      "A workday in the Daphne hotel room, then the evening run: I-10 W through the Wallace Tunnel and along the Mississippi coast, I-12 W around New Orleans to Baton Rouge, and I-10 W across the Atchafalaya Basin to Sulphur. A welcome-center stretch at the Mississippi line and dinner in Hammond. Mobile, Baton Rouge, Lafayette and Lake Charles are drive-throughs.",
    hubId: "sulphur",
    work: {
      where: "Hilton Garden Inn Mobile East Bay / Daphne, in your room",
      hours: "7:00 AM to 3:00 PM CST (8 to 4 Eastern)",
      notes: [
        "Hilton's listings say pets cannot be left alone in the room. So the plan is to work at the room desk with the cats beside you, not in the business center while they wait upstairs.",
        "Checkout is noon. Ask for a 3:00 PM late checkout when you book, again at check-in Wednesday night, and in the Hilton Honors app. Hilton says late checkout depends on availability, so get a yes before Thursday.",
        "If the desk can't promise 3 PM, add Thursday night to the booking. Your points cover it, and the room is yours all day.",
        "The hotel has a 24-hour business center and four meeting rooms. Use them for printing, or as a quiet room for a call while one person stays with the cats.",
        "Rooms have a desk and free Wi-Fi and wired internet. Keep your phone hotspot ready as a backup. Load the car at 2:45 and check out at 3:00.",
      ],
    },
    winterNotes:
      "Under 100 feet all evening, so snow is not a factor. Sunset is about 4:55 PM, so everything past the Mississippi coast is in the dark, including the 18-mile Atchafalaya Basin Bridge, which has no shoulder. Hold the speed limit there. Baton Rouge comes around 7:00 PM, after its rush. Sulphur is a small town just west of Lake Charles, and the hotel is at I-10 exit 20.",
    snowGate: {
      ...weatherGate,
      checkAt: "Thu Nov 12 at noon, and again at 3:00 PM CST",
      go: "No winter storm, ice storm, or dense fog warning on I-10 or I-12 from Mobile to Lake Charles.",
      hold: "Keep working and leave an hour or two later. Friday is your day off, so a late arrival in Sulphur costs nothing.",
    },
    legs: [
      {
        id: "thu-mobile-bay",
        road: "I-10 W",
        from: "Daphne",
        to: "Mississippi Welcome Center (MS mile 75)",
        miles: 37,
        topElevationFt: 100,
        snowRisk: "none",
        note: "Across the Mobile Bay causeway and through the Wallace Tunnel, still in daylight. The welcome center is just past the state line.",
      },
      {
        id: "thu-gulf-coast",
        road: "I-10 W, I-12 W",
        from: "Mississippi Welcome Center",
        to: "Hammond (I-12 exit 40)",
        miles: 124,
        topElevationFt: 100,
        snowRisk: "none",
        note: "Past Pascagoula, Biloxi and Gulfport at dusk. At Slidell, I-12 keeps New Orleans 30 miles south.",
      },
      {
        id: "thu-cajun",
        road: "I-12 W, I-10 W",
        from: "Hammond",
        to: "Sulphur (exit 20)",
        miles: 179,
        topElevationFt: 100,
        snowRisk: "none",
        note: "Baton Rouge and the Mississippi River bridge, then the Atchafalaya Basin Bridge, Lafayette and Lake Charles, all in the dark.",
      },
    ],
    stops: [
      {
        id: "thu-ms-welcome",
        kind: "rest",
        place: "Mississippi Welcome Center",
        road: "I-10 W near mile 75, right after the Alabama line, on the highway",
        purpose:
          "About 35 minutes out, while it is still light. A stretch after eight hours at a desk, restrooms, and a minute on the grass for the cats on a leash.",
        minutes: 10,
        clock: "3:45 PM CST",
        realisticUsd: 0,
      },
      {
        id: "thu-hammond",
        kind: "meal",
        place: "Hammond, I-12 exit 40",
        road: "I-12 W exit 40 (US-51), gas and food at the ramp",
        purpose:
          "About 2 hours later. Fuel and dinner. Hammond is a small college town, and the exit has plenty of quick, well-lit options. One person stays with the cats.",
        minutes: 30,
        clock: "5:50 PM CST",
        realisticUsd: 35,
      },
      {
        id: "thu-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-10 W / I-12 W",
        purpose: "Coffee, packed snacks and water. Restock the cooler in Sulphur for Friday's lunch.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
    ],
  },
  {
    date: "2026-11-13",
    dateLabel: "Fri Nov 13",
    fromLabel: "Sulphur, LA",
    toLabel: "Fort Stockton, TX",
    departClock: "6:50 AM CST",
    arriveClock: "5:55 PM CST",
    latestSafeDepart: "7:30 AM CST",
    timeZone: "CST",
    miles: 646,
    driveHours: 9.6,
    routeSummary:
      "Your day off. I-10 W into Texas at Orange, through Houston after the morning rush, past San Felipe de Austin to lunch in Seguin, around San Antonio, up into the Hill Country, and across the Edwards Plateau at 80 mph to Fort Stockton. Stops: the Texas welcome center boardwalk, San Felipe de Austin, downtown Seguin, and Junction. Beaumont, Houston and San Antonio are drive-throughs.",
    hubId: "fort_stockton",
    winterNotes:
      "Sea level to about 3,000 feet and dry, so snow is very unlikely. Houston comes around 9:00 AM, at the tail of the Friday rush, so allow an extra 30 minutes. Deer are thick in the Hill Country, and you arrive in Fort Stockton right around sunset (about 5:50 PM). Services thin out west of Junction, so fill up there. Fort Stockton is a small ranch town of 8,000 on I-10.",
    snowGate: {
      checkAt: "Thu Nov 12 night, and again before 6:50 AM CST",
      sourceName: "DriveTexas",
      sourceUrl: "https://drivetexas.org",
      go: "No ice, closure, or dense fog warning on I-10 from Orange to Fort Stockton.",
      hold: "Wait in Sulphur. West Texas ice is rare and melts by late morning, and an 8:30 AM start still reaches Fort Stockton by about 7:30 PM.",
    },
    legs: [
      {
        id: "fri-sabine",
        road: "I-10 W",
        from: "Sulphur",
        to: "Texas welcome center, Orange (exit 880)",
        miles: 22,
        topElevationFt: 50,
        snowRisk: "none",
        note: "Twenty minutes to the Sabine River and Texas, just after sunrise.",
      },
      {
        id: "fri-houston",
        road: "I-10 W",
        from: "Orange",
        to: "San Felipe (exit 723)",
        miles: 157,
        topElevationFt: 150,
        snowRisk: "none",
        note: "Beaumont, then straight through Houston on the Katy Freeway around 9:00 AM. No exits inside the city.",
      },
      {
        id: "fri-seguin",
        road: "I-10 W",
        from: "San Felipe",
        to: "Seguin (exit 610)",
        miles: 113,
        topElevationFt: 600,
        snowRisk: "none",
        note: "Past Sealy, Columbus, Schulenburg and Luling. Exit 610 into Seguin for lunch.",
      },
      {
        id: "fri-hill-country",
        road: "I-10 W",
        from: "Seguin",
        to: "Junction (exit 456)",
        miles: 154,
        topElevationFt: 2200,
        snowRisk: "none",
        note: "Through San Antonio in the early afternoon, then up past Boerne and Kerrville into the Hill Country.",
      },
      {
        id: "fri-west-texas",
        road: "I-10 W",
        from: "Junction",
        to: "Fort Stockton (exit 256)",
        miles: 200,
        topElevationFt: 3000,
        snowRisk: "low",
        note: "80 mph and few towns: Sonora and Ozona. The hotel is on the I-10 frontage road at the west end of town.",
      },
    ],
    stops: [
      {
        id: "fri-orange",
        kind: "rest",
        place: "Texas Travel Information Center, Orange",
        road: "I-10 W exit 880, right after the Sabine River",
        purpose: "About 20 minutes out, in the early light. A boardwalk runs out over a cypress swamp behind the building, and the birds are up. Leash, free.",
        minutes: 15,
        clock: "7:10 AM CST",
        realisticUsd: 0,
      },
      {
        id: "fri-san-felipe",
        kind: "rest",
        place: "San Felipe de Austin State Historic Site",
        road: "I-10 W exit 723, then about 2 miles north on FM 1458",
        purpose:
          "About 2.5 hours later, just past Houston. The town Stephen F. Austin founded in 1824, on a bluff above the Brazos. Walk the grounds and the river overlook with the cats.",
        minutes: 15,
        clock: "9:55 AM CST",
        realisticUsd: 0,
      },
      {
        id: "fri-seguin",
        kind: "meal",
        place: "Downtown Seguin",
        road: "I-10 W exit 610, then about 2 miles south to the courthouse square",
        purpose:
          "About 1 hour 45 minutes later. A small river town with a courthouse square, old pecan trees and a giant pecan statue. Picnic lunch from the cooler in Central Park, or takeout. Leash.",
        minutes: 45,
        clock: "11:55 AM CST",
        realisticUsd: 30,
      },
      {
        id: "fri-junction",
        kind: "rest",
        place: "Junction",
        road: "I-10 W exit 456, gas and food at the ramp",
        purpose:
          "About 2 hours 20 minutes later. Fill the tank in a small Hill Country town where two forks of the Llano River meet. South Llano River State Park is 5 minutes south if you want a short river walk.",
        minutes: 15,
        clock: "3:00 PM CST",
        realisticUsd: 5,
      },
      {
        id: "fri-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-10 W",
        purpose: "Packed snacks and plenty of water. Services are far apart after Junction.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 12,
      },
      {
        id: "fri-dinner",
        kind: "meal",
        place: "Fort Stockton",
        road: "Near 2271 W I-10, after check-in",
        purpose:
          "Dinner pickup. Fill the tank tonight and buy the Balmorhea day pass online, because Saturday starts early.",
        minutes: 30,
        clock: "6:15 PM CST",
        realisticUsd: 40,
      },
    ],
  },
  {
    date: "2026-11-14",
    dateLabel: "Sat Nov 14",
    fromLabel: "Fort Stockton, TX",
    toLabel: "Goodyear, AZ",
    departClock: "7:15 AM CST",
    arriveClock: "5:40 PM MST",
    latestSafeDepart: "7:45 AM CST",
    timeZone: "CST to MST",
    miles: 692,
    driveHours: 10,
    routeSummary:
      "I-10 W across the high desert: Balmorhea, Van Horn, through El Paso and into New Mexico, then Deming, Lordsburg, into Arizona, past Tucson, and around Phoenix on Loop 202 to Goodyear. Stops: Balmorhea's desert spring pool, the plaza in Old Mesilla, and the Texas Canyon boulders. El Paso, Las Cruces, Tucson and Phoenix are drive-throughs.",
    hubId: "goodyear",
    winterNotes:
      "High desert, 1,000 to 5,000 feet, and dry in November. Snow and ice are rare and melt by midday. Blowing dust between Lordsburg and San Simon is the real hazard. Never let the tank drop below half, because towns are far apart. Clocks go back an hour west of Van Horn. You reach Goodyear just after sunset (about 5:25 PM). It sits on the far west edge of metro Phoenix, right at Sunday's Loop 303 turn.",
    snowGate: {
      checkAt: "Fri Nov 13 night, and again before 7:15 AM CST",
      sourceName: "DriveTexas",
      sourceUrl: "https://drivetexas.org",
      go: "I-10 from Fort Stockton to El Paso shows no ice or closure, and AZ 511 shows no dust warning near the state line.",
      hold: "Wait in Fort Stockton until it clears. A late start means Phoenix after dark, so drop the Texas Canyon stop to make it up.",
    },
    legs: [
      {
        id: "sat-balmorhea",
        road: "I-10 W, TX-17",
        from: "Fort Stockton",
        to: "Balmorhea State Park",
        miles: 54,
        topElevationFt: 3300,
        snowRisk: "low",
        note: "Leave at sunrise. Deer and pronghorn are out. Exit 209 for TX-17 through Balmorhea to Toyahvale.",
      },
      {
        id: "sat-el-paso",
        road: "TX-17, I-10 W",
        from: "Balmorhea State Park",
        to: "Old Mesilla (exit 140)",
        miles: 236,
        topElevationFt: 4600,
        snowRisk: "low",
        note: "Past Van Horn, the highest stretch of Texas. Mountain time starts at the Hudspeth County line. Stay on I-10 straight through El Paso, no exits, then into New Mexico.",
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
        road: "I-10 W, Loop 202 W, I-10 W",
        from: "Texas Canyon",
        to: "Goodyear (exit 128)",
        miles: 192,
        topElevationFt: 4500,
        snowRisk: "none",
        note: "Down through Benson and past Tucson on the interstate. Loop 202 (South Mountain Freeway) skips downtown Phoenix. The hotel is on Litchfield Road at exit 128.",
      },
    ],
    stops: [
      {
        id: "sat-balmorhea",
        kind: "rest",
        place: "Balmorhea State Park",
        road: "I-10 W exit 209, then about 7 miles on TX-17 through Balmorhea to Toyahvale",
        purpose:
          "About 50 minutes out. A clear, spring-fed desert pool full of fish, with the Davis Mountains behind it and steam on the water in the cool morning. Leashed pets are fine on the grounds, not in the pool. Buy the day pass online from Texas State Parks the night before.",
        minutes: 20,
        clock: "8:05 AM CST",
        realisticUsd: 10,
      },
      {
        id: "sat-mesilla",
        kind: "meal",
        place: "Old Mesilla plaza",
        road: "I-10 W exit 140, then about 2 miles south to the plaza",
        purpose:
          "About 3 hours 20 minutes later. A tiny historic town of adobe shops and the San Albino basilica around an 1850s plaza, next to Las Cruces but its own place. Lunch with red or green chile to go, and a walk around the plaza with the cats.",
        minutes: 40,
        clock: "10:45 AM MST",
        realisticUsd: 40,
      },
      {
        id: "sat-texas-canyon",
        kind: "rest",
        place: "Texas Canyon rest area",
        road: "I-10 W near mile 320, on the highway",
        purpose:
          "About 3 hours later. Huge granite boulders piled up beside the interstate. Walk among them with the cats for 15 minutes.",
        minutes: 15,
        clock: "2:25 PM MST",
        realisticUsd: 0,
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
        place: "Goodyear",
        road: "Near 2000 N Litchfield Rd, after check-in",
        purpose:
          "Dinner pickup, and fill the tank tonight. Sunday is the longest day and starts at 5:45 AM, so set out tomorrow's clothes, coffee and cat food before bed.",
        minutes: 30,
        clock: "6:00 PM MST",
        realisticUsd: 40,
      },
    ],
  },
  {
    date: "2026-11-15",
    dateLabel: "Sun Nov 15",
    fromLabel: "Goodyear, AZ",
    toLabel: "900 Bitner Road, Apartment E17",
    departClock: "5:45 AM MST",
    arriveClock: "7:00 PM MST",
    latestSafeDepart: "6:15 AM MST",
    timeZone: "MST, with Nevada an hour behind on Pacific time",
    miles: 723,
    driveHours: 11.5,
    routeSummary:
      "The longest day. Loop 303 and US-60 to Wickenburg, US-93 north through the Joshua tree country to Kingman and over the Hoover Dam bridge, I-11, I-215 and I-15 past Las Vegas and through the Virgin River Gorge in daylight to lunch in St. George. Then I-15 N past Cedar City over the 6,600-foot summit in the afternoon, and US-189 up Provo Canyon and US-40 to I-80 at Kimball Junction after dark. Stops: Wickenburg, Kingman, Hoover Dam, St. George, Fillmore. Las Vegas is a drive-through.",
    hubId: null,
    winterNotes:
      "The only day that reaches snow country. The desert half is 1,000 to 4,000 feet and dry. After lunch, I-15 climbs from 2,800 feet in St. George to a 6,600-foot summit between Beaver and Cove Fort, which you reach around 3:45 PM in daylight. Sunset is about 5:10 PM, so Nephi to E17 is in the dark, including Provo Canyon, and E17 sits near 6,500 feet. Bare or wet pavement is a go. Falling snow, snow-packed pavement, a traction law, or a closure means you stop in St. George for the night.",
    snowGate: {
      checkAt: "Sat Nov 14 night, and again at lunch in St. George around 1:00 PM MST",
      sourceName: "UDOT Traffic",
      sourceUrl: "https://udottraffic.utah.gov",
      go: "I-15 from Cedar City to Nephi and US-189 through Provo Canyon are bare or wet, and no snow is forecast for tonight.",
      hold: "Stop in St. George at the Hilton Garden Inn (2,800 feet). Monday becomes a workday in that room, and you drive I-15 after work, reaching E17 about 8:25 PM. Keys slip one day.",
    },
    legs: [
      {
        id: "sun-wickenburg",
        road: "I-10 W, Loop 303 N, US-60 W",
        from: "Goodyear",
        to: "Wickenburg",
        miles: 52,
        topElevationFt: 2100,
        snowRisk: "none",
        note: "In the dark, on empty Sunday freeways. Loop 303 keeps you out of the city.",
      },
      {
        id: "sun-us93",
        road: "US-93 N, I-40 W",
        from: "Wickenburg",
        to: "Kingman",
        miles: 130,
        topElevationFt: 4000,
        snowRisk: "low",
        note: "Sunrise on the Joshua Forest Scenic Road, then the Burro Creek bridge and Wikieup, and I-40 into Kingman. Services are thin until Kingman.",
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
        miles: 150,
        topElevationFt: 3000,
        snowRisk: "none",
        note: "The beltway skips the Strip. After Mesquite, I-15 threads the Virgin River Gorge in daylight. Clocks go forward an hour into Utah.",
      },
      {
        id: "sun-i15-summit",
        road: "I-15 N",
        from: "St. George",
        to: "Fillmore (exit 167)",
        miles: 163,
        topElevationFt: 6600,
        snowRisk: "watch",
        note: "The snow check of the trip. Cedar City, Beaver, then the 6,600-foot summit before Cove Fort in the afternoon.",
      },
      {
        id: "sun-utah-valley",
        road: "I-15 N",
        from: "Fillmore",
        to: "Orem (exit 272)",
        miles: 105,
        topElevationFt: 5300,
        snowRisk: "watch",
        note: "Scipio and Nephi at dusk, then down into Utah Valley in the dark. Leave I-15 at exit 272 (800 North, Orem) for US-189.",
      },
      {
        id: "sun-provo-canyon",
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
        when: "UDOT shows I-15 and US-189 bare or wet at lunch. This is the planned road. It skips Salt Lake City traffic and Parleys Summit, and tops out about 6,500 feet at the end.",
        miles: 723,
        driveHours: 11.5,
      },
      {
        id: "parleys",
        label: "I-15 through Salt Lake City, I-80 E up Parleys Canyon",
        when: "Provo Canyon is closed, has a crash, or is snow-packed while Parleys shows bare or wet. Parleys is a six-lane interstate, lit near the city and plowed first, but it climbs to 7,120 feet.",
        miles: 737,
        driveHours: 11.7,
      },
      {
        id: "hold",
        label: "Stop for the night in St. George",
        when: "I-15 north of Cedar City shows falling snow, snow-packed pavement, a traction law, or a closure at the lunch check. Book the Hilton Garden Inn there, work Monday from the room, and drive after work.",
        miles: 407,
        driveHours: 6.5,
      },
    ],
    stops: [
      {
        id: "sun-wickenburg",
        kind: "rest",
        place: "Downtown Wickenburg",
        road: "US-60 into town, where it meets US-93",
        purpose:
          "About 1 hour out, at first light. An old Western gold town of 8,000 with the Jail Tree on its main street. Coffee, a stretch, and a full tank, because services are thin until Kingman.",
        minutes: 15,
        clock: "6:45 AM MST",
        realisticUsd: 10,
      },
      {
        id: "sun-kingman",
        kind: "rest",
        place: "Kingman, on Route 66",
        road: "I-40 W into Kingman, then Andy Devine Avenue (Route 66)",
        purpose: "About 2 hours later. Fuel and a stretch on old Route 66 before Nevada.",
        minutes: 15,
        clock: "9:00 AM MST",
        realisticUsd: 5,
      },
      {
        id: "sun-hoover",
        kind: "rest",
        place: "Hoover Dam and the Pat Tillman Memorial Bridge",
        road: "US-93 exit 2 onto the Hoover Dam road, past the security check, to the free bridge-walkway lot",
        purpose:
          "About 1 hour 10 minutes later, in the morning light. Walk out on the bypass bridge for the view straight down onto the dam. One person walks and one stays with the cats.",
        minutes: 20,
        clock: "9:25 AM Nevada time (10:25 AM MST)",
        realisticUsd: 0,
      },
      {
        id: "sun-st-george",
        kind: "meal",
        place: "St. George",
        road: "I-15 N exit 8 (St. George Boulevard), into town",
        purpose:
          "About 2 hours 20 minutes later. Lunch under the red cliffs, and the snow check: open UDOT Traffic and read I-15 to Nephi and US-189 before you go on. If it says hold, this is where you stay.",
        minutes: 40,
        clock: "1:05 PM MST",
        realisticUsd: 40,
      },
      {
        id: "sun-fillmore",
        kind: "rest",
        place: "Fillmore, I-15 exit 167",
        road: "I-15 N exit 167, gas at the ramp",
        purpose:
          "About 2.5 hours later, just over the summit. Fuel and a short walk for the cats. Fillmore was Utah's first territorial capital and is a quiet town of 2,500.",
        minutes: 15,
        clock: "4:15 PM MST",
        realisticUsd: 5,
      },
      {
        id: "sun-snacks",
        kind: "meal",
        place: "In the car",
        road: "US-93 N / I-15 N",
        purpose: "Coffee, packed snacks and water. Breakfast is on the road.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 15,
      },
      {
        id: "sun-arrive",
        kind: "meal",
        place: "Kimball Junction",
        road: "After the keys at 900 Bitner Road, Apartment E17",
        purpose: "Cats in first, then a late dinner pickup at Kimball Junction.",
        minutes: 30,
        clock: "7:15 PM MST",
        realisticUsd: 35,
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
