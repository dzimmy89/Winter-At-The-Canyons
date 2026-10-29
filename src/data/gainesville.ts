export type LeaseStrategyId = "A1" | "A2" | "B";

export interface PropertyFacts {
  address: string;
  parcelId: string;
  livingAreaSqFt: number;
  beds: number;
  baths: number;
  yearBuilt: number;
  subdivision: string;
  hoaAnnual: number;
  utilities: string;
}

export interface MoneyRow {
  label: string;
  amount: number;
  note?: string;
}

export interface LeaseStrategy {
  id: LeaseStrategyId;
  name: string;
  recommended: boolean;
  dates: string;
  duration: string;
  taxStatus: string;
  taxRate: number;
  grossRent: number;
  vacancy: number;
  egr: number;
  operating: number;
  platform: number;
  tax: number;
  startup: number;
  noi: number;
  notes: string;
}

export interface TimelinePhase {
  id: string;
  window: string;
  title: string;
  deliverables: string[];
}

export interface SourceCite {
  id: string;
  label: string;
  url: string;
  retrievedAt: string;
  supports: string;
}

export const researchRetrievedAt = "2026-09-16";

export const a2LeaseDates = "Nov 15, 2026 – May 16, 2027";
export const parkCityOccupancy = "Nov 15, 2026 – May 15, 2027";
export const pmRetrievedAt = "2026-09-24";

export const gainesvilleProperty: PropertyFacts = {
  address: "4922 NW 81st Ave, Gainesville, FL 32653",
  parcelId: "06009-010-026",
  livingAreaSqFt: 2080,
  beds: 4,
  baths: 2,
  yearBuilt: 2009,
  subdivision: "Weschester Cluster Phase 1",
  hoaAnnual: 450,
  utilities: "Gainesville Regional Utilities — electric, water, wastewater, natural gas",
};

export const askingRates = [
  { modality: "Unfurnished annual baseline", monthly: "$2,200 – $2,500", sixMonth: "$13,200 – $15,000" },
  { modality: "Strategy A: continuous 6-month furnished", monthly: "$3,200 – $3,600", sixMonth: "$19,200 – $21,600" },
  { modality: "Strategy B: mid-term 30–90 day stays", monthly: "$3,500 – $4,100", sixMonth: "$21,000 – $24,600 unadjusted" },
];

export const startupCosts: MoneyRow[] = [
  { label: "Professional photography & floor plan", amount: 250 },
  { label: "Smart lock keypad", amount: 220 },
  { label: "Linen, towel & bedding upgrades", amount: 500 },
  { label: "Initial deep turnover cleaning", amount: 300 },
  { label: "Staging & housewares", amount: 250 },
  { label: "Furnished Finder annual subscription", amount: 199 },
];

export const startupTotal = 1719;

export const monthlyOps = [
  { label: "GRU (electric, water, gas, trash)", monthlyLow: 350, monthlyHigh: 425, sixMonthMid: 2325 },
  { label: "High-speed fiber internet", monthlyLow: 80, monthlyHigh: 90, sixMonthMid: 510 },
  { label: "Lawn care", monthlyLow: 120, monthlyHigh: 140, sixMonthMid: 780 },
  { label: "Weschester HOA (amortized $450/yr — confirm with Bosshardt)", monthlyLow: 37.5, monthlyHigh: 37.5, sixMonthMid: 225 },
  { label: "Landlord / dwelling insurance rider", monthlyLow: 150, monthlyHigh: 175, sixMonthMid: 975 },
  { label: "Maintenance & wear reserve", monthlyLow: 100, monthlyHigh: 150, sixMonthMid: 600 },
];

export const monthlyOpsRange = { low: 837.5, high: 1017.5, sixMonthMid: 5415 };

