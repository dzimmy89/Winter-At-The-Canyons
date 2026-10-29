import { destination, origin, townById } from "../src/data/towns.ts";
import type { RouteRecord } from "../src/data/types.ts";
import { writeGenerated } from "./lib/io.ts";

const retrievedAt = "2026-10-29T21:45:00.000Z";
const town = townById.park_city;

const route: RouteRecord = {
  townId: "park_city",
  miles: 2780,
  hours: 42,
  corridor: "parks_west",
  summary: `Wed evening I-75 N / I-10 W to Daphne → Thu evening I-10 / I-12 W Sulphur → I-10 W Fort Stockton → I-10 W Goodyear → Sunday US-93 / I-15 / Provo Canyon → ${destination.label}`,
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
