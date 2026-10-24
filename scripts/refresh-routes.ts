import "dotenv/config";
import { destination, origin, towns } from "../src/data/towns.ts";
import { corridorForTown } from "../src/data/towns.ts";
import type { RouteRecord, RoutesSnapshot } from "../src/data/types.ts";
import { generatedDir, readJson, writeGenerated } from "./lib/io.ts";
import { join } from "node:path";

const token = process.env.MAPBOX_TOKEN;
const existing = readJson<RoutesSnapshot>(join(generatedDir, "routes.json"));

if (!token) {
  console.log("MAPBOX_TOKEN missing. Keeping planning-estimate routes.");
  process.exit(0);
}

const retrievedAt = new Date().toISOString();
const routes: RouteRecord[] = [];

for (const town of towns) {
  const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?overview=simplified&geometries=geojson&access_token=${token}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Mapbox ${town.id} ${res.status}`);
    const prev = existing.routes.find((r) => r.townId === town.id);
    if (prev) {
      routes.push(prev);
    }
    continue;
  }
  const body = (await res.json()) as {
    routes?: { distance: number; duration: number; legs?: { summary?: string }[] }[];
  };
  const best = body.routes?.[0];
  if (!best) {
    continue;
  }
  routes.push({
    townId: town.id,
    miles: Math.round(best.distance / 1609.344),
    hours: Math.round((best.duration / 3600) * 10) / 10,
    corridor: corridorForTown(town.id),
    summary: best.legs?.map((l) => l.summary).filter(Boolean).join(" → ") || existing.routes.find((r) => r.townId === town.id)?.summary || "",
    winterNotes: town.winterNotes,
    retrievedAt,
    provider: "mapbox",
  });
}

writeGenerated("routes.json", {
  retrievedAt,
  origin: { label: origin.label, lat: origin.lat, lng: origin.lng },
  routes,
} satisfies RoutesSnapshot);

console.log(`Wrote ${routes.length} Mapbox routes`);
