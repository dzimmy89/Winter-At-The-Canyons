import type { HotelNight } from "../src/data/types.ts";
import { writeGenerated } from "./lib/io.ts";

const retrievedAt = "2026-10-22T16:00:00.000Z";

const hamptonSecondaryAward =
  "Award Travel Finder, verified June 7, 2026: observed Hampton sweet spot 15,000–30,000 points/night. Hilton publishes no chart. This is the ceiling, not a live quote for this night.";
const denverAward =
  "besthiltonhotels.com, checked on hilton.com October 20, 2026: Hampton Inn & Suites Denver Downtown-Convention Center priced a standard room at 60,000 points for November 19, 2026. Denver-market ceiling, not this property's live price.";

const properties: HotelNight[] = [
  {
    id: "cookeville",
    brand: "Hampton",
    propertyName: "Hampton Inn Cookeville",
    city: "Cookeville",
    state: "TN",
    nights: 1,
    petPolicyQuote:
      "Hilton property page, retrieved 2026-10-22: Pets allowed Yes. $50.00 Non-refundable Fee. Max weight 150 lbs. $50 (1 night), $75 (5+ nights), 2 pet max, dogs and cats only.",
    catsAllowed: true,
    maxPets: 2,
    petFeeUsd: 50,
    petFeeRefundable: false,
    weightLimitLbs: 150,
    sourceUrl: "https://www.hilton.com/en/hotels/bnackhx-hampton-cookeville/",
    retrievedAt,
    callToConfirmTwoCats: true,
    awardPointsPerNight: 30000,
    awardPointsQuote: hamptonSecondaryAward,
    parkingUsd: 0,
  },
  {
    id: "topeka",
    brand: "Hampton",
    propertyName: "Hampton Inn Topeka",
    city: "Topeka",
    state: "KS",
    nights: 1,
    petPolicyQuote:
      "Hilton property page, retrieved 2026-10-22: Pets allowed Yes. $75.00 Non-refundable Fee. $75 (1-4 nights), $125 (5+ nights), 2 pets max, dog or cat.",
    catsAllowed: true,
    maxPets: 2,
    petFeeUsd: 75,
    petFeeRefundable: false,
    weightLimitLbs: null,
    sourceUrl: "https://www.hilton.com/en/hotels/topkshx-hampton-topeka/",
    retrievedAt,
    callToConfirmTwoCats: true,
    awardPointsPerNight: 30000,
    awardPointsQuote: hamptonSecondaryAward,
    parkingUsd: 0,
  },
  {
    id: "wheat_ridge",
    brand: "Hampton",
    propertyName: "Hampton Inn & Suites Wheat Ridge Denver West",
    city: "Wheat Ridge",
    state: "CO",
    nights: 1,
    petPolicyQuote:
      "Hilton property page, retrieved 2026-10-22: Pets allowed Yes. $75.00 Non-refundable Fee. Max weight 50 lbs. $75 (1-4 nights), $125 (5+ nights), 2 pets max, dog or cat only.",
    catsAllowed: true,
    maxPets: 2,
    petFeeUsd: 75,
    petFeeRefundable: false,
    weightLimitLbs: 50,
    sourceUrl: "https://www.hilton.com/en/hotels/denwrhx-hampton-suites-wheat-ridge-denver-west/",
    retrievedAt,
    callToConfirmTwoCats: true,
    awardPointsPerNight: 60000,
    awardPointsQuote: denverAward,
    parkingUsd: 0,
  },
  {
    id: "salina",
    brand: "Hampton",
    propertyName: "Hampton Inn Salina",
    city: "Salina",
    state: "KS",
    nights: 1,
    petPolicyQuote:
      "Hilton property page, retrieved 2026-10-22: Pets allowed Yes. $75.00 Non-refundable Fee. 1-4 night stay $75; 5+ night stay $125; 2 pets max; dog or cat only. Saturday hold only, if I-70 west of Hays is snow-packed.",
    catsAllowed: true,
    maxPets: 2,
    petFeeUsd: 75,
    petFeeRefundable: false,
    weightLimitLbs: null,
    sourceUrl: "https://www.hilton.com/en/hotels/slnkshx-hampton-salina/",
    retrievedAt,
    callToConfirmTwoCats: true,
    awardPointsPerNight: 30000,
    awardPointsQuote: hamptonSecondaryAward,
    parkingUsd: 0,
  },
];

writeGenerated("hotels.json", { retrievedAt, properties });
console.log(`Wrote ${properties.length} Hilton Honors cat stays`);
