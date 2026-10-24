import type { Listing } from "../src/data/types.ts";
import { writeGenerated } from "./lib/io.ts";

const retrievedAt = "2026-09-24T19:30:00.000Z";

const bitner: Listing = {
  id: "signed-park_city-900-bitner-rd-e17",
  dedupKey: "900 bitner road apartment e17 park city ut 84098",
  townId: "park_city",
  inventoryClass: "seasonal_lease",
  name: "900 Bitner Road, Apartment E17, Park City, UT 84098",
  address: "900 Bitner Road, Apartment E17, Park City, UT 84098",
  lat: 40.7245784,
  lng: -111.5273942,
  bedrooms: 3,
  bathrooms: 2,
  advertisedRent: 3600,
  fees: [],
  allInMonthly: 3600,
  allInUnknown: true,
  term: "seasonal_6mo",
  availableOn: "2026-11-15",
  canStartNov1: false,
  petPolicy: "cats_ok",
  petEvidence:
    "Signed lease is the contract. A prior PCLodge page for this unit (winter 2025–26) said 1 dog or 2 cats. Confirm two cats are in the lease you signed.",
  furnished: true,
  parking: "Prior public listing: 1-car garage. Confirm in the signed lease.",
  workforceRequired: "unknown",
  sources: [
    {
      source: "property_manager",
      url: "https://www.pclodge.com/rentals/bitner-e17",
      retrievedAt,
    },
  ],
  status: "active",
  notes:
    "Signed lease Nov 15, 2026 – May 15, 2027 at $3,600/month. What that rent includes is still a confirm item. Canyon Creek Club, Kimball Junction. Beds, baths, garage, utilities, and the two-cat line are from the prior public listing, not a re-read of the signed document.",
  pageVerifiedAt: retrievedAt,
};

writeGenerated("listings.json", {
  retrievedAt,
  listings: [bitner],
});
console.log("Wrote listings.json for signed 900 Bitner E17");
