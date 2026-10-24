import { assertNever } from "./money";
import { listingMinBeds, listingRentCap } from "../data/towns";
import type {
  InventoryClass,
  Listing,
  PetPolicy,
  QualifyingBand,
  SourceId,
  TermCertainty,
} from "../data/types";

export const listingStaleAfterDays = 7;

export function listingBand(listing: Listing): QualifyingBand {
  if (listing.bedrooms < listingMinBeds) {
    return "rejected";
  }
  if (listing.allInMonthly >= listingRentCap) {
    return "rejected";
  }
  if (listing.petPolicy === "no_pets_hoa" || listing.petPolicy === "dogs_only") {
    return "rejected";
  }

  if (listing.inventoryClass === "monthly_stay") {
    if (
      listing.canStartNov1 === true &&
      (listing.term === "month_to_month" || listing.term === "seasonal_6mo") &&
      listing.petPolicy !== "pets_negotiable" &&
      listing.petPolicy !== "one_pet_only"
    ) {
      return "needs_confirmation";
    }
    return "negotiation";
  }

  if (listing.petPolicy === "pets_negotiable" || listing.petPolicy === "one_pet_only") {
    return "negotiation";
  }
  if (listing.term === "ask_shorter" || listing.term === "twelve_only") {
    return "negotiation";
  }

  const confirmationGaps =
    listing.petPolicy === "unknown" ||
    listing.term === "unknown" ||
    listing.canStartNov1 === "unknown" ||
    listing.allInUnknown;

  if (
    listing.petPolicy === "cats_ok" &&
    (listing.term === "month_to_month" || listing.term === "seasonal_6mo") &&
    listing.canStartNov1 === true &&
    listing.inventoryClass === "seasonal_lease" &&
    !listing.allInUnknown
  ) {
    return "qualifying";
  }

  if (confirmationGaps) {
    return "needs_confirmation";
  }

  return "negotiation";
}

export function petPolicyLabel(policy: PetPolicy): string {
  switch (policy) {
    case "cats_ok":
      return "Cats allowed";
    case "pets_negotiable":
      return "Pets negotiable";
    case "one_pet_only":
      return "One pet only";
    case "no_pets_hoa":
      return "No pets (HOA)";
    case "dogs_only":
      return "Dogs only";
    case "unknown":
      return "Pet policy unknown";
    default:
      return assertNever(policy);
  }
}

export function termLabel(term: TermCertainty): string {
  switch (term) {
    case "month_to_month":
      return "Month-to-month";
    case "seasonal_6mo":
      return "Listed 6-month / winter";
    case "twelve_only":
      return "12-month only";
    case "ask_shorter":
      return "Ask about shorter term";
    case "unknown":
      return "Term unknown";
    default:
      return assertNever(term);
  }
}

export function bandLabel(band: QualifyingBand): string {
  switch (band) {
    case "qualifying":
      return "Qualifying";
    case "needs_confirmation":
      return "Needs confirmation";
    case "negotiation":
      return "Negotiation";
    case "rejected":
      return "Rejected";
    default:
      return assertNever(band);
  }
}

export function inventoryClassLabel(klass: InventoryClass): string {
  switch (klass) {
    case "seasonal_lease":
      return "Seasonal / long-term lease";
    case "monthly_stay":
      return "Monthly stay (not a lease)";
    default:
      return assertNever(klass);
  }
}

export function sourceLabel(source: SourceId): string {
  switch (source) {
    case "zillow_group":
      return "Zillow Group";
    case "apartments_com":
      return "Apartments.com";
    case "realtor":
      return "Realtor.com";
    case "furnished_finder":
      return "Furnished Finder";
    case "airbnb":
      return "Airbnb";
    case "vrbo":
      return "VRBO";
    case "rentcast":
      return "RentCast";
    case "property_manager":
      return "Property manager";
    case "aggregator":
      return "Listing portal";
    default:
      return assertNever(source);
  }
}

export function petFeasibilityRank(policy: PetPolicy): number {
  switch (policy) {
    case "cats_ok":
      return 0;
    case "pets_negotiable":
      return 1;
    case "one_pet_only":
      return 2;
    case "unknown":
      return 3;
    case "dogs_only":
      return 4;
    case "no_pets_hoa":
      return 5;
    default:
      return assertNever(policy);
  }
}

export function listingRetrievedAt(listing: Listing): string {
  const times = listing.sources.map((s) => s.retrievedAt).filter(Boolean);
  if (times.length === 0) {
    return "";
  }
  return times.sort().at(-1) ?? "";
}

