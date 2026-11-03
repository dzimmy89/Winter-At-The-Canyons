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
    minutes: 185,
    directions: [
      "Back to I-10 West at exit 181.",
      "Cross the Apalachicola River near exit 158. Clocks go back one hour to Central.",
      "Past Marianna (exit 142), DeFuniak Springs (exit 85) and Crestview (exit 56).",
      "Pensacola: stay on I-10 over Escambia Bay and past the city exits.",
      "Cross the Perdido River into Alabama.",
      "Exit 35 (US-98, Daphne/Fairhope). The Hilton Garden Inn is on US-98 (North Main Street) just south of the exit. Tap Navigate for the last turns.",
    ],
  },
  "thu-louisiana": {
    minutes: 215,
    endStopId: "thu-atchafalaya",
    directions: [
      "Back to I-10 West at exit 35, onto the Jubilee Parkway over Mobile Bay as the sun comes up.",
      "Mobile: I-10 runs through the Wallace Tunnel under the Mobile River. Stay on I-10.",
      "Into Mississippi, past Pascagoula, Biloxi and Gulfport.",
      "Cross the Pearl River into Louisiana. At Slidell keep right for I-12 West toward Hammond and Baton Rouge. Do not follow I-10 toward New Orleans.",
      "I-12 West about 85 miles past Covington and Hammond to Baton Rouge, where it ends at I-10. Follow I-10 West over the Mississippi River bridge.",
      "Onto the Atchafalaya Basin Bridge, 18 miles over the swamp with no shoulder, so hold the speed limit.",
      "Exit 121 (Butte La Rose), halfway across. The welcome center is right at the exit.",
    ],
  },
  "thu-texas-line": {
    minutes: 245,
    endStopId: "thu-katy",
    directions: [
      "Back onto I-10 West to finish the basin bridge.",
      "Lafayette: stay on I-10 past the US-90 and I-49 exits.",
      "Jennings and Lake Charles, over the Calcasieu River bridge.",
      "Cross the Sabine River into Texas at Orange, then Beaumont, Winnie and Baytown.",
      "Houston: stay on I-10 (the Katy Freeway) straight through, about 45 minutes. At 2:00 PM it is ahead of the rush.",
      "Katy: the Buc-ee's is on the frontage road at the west edge of town, about exit 741. The beaver billboards count down to it.",
    ],
  },
  "thu-hill-country": {
    minutes: 215,
    directions: [
      "Back to I-10 West.",
      "Past Sealy and Columbus, over the Brazos and Colorado rivers, then Schulenburg (exit 674) and Seguin (exit 610).",
      "San Antonio: stay on I-10 West through downtown, where it briefly shares lanes with I-35. Follow the I-10 West / El Paso signs. It is the evening rush, so keep to the middle lanes.",
      "Northwest into the Hill Country past Boerne and Comfort, in the dark. Watch for deer.",
      "Exit 508 (TX-16, Kerrville). The Hampton Inn is on Sidney Baker Street right at the exit. Tap Navigate for the last turns.",
    ],
  },
  "fri-west-texas": {
    minutes: 210,
    endStopId: "fri-fort-stockton",
    directions: [
      "I-10 West from exit 508 in the dark. Deer are thick for the first hour, so hold the speed down until it is light.",
      "Junction (exit 456), then Sonora and Ozona as the sun comes up. The limit is 80 mph and towns are 60 to 100 miles apart.",
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
  "fri-marana": {
    minutes: 260,
    directions: [
      "Back to I-10 West at exit 140, past Las Cruces.",
      "About 55 miles of open desert to Deming (exit 85). Fuel here if the tank is under half.",
      "Past Lordsburg. Watch the blowing-dust signs from here to the Arizona line.",
      "Into Arizona at San Simon, then Willcox, the Texas Canyon boulders and Benson as the sun goes down.",
      "Tucson: stay on I-10 through the city, about 20 minutes, no exits.",
      "Exit 240 (Tangerine Road). The Hampton Inn & Suites is in the Marana Center shopping area by the exit. Tap Navigate for the last turns.",
    ],
  },
  "sat-us93": {
    minutes: 270,
    endStopId: "sat-kingman",
    directions: [
      "I-10 West from exit 240 toward Phoenix. Picacho Peak rises on the left after 20 minutes, then Casa Grande.",
      "Near Chandler, take Loop 202 West (the South Mountain Freeway). It skips downtown and rejoins I-10 West on the west side.",
      "I-10 West to Loop 303 North (exit 124), then Loop 303 North to US-60 (Grand Avenue) and US-60 West through Wickenburg.",
      "US-93 North out of Wickenburg: about 20 miles of Joshua trees, then the Burro Creek bridge and Wikieup.",
      "US-93 joins I-40 West into Kingman. Take exit 48 (Beale Street) downtown; the Powerhouse is on Andy Devine Avenue (Route 66).",
    ],
  },
  "sat-gorge": {
    minutes: 210,
    directions: [
      "Back to exit 48 and take US-93 North toward Las Vegas.",
      "About an hour across the desert, then over the Colorado River on the Memorial Bridge, with Hoover Dam just upstream. Clocks go back an hour to Pacific time in Nevada.",
      "I-11 North toward Henderson, then I-215 West around the south side of Las Vegas to I-15 North, and out to Mesquite.",
      "Virgin River Gorge: about 29 miles of tight canyon, in afternoon light. Headlights on, no stopping.",
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
  "thu-atchafalaya": "Atchafalaya Welcome Center, I-10 exit 121, Butte La Rose, LA",
  "thu-katy": "Buc-ee's, Katy Freeway, Katy, TX",
  "thu-dinner": "Kerrville, TX",
  "fri-fort-stockton": "Paisano Pete, Fort Stockton, TX",
  "fri-mesilla": "Mesilla Plaza, Mesilla, NM",
  "fri-dinner": "Tucson Premium Outlets, Marana, AZ",
  "sat-kingman": "Powerhouse Visitor Center, 120 W Andy Devine Ave, Kingman, AZ",
  "sat-dinner": "St. George, UT",
  "sun-fillmore": "Territorial Statehouse State Park Museum, Fillmore, UT",
  "sun-arrive": "900 Bitner Road, Park City, UT 84098",
};

// Street addresses for the nights, so Navigate lands on the hotel and not the town.
export const hotelAddresses: Record<string, string> = {
  daphne: "Hilton Garden Inn Mobile East Bay/Daphne, 29546 N Main St, Daphne, AL 36526",
  kerrville: "Hampton Inn Kerrville, 2038 Sidney Baker St, Kerrville, TX 78028",
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
