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
  "wed-panhandle": {
    minutes: 240,
    endStopId: "wed-defuniak",
    directions: [
      "Neighborhood streets to the nearest I-75 on-ramp. Tap Navigate for the turns out of the driveway.",
      "I-75 North about 40 miles, past Alachua and High Springs, as the sky gets light.",
      "Exit 435 onto I-10 West toward Tallahassee. Then I-10 West the whole way.",
      "Tallahassee at about 1.5 hours (exits 199 to 209). Stay on I-10.",
      "Cross the Apalachicola River near exit 158. Clocks go back one hour to Central.",
      "Past Marianna (exit 142) and Chipley (exit 120).",
      "Exit 85 (US-331, DeFuniak Springs). North about 2 miles into town. The lake is downtown, circled by Circle Drive.",
    ],
  },
  "wed-coast": {
    minutes: 155,
    endStopId: "wed-davis-bayou",
    directions: [
      "South on US-331 back to I-10 West at exit 85, past Crestview.",
      "Pensacola: stay on I-10 through the city exits.",
      "Into Alabama. In Mobile, I-10 crosses the bay causeway and runs through the Wallace Tunnel. Stay on I-10.",
      "Into Mississippi. Exit 50 (Ocean Springs). Head south toward town and follow the brown signs for Gulf Islands National Seashore, Davis Bayou.",
    ],
  },
  "wed-louisiana": {
    minutes: 205,
    directions: [
      "Back to I-10 West at exit 50, past Gulfport.",
      "Cross the Pearl River into Louisiana. At Slidell keep right for I-12 West toward Hammond and Baton Rouge. Do not follow I-10 toward New Orleans.",
      "I-12 West about 85 miles past Covington and Hammond to Baton Rouge, where it ends at I-10. Follow I-10 West over the Mississippi River bridge.",
      "The Atchafalaya Basin Bridge: 18 miles over the swamp with no shoulder, so hold the speed limit. The welcome center at exit 121 is a restroom break if you need one.",
      "In Lafayette, exit 103A onto US-90 East (the Evangeline Thruway). South about 10 miles to Broussard.",
      "The Hampton Inn is on East Main Street (LA-182). Tap Navigate for the last turns.",
    ],
  },
  "thu-orange": {
    minutes: 105,
    endStopId: "thu-blue-elbow",
    directions: [
      "US-90 West (the Evangeline Thruway) north through Lafayette to I-10.",
      "I-10 West past Jennings and Lake Charles, over the Calcasieu River bridge.",
      "Cross the Sabine River into Texas. Take the Travel Information Center exit right after the bridge.",
    ],
  },
  "thu-houston": {
    minutes: 195,
    endStopId: "thu-high-hill",
    directions: [
      "Back to I-10 West through Orange and Beaumont, over the Neches River.",
      "Past Winnie and Baytown, over the San Jacinto River.",
      "Houston: stay on I-10 (the Katy Freeway) straight through. Mid-morning, so traffic should be moving.",
      "Past Katy, Sealy and Columbus, over the Brazos and Colorado rivers.",
      "Exit 674 (US-77, Schulenburg). North on US-77, then follow the signs out High Hill Road to the church, about 3 miles. The steeple shows above the fields.",
    ],
  },
  "thu-hill-country": {
    minutes: 195,
    endStopId: "thu-junction",
    directions: [
      "Back to Schulenburg and I-10 West at exit 674, past Flatonia, Luling and Seguin.",
      "San Antonio: stay on I-10 West through downtown, where it briefly shares lanes with I-35. Follow the I-10 West / El Paso signs.",
      "Northwest into the Hill Country past Boerne, Comfort and Kerrville (exit 508).",
      "Exit 456 into Junction. Gas at the ramp, then 5 minutes south on US-377 to South Llano River State Park.",
    ],
  },
  "thu-west-texas": {
    minutes: 160,
    directions: [
      "Back to I-10 West at exit 456.",
      "Sonora and Ozona. The limit is 80 mph and towns are 60 to 100 miles apart.",
      "Fort Stockton. The Hampton Inn is on the I-10 frontage road on the west side of town. Tap Navigate for the last turns.",
    ],
  },
  "fri-el-paso": {
    minutes: 240,
    endStopId: "fri-mesilla",
    directions: [
      "I-10 West from Fort Stockton, past Balmorhea (exit 209) with the Davis Mountains to the south.",
      "Van Horn (exit 138) at about 1.5 hours. Clocks go back an hour to Mountain time at the Hudspeth County line just after.",
      "El Paso: stay on I-10 West straight through the city, about 30 minutes, then into New Mexico.",
      "Exit 140 (NM-28, Avenida de Mesilla). South about 2 miles to the plaza in Old Mesilla.",
    ],
  },
  "fri-new-mexico": {
    minutes: 180,
    endStopId: "fri-texas-canyon",
    directions: [
      "Back to I-10 West at exit 140.",
      "Deming (exit 85) and Lordsburg: fuel in one of them.",
      "Into Arizona past San Simon and Willcox. Watch the blowing-dust signs.",
      "Texas Canyon rest area near mile 320, right off I-10. Follow the Rest Area sign.",
    ],
  },
  "fri-tucson": {
    minutes: 65,
    directions: [
      "I-10 West through Benson.",
      "Tucson: stay on I-10 through the city.",
      "Marana, on the northwest side. The Hampton Inn & Suites is on Marana Center Boulevard. Tap Navigate for the last turns.",
    ],
  },
  "sat-phoenix": {
    minutes: 155,
    endStopId: "sat-wickenburg",
    directions: [
      "I-10 West toward Phoenix. Picacho Peak, the volcanic spike, rises on the left near exit 219.",
      "Near Chandler, take Loop 202 West (the South Mountain Freeway). It skips downtown and rejoins I-10 West on the west side.",
      "I-10 West to Loop 303 North (exit 124).",
      "Loop 303 North to US-60 (Grand Avenue), then US-60 West about 30 miles into Wickenburg.",
    ],
  },
  "sat-us93": {
    minutes: 190,
    endStopId: "sat-hoover",
    directions: [
      "US-93 North out of Wickenburg toward Kingman.",
      "Joshua Forest Scenic Road: about 20 miles of Joshua trees on both sides, then the Burro Creek bridge and Wikieup.",
      "US-93 joins I-40 West through Kingman for a few miles, then leaves it northbound toward Las Vegas. Fuel in Kingman if the tank is under half.",
      "Cross the Colorado River on the Memorial Bridge into Nevada. Clocks go back an hour to Pacific time.",
      "Exit 2 (Hoover Dam) right after the bridge. Follow the dam road about 2 miles to the Memorial Bridge parking lot. There may be a quick security check.",
    ],
  },
  "sat-gorge": {
    minutes: 140,
    directions: [
      "Back up the dam road to I-11 North toward Henderson.",
      "I-215 West around the south side of Las Vegas to I-15 North, then out to Mesquite.",
      "Virgin River Gorge: about 29 miles of tight canyon. No stopping.",
      "Into Utah. Clocks go forward an hour. Exit 6 (Bluff Street) for the Hilton Garden Inn. Tap Navigate for the last turns.",
    ],
  },
  "sun-i15-summit": {
    minutes: 150,
    endStopId: "sun-fillmore",
    directions: [
      "From the hotel to I-15 North at exit 6. Only go if the 7:30 AM UDOT check said go.",
      "Cedar City at about 50 minutes, then Beaver.",
      "The 6,600-foot summit before Cove Fort. Watch the UDOT signs for traction-law notices.",
      "Exit 167 into Fillmore. The Territorial Statehouse is on Main Street in the middle of town.",
    ],
  },
  "sun-provo-canyon": {
    minutes: 150,
    directions: [
      "Back to I-15 North.",
      "Scipio and Nephi, then down into Utah Valley past Provo.",
      "Exit 272 (800 North, Orem). East on 800 North, which becomes US-189 into Provo Canyon.",
      "US-189 North up the canyon, past Bridal Veil Falls and Deer Creek Reservoir, into Heber.",
      "US-189 joins US-40 in Heber. Continue north on US-40 toward Park City.",
      "US-40 North past Jordanelle Reservoir to I-80. Take I-80 West.",
      "Exit 145 (Kimball Junction). Tap Navigate for the last turns to 900 Bitner Road.",
    ],
  },
};

