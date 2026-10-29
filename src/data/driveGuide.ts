// Turn-by-turn highway guidance for each leg of the drive, plus the map searches
// the phone opens. Leg and stop ids match src/lib/drive.ts.

export interface LegGuide {
  minutes: number;
  // The stop this leg ends at. A leg without one ends at the night's hotel or E17.
  endStopId?: string;
  // Map search for a leg that ends mid-route, neither at a stop nor at the night's stay.
  navTo?: string;
  directions: string[];
}

export const startAddress = "4922 NW 81st Ave, Gainesville, FL 32653";
export const endAddress = "900 Bitner Road, Park City, UT 84098";

export const legGuides: Record<string, LegGuide> = {
  "wed-i75": {
    minutes: 45,
    navTo: "Lake City, FL",
    directions: [
      "Neighborhood streets to the nearest I-75 on-ramp. Tap Navigate for the turns out of the driveway.",
      "I-75 North about 40 miles, past Alachua and High Springs.",
      "Exit 435 onto I-10 West toward Tallahassee.",
    ],
  },
  "wed-big-bend": {
    minutes: 140,
    endStopId: "wed-marianna",
    directions: [
      "I-10 West the whole way. It gets dark around Madison.",
      "Live Oak and Madison, then Tallahassee at about 1.5 hours (exits 199 to 209). Stay on I-10.",
      "Cross the Apalachicola River near exit 158. Clocks go back one hour to Central.",
      "Exit 142 (SR-71, Marianna) for gas and dinner at the ramp.",
    ],
  },
  "wed-panhandle": {
    minutes: 155,
    directions: [
      "Back to I-10 West at exit 142.",
      "Past Chipley (exit 120), DeFuniak Springs (exit 85) and Crestview (exit 56).",
      "Pensacola: stay on I-10 through the city exits and across the Escambia Bay bridge.",
      "Into Alabama. Exit 35 (US-98 / US-90, Daphne). The Hilton Garden Inn is on North Main Street at the exit.",
    ],
  },
  "thu-mobile-bay": {
    minutes: 35,
    endStopId: "thu-ms-welcome",
    directions: [
      "From the hotel back to I-10 West at exit 35.",
      "Across the Mobile Bay causeway and through the Wallace Tunnel under the Mobile River. Stay on I-10.",
      "Into Mississippi. The welcome center is on the right near mile 75, right after the state line.",
    ],
  },
  "thu-gulf-coast": {
    minutes: 115,
    endStopId: "thu-hammond",
    directions: [
      "I-10 West past Pascagoula, Biloxi and Gulfport.",
      "Cross the Pearl River into Louisiana. At Slidell keep right for I-12 West toward Hammond and Baton Rouge. Do not follow I-10 toward New Orleans.",
      "I-12 West past Mandeville and Covington.",
      "Exit 40 (US-51, Hammond) for gas and dinner at the ramp.",
    ],
  },
  "thu-cajun": {
    minutes: 165,
    directions: [
      "Back to I-12 West to Baton Rouge, where it ends at I-10. Follow I-10 West over the Mississippi River bridge.",
      "The Atchafalaya Basin Bridge, 18 miles with no shoulder. Hold the speed limit.",
      "Lafayette and Lake Charles: stay on I-10, including the Calcasieu River bridge.",
      "Exit 20 (LA-27, Sulphur). The Hampton Inn is on Henning Drive at the exit.",
    ],
  },
  "fri-sabine": {
    minutes: 20,
    endStopId: "fri-orange",
    directions: [
      "I-10 West from exit 20, the last exits before Texas.",
      "Cross the Sabine River into Texas. Exit 880 for the Texas Travel Information Center, right after the bridge.",
    ],
  },
  "fri-houston": {
    minutes: 150,
    endStopId: "fri-san-felipe",
    directions: [
      "I-10 West through Orange and Beaumont.",
      "Houston: stay on I-10 (the Katy Freeway) straight through. Around 9:00 AM on a Friday, allow an extra 30 minutes.",
      "Exit 723 (FM 1458, San Felipe). North about 2 miles to the historic site.",
    ],
  },
  "fri-seguin": {
    minutes: 105,
    endStopId: "fri-seguin",
    directions: [
      "Back to I-10 West at exit 723.",
      "Past Sealy, Columbus, Schulenburg and Luling.",
      "Exit 610 into Seguin. South about 2 miles to the courthouse square downtown.",
    ],
  },
  "fri-hill-country": {
    minutes: 140,
    endStopId: "fri-junction",
    directions: [
      "Back to I-10 West from Seguin.",
      "San Antonio: stay on I-10 West through downtown, where it briefly shares lanes with I-35. Follow the I-10 West / El Paso signs.",
      "Northwest into the Hill Country past Boerne, Comfort and Kerrville (exit 508).",
      "Exit 456 into Junction for gas.",
    ],
  },
  "fri-west-texas": {
    minutes: 160,
    directions: [
      "Back to I-10 West at exit 456.",
      "Sonora and Ozona. The limit is 80 mph and towns are 60 to 100 miles apart.",
      "Fort Stockton exits start at 261. The Hampton Inn is on the I-10 frontage road at the west end of town, near exit 256. Tap Navigate for the last turns.",
    ],
  },
  "sat-balmorhea": {
    minutes: 50,
    endStopId: "sat-balmorhea",
    directions: [
      "I-10 West from Fort Stockton, at sunrise.",
      "Exit 209 for TX-17 and follow the signs about 7 miles through Balmorhea to the state park at Toyahvale.",
    ],
  },
  "sat-el-paso": {
    minutes: 200,
    endStopId: "sat-mesilla",
    directions: [
      "TX-17 back north to I-10 West.",
      "Van Horn is the last easy fuel before El Paso. Clocks go back an hour to Mountain time west of Van Horn.",
      "El Paso: stay on I-10 West straight through the city, about 30 minutes, then into New Mexico.",
      "Exit 140 (NM-28, Avenida de Mesilla). South about 2 miles to the plaza in Old Mesilla.",
    ],
  },
  "sat-new-mexico": {
    minutes: 180,
    endStopId: "sat-texas-canyon",
    directions: [
      "Back to I-10 West at exit 140.",
      "Deming (exit 85) and Lordsburg: fuel in one of them.",
      "Into Arizona past San Simon and Willcox. Watch the blowing-dust signs.",
      "Texas Canyon rest area near mile 320, right off I-10. Follow the Rest Area sign.",
    ],
  },
  "sat-phoenix": {
    minutes: 180,
    directions: [
      "I-10 West through Benson.",
      "Tucson: stay on I-10 through the city.",
      "Past Casa Grande. Near Chandler, take Loop 202 West (the South Mountain Freeway). It skips downtown and rejoins I-10 West on the west side.",
      "I-10 West to exit 128 (Litchfield Road). The Hampton Inn is just north of the freeway.",
    ],
  },
  "sun-wickenburg": {
    minutes: 60,
    endStopId: "sun-wickenburg",
    directions: [
      "I-10 West from exit 128 to Loop 303 North (exit 124).",
      "Loop 303 North to US-60 (Grand Avenue).",
      "US-60 West about 30 miles into Wickenburg.",
    ],
  },
  "sun-us93": {
    minutes: 120,
    endStopId: "sun-kingman",
    directions: [
      "US-93 North out of Wickenburg toward Kingman.",
      "Joshua Forest Scenic Road: about 20 miles of Joshua trees on both sides at sunrise, then the Burro Creek bridge.",
      "Through Wikieup. US-93 joins I-40 West into Kingman.",
      "Take a Kingman exit for gas on Andy Devine Avenue (Route 66).",
    ],
  },
  "sun-hoover": {
    minutes: 70,
    endStopId: "sun-hoover",
    directions: [
      "From Route 66 back to I-40, then US-93 North toward Las Vegas.",
      "About 70 miles of divided highway across the desert.",
      "Exit 2 (Hoover Dam). Pass the security checkpoint and follow the signs to the Memorial Bridge walkway parking.",
    ],
  },
  "sun-gorge": {
    minutes: 140,
    endStopId: "sun-st-george",
    directions: [
      "Back to I-11 North toward Henderson.",
      "I-215 West around the south side of Las Vegas to I-15 North.",
      "I-15 North out of the city to Mesquite at the Arizona line.",
      "Virgin River Gorge: about 29 miles of tight canyon through the corner of Arizona. No stopping.",
      "Into Utah. Clocks go forward an hour. Exit 8 (St. George Boulevard) for lunch.",
    ],
  },
  "sun-i15-summit": {
    minutes: 150,
    endStopId: "sun-fillmore",
    directions: [
      "Back to I-15 North. Only go on if the lunch UDOT check said go.",
      "Cedar City at about 50 minutes, then Beaver.",
      "The 6,600-foot summit before Cove Fort. Watch the UDOT signs for traction-law notices.",
      "Exit 167 into Fillmore for gas.",
    ],
  },
  "sun-utah-valley": {
    minutes: 95,
    navTo: "800 North and I-15, Orem, UT",
    directions: [
      "Back to I-15 North.",
      "Scipio and Nephi at dusk, then down into Utah Valley past Provo.",
      "Exit 272 (800 North, Orem). East on 800 North, which becomes US-189 into Provo Canyon.",
    ],
  },
  "sun-provo-canyon": {
    minutes: 55,
    directions: [
      "US-189 North up the canyon, past Bridal Veil Falls and Deer Creek Reservoir, into Heber.",
      "US-189 joins US-40 in Heber. Continue north on US-40 toward Park City.",
      "US-40 North past Jordanelle Reservoir to I-80. Take I-80 West.",
      "Exit 145 (Kimball Junction). Tap Navigate for the last turns to 900 Bitner Road.",
    ],
  },
};

