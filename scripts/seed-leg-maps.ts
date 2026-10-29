// Builds the self-contained maps for each leg and each day of the drive.
// Road lines come from Natural Earth (public domain), routed along the highways
// each leg actually uses, then projected to SVG paths so the site needs no map
// tiles or network at all. Run with: npx tsx scripts/seed-leg-maps.ts
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { destination, origin } from "../src/data/towns.ts";
import { writeGenerated } from "./lib/io.ts";

type LngLat = [number, number];

const NE_BASE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson";
const cacheDir = join(process.cwd(), "node_modules/.cache/natural-earth");

function naturalEarth(name: string): GeoJson {
  const file = join(cacheDir, `${name}.geojson`);
  if (!existsSync(file)) {
    mkdirSync(cacheDir, { recursive: true });
    console.log(`Downloading ${name}...`);
    execFileSync("curl", ["-sSfL", "-m", "600", "-o", file, `${NE_BASE}/${name}.geojson`], { stdio: "inherit" });
  }
  return JSON.parse(readFileSync(file, "utf8")) as GeoJson;
}

interface GeoJson {
  features: {
    properties: Record<string, unknown>;
    geometry: { type: string; coordinates: unknown } | null;
  }[];
}

function lines(geometry: GeoJson["features"][number]["geometry"]): LngLat[][] {
  if (!geometry) return [];
  if (geometry.type === "LineString") return [geometry.coordinates as LngLat[]];
  if (geometry.type === "MultiLineString") return geometry.coordinates as LngLat[][];
  return [];
}

function polygons(geometry: GeoJson["features"][number]["geometry"]): LngLat[][][] {
  if (!geometry) return [];
  if (geometry.type === "Polygon") return [geometry.coordinates as LngLat[][]];
  if (geometry.type === "MultiPolygon") return geometry.coordinates as LngLat[][][];
  return [];
}

// ---------------------------------------------------------------------------
// The drive, leg by leg. Points are [lng, lat].

interface Town {
  name: string;
  at: LngLat;
}

interface LegSpec {
  id: string;
  startLabel: string;
  start: LngLat;
  endLabel: string;
  end: LngLat;
  // Points the route must pass, in order, so it follows the planned highways.
  via: LngLat[];
  // Roads this leg drives, as Natural Earth refs: I10, US93, S17.
  prefer: string[];
  // Hand-drawn pieces for freeways Natural Earth does not carry yet, in order of travel.
  manual?: { after: number; line: LngLat[]; ref: string }[];
  towns: string[];
  shields?: Record<string, string>;
  // Ends at a highway junction rather than a stop, so the day map does not number it.
  junction?: boolean;
}

const home: LngLat = [origin.lng, origin.lat];
const e17: LngLat = [destination.lng, destination.lat];

const hotels = {
  crestview: [-86.5655, 30.714] as LngLat,
  seguin: [-97.946, 29.59] as LngLat,
  deming: [-107.7195, 32.2667] as LngLat,
  stGeorge: [-113.591, 37.077] as LngLat,
};

const stops = {
  marianna: [-85.229, 30.8] as LngLat,
  davisBayou: [-88.7965, 30.3925] as LngLat,
  atchafalaya: [-91.686, 30.311] as LngLat,
  orange: [-93.7215, 30.1105] as LngLat,
  sanFelipe: [-96.0995, 29.803] as LngLat,
  junction: [-99.765, 30.5] as LngLat,
  balmorhea: [-103.7859, 30.9447] as LngLat,
  mesilla: [-106.7955, 32.2733] as LngLat,
  texasCanyon: [-110.0585, 32.0445] as LngLat,
  picacho: [-111.401, 32.646] as LngLat,
  wickenburg: [-112.7296, 33.9686] as LngLat,
  kingman: [-114.05, 35.19] as LngLat,
  hoover: [-114.742, 36.0127] as LngLat,
  fillmore: [-112.33, 38.98] as LngLat,
  orem: [-111.72, 40.3] as LngLat,
};

const townAt: Record<string, LngLat> = {
  Gainesville: [-82.3248, 29.6516],
  Alachua: [-82.4968, 29.7516],
  "High Springs": [-82.5968, 29.8269],
  "Lake City": [-82.6393, 30.1897],
  "Live Oak": [-82.984, 30.2949],
  Madison: [-83.4132, 30.4694],
  Tallahassee: [-84.2807, 30.4383],
  Quincy: [-84.5833, 30.5872],
  Marianna: [-85.2269, 30.7744],
  Chipley: [-85.5385, 30.7816],
  "DeFuniak Springs": [-86.1152, 30.721],
  Crestview: [-86.5705, 30.7621],
  Pensacola: [-87.2169, 30.4213],
  Mobile: [-88.0399, 30.6954],
  Pascagoula: [-88.5561, 30.3658],
  "Ocean Springs": [-88.8278, 30.4113],
  Biloxi: [-88.8853, 30.396],
  Gulfport: [-89.0928, 30.3674],
  Slidell: [-89.7812, 30.2752],
  Mandeville: [-90.0656, 30.3582],
  Covington: [-90.1009, 30.4755],
  "New Orleans": [-90.0715, 29.9511],
  Hammond: [-90.4612, 30.5044],
  "Baton Rouge": [-91.1871, 30.4515],
  Lafayette: [-92.0198, 30.2241],
  Jennings: [-92.6571, 30.2224],
  "Lake Charles": [-93.2174, 30.2266],
  Sulphur: [-93.3774, 30.2366],
  Orange: [-93.7366, 30.093],
  Beaumont: [-94.1266, 30.0802],
  Winnie: [-94.3846, 29.8202],
  Baytown: [-94.9774, 29.7355],
  Houston: [-95.3698, 29.7604],
  Katy: [-95.8245, 29.7858],
  "San Felipe": [-96.1003, 29.793],
  Sealy: [-96.1572, 29.7808],
  Columbus: [-96.5397, 29.7066],
  Schulenburg: [-96.9039, 29.6819],
  Flatonia: [-97.1086, 29.6877],
  Luling: [-97.6475, 29.6805],
  Seguin: [-97.9647, 29.5688],
  "San Antonio": [-98.4936, 29.4241],
  Boerne: [-98.732, 29.7947],
  Comfort: [-98.905, 29.9677],
  Kerrville: [-99.1403, 30.0474],
  Junction: [-99.772, 30.4894],
  Sonora: [-100.6434, 30.5669],
  Ozona: [-101.2007, 30.7102],
  "Fort Stockton": [-102.8793, 30.894],
  Balmorhea: [-103.7446, 30.9843],
  "Van Horn": [-104.8308, 31.0399],
  "Sierra Blanca": [-105.3572, 31.1746],
  "El Paso": [-106.485, 31.7619],
  "Las Cruces": [-106.7637, 32.3199],
  Mesilla: [-106.7956, 32.2737],
  Deming: [-107.7586, 32.2687],
  Lordsburg: [-108.7087, 32.3504],
  "San Simon": [-109.2251, 32.2665],
  Willcox: [-109.832, 32.2529],
  Benson: [-110.2945, 31.9679],
  Tucson: [-110.9747, 32.2226],
  Marana: [-111.2254, 32.4367],
  "Casa Grande": [-111.7574, 32.8795],
  Chandler: [-111.8413, 33.3062],
  Phoenix: [-112.074, 33.4484],
  Goodyear: [-112.3577, 33.4353],
  Surprise: [-112.3679, 33.6292],
  Wittmann: [-112.528, 33.7781],
  Wickenburg: [-112.7296, 33.9686],
  Wikieup: [-113.611, 34.7033],
  Kingman: [-114.053, 35.1894],
  "Boulder City": [-114.8325, 35.9786],
  Henderson: [-114.9817, 36.0395],
  "Las Vegas": [-115.1398, 36.1699],
  Mesquite: [-114.0672, 36.8055],
  "St. George": [-113.5684, 37.0965],
  "Cedar City": [-113.0619, 37.6775],
  Beaver: [-112.6411, 38.2769],
  "Cove Fort": [-112.585, 38.6],
  Fillmore: [-112.3233, 38.9689],
  Scipio: [-112.1033, 39.2444],
  Nephi: [-111.8363, 39.7102],
  Provo: [-111.6585, 40.2338],
  Orem: [-111.6946, 40.2969],
  "Heber City": [-111.4132, 40.507],
  "Park City": [-111.498, 40.6461],
  "Salt Lake City": [-111.891, 40.7608],
};

