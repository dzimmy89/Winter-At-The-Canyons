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
      title: "Sunday · Kingman to E17 over I-15",
      body: "US-93 over the Hoover Dam bridge, around Las Vegas, through the Virgin River Gorge, and up I-15 to Provo. Breaks are Hoover Dam, Zion's Kolob Canyons, and Bridal Veil Falls. The 6,600-foot I-15 summit north of Beaver is the snow check. Provo Canyon replaces Parleys. If I-15 has snow, stay in St. George. The pin is 900 Bitner Road, Apartment E17.",
    };
  }
  if (toId === "kingman") {
    return {
      id: "i10-us93",
      title: "I-10 W / US-93 N · Las Cruces to Kingman",
      body: "Texas Canyon boulders, then Phoenix on the loops, Wickenburg, and the Burro Creek bridge. Blowing dust near Lordsburg is the hazard, not snow.",
    };
  }
  if (toId === "las_cruces") {
    return {
      id: "west-texas",
      title: "I-10 W · Kerrville to Las Cruces",
      body: "West Texas at 80 mph. Balmorhea's spring pool, the Franklin Mountains overlook in El Paso, and dinner in Old Mesilla. Fuel every chance you get.",
    };
  }
  if (toId === "kerrville") {
    return {
      id: "gulf-hill-country",
      title: "I-10 W · Lafayette to Kerrville",
      body: "Through Houston after the rush, San Felipe de Austin, Luling barbecue, and the Guadalupe River in Kerrville.",
    };
  }
  return {
    id: "i10-gulf",
    title: "I-75 N / I-10 W · Gainesville to Lafayette",
    body: "Leave 4922 Wednesday, November 11, at 5:30 AM EST. Falling Waters, the USS Alabama, and the Atchafalaya Basin. Sea level all day.",
  };
}
