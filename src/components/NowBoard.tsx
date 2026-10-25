import { signedLease } from "../data/parkCity";
import { a2LeaseDates, mortgageMonthly, propertyManagers } from "../data/gainesville";
import { arriveParkCity, leaveGainesville } from "../lib/drive";
import { formatUsd } from "../lib/money";

const secure = propertyManagers.find((manager) => manager.choice === "hired");

const rows = [
  {
    href: "#drive",
    kicker: "Drive",
    title: `Leave ${leaveGainesville}. Arrive E17 ${arriveParkCity}.`,
    body: "Sleep in Covington, Kerrville, Deming, and Kingman, all smaller towns. I-10 across the south, then I-15 up Utah on Sunday. A stop every 3 to 4 hours.",
  },
  {
    href: "#drive",
    kicker: "Snow",
    title: "Bare or wet pavement is a go. Snow is a hold.",
    body: "Only Sunday reaches snow country: the 6,600-foot I-15 summit and Provo Canyon. If I-15 has snow, stay in St. George and finish Monday.",
  },
  {
    href: "#lease",
    kicker: "Lease",
    title: `${signedLease.dates}. ${formatUsd(signedLease.allInMonthly)} a month through May 15, 2027.`,
    body: "That is the signed lease at Canyon Creek Club. Confirm what the monthly rent includes.",
  },
  {
    href: "#house",
    kicker: "House",
    title: `Florida lease ${a2LeaseDates}. Rent pays the ${formatUsd(mortgageMonthly)} mortgage.`,
    body: secure
      ? `${secure.name} is hired. ${secure.contact ?? "The office"} is the contact.`
      : "The Gainesville manager is not marked.",
  },
  {
    href: "#house",
    kicker: "This week",
    title: "Tanya Chappell runs the Nov 15 walkthrough.",
    body: "You leave Wednesday, November 11. From Utah, Secure Investments runs 4922. You do not.",
  },
] as const;

export function NowBoard() {
  return (
    <section className="section">
      <p className="eyebrow">Now</p>
      <h1>Four jobs. One season.</h1>
      <p className="lede">
        You leave Gainesville on Wednesday, November 11, and sleep at 900 Bitner Road, Apartment E17, on November 15.
      </p>
      <ol className="now-list">
        {rows.map((row) => (
          <li key={row.kicker}>
            <a href={row.href}>
              <span className="kicker">{row.kicker}</span>
              <strong>{row.title}</strong>
              <span>{row.body}</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
