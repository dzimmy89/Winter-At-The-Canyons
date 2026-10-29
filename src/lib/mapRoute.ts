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
      id: "monday",
      title: "Monday · St. George to E17 after work",
      body: "Work in the Hilton Garden Inn room until 3:00 PM, then I-15 north past Cedar City and over the 6,600-foot summit near sunset, Fillmore for fuel, and Provo Canyon to Kimball Junction in the dark. The 2 PM UDOT check decides it. If I-15 has snow, stay the second night you booked. The pin is 900 Bitner Road, Apartment E17.",
    };
  }
  if (toId === "st_george") {
    return {
      id: "sunday",
      title: "Sunday · Deming to St. George",
      body: "The long desert day: Texas Canyon boulders, Picacho Peak, around Phoenix on the loops, Wickenburg, Kingman, and Hoover Dam at sunset, then Las Vegas and the Virgin River Gorge after dark. Blowing dust near Lordsburg is the hazard, not snow.",
    };
  }
  if (toId === "deming") {
    return {
      id: "west-texas",
      title: "Saturday · Seguin to Deming",
      body: "Through San Antonio early, the Hill Country, and West Texas at 80 mph. Junction, Balmorhea's spring pool, straight through El Paso, and the plaza in Old Mesilla. Fuel every chance you get.",
    };
  }
  if (toId === "seguin") {
    return {
      id: "gulf-texas",
      title: "Friday · Crestview to Seguin",
      body: "Your day off and the longest drive. The Davis Bayou, the Atchafalaya Welcome Center, the Texas welcome-center boardwalk, Houston mid-afternoon, and San Felipe de Austin.",
    };
  }
  return {
    id: "thursday-evening",
    title: "Thursday · Gainesville to Crestview after work",
    body: "Leave 4922 Thursday, November 12, at 5:30 PM EST. I-75 and I-10 in the dark, dinner in Marianna, and bed in Crestview by 9:30 PM CST. Sea level, no snow.",
  };
}
