import { destination, origin, townById } from "../src/data/towns.ts";
import type { RouteRecord } from "../src/data/types.ts";
import { writeGenerated } from "./lib/io.ts";

const retrievedAt = "2026-10-22T16:00:00.000Z";
const town = townById.park_city;

const route: RouteRecord = {
  townId: "park_city",
  miles: 2303,
  hours: 43.6,
  corridor: "parks_west",
  summary: `I-75 N → I-40 W Cookeville → I-24 / I-70 Topeka → I-70 Wheat Ridge → I-25 / I-80 Sunday → ${destination.label}`,
  winterNotes: town.winterNotes,
  retrievedAt,
  provider: "planning_estimate",
};

writeGenerated("routes.json", {
  retrievedAt,
  origin: { label: origin.label, lat: origin.lat, lng: origin.lng },
  routes: [route],
});
console.log("Wrote 1 route: Gainesville to 900 Bitner Road E17");