// What Google Maps searches for at each stop.
export const stopPlaces: Record<string, string> = {
  "wed-marianna": "I-10 Exit 142, Marianna, FL",
  "thu-ms-welcome": "Mississippi Welcome Center, I-10 West, Moss Point, MS",
  "thu-hammond": "I-12 Exit 40, Hammond, LA",
  "fri-orange": "Texas Travel Information Center, Orange, TX",
  "fri-san-felipe": "San Felipe de Austin State Historic Site, San Felipe, TX",
  "fri-seguin": "Central Park, Seguin, TX",
  "fri-junction": "Junction, TX",
  "fri-dinner": "Fort Stockton, TX",
  "sat-balmorhea": "Balmorhea State Park, Toyahvale, TX",
  "sat-mesilla": "Mesilla Plaza, Mesilla, NM",
  "sat-texas-canyon": "Texas Canyon Rest Area, I-10, Dragoon, AZ",
  "sat-dinner": "Goodyear, AZ",
  "sun-wickenburg": "Jail Tree, Wickenburg, AZ",
  "sun-kingman": "Historic Route 66, Kingman, AZ",
  "sun-hoover": "Mike O'Callaghan-Pat Tillman Memorial Bridge, Boulder City, NV",
  "sun-st-george": "Town Square, St. George, UT",
  "sun-fillmore": "I-15 Exit 167, Fillmore, UT",
  "sun-arrive": "Kimball Junction, Park City, UT",
};

// Street addresses for the nights, so Navigate lands on the hotel and not the town.
export const hotelAddresses: Record<string, string> = {
  daphne: "Hilton Garden Inn Mobile East Bay/Daphne, 29546 N Main St, Daphne, AL 36526",
  sulphur: "Hampton Inn Sulphur/Lake Charles Area, 210 Henning Dr, Sulphur, LA 70663",
  fort_stockton: "Hampton Inn Fort Stockton, 2271 W I-10, Fort Stockton, TX 79735",
  goodyear: "Hampton Inn & Suites Phoenix-Goodyear, 2000 N Litchfield Rd, Goodyear, AZ 85395",
  st_george: "Hilton Garden Inn St. George, 1731 S Convention Center Dr, St. George, UT 84790",
};

export function mapsDirectionsUrl(destination: string, origin?: string): string {
  const params = new URLSearchParams({ api: "1", destination, travelmode: "driving" });
  if (origin) {
    params.set("origin", origin);
  }
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
