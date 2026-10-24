import { type ReactNode } from "react";
import { destination } from "../data/towns";
import type { BudgetTierId, DriveDay, HotelNight } from "../data/types";
import {
  arriveParkCity,
  isStayHotel,
  leaveGainesville,
  longestDriveHours,
  type DrivePlan,
  type TripBudget,
} from "../lib/drive";
import { formatPoints, formatUsd } from "../lib/money";
import { Checklist } from "./Checklist";
import { CorridorSources } from "./CorridorSources";
import { DayItinerary } from "./DayItinerary";
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
  { id: "trip-c5", label: "Sunday: I-80 if Wyoming is bare or wet. I-70 only if Wyoming has snow and the Colorado passes are bare. Wheat Ridge if both have snow" },
  { id: "trip-c6", label: "Cats do not stay in a closed car" },
];

const tripRisks = [
  {
    title: "Two cats vs the desk",
    body: "A Hilton “pets welcome” line is not enough. The stay is only a property whose page quotes cats and two pets. Call the desk, say two cats, and confirm the night is on Hilton Honors points.",
  },
  {
    title: "Friday is the cap",
    body: "Cookeville to Topeka is 13.0 hours of driving. Depart at 3:00 AM EST. Nashville and Kansas City are pass-throughs.",
  },
  {
    title: "Snow is the high country",
    body: "The planned Sunday road is I-25 and I-80, under Sherman Summit at 8,640 feet. Eisenhower and Vail stay off the clock unless Wyoming has snow and those passes are bare. Falling snow, snow-packed pavement, a chain law, or a closure is a no-go on either road. If both have snow, stay at Wheat Ridge. That second night is cash.",
  },
  {
    title: "150,000 points and the ceilings",
    body: "Three Hampton nights. Cookeville and Topeka use a 30,000-point ceiling. Wheat Ridge uses a 60,000-point Denver ceiling. The bank pays them in order. A hold night after that is cash.",
  },
];

function dayRole(day: DriveDay): string {
  if (!day.hotel) {
    return "Arrive on the clear corridor";
  }
  if (day.toLabel.includes("Wheat Ridge")) {
    return "East of Eisenhower";
  }
  if (day.toLabel.includes("Topeka")) {
    return "13 h cap";
  }
  return "Sleep";
}

export function DriveSection({ row, tierId, onTier, map }: Props) {
  const longest = longestDriveHours(row.plan.days);
  return (
    <section id="drive" className="section">
      <p className="eyebrow">Drive</p>
      <h2>Thursday to Sunday. E17 on November 15.</h2>
      <p className="lede">
        Leave Gainesville {leaveGainesville}. Arrive {destination.label} {arriveParkCity}. Sleep in Cookeville, Topeka,
        and Wheat Ridge. Sunday goes north on I-25 and west on I-80, and stays off Eisenhower and Vail unless Wyoming has snow. Overnight only at Hilton Honors hotels
        whose pages quote cats and two pets.
      </p>
      <p className="points-line">
        {formatPoints(row.budget.pointsUsed)} of {formatPoints(row.budget.pointsStart)} points used.{" "}
        {formatPoints(row.budget.pointsRemaining)} left.
        {row.budget.cashLodgingNights > 0
          ? ` ${row.budget.cashLodgingNights} cash nights on their own line.`
          : " Ceiling ledger: 3 award nights."}
      </p>
      <p className="disclaimer">
        Cap {row.plan.cap} h. Longest day {longest.toFixed(1)} h.
      </p>
      {map}
      <ol className="day-cards">
        {row.plan.days.map((day) => (
          <li key={day.day}>
            <span className="kicker">{day.dateLabel}</span>
            <strong>
              {day.fromLabel} → {day.toLabel}
            </strong>
            <span className="num">
              Depart {day.departClock} · {day.miles} mi · {day.driveHours.toFixed(1)} h · {dayHotelLabel(day)}
            </span>
            <span>
              Arrive {day.arriveClock}. Latest depart {day.latestSafeDepart}. {dayRole(day)}.
            </span>
            <span className="muted tight">
              Snow: {day.snowGate.go}{" "}
              <a href={day.snowGate.sourceUrl} target="_blank" rel="noreferrer">
                {day.snowGate.sourceName}
              </a>
            </span>
          </li>
        ))}
      </ol>
      <p className="disclaimer">
        Miles and hours are a planning estimate from the public road network on October 22, 2026. They are not a Mapbox
        run. Nashville, Kansas City, and the Gateway Arch are pass-throughs. Newfound Gap and Rim Rock Drive are off
        this clock.
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
      <CorridorSources />
      <RiskCallout items={tripRisks} />
      <Checklist title="Before you roll" items={tripChecklist} />
    </section>
  );
}

function dayHotelLabel(day: DriveDay): string {
  if (!day.hotel) {
    return "Arrive — no hotel";
  }
  if (!isStayHotel(day.hotel)) {
    return "Unassigned — no cat-Hilton";
  }
  return `${day.hotel.brand} · stay`;
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
          { label: "Parking", amount: row.budget.parking, note: "Complimentary at Cookeville, Topeka, and Wheat Ridge" },
          { label: "Food", amount: row.budget.food, note: "Meal stops, scaled with the budget tier" },
          { label: "Cat supplies", amount: row.budget.catSupplies, note: "Litter, pads, not NPS" },
          { label: "Tolls", amount: row.budget.tolls },
          { label: "Contingency", amount: row.budget.contingency },
        ]}
        total={row.budget.total}
      />
      <DayItinerary days={row.plan.days} caption={`${leaveGainesville} to ${dest}`} />
      <HotelEvidence days={row.plan.days} />
    </>
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
                    hilton.com
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
