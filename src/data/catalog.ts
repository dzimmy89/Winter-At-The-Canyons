import listingsJson from "./generated/listings.json";
import hotelsJson from "./generated/hotels.json";
import routesJson from "./generated/routes.json";
import statusJson from "./generated/source-status.json";
import briefJson from "./generated/corridor-brief.json";
import { withFreshness } from "../lib/listings";
import type {
  CorridorBrief,
  HotelsSnapshot,
  Listing,
  ListingsSnapshot,
  RoutesSnapshot,
  SourceStatusSnapshot,
} from "./types";

export const listingsSnapshot = listingsJson as ListingsSnapshot;
export const hotelsSnapshot = hotelsJson as HotelsSnapshot;
export const routesSnapshot = routesJson as RoutesSnapshot;
export const sourceStatus = statusJson as SourceStatusSnapshot;
export const corridorBrief = briefJson as CorridorBrief;

export const listings: Listing[] = listingsSnapshot.listings.map((row) => withFreshness(row as Listing));
export const hotels = hotelsSnapshot.properties;
export const routes = routesSnapshot.routes;
