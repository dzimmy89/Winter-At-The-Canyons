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
      title: "Sunday · Kingman to E17, keys by 2 PM",
      body: "Leave at 4:00 AM. Hoover Dam and Las Vegas in the dark, the Virgin River Gorge at first light, and fuel plus the UDOT check in St. George at 7:30 AM. Then I-15 over the 6,600-foot summit in the morning, Fillmore, and Provo Canyon to Kimball Junction about 1:05 PM. If I-15 has snow, call the landlord from St. George. The pin is 900 Bitner Road, Apartment E17.",
    };
  }
  if (toId === "kingman") {
    return {
      id: "saturday",
      title: "Saturday · Van Horn to Kingman",
      body: "Through El Paso before dawn, breakfast on the plaza in Old Mesilla, the Texas Canyon boulders, lunch at Picacho Peak, around Phoenix on the loops, Wickenburg, and US-93 to Kingman at sunset. Blowing dust near Lordsburg is the hazard, not snow.",
    };
  }
  if (toId === "van_horn") {
    return {
      id: "friday",
      title: "Friday · Winnie to Van Horn",
      body: "Houston early in the morning, San Felipe de Austin, a river picnic in Junction, West Texas at 80 mph, fuel in Fort Stockton, and Van Horn before sunset.",
    };
  }
  return {
    id: "thursday",
    title: "Thursday · Gainesville to Winnie",
    body: "Leave 4922 Thursday, November 12, at 5:00 AM EST. Breakfast in Marianna, the Davis Bayou, a late lunch at the Atchafalaya Welcome Center, then past Lafayette and Beaumont to Winnie, Texas, by 5:15 PM CST. The longest day. Sea level, no snow.",
  };
}