const legs: LegSpec[] = [
  {
    id: "thu-i75",
    startLabel: "Home",
    start: home,
    endLabel: "I-10 junction",
    end: [-82.6475, 30.2075],
    junction: true,
    via: [],
    prefer: ["I75"],
    towns: ["Gainesville", "Alachua", "High Springs", "Lake City"],
  },
  {
    id: "thu-big-bend",
    startLabel: "Lake City",
    start: [-82.6475, 30.2075],
    endLabel: "Marianna (exit 142)",
    end: stops.marianna,
    via: [[-84.28, 30.53]],
    prefer: ["I10"],
    towns: ["Lake City", "Live Oak", "Madison", "Tallahassee", "Quincy"],
  },
  {
    id: "thu-crestview",
    startLabel: "Marianna",
    start: stops.marianna,
    endLabel: "Hampton Inn Crestview",
    end: hotels.crestview,
    via: [[-85.53, 30.765]],
    prefer: ["I10"],
    towns: ["Marianna", "Chipley", "DeFuniak Springs", "Crestview"],
  },
  {
    id: "fri-coast",
    startLabel: "Crestview",
    start: hotels.crestview,
    endLabel: "Davis Bayou",
    end: stops.davisBayou,
    via: [
      [-87.2, 30.53],
      [-88.04, 30.66],
      [-88.79, 30.435],
    ],
    prefer: ["I10"],
    towns: ["Crestview", "Pensacola", "Mobile", "Pascagoula", "Ocean Springs"],
  },
  {
    id: "fri-louisiana",
    startLabel: "Davis Bayou",
    start: stops.davisBayou,
    endLabel: "Atchafalaya Welcome Center",
    end: stops.atchafalaya,
    via: [
      [-88.79, 30.435],
      [-89.74, 30.31],
      [-90.46, 30.48],
      [-91.08, 30.42],
    ],
    prefer: ["I10", "I12"],
    towns: ["Gulfport", "Slidell", "Covington", "Hammond", "Baton Rouge", "New Orleans"],
  },
  {
    id: "fri-sabine",
    startLabel: "Atchafalaya",
    start: stops.atchafalaya,
    endLabel: "Texas welcome center",
    end: stops.orange,
    via: [
      [-92.02, 30.25],
      [-93.22, 30.24],
    ],
    prefer: ["I10"],
    towns: ["Lafayette", "Jennings", "Lake Charles", "Sulphur", "Orange"],
  },
  {
    id: "fri-houston",
    startLabel: "Orange",
    start: stops.orange,
    endLabel: "San Felipe",
    end: stops.sanFelipe,
    via: [
      [-94.13, 30.07],
      [-95.37, 29.78],
      [-96.1, 29.785],
    ],
    prefer: ["I10"],
    towns: ["Orange", "Beaumont", "Winnie", "Baytown", "Houston", "Katy", "San Felipe"],
  },
  {
    id: "fri-seguin",
    startLabel: "San Felipe",
    start: stops.sanFelipe,
    endLabel: "Hampton Inn Seguin",
    end: hotels.seguin,
    via: [
      [-96.1, 29.785],
      [-96.54, 29.7],
      [-97.64, 29.655],
    ],
    prefer: ["I10"],
    towns: ["Sealy", "Columbus", "Schulenburg", "Flatonia", "Luling", "Seguin"],
  },
  {
    id: "sat-hill-country",
    startLabel: "Seguin",
    start: hotels.seguin,
    endLabel: "Junction",
    end: stops.junction,
    via: [
      [-98.49, 29.43],
      [-98.73, 29.8],
      [-99.12, 30.06],
    ],
    prefer: ["I10", "I35"],
    towns: ["Seguin", "San Antonio", "Boerne", "Comfort", "Kerrville"],
  },
  {
    id: "sat-west-texas",
    startLabel: "Junction",
    start: stops.junction,
    endLabel: "Balmorhea SP",
    end: stops.balmorhea,
    via: [
      [-100.64, 30.58],
      [-101.2, 30.72],
      [-102.88, 30.9],
      [-103.74, 30.97],
    ],
    prefer: ["I10", "S17"],
    towns: ["Junction", "Sonora", "Ozona", "Fort Stockton", "Balmorhea"],
  },
  {
    id: "sat-el-paso",
    startLabel: "Balmorhea",
    start: stops.balmorhea,
    endLabel: "Old Mesilla",
    end: stops.mesilla,
    via: [
      [-103.74, 30.97],
      [-104.83, 31.05],
      [-106.45, 31.78],
      [-106.78, 32.29],
    ],
    prefer: ["S17", "I10", "S28"],
    towns: ["Balmorhea", "Van Horn", "Sierra Blanca", "El Paso", "Las Cruces", "Mesilla"],
  },
  {
    id: "sat-deming",
    startLabel: "Mesilla",
    start: stops.mesilla,
    endLabel: "Hampton Inn Deming",
    end: hotels.deming,
    via: [
      [-106.78, 32.29],
      [-107.72, 32.27],
    ],
    prefer: ["I10"],
    towns: ["Las Cruces", "Mesilla", "Deming"],
  },
  {
    id: "sun-texas-canyon",
    startLabel: "Deming",
    start: hotels.deming,
    endLabel: "Texas Canyon",
    end: stops.texasCanyon,
    via: [
      [-107.72, 32.27],
      [-108.71, 32.34],
      [-109.83, 32.26],
    ],
    prefer: ["I10"],
    towns: ["Deming", "Lordsburg", "San Simon", "Willcox"],
  },
  {
    id: "sun-picacho",
    startLabel: "Texas Canyon",
    start: stops.texasCanyon,
    endLabel: "Picacho Peak SP",
    end: stops.picacho,
    via: [
      [-110.29, 31.98],
      [-111.0, 32.25],
    ],
    prefer: ["I10"],
    towns: ["Benson", "Tucson", "Marana"],
  },
  {
    id: "sun-phoenix",
    startLabel: "Picacho Peak",
    start: stops.picacho,
    endLabel: "Wickenburg",
    end: stops.wickenburg,
    via: [
      [-111.757, 32.93],
      [-111.97, 33.3],
      [-112.18, 33.46],
      [-112.42, 33.46],
      [-112.405, 33.684],
    ],
    // Loop 202 (South Mountain) opened in 2019 and Loop 303 is newer than the
    // Natural Earth roads, so their alignments are drawn by hand.
    manual: [
      {
        after: 2,
        ref: "L202",
        line: [
          [-111.97, 33.3],
          [-112.05, 33.297],
          [-112.1, 33.31],
          [-112.14, 33.345],
          [-112.16, 33.38],
          [-112.185, 33.415],
          [-112.185, 33.46],
        ],
      },
      {
        after: 4,
        ref: "L303",
        line: [
          [-112.42, 33.46],
          [-112.425, 33.5],
          [-112.425, 33.57],
          [-112.42, 33.63],
          [-112.405, 33.684],
        ],
      },
    ],
    prefer: ["I10", "US60", "I17"],
    towns: ["Casa Grande", "Chandler", "Phoenix", "Goodyear", "Surprise", "Wittmann", "Wickenburg"],
    shields: { L202: "202", L303: "303" },
  },
  {
    id: "sun-us93",
    startLabel: "Wickenburg",
    start: stops.wickenburg,
    endLabel: "Kingman",
    end: stops.kingman,
    via: [
      [-113.4505, 34.5375],
      [-113.61, 34.71],
    ],
    prefer: ["US93", "I40"],
    towns: ["Wickenburg", "Wikieup"],
  },
  {
    id: "sun-hoover",
    startLabel: "Kingman",
    start: stops.kingman,
    endLabel: "Hoover Dam bridge",
    end: stops.hoover,
    via: [],
    prefer: ["US93", "I40", "I11"],
    towns: ["Boulder City"],
  },
  {
    id: "sun-gorge",
    startLabel: "Hoover Dam",
    start: stops.hoover,
    endLabel: "Hilton Garden Inn St. George",
    end: hotels.stGeorge,
    via: [
      [-114.95, 35.99],
      [-115.0, 36.03],
      [-115.178, 36.058],
      [-115.15, 36.2],
      [-114.9, 36.39],
      [-114.07, 36.81],
    ],
    prefer: ["US93", "I11", "I515", "I215", "I15"],
    // Natural Earth still names the Henderson freeway I-515; it is signed I-11 now.
    shields: { I515: "11" },
    towns: ["Boulder City", "Henderson", "Las Vegas", "Mesquite", "St. George"],
  },
  {
    id: "mon-i15-summit",
    startLabel: "St. George",
    start: hotels.stGeorge,
    endLabel: "Fillmore (exit 167)",
    end: stops.fillmore,
    via: [
      [-113.06, 37.68],
      [-112.64, 38.28],
      [-112.585, 38.6],
    ],
    prefer: ["I15"],
    towns: ["St. George", "Cedar City", "Beaver", "Cove Fort"],
  },
  {
    id: "mon-utah-valley",
    startLabel: "Fillmore",
    start: stops.fillmore,
    endLabel: "Orem (exit 272)",
    end: stops.orem,
    junction: true,
    via: [
      [-112.1, 39.24],
      [-111.84, 39.71],
    ],
    prefer: ["I15"],
    towns: ["Fillmore", "Scipio", "Nephi", "Provo"],
  },
  {
    id: "mon-provo-canyon",
    startLabel: "Orem",
    start: stops.orem,
    endLabel: "Apartment E17",
    end: e17,
    via: [
      [-111.602, 40.3418],
      [-111.413, 40.507],
      [-111.48, 40.68],
    ],
    prefer: ["US189", "US40", "I80"],
    towns: ["Provo", "Heber City", "Park City", "Salt Lake City"],
  },
];

