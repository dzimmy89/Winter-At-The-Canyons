import { type ReactNode } from "react";
import type { BudgetTierId, DriveDay, HotelNight } from "../data/types";
import {
  arriveParkCity,
  isStayHotel,
  leaveGainesville,
  longestDriveHours,
  routeOptions,
  type DrivePlan,
  type TripBudget,
} from "../lib/drive";
import { formatPoints, formatUsd } from "../lib/money";
import { Checklist } from "./Checklist";
import { CorridorSources } from "./CorridorSources";
import { DriveGuide } from "./DriveGuide";
import { ExpenseTable } from "./ExpenseTable";
import { RiskCallout } from "./RiskCallout";

export interface DriveTownRow {
  destLabel: string;
  plan: DrivePlan;
  budget: TripBudget;
}

interface Props {
  row: DriveTownRow;
  tierId: BudgetTierId;
  onTier: (id: BudgetTierId) => void;
  map?: ReactNode;
}

const tripChecklist = [
  { id: "trip-c1", label: "Call every Hilton desk, say two cats, and confirm the stay is an award/points night" },
  { id: "trip-c2", label: "M+S or 3PMSF tires are on the car before Thursday" },
  { id: "trip-c3", label: "Read the snow gate the night before each day, and again before the key turns" },
  { id: "trip-c4", label: "Litter, pads, carriers, and a hotel towel kit packed" },
  { id: "trip-c5", label: "Monday 2 PM: Provo Canyon if I-15 and US-189 are bare or wet. Parleys if only Provo Canyon is bad. Stay the second St. George night if I-15 north of Cedar City has snow" },
  { id: "trip-c7", label: "Buy the Balmorhea day pass online Friday night" },
  { id: "trip-c8", label: "Fill the tank in Junction or Ozona on Saturday, and in Wickenburg and Kingman on Sunday" },
  { id: "trip-c6", label: "Cats do not stay in a closed car" },
  { id: "trip-c9", label: "Book the Hilton Garden Inn St. George for Sunday and Monday nights, so Monday's workday is in your room with the cats" },
  { id: "trip-c10", label: "Pack the car Wednesday night, so Thursday after work is just cats, litter and cooler" },
];

const tripRisks = [
  {
    title: "Two cats vs the desk",
    body: "A Hilton “pets welcome” line is not enough. The stay is only a property whose page quotes cats and two pets. Call the desk, say two cats, and confirm the night is on Hilton Honors points.",
  },
  {
    title: "Small towns, not big cities",
    body: "Every night is in a smaller town: Crestview, Seguin, Deming, and St. George. Every stop is a park, a small town, a welcome center or a rest area. Baton Rouge, Houston, San Antonio, El Paso, Tucson, Phoenix, and Las Vegas are drive-throughs on the interstate with no exits.",
  },
  {
    title: "Work hours squeeze the weekend",
    body: "With only Friday off, the drive fits into Thursday evening, three full days and Monday evening. Friday (729 miles, 11 hours) and Sunday (740 miles, 11.3 hours) are long, and each ends about an hour after dark. Houston comes on a Friday afternoon. If a day runs late, drop a rest stop, not sleep.",
  },
  {
    title: "Snow is only a Monday-evening question",
    body: "Thursday through Sunday stay under 5,000 feet across the Gulf Coast and the desert. Monday climbs I-15 to 6,600 feet north of Beaver around sunset and ends near 6,500 feet at E17 after dark. Falling snow, snow-packed pavement, a traction law, or a closure at the 2 PM check is a no-go. Then stay the second night you booked in St. George at 2,800 feet and drive Tuesday after work.",
  },
  {
    title: "Dust, deer, and gas",
    body: "West Texas and southern New Mexico trade snow for other hazards. Deer at dawn in the Hill Country and after dark east of Seguin, blowing dust near Lordsburg, and 100-mile gaps between stations. Pull fully off with lights off in a dust storm, and never drop below half a tank.",
  },
  {
    title: "150,000 points and the ceilings",
    body: "Five Hilton nights at a 30,000-point ceiling each uses all 150,000: Crestview, Seguin, Deming, and two in St. George. A snow hold Tuesday night would be cash. Pet fees are still cash.",
  },
];