export const leaseStrategies: LeaseStrategy[] = [
  {
    id: "A1",
    name: "6-month lease (taxable)",
    recommended: false,
    dates: "Nov 15, 2026 – May 15, 2027",
    duration: "Stops on the corresponding day of the seventh month",
    taxStatus: "Fully taxable transient rental",
    taxRate: 0.125,
    grossRent: 20400,
    vacancy: 0,
    egr: 20400,
    operating: 5415,
    platform: 150,
    tax: 2550,
    startup: 1719,
    noi: 10566,
    notes: "Nov 15–May 15 matches the Park City lease and is not longer than six months under FAC 12A-1.061. Remit about $2,550 (6% state + 1.5% Alachua surtax + 5% TDT).",
  },
  {
    id: "A2",
    name: "6-month + 1 day (tax-exempt)",
    recommended: true,
    dates: a2LeaseDates,
    duration: "Through the day after the corresponding day of the seventh month",
    taxStatus: "Exempt from the 12.5% transient stack",
    taxRate: 0,
    grossRent: 20400,
    vacancy: 0,
    egr: 20400,
    operating: 5415,
    platform: 150,
    tax: 0,
    startup: 1719,
    noi: 13116,
    notes: "Written lease Nov 15, 2026–May 16, 2027. FAC 12A-1.061’s example for a mid-month start is July 28 through January 29. May 16 is that extra day. The Park City lease ends May 15, so the Florida tenant is still in the house one day after you leave Utah. Gross rent services the $2,100 mortgage only, before a manager’s fee.",
  },
  {
    id: "B",
    name: "Mid-term turnover stays",
    recommended: false,
    dates: "Two rotating contracts, Nov–Apr",
    duration: "~90 days per stay",
    taxStatus: "Fully taxable; platform or monthly TouristExpress",
    taxRate: 0.125,
    grossRent: 21533,
    vacancy: 1267,
    egr: 20266,
    operating: 5665,
    platform: 450,
    tax: 2533,
    startup: 1719,
    noi: 9899,
    notes: "10 vacancy days, extra $250 turnover clean, 12.5% tax. Highest operational load from Utah. Do not hire a nightly manager for this.",
  },
];

export function strategyById(id: LeaseStrategyId): LeaseStrategy {
  const found = leaseStrategies.find((s) => s.id === id);
  if (!found) {
    throw new Error(`Unknown strategy ${id}`);
  }
  return found;
}

/** Rent proceeds may only service this mortgage. Never trip or mountain town. */
export const mortgageMonthly = 2100;
export const ownerElectricMonthly = 350;
export const ownerWifiMonthly = 100;

export interface RentWaterfall {
  monthlyGross: number;
  toMortgage: number;
  parked: number;
  mortgageGap: number;
  coveragePct: number;
  sixMonthToMortgage: number;
  sixMonthParked: number;
  ownerElectricSix: number;
  ownerWifiSix: number;
}

export function monthlyGrossFromStrategy(strategy: LeaseStrategy): number {
  return strategy.egr / 6;
}

export function rentWaterfall(monthlyGross: number): RentWaterfall {
  const toMortgage = Math.min(monthlyGross, mortgageMonthly);
  const parked = Math.max(0, monthlyGross - mortgageMonthly);
  const mortgageGap = Math.max(0, mortgageMonthly - monthlyGross);
  return {
    monthlyGross,
    toMortgage,
    parked,
    mortgageGap,
    coveragePct: monthlyGross / mortgageMonthly,
    sixMonthToMortgage: toMortgage * 6,
    sixMonthParked: parked * 6,
    ownerElectricSix: ownerElectricMonthly * 6,
    ownerWifiSix: ownerWifiMonthly * 6,
  };
}

