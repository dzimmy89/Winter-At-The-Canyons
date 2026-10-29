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
  "thu-i75": {
    minutes: 45,
    navTo: "Lake City, FL",
    directions: [
      "Neighborhood streets to the nearest I-75 on-ramp. Tap Navigate for the turns out of the driveway.",
      "I-75 North about 40 miles, past Alachua and High Springs.",
      "Exit 435 onto I-10 West toward Tallahassee.",
    ],
  },
  "thu-big-bend": {
    minutes: 145,
    endStopId: "thu-marianna",
    directions: [
      "I-10 West the whole way, in the dark.",
      "Live Oak and Madison, then Tallahassee at about 1.5 hours (exits 199 to 209). Stay on I-10.",
      "Cross the Apalachicola River near exit 158. Clocks go back one hour to Central.",
      "Exit 142 (SR-71, Marianna) for gas and dinner at the ramp.",
    ],
  },
  "thu-crestview": {
    minutes: 80,
    directions: [
      "Back to I-10 West at exit 142.",
      "Past Chipley (exit 120) and DeFuniak Springs (exit 85).",
      "Exit 56 (SR-85, Crestview). The Hampton Inn is on John King Road at the exit.",
    ],
  },
  "fri-coast": {
    minutes: 135,
    endStopId: "fri-davis-bayou",
    directions: [
      "I-10 West from exit 56.",
      "Pensacola: stay on I-10 through the city exits.",
      "Into Alabama. In Mobile, I-10 crosses the bay causeway and runs through the Wallace Tunnel. Stay on I-10.",
      "Into Mississippi. Exit 50 (Ocean Springs). Head south toward town and follow the brown signs for Gulf Islands National Seashore, Davis Bayou.",
    ],
  },
  "fri-louisiana": {
    minutes: 165,
    endStopId: "fri-atchafalaya",
    directions: [
      "Back to I-10 West at exit 50, past Gulfport.",
      "Cross the Pearl River into Louisiana. At Slidell keep right for I-12 West toward Hammond and Baton Rouge. Do not follow I-10 toward New Orleans.",
      "I-12 West about 85 miles past Covington and Hammond to Baton Rouge, where it ends at I-10. Follow I-10 West over the Mississippi River bridge.",
      "Onto the Atchafalaya Basin Bridge. Exit 121 (Butte La Rose) for the welcome center, partway across.",
    ],
  },
  "fri-sabine": {
    minutes: 110,
    endStopId: "fri-orange",
    directions: [
      "Back to I-10 West at exit 121 and finish the basin bridge. No shoulder, so hold the speed limit.",
      "Lafayette and Lake Charles: stay on I-10. Fuel in Sulphur, the last exits before Texas.",
      "Cross the Sabine River into Texas. Exit 880 for the Texas Travel Information Center, right after the bridge.",
    ],
  },
  "fri-houston": {
    minutes: 145,
    endStopId: "fri-san-felipe",
    directions: [
      "I-10 West through Orange and Beaumont.",
      "Houston: stay on I-10 (the Katy Freeway) straight through. On a Friday afternoon allow 45 to 60 minutes in the city.",
      "Exit 723 (FM 1458, San Felipe). North about 2 miles to the historic site.",
    ],
  },
  "fri-seguin": {
    minutes: 105,
    directions: [
      "Back to I-10 West at exit 723.",
      "Past Sealy, Columbus, Schulenburg and Luling. It gets dark around Columbus.",
      "Exit 610 into Seguin. The Hampton Inn is on Larkin Avenue. Tap Navigate for the last mile.",
    ],
  },
  "sat-hill-country": {
    minutes: 140,
    endStopId: "sat-junction",
    directions: [
      "I-10 West from Seguin.",
      "San Antonio: stay on I-10 West through downtown, where it briefly shares lanes with I-35. Follow the I-10 West / El Paso signs.",
      "Northwest into the Hill Country past Boerne, Comfort and Kerrville (exit 508).",
      "Exit 456 into Junction for gas.",
    ],
  },
  "sat-west-texas": {
    minutes: 200,
    endStopId: "sat-balmorhea",
    directions: [
      "Back to I-10 West at exit 456.",
      "Sonora, Ozona, Fort Stockton. The limit is 80 mph and towns are 60 to 100 miles apart.",
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
  "sat-deming": {
    minutes: 52,
    directions: [
      "Back to I-10 West at exit 140.",
      "About 55 miles of open desert with the Florida Mountains to the south.",
      "Exit 85 into Deming. The Hampton Inn is on East Cedar Street near the exit.",
    ],
  },
  "sun-texas-canyon": {
    minutes: 135,
    endStopId: "sun-texas-canyon",
    directions: [
      "I-10 West from Deming.",
      "Lordsburg: fuel if the tank is under three quarters. Sunday is long.",
      "Into Arizona past San Simon and Willcox. Watch the blowing-dust signs.",
      "Texas Canyon rest area near mile 320, right off I-10. Follow the Rest Area sign.",
    ],
  },
  "sun-picacho": {
    minutes: 90,
    endStopId: "sun-picacho",
    directions: [
      "I-10 West through Benson.",
      "Tucson: stay on I-10 through the city.",
      "Exit 219 (Picacho Peak Road). The park entrance is at the exit.",
    ],
  },
  "sun-phoenix": {
    minutes: 125,
    endStopId: "sun-wickenburg",
    directions: [
      "I-10 West toward Phoenix.",
      "Near Chandler, take Loop 202 West (the South Mountain Freeway). It skips downtown and rejoins I-10 West on the west side.",
      "I-10 West to Loop 303 North (exit 124).",
      "Loop 303 North to US-60 (Grand Avenue), then US-60 West about 30 miles into Wickenburg.",
    ],
  },
  "sun-us93": {
    minutes: 120,
    endStopId: "sun-kingman",
    directions: [
      "US-93 North out of Wickenburg toward Kingman.",
      "Joshua Forest Scenic Road: about 20 miles of Joshua trees on both sides, then the Burro Creek bridge.",
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
    directions: [
      "Back to I-11 North toward Henderson.",
      "I-215 West around the south side of Las Vegas to I-15 North.",
      "I-15 North out of the city to Mesquite at the Arizona line.",
      "Virgin River Gorge: about 29 miles of tight canyon through the corner of Arizona, in the dark. No stopping.",
      "Into Utah. Clocks go forward an hour. Take a St. George exit and tap Navigate for the hotel on Convention Center Drive.",
    ],
  },
  "mon-i15-summit": {
    minutes: 150,
    endStopId: "mon-fillmore",
    directions: [
      "From the hotel to I-15 North. This is the snow check of the trip.",
      "Cedar City at about 50 minutes, then Beaver.",
      "The 6,600-foot summit before Cove Fort, around sunset. Watch the UDOT signs for traction-law notices.",
      "Exit 167 into Fillmore for gas.",
    ],
  },
  "mon-utah-valley": {
    minutes: 95,
    navTo: "800 North and I-15, Orem, UT",
    directions: [
      "Back to I-15 North.",
      "Scipio and Nephi, then down into Utah Valley past Provo.",
      "Exit 272 (800 North, Orem). East on 800 North, which becomes US-189 into Provo Canyon.",
    ],
  },
  "mon-provo-canyon": {
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
  "thu-marianna": "I-10 Exit 142, Marianna, FL",
  "fri-davis-bayou": "Davis Bayou Area, Gulf Islands National Seashore, Ocean Springs, MS",
  "fri-atchafalaya": "Atchafalaya Welcome Center, Butte La Rose, LA",
  "fri-orange": "Texas Travel Information Center, Orange, TX",
  "fri-san-felipe": "San Felipe de Austin State Historic Site, San Felipe, TX",
  "fri-dinner": "Downtown Seguin, TX",
  "sat-junction": "Junction, TX",
  "sat-balmorhea": "Balmorhea State Park, Toyahvale, TX",
  "sat-mesilla": "Mesilla Plaza, Mesilla, NM",
  "sat-dinner": "Deming, NM",
  "sun-texas-canyon": "Texas Canyon Rest Area, I-10, Dragoon, AZ",
  "sun-picacho": "Picacho Peak State Park, Picacho, AZ",
  "sun-wickenburg": "Jail Tree, Wickenburg, AZ",
  "sun-kingman": "Historic Route 66, Kingman, AZ",
  "sun-hoover": "Mike O'Callaghan-Pat Tillman Memorial Bridge, Boulder City, NV",
  "sun-dinner": "St. George, UT",
  "mon-fillmore": "I-15 Exit 167, Fillmore, UT",
  "mon-arrive": "Kimball Junction, Park City, UT",
};

// Street addresses for the nights, so Navigate lands on the hotel and not the town.
export const hotelAddresses: Record<string, string> = {
  crestview: "Hampton Inn Crestview South I-10, 112 John King Rd, Crestview, FL 32539",
  seguin: "Hampton Inn Seguin, 1130 Larkin Ave, Seguin, TX 78155",
  deming: "Hampton Inn Deming, 3751 E Cedar St, Deming, NM 88030",
  st_george: "Hilton Garden Inn St. George, 1731 S Convention Center Dr, St. George, UT 84790",
};

export function mapsDirectionsUrl(destination: string, origin?: string): string {
  const params = new URLSearchParams({ api: "1", destination, travelmode: "driving" });
  if (origin) {
    params.set("origin", origin);
  }
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