export function DriveSection({ row, tierId, onTier, map }: Props) {
  const longest = longestDriveHours(row.plan.days);
  return (
    <section id="drive-guide" className="section section-wide">
      <header className="trip-hero">
        <p className="eyebrow">The drive · {leaveGainesville.replace(", 2026", "")} to {arriveParkCity.replace(", 2026", "")}</p>
        <h1>Gainesville to Park City</h1>
        <p className="lede">
          Built around your work hours: Thursday after work, Friday off, the weekend, and Monday after a workday in the
          hotel. The long way around the snow, with a stop every 3 to 4 hours and each night at a cat-friendly Hilton in a
          smaller town. Pick a day, then follow it top to bottom.
        </p>
        <dl className="trip-strip">
          <div>
            <dt>Distance</dt>
            <dd>{row.plan.totalMiles.toLocaleString("en-US")} mi</dd>
          </div>
          <div>
            <dt>Driving</dt>
            <dd>{row.plan.totalHours.toFixed(0)} h over 5 days</dd>
          </div>
          <div>
            <dt>Nights</dt>
            <dd>Crestview · Seguin · Deming · St. George ×2</dd>
          </div>
          <div>
            <dt>Longest day</dt>
            <dd>{longest.toFixed(1)} h (cap {row.plan.cap} h)</dd>
          </div>
        </dl>
      </header>

      <DriveGuide plan={row.plan} />

      <section className="more-details" aria-labelledby="trip-details-title">
        <h2 id="trip-details-title">Trip details</h2>
        <p className="muted">Planning background. Tap a heading to open it.</p>

        <details>
          <summary>Before you roll: checklist</summary>
          <Checklist title="Before you roll" items={tripChecklist} />
        </details>

        <details>
          <summary>Rules of the road and risks</summary>
          <RiskCallout items={tripRisks} />
        </details>

        <details>
          <summary>Why this route and not Wyoming</summary>
          <RouteComparison />
        </details>

        <details>
          <summary>Hotels and pet policies</summary>
          <HotelEvidence days={row.plan.days} />
        </details>

        <details>
          <summary>Budget and Hilton points</summary>
          <p className="points-line">
            {formatPoints(row.budget.pointsUsed)} of {formatPoints(row.budget.pointsStart)} points used.{" "}
            {formatPoints(row.budget.pointsRemaining)} left.
          </p>
          <div className="control-row">
            <fieldset>
              <legend>Budget</legend>
              <label>
                <input type="radio" name="tier" checked={tierId === "conservative"} onChange={() => onTier("conservative")} />
                Conservative
              </label>
              <label>
                <input type="radio" name="tier" checked={tierId === "realistic"} onChange={() => onTier("realistic")} />
                Realistic
              </label>
              <label>
                <input type="radio" name="tier" checked={tierId === "upscale"} onChange={() => onTier("upscale")} />
                Upscale
              </label>
            </fieldset>
          </div>
          <FocusedDrive row={row} />
        </details>

        <details>
          <summary>Route map</summary>
          {map}
        </details>

        <details>
          <summary>Road-condition and traction-law links</summary>
          <CorridorSources />
        </details>

        <p className="disclaimer tight">
          Miles, hours, and elevations are planning estimates from the public road network, October 2026. Baton Rouge,
          Houston, San Antonio, El Paso, Tucson, Phoenix, and Las Vegas are pass-throughs with no stops.
        </p>
      </section>
    </section>
  );
}

function lodgingNote(row: DriveTownRow): string {
  const missing = row.plan.days.filter((d) => d.hotel && !isStayHotel(d.hotel)).length;
  const parts = [`${row.budget.awardNightsPaid} award nights on points`];
  if (row.budget.cashLodgingNights > 0) {
    parts.push(`${row.budget.cashLodgingNights} cash shortfall nights`);
  }
  if (missing > 0) {
    parts.push(`${missing} night unassigned — no cat-Hilton`);
  }
  return parts.join("; ");
}