const days: { id: string; legs: string[]; startLabel: string; endLabel: string; towns: string[] }[] = [
  {
    id: "day-1",
    legs: ["thu-i75", "thu-big-bend", "thu-crestview"],
    startLabel: "Home",
    endLabel: "Crestview",
    towns: ["Gainesville", "Lake City", "Tallahassee", "Chipley", "Crestview"],
  },
  {
    id: "day-2",
    legs: ["fri-coast", "fri-louisiana", "fri-sabine", "fri-houston", "fri-seguin"],
    startLabel: "Crestview",
    endLabel: "Seguin",
    towns: ["Pensacola", "Mobile", "Baton Rouge", "Lafayette", "Lake Charles", "Beaumont", "Houston", "New Orleans"],
  },
  {
    id: "day-3",
    legs: ["sat-hill-country", "sat-west-texas", "sat-el-paso", "sat-deming"],
    startLabel: "Seguin",
    endLabel: "Deming",
    towns: ["San Antonio", "Kerrville", "Ozona", "Fort Stockton", "Van Horn", "El Paso", "Las Cruces"],
  },
  {
    id: "day-4",
    legs: ["sun-texas-canyon", "sun-picacho", "sun-phoenix", "sun-us93", "sun-hoover", "sun-gorge"],
    startLabel: "Deming",
    endLabel: "St. George",
    towns: ["Lordsburg", "Willcox", "Tucson", "Phoenix", "Wikieup", "Las Vegas", "Mesquite"],
  },
  {
    id: "day-5",
    legs: ["mon-i15-summit", "mon-utah-valley", "mon-provo-canyon"],
    startLabel: "St. George",
    endLabel: "E17",
    towns: ["Cedar City", "Beaver", "Cove Fort", "Nephi", "Provo", "Park City"],
  },
];

// ---------------------------------------------------------------------------
// Load Natural Earth.

const roadsGeo = naturalEarth("ne_10m_roads");
const stateLinesGeo = naturalEarth("ne_10m_admin_1_states_provinces_lines");
const statesGeo = naturalEarth("ne_50m_admin_1_states_provinces_lakes");
const countriesGeo = naturalEarth("ne_10m_admin_0_countries");
const lakesGeo = naturalEarth("ne_10m_lakes");
const riversGeo = naturalEarth("ne_10m_rivers_lake_centerlines");

type Tier = "interstate" | "us" | "state";

interface Road {
  ref: string;
  tier: Tier;
  coords: LngLat[];
}

function roadRef(props: Record<string, unknown>): { ref: string; tier: Tier } | null {
  const name = String(props.name ?? "").trim();
  if (!name || props.type === "Ferry Route") return null;
  switch (props.level) {
    case "Interstate":
      return { ref: `I${name}`, tier: "interstate" };
    case "Federal":
      return { ref: `US${name}`, tier: "us" };
    case "State":
      return { ref: `S${name}`, tier: "state" };
    default:
      return null;
  }
}