export const gainesvilleTimeline: TimelinePhase[] = [
  {
    id: "gnv-prep",
    window: "If not done — do now through Oct 3, 2026",
    title: "Get the house ready",
    deliverables: [
      "Touch-up paint, deep clean, HVAC service, working smoke detectors",
      "Photograph every room, yard, and driveway; write a furniture inventory",
      "Install a smart lock; name a Gainesville person who holds a spare code",
      "Call the insurance carrier before anyone moves in — ask for a dwelling / landlord (DP-3) form",
      "Call Bosshardt CAM for the Weschester tenant packet and ask whether a 6-month furnished lease is allowed",
    ],
  },
  {
    id: "gnv-mkt",
    window: "Do now — Sep 24 through Oct 10, 2026",
    title: "Secure Investments is hired",
    deliverables: [
      "Secure Investments Realty & Management is hired. Tanya Chappell, CPM, broker and owner, is the contact",
      "The written lease is still Nov 15, 2026 – May 16, 2027",
      "Get the fee in writing: leasing fee, monthly percent, who holds the deposit, who is the notice agent",
      "No Craigslist",
    ],
  },
  {
    id: "gnv-screen",
    window: "Oct 10 – Oct 31, 2026",
    title: "Let the manager screen",
    deliverables: [
      "Written criteria before the first showing: income ≥ 3× rent, credit, criminal, eviction, rental history",
      "Same criteria for every applicant. Fair Housing still applies to the manager’s ads",
      "You approve the tenant from Utah-bound Gainesville, or in writing from the road",
    ],
  },
  {
    id: "gnv-contract",
    window: "Oct 24 – Nov 7, 2026",
    title: "Sign a Florida lease through May 16",
    deliverables: [
      "Ask Alachua County Property Appraiser the homestead question before you sign",
      "Written lease Nov 15, 2026 – May 16, 2027. May 15 matches Park City and fails the tax test",
      "Your name plus a Utah notice address, or the manager as the § 83.50 notice agent",
      "Radon paragraph (§ 404.056). Lead paint N/A (2009). Flood rider N/A (under 1 year)",
      "Deposit in a separate Florida account. Ask which bank if the manager holds it",
    ],
  },
  {
    id: "gnv-movein",
    window: "Nov 11 – Nov 15, 2026",
    title: "Leave before the tenant moves in",
    deliverables: [
      "You leave Gainesville Wednesday, November 11, after work, and the drive reaches E17 on Sunday, November 15",
      "The manager does the Nov 15 walkthrough if you are already on the road",
      "Welcome binder: GRU cap, HOA rules, manager’s phone, your Utah address",
      "Tenant renters insurance required; your DP-3 is already in force",
    ],
  },
  {
    id: "gnv-manage",
    window: "Nov 15, 2026 – May 16, 2027 · from 900 Bitner E17",
    title: "Let the manager run it from Park City",
    deliverables: [
      "Rent hits the manager, then you. The $2,100 mortgage still comes first. A leasing fee can empty month 1",
      "You approve repairs over the amount in the management agreement",
      "Late rent: the manager sends the § 83.56 3-day notice. No lockouts, no utility shutoff (§ 83.67)",
      "May 16 move-out: 15 days to return a clean deposit, 30 days to claim (§ 83.49)",
    ],
  },
];

export const listingGuideSteps = [
  {
    id: "gnv-prep",
    title: "Get the house ready",
    body: "The house is still your home. Before anyone sees a listing, clean it, fix small stuff, photograph it as if you were the renter, and tell your insurer you will have a tenant.",
  },
  {
    id: "gnv-mkt",
    title: "Secure Investments is hired",
    body: "Tanya Chappell at Secure Investments Realty & Management shows the house, screens, and holds the keys. You will be in Park City on move-in day.",
  },
  {
    id: "gnv-screen",
    title: "Let the manager screen",
    body: "Give them written criteria before the first tour. You still approve the tenant. Fair Housing applies to their ads and to your yes.",
  },
  {
    id: "gnv-contract",
    title: "Sign a Florida lease through May 16",
    body: "Park City ends May 15. A Florida lease that also ends May 15 is not longer than six months. FAC 12A-1.061 wants the written lease in effect through May 16.",
  },
  {
    id: "gnv-movein",
    title: "Leave before November 15",
    body: "The drive needs about a week. The manager does the November 15 walkthrough if you have already left 4922.",
  },
  {
    id: "gnv-manage",
    title: "Manage it from 900 Bitner E17",
    body: "The manager collects rent and calls vendors. You still own the house, the deposit rules, and the decision not to lock anyone out.",
  },
];

