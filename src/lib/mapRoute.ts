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
      title: "Saturday · Marana to St. George",
      body: "Leave at 7:00 AM. Past Picacho Peak and around Phoenix on the loops, Wickenburg, the Joshua trees on US-93, Kingman, lunch on the bridge over Hoover Dam, then the Virgin River Gorge into Utah and red rock at Pioneer Park before sunset.",
    };
  }
  if (toId === "marana") {
    return {
      id: "friday",
      title: "Friday · Fort Stockton to Marana",
      body: "Leave at 8:00 AM. Van Horn and El Paso, lunch on the plaza in Old Mesilla, Deming and Lordsburg, the Texas Canyon boulders, and Tucson's quiet northwest edge by about 4:00 PM. Blowing dust near Lordsburg is the hazard, not snow.",
    };
  }
  if (toId === "fort_stockton") {
    return {
      id: "thursday",
      title: "Thursday · Broussard to Fort Stockton",
      body: "Leave at 6:00 AM. The swamp boardwalk at the Texas line, Houston after the rush, the painted church at High Hill, a river stop in Junction, West Texas at 80 mph, and Fort Stockton about 6:00 PM. The longest day.",
    };
  }
  return {
    id: "wednesday",
    title: "Wednesday · Gainesville to Broussard",
    body: "Leave 4922 Wednesday, November 11, at 6:30 AM EST. Breakfast by the round lake in DeFuniak Springs, lunch at the Davis Bayou, then I-12 around New Orleans and over the Atchafalaya swamp to Broussard by about 4:30 PM CST. Sea level, no snow.",
  };
}
