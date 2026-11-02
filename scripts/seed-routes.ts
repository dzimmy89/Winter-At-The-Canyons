import { destination, origin, townById } from "../src/data/towns.ts";
import type { RouteRecord } from "../src/data/types.ts";
import { writeGenerated } from "./lib/io.ts";

const retrievedAt = "2026-11-02T14:30:00.000Z";
const town = townById.park_city;

const route: RouteRecord = {
  townId: "park_city",
  miles: 2767,
  hours: 41.4,
  corridor: "parks_west",
  summary: `Thu 5 AM I-75 N / I-10 W / I-12 W to Sulphur → I-10 W Van Horn → I-10 / US-93 Kingman → Sunday US-93 / I-15 / Provo Canyon → ${destination.label} by 2 PM`,
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
