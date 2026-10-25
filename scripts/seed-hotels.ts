import type { HotelNight } from "../src/data/types.ts";
import { writeGenerated } from "./lib/io.ts";

const retrievedAt = "2026-10-25T10:30:00.000Z";

const hamptonSecondaryAward =
  "Award Travel Finder, verified June 7, 2026: observed Hampton sweet spot 15,000–30,000 points/night. Hilton publishes no chart. This is the ceiling, not a live quote for this night.";
const home2Award =
  "Award Travel Finder, verified June 7, 2026: Home2 Suites sits in the same 15,000–30,000 points/night band as Hampton in small markets. Hilton publishes no chart. This is the ceiling, not a live quote for this night.";

const properties: HotelNight[] = [
  {
    id: "covington",
    brand: "Hampton",
    propertyName: "Hampton Inn Covington",
    city: "Covington",
    state: "LA",
    nights: 1,
    petPolicyQuote:
      "Romingo listing, retrieved 2026-10-25: Both dogs and cats are welcome, 2 per reservation, 75 lbs max. $75 per stay, credit card at check-in. 68700 Hwy 190 Service Rd, I-12 exit 63.",
    catsAllowed: true,
    maxPets: 2,
    petFeeUsd: 75,
    petFeeRefundable: false,
    weightLimitLbs: 75,
    sourceUrl: "https://www.romingo.com/pet-friendly-hotel/louisiana/covington/hampton-inn-covington",
    retrievedAt,
    callToConfirmTwoCats: true,
    awardPointsPerNight: 30000,
    awardPointsQuote: hamptonSecondaryAward,
    parkingUsd: 0,
  },
  {
    id: "kerrville",
    brand: "Hampton",
    propertyName: "Hampton Inn Kerrville",
    city: "Kerrville",
    state: "TX",
    nights: 1,
    petPolicyQuote:
      "Expedia listing, retrieved 2026-10-24: Pets allowed, cats and dogs, 2 total. USD 75 per pet, per stay. 2038 Sidney Baker St.",
    catsAllowed: true,
    maxPets: 2,
    petFeeUsd: 150,
    petFeeRefundable: false,
    weightLimitLbs: null,
    sourceUrl: "https://expedia.com/Kerrville-hotels-Hampton-Inn-Kerrville.h456276.Hotel-information",
    retrievedAt,
    callToConfirmTwoCats: true,
    awardPointsPerNight: 30000,
    awardPointsQuote: hamptonSecondaryAward,
    parkingUsd: 0,
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
  },
  {
    id: "kingman",
    brand: "Home2 Suites",
    propertyName: "Home2 Suites by Hilton Kingman",
    city: "Kingman",
    state: "AZ",
    nights: 1,
    petPolicyQuote:
      "Travelocity listing, retrieved 2026-10-24: Dogs and cats only, 2 max, 25 lbs each. USD 75 per stay plus a USD 125 deposit. 1121 Sunrise Ave.",
    catsAllowed: true,
    maxPets: 2,
    petFeeUsd: 75,
    petFeeRefundable: false,
    weightLimitLbs: 25,
    sourceUrl: "https://www.travelocity.com/Kingman-Hotels-Home2-Suites-By-Hilton-Kingman.h21767828.Hotel-Information",
    retrievedAt,
    callToConfirmTwoCats: true,
    awardPointsPerNight: 30000,
    awardPointsQuote: home2Award,
    parkingUsd: 0,
  },
  {
    id: "st_george",
    brand: "Hampton",
    propertyName: "Hampton Inn & Suites St. George",
    city: "St. George",
    state: "UT",
    nights: 1,
    petPolicyQuote:
      "Hotels.com listing, retrieved 2026-10-24: Pets allowed, dogs and cats only, 2 total. 1250 West SunRiver Parkway. Sunday hold only, if I-15 north of Cedar City has snow.",
    catsAllowed: true,
    maxPets: 2,
    petFeeUsd: null,
    petFeeRefundable: "unknown",
    weightLimitLbs: null,
    sourceUrl: "https://www.hotels.com/ho688670016/hampton-inn-suites-st-george-ut-st-george-united-states-of-america/",
    retrievedAt,
    callToConfirmTwoCats: true,
    awardPointsPerNight: 30000,
    awardPointsQuote: hamptonSecondaryAward,
    parkingUsd: 0,
  },
];

writeGenerated("hotels.json", { retrievedAt, properties });
console.log(`Wrote ${properties.length} Hilton Honors cat stays`);