export const gainesvilleChecklist = [
  { id: "gnv-c1", label: "Write the lease Nov 15, 2026 – May 16, 2027 (A2). May 15 is taxable" },
  { id: "gnv-c2", label: "Call Alachua County Property Appraiser about homestead / Save Our Homes before you sign" },
  { id: "gnv-c3", label: "Call the insurance carrier and ask for a dwelling / landlord (DP-3) form before Nov 15" },
  { id: "gnv-c4", label: "Secure Investments Realty is hired. Tanya Chappell is the contact. The 2018 fee is unconfirmed" },
  { id: "gnv-c5", label: "Set the Florida pet policy in writing before the manager publishes" },
  { id: "gnv-c6", label: "Confirm asking rent against current Gainesville 4/2 furnished comps the week they publish" },
  { id: "gnv-c7", label: "Secure Investments publishes the listing. Furnished Finder is a channel they can use, not a second manager" },
  { id: "gnv-c8", label: "Photograph every room, the yard, and the driveway; write a furniture inventory" },
  { id: "gnv-c9", label: "Deposit stays in a separate Florida account, even if the manager holds the check" },
  { id: "gnv-c10", label: "Name the landlord or the manager as § 83.50 notice agent, with a Utah or Gainesville address" },
  { id: "gnv-c11", label: "Written screen: income ≥ 3× rent, credit, criminal, eviction. Same criteria for everyone" },
  { id: "gnv-c12", label: "Manager walkthrough on Nov 15 if you have already left for Park City" },
  { id: "gnv-c13", label: "Name a Gainesville backup who holds a spare code besides the manager" },
  { id: "gnv-c14", label: "After the manager’s fee, send rent to the $2,100 mortgage first. Do not fund the drive from surplus" },
];

export const listingDraft = `Furnished 4 bed / 2 bath in Weschester Cluster — Nov 15, 2026 to May 16, 2027

4922 NW 81st Ave, Gainesville, FL 32653
4 bed / 2 bath · 2,080 sq ft · built 2009 · Weschester Cluster Phase 1
Parcel 06009-010-026

This is a bona fide written residential lease from November 15, 2026 through May 16, 2027. It is not a nightly rental. The extra day past May 15 is what FAC 12A-1.061 treats as longer than six months for a lease that does not start on the 1st.

Asking: $____ / month furnished (planning band $3,200–$3,600 — confirm against current Gainesville 4/2 comps the week you publish).

Utilities: Landlord covers GRU (electric, water, wastewater, natural gas, trash) through $375 per billing cycle. Overage is additional rent, due within 10 business days of an itemized statement.
Internet: Landlord-provided fiber. That bill is owner cost from other income, not mountain money.

Pets: [SET BEFORE PUBLISH — do not invent a policy]

Parking: Two personal vehicles in the driveway bays. No parking on grass or sidewalks. Confirm the Weschester packet with Bosshardt CAM before you publish.

Fair Housing: this ad describes the house. It does not state a preference for any group of people.

How to apply: Zillow Rental Manager application (Experian credit + CIC background). Income at least 3× monthly rent.`;

export const furnishedFinderSteps = [
  "Open Furnished Finder → List Your Property (support article dated in-app as retrieved 2026-09-16).",
  "Choose entire home. Enter your contact information and 4922 NW 81st Ave.",
  "Accept the terms. Pay the $199 annual subscription (0% commission). Turn off auto-renew if you only need one season.",
  "Finish Jumio ID verification (selfie + government ID) or the listing will not appear in search.",
  "Account → My Dashboard → Edit listing. Custom headline: use the draft in this app.",
  "Details: 4 bed / 2 bath, monthly rent, security deposit, cleaning/pet fees if any, entire home, washer/dryer.",
  "Pets: set the real policy here. Do not publish until that line is filled.",
  "Calendar: minimum stay 30+ nights; block everything outside Nov 15, 2026 – May 16, 2027.",
  "Upload at least two photos; use the professional set. Save to publish. Listing also appears on Travel Nurse Housing.",
];

export const zillowListSteps = [
  "Open Zillow Rental Manager and create a free landlord account.",
  "Add 4922 as a single-family listing. Dates Nov 15, 2026 – May 16, 2027. Furnished. Not a short stay.",
  "Paste the listing draft. Same rent and pet line as Furnished Finder.",
  "Turn on applications. Screening is Experian credit plus CIC criminal / eviction — not TransUnion.",
  "You must verify your own identity before you can open an applicant’s full reports (FCRA).",
];

