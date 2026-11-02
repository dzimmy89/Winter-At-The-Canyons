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
    body: "Thursday at 5:00 AM to Winnie, Friday to Van Horn, Saturday to Kingman, all smaller towns. Sunday leaves Kingman at 4:00 AM and reaches E17 about 1:05 PM, before the 2:00 PM key meeting.",
  },
  {
    href: "#drive",
    kicker: "Snow",
    title: "Bare or wet pavement is a go. Snow is a hold.",
    body: "Only Sunday morning reaches snow country: the 6,600-foot I-15 summit and Provo Canyon. If UDOT shows snow at the 7:30 AM St. George check, call the landlord and move the key time.",
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
    body: "You leave Thursday, November 12, at 5:00 AM. From Utah, Secure Investments runs 4922. You do not.",
  },
] as const;

export function NowBoard() {
  return (
    <section className="section">
      <p className="eyebrow">Now</p>
      <h1>Four jobs. One season.</h1>
      <p className="lede">
        You leave Gainesville on Thursday, November 12, at 5:00 AM, and get the keys to 900 Bitner Road, Apartment E17, by 2:00 PM on Sunday, November 15.
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
