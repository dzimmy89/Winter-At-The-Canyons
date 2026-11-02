import { destination, origin, townById } from "../src/data/towns.ts";
import type { RouteRecord } from "../src/data/types.ts";
import { writeGenerated } from "./lib/io.ts";

const retrievedAt = "2026-11-02T14:30:00.000Z";
const town = townById.park_city;

const route: RouteRecord = {
  townId: "park_city",
  miles: 2789,
  hours: 42.1,
  corridor: "parks_west",
  summary: `Wed 6:30 AM I-75 N / I-10 W / I-12 W to Broussard → Thu I-10 W Fort Stockton → Fri I-10 W Marana → Sat US-93 / I-15 St. George → Sun I-15 / Provo Canyon → ${destination.label} about 1:15 PM`,
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