const roads: Road[] = [];
for (const feature of roadsGeo.features) {
  if (feature.properties.sov_a3 !== "USA") continue;
  const ref = roadRef(feature.properties);
  if (!ref) continue;
  for (const coords of lines(feature.geometry)) {
    roads.push({ ...ref, coords });
  }
}

// ---------------------------------------------------------------------------
// Road graph and shortest paths that favour the leg's own highways.

const R_KM = 6371;
function km(a: LngLat, b: LngLat): number {
  const lat = ((a[1] + b[1]) / 2) * (Math.PI / 180);
  const dx = (b[0] - a[0]) * Math.cos(lat) * (Math.PI / 180) * R_KM;
  const dy = (b[1] - a[1]) * (Math.PI / 180) * R_KM;
  return Math.hypot(dx, dy);
}

const nodeIndex = new Map<string, number>();
const nodes: LngLat[] = [];
const edges: { to: number; km: number; ref: string }[][] = [];

function nodeFor(point: LngLat): number {
  const key = `${point[0].toFixed(4)},${point[1].toFixed(4)}`;
  let id = nodeIndex.get(key);
  if (id === undefined) {
    id = nodes.length;
    nodeIndex.set(key, id);
    nodes.push(point);
    edges.push([]);
  }
  return id;
}

function link(a: number, b: number, ref: string, extra = 0) {
  if (a === b) return;
  const d = km(nodes[a], nodes[b]) + extra;
  edges[a].push({ to: b, km: d, ref });
  edges[b].push({ to: a, km: d, ref });
}

const nodeRefs = new Map<number, Set<string>>();
const endpoints: { node: number; road: number }[] = [];
const nodeRoad = new Map<number, number>();
const roadNodes: number[][] = [];
roads.forEach((road, roadId) => {
  let prev = -1;
  roadNodes.push([]);
  road.coords.forEach((point, i) => {
    const id = nodeFor(point);
    roadNodes[roadId].push(id);
    if (!nodeRefs.has(id)) nodeRefs.set(id, new Set());
    nodeRefs.get(id)!.add(road.ref);
    nodeRoad.set(id, roadId);
    if (prev >= 0) link(prev, id, road.ref);
    if (i === 0 || i === road.coords.length - 1) endpoints.push({ node: id, road: roadId });
    prev = id;
  });
});

// Natural Earth lines often stop just short of the road they join. Bridge those gaps.
const GRID = 0.05;
const grid = new Map<string, number[]>();
function cellKey(x: number, y: number) {
  return `${x},${y}`;
}
nodes.forEach((point, id) => {
  const key = cellKey(Math.floor(point[0] / GRID), Math.floor(point[1] / GRID));
  if (!grid.has(key)) grid.set(key, []);
  grid.get(key)!.push(id);
});

function nearby(point: LngLat, radiusKm: number): number[] {
  const cx = Math.floor(point[0] / GRID);
  const cy = Math.floor(point[1] / GRID);
  const span = Math.ceil(radiusKm / 4) + 1;
  const found: number[] = [];
  for (let x = cx - span; x <= cx + span; x += 1) {
    for (let y = cy - span; y <= cy + span; y += 1) {
      for (const id of grid.get(cellKey(x, y)) ?? []) {
        if (km(point, nodes[id]) <= radiusKm) found.push(id);
      }
    }
  }
  return found;
}

// Segments of every road, indexed by grid cell, so an end can join a road
// between two of its vertices (Natural Earth vertices can be 10 km apart).
const segments: { a: number; b: number; road: number }[] = [];
const segmentGrid = new Map<string, number[]>();
roadNodes.forEach((ids, road) => {
  for (let i = 1; i < ids.length; i += 1) {
    const [ax, ay] = nodes[ids[i - 1]];
    const [bx, by] = nodes[ids[i]];
    const index = segments.push({ a: ids[i - 1], b: ids[i], road }) - 1;
    for (let x = Math.floor(Math.min(ax, bx) / GRID); x <= Math.floor(Math.max(ax, bx) / GRID); x += 1) {
      for (let y = Math.floor(Math.min(ay, by) / GRID); y <= Math.floor(Math.max(ay, by) / GRID); y += 1) {
        const key = cellKey(x, y);
        if (!segmentGrid.has(key)) segmentGrid.set(key, []);
        segmentGrid.get(key)!.push(index);
      }
    }
  }
});

function closestOnSegment(p: LngLat, a: LngLat, b: LngLat): LngLat {
  const cos = Math.cos((p[1] * Math.PI) / 180);
  const ax = a[0] * cos;
  const bx = b[0] * cos;
  const px = p[0] * cos;
  const dx = bx - ax;
  const dy = b[1] - a[1];
  const len = dx * dx + dy * dy;
  const t = len ? Math.max(0, Math.min(1, ((px - ax) * dx + (p[1] - a[1]) * dy) / len)) : 0;
  return [a[0] + (b[0] - a[0]) * t, a[1] + dy * t];
}

for (const { node, road } of endpoints) {
  const point = nodes[node];
  const cx = Math.floor(point[0] / GRID);
  const cy = Math.floor(point[1] / GRID);
  const seen = new Set<number>();
  const hits: { seg: number; at: LngLat; d: number }[] = [];
  for (let x = cx - 1; x <= cx + 1; x += 1) {
    for (let y = cy - 1; y <= cy + 1; y += 1) {
      for (const seg of segmentGrid.get(cellKey(x, y)) ?? []) {
        if (seen.has(seg) || segments[seg].road === road) continue;
        seen.add(seg);
        const at = closestOnSegment(point, nodes[segments[seg].a], nodes[segments[seg].b]);
        const d = km(point, at);
        if (d <= 3) hits.push({ seg, at, d });
      }
    }
  }
  hits.sort((p, q) => p.d - q.d);
  for (const hit of hits.slice(0, 3)) {
    const { a, b, road: other } = segments[hit.seg];
    const ref = roads[other].ref;
    const mid = nodeFor(hit.at);
    if (mid !== a && mid !== b) {
      link(a, mid, ref);
      link(mid, b, ref);
      nodeRefs.set(mid, new Set([ref]));
      nodeRoad.set(mid, other);
      const key = cellKey(Math.floor(hit.at[0] / GRID), Math.floor(hit.at[1] / GRID));
      if (!grid.has(key)) grid.set(key, []);
      grid.get(key)!.push(mid);
    }
    link(node, mid, "gap", 0.3);
  }
}

function costFactor(ref: string, prefer: Set<string>): number {
  if (prefer.has(ref)) return 1;
  if (ref === "gap") return 1.6;
  if (ref.startsWith("I")) return 3;
  return 5;
}

function snap(point: LngLat, prefer: Set<string>): number {
  for (const radius of [4, 12, 30]) {
    const preferred = nearby(point, radius).filter((id) => [...(nodeRefs.get(id) ?? [])].some((ref) => prefer.has(ref)));
    if (preferred.length) {
      return preferred.reduce((best, id) => (km(point, nodes[id]) < km(point, nodes[best]) ? id : best));
    }
  }
  const any = nearby(point, 40);
  if (!any.length) throw new Error(`No road near ${point.join(",")}`);
  return any.reduce((best, id) => (km(point, nodes[id]) < km(point, nodes[best]) ? id : best));
}

