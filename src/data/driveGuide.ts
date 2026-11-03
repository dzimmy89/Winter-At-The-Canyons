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
  "fri-deming": {
    minutes: 55,
    directions: [
      "Back to I-10 West at exit 140, past Las Cruces.",
      "About 55 miles of open desert.",
      "Exit 85 at the east edge of Deming. The Hampton Inn is on East Cedar Street. Tap Navigate for the last turns.",
    ],
  },
  "sat-new-mexico": {
    minutes: 135,
    endStopId: "sat-texas-canyon",
    directions: [
      "I-10 West from exit 85.",
      "Lordsburg: watch the blowing-dust signs from here to the Arizona line.",
      "Into Arizona past San Simon and Willcox.",
      "Texas Canyon rest area near mile 320, right off I-10. Follow the Rest Area sign.",
    ],
  },
  "sat-phoenix": {
    minutes: 220,
    endStopId: "sat-wickenburg",
    directions: [
      "I-10 West through Benson.",
      "Tucson: stay on I-10 through the city.",
      "Picacho Peak, the volcanic spike, rises on the left near exit 219.",
      "Near Chandler, take Loop 202 West (the South Mountain Freeway). It skips downtown and rejoins I-10 West on the west side.",
      "I-10 West to Loop 303 North (exit 124).",
      "Loop 303 North to US-60 (Grand Avenue), then US-60 West about 30 miles into Wickenburg.",
    ],
  },
  "sat-us93": {
    minutes: 120,
    directions: [
      "US-93 North out of Wickenburg toward Kingman.",
      "Joshua Forest Scenic Road: about 20 miles of Joshua trees on both sides, then the Burro Creek bridge and Wikieup.",
      "US-93 joins I-40 West into Kingman.",
      "Take the Stockton Hill Road exit. The Home2 Suites is on Sunrise Avenue. Tap Navigate for the last turns.",
    ],
  },
  "sun-gorge": {
    minutes: 205,
    endStopId: "sun-pioneer-park",
    directions: [
      "Check UDOT in the room at 6:30 AM. Then I-40 East a mile to US-93 North toward Las Vegas.",
      "US-93 North across the desert to the Hoover Dam bridge over the Colorado River into Nevada. Clocks go back an hour to Pacific time.",
      "I-11 North toward Henderson, then I-215 West around the south side of Las Vegas to I-15 North.",
      "I-15 North past Mesquite, then the Virgin River Gorge: about 29 miles of tight canyon. No stopping.",
      "Into Utah. Clocks go forward an hour. Exit 8 (St. George Boulevard), east to 1000 East, then Red Hills Parkway to Pioneer Park.",
    ],
  },
  "sun-i15-summit": {
    minutes: 150,
    endStopId: "sun-fillmore",
    directions: [
      "Back to I-15 North at exit 8. Only go if the UDOT check said go.",
      "Cedar City at about 50 minutes, then Beaver.",
      "The 6,600-foot summit before Cove Fort. Watch the UDOT signs for traction-law notices.",
      "Exit 167 into Fillmore. The Territorial Statehouse is on Main Street in the middle of town.",
    ],
  },
  "sun-provo-canyon": {
    minutes: 140,
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
  "fri-dinner": "Deming, NM",
  "sat-texas-canyon": "Texas Canyon Rest Area, I-10, Dragoon, AZ",
  "sat-wickenburg": "Jail Tree, Wickenburg, AZ",
  "sat-dinner": "Kingman, AZ",
  "sun-pioneer-park": "Pioneer Park, Red Hills Parkway, St. George, UT",
  "sun-fillmore": "Territorial Statehouse State Park Museum, Fillmore, UT",
  "sun-arrive": "900 Bitner Road, Park City, UT 84098",
};

// Street addresses for the nights, so Navigate lands on the hotel and not the town.
export const hotelAddresses: Record<string, string> = {
  crestview: "Hampton Inn Crestview South I-10, 112 John King Rd, Crestview, FL 32539",
  seguin: "Hampton Inn Seguin, 1130 Larkin Ave, Seguin, TX 78155",
  deming: "Hampton Inn Deming, 3751 E Cedar St, Deming, NM 88030",
  kingman: "Home2 Suites by Hilton Kingman, 1121 Sunrise Ave, Kingman, AZ 86401",
};

export function mapsDirectionsUrl(destination: string, origin?: string): string {
  const params = new URLSearchParams({ api: "1", destination, travelmode: "driving" });
  if (origin) {
    params.set("origin", origin);
  }
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