export const gainesvilleRisks = [
  {
    title: "Why May 16",
    body: "FAC 12A-1.061: a lease that does not start on the 1st is longer than six months only if it stays in effect through the day after the corresponding day of the seventh month. Their example is July 28 through January 29. Nov 15 through May 15 stops on the corresponding day and is taxable. Nov 15 through May 16 is the shape. If you miss it: 6% state sales tax + 1.5% Alachua surtax + 5% Alachua tourist-development tax = 12.5%.",
  },
  {
    title: "Homestead on January 1",
    body: "Fla. Stat. § 196.061: renting all or substantially all of a homestead is abandonment until you physically occupy again. A tenant is in 4922 on January 1, 2027 while you are in Park City. Losing Save Our Homes resets the assessed value. Ask the Alachua County Property Appraiser this exact question before you sign: “If I lease 4922 Nov 15, 2026–May 16, 2027 and I am in Utah on January 1, do I lose homestead and the Save Our Homes cap?”",
  },
  {
    title: "Rent pays the mortgage only",
    body: "The $2,100 mortgage draft comes from rent. Electric (about $350) and wifi (about $100) come from other income. Surplus after the mortgage is not mountain-town or drive money.",
  },
  {
    title: "Do not self-help evict",
    body: "Fla. Stat. § 83.67 forbids lockouts, shutting off utilities, or removing doors. Damages are actual losses or three months’ rent, whichever is greater. Late rent starts with a § 83.56(3) three-day notice (exclude Saturday, Sunday, and court holidays), then a possession case in Alachua County Court. Use clerk / Florida Bar forms. This app is not an eviction kit.",
  },
];

export const leaseClauses = [
  {
    title: "Security deposit — Fla. Stat. § 83.49",
    body: "Hold the money in a separate Florida non-interest-bearing account (first-timer default). Do not commingle. The 30-day depository-name notice does not apply to a landlord with fewer than five units — still name the bank in the lease and include the statutory disclosure. No claim: return the deposit in 15 days. Claim: written notice within 30 days (certified mail or § 83.505 email). Miss that deadline and you forfeit the claim against the deposit.",
  },
  {
    title: "Landlord address — Fla. Stat. § 83.50",
    body: "At or before move-in, the lease must name the landlord or a person authorized to receive notices, with an address. Put your Utah mailing address or name the Gainesville manager as the notice agent.",
  },
  {
    title: "Radon — Fla. Stat. § 404.056(5)",
    body: "Put the statutory radon paragraph on the rental agreement. Testing is not required. The house was built in 2009, so the federal pre-1978 lead-paint packet does not apply. Flood disclosure § 83.512 applies only to leases of one year or longer — not A2.",
  },
  {
    title: "Habitability — Fla. Stat. § 83.51",
    body: "You must keep the house up to code and the structure and plumbing working. For a single-family home, install working smoke detectors at the start unless the lease says otherwise. If you fail the code/structure duty, the tenant may give written notice and terminate after 7 days.",
  },
  {
    title: "Early termination — Fla. Stat. § 83.595",
    body: "Separate addendum: Option A liquidated damages up to two months’ rent with up to 60 days’ notice, or Option B common-law remedies with a duty to mitigate.",
  },
  {
    title: "GRU consumption cap",
    body: "Landlord covers GRU through $375 per billing cycle. Overage is additional rent, due within 10 business days of an itemized statement.",
  },
  {
    title: "Maintenance threshold",
    body: "Tenant pays the first $100 per occurrence for routine or negligent items (clogs, bulbs, monthly HVAC filters). Landlord covers structural, mainline plumbing, electrical, and HVAC after prompt written notice.",
  },
  {
    title: "Weschester HOA addendum",
    body: "Owner rule until Bosshardt’s packet says otherwise: two personal vehicles in driveway bays; no parking on grass or sidewalks; bins out of street view except pickup days. HOA fines billed as additional rent. Annual HOA in this app is $450; a 2026 neighbor MLS listed $500 — confirm before you quote it.",
  },
];