interface Step {
  point: LngLat;
  ref: string;
}

function shortestPath(from: number, to: number, prefer: Set<string>): Step[] {
  const dist = new Map<number, number>([[from, 0]]);
  const back = new Map<number, { node: number; ref: string }>();
  const heap: [number, number][] = [[0, from]];
  const push = (item: [number, number]) => {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[parent][0] <= heap[i][0]) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  };
  const pop = (): [number, number] => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length) {
      heap[0] = last;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
        if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
        if (m === i) break;
        [heap[m], heap[i]] = [heap[i], heap[m]];
        i = m;
      }
    }
    return top;
  };
  while (heap.length) {
    const [d, node] = pop();
    if (node === to) break;
    if (d > (dist.get(node) ?? Infinity)) continue;
    for (const edge of edges[node]) {
      const next = d + edge.km * costFactor(edge.ref, prefer);
      if (next < (dist.get(edge.to) ?? Infinity)) {
        dist.set(edge.to, next);
        back.set(edge.to, { node, ref: edge.ref });
        push([next, edge.to]);
      }
    }
  }
  if (!dist.has(to)) throw new Error("No path");
  const steps: Step[] = [];
  let at = to;
  while (at !== from) {
    const prev = back.get(at)!;
    steps.push({ point: nodes[at], ref: prev.ref });
    at = prev.node;
  }
  steps.push({ point: nodes[from], ref: steps.length ? steps[steps.length - 1].ref : "local" });
  return steps.reverse();
}

// A routed leg: the highway path plus dashed local connectors at either end.
interface RoutedLeg {
  spec: LegSpec;
  path: Step[];
  startConnector: LngLat[];
  endConnector: LngLat[];
}

function routeLeg(spec: LegSpec): RoutedLeg {
  const prefer = new Set(spec.prefer);
  const points = [spec.start, ...spec.via, spec.end];
  const path: Step[] = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const manual = spec.manual?.find((m) => m.after === i);
    if (manual) {
      manual.line.forEach((point) => path.push({ point, ref: manual.ref }));
      continue;
    }
    const a = snap(points[i], prefer);
    const b = snap(points[i + 1], prefer);
    const piece = a === b ? [{ point: nodes[a], ref: spec.prefer[0] }] : shortestPath(a, b, prefer);
    // The first point of a segment carries the ref of the road that leads to it.
    piece.forEach((step, j) => {
      if (j === 0 && path.length && km(path[path.length - 1].point, step.point) < 0.05) return;
      path.push(step);
    });
  }
  const first = path[0].point;
  const last = path[path.length - 1].point;
  return {
    spec,
    path,
    startConnector: km(spec.start, first) > 0.3 ? [spec.start, first] : [],
    endConnector: km(spec.end, last) > 0.3 ? [last, spec.end] : [],
  };
}

