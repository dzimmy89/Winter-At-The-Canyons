import { assertNever } from "../lib/money";
import type { CorridorId, PassSystem, TownId } from "./types";

export interface Town {
  id: TownId;
  name: string;
  state: string;
  lat: number;
  lng: number;
  passSystem: PassSystem;
  passNote: string;
  passCostTwoAdults: number;
  transit: string;
  utilitiesBand: string;
  groceryNote: string;
  winterNotes: string;
}

export const origin = {
  label: "4922 NW 81st Ave, Gainesville, FL 32653",
  lat: 29.7048,
  lng: -82.3896,
} as const;

export const destination = {
  label: "900 Bitner Road, Apartment E17, Park City, UT 84098",
  lat: 40.7245784,
  lng: -111.5273942,
} as const;

export const winterTerm = "Nov 15, 2026 – May 15, 2027";
export const occupancyStart = "2026-11-15";
export const listingRentCap = 4000;
export const listingMinBeds = 2;

export const towns: Town[] = [
  {
    id: "park_city",
    name: "Park City",
    state: "UT",
    lat: destination.lat,
    lng: destination.lng,
    passSystem: "epic",
    passNote: "Park City Mountain and Canyons are Epic. This build does not carry a live two-adult pass price.",
    passCostTwoAdults: 0,
    transit: "Park City’s free bus stops in front of Canyon Creek Club. The drive still assumes a car.",
    utilitiesBand: "Signed rent is $3,600/month. Confirm whether that includes utilities, internet, garage, and pets.",
    groceryNote: "Kimball Junction / Newpark is a few minutes away. Main Street is about 15 minutes.",
    winterNotes:
      "Sunday uses I-25 and I-80 over Sherman Summit, which stays lower than Eisenhower and Vail. Those Colorado passes are the backup only when Wyoming has snow and they are bare. If both have snow, stay in Wheat Ridge. The pin is Apartment E17, not the town centroid.",
  },
];

export const townById = Object.fromEntries(towns.map((t) => [t.id, t])) as Record<TownId, Town>;

export function townLabel(id: TownId): string {
  switch (id) {
    case "park_city":
      return "Park City, UT";
    default:
      return assertNever(id);
  }
}

export function corridorForTown(id: TownId): CorridorId {
  switch (id) {
    case "park_city":
      return "parks_west";
    default:
      return assertNever(id);
  }
}

export function passSystemLabel(system: PassSystem): string {
  switch (system) {
    case "epic":
      return "Epic";
    default:
      return assertNever(system);
  }
}
