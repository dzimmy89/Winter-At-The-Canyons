export const signedLease = {
  address: "900 Bitner Road, Apartment E17, Park City, UT 84098",
  complex: "Canyon Creek Club",
  start: "November 15, 2026",
  end: "May 15, 2027",
  dates: "Nov 15, 2026 – May 15, 2027",
  allInMonthly: 3600,
  retrievedAt: "2026-09-24",
} as const;

export const priorPublicListing = {
  sourceLabel: "PCLodge — Bitner E17",
  url: "https://www.pclodge.com/rentals/bitner-e17",
  season: "mid-October 2025 through May 2026",
  rentThen: "$4,500–$4,700",
  beds: 3,
  baths: 2,
  sqft: 1229,
  pets: "1 dog or 2 cats",
  utilities: "All utilities included on that listing",
  parking: "1-car garage",
  manager: "CooperWynn Property",
  note: "That page is a prior winter, not the lease you signed. Use it for the building. The signed rent and dates come from the lease. What the $3,600 includes is still a confirm item.",
} as const;

export const parkCityConfirmChecklist = [
  { id: "pc-c1", label: "Confirm the signed lease is Nov 15, 2026 – May 15, 2027 at $3,600/month" },
  { id: "pc-c2", label: "Confirm two cats are written into that lease, including any pet fee or limit" },
  { id: "pc-c3", label: "Confirm whether $3,600 includes utilities, internet, garage, and pets" },
  { id: "pc-c4", label: "Save the lease, garage remote instructions, and a Canyon Creek contact before you leave Gainesville" },
  { id: "pc-c5", label: "Keys on November 15. The drive is built to arrive that day, not November 1" },
];
