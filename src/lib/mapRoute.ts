import type { MapFeature } from "../data/types";
import { assertNever } from "./money";

export interface RouteSegment {
  id: string;
  title: string;
  body: string;
}

export function featuresEqual(a: MapFeature | null, b: MapFeature | null): boolean {
  if (a == null || b == null) {
    return a == null && b == null;
  }
  switch (a.kind) {
    case "origin":
      return b.kind === "origin";
    case "dest":
      return b.kind === "dest";
    case "stop":
      return b.kind === "stop" && a.stopId === b.stopId;
    case "segment":
      return b.kind === "segment" && a.segmentId === b.segmentId;
    default:
      return assertNever(a);
  }
}

export function segmentForLeg(fromId: string, toId: string): RouteSegment {
  if (toId === "dest" || fromId === "kingman") {
    return {
      id: "sunday",
      title: "Sunday · Kingman to E17, keys about 4 PM",
      body: "Check UDOT in the room at 6:30 AM and leave at 7:00 AM. Over the Hoover Dam bridge, around Las Vegas, through the Virgin River Gorge to Pioneer Park in St. George and a second snow check. Then I-15 over the 6,600-foot summit around midday, lunch at Utah's first capitol in Fillmore, and Provo Canyon to Kimball Junction about 4:10 PM. If I-15 has snow, wait in St. George and call the landlord. The pin is 900 Bitner Road, Apartment E17.",
    };
  }
  if (toId === "kingman") {
    return {
      id: "saturday",
      title: "Saturday · Deming to Kingman",
      body: "Leave at 7:00 AM. The Texas Canyon boulders, past Tucson and Picacho Peak, around Phoenix on the loops, lunch in Wickenburg, and the Joshua trees on US-93 to Kingman by about 4:00 PM. Blowing dust near Lordsburg is the hazard, not snow.",
    };
  }
  if (toId === "deming") {
    return {
      id: "friday",
      title: "Friday · Seguin to Deming",
      body: "Leave at 6:00 AM. San Antonio before the rush, the South Llano River at Junction, lunch with the giant roadrunner in Fort Stockton, Van Horn and El Paso, the plaza in Old Mesilla, and Deming by about 4:20 PM.",
    };
  }
  if (toId === "seguin") {
    return {
      id: "thursday",
      title: "Thursday · Crestview to Seguin",
      body: "Leave at 6:00 AM. Breakfast at the Davis Bayou, lunch in the Atchafalaya swamp, Buc-ee's in Baytown, Houston at the start of the rush, and Seguin about 6:50 PM. The longest day.",
    };
  }
  return {
    id: "wednesday",
    title: "Wednesday · Gainesville to Crestview",
    body: "Leave 4922 Wednesday, November 11, after work at 5:30 PM EST. I-75 and I-10 in the dark, dinner and fuel at Quincy, and the Hampton Inn at Crestview's exit 56 about 9:25 PM CST. Sea level, no snow.",
  };
}
