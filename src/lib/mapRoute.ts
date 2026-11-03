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
      body: "Check UDOT in the hotel room at 6:30 AM and leave at 7:00 AM. One straight run with no planned stops: I-15 over the 6,600-foot summit in the morning and Provo Canyon to Kimball Junction about noon. If I-15 has snow, keep the room and call the landlord. The pin is 900 Bitner Road, Apartment E17.",
    };
  }
  if (toId === "st_george") {
    return {
      id: "saturday",
      title: "Saturday · Marana to St. George",
      body: "Leave at 7:30 AM after the long day. Past Picacho Peak, around Phoenix on the loops, the Joshua trees on US-93, lunch on Route 66 in Kingman, the bridge beside Hoover Dam, and the Virgin River Gorge in daylight to St. George about 4:10 PM.",
    };
  }
  if (toId === "marana") {
    return {
      id: "friday",
      title: "Friday · Kerrville to Marana",
      body: "Leave at 6:00 AM. The longest day, almost 12 hours at mostly 75 to 80 mph: breakfast with the giant roadrunner in Fort Stockton, Van Horn and El Paso, lunch on the plaza in Old Mesilla, the Texas Canyon boulders near sunset, and Marana about 5:55 PM.",
    };
  }
  if (toId === "kerrville") {
    return {
      id: "thursday",
      title: "Thursday · Daphne to Kerrville",
      body: "Leave at 6:30 AM over Mobile Bay at sunrise. Brunch in the Atchafalaya swamp, Houston before its rush, a late lunch at Buc-ee's in Katy, and Kerrville in the Hill Country about 6:50 PM.",
    };
  }
  return {
    id: "wednesday",
    title: "Wednesday · Gainesville to Daphne",
    body: "Leave 4922 Wednesday, November 11, after work at 5:30 PM EST. I-75 and I-10 in the dark, dinner and fuel at Quincy, and the Hilton Garden Inn at Daphne on Mobile Bay about 10:40 PM CST. Sea level, no snow.",
  };
}