export const marketingChannels = [
  { name: "Secure Investments Realty", audience: "One furnished winter tenant", fee: "2018 PDF is not the signed fee", tax: "Exempt only if the written lease runs through May 16" },
  { name: "Furnished Finder", audience: "A listing channel for the hired manager", fee: "$199/yr, 0% commission", tax: "You remit if you ever leave A2" },
  { name: "Zillow Rental Manager", audience: "UF faculty, relocators", fee: "Free list; Experian + CIC screens", tax: "Exempt if the written lease is longer than 6 months" },
  { name: "UF Off Campus Life", audience: "Visiting scholars — outreach, not a guaranteed free post", fee: "Free student/faculty posts need a ufl.edu email", tax: "Exempt if the written lease is longer than 6 months" },
  { name: "Airbnb / Vrbo (30+ nights)", audience: "Only if you abandon A2", fee: "3–5% host fee", tax: "Platform may remit the 12.5% stack" },
];

export const remoteSop = [
  {
    title: "Rent",
    body: "The manager collects, then disburses. Send the $2,100 mortgage first. A one-month leasing fee can leave month 1 short — pay that gap from other income, not from the Hilton drive.",
  },
  {
    title: "Who the tenant calls",
    body: "HVAC / plumbing / electrical: a named Gainesville vendor first. You after written notice for anything over the $100 tenant threshold or anything structural. Fly back for habitability or an insurance loss — not for a clogged sink.",
  },
  {
    title: "Backup key",
    body: "One trusted person in Gainesville holds a spare code. They do not live in the house. Put their name in the welcome binder.",
  },
  {
    title: "Late rent",
    body: "Do not shut off GRU. Deliver a § 83.56(3) three-day pay-or-possess notice, then file in Alachua County Court if they neither pay nor leave. Sheriff enforces a writ — you do not.",
  },
  {
    title: "Move-out",
    body: "Walkthrough and photos. 15 days to return a clean deposit; 30 days to send a claim notice. Ask for their forwarding address in the lease.",
  },
  {
    title: "Vacant or overwhelmed",
    body: "The written lease ends May 16. You are still driving home from Park City if you leave Utah on May 15. The manager handles move-out photos. Homestead care is physical re-occupancy under § 196.061, not a Utah mailing address.",
  },
];

