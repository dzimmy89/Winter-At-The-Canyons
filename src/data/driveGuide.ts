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
      "I-75 North about 40 miles, past Alachua and High Springs, in the dark.",
      "Exit 435 onto I-10 West toward Tallahassee.",
    ],
  },
  "thu-big-bend": {
    minutes: 145,
    endStopId: "thu-marianna",
    directions: [
      "I-10 West the whole way. Sunrise comes around Madison.",
      "Tallahassee at about 1.5 hours (exits 199 to 209). Stay on I-10.",
      "Cross the Apalachicola River near exit 158. Clocks go back one hour to Central.",
      "Exit 142 (SR-71, Marianna) for gas and breakfast at the ramp.",
    ],
  },
  "thu-coast": {
    minutes: 205,
    endStopId: "thu-davis-bayou",
    directions: [
      "Back to I-10 West at exit 142, past Chipley, DeFuniak Springs and Crestview.",
      "Pensacola: stay on I-10 through the city exits.",
      "Into Alabama. In Mobile, I-10 crosses the bay causeway and runs through the Wallace Tunnel. Stay on I-10.",
      "Into Mississippi. Exit 50 (Ocean Springs). Head south toward town and follow the brown signs for Gulf Islands National Seashore, Davis Bayou.",
    ],
  },
  "thu-louisiana": {
    minutes: 165,
    endStopId: "thu-atchafalaya",
    directions: [
      "Back to I-10 West at exit 50, past Gulfport.",
      "Cross the Pearl River into Louisiana. At Slidell keep right for I-12 West toward Hammond and Baton Rouge. Do not follow I-10 toward New Orleans.",
      "I-12 West about 85 miles past Covington and Hammond to Baton Rouge, where it ends at I-10. Follow I-10 West over the Mississippi River bridge.",
      "Onto the Atchafalaya Basin Bridge. Exit 121 (Butte La Rose) for the welcome center, partway across.",
    ],
  },
  "thu-winnie": {
    minutes: 155,
    directions: [
      "Back to I-10 West at exit 121 and finish the basin bridge. No shoulder, so hold the speed limit.",
      "Lafayette and Lake Charles: stay on I-10, including the Calcasieu River bridge.",
      "Cross the Sabine River into Texas at Orange. The Texas Travel Information Center just past the state line is a restroom break if you need one.",
      "Beaumont: stay on I-10 through the city and over the Neches River.",
      "Exit 829 (Winnie). The Hampton Inn & Suites is on Spur 5 at the exit.",
    ],
  },
  "fri-houston": {
    minutes: 110,
    endStopId: "fri-san-felipe",
    directions: [
      "I-10 West from exit 829, past Baytown and over the San Jacinto River.",
      "Houston: stay on I-10 (the Katy Freeway) straight through. It is early in the Friday rush, so allow an extra 30 minutes.",
      "Exit 723 (FM 1458, San Felipe). North about 2 miles to the historic site.",
    ],
  },
  "fri-hill-country": {
    minutes: 235,
    endStopId: "fri-junction",
    directions: [
      "Back to I-10 West at exit 723, past Columbus, Schulenburg and Seguin.",
      "San Antonio: stay on I-10 West through downtown, where it briefly shares lanes with I-35. Follow the I-10 West / El Paso signs.",
      "Northwest into the Hill Country past Boerne, Comfort and Kerrville (exit 508).",
      "Exit 456 into Junction. Gas at the ramp, then 5 minutes south on US-377 to South Llano River State Park.",
    ],
  },
  "fri-west-texas": {
    minutes: 160,
    endStopId: "fri-fort-stockton",
    directions: [
      "Back to I-10 West at exit 456.",
      "Sonora and Ozona. The limit is 80 mph and towns are 60 to 100 miles apart.",
      "Exit 257 into Fort Stockton for gas.",
    ],
  },
  "fri-van-horn": {
    minutes: 95,
    directions: [
      "Back to I-10 West.",
      "Past Balmorhea (exit 209) with the Davis Mountains to the south. It gets dark in the last half hour.",
      "Exit 138 into Van Horn. The Hampton Inn is on the southwest frontage road. Tap Navigate for the last turns.",
    ],
  },
  "sat-el-paso": {
    minutes: 145,
    endStopId: "sat-mesilla",
    directions: [
      "I-10 West from Van Horn, in the dark. Clocks go back an hour to Mountain time at the Hudspeth County line.",
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
  "sat-tucson": {
    minutes: 90,
    endStopId: "sat-picacho",
    directions: [
      "I-10 West through Benson.",
      "Tucson: stay on I-10 through the city.",
      "Exit 219 (Picacho Peak Road). The park entrance is at the exit.",
    ],
  },
  "sat-phoenix": {
    minutes: 125,
    endStopId: "sat-wickenburg",
    directions: [
      "I-10 West toward Phoenix.",
      "Near Chandler, take Loop 202 West (the South Mountain Freeway). It skips downtown and rejoins I-10 West on the west side.",
      "I-10 West to Loop 303 North (exit 124).",
      "Loop 303 North to US-60 (Grand Avenue), then US-60 West about 30 miles into Wickenburg.",
    ],
  },
  "sat-us93": {
    minutes: 120,
    directions: [
      "US-93 North out of Wickenburg toward Kingman.",
      "Joshua Forest Scenic Road: about 20 miles of Joshua trees on both sides, then the Burro Creek bridge.",
      "Through Wikieup. US-93 joins I-40 West into Kingman.",
      "Take the Stockton Hill Road exit. The Home2 Suites is on Sunrise Avenue. Tap Navigate for the last turns.",
    ],
  },
  "sun-gorge": {
    minutes: 210,
    endStopId: "sun-st-george",
    directions: [
      "I-40 to US-93 North toward Las Vegas, in the dark.",
      "Over the Hoover Dam bypass bridge into Nevada (Pacific time), then I-11 North toward Henderson.",
      "I-215 West around the south side of Las Vegas to I-15 North, then out to Mesquite.",
      "Virgin River Gorge: about 29 miles of tight canyon at first light. No stopping.",
      "Into Utah. Clocks go forward an hour. Take a St. George exit for gas.",
    ],
  },
  "sun-i15-summit": {
    minutes: 150,
    endStopId: "sun-fillmore",
    directions: [
      "Back to I-15 North. Only go on if the St. George UDOT check said go.",
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
      "Scipio and Nephi, then down into Utah Valley past Provo.",
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
  "thu-marianna": "I-10 Exit 142, Marianna, FL",
  "thu-davis-bayou": "Davis Bayou Area, Gulf Islands National Seashore, Ocean Springs, MS",
  "thu-atchafalaya": "Atchafalaya Welcome Center, Butte La Rose, LA",
  "thu-dinner": "Winnie, TX",
  "fri-san-felipe": "San Felipe de Austin State Historic Site, San Felipe, TX",
  "fri-junction": "South Llano River State Park, Junction, TX",
  "fri-fort-stockton": "Paisano Pete, Fort Stockton, TX",
  "fri-dinner": "Van Horn, TX",
  "sat-mesilla": "Mesilla Plaza, Mesilla, NM",
  "sat-texas-canyon": "Texas Canyon Rest Area, I-10, Dragoon, AZ",
  "sat-picacho": "Picacho Peak State Park, Picacho, AZ",
  "sat-wickenburg": "Jail Tree, Wickenburg, AZ",
  "sat-dinner": "Kingman, AZ",
  "sun-st-george": "I-15 Exit 8, St. George, UT",
  "sun-fillmore": "I-15 Exit 167, Fillmore, UT",
  "sun-arrive": "900 Bitner Road, Park City, UT 84098",
};

// Street addresses for the nights, so Navigate lands on the hotel and not the town.
export const hotelAddresses: Record<string, string> = {
  winnie: "Hampton Inn & Suites Winnie, 318 Spur 5, Winnie, TX 77665",
  van_horn: "Hampton Inn Van Horn, 1921 SW Frontage Rd, Van Horn, TX 79855",
  kingman: "Home2 Suites by Hilton Kingman, 1121 Sunrise Ave, Kingman, AZ 86401",
  st_george: "Hilton Garden Inn St. George, 1731 S Convention Center Dr, St. George, UT 84790",
};

export function mapsDirectionsUrl(destination: string, origin?: string): string {
  const params = new URLSearchParams({ api: "1", destination, travelmode: "driving" });
  if (origin) {
    params.set("origin", origin);
  }
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
