import type { SourceStatusSnapshot } from "../src/data/types.ts";
import { writeGenerated } from "./lib/io.ts";

const retrievedAt = "2026-09-16T13:00:00.000Z";

const snapshot: SourceStatusSnapshot = {
  retrievedAt,
  sources: [
    {
      id: "zillow_group",
      status: "ok",
      retrievedAt: "2026-09-24T19:30:00.000Z",
      note: "Hunt is the signed 900 Bitner E17 lease. Prior PCLodge page is background only.",
    },
    {
      id: "liteapi",
      status: "skipped",
      retrievedAt: null,
      note: "Drive nights are Hilton Honors properties with a quoted two-cat policy. Gunnison has no Hilton and stays unassigned.",
    },
    {
      id: "mapbox",
      status: "skipped",
      retrievedAt: null,
      note: "No MAPBOX_TOKEN. Drive hours are a planning estimate.",
    },
  ],
};

writeGenerated("source-status.json", snapshot);
console.log("Wrote source-status.json");
