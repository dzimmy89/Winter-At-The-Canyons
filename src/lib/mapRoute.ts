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
  if (toId === "dest" || fromId === "goodyear") {
    return {
      id: "sunday",
      title: "Sunday · Goodyear to E17",
      body: "The longest day: Wickenburg at first light, the Joshua trees on US-93, Kingman, Hoover Dam in the morning, the Virgin River Gorge in daylight, and lunch in St. George with the UDOT check. Then I-15 over the 6,600-foot summit in the afternoon and Provo Canyon to Kimball Junction after dark, about 7:00 PM. If I-15 has snow at lunch, stop in St. George. The pin is 900 Bitner Road, Apartment E17.",
    };
  }
  if (toId === "goodyear") {
    return {
      id: "saturday",
      title: "Saturday · Fort Stockton to Goodyear",
      body: "The high-desert day: Balmorhea's spring pool at sunrise, straight through El Paso, lunch on the plaza in Old Mesilla, the Texas Canyon boulders, and around Phoenix on Loop 202. Blowing dust near Lordsburg is the hazard, not snow.",
    };
  }
  if (toId === "fort_stockton") {
    return {
      id: "friday",
      title: "Friday · Sulphur to Fort Stockton",
      body: "Your day off. The Texas welcome-center boardwalk at sunrise, Houston after the rush, San Felipe de Austin, lunch in Seguin, the Hill Country, and West Texas at 80 mph. Fuel in Junction.",
    };
  }
  if (toId === "sulphur") {
    return {
      id: "thursday-evening",
      title: "Thursday · Daphne to Sulphur after work",
      body: "Work in the Daphne hotel room until 3:00 PM CST, then I-10 and I-12 along the Gulf: the Mississippi welcome center, dinner in Hammond, and the Atchafalaya Basin Bridge in the dark. Bed in Sulphur about 9:05 PM.",
    };
  }
  return {
    id: "wednesday-evening",
    title: "Wednesday · Gainesville to Daphne after work",
    body: "Leave 4922 Wednesday, November 11, at 4:00 PM EST. I-75 and I-10 across the Panhandle, dinner in Marianna, and bed in Daphne on Mobile Bay about 9:15 PM CST. Sea level, no snow.",
  };
}
