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
  "wed-panhandle": {
    minutes: 170,
    endStopId: "wed-falling-waters",
    directions: [
      "I-10 West the whole way.",
      "Tallahassee comes at about 1.5 hours (exits 199 to 209). Stay on I-10.",
      "Cross the Apalachicola River near exit 158. Clocks go back one hour to Central.",
      "Exit 120 (SR-77, Chipley). Head south on SR-77 about 3 miles and follow the brown signs to Falling Waters State Park.",
    ],
  },
  "wed-coast": {
    minutes: 215,
    endStopId: "wed-davis-bayou",
    directions: [
      "Back to I-10 West at exit 120.",
      "Pensacola: stay on I-10 through the city exits.",
      "Into Alabama. In Mobile, I-10 crosses the bay causeway and runs through the Wallace Tunnel. Stay on I-10.",
      "Into Mississippi. Exit 50 (Ocean Springs). Head south toward town and follow the brown signs for Gulf Islands National Seashore, Davis Bayou.",
    ],
  },
  "wed-north-shore": {
    minutes: 70,
    directions: [
      "Back to I-10 West at exit 50.",
      "Cross the Pearl River into Louisiana. At Slidell keep right for I-12 West toward Hammond and Baton Rouge. Do not follow I-10 toward New Orleans.",
      "I-12 West about 25 miles to exit 63 (US-190, Covington and Mandeville).",
      "The Hampton Inn is on the US-190 service road at the exit.",
    ],
  },
  "thu-louisiana": {
    minutes: 195,
    endStopId: "thu-orange",
    directions: [
      "I-12 West from exit 63, about 55 miles to Baton Rouge.",
      "I-12 ends at I-10 in Baton Rouge. Follow I-10 West over the Mississippi River bridge.",
      "The 18-mile Atchafalaya Basin Bridge, roughly exits 135 to 121. No shoulder, so hold the speed limit.",
      "Lafayette and Lake Charles: stay on I-10. Fuel in Sulphur, the last exits before Texas.",
      "Cross the Sabine River into Texas. Exit 880 for the Texas Travel Information Center, right after the bridge.",
    ],
  },
  "thu-houston": {
    minutes: 145,
    endStopId: "thu-san-felipe",
    directions: [
      "I-10 West through Orange and Beaumont.",
      "Houston: stay on I-10 (the Katy Freeway) straight through. Allow about 45 minutes in the city.",
      "Exit 723 (FM 1458, San Felipe). North about 2 miles to the historic site.",
    ],
  },
  "thu-luling": {
    minutes: 95,
    endStopId: "thu-luling",
    directions: [
      "Back to I-10 West at exit 723.",
      "Past Columbus and Schulenburg to exit 632 (US-183).",
      "North on US-183 about 6 miles into Luling. City Market is downtown on East Davis Street.",
    ],
  },
  "thu-hill-country": {
    minutes: 110,
    directions: [
      "South on US-183 back to I-10 West.",
      "San Antonio: stay on I-10 West through downtown, where it briefly shares lanes with I-35. Follow the I-10 West / El Paso signs.",
      "Northwest into the Hill Country past Boerne.",
      "Exit 508 (TX-16, Kerrville). The Hampton Inn is on Sidney Baker Street (TX-16) heading into town.",
    ],
  },
  "fri-west-texas": {
    minutes: 245,
    endStopId: "fri-balmorhea",
    directions: [
      "TX-16 back to I-10 West at exit 508.",
      "Junction (about 45 minutes, exit 456): fuel here or in Ozona.",
      "Sonora, Ozona, Fort Stockton. The limit is 80 mph and towns are 60 to 100 miles apart.",
      "Exit 209 for TX-17 and follow the signs about 7 miles through Balmorhea to the state park at Toyahvale.",
    ],
  },
  "fri-el-paso": {
    minutes: 195,
    endStopId: "fri-mesilla",
    directions: [
      "TX-17 back north to I-10 West.",
      "Van Horn is the last easy fuel before El Paso. Clocks go back an hour to Mountain time west of Van Horn.",
      "El Paso: stay on I-10 West straight through the city, about 30 minutes, then into New Mexico.",
      "Exit 140 (NM-28, Avenida de Mesilla). South about 2 miles to the plaza in Old Mesilla.",
    ],
  },
  "fri-deming": {
    minutes: 52,
    directions: [
      "Back to I-10 West at exit 140.",
      "About 55 miles of open desert with the Florida Mountains to the south.",
      "Exit 85 into Deming. The Hampton Inn is on East Cedar Street near the exit.",
    ],
  },
  "sat-texas-canyon": {
    minutes: 135,
    endStopId: "sat-texas-canyon",
    directions: [
      "I-10 West from Deming.",
      "Lordsburg: fuel if the tank is under half.",
      "Into Arizona past San Simon and Willcox. Watch the blowing-dust signs.",
      "Texas Canyon rest area near mile 320, right off I-10. Follow the Rest Area sign.",
    ],
  },
  "sat-picacho": {
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
    minutes: 58,
    endStopId: "sat-burro-creek",
    directions: [
      "US-93 North out of Wickenburg toward Kingman.",
      "Joshua Forest Scenic Road: about 20 miles of Joshua trees on both sides.",
      "Pull into the signed vista area at the Burro Creek bridge.",
    ],
  },
  "sat-kingman": {
    minutes: 62,
    directions: [
      "US-93 North through Wikieup.",
      "US-93 joins I-40 West into Kingman.",
      "Exit for the north side of town. The Home2 Suites is on Sunrise Avenue. Tap Navigate for the last mile.",
    ],
  },
  "sun-hoover": {
    minutes: 70,
    endStopId: "sun-hoover",
    directions: [
      "From the hotel to I-40, then US-93 North toward Las Vegas.",
      "About 70 miles of divided highway across the desert.",
      "Exit 2 (Hoover Dam). Pass the security checkpoint and follow the signs to the Memorial Bridge walkway parking.",
    ],
  },
  "sun-gorge": {
    minutes: 165,
    endStopId: "sun-kolob",
    directions: [
      "Back to I-11 North toward Henderson.",
      "I-215 West around the south side of Las Vegas to I-15 North.",
      "I-15 North out of the city to Mesquite at the Arizona line.",
      "Virgin River Gorge: about 29 miles of tight canyon through the corner of Arizona. No stopping.",
      "Into Utah. Fuel in St. George.",
      "Exit 40 (Kolob Canyons). The visitor center is at the end of the ramp.",
    ],
  },
  "sun-cedar": {
    minutes: 18,
    endStopId: "sun-cedar-city",
    directions: ["Back to I-15 North.", "Exit 57 or 59 for Cedar City lunch and fuel."],
  },
  "sun-i15-summit": {
    minutes: 195,
    endStopId: "sun-bridal-veil",
    directions: [
      "I-15 North from Cedar City. This is the snow check of the trip.",
      "Beaver, then the 6,600-foot summit before Cove Fort. Watch the UDOT signs for traction-law notices.",
      "Fillmore, Scipio, and Nephi, then down into Utah Valley.",
      "Exit 272 (800 North, Orem). East on 800 North, which becomes US-189 into Provo Canyon.",
      "Bridal Veil Falls parking is on the right, about 3 miles up the canyon.",
    ],
  },
  "sun-provo-canyon": {
    minutes: 52,
    directions: [
      "US-189 North up the canyon, past Deer Creek Reservoir, into Heber.",
      "US-189 joins US-40 in Heber. Continue north on US-40 toward Park City.",
      "US-40 North past Jordanelle Reservoir to I-80. Take I-80 West.",
      "Exit 145 (Kimball Junction). Tap Navigate for the last turns to 900 Bitner Road.",
    ],
  },
};

