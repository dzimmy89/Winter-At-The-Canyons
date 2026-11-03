import { destination, origin, townById } from "../src/data/towns.ts";
import type { RouteRecord } from "../src/data/types.ts";
import { writeGenerated } from "./lib/io.ts";

const retrievedAt = "2026-11-02T14:30:00.000Z";
const town = townById.park_city;

const route: RouteRecord = {
  townId: "park_city",
  miles: 2771,
  hours: 42,
  corridor: "parks_west",
  summary: `Wed 5:30 PM I-75 N / I-10 W to Crestview → Thu I-10 W / I-12 W Seguin → Fri I-10 W Deming → Sat I-10 / US-93 Kingman → Sun US-93 / I-15 / Provo Canyon → ${destination.label} about 4 PM`,
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