function FocusedDrive({ row }: { row: DriveTownRow }) {
  const dest = row.destLabel;
  return (
    <>
      <p className="disclaimer">
        Leave {leaveGainesville}. Arrive E17 {arriveParkCity}. {row.plan.totalMiles} miles ·{" "}
        {row.plan.totalHours.toFixed(1)} h driving · {row.plan.nights} nights. Corridor: {row.plan.summary}.
      </p>
      <PointsBank budget={row.budget} />
      <ExpenseTable
        caption={`${row.budget.name} trip cash · ${dest}`}
        rows={[
          { label: "Fuel", amount: row.budget.fuel, note: `${row.plan.totalMiles} mi ÷ 23 mpg` },
          { label: "Hilton lodging (cash)", amount: row.budget.lodging, note: lodgingNote(row) },
          { label: "Lodging tax", amount: row.budget.lodgingTax, note: "Cash room shortfall plus pet fees only" },
          { label: "Pet fees", amount: row.budget.petFees, note: "Still cash on an award stay unless the page says otherwise" },
          { label: "Parking", amount: row.budget.parking, note: "Free at all four hotels" },
          { label: "Food", amount: row.budget.food, note: "Meal stops, scaled with the budget tier" },
          { label: "Cat supplies", amount: row.budget.catSupplies, note: "Litter, pads, not NPS" },
          { label: "Tolls", amount: row.budget.tolls },
          { label: "Contingency", amount: row.budget.contingency },
        ]}
        total={row.budget.total}
      />
    </>
  );
}

function RouteComparison() {
  return (
    <div className="table-wrap">
      <table>
        <caption>Why this route · snow exposure, not miles</caption>
        <thead>
          <tr>
            <th scope="col">Route</th>
            <th scope="col">Miles</th>
            <th scope="col">Nights</th>
            <th scope="col">Highest point</th>
            <th scope="col">Miles above 6,000 ft</th>
            <th scope="col">Verdict</th>
          </tr>
        </thead>
        <tbody>
          {routeOptions.map((option) => (
            <tr key={option.id}>
              <td>
                <strong>{option.label}</strong>
                <div className="muted tight">{option.chosen ? "The plan" : "Retired"}</div>
              </td>
              <td className="num">{option.miles.toLocaleString("en-US")}</td>
              <td className="num">{option.nights}</td>
              <td>
                {option.highestFt.toLocaleString("en-US")} ft
                <div className="muted tight">{option.highestWhere}</div>
              </td>
              <td className="num">About {option.milesAbove6000}</td>
              <td>{option.verdict}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PointsBank({ budget }: { budget: TripBudget }) {
  return (
    <div className="table-wrap">
      <table>
        <caption>Hilton Honors points bank · not cash</caption>
        <thead>
          <tr>
            <th scope="col">Line</th>
            <th scope="col">Points</th>
            <th scope="col">Note</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Starting balance</td>
            <td className="num">{formatPoints(budget.pointsStart)}</td>
            <td className="muted">Hilton Honors bank</td>
          </tr>
          <tr>
            <td>Points used</td>
            <td className="num">{formatPoints(budget.pointsUsed)}</td>
            <td className="muted">{budget.awardNightsPaid} award nights</td>
          </tr>
          <tr>
            <td>Points left</td>
            <td className="num">{formatPoints(budget.pointsRemaining)}</td>
            <td className="muted">
              {budget.cashLodgingNights > 0
                ? `${budget.cashLodgingNights} cash lodging nights after the bank`
                : "No cash lodging night on this ledger"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function HotelEvidence({ days }: { days: DriveDay[] }) {
  const nights = days.map((d) => d.hotel).filter((h): h is HotelNight => h != null);
  return (
    <div className="table-wrap">
      <table>
        <caption>Hilton nights · cat-allowed stays on points</caption>
        <thead>
          <tr>
            <th scope="col">Property</th>
            <th scope="col">Pets quote</th>
            <th scope="col">Points / night</th>
            <th scope="col">Fee</th>
            <th scope="col">Source</th>
          </tr>
        </thead>
        <tbody>
          {nights.map((h) => {
            const stay = isStayHotel(h);
            return (
              <tr key={h.id}>
                <td>
                  <strong>
                    {h.brand} · {h.propertyName}
                  </strong>
                  <div className="muted">
                    {h.city}, {h.state}
                    {stay ? " · Stay" : " · Not a stay"}
                  </div>
                </td>
                <td>
                  Cats: {String(h.catsAllowed)} · max pets: {String(h.maxPets)}. {h.petPolicyQuote}
                </td>
                <td>
                  {h.awardPointsPerNight == null ? "—" : formatPoints(h.awardPointsPerNight)}
                  <div className="muted tight">{h.awardPointsQuote}</div>
                </td>
                <td className="num">{!stay || h.petFeeUsd == null ? "—" : formatUsd(h.petFeeUsd)}</td>
                <td>
                  <a href={h.sourceUrl} target="_blank" rel="noreferrer">
                    Listing
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
