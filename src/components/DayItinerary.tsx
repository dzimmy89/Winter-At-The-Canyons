import type { DriveDay, SundayCorridor } from "../data/types";
import { isStayHotel } from "../lib/drive";
import { formatPoints, formatUsd } from "../lib/money";
import { assertNever } from "../lib/money";

interface Props {
  days: DriveDay[];
  caption?: string;
}

export function DayItinerary({ days, caption = "Daily driving plan" }: Props) {
  return (
    <div className="table-wrap">
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Segment</th>
            <th scope="col">Miles</th>
            <th scope="col">Drive</th>
            <th scope="col">Hilton</th>
            <th scope="col">Pet fee</th>
            <th scope="col">Notes</th>
          </tr>
        </thead>
        {days.map((d) => (
          <tbody key={d.day}>
            <tr>
              <td className="num" data-label="Day">
                {d.dateLabel}
              </td>
              <td data-label="Segment">
                <strong>
                  {d.fromLabel} → {d.toLabel}
                </strong>
                <div className="muted tight">{d.routeSummary}</div>
                <div className="muted tight">
                  Depart {d.departClock}. Latest {d.latestSafeDepart}. Arrive {d.arriveClock}. {d.timeZone}. Stopped{" "}
                  {d.stoppedMinutes} min.
                </div>
              </td>
              <td className="num" data-label="Miles">
                {d.miles}
              </td>
              <td className="num" data-label="Drive">
                {d.driveHours.toFixed(1)} h
              </td>
              <td data-label="Hilton">{hiltonCell(d)}</td>
              <td className="num" data-label="Pet fee">
                {d.hotel && isStayHotel(d.hotel) && d.hotel.petFeeUsd != null ? formatUsd(d.hotel.petFeeUsd) : "—"}
              </td>
              <td data-label="Notes">{d.winterNotes}</td>
            </tr>
            <tr>
              <td colSpan={7}>
                <ul className="stop-list">
                  {d.stops.map((stop) => (
                    <li key={stop.id}>
                      <strong>{stop.clock}</strong> {stop.kind === "meal" ? "Meal" : "Rest"} · {stop.place}. {stop.road}.{" "}
                      {stop.purpose}
                      {stop.minutes > 0 ? ` ${stop.minutes} min.` : ""}
                      {stop.realisticUsd > 0 ? ` ${formatUsd(stop.realisticUsd)} at the realistic tier.` : ""}
                    </li>
                  ))}
                </ul>
                <p className="muted tight">
                  Snow gate {d.snowGate.checkAt}.{" "}
                  <a href={d.snowGate.sourceUrl} target="_blank" rel="noreferrer">
                    {d.snowGate.sourceName}
                  </a>
                  . Go: {d.snowGate.go} Hold: {d.snowGate.hold}
                </p>
                {d.corridors ? (
                  <ul className="stop-list">
                    {d.corridors.map((corridor) => (
                      <li key={corridor.id}>{corridorLine(corridor)}</li>
                    ))}
                  </ul>
                ) : null}
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
}

function corridorLine(corridor: SundayCorridor): string {
  switch (corridor.id) {
    case "i80":
      return `Default · ${corridor.label}. ${corridor.miles ?? "—"} mi · ${corridor.driveHours?.toFixed(1) ?? "—"} h. ${corridor.when}`;
    case "i70":
      return `Backup · ${corridor.label}. ${corridor.miles ?? "—"} mi · ${corridor.driveHours?.toFixed(1) ?? "—"} h. ${corridor.when}`;
    case "hold":
      return `Hold · ${corridor.label}. ${corridor.when}`;
    default:
      return assertNever(corridor.id);
  }
}

function hiltonCell(d: DriveDay) {
  if (!d.hotel) {
    return "Arrive";
  }
  if (!isStayHotel(d.hotel)) {
    return (
      <>
        {d.hotel.propertyName}
        <div className="warn-line tight">Missing cat-Hilton · night unassigned</div>
      </>
    );
  }
  const award = d.hotel.awardPointsPerNight;
  return (
    <>
      {d.hotel.brand} · {d.hotel.propertyName}
      <div className="muted tight">
        {award == null ? "Cash night · award quote missing" : `Stay · ${formatPoints(award)} pts/night ceiling`}
      </div>
      {d.hotel.callToConfirmTwoCats ? (
        <div className="warn-line tight">Call to confirm two cats and the award night</div>
      ) : null}
    </>
  );
}