// What Google Maps searches for at each stop.
export const stopPlaces: Record<string, string> = {
  "wed-falling-waters": "Falling Waters State Park, Chipley, FL",
  "wed-davis-bayou": "Davis Bayou Area, Gulf Islands National Seashore, Ocean Springs, MS",
  "wed-lakefront": "Mandeville Lakefront, Lakeshore Drive, Mandeville, LA",
  "wed-dinner": "Downtown Covington, LA",
  "thu-orange": "Texas Travel Information Center, Orange, TX",
  "thu-san-felipe": "San Felipe de Austin State Historic Site, San Felipe, TX",
  "thu-luling": "City Market, 633 E Davis St, Luling, TX",
  "thu-river-trail": "Louise Hays Park, Kerrville, TX",
  "thu-dinner": "Kerrville, TX",
  "fri-balmorhea": "Balmorhea State Park, Toyahvale, TX",
  "fri-mesilla": "Mesilla Plaza, Mesilla, NM",
  "fri-dinner": "Deming, NM",
  "sat-texas-canyon": "Texas Canyon Rest Area, I-10, Dragoon, AZ",
  "sat-picacho": "Picacho Peak State Park, Picacho, AZ",
  "sat-wickenburg": "Jail Tree, Wickenburg, AZ",
  "sat-burro-creek": "Burro Creek Bridge, US-93, Arizona",
  "sat-dinner": "Historic Route 66, Kingman, AZ",
  "sun-hoover": "Mike O'Callaghan-Pat Tillman Memorial Bridge, Boulder City, NV",
  "sun-kolob": "Kolob Canyons Visitor Center, New Harmony, UT",
  "sun-cedar-city": "Cedar City, UT",
  "sun-bridal-veil": "Bridal Veil Falls, Provo Canyon, UT",
  "sun-dinner": "Kimball Junction, Park City, UT",
};

// Street addresses for the nights, so Navigate lands on the hotel and not the town.
export const hotelAddresses: Record<string, string> = {
  covington: "Hampton Inn Covington, 68700 Hwy 190 Service Rd, Covington, LA 70433",
  kerrville: "Hampton Inn Kerrville, 2038 Sidney Baker St, Kerrville, TX 78028",
  deming: "Hampton Inn Deming, 3751 E Cedar St, Deming, NM 88030",
  kingman: "Home2 Suites by Hilton Kingman, 1121 Sunrise Ave, Kingman, AZ 86401",
  st_george: "Hampton Inn & Suites St. George, 1250 W SunRiver Pkwy, St. George, UT 84790",
};

export function mapsDirectionsUrl(destination: string, origin?: string): string {
  const params = new URLSearchParams({ api: "1", destination, travelmode: "driving" });
  if (origin) {
    params.set("origin", origin);
  }
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
