import type { HotelNight } from "../src/data/types.ts";
import { writeGenerated } from "./lib/io.ts";

const retrievedAt = "2026-10-29T17:30:00.000Z";

const hamptonSecondaryAward =
  "Award Travel Finder, verified June 7, 2026: observed Hampton sweet spot 15,000–30,000 points/night. Hilton publishes no chart. This is the ceiling, not a live quote for this night.";

const hgiAward =
  "Planning estimate, not verified: Hilton Garden Inn award nights in small Utah markets usually price near the top of the Hampton band. Check the live points price when you book both nights.";

const properties: HotelNight[] = [
  {
    id: "crestview",
    brand: "Hampton",
    propertyName: "Hampton Inn Crestview South I-10",
    city: "Crestview",
    state: "FL",
    nights: 1,
    petPolicyQuote:
      "Expedia listing, retrieved 2026-10-29: Pets allowed, dogs and cats only, 2 total. USD 75 per accommodation, per stay. Pets cannot be left unattended. 112 John King Road, I-10 exit 56.",
    catsAllowed: true,
    maxPets: 2,
    petFeeUsd: 75,
    petFeeRefundable: false,
    weightLimitLbs: null,
    sourceUrl: "https://www.expedia.com/Crestview-Hotels-Hampton-Inn-By-Hilton-Crestview-South-I-10.h16735866.Hotel-Information",
    retrievedAt,
    callToConfirmTwoCats: true,
    awardPointsPerNight: 30000,
    awardPointsQuote: hamptonSecondaryAward,
    parkingUsd: 0,
    workspace: "24-hour business center and a meeting room; rooms have a laptop workspace. Not needed, because Friday is your day off.",
  },
  {
    id: "seguin",
    brand: "Hampton",
    propertyName: "Hampton Inn Seguin",
    city: "Seguin",
    state: "TX",
    nights: 1,
    petPolicyQuote:
      "Expedia listing, retrieved 2026-10-29: Cats and dogs allowed, 2 total. USD 75 per accommodation, per day. 1130 Larkin Ave.",
    catsAllowed: true,
    maxPets: 2,
    petFeeUsd: 75,
    petFeeRefundable: false,
    weightLimitLbs: null,
    sourceUrl: "https://expedia.com/Texas-hotels-Hampton-Inn-Seguin.h1587122.Hotel-information",
    retrievedAt,
    callToConfirmTwoCats: true,
    awardPointsPerNight: 30000,
    awardPointsQuote: hamptonSecondaryAward,
    parkingUsd: 0,
    workspace: "Free Wi-Fi and a meeting room; no business center listed. Not needed, because Saturday is a driving day.",
  },
  {
    id: "deming",
    brand: "Hampton",
    propertyName: "Hampton Inn Deming",
    city: "Deming",
    state: "NM",
    nights: 1,
    petPolicyQuote:
      "Expedia listing, retrieved 2026-10-25: Cats and dogs allowed, 2 total, 11 kg (about 24 lbs) each. USD 50 per accommodation, per stay. 3751 E Cedar St.",
    catsAllowed: true,
    maxPets: 2,
    petFeeUsd: 50,
    petFeeRefundable: false,
    weightLimitLbs: 24,
    sourceUrl: "https://www.hilton.com/en/hotels/lrudmhx-hampton-deming-nm/",
    retrievedAt,
    callToConfirmTwoCats: true,
    awardPointsPerNight: 30000,
    awardPointsQuote: hamptonSecondaryAward,
    parkingUsd: 0,
    workspace: "Not needed, because Sunday is a driving day.",
  },
  {
    id: "st_george",
    brand: "Hilton Garden Inn",
    propertyName: "Hilton Garden Inn St. George",
    city: "St. George",
    state: "UT",
    nights: 2,
    petPolicyQuote:
      "hilton.com and Travelocity, retrieved 2026-10-29: Dogs and cats only, 2 max. USD 75 non-refundable for 1 to 4 nights. Checkout noon. 1731 South Convention Center Drive.",
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
      "Business center, an executive boardroom and meeting rooms; every room has a desk and free Wi-Fi and wired internet. Book Sunday and Monday nights so you can work in the room with the cats on Monday.",
  },
];

writeGenerated("hotels.json", { retrievedAt, properties });
console.log(`Wrote ${properties.length} Hilton Honors cat stays`);