export const landlordSources: SourceCite[] = [
  {
    id: "fac-12a",
    label: "FAC 12A-1.061",
    url: "https://www.flrules.org/gateway/ruleno.asp?id=12A-1.061",
    retrievedAt: researchRetrievedAt,
    supports: "A mid-month lease must run through the day after the corresponding day of the seventh month",
  },
  {
    id: "fac-12a-text",
    label: "FAC 12A-1.061 (text)",
    url: "https://www.law.cornell.edu/regulations/florida/Fla-Admin-Code-Ann-R-12A-1-061",
    retrievedAt: researchRetrievedAt,
    supports: "Bona fide written lease longer than six months is not transient",
  },
  {
    id: "alachua-tdt",
    label: "Alachua Tax Collector — TDT",
    url: "https://www.alachuacollector.com/tourist-development-2019/",
    retrievedAt: researchRetrievedAt,
    supports: "5% TDT on rentals of six months or less; longer written lease exempt",
  },
  {
    id: "surtax",
    label: "FDOR DR-15DSS 2026",
    url: "https://floridarevenue.com/Forms_library/current/dr15dss_26.pdf",
    retrievedAt: researchRetrievedAt,
    supports: "Alachua discretionary surtax 1.5% in 2026",
  },
  {
    id: "s8349",
    label: "Fla. Stat. § 83.49 (2026)",
    url: "https://www.flsenate.gov/Laws/Statutes/2026/83.49",
    retrievedAt: researchRetrievedAt,
    supports: "Separate Florida account, 15/30 day deposit rules, <5-unit notice exception",
  },
  {
    id: "s8350",
    label: "Fla. Stat. § 83.50 (2026)",
    url: "https://www.flsenate.gov/Laws/Statutes/2026/83.50",
    retrievedAt: researchRetrievedAt,
    supports: "Landlord or notice-agent name and address",
  },
  {
    id: "s8351",
    label: "Fla. Stat. § 83.51",
    url: "https://www.flsenate.gov/Laws/statutes/2025/83.51",
    retrievedAt: researchRetrievedAt,
    supports: "Code/structure duty; smoke detectors; 7-day tenant remedy",
  },
  {
    id: "s8356",
    label: "Fla. Stat. § 83.56 (2026)",
    url: "https://www.flsenate.gov/Laws/Statutes/2026/83.56",
    retrievedAt: researchRetrievedAt,
    supports: "Three-day pay-or-possess notice",
  },
  {
    id: "s8367",
    label: "Fla. Stat. § 83.67 (2026)",
    url: "https://www.flsenate.gov/Laws/Statutes/2026/83.67",
    retrievedAt: researchRetrievedAt,
    supports: "No lockouts or utility shutoff",
  },
  {
    id: "s196",
    label: "Fla. Stat. § 196.061",
    url: "https://www.flsenate.gov/Laws/Statutes/2025/196.061",
    retrievedAt: researchRetrievedAt,
    supports: "Rental of homestead is abandonment until physical occupancy",
  },
  {
    id: "acpa",
    label: "Alachua County Property Appraiser — exemptions",
    url: "https://www.acpafl.org/exemptions-overview/",
    retrievedAt: researchRetrievedAt,
    supports: "Homestead is measured on January 1",
  },
  {
    id: "radon",
    label: "Fla. Stat. § 404.056(5)",
    url: "https://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&URL=0400-0499/0404/Sections/0404.056.html",
    retrievedAt: researchRetrievedAt,
    supports: "Radon paragraph on the rental agreement",
  },
  {
    id: "flood",
    label: "Fla. Stat. § 83.512 (2026)",
    url: "https://flsenate.gov/Laws/Statutes/2026/0083.512",
    retrievedAt: researchRetrievedAt,
    supports: "Flood disclosure only for leases of 1 year or longer",
  },
  {
    id: "hud",
    label: "HUD Fair Housing Act overview",
    url: "https://www.hud.gov/helping-americans/fair-housing-act-overview",
    retrievedAt: researchRetrievedAt,
    supports: "Do not advertise or select on protected classes",
  },
  {
    id: "ff-list",
    label: "Furnished Finder — How to list",
    url: "https://support.furnishedfinder.com/hc/en-us/articles/35730758541595-How-to-List-Your-Property",
    retrievedAt: researchRetrievedAt,
    supports: "List Your Property → pay → Jumio → edit listing",
  },
  {
    id: "ff-price",
    label: "Furnished Finder — subscription",
    url: "https://support.furnishedfinder.com/hc/en-us/articles/35312669359515-What-are-the-Subscription-Prices-and-Listing-Options",
    retrievedAt: researchRetrievedAt,
    supports: "$199 per year per entire-home listing, 0% commission",
  },
  {
    id: "zillow-screen",
    label: "Zillow Rental Manager — screening",
    url: "https://www.zillow.com/rental-manager/tenant-screening/",
    retrievedAt: researchRetrievedAt,
    supports: "Experian credit + CIC background / eviction",
  },
  {
    id: "uf-ocl",
    label: "UF Off-Campus Housing Locator",
    url: "https://housing.offcampus.ufl.edu/",
    retrievedAt: researchRetrievedAt,
    supports: "UF board; free posts need a ufl.edu email",
  },
  {
    id: "secure",
    label: "Secure Investments — 2018 management contract",
    url: "https://secureinvestmentsrealty.com/wp-content/uploads/2018/11/Full_Service_Management_Contract_and_docs.pdf",
    retrievedAt: pmRetrievedAt,
    supports: "10% of rent collected or $100 minimum, plus 65% of the first month to lease. Confirm it is still current",
  },
  {
    id: "citizens",
    label: "Citizens — residential policy forms",
    url: "https://www.citizensfla.com/-/residential-policies",
    retrievedAt: researchRetrievedAt,
    supports: "HO-3 is owner-occupied; DP-3 is the tenant-occupied dwelling form — ask your carrier",
  },
];

export type ManagerChoice = "hired";

export interface PropertyManagerOption {
  id: string;
  choice: ManagerChoice;
  contact?: string;
  contactUrl?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  url: string;
  manages: string;
  fee: string;
  leasingUsd: number | null;
  monthlyRate: number | null;
  sixMonth: string;
  refusal: string;
  why: string;
  ask: string;
}

