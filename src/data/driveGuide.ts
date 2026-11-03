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
  "wed-big-bend": {
    minutes: 155,
    endStopId: "wed-quincy",
    directions: [
      "Neighborhood streets to the nearest I-75 on-ramp. Tap Navigate for the turns out of the driveway.",
      "I-75 North about 40 miles, past Alachua and High Springs.",
      "Exit 435 onto I-10 West toward Tallahassee. Then I-10 West the whole way.",
      "Live Oak and Madison, then Tallahassee at about 2 hours (exits 199 to 209). Stay on I-10.",
      "Exit 181 (FL-267, Quincy). Gas and food are at the exit.",
    ],
  },
  "wed-panhandle": {
    minutes: 110,
    directions: [
      "Back to I-10 West at exit 181.",
      "Cross the Apalachicola River near exit 158. Clocks go back one hour to Central.",
      "Past Marianna (exit 142), Chipley (exit 120) and DeFuniak Springs (exit 85).",
      "Exit 56 (FL-85, Crestview). The Hampton Inn is right at the exit on the south side. Tap Navigate for the last turns.",
    ],
  },
  "thu-coast": {
    minutes: 135,
    endStopId: "thu-davis-bayou",
    directions: [
      "I-10 West from exit 56, as the sky gets light.",
      "Pensacola: stay on I-10 over Escambia Bay and through the city exits.",
      "Into Alabama. In Mobile, I-10 crosses the bay causeway and runs through the Wallace Tunnel. Stay on I-10.",
      "Into Mississippi. Exit 50 (Ocean Springs). Head south toward town and follow the brown signs for Gulf Islands National Seashore, Davis Bayou.",
    ],
  },
  "thu-louisiana": {
    minutes: 170,
    endStopId: "thu-atchafalaya",
    directions: [
      "Back to I-10 West at exit 50, past Gulfport.",
      "Cross the Pearl River into Louisiana. At Slidell keep right for I-12 West toward Hammond and Baton Rouge. Do not follow I-10 toward New Orleans.",
      "I-12 West about 85 miles past Covington and Hammond to Baton Rouge, where it ends at I-10. Follow I-10 West over the Mississippi River bridge.",
      "Onto the Atchafalaya Basin Bridge, 18 miles over the swamp with no shoulder, so hold the speed limit.",
      "Exit 121 (Butte La Rose), halfway across. The welcome center is right at the exit.",
    ],
  },
  "thu-texas-line": {
    minutes: 190,
    endStopId: "thu-baytown",
    directions: [
      "Back onto I-10 West to finish the basin bridge.",
      "Lafayette: stay on I-10 past the US-90 and I-49 exits.",
      "Jennings and Lake Charles, over the Calcasieu River bridge.",
      "Cross the Sabine River into Texas at Orange, then Beaumont and Winnie.",
      "Baytown: the Buc-ee's exit is about exit 790, and the beaver billboards count down to it. Follow the frontage road in.",
    ],
  },
  "thu-houston": {
    minutes: 190,
    directions: [
      "Back to I-10 West.",
      "Houston: stay on I-10 (the Katy Freeway) straight through, about 45 minutes. The afternoon rush is starting, so keep to the middle lanes.",
      "Past Katy, Sealy and Columbus, over the Brazos and Colorado rivers.",
      "Schulenburg (exit 674) and Luling in the dusk.",
      "Exit 610 at Seguin. The Hampton Inn is on Larkin Avenue near the exit. Tap Navigate for the last turns.",
    ],
  },
  "fri-hill-country": {
    minutes: 140,
    endStopId: "fri-junction",
    directions: [
      "I-10 West from Seguin toward San Antonio.",
      "San Antonio: stay on I-10 West through downtown, where it briefly shares lanes with I-35. Follow the I-10 West / El Paso signs. At 6:30 AM it is quiet.",
      "Northwest into the Hill Country past Boerne, Comfort and Kerrville (exit 508).",
      "Exit 456 into Junction. Gas at the ramp, then 5 minutes south on US-377 to South Llano River State Park.",
    ],
  },
  "fri-west-texas": {
    minutes: 170,
    endStopId: "fri-fort-stockton",
    directions: [
      "Back to I-10 West at exit 456.",
      "Sonora and Ozona. The limit is 80 mph and towns are 60 to 100 miles apart.",
      "Exit 257 into Fort Stockton. Food and gas are at the exit; Paisano Pete is two minutes in on Dickinson Boulevard.",
    ],
  },
  "fri-el-paso": {
    minutes: 235,
    endStopId: "fri-mesilla",
    directions: [
      "Back to I-10 West, past Balmorhea (exit 209) with the Davis Mountains to the south.",
      "Van Horn (exit 138) at about 1.5 hours. Clocks go back an hour to Mountain time at the Hudspeth County line just after.",
      "El Paso: stay on I-10 West straight through the city, about 30 minutes, then into New Mexico.",
      "Exit 140 (NM-28, Avenida de Mesilla). South about 2 miles to the plaza in Old Mesilla.",
    ],
  },
  "fri-lordsburg": {
    minutes: 110,
    directions: [
      "Back to I-10 West at exit 140, past Las Cruces.",
      "About 55 miles of open desert to Deming (exit 85). Fuel here if the tank is under half.",
      "Another hour west across the desert, toward the sunset.",
      "Exit 22 into Lordsburg. The Hampton Inn is on West Wabash Street. Tap Navigate for the last turns.",
    ],
  },
  "sat-picacho": {
    minutes: 175,
    endStopId: "sat-picacho",
    directions: [
      "I-10 West from Lordsburg in the dark. Watch the blowing-dust signs from here to the Arizona line.",
      "Into Arizona past San Simon and Willcox as the sun comes up, then the Texas Canyon boulders.",
      "Down through Benson.",
      "Tucson: stay on I-10 through the city.",
      "Exit 219 (Picacho Peak). The state park entrance is right at the exit.",
    ],
  },
  "sat-phoenix": {
    minutes: 125,
    endStopId: "sat-wickenburg",
    directions: [
      "Back to I-10 West toward Phoenix, past Casa Grande.",
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
      "Virgin River Gorge: about 29 miles of tight canyon, around sunset. Headlights on, no stopping.",
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
  "wed-quincy": "I-10 exit 181, Quincy, FL",
  "thu-davis-bayou": "Davis Bayou Area, Gulf Islands National Seashore, Ocean Springs, MS",
  "thu-atchafalaya": "Atchafalaya Welcome Center, I-10 exit 121, Butte La Rose, LA",
  "thu-baytown": "Buc-ee's, I-10 East Freeway, Baytown, TX",
  "thu-dinner": "Seguin, TX",
  "fri-junction": "South Llano River State Park, Junction, TX",
  "fri-fort-stockton": "Paisano Pete, Fort Stockton, TX",
  "fri-mesilla": "Mesilla Plaza, Mesilla, NM",
  "fri-dinner": "Lordsburg, NM",
  "sat-picacho": "Picacho Peak State Park, Picacho, AZ",
  "sat-wickenburg": "Jail Tree, Wickenburg, AZ",
  "sat-hoover": "Mike O'Callaghan-Pat Tillman Memorial Bridge parking, Boulder City, NV",
  "sat-dinner": "St. George, UT",
  "sun-fillmore": "Territorial Statehouse State Park Museum, Fillmore, UT",
  "sun-arrive": "900 Bitner Road, Park City, UT 84098",
};

// Street addresses for the nights, so Navigate lands on the hotel and not the town.
export const hotelAddresses: Record<string, string> = {
  crestview: "Hampton Inn Crestview South I-10, 112 John King Rd, Crestview, FL 32539",
  seguin: "Hampton Inn Seguin, 1130 Larkin Ave, Seguin, TX 78155",
  lordsburg: "Hampton Inn Lordsburg, 412 W Wabash St, Lordsburg, NM 88045",
  st_george: "Hilton Garden Inn St. George, 1731 S Convention Center Dr, St. George, UT 84790",
};

export function mapsDirectionsUrl(destination: string, origin?: string): string {
  const params = new URLSearchParams({ api: "1", destination, travelmode: "driving" });
  if (origin) {
    params.set("origin", origin);
  }
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
