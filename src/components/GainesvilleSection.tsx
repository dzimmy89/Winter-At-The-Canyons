import {
  askingRates,
  furnishedFinderSteps,
  gainesvilleChecklist,
  gainesvilleProperty,
  gainesvilleRisks,
  gainesvilleTimeline,
  hoaContact,
  landlordSources,
  leaseClauses,
  listingDraft,
  listingGuideSteps,
  marketingChannels,
  mortgageMonthly,
  pmAskingMonthly,
  pmCallScript,
  pmSeasonMath,
  propertyManagers,
  ownerElectricMonthly,
  ownerWifiMonthly,
  remoteSop,
  researchRetrievedAt,
  startupCosts,
  startupTotal,
  strategyById,
  ufOutreach,
  zillowListSteps,
  type ManagerChoice,
  type PropertyManagerOption,
} from "../data/gainesville";
import { assertNever, formatUsd } from "../lib/money";
import { Checklist } from "./Checklist";
import { RiskCallout } from "./RiskCallout";

const furnishedAsk = askingRates.find((row) => row.modality.includes("6-month furnished"));

export function GainesvilleSection() {
  const a2 = strategyById("A2");

  return (
    <section id="house" className="section">
      <p className="eyebrow">House</p>
      <h1>Secure Investments is hired. Write the lease through May 16.</h1>
      <dl className="fact-strip">
        <div>
          <dt>Written lease</dt>
          <dd>{a2.dates}</dd>
        </div>
        <div>
          <dt>Mortgage</dt>
          <dd>{formatUsd(mortgageMonthly)} / month from rent</dd>
        </div>
        <div>
          <dt>If you stop on May 15</dt>
          <dd>12.5% tax</dd>
        </div>
      </dl>
      <p className="lede">
        {gainesvilleProperty.address}. {gainesvilleProperty.beds} bed / {gainesvilleProperty.baths} bath,{" "}
        {gainesvilleProperty.livingAreaSqFt.toLocaleString()} sq ft, built {gainesvilleProperty.yearBuilt}.{" "}
        {gainesvilleProperty.subdivision}. Parcel {gainesvilleProperty.parcelId}. {gainesvilleProperty.utilities}.
        Annual HOA in this file is {formatUsd(gainesvilleProperty.hoaAnnual)} — confirm with Bosshardt. Rent covers the{" "}
        {formatUsd(mortgageMonthly)} mortgage only; electric {formatUsd(ownerElectricMonthly)} and wifi{" "}
        {formatUsd(ownerWifiMonthly)} come from other income. This is a personal checklist compiled {researchRetrievedAt},
        not legal advice.
      </p>

      <ol className="list-steps">
        {listingGuideSteps.map((step, index) => {
          const phase = gainesvilleTimeline.find((row) => row.id === step.id);
          if (!phase) {
            throw new Error(`Missing Gainesville timeline phase ${step.id}`);
          }
          return (
            <li key={step.id}>
              <p className="timeline-window">{phase.window}</p>
              <h3>
                {index + 1}. {step.title}
              </h3>
              <p>{step.body}</p>
              <ul>
                {phase.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              {step.id === "gnv-prep" ? (
                <>
                  <div className="table-wrap">
                    <table>
                      <caption>One-time get-ready costs</caption>
                      <tbody>
                        {startupCosts.map((row) => (
                          <tr key={row.label}>
                            <th scope="row">{row.label}</th>
                            <td className="num">{formatUsd(row.amount)}</td>
                          </tr>
                        ))}
                        <tr>
                          <th scope="row">Startup total</th>
                          <td className="num">{formatUsd(startupTotal)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="muted tight">
                    HOA contact: {hoaContact.manager}, {hoaContact.address}, {hoaContact.phone}. {hoaContact.note}
                  </p>
                </>
              ) : null}

              {step.id === "gnv-mkt" ? (
                <>
                  <div className="town-notes-grid">
                    {propertyManagers.map((manager) => (
                      <ManagerCard key={manager.id} manager={manager} />
                    ))}
                  </div>
                  <div className="table-wrap">
                    <table>
                      <caption>
                        Fees on a {formatUsd(pmAskingMonthly)} asking rent · six months · mortgage is {formatUsd(mortgageMonthly)}
                      </caption>
                      <thead>
                        <tr>
                          <th scope="col">Manager</th>
                          <th scope="col">Place tenant</th>
                          <th scope="col">6 months of %</th>
                          <th scope="col">Fees</th>
                          <th scope="col">Month 1 left</th>
                          <th scope="col">Mortgage gap in month 1</th>
                        </tr>
                      </thead>
                      <tbody>
                        {propertyManagers.map((manager) => {
                          const math = pmSeasonMath(manager);
                          return (
                            <tr key={manager.id}>
                              <th scope="row" data-label="Manager">{math.name}</th>
                              <td className="num" data-label="Place tenant">{math.leasing == null ? "Ask" : formatUsd(math.leasing)}</td>
                              <td className="num" data-label="6 months of %">{math.management == null ? "Ask" : formatUsd(math.management)}</td>
                              <td className="num" data-label="Fees">{math.fees == null ? "Ask" : formatUsd(math.fees)}</td>
                              <td className="num" data-label="Month 1 left">{math.month1AfterFee == null ? "Ask" : formatUsd(math.month1AfterFee)}</td>
                              <td className="num" data-label="Mortgage gap">{math.month1Gap == null ? "Ask" : formatUsd(math.month1Gap)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="muted">
                    Secure Investments Realty & Management is hired. Tanya Chappell, CPM, broker and owner, is the
                    contact at (352) 478-8029. The 2018 fee (10% or $100 minimum, plus 65% of the first month) is still
                    unconfirmed.
                  </p>
                  <h3>Confirm these in the signed agreement</h3>
                  <ol>
                    {pmCallScript.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ol>
                  <p className="muted">
                    Furnished six-month asking band: {furnishedAsk?.monthly ?? "$3,200 – $3,600"} a month (
                    {furnishedAsk?.sixMonth ?? "$19,200 – $21,600"} for the season). Confirm comps the week you publish.
                  </p>
                  <h3>Furnished Finder</h3>
                  <ol>
                    {furnishedFinderSteps.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                  <h3>Zillow Rental Manager — click by click</h3>
                  <ol>
                    {zillowListSteps.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                  <p className="muted tight">
                    UF outreach: {ufOutreach.email} / {ufOutreach.phone} ·{" "}
                    <a href={ufOutreach.locator} target="_blank" rel="noreferrer">
                      housing.offcampus.ufl.edu
                    </a>
                    . Free locator posts need a ufl.edu email. You may not have one — use Furnished Finder and Zillow
                    first.
                  </p>
                  <div className="table-wrap">
                    <table>
                      <caption>Where to list — no Craigslist</caption>
                      <thead>
                        <tr>
                          <th scope="col">Platform</th>
                          <th scope="col">Who sees it</th>
                          <th scope="col">Fee</th>
                          <th scope="col">Tax admin</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marketingChannels.map((channel) => (
                          <tr key={channel.name}>
                            <td>{channel.name}</td>
                            <td>{channel.audience}</td>
                            <td>{channel.fee}</td>
                            <td>{channel.tax}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <article className="panel">
                    <h3>Paste-ready listing draft</h3>
                    <pre className="listing-draft">{listingDraft}</pre>
                  </article>
                </>
              ) : null}

              {step.id === "gnv-contract" ? (
                <>
                  <aside className="bridge">
                    <strong>Why May 16.</strong> {a2.dates} is the default ({a2.duration}). A lease that ends May 15 matches
                    Park City and fails FAC 12A-1.061. The written lease has to stay in effect through the next day. The
                    Florida Department of Revenue and Alachua’s 5% tourist-development tax sit on top of 6% state tax +
                    1.5% surtax if you stop on May 15.
                  </aside>
                  <div className="clause-stack">
                    {leaseClauses.map((clause) => (
                      <article key={clause.title} className="panel">
                        <h3>{clause.title}</h3>
                        <p>{clause.body}</p>
                      </article>
                    ))}
                  </div>
                </>
              ) : null}

              {step.id === "gnv-manage" ? (
                <div className="clause-stack">
                  {remoteSop.map((item) => (
                    <article key={item.title} className="panel">
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </article>
                  ))}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      <RiskCallout items={gainesvilleRisks} />
      <Checklist title="Listing checklist" items={gainesvilleChecklist} />

      <div className="table-wrap">
        <table>
          <caption>Sources retrieved {researchRetrievedAt} · not legal advice</caption>
          <thead>
            <tr>
              <th scope="col">Source</th>
              <th scope="col">What it supports</th>
            </tr>
          </thead>
          <tbody>
            {landlordSources.map((row) => (
              <tr key={row.id}>
                <th scope="row">
                  <a href={row.url} target="_blank" rel="noreferrer">
                    {row.label}
                  </a>
                </th>
                <td>{row.supports}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function choiceLabel(choice: ManagerChoice): string {
  switch (choice) {
    case "hired":
      return "Hired";
    default:
      return assertNever(choice);
  }
}

function ManagerCard({ manager }: { manager: PropertyManagerOption }) {
  return (
    <article className="panel">
      <p className="kicker">{choiceLabel(manager.choice)}</p>
      <h3>{manager.name}</h3>
      {manager.contact ? (
        <p>
          {manager.contact}
          {manager.contactUrl ? (
            <>
              {" "}
              <a href={manager.contactUrl} target="_blank" rel="noreferrer">
                Firm bio
              </a>
            </>
          ) : null}
        </p>
      ) : null}
      <p>{manager.manages}</p>
      <p>{manager.why}</p>
      <p className="muted tight">{manager.fee}</p>
      <p>{manager.sixMonth}</p>
      <p>{manager.refusal}</p>
      <p>
        <a href={manager.url} target="_blank" rel="noreferrer">
          Source page
        </a>
        {" · "}
        {manager.phone}
        {manager.email ? ` · ${manager.email}` : ""}
      </p>
      <p className="muted tight">{manager.address}</p>
      <p>{manager.ask}</p>
    </article>
  );
}