export function isListingStale(listing: Listing, now = new Date()): boolean {
  if (listing.status === "stale") {
    return true;
  }
  const retrieved = listingRetrievedAt(listing);
  if (!retrieved) {
    return true;
  }
  const ageMs = now.getTime() - new Date(retrieved).getTime();
  return ageMs > listingStaleAfterDays * 24 * 60 * 60 * 1000;
}

export function withFreshness(listing: Listing, now = new Date()): Listing {
  if (listing.status === "source_down") {
    return listing;
  }
  return { ...listing, status: isListingStale(listing, now) ? "stale" : "active" };
}

export function allInFees(advertisedRent: number, fees: Listing["fees"]): number {
  const extra = fees.reduce((sum, fee) => sum + (fee.monthlyUsd ?? 0), 0);
  return advertisedRent + extra;
}

export function sortListings(rows: Listing[]): Listing[] {
  const bandRank: Record<QualifyingBand, number> = {
    qualifying: 0,
    needs_confirmation: 1,
    negotiation: 2,
    rejected: 3,
  };
  return [...rows].sort((a, b) => {
    const band = bandRank[listingBand(a)] - bandRank[listingBand(b)];
    if (band !== 0) {
      return band;
    }
    const pet = petFeasibilityRank(a.petPolicy) - petFeasibilityRank(b.petPolicy);
    if (pet !== 0) {
      return pet;
    }
    return a.allInMonthly - b.allInMonthly;
  });
}

export function listingById(rows: Listing[], id: string): Listing {
  const found = rows.find((row) => row.id === id);
  if (!found) {
    throw new Error(`Unknown listing ${id}`);
  }
  return found;
}

export function isExactTwoBedrooms(listing: Pick<Listing, "bedrooms">): boolean {
  return listing.bedrooms === 2;
}

export function isKeepPetsPolicy(policy: PetPolicy): boolean {
  switch (policy) {
    case "cats_ok":
    case "pets_negotiable":
    case "one_pet_only":
      return true;
    case "no_pets_hoa":
    case "dogs_only":
    case "unknown":
      return false;
    default:
      return assertNever(policy);
  }
}

export function isCatsAllowedKeep(policy: PetPolicy): boolean {
  switch (policy) {
    case "cats_ok":
      return true;
    case "pets_negotiable":
    case "one_pet_only":
    case "no_pets_hoa":
    case "dogs_only":
    case "unknown":
      return false;
    default:
      return assertNever(policy);
  }
}

export function isSeasonalTermKeep(term: TermCertainty): boolean {
  switch (term) {
    case "month_to_month":
    case "seasonal_6mo":
      return true;
    case "twelve_only":
    case "ask_shorter":
    case "unknown":
      return false;
    default:
      return assertNever(term);
  }
}

export function isHuntPageKeepable(listing: Listing): boolean {
  return (
    isExactTwoBedrooms(listing) &&
    isCatsAllowedKeep(listing.petPolicy) &&
    isSeasonalTermKeep(listing.term) &&
    listing.canStartNov1 !== false
  );
}

export interface HuntFilters {
  minBeds: number;
  maxAllIn: number;
  leasesOnly: boolean;
  includeNegotiation: boolean;
  includeRejected: boolean;
  townId: Listing["townId"] | "all";
}

export const defaultHuntFilters: HuntFilters = {
  minBeds: listingMinBeds,
  maxAllIn: listingRentCap,
  leasesOnly: true,
  includeNegotiation: true,
  includeRejected: false,
  townId: "all",
};

export function filterListings(rows: Listing[], filters: HuntFilters): Listing[] {
  return rows.filter((row) => {
    if (filters.townId !== "all" && row.townId !== filters.townId) {
      return false;
    }
    if (row.bedrooms < filters.minBeds) {
      return false;
    }
    if (row.allInMonthly >= filters.maxAllIn && !filters.includeRejected) {
      return false;
    }
    if (filters.leasesOnly && row.inventoryClass !== "seasonal_lease") {
      return false;
    }
    const band = listingBand(row);
    if (band === "qualifying" || band === "needs_confirmation") {
      return true;
    }
    if (band === "negotiation") {
      return filters.includeNegotiation;
    }
    return filters.includeRejected;
  });
}

export function huntDestinationTowns(rows: Listing[], filters: HuntFilters = defaultHuntFilters): Listing["townId"][] {
  const seen = new Set<Listing["townId"]>();
  for (const row of filterListings(rows, { ...filters, townId: "all" })) {
    seen.add(row.townId);
  }
  return [...seen];
}
