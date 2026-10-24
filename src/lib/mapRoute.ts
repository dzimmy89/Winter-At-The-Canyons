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
  if (toId === "dest" || fromId === "wheat_ridge") {
    return {
      id: "sunday",
      title: "Sunday · clear corridor to E17",
      body: "The planned road is I-25 north and I-80 west. Breaks are Vedauwoo, Fort Fred Steele, and the Echo Canyon rest area. Sherman Summit is the snow check. Eisenhower and Vail stay off the clock unless Wyoming has snow and those passes are bare. If both roads have snow, stay at the Wheat Ridge Hampton. The pin is 900 Bitner Road, Apartment E17.",
    };
  }
  if (toId === "wheat_ridge") {
    return {
      id: "i70-denver",
      title: "I-70 W · Topeka to Wheat Ridge",
      body: "Leave Topeka only if I-70 from Salina through Denver is bare or wet. E-470 is not the route. Wheat Ridge is east of the tunnel so Sunday can turn north onto I-25.",
    };
  }
  if (toId === "topeka") {
    return {
      id: "cookeville-topeka",
      title: "I-40 / I-24 / I-70 · Cookeville to Topeka",
      body: "13.0 hours, the driving cap. Nashville and Kansas City are pass-throughs. The Gateway Arch is not a stop.",
    };
  }
  return {
    id: "i75",
    title: "I-75 N / I-40 W · Gainesville to Cookeville",
    body: "Leave 4922 Thursday, November 12, at 5:00 AM EST. Clear Atlanta before stopping again. Cookeville is east of Nashville. The Smokies are not on this road.",
  };
}
