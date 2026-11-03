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

type HubId = "daphne" | "kerrville" | "marana" | "st_george";

interface Hub {
  id: HubId;
  label: string;
  shortLabel: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

// Overnights are smaller towns or quiet suburbs on purpose, picked for low crime.
// Big cities on the route are interstate pass-throughs.
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
    id: "kerrville",
    label: "Kerrville, TX",
    shortLabel: "Kerrville",
    city: "Kerrville",
    state: "TX",
    lat: 30.0474,
    lng: -99.1403,
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
    miles: 2778,
    nights: 4,
    highestFt: 6600,
    highestWhere: "I-15 summit between Beaver and Cove Fort, on Sunday morning",
    milesAbove6000: 40,
    verdict:
      "The plan. About 475 more miles, but Wednesday through Saturday stay under 5,000 feet in the driest part of the country in November. Only Sunday morning reaches snow country, and you check the road from the hotel in St. George at 2,800 feet before you leave. Every night is in a smaller town or a quiet suburb.",
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
    toLabel: "Daphne, AL",
    departClock: "5:30 PM EST",
    arriveClock: "10:40 PM CST",
    latestSafeDepart: "6:30 PM EST",
    timeZone: "EST to CST",
    miles: 386,
    driveHours: 5.7,
    routeSummary:
      "After work. I-75 N to Lake City, then I-10 W across the Big Bend and the Panhandle, past Pensacola and into Alabama to Daphne on Mobile Bay. One stop: dinner and fuel at Quincy. Tallahassee and Pensacola are drive-throughs. The car is packed the night before, so this is just cats, litter and the cooler.",
    hubId: "daphne",
    winterNotes:
      "Sea level and dark the whole way: sunset in Gainesville is about 5:35 PM EST, right as you leave. I-10 across the Panhandle is wide and well lit at the exits, but long and empty between them, so keep the tank above half. Clocks go back an hour at the Apalachicola River, near exit 158. You reach Daphne about 10:40 PM Central (11:40 PM by your Florida body clock), so this is the late night of the trip. In exchange, Thursday starts 90 miles farther west and can leave at 6:30. The hotel is on US-98 a minute south of I-10 exit 35.",
    snowGate: {
      ...weatherGate,
      checkAt: "Wed Nov 11 afternoon, before you leave work",
      go: "No dense fog or severe storm warning on I-10 from Lake City to Mobile Bay.",
      hold: "Leave up to an hour later. It only moves bedtime, and Thursday can still leave at 6:30 AM.",
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
        to: "Daphne, AL (exit 35)",
        miles: 214,
        topElevationFt: 300,
        snowRisk: "none",
        note: "Over the Apalachicola River into Central time, past Marianna, DeFuniak Springs and Crestview, over Escambia Bay at Pensacola, across the Perdido River into Alabama, to exit 35 at Daphne.",
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
        purpose: "Coffee for the drive, packed snacks and water. The second half is 3 hours, so keep a thermos handy.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 8,
      },
    ],
  },
  {
    date: "2026-11-12",
    dateLabel: "Thu Nov 12",
    fromLabel: "Daphne, AL",
    toLabel: "Kerrville, TX",
    departClock: "6:30 AM CST",
    arriveClock: "6:50 PM CST",
    latestSafeDepart: "7:00 AM CST",
    timeZone: "CST",
    miles: 737,
    driveHours: 11.3,
    routeSummary:
      "I-10 W across Mobile Bay at sunrise and through the Wallace Tunnel, along the Mississippi coast, I-12 around New Orleans to the Atchafalaya swamp for brunch, past Lafayette and Beaumont and straight through Houston to a late lunch at Buc-ee's in Katy, then San Antonio and up into the Hill Country to Kerrville. Two stops, about 4 hours apart. Mobile, Baton Rouge, Lafayette, Houston and San Antonio are drive-throughs.",
    hubId: "kerrville",
    winterNotes:
      "Sea level to 1,700 feet, so snow is not a factor. Sunrise is about 6:15 AM, just before you leave. You cross Houston about 2:00 PM, ahead of its rush. San Antonio comes about 5:30 PM, in its evening rush, so the plan allows 15 extra minutes there. The last hour, up I-10 into the Hill Country, is after sunset (about 5:35 PM), and deer are out at dusk around Boerne and Comfort. Kerrville is a quiet Hill Country town on the Guadalupe River, and the hotel is right at I-10 exit 508.",
    snowGate: {
      ...weatherGate,
      checkAt: "Wed Nov 11 night, and again before 6:30 AM CST",
      go: "No dense fog, ice storm or severe storm warning on I-10 or I-12 from Mobile to San Antonio.",
      hold: "Fog on the coast usually lifts by 8:00 AM. Leave up to 30 minutes later and shorten brunch.",
    },
    legs: [
      {
        id: "thu-louisiana",
        road: "I-10 W, I-12 W, I-10 W",
        from: "Daphne",
        to: "Atchafalaya Welcome Center (exit 121)",
        miles: 242,
        topElevationFt: 300,
        snowRisk: "none",
        note: "The Jubilee Parkway causeway over Mobile Bay at first light, the Wallace Tunnel under the Mobile River, and the Mississippi coast. I-12 at Slidell keeps New Orleans 30 miles south. Baton Rouge's Mississippi River bridge, then onto the 18-mile Atchafalaya Basin Bridge to the welcome center halfway across.",
      },
      {
        id: "thu-texas-line",
        road: "I-10 W",
        from: "Atchafalaya",
        to: "Buc-ee's, Katy, TX",
        miles: 262,
        topElevationFt: 150,
        snowRisk: "none",
        note: "Lafayette, Lake Charles and the Calcasieu River bridge, the Sabine River into Texas at Orange, Beaumont and the rice country past Winnie, then straight through Houston on the Katy Freeway, with no exits inside the city, to the west edge of Katy.",
      },
      {
        id: "thu-hill-country",
        road: "I-10 W",
        from: "Katy",
        to: "Kerrville",
        miles: 233,
        topElevationFt: 1700,
        snowRisk: "none",
        note: "Sealy, Columbus and Schulenburg, over the Brazos and Colorado rivers, past Seguin and straight through San Antonio, then northwest into the Hill Country past Boerne and Comfort, in the dark, to Kerrville.",
      },
    ],
    stops: [
      {
        id: "thu-atchafalaya",
        kind: "meal",
        place: "Atchafalaya Welcome Center",
        road: "I-10 W exit 121 at Butte La Rose, in the middle of the basin bridge",
        purpose:
          "About 3 hours 35 minutes out. A Louisiana welcome center in the middle of America's largest river swamp, with a short nature walk among the cypress. Brunch from the cooler at the picnic tables. Free.",
        minutes: 35,
        clock: "10:05 AM CST",
        realisticUsd: 20,
      },
      {
        id: "thu-katy",
        kind: "meal",
        place: "Buc-ee's, Katy",
        road: "I-10 W at the west edge of Katy, about exit 741. The beaver billboards count down to it",
        purpose:
          "About 4 hours 5 minutes later, just past Houston. The Texas road-trip institution: dozens of gas pumps, famously clean restrooms, brisket sandwiches carved at the counter, and a wall of jerky. A late lunch and fuel.",
        minutes: 30,
        clock: "2:45 PM CST",
        realisticUsd: 30,
      },
      {
        id: "thu-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-10 W",
        purpose: "Coffee and something to go from the Daphne hotel, packed snacks and water.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
      {
        id: "thu-dinner",
        kind: "meal",
        place: "Kerrville",
        road: "Near the hotel on Sidney Baker Street, after check-in",
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
    fromLabel: "Kerrville, TX",
    toLabel: "Marana, AZ",
    departClock: "6:00 AM CST",
    arriveClock: "5:55 PM MST",
    latestSafeDepart: "6:15 AM CST",
    timeZone: "CST to MST",
    miles: 825,
    driveHours: 11.8,
    routeSummary:
      "The long day, mostly at 75 to 80 mph. I-10 W over the Edwards Plateau past Junction, Sonora and Ozona to breakfast in Fort Stockton, through Van Horn and El Paso to lunch on the plaza in Old Mesilla, across southern New Mexico into Arizona past Lordsburg and Willcox into Arizona, and through Tucson to Marana. Two stops, about 4 hours apart. El Paso, Las Cruces and Tucson are drive-throughs.",
    hubId: "marana",
    winterNotes:
      "Climbs from 1,700 feet to about 4,600, dry in November. Snow and ice are rare and melt by midday. Deer are thick on I-10 between Kerrville and Junction before dawn, so the first hour is the time to watch. Clocks go back an hour at the Hudspeth County line west of Van Horn. Blowing dust can close I-10 between Lordsburg and San Simon on windy afternoons. Sunset comes near Benson (about 5:25 PM MST), so the last half hour through Tucson to Marana is in the dark. Marana is a quiet suburb on Tucson's northwest edge, and the hotel is right at I-10 exit 240.",
    snowGate: {
      checkAt: "Thu Nov 12 night, and again before 6:00 AM CST",
      sourceName: "DriveTexas",
      sourceUrl: "https://drivetexas.org",
      go: "I-10 from Kerrville to El Paso is open with no ice or closure. In the afternoon, check NMRoads for a dust closure near Lordsburg.",
      hold: "West Texas ice melts by late morning. Wait in Kerrville and shorten the Mesilla lunch. For a dust closure, wait in Deming or Lordsburg until it lifts.",
    },
    legs: [
      {
        id: "fri-west-texas",
        road: "I-10 W",
        from: "Kerrville",
        to: "Fort Stockton (exit 257)",
        miles: 251,
        topElevationFt: 2700,
        snowRisk: "low",
        note: "Up onto the Edwards Plateau in the dark past Junction, then Sonora and Ozona as the sun comes up. The limit is 80 mph and towns are 60 to 100 miles apart.",
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
        id: "fri-marana",
        road: "I-10 W",
        from: "Old Mesilla",
        to: "Marana (exit 240)",
        miles: 293,
        topElevationFt: 4975,
        snowRisk: "low",
        note: "West across the open Chihuahuan Desert past Deming and Lordsburg, into Arizona at San Simon, past Willcox and through the Texas Canyon boulders, down through Benson at sunset, then straight through Tucson on I-10 to Marana on the northwest side.",
      },
    ],
    stops: [
      {
        id: "fri-fort-stockton",
        kind: "meal",
        place: "Fort Stockton",
        road: "I-10 W exit 257, gas at the ramp. Paisano Pete is two minutes off the exit on Dickinson Boulevard",
        purpose:
          "About 3 hours 30 minutes out. Breakfast, fuel, and a photo with Paisano Pete, the town's 11-foot roadrunner. The next good services are in Van Horn.",
        minutes: 30,
        clock: "9:30 AM CST",
        realisticUsd: 25,
      },
      {
        id: "fri-mesilla",
        kind: "meal",
        place: "Old Mesilla plaza",
        road: "I-10 W exit 140, then about 2 miles south to the plaza",
        purpose:
          "About 3 hours 55 minutes later, after El Paso. A tiny historic town of adobe shops and the San Albino basilica around an 1850s plaza. Lunch with green chile and a walk around the plaza.",
        minutes: 40,
        clock: "12:55 PM MST",
        realisticUsd: 35,
      },
      {
        id: "fri-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-10 W",
        purpose: "Coffee from the Kerrville hotel, packed snacks and plenty of water. Services are far apart west of Junction.",
        minutes: 0,
        clock: "During the drive",
        realisticUsd: 10,
      },
      {
        id: "fri-dinner",
        kind: "meal",
        place: "Marana",
        road: "Marana Center, walking distance from the hotel",
        purpose: "Dinner near the hotel and a real night's sleep. Saturday leaves at a gentler 7:30 AM.",
        minutes: 40,
        clock: "6:20 PM MST",
        realisticUsd: 40,
      },
    ],
  },
  {
    date: "2026-11-14",
    dateLabel: "Sat Nov 14",
    fromLabel: "Marana, AZ",
    toLabel: "St. George, UT",
    departClock: "7:30 AM MST",
    arriveClock: "4:10 PM MST",
    latestSafeDepart: "8:15 AM MST",
    timeZone: "MST, with Nevada an hour behind on Pacific time",
    miles: 514,
    driveHours: 8,
    routeSummary:
      "The easier day after the long one. I-10 W past Picacho Peak, around Phoenix on Loop 202 and Loop 303, US-60 through Wickenburg, US-93 north through the Joshua tree country to lunch on Route 66 in Kingman, then over the Colorado River on the bridge beside Hoover Dam, I-11, I-215 and I-15 past Las Vegas and through the Virgin River Gorge in daylight to St. George. One stop, about halfway. Phoenix and Las Vegas are drive-throughs.",
    hubId: "st_george",
    winterNotes:
      "Desert all day, 1,000 to 4,000 feet. Snow is very rare on this route. Wind can close US-93 at Hoover Dam for an hour or two. Nevada is on Pacific time, an hour behind Arizona and Utah. The Virgin River Gorge comes around 3:30 PM, in full daylight, about 90 minutes before sunset (about 5:10 PM in St. George). St. George sits at 2,800 feet in Utah's warm southwest corner, and you arrive with time to rest before Sunday.",
    snowGate: {
      checkAt: "Fri Nov 13 night, and again before 7:30 AM MST",
      sourceName: "AZ 511",
      sourceUrl: "https://www.az511.gov",
      go: "US-93 from Wickenburg to Hoover Dam has no wind closure, and I-15 through the Virgin River Gorge is open.",
      hold: "Wait in Kingman for a wind closure at the dam. Saturday has about 45 minutes of slack before the gorge would run into dusk, so shorten lunch if it runs later.",
    },
    legs: [
      {
        id: "sat-us93",
        road: "I-10 W, Loop 202 W, Loop 303 N, US-60 W, US-93 N, I-40 W",
        from: "Marana",
        to: "Kingman (I-40 exit 48)",
        miles: 289,
        topElevationFt: 4000,
        snowRisk: "low",
        note: "Past the volcanic spike of Picacho Peak and Casa Grande. Loop 202 (South Mountain Freeway) and Loop 303 keep you out of downtown Phoenix. US-60 through Wickenburg, then US-93 north on the Joshua Forest Scenic Road, over Burro Creek and past Wikieup to I-40 and Kingman.",
      },
      {
        id: "sat-gorge",
        road: "US-93 N, I-11 N, I-215 W, I-15 N",
        from: "Kingman",
        to: "St. George",
        miles: 225,
        topElevationFt: 3700,
        snowRisk: "none",
        note: "US-93 north across the desert and over the Colorado River on the Memorial Bridge, with Hoover Dam just upstream. Around the south side of Las Vegas, then I-15 north past Mesquite and through the Virgin River Gorge, 29 miles of tight canyon, into Utah. Clocks go forward an hour.",
      },
    ],
    stops: [
      {
        id: "sat-kingman",
        kind: "meal",
        place: "Route 66 in downtown Kingman",
        road: "I-40 W exit 48 (Beale Street), then a few blocks to the Powerhouse on Andy Devine Avenue. US-93 north leaves from the same exit",
        purpose:
          "About 4 hours 30 minutes out. The heart of Route 66 in Arizona: the 1907 Powerhouse with the Route 66 museum, a Santa Fe steam engine in Locomotive Park across the street, and old diners. Lunch and fuel.",
        minutes: 40,
        clock: "12:00 PM MST",
        realisticUsd: 35,
      },
      {
        id: "sat-snacks",
        kind: "meal",
        place: "In the car",
        road: "I-10 W / US-93 N / I-15 N",
        purpose: "Coffee from the Marana hotel, packed snacks and plenty of water.",
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
          "A real sit-down dinner and fill the tank. Read tomorrow's forecast for I-15 and Provo Canyon, and text the landlord your planned 1:15 PM arrival.",
        minutes: 60,
        clock: "5:30 PM MST",
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