export const pmAskingMonthly = 3400;

export const propertyManagers: PropertyManagerOption[] = [
  {
    id: "secure",
    choice: "hired",
    contact: "Tanya Chappell, CPM, broker and owner",
    contactUrl: "https://secureinvestmentsrealty.com/meet-tanya-chappell/",
    name: "Secure Investments Realty & Management",
    phone: "(352) 478-8029",
    email: "info@secureinvestmentsrealty.com",
    address: "3520 NW 43rd Street, Gainesville, FL 32606",
    url: "https://secureinvestmentsrealty.com/wp-content/uploads/2018/11/Full_Service_Management_Contract_and_docs.pdf",
    manages: "Full-service brokerage and management: tenant screening, accounting, and oversight.",
    fee: "2018 contract PDF: 10% of monthly rent collected or $100 minimum, plus a leasing fee of 65% of the first month. That PDF is not the signed fee. At $3,400 that leasing fee would be $2,210.",
    leasingUsd: 2210,
    monthlyRate: 0.1,
    sixMonth: "The 2018 contract does not mention a furnished six-month lease. The signed agreement still has to end May 16.",
    refusal: "The 2018 PDF is the only published fee. The number in Tanya Chappell’s signed agreement is the one that counts.",
    why: "Hired. Tanya Chappell is the broker and owner on this house.",
    ask: "Put the leasing fee, the monthly percent, and the May 16 end date in the signed management agreement.",
  },
];

export interface PmSeasonMath {
  id: string;
  name: string;
  leasing: number | null;
  management: number | null;
  fees: number | null;
  month1AfterFee: number | null;
  laterMonthAfterFee: number | null;
  month1Gap: number | null;
}

export function pmSeasonMath(option: PropertyManagerOption): PmSeasonMath {
  if (option.leasingUsd == null || option.monthlyRate == null) {
    return {
      id: option.id,
      name: option.name,
      leasing: null,
      management: null,
      fees: null,
      month1AfterFee: null,
      laterMonthAfterFee: null,
      month1Gap: null,
    };
  }
  const management = Math.round(pmAskingMonthly * option.monthlyRate * 6);
  const month1AfterFee = Math.round(pmAskingMonthly - option.leasingUsd - pmAskingMonthly * option.monthlyRate);
  const laterMonthAfterFee = Math.round(pmAskingMonthly - pmAskingMonthly * option.monthlyRate);
  return {
    id: option.id,
    name: option.name,
    leasing: option.leasingUsd,
    management,
    fees: option.leasingUsd + management,
    month1AfterFee,
    laterMonthAfterFee,
    month1Gap: Math.max(0, mortgageMonthly - month1AfterFee),
  };
}

export const pmCallScript = [
  "One furnished house, 4922 NW 81st Ave. Owner will be in Park City, Utah, Nov 15, 2026 through May 15, 2027.",
  "Written lease must be Nov 15, 2026 through May 16, 2027. May 15 is not long enough for the Florida tax exemption.",
  "Not a student lease. Not Airbnb. Not Craigslist. Minimum stay is the whole term.",
  "Who is the landlord on the lease, who holds the security deposit, and which Florida bank?",
  "What do you charge to place the tenant, and what percent after that? Maintenance markup?",
  "Can you do the Nov 15 move-in walkthrough without the owner in town?",
  "Will you follow a written pet policy and the same screen for every applicant?",
];

export const hoaContact = {
  name: "Weschester Homeowner's Association, Inc.",
  sunbiz: "N06000010833",
  manager: "Bosshardt Property Management LLC / Bosshardt CAM",
  address: "5522-B NW 43rd St, Gainesville, FL 32653",
  phone: "352-371-2118",
  note: "Phone from a 2026 neighbor MLS in Weschester Cluster Phase 1. Confirm the packet yourself. HOA in this app is $450/yr; that MLS said $500.",
};

export const ufOutreach = {
  locator: "https://housing.offcampus.ufl.edu/",
  email: "oclcontacts@ufsa.ufl.edu",
  phone: "352-392-1207",
};
