import "dotenv/config";
import { join } from "node:path";
import type { HotelsSnapshot } from "../src/data/types.ts";
import { generatedDir, readJson, writeGenerated } from "./lib/io.ts";

const key = process.env.LITEAPI_KEY;
const existing = readJson<HotelsSnapshot>(join(generatedDir, "hotels.json"));

if (!key) {
  console.log("LITEAPI_KEY missing. Keeping the Hilton Honors cat-stay catalog and the 150,000-point bank.");
  process.exit(0);
}

const res = await fetch("https://api.liteapi.travel/v3.0/data/hotels?countryCode=US&timeout=12", {
  headers: { "X-API-Key": key },
});

if (!res.ok) {
  console.error(`LiteAPI ${res.status} — keeping last hotels.json`);
  process.exit(1);
}

console.log(
  "LiteAPI responded. Keep the curated Hilton Honors cat-stay catalog and award-point quotes; do not write Marriott nights or strip the points bank.",
);
writeGenerated("hotels.json", existing);
