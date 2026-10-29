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
    body: "Thursday after work to Crestview, then Seguin, Deming and two nights in St. George, all smaller towns. Friday is your day off. Monday you work from the hotel, then drive I-15 up Utah after 3 PM.",
  },
  {
    href: "#drive",
    kicker: "Snow",
    title: "Bare or wet pavement is a go. Snow is a hold.",
    body: "Only Monday evening reaches snow country: the 6,600-foot I-15 summit and Provo Canyon. If UDOT shows snow at 2 PM, stay the second night in St. George and drive Tuesday after work.",
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
    body: "You leave Thursday, November 12, after work. From Utah, Secure Investments runs 4922. You do not.",
  },
] as const;

export function NowBoard() {
  return (
    <section className="section">
      <p className="eyebrow">Now</p>
      <h1>Four jobs. One season.</h1>
      <p className="lede">
        You leave Gainesville on Thursday, November 12, after work, and sleep at 900 Bitner Road, Apartment E17, on Monday, November 16.
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
