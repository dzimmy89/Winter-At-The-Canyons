import type { HotelNight } from "../src/data/types.ts";
import { writeGenerated } from "./lib/io.ts";

const retrievedAt = "2026-11-02T14:30:00.000Z";

const hamptonSecondaryAward =
  "Award Travel Finder, verified June 7, 2026: observed Hampton sweet spot 15,000–30,000 points/night. Hilton publishes no chart. This is the ceiling, not a live quote for this night.";

const hgiAward =
  "Planning estimate, not verified: Hilton Garden Inn award nights in smaller markets usually price near the top of the Hampton band. Check the live points price when you book.";

const properties: HotelNight[] = [
  {
    id: "broussard",
    brand: "Hampton",
    propertyName: "Hampton Inn Broussard-Lafayette Area",
    city: "Broussard",
    state: "LA",
    nights: 1,
    petPolicyQuote:
      "Hotels.com listing, retrieved 2026-11-02: Cats and dogs, 2 max, up to 75 lbs. USD 75 per stay. Check-in 3 PM to 1 AM, checkout 11 AM. 2280 East Main Street, Broussard.",
    catsAllowed: true,
    maxPets: 2,
    petFeeUsd: 75,
    petFeeRefundable: false,
    weightLimitLbs: 75,
    sourceUrl: "https://www.hotels.com/ho478325/",
    retrievedAt,
    callToConfirmTwoCats: true,
    awardPointsPerNight: 30000,
    awardPointsQuote: hamptonSecondaryAward,
    parkingUsd: 0,
    workspace: "Not needed, because Thursday is a driving day.",
  },
  {
    id: "fort_stockton",
    brand: "Hampton",
    propertyName: "Hampton Inn Fort Stockton",
    city: "Fort Stockton",
    state: "TX",
    nights: 1,
    petPolicyQuote:
      "Expedia listing, retrieved 2026-11-02: Dogs and cats only, 2 total, up to 34 lbs each. USD 75 per stay plus a one-time USD 150 cleaning fee. Another listing says 1 pet, so call to confirm two cats. 2271 W I-10.",
    catsAllowed: true,
    maxPets: 2,
    petFeeUsd: 225,
    petFeeRefundable: false,
    weightLimitLbs: 34,
    sourceUrl: "https://www.expedia.com/Fort-Stockton-Hotels-Hampton-Inn-Fort-Stockton.h1191980.Hotel-Information",
    retrievedAt,
    callToConfirmTwoCats: true,
    awardPointsPerNight: 30000,
    awardPointsQuote: hamptonSecondaryAward,
    parkingUsd: 0,
    workspace: "Not needed, because Friday is a driving day.",
  },
  {
    id: "marana",
    brand: "Hampton",
    propertyName: "Hampton Inn & Suites Tucson Marana",
    city: "Marana",
    state: "AZ",
    nights: 1,
    petPolicyQuote:
      "Expedia listing, retrieved 2026-11-02: Cats and dogs, 2 total. USD 75 per accommodation, per stay. Check-in from 3 PM. 6300 W Marana Center Blvd.",
    catsAllowed: true,
    maxPets: 2,
    petFeeUsd: 75,
    petFeeRefundable: false,
    weightLimitLbs: null,
    sourceUrl: "https://www.expedia.com/Arizona-Hotels-Hampton-Inn-Suites-Tucson-Marana.h32911466.Hotel-Information",
    retrievedAt,
    callToConfirmTwoCats: true,
    awardPointsPerNight: 30000,
    awardPointsQuote: hamptonSecondaryAward,
    parkingUsd: 0,
    workspace: "Not needed, because Saturday is a driving day.",
  },
  {
    id: "st_george",
    brand: "Hilton Garden Inn",
    propertyName: "Hilton Garden Inn St. George",
    city: "St. George",
    state: "UT",
    nights: 1,
    petPolicyQuote:
      "hilton.com and Travelocity, retrieved 2026-10-29: Dogs and cats only, 2 max. USD 75 non-refundable for 1 to 4 nights, so a snow-hold second night costs no more in pet fees. Checkout noon. 1731 South Convention Center Drive.",
    catsAllowed: true,
    maxPets: 2,
    petFeeUsd: 75,
    petFeeRefundable: false,
    weightLimitLbs: null,
    sourceUrl: "https://www.hilton.com/en/hotels/sgugigi-hilton-garden-inn-st-george/",
    retrievedAt,
    callToConfirmTwoCats: true,
    awardPointsPerNight: 30000,
    awardPointsQuote: hgiAward,
    parkingUsd: 0,
    workspace:
      "A desk and free Wi-Fi in every room. If Sunday's 7:30 AM check says snow, keep the room for a second night here.",
  },
];

writeGenerated("hotels.json", { retrievedAt, properties });
console.log(`Wrote ${properties.length} Hilton Honors cat stays`);