// What Google Maps searches for at each stop.
export const stopPlaces: Record<string, string> = {
  "wed-defuniak": "Lake DeFuniak, Circle Drive, DeFuniak Springs, FL",
  "wed-davis-bayou": "Davis Bayou Area, Gulf Islands National Seashore, Ocean Springs, MS",
  "wed-dinner": "Broussard, LA",
  "thu-blue-elbow": "Texas Travel Information Center, Orange, TX",
  "thu-high-hill": "St. Mary's Catholic Church, High Hill, TX",
  "thu-junction": "South Llano River State Park, Junction, TX",
  "thu-dinner": "Fort Stockton, TX",
  "fri-mesilla": "Mesilla Plaza, Mesilla, NM",
  "fri-texas-canyon": "Texas Canyon Rest Area, I-10, Dragoon, AZ",
  "fri-dinner": "Marana Center, Marana, AZ",
  "sat-wickenburg": "Jail Tree, Wickenburg, AZ",
  "sat-hoover": "Mike O'Callaghan-Pat Tillman Memorial Bridge parking, Boulder City, NV",
  "sat-pioneer-park": "Pioneer Park, Red Hills Parkway, St. George, UT",
  "sat-dinner": "St. George, UT",
  "sun-fillmore": "Territorial Statehouse State Park Museum, Fillmore, UT",
  "sun-arrive": "900 Bitner Road, Park City, UT 84098",
};

// Street addresses for the nights, so Navigate lands on the hotel and not the town.
export const hotelAddresses: Record<string, string> = {
  broussard: "Hampton Inn Broussard-Lafayette Area, 2280 E Main St, Broussard, LA 70518",
  fort_stockton: "Hampton Inn Fort Stockton, 2271 W I-10, Fort Stockton, TX 79735",
  marana: "Hampton Inn & Suites Tucson Marana, 6300 W Marana Center Blvd, Tucson, AZ 85742",
  st_george: "Hilton Garden Inn St. George, 1731 S Convention Center Dr, St. George, UT 84790",
};

export function mapsDirectionsUrl(destination: string, origin?: string): string {
  const params = new URLSearchParams({ api: "1", destination, travelmode: "driving" });
  if (origin) {
    params.set("origin", origin);
  }
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