const routed = new Map(legs.map((spec) => [spec.id, routeLeg(spec)]));
if (process.env.DEBUG_LEG) {
  const p = routed.get(process.env.DEBUG_LEG)!.path;
  let runRef = "";
  let runKm = 0;
  let start = p[0].point;
  for (let i = 1; i < p.length; i += 1) {
    if (p[i].ref !== runRef) {
      if (runRef) console.log(runRef, runKm.toFixed(1), start.map((v) => v.toFixed(3)).join(","));
      runRef = p[i].ref;
      runKm = 0;
      start = p[i - 1].point;
    }
    runKm += km(p[i - 1].point, p[i].point);
  }
  console.log(runRef, runKm.toFixed(1), start.map((v) => v.toFixed(3)).join(","));
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Which state a point is in, for the "Into Alabama" markers.

const statePolys: { name: string; rings: LngLat[][][]; bbox: [number, number, number, number] }[] = [];
for (const feature of statesGeo.features) {
  if (feature.properties.adm0_a3 !== "USA") continue;
  const rings = polygons(feature.geometry);
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  rings.forEach((poly) =>
    poly[0].forEach(([x, y]) => {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }),
  );
  statePolys.push({ name: String(feature.properties.name), rings, bbox: [minX, minY, maxX, maxY] });
}

const mexicoRings: LngLat[][] = countriesGeo.features
  .filter((f) => f.properties.ADM0_A3 === "MEX")
  .flatMap((f) => polygons(f.geometry).map((poly) => poly[0]))
  .filter((ring) => ring.some(([x, y]) => x < -103 && y > 29));

function inRing(point: LngLat, ring: LngLat[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > point[1] !== yj > point[1] && point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function stateAt(point: LngLat): string | null {
  for (const state of statePolys) {
    const [minX, minY, maxX, maxY] = state.bbox;
    if (point[0] < minX || point[0] > maxX || point[1] < minY || point[1] > maxY) continue;
    if (state.rings.some((poly) => inRing(point, poly[0]) && !poly.slice(1).some((hole) => inRing(point, hole)))) {
      return state.name;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Projection and map assembly.

const WIDTH = 520;

interface Frame {
  lng0: number;
  lat0: number;
  scale: number;
  cos: number;
  width: number;
  height: number;
  bounds: [number, number, number, number];
}

function frameFor(points: LngLat[]): Frame {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  points.forEach(([x, y]) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  });
  const cos = Math.cos((((minY + maxY) / 2) * Math.PI) / 180);
  let spanX = (maxX - minX) * cos;
  let spanY = maxY - minY;
  // Never zoom closer than about 25 miles across.
  const minSpan = 0.36;
  if (spanX < minSpan && spanY < minSpan) {
    spanX = Math.max(spanX, minSpan);
    spanY = Math.max(spanY, minSpan * 0.7);
  }
  spanX *= 1.32;
  spanY *= 1.3;
  const ratio = Math.min(1.1, Math.max(0.62, spanY / spanX));
  if (spanY / spanX < ratio) spanY = spanX * ratio;
  else spanX = spanY / ratio;
  const cx = ((minX + maxX) / 2) * cos;
  const cy = (minY + maxY) / 2;
  const height = Math.round(WIDTH * ratio);
  const scale = WIDTH / spanX;
  const lng0 = (cx - spanX / 2) / cos;
  const lat0 = cy + spanY / 2;
  const pad = 0.15;
  return {
    lng0,
    lat0,
    scale,
    cos,
    width: WIDTH,
    height,
    bounds: [lng0 - (spanX * pad) / cos, lat0 - spanY * (1 + pad), lng0 + (spanX * (1 + pad)) / cos, lat0 + spanY * pad],
  };
}

function project(frame: Frame, [lng, lat]: LngLat): [number, number] {
  return [(lng - frame.lng0) * frame.cos * frame.scale, (frame.lat0 - lat) * frame.scale];
}

function inBounds(frame: Frame, [lng, lat]: LngLat): boolean {
  const [w, s, e, n] = frame.bounds;
  return lng >= w && lng <= e && lat >= s && lat <= n;
}

function simplify(points: [number, number][], tolerance: number): [number, number][] {
  if (points.length < 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const stack: [number, number][] = [[0, points.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    const [ax, ay] = points[a];
    const [bx, by] = points[b];
    const len = Math.hypot(bx - ax, by - ay) || 1;
    let worst = -1;
    let worstD = tolerance;
    for (let i = a + 1; i < b; i += 1) {
      const [px, py] = points[i];
      const d = Math.abs((bx - ax) * (ay - py) - (ax - px) * (by - ay)) / len;
      if (d > worstD) {
        worst = i;
        worstD = d;
      }
    }
    if (worst > 0) {
      keep[worst] = 1;
      stack.push([a, worst], [worst, b]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

function pathData(runs: [number, number][][], close = false): string {
  return runs
    .filter((run) => run.length > 1)
    .map((run) => run.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join("") + (close ? "Z" : ""))
    .join("");
}

// Splits a line into the runs that fall inside the frame, keeping one point past each edge.
function clipLine(frame: Frame, coords: LngLat[]): LngLat[][] {
  const runs: LngLat[][] = [];
  let run: LngLat[] = [];
  coords.forEach((point, i) => {
    const inside = inBounds(frame, point);
    if (inside) {
      if (!run.length && i > 0) run.push(coords[i - 1]);
      run.push(point);
    } else if (run.length) {
      run.push(point);
      runs.push(run);
      run = [];
    }
  });
  if (run.length) runs.push(run);
  return runs;
}

// Sutherland-Hodgman against the frame's bounds.
function clipRing(frame: Frame, ring: LngLat[]): LngLat[] {
  const [w, s, e, n] = frame.bounds;
  const edgesOf: [(p: LngLat) => boolean, (a: LngLat, b: LngLat) => LngLat][] = [
    [(p) => p[0] >= w, (a, b) => [w, a[1] + ((b[1] - a[1]) * (w - a[0])) / (b[0] - a[0])]],
    [(p) => p[0] <= e, (a, b) => [e, a[1] + ((b[1] - a[1]) * (e - a[0])) / (b[0] - a[0])]],
    [(p) => p[1] >= s, (a, b) => [a[0] + ((b[0] - a[0]) * (s - a[1])) / (b[1] - a[1]), s]],
    [(p) => p[1] <= n, (a, b) => [a[0] + ((b[0] - a[0]) * (n - a[1])) / (b[1] - a[1]), n]],
  ];
  let out = ring;
  for (const [inside, cross] of edgesOf) {
    const input = out;
    out = [];
    if (!input.length) break;
    let prev = input[input.length - 1];
    for (const point of input) {
      if (inside(point)) {
        if (!inside(prev)) out.push(cross(prev, point));
        out.push(point);
      } else if (inside(prev)) {
        out.push(cross(prev, point));
      }
      prev = point;
    }
  }
  return out;
}

function ringBoxHits(frame: Frame, ring: LngLat[]): boolean {
  const [w, s, e, n] = frame.bounds;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of ring) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  return maxX >= w && minX <= e && maxY >= s && minY <= n;
}

function polygonLayer(frame: Frame, features: GeoJson["features"], keep: (props: Record<string, unknown>) => boolean): string {
  const runs: [number, number][][] = [];
  for (const feature of features) {
    if (!keep(feature.properties)) continue;
    for (const poly of polygons(feature.geometry)) {
      for (const ring of poly) {
        if (!ringBoxHits(frame, ring)) continue;
        const clipped = clipRing(frame, ring);
        if (clipped.length < 3) continue;
        const projected = simplify(
          clipped.map((p) => project(frame, p)),
          0.6,
        );
        if (projected.length >= 3) runs.push(projected);
      }
    }
  }
  // Holes are drawn with evenodd fill.
  return pathData(runs, true);
}

function lineLayer(frame: Frame, all: LngLat[][], tolerance = 0.7): string {
  const runs: [number, number][][] = [];
  for (const coords of all) {
    for (const run of clipLine(frame, coords)) {
      runs.push(
        simplify(
          run.map((p) => project(frame, p)),
          tolerance,
        ),
      );
    }
  }
  return pathData(runs);
}

interface Label {
  x: number;
  y: number;
  text: string;
  anchor: "start" | "end" | "middle";
}

interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

function overlaps(a: Box, b: Box): boolean {
  return a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
}

const FONT = 20;

function textBox(x: number, y: number, text: string, anchor: Label["anchor"], size = FONT, spaced = false): Box {
  const w = text.length * size * (spaced ? 0.78 : 0.56);
  const x0 = anchor === "start" ? x : anchor === "end" ? x - w : x - w / 2;
  return { x0: x0 - 2, y0: y - size * 0.8, x1: x0 + w + 2, y1: y + size * 0.25 };
}

function fits(frame: Frame, box: Box, taken: Box[]): boolean {
  if (box.x0 < 4 || box.y0 < 4 || box.x1 > frame.width - 4 || box.y1 > frame.height - 4) return false;
  return !taken.some((other) => overlaps(box, other));
}

function shieldText(ref: string, spec?: LegSpec): string {
  if (spec?.shields?.[ref]) return spec.shields[ref];
  if (ref.startsWith("I")) return ref.slice(1);
  if (ref.startsWith("US")) return ref.slice(2);
  if (ref.startsWith("S")) return ref.slice(1);
  return ref;
}

function shieldKind(ref: string): "interstate" | "us" | "state" | "loop" {
  if (ref.startsWith("I")) return "interstate";
  if (ref.startsWith("US")) return "us";
  if (ref.startsWith("L")) return "loop";
  return "state";
}

export interface LegMapData {
  width: number;
  height: number;
  land: string;
  mexico: string;
  water: string;
  rivers: string;
  states: string;
  roads: { interstate: string; us: string; state: string };
  route: string[];
  connectors: string;
  shields: { x: number; y: number; text: string; kind: string }[];
  places: (Label & { x0: number; y0: number; main: boolean })[];
  stateNames: Label[];
  crossings: { x: number; y: number; text: string; anchor: Label["anchor"]; lx: number; ly: number }[];
  markers: { x: number; y: number; kind: "start" | "end" | "stop"; label: string; n?: number; lx: number; ly: number; anchor: Label["anchor"] }[];
  scale: { units: number; miles: number };
  routeMiles: number;
}

function buildMap(id: string, pieces: RoutedLeg[], opts: { towns: string[]; stopMarkers: boolean; startLabel: string; endLabel: string }): LegMapData {
  const allPoints: LngLat[] = [];
  pieces.forEach((piece) => {
    allPoints.push(piece.spec.start, piece.spec.end, ...piece.path.map((s) => s.point));
  });
  const frame = frameFor(allPoints);

  const land = polygonLayer(frame, countriesGeo.features, (p) => p.ADM0_A3 === "USA" || p.ADM0_A3 === "CAN");
  const mexico = polygonLayer(frame, countriesGeo.features, (p) => p.ADM0_A3 === "MEX");
  const water = polygonLayer(frame, lakesGeo.features, (p) => Number(p.scalerank ?? 10) <= 10);
  const rivers = lineLayer(
    frame,
    riversGeo.features.flatMap((f) => lines(f.geometry)),
  );
  const states = lineLayer(
    frame,
    stateLinesGeo.features.filter((f) => f.properties.ADM0_A3 === "USA").flatMap((f) => lines(f.geometry)),
    0.5,
  );
  const byTier = (tier: Tier) => lineLayer(frame, roads.filter((r) => r.tier === tier).map((r) => r.coords), 0.8);
  const roadLayers = { interstate: byTier("interstate"), us: byTier("us"), state: byTier("state") };

  const route = pieces.map((piece) =>
    pathData([
      simplify(
        piece.path.map((s) => project(frame, s.point)),
        0.4,
      ),
    ]),
  );
  const connectors = pathData(
    pieces.flatMap((piece) => [piece.startConnector, piece.endConnector].filter((c) => c.length).map((c) => c.map((p) => project(frame, p)))),
  );

  const taken: Box[] = [];
  const markers: LegMapData["markers"] = [];
  const addMarker = (point: LngLat, kind: "start" | "end" | "stop", label: string, n?: number) => {
    const [x, y] = project(frame, point);
    taken.push({ x0: x - 13, y0: y - 13, x1: x + 13, y1: y + 13 });
    markers.push({ x, y, kind, label, n, lx: x, ly: y, anchor: "start" });
  };
  const first = pieces[0];
  const last = pieces[pieces.length - 1];
  addMarker(first.spec.start, "start", opts.startLabel);
  if (opts.stopMarkers) {
    pieces
      .slice(0, -1)
      .filter((piece) => !piece.spec.junction)
      .forEach((piece, i) => addMarker(piece.spec.end, "stop", piece.spec.endLabel, i + 1));
  }
  addMarker(last.spec.end, "end", opts.endLabel);

  // Route path boxes so labels do not sit on the line.
  const routeBoxes: Box[] = [];
  pieces.forEach((piece) => {
    const pts = piece.path.map((s) => project(frame, s.point));
    for (let i = 1; i < pts.length; i += 1) {
      const [ax, ay] = pts[i - 1];
      const [bx, by] = pts[i];
      const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 5));
      for (let k = 0; k <= steps; k += 1) {
        const x = ax + ((bx - ax) * k) / steps;
        const y = ay + ((by - ay) * k) / steps;
        routeBoxes.push({ x0: x - 4, y0: y - 4, x1: x + 4, y1: y + 4 });
      }
    }
  });

  // Keep the scale bar and north arrow clear.
  taken.push({ x0: 0, y0: frame.height - 34, x1: 150, y1: frame.height });
  taken.push({ x0: frame.width - 40, y0: 0, x1: frame.width, y1: 60 });

  // Marker labels get first claim on space.
  const placeLabel = (x: number, y: number, text: string, offset: number, size = FONT, avoidRoute = true): (Label & Box) | null => {
    const tries: [number, number, Label["anchor"]][] = [];
    for (const o of [offset, offset + 10, offset + 22]) {
      tries.push(
        [x + o, y + size * 0.3, "start"],
        [x - o, y + size * 0.3, "end"],
        [x, y - o - 2, "middle"],
        [x, y + o + size * 0.75, "middle"],
        [x + o * 0.8, y - o * 0.8, "start"],
        [x - o * 0.8, y - o * 0.8, "end"],
        [x + o * 0.8, y + o + size * 0.5, "start"],
        [x - o * 0.8, y + o + size * 0.5, "end"],
      );
    }
    for (const [lx, ly, anchor] of tries) {
      const box = textBox(lx, ly, text, anchor, size);
      if (fits(frame, box, avoidRoute ? [...taken, ...routeBoxes] : taken)) {
        taken.push(box);
        return { x: lx, y: ly, text, anchor, ...box };
      }
    }
    return null;
  };

  // Highway shields along the route, one per long run of the same road.
  const shields: LegMapData["shields"] = [];
  const shieldAt = (x: number, y: number, text: string, kind: string): boolean => {
    const w = 16 + text.length * 12;
    const box = { x0: x - w / 2 - 2, y0: y - 15, x1: x + w / 2 + 2, y1: y + 15 };
    if (!fits(frame, box, taken)) return false;
    taken.push(box);
    shields.push({ x, y, text, kind });
    return true;
  };
  for (const piece of pieces) {
    const runs: { ref: string; pts: [number, number][] }[] = [];
    piece.path.forEach((step) => {
      if (step.ref === "gap") {
        runs[runs.length - 1]?.pts.push(project(frame, step.point));
        return;
      }
      const lastRun = runs[runs.length - 1];
      if (lastRun && lastRun.ref === step.ref) lastRun.pts.push(project(frame, step.point));
      else runs.push({ ref: step.ref, pts: [project(frame, step.point)] });
    });
    const shown = new Set<string>();
    for (const run of runs) {
      if (!piece.spec.prefer.includes(run.ref) && !piece.spec.shields?.[run.ref]) continue;
      let length = 0;
      for (let i = 1; i < run.pts.length; i += 1) length += Math.hypot(run.pts[i][0] - run.pts[i - 1][0], run.pts[i][1] - run.pts[i - 1][1]);
      if (length < 60 && shown.has(run.ref)) continue;
      if (length < 25) continue;
      // Try spots along the middle of the run.
      const order = [0.5, 0.35, 0.65, 0.2, 0.8];
      for (const t of order) {
        const target = length * t;
        let walked = 0;
        let spot: [number, number] | null = null;
        for (let i = 1; i < run.pts.length; i += 1) {
          const seg = Math.hypot(run.pts[i][0] - run.pts[i - 1][0], run.pts[i][1] - run.pts[i - 1][1]);
          if (walked + seg >= target) {
            const f = seg ? (target - walked) / seg : 0;
            spot = [run.pts[i - 1][0] + (run.pts[i][0] - run.pts[i - 1][0]) * f, run.pts[i - 1][1] + (run.pts[i][1] - run.pts[i - 1][1]) * f];
            break;
          }
          walked += seg;
        }
        if (spot && shieldAt(spot[0], spot[1], shieldText(run.ref, piece.spec), shieldKind(run.ref))) {
          shown.add(run.ref);
          break;
        }
      }
    }
  }

  markers.forEach((marker) => {
    // Numbered stops on a day map are named in the legend under it.
    if (marker.kind === "stop") return;
    const label = placeLabel(marker.x, marker.y, marker.label, 16, FONT + 1) ?? placeLabel(marker.x, marker.y, marker.label, 16, FONT + 1, false);
    if (label) {
      marker.lx = label.x;
      marker.ly = label.y;
      marker.anchor = label.anchor;
    } else {
      marker.label = "";
    }
  });

  // State line crossings along the route.
  // Only on leg maps, and only where the new state holds for the next 10 km,
  // so coarse borders near a stop do not flicker in and out.
  const crossings: LegMapData["crossings"] = [];
  const statesAlong = (pts: LngLat[]) => pts.map((p) => stateAt(p));
  (opts.stopMarkers ? [] : pieces).forEach((piece) => {
    const pts = [piece.spec.start, ...piece.path.map((s) => s.point), piece.spec.end];
    const along = statesAlong(pts);
    const holds = (from: number, state: string) => {
      let walked = 0;
      for (let j = from + 1; j < pts.length && walked < 10; j += 1) {
        walked += km(pts[j - 1], pts[j]);
        if (along[j] && along[j] !== state) return false;
      }
      // Reaching the end of the leg in the new state counts too.
      return true;
    };
    let prevState = along[0];
    let fromStart = 0;
    for (let i = 1; i < pts.length; i += 1) {
      const state = along[i];
      fromStart += km(pts[i - 1], pts[i]);
      // A stop right on a state line (Hoover Dam) is not a crossing.
      if (state && prevState && state !== prevState && fromStart > 5 && holds(i, state)) {
        // Midpoint of the step that crosses.
        const mid: LngLat = [(pts[i - 1][0] + pts[i][0]) / 2, (pts[i - 1][1] + pts[i][1]) / 2];
        if (inBounds(frame, mid)) {
          const [x, y] = project(frame, mid);
          if (x > 10 && x < frame.width - 10 && y > 10 && y < frame.height - 10) {
            const label = placeLabel(x, y, `Into ${state}`, 10, FONT - 2);
            if (label) crossings.push({ x, y, text: label.text, anchor: label.anchor, lx: label.x, ly: label.y });
          }
        }
      }
      if (state) prevState = state;
    }
  });

  // Town labels: the leg's own towns first.
  const places: LegMapData["places"] = [];
  const markerSpots = markers.map((m) => [m.x, m.y]);
  opts.towns.forEach((name) => {
    const at = townAt[name];
    if (!at) throw new Error(`Unknown town ${name}`);
    if (!inBounds(frame, at)) return;
    const [x, y] = project(frame, at);
    if (x < 6 || y < 6 || x > frame.width - 6 || y > frame.height - 6) return;
    // A town under a marker, or named by one, is already labelled.
    if (markerSpots.some(([mx, my]) => Math.hypot(mx - x, my - y) < 14)) return;
    if (markers.some((m) => m.label.includes(name) && Math.hypot(m.x - x, m.y - y) < 60)) return;
    const label = placeLabel(x, y, name, 8) ?? placeLabel(x, y, name, 8, FONT, false);
    if (label) {
      places.push({ ...label, x0: x, y0: y, main: true });
      taken.push({ x0: x - 4, y0: y - 4, x1: x + 4, y1: y + 4 });
    }
  });

  // State names in open space, as quiet background labels.
  const stateNames: Label[] = [];
  statePolys.forEach((state) => {
    const [minX, minY, maxX, maxY] = state.bbox;
    const [w, s, e, n] = frame.bounds;
    if (maxX < w || minX > e || maxY < s || minY > n) return;
    // Sample a coarse grid inside the frame for a point in this state.
    const candidates: [number, number][] = [];
    for (let gx = 0.15; gx <= 0.85; gx += 0.1) {
      for (let gy = 0.12; gy <= 0.9; gy += 0.1) {
        const x = frame.width * gx;
        const y = frame.height * gy;
        const lng = frame.lng0 + x / frame.scale / frame.cos;
        const lat = frame.lat0 - y / frame.scale;
        if (stateAt([lng, lat]) === state.name) candidates.push([x, y]);
      }
    }
    // Prefer spots far from the route.
    candidates.sort((a, b) => distToRoute(b) - distToRoute(a));
    for (const [x, y] of candidates.slice(0, 12)) {
      const text = state.name.toUpperCase();
      const box = textBox(x, y, text, "middle", 15, true);
      if (fits(frame, box, [...taken, ...routeBoxes])) {
        taken.push(box);
        stateNames.push({ x, y, text, anchor: "middle" });
        break;
      }
    }
  });
  // Name Mexico where it shows, so the border does not read as a glitch.
  {
    const candidates: [number, number][] = [];
    for (let gx = 0.12; gx <= 0.88; gx += 0.08) {
      for (let gy = 0.1; gy <= 0.92; gy += 0.08) {
        const x = frame.width * gx;
        const y = frame.height * gy;
        const lng = frame.lng0 + x / frame.scale / frame.cos;
        const lat = frame.lat0 - y / frame.scale;
        if (mexicoRings.some((ring) => inRing([lng, lat], ring))) candidates.push([x, y]);
      }
    }
    candidates.sort((a, b) => distToRoute(b) - distToRoute(a));
    for (const [x, y] of candidates.slice(0, 15)) {
      const box = textBox(x, y, "MEXICO", "middle", 15, true);
      if (fits(frame, box, [...taken, ...routeBoxes])) {
        taken.push(box);
        stateNames.push({ x, y, text: "MEXICO", anchor: "middle" });
        break;
      }
    }
  }
  function distToRoute([x, y]: [number, number]): number {
    let best = Infinity;
    for (const b of routeBoxes) best = Math.min(best, Math.hypot(b.x0 + 3 - x, b.y0 + 3 - y));
    return best;
  }

  // Scale bar: a round number of miles near a fifth of the width.
  const milesPerUnit = (1 / frame.scale) * 69.0;
  const target = frame.width * 0.2 * milesPerUnit;
  const nice = [5, 10, 20, 25, 50, 100, 200, 250].reduce((best, m) => (Math.abs(m - target) < Math.abs(best - target) ? m : best));
  let routeKm = 0;
  pieces.forEach((piece) => {
    for (let i = 1; i < piece.path.length; i += 1) routeKm += km(piece.path[i - 1].point, piece.path[i].point);
  });

  console.log(`${id}: ${frame.width}x${frame.height}, ${(routeKm * 0.621371).toFixed(0)} mi on the map`);
  return {
    width: frame.width,
    height: frame.height,
    land,
    mexico,
    water,
    rivers,
    states,
    roads: roadLayers,
    route,
    connectors,
    shields,
    places,
    stateNames,
    crossings,
    markers,
    scale: { units: nice / milesPerUnit, miles: nice },
    routeMiles: Math.round(routeKm * 0.621371),
  };
}

// ---------------------------------------------------------------------------

const maps: Record<string, LegMapData> = {};
for (const spec of legs) {
  const piece = routed.get(spec.id)!;
  const prefer = new Set(spec.prefer);
  const onPlan = piece.path.filter((s) => prefer.has(s.ref) || s.ref.startsWith("L")).length / piece.path.length;
  if (onPlan < 0.8) console.warn(`  ${spec.id}: only ${(onPlan * 100).toFixed(0)}% of points on the planned roads`);
  maps[spec.id] = buildMap(spec.id, [piece], { towns: spec.towns, stopMarkers: false, startLabel: spec.startLabel, endLabel: spec.endLabel });
}
for (const day of days) {
  const pieces = day.legs.map((id) => routed.get(id)!);
  maps[day.id] = buildMap(day.id, pieces, { towns: day.towns, stopMarkers: true, startLabel: day.startLabel, endLabel: day.endLabel });
}

writeGenerated("leg-maps.json", {
  source: "Natural Earth 1:10m roads, borders, lakes and rivers (public domain), routed along each leg's highways.",
  maps,
});
console.log(`Wrote ${Object.keys(maps).length} maps`);
