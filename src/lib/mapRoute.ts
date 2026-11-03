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
  if (toId === "dest" || fromId === "st_george") {
    return {
      id: "sunday",
      title: "Sunday · St. George to E17, keys by 2 PM",
      body: "Check UDOT in the hotel room at 7:30 AM and leave at 8:00 AM. I-15 over the 6,600-foot summit in the morning, Utah's first capitol in Fillmore, and Provo Canyon to Kimball Junction about 1:15 PM. If I-15 has snow, keep the room and call the landlord. The pin is 900 Bitner Road, Apartment E17.",
    };
  }
  if (toId === "st_george") {
    return {
      id: "saturday",
      title: "Saturday · Lordsburg to St. George",
      body: "Leave at 6:00 AM. Sunrise over the Arizona line, Picacho Peak, around Phoenix on the loops, lunch in Wickenburg, the Joshua trees on US-93, the bridge over Hoover Dam, and the Virgin River Gorge at dusk to St. George about 5:45 PM.",
    };
  }
  if (toId === "lordsburg") {
    return {
      id: "friday",
      title: "Friday · Seguin to Lordsburg",
      body: "Leave at 6:00 AM. San Antonio before the rush, the South Llano River at Junction, lunch with the giant roadrunner in Fort Stockton, Van Horn and El Paso, the plaza in Old Mesilla, and Lordsburg about 5:15 PM.",
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
