export type TownId = "park_city";

export type InventoryClass = "seasonal_lease" | "monthly_stay";

export type SourceId =
  | "zillow_group"
  | "apartments_com"
  | "realtor"
  | "furnished_finder"
  | "airbnb"
  | "vrbo"
  | "rentcast"
  | "property_manager"
  | "aggregator";

export type PetPolicy =
  | "cats_ok"
  | "pets_negotiable"
  | "one_pet_only"
  | "no_pets_hoa"
  | "dogs_only"
  | "unknown";

export type TermCertainty =
  | "month_to_month"
  | "seasonal_6mo"
  | "twelve_only"
  | "ask_shorter"
  | "unknown";

export type QualifyingBand = "qualifying" | "needs_confirmation" | "negotiation" | "rejected";

export type ListingStatus = "active" | "stale" | "source_down";

export type DriveCapHours = 8 | 10 | 13;

export type DriveStopKind = "rest" | "meal";

export type SundayCorridorId = "i70" | "i80" | "hold";

export type BudgetTierId = "conservative" | "realistic" | "upscale";

export type PassSystem = "epic";

export type CorridorId = "parks_west";

export type SourceHealth = "ok" | "skipped" | "down" | "stale";

export interface FeeLine {
  kind: "pet_rent" | "hoa" | "utilities" | "cleaning" | "resort" | "other";
  monthlyUsd: number | null;
  note: string;
}

export interface ListingSource {
  source: SourceId;
  url: string;
  retrievedAt: string;
}

export interface Listing {
  id: string;
  dedupKey: string;
  townId: TownId;
  inventoryClass: InventoryClass;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  bedrooms: number;
  bathrooms: number | null;
  advertisedRent: number;
  fees: FeeLine[];
  allInMonthly: number;
  allInUnknown: boolean;
  term: TermCertainty;
  availableOn: string | null;
  canStartNov1: boolean | "unknown";
  petPolicy: PetPolicy;
  petEvidence: string;
  furnished: boolean | "unknown";
  parking: string;
  workforceRequired: boolean | "unknown";
  sources: ListingSource[];
  status: ListingStatus;
  notes: string;
  pageVerifiedAt?: string;
}

export interface HotelNight {
  id: string;
  brand: string;
  propertyName: string;
  city: string;
  state: string;
  nights: number;
  petPolicyQuote: string;
  catsAllowed: boolean | "unknown";
  maxPets: number | "unknown";
  petFeeUsd: number | null;
  petFeeRefundable: boolean | "unknown";
  weightLimitLbs: number | null;
  sourceUrl: string;
  retrievedAt: string;
  callToConfirmTwoCats: boolean;
  awardPointsPerNight: number | null;
  awardPointsQuote: string;
  parkingUsd: number | null;
}

export interface DriveStopEvent {
  id: string;
  kind: DriveStopKind;
  place: string;
  road: string;
  purpose: string;
  minutes: number;
  clock: string;
  realisticUsd: number;
}

export interface SnowGate {
  checkAt: string;
  sourceName: string;
  sourceUrl: string;
  go: string;
  hold: string;
}

export interface SundayCorridor {
  id: SundayCorridorId;
  label: string;
  when: string;
  miles: number | null;
  driveHours: number | null;
}

export interface DriveDay {
  day: number;
  date: string;
  dateLabel: string;
  fromLabel: string;
  toLabel: string;
  departClock: string;
  arriveClock: string;
  latestSafeDepart: string;
  timeZone: string;
  miles: number;
  driveHours: number;
  stoppedMinutes: number;
  routeSummary: string;
  hotel: HotelNight | null;
  fuelUsd: number;
  foodUsd: number;
  contingencyUsd: number;
  winterNotes: string;
  stops: DriveStopEvent[];
  snowGate: SnowGate;
  corridors?: SundayCorridor[];
}

export interface ListingsSnapshot {
  retrievedAt: string;
  listings: Listing[];
}

export interface HotelsSnapshot {
  retrievedAt: string;
  properties: HotelNight[];
}

export interface RouteRecord {
  townId: TownId;
  miles: number;
  hours: number;
  corridor: CorridorId;
  summary: string;
  winterNotes: string;
  retrievedAt: string;
  provider: "mapbox" | "planning_estimate";
}

export interface RoutesSnapshot {
  retrievedAt: string;
  origin: { label: string; lat: number; lng: number };
  routes: RouteRecord[];
}

export interface SourceStatusRow {
  id: SourceId | "liteapi" | "mapbox" | "firecrawl" | "monid_zillow";
  status: SourceHealth;
  retrievedAt: string | null;
  note: string;
}

export interface SourceStatusSnapshot {
  retrievedAt: string;
  sources: SourceStatusRow[];
}

export interface CorridorSource {
  url: string;
  title: string;
  description: string;
  relevance: "high" | "medium" | "low";
}

export interface CorridorBrief {
  retrievedAt: string;
  query: string;
  requestId: string;
  results: CorridorSource[];
}

export type MapFeatureKind = "origin" | "stop" | "segment" | "dest";

export type MapFeature =
  | { kind: "origin" }
  | { kind: "stop"; stopId: string }
  | { kind: "segment"; segmentId: string }
  | { kind: "dest" };
