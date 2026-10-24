import { destination, townById } from "../data/towns";
import type {
  BudgetTierId,
  DriveCapHours,
  DriveDay,
  DriveStopEvent,
  HotelNight,
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

type HubId = "cookeville" | "topeka" | "wheat_ridge";

interface Hub {
  id: HubId;
  label: string;
  shortLabel: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

const hubs: Hub[] = [
  {
    id: "cookeville",
    label: "Cookeville, TN",
    shortLabel: "Cookeville",
    city: "Cookeville",
    state: "TN",
    lat: 36.1628,
    lng: -85.5016,
  },
  {
    id: "topeka",
    label: "Topeka, KS",
    shortLabel: "Topeka",
    city: "Topeka",
    state: "KS",
    lat: 39.0149,
    lng: -95.752,
  },
  {
    id: "wheat_ridge",
    label: "Wheat Ridge, CO",
    shortLabel: "Wheat Ridge",
    city: "Wheat Ridge",
    state: "CO",
    lat: 39.771,
    lng: -105.1521,
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
  stops: DriveStopEvent[];
  snowGate: SnowGate;
  corridors?: SundayCorridor[];
}

const weatherGate: SnowGate = {
  checkAt: "The night before, and again before departure",
  sourceName: "National Weather Service",
  sourceUrl: "https://www.weather.gov",
  go: "The next interstate is outside a winter storm warning, or that segment is bare or wet pavement.",
  hold: "Wait until the segment is bare or wet, or take a parallel interstate that still reaches the same Hampton. Do not add a day past Sunday to dodge rain.",
};

const dayDrafts: DayDraft[] = [
  {
    date: "2026-11-12",
    dateLabel: "Thu Nov 12",
    fromLabel: "Gainesville, FL",
    toLabel: "Cookeville, TN",
    departClock: "5:00 AM EST",
    arriveClock: "4:50 PM EST",
    latestSafeDepart: "5:00 AM EST",
    timeZone: "EST",
    miles: 535,
    driveHours: 10.2,
    routeSummary:
      "I-75 N through Atlanta, then I-40 W. Pull off at Reed Bingham (exit 39), High Falls (exit 198), and Ozone Falls (exit 329). No Smokies detour.",
    hubId: "cookeville",
    winterNotes:
      "About 1,000 feet. Snow is unlikely. M+S or 3PMSF tires are on the car before this departure. Newfound Gap is not on this road.",
    snowGate: {
      ...weatherGate,
      checkAt: "Wed Nov 11 night, and again before 5:00 AM EST",
    },
    stops: [
      {
        id: "thu-reed-bingham",
        kind: "rest",
        place: "Reed Bingham State Park",
        road: "I-75 N exit 39, then 6 miles west on GA-37. Same road back.",
        purpose:
          "About 3 hours out. Cypress lake and a short boardwalk. Leash the cats, 15 minutes at the water, then back to the interstate. Fuel at the exit.",
        minutes: 30,
        clock: "8:15 AM EST",
        realisticUsd: 0,
      },
      {
        id: "thu-high-falls",
        kind: "meal",
        place: "High Falls State Park",
        road: "I-75 N exit 198, then 1.8 miles east. Eat at the exit first.",
        purpose:
          "About 3 hours after Reed Bingham, before Atlanta. Drive-through lunch, then the short walk to the waterfall overlook. Leash. Georgia parking fee is about $5. Do not stop inside I-285.",
        minutes: 35,
        clock: "11:30 AM EST",
        realisticUsd: 32,
      },
      {
        id: "thu-ozone",
        kind: "rest",
        place: "Ozone Falls",
        road: "I-40 W exit 329, then about 4.5 miles east on US-70. Same road back.",
        purpose:
          "About 3 hours after High Falls. A 110-foot falls. Walk only to the top overlook, a few minutes, leashed. Skip the steep path to the pool.",
        minutes: 25,
        clock: "3:20 PM EST",
        realisticUsd: 0,
      },
      {
        id: "thu-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-75 N / I-40 W",
        purpose: "Packed snacks and water.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 12,
      },
      {
        id: "thu-dinner",
        kind: "meal",
        place: "Cookeville",
        road: "1025 Interstate Drive, after check-in",
        purpose: "Dinner pickup. Cats stay with a person.",
        minutes: 20,
        clock: "6:00 PM EST",
        realisticUsd: 45,
      },
    ],
  },
  {
    date: "2026-11-13",
    dateLabel: "Fri Nov 13",
    fromLabel: "Cookeville, TN",
    toLabel: "Topeka, KS",
    departClock: "3:00 AM EST",
    arriveClock: "4:10 PM CST",
    latestSafeDepart: "3:30 AM EST",
    timeZone: "EST to CST",
    miles: 699,
    driveHours: 13,
    routeSummary:
      "I-40 W through Nashville onto I-24 W, then I-57 N, I-64 W, and I-70 W. Pull off at Kentucky Dam (exit 27), Cahokia Mounds, and Rocheport (exit 115). Nashville and Kansas City stay on the highway.",
    hubId: "topeka",
    winterNotes:
      "This is the 13.0 h cap. Topeka is about 900 feet. The Kansas Turnpike is the last stretch of I-70 into the city. No Gateway Arch stop. No Kansas City exit.",
    snowGate: {
      ...weatherGate,
      checkAt: "Thu Nov 12 night, and again before 3:00 AM EST",
    },
    stops: [
      {
        id: "fri-kentucky-dam",
        kind: "rest",
        place: "Kentucky Dam",
        road: "I-24 W exit 27 at Gilbertsville, a few minutes to the dam overlook.",
        purpose:
          "About 3.5 hours out, after Nashville. Lake and dam overlook, fuel, litter. Leash. No Davidson County exit on the way there.",
        minutes: 20,
        clock: "5:30 AM CST",
        realisticUsd: 0,
      },
      {
        id: "fri-cahokia",
        kind: "meal",
        place: "Cahokia Mounds",
        road: "I-255 exit 24, Collinsville Road, about 2 miles to the site. Eat at the exit.",
        purpose:
          "About 4 hours after the dam, on the Illinois side of the river. Drive-through lunch, then 20 minutes at Monk's Mound. Leash. The Arch and downtown St. Louis stay on the highway.",
        minutes: 35,
        clock: "9:45 AM CST",
        realisticUsd: 34,
      },
      {
        id: "fri-rocheport",
        kind: "rest",
        place: "Rocheport and the Katy Trail",
        road: "I-70 W exit 115, then 2 miles north on Route BB.",
        purpose:
          "About 3 hours after Cahokia. Missouri River bluff and the trail at the edge of town. Twenty minutes, leash, then back to exit 115. No Kansas City exit later.",
        minutes: 25,
        clock: "1:00 PM CST",
        realisticUsd: 0,
      },
      {
        id: "fri-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-40 / I-24 / I-70",
        purpose: "Packed snacks and water.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 12,
      },
      {
        id: "fri-dinner",
        kind: "meal",
        place: "Topeka",
        road: "1515 SW Arrowhead Rd, after check-in",
        purpose: "Dinner pickup.",
        minutes: 20,
        clock: "6:00 PM CST",
        realisticUsd: 48,
      },
    ],
  },
  {
    date: "2026-11-14",
    dateLabel: "Sat Nov 14",
    fromLabel: "Topeka, KS",
    toLabel: "Wheat Ridge, CO",
    departClock: "6:30 AM CST",
    arriveClock: "4:00 PM MST",
    latestSafeDepart: "7:00 AM CST",
    timeZone: "CST to MST",
    miles: 547,
    driveHours: 9.4,
    routeSummary:
      "I-70 W across the Smoky Hills and the high plains, then through Denver. Pull off at Wilson Lake (exit 206), the Goodland easel (exit 19), and Clear Creek in Golden. E-470 is not the route.",
    hubId: "wheat_ridge",
    winterNotes:
      "First day that can meet snow, on the western Kansas and eastern Colorado plains. Leave only if I-70 from Salina through Denver is bare or wet. Stop in Wheat Ridge, east of the tunnel, so Sunday can turn north onto I-25 instead of west into Eisenhower. If snow is falling or the pavement is snow-packed west of Hays, stop at the Salina Hampton instead. A Salina night means Sunday cannot reach E17 under the 13 h cap.",
    snowGate: {
      checkAt: "Fri Nov 13 night, and again before 6:30 AM CST",
      sourceName: "COtrip",
      sourceUrl: "https://www.cotrip.org",
      go: "I-70 from Salina through Denver is bare or wet pavement.",
      hold: "If snow is falling or the pavement is snow-packed west of Hays, stop at the Hampton Inn Salina, 401 West Schilling Road. Do not drive into it.",
    },
    stops: [
      {
        id: "sat-wilson",
        kind: "rest",
        place: "Wilson Lake",
        road: "I-70 W exit 206, then about 5 miles north on K-232. Same road back.",
        purpose:
          "About 3 hours out. Limestone cliffs on the reservoir. Twenty minutes at the first overlook, leash, then back to I-70. Fuel at the exit. The Salina Hampton, passed earlier, is the snow hold, not this stop.",
        minutes: 30,
        clock: "9:30 AM CST",
        realisticUsd: 0,
      },
      {
        id: "sat-goodland",
        kind: "meal",
        place: "Goodland easel",
        road: "I-70 W exit 19, about a mile north. The easel stands outdoors.",
        purpose:
          "About 3 hours after Wilson Lake. Drive-through lunch at the exit, then a 15-minute look at the giant easel on the high plains. The Burlington carousel is closed in November.",
        minutes: 30,
        clock: "1:00 PM CST",
        realisticUsd: 32,
      },
      {
        id: "sat-clear-creek",
        kind: "rest",
        place: "Clear Creek Whitewater Park",
        road: "I-70 W into Golden, a couple of minutes off the highway at the creek.",
        purpose:
          "About 3 hours after Goodland, and the last break before the hotel. Watch the creek for 15 minutes. Leash. Then Wheat Ridge.",
        minutes: 20,
        clock: "3:15 PM MST",
        realisticUsd: 0,
      },
      {
        id: "sat-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-70 W",
        purpose: "Packed snacks and water.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
      {
        id: "sat-dinner",
        kind: "meal",
        place: "Wheat Ridge",
        road: "4025 Clear Creek Drive, after check-in",
        purpose: "Dinner pickup.",
        minutes: 20,
        clock: "5:30 PM MST",
        realisticUsd: 45,
      },
    ],
  },
  {
    date: "2026-11-15",
    dateLabel: "Sun Nov 15",
    fromLabel: "Wheat Ridge, CO",
    toLabel: "900 Bitner Road, Apartment E17",
    departClock: "4:30 AM MST",
    arriveClock: "4:30 PM MST",
    latestSafeDepart: "5:00 AM MST",
    timeZone: "MST",
    miles: 522,
    driveHours: 11,
    routeSummary:
      "I-25 N to Cheyenne, then I-80 W. Pull off at Vedauwoo (exit 329), Fort Fred Steele (exit 228), and the Echo Canyon rest area (mile 170). Sherman Summit is the snow check between Vedauwoo and Laramie.",
    hubId: null,
    winterNotes:
      "The planned road stays under Sherman Summit instead of Eisenhower at 11,158 feet, Vail Pass at 10,662 feet, and Soldier Summit near 7,500 feet. Elk Mountain and Parleys Summit can still ice. Bare or wet pavement is a go. Falling snow, snow-packed pavement, a passenger chain law, or a closure is a no-go. 4WD does not change that. If Wyoming has snow and I-70 is bare, use the passes. If both have snow, stay at Wheat Ridge. That second night is cash.",
    snowGate: {
      checkAt: "Sat Nov 14 night, and again at 4:00 AM MST",
      sourceName: "WYDOT",
      sourceUrl: "https://www.wyoroad.info",
      go: "Take I-25 north and I-80 west when Sherman Summit and Elk Mountain are bare or wet. Use I-70 only when Wyoming has snow and COtrip shows Morrison through Vail bare or wet.",
      hold: "If both I-80 and I-70 show snow, a chain law, or a closure, stay a second night at the Wheat Ridge Hampton. Keys slip past Sunday.",
    },
    corridors: [
      {
        id: "i80",
        label: "I-25 north and I-80 west",
        when: "WYDOT bare or wet across Sherman Summit and Elk Mountain. This is the planned road because it stays at 8,640 feet instead of the Colorado passes above 10,000.",
        miles: 522,
        driveHours: 11,
      },
      {
        id: "i70",
        label: "I-70 west",
        when: "Wyoming has snow and COtrip is bare or wet from Morrison through Vail. Then US-6 only if UDOT shows Soldier Summit bare or wet.",
        miles: 503,
        driveHours: 10.6,
      },
      {
        id: "hold",
        label: "Stay at Wheat Ridge",
        when: "Both corridors show snow, a chain law, or a closure. The second night is cash.",
        miles: 0,
        driveHours: 0,
      },
    ],
    stops: [
      {
        id: "sun-vedauwoo",
        kind: "rest",
        place: "Vedauwoo",
        road: "I-80 W exit 329, about a mile north to the first rock parking area.",
        purpose:
          "About 3 hours out. Granite piles you can see from the highway. Fifteen minutes among the closest rocks, leash, then back to I-80. Six miles later, look at the pavement at the Sherman Summit rest area, exit 323, and keep going if it is bare or wet.",
        minutes: 25,
        clock: "7:30 AM MST",
        realisticUsd: 0,
      },
      {
        id: "sun-laramie",
        kind: "meal",
        place: "Laramie",
        road: "I-80 W, 16 miles after the summit.",
        purpose: "Drive-through lunch on the same break as Vedauwoo. Fuel. Elk Mountain is the next snow look.",
        minutes: 20,
        clock: "8:15 AM MST",
        realisticUsd: 34,
      },
      {
        id: "sun-fort-steele",
        kind: "rest",
        place: "Fort Fred Steele",
        road: "I-80 W exit 228. The ruins are 1.25 miles north of the rest area.",
        purpose:
          "About 3 hours after Laramie. Walk the outdoor fort grounds for 20 minutes. The visitor center is seasonal and likely closed in November. Leash. Fuel at the rest area.",
        minutes: 25,
        clock: "11:15 AM MST",
        realisticUsd: 0,
      },
      {
        id: "sun-echo",
        kind: "rest",
        place: "Echo Canyon rest area",
        road: "I-80 W, mile marker 170. The rest area is on the highway.",
        purpose:
          "About 3 hours after the fort. Canyon walls, picnic table, litter. No side trip. Parleys Summit is the last climb after this.",
        minutes: 15,
        clock: "2:15 PM MST",
        realisticUsd: 0,
      },
      {
        id: "sun-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-25 N / I-80 W",
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
