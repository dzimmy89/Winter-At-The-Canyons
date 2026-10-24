import { destination, origin, townById } from "../src/data/towns.ts";
import type { RouteRecord } from "../src/data/types.ts";
import { writeGenerated } from "./lib/io.ts";

const retrievedAt = "2026-10-24T14:00:00.000Z";
const town = townById.park_city;

const route: RouteRecord = {
  townId: "park_city",
  miles: 2773,
  hours: 41.6,
  corridor: "parks_west",
  summary: `I-75 N / I-10 W Lafayette → I-10 W Kerrville → I-10 W Las Cruces → I-10 / US-93 Kingman → I-15 / Provo Canyon Sunday → ${destination.label}`,
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
