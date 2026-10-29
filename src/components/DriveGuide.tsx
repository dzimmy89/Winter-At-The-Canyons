import { useEffect, useMemo, useState } from "react";
import { mapsDirectionsUrl } from "../data/driveGuide";
import type { DriveDay, DriveStopEvent, SnowRisk } from "../data/types";
import { isStayHotel, type DrivePlan } from "../lib/drive";
import { buildDayGuide, dayDrivingMinutes, formatMinutes, mapsDayUrl, type TimelineItem } from "../lib/guide";
import { assertNever, formatPoints, formatUsd } from "../lib/money";
import { useChecklistState } from "../hooks/useChecklistState";
import { LegMap } from "./LegMap";

const DAY_KEY = "winter-expedition-day";

function initialDay(days: DriveDay[]): number {
  const today = new Date();
  const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const onTheRoad = days.findIndex((day) => day.date === iso);
  if (onTheRoad >= 0) {
    return onTheRoad;
  }
  try {
    const stored = Number(localStorage.getItem(DAY_KEY));
    if (Number.isInteger(stored) && stored >= 0 && stored < days.length) {
      return stored;
    }
  } catch {
    // Storage can be blocked; the first day is a fine default.
  }
  return 0;
}

function shortTown(label: string): string {
  return label.split(",")[0].replace("900 Bitner Road", "E17");
}

function riskLabel(risk: SnowRisk): string {
  switch (risk) {
    case "none":
      return "No snow risk";
    case "low":
      return "Low snow risk";
    case "watch":
      return "Snow check";
    default:
      return assertNever(risk);
  }
}

export function DriveGuide({ plan }: { plan: DrivePlan }) {
  const [index, setIndex] = useState(() => initialDay(plan.days));
  const day = plan.days[index];
  const previous = index > 0 ? plan.days[index - 1] : null;
  const guide = useMemo(() => buildDayGuide(day, previous), [day, previous]);
  const stopIds = useMemo(() => plan.days.flatMap((d) => d.stops.map((s) => `stop-${s.id}`)), [plan.days]);
  const { checked, toggle } = useChecklistState(stopIds);

  useEffect(() => {
    try {
      localStorage.setItem(DAY_KEY, String(index));
    } catch {
      // Remembering the day is a convenience only.
    }
  }, [index]);

  function pick(next: number) {
    setIndex(next);
    document.getElementById("day-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const roadStops = guide.timeline.filter((item) => item.kind === "stop").length;

  return (
    <div className="guide">
      <div className="day-picker" role="tablist" aria-label="Driving days">
        {plan.days.map((d, i) => (
          <button
            key={d.date}
            type="button"
            role="tab"
            aria-selected={i === index}
            className={i === index ? "day-chip is-active" : "day-chip"}
            onClick={() => pick(i)}
          >
            <span className="day-chip-date">{d.dateLabel.replace(" Nov ", " ")}</span>
            <span className="day-chip-to">{shortTown(d.toLabel)}</span>
          </button>
        ))}
      </div>

      <article id="day-panel" className="day-panel" aria-live="polite">
        <header className="day-head">
          <p className="eyebrow">
            Day {day.day} of {plan.days.length} · {day.dateLabel}
          </p>
          <h2>
            {shortTown(day.fromLabel)} <span aria-hidden="true">→</span> {shortTown(day.toLabel)}
          </h2>
          <dl className="day-stats">
            <div>
              <dt>Leave</dt>
              <dd>{day.departClock}</dd>
            </div>
            <div>
              <dt>Arrive</dt>
              <dd>{day.arriveClock}</dd>
            </div>
            <div>
              <dt>Driving</dt>
              <dd>
                {day.miles} mi · {formatMinutes(dayDrivingMinutes(day))}
              </dd>
            </div>
            <div>
              <dt>Stops</dt>
              <dd>{roadStops} on the road</dd>
            </div>
          </dl>
          <p className="muted tight">
            {day.timeZone}. Leave no later than {day.latestSafeDepart}.
          </p>
          <LegMap
            id={`day-${day.day}`}
            title={`Map of day ${day.day}, ${shortTown(day.fromLabel)} to ${shortTown(day.toLabel)}`}
            caption="Today's whole drive, with the road stops numbered in order. Each leg below has its own close-up map."
          />
          <a className="btn btn-primary" href={mapsDayUrl(guide)} target="_blank" rel="noreferrer">
            Open today's whole route in Google Maps
          </a>
        </header>

        <section className="gate" aria-label="Road check before leaving">
          <h3>Before you leave: road check</h3>
          <p>
            {day.snowGate.checkAt}, on{" "}
            <a href={day.snowGate.sourceUrl} target="_blank" rel="noreferrer">
              {day.snowGate.sourceName}
            </a>
            .
          </p>
          <p>
            <span className="tag tag-go">Go</span> {day.snowGate.go}
          </p>
          <p>
            <span className="tag tag-hold">Hold</span> {day.snowGate.hold}
          </p>
          {day.corridors ? (
            <ul className="plain-list">
              {day.corridors.map((c) => (
                <li key={c.id}>
                  <strong>{c.label}.</strong> {c.when}
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <ol className="timeline">
          {guide.timeline.map((item, i) => (
            <TimelineRow
              key={`${item.kind}-${i}`}
              item={item}
              done={item.kind === "stop" ? Boolean(checked[`stop-${item.stop.id}`]) : false}
              onToggle={item.kind === "stop" ? () => toggle(`stop-${item.stop.id}`) : undefined}
            />
          ))}
        </ol>

        {guide.evening.length > 0 ? (
          <section className="evening">
            <h3>After you check in</h3>
            <ul className="evening-list">
              {guide.evening.map(({ stop, place }) => (
                <li key={stop.id}>
                  <StopCard
                    stop={stop}
                    place={place}
                    done={Boolean(checked[`stop-${stop.id}`])}
                    onToggle={() => toggle(`stop-${stop.id}`)}
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="day-notes">
          <h3>Good to know today</h3>
          <p>{day.winterNotes}</p>
          {guide.inCar.length > 0 ? <p className="muted">In the car: {guide.inCar[0].purpose}</p> : null}
        </section>

        <nav className="day-step" aria-label="Other days">
          {index > 0 ? (
            <button type="button" className="btn" onClick={() => pick(index - 1)}>
              ← {plan.days[index - 1].dateLabel}
            </button>
          ) : (
            <span />
          )}
          {index < plan.days.length - 1 ? (
            <button type="button" className="btn" onClick={() => pick(index + 1)}>
              {plan.days[index + 1].dateLabel} →
            </button>
          ) : null}
        </nav>
      </article>
    </div>
  );
}

function TimelineRow({ item, done, onToggle }: { item: TimelineItem; done: boolean; onToggle?: () => void }) {
  switch (item.kind) {
    case "work":
      return (
        <li className="tl-node tl-work">
          <span className="tl-mark" aria-hidden="true">
            ⌨
          </span>
          <div className="tl-body">
            <p className="tl-clock">
              {item.work.hours}
              <span className="stop-kind">Workday</span>
            </p>
            <h3>Work first: {item.work.where}</h3>
            <ul className="plain-list">
              {item.work.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            {item.hotel?.workspace ? (
              <p className="muted tight">
                <strong>What the hotel has:</strong> {item.hotel.workspace}
              </p>
            ) : null}
          </div>
        </li>
      );
    case "depart":
      return (
        <li className="tl-node tl-start">
          <span className="tl-mark" aria-hidden="true">
            ●
          </span>
          <div className="tl-body">
            <p className="tl-clock">{item.clock}</p>
            <h3>Leave {shortTown(item.label)}</h3>
            <p className="muted">{item.address}</p>
          </div>
        </li>
      );
    case "leg":
      return (
        <li className="tl-leg">
          <div className="leg-card">
            <div className="leg-top">
              <span className="shield">{item.leg.road}</span>
              <span className={`snow-pill snow-${item.leg.snowRisk}`}>{riskLabel(item.leg.snowRisk)}</span>
            </div>
            <p className="leg-stats">
              {item.leg.miles} mi · about {formatMinutes(item.guide.minutes)} · tops out near{" "}
              {item.leg.topElevationFt.toLocaleString("en-US")} ft
            </p>
            <LegMap id={item.leg.id} title={`Map of ${item.leg.road} from ${item.leg.from} to ${item.leg.to}`} />
            <ol className="directions">
              {item.guide.directions.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="muted tight">{item.leg.note}</p>
            <a className="link-sm" href={mapsDirectionsUrl(item.to, item.from)} target="_blank" rel="noreferrer">
              Preview this leg in Google Maps
            </a>
          </div>
        </li>
      );
    case "stop":
      return (
        <li className={done ? "tl-node tl-stop is-done" : "tl-node tl-stop"}>
          <span className="tl-mark" aria-hidden="true">
            {item.stop.kind === "meal" ? "🍴" : "★"}
          </span>
          <div className="tl-body">
            <StopCard stop={item.stop} place={item.place} done={done} onToggle={onToggle} />
          </div>
        </li>
      );
    case "arrive":
      return (
        <li className="tl-node tl-end">
          <span className="tl-mark" aria-hidden="true">
            ⌂
          </span>
          <div className="tl-body">
            <p className="tl-clock">{item.clock}</p>
            <h3>{item.hotel ? `Check in: ${item.hotel.propertyName}` : "Arrive: Apartment E17"}</h3>
            <p className="muted">{item.address}</p>
            {item.hotel ? <HotelLine hotel={item.hotel} /> : <p>Keys, then unload the cats first.</p>}
            <a className="btn btn-primary" href={mapsDirectionsUrl(item.address)} target="_blank" rel="noreferrer">
              Navigate here
            </a>
          </div>
        </li>
      );
    default:
      return assertNever(item);
  }
}

function HotelLine({ hotel }: { hotel: NonNullable<Extract<TimelineItem, { kind: "arrive" }>["hotel"]> }) {
  const stay = isStayHotel(hotel);
  return (
    <ul className="plain-list tight">
      <li>
        {stay ? "Two cats allowed per the listing." : "Pet policy not confirmed."}
        {hotel.petFeeUsd != null ? ` Pet fee ${formatUsd(hotel.petFeeUsd)}.` : " Ask the desk about the pet fee."}
      </li>
      {hotel.awardPointsPerNight != null ? (
        <li>Hilton Honors: up to {formatPoints(hotel.awardPointsPerNight)} points for the night.</li>
      ) : null}
      {hotel.nights > 1 ? <li>Book {hotel.nights} nights here, so the room is yours through the next workday.</li> : null}
      {hotel.workspace ? <li>Work space: {hotel.workspace}</li> : null}
      {hotel.callToConfirmTwoCats ? (
        <li className="warn-line">Call ahead to confirm two cats{hotel.nights > 1 ? ", both nights," : ""} and the points booking.</li>
      ) : null}
    </ul>
  );
}

function StopCard({
  stop,
  place,
  done,
  onToggle,
}: {
  stop: DriveStopEvent;
  place: string;
  done: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="stop-card">
      <p className="tl-clock">
        {stop.clock}
        <span className="stop-kind">{stop.kind === "meal" ? "Meal stop" : "Rest stop"}</span>
      </p>
      <h3>{stop.place}</h3>
      <p className="stop-meta">
        {stop.minutes > 0 ? `${stop.minutes} min there` : "Quick stop"}
        {stop.realisticUsd > 0 ? ` · about ${formatUsd(stop.realisticUsd)}` : " · free"}
      </p>
      <p>{stop.purpose}</p>
      <p className="muted tight">
        <strong>Getting there:</strong> {stop.road}.
      </p>
      <div className="stop-actions">
        <a className="btn btn-primary" href={mapsDirectionsUrl(place)} target="_blank" rel="noreferrer">
          Navigate here
        </a>
        {onToggle ? (
          <label className="done-toggle">
            <input type="checkbox" checked={done} onChange={onToggle} />
            <span>{done ? "Done" : "Mark done"}</span>
          </label>
        ) : null}
      </div>
    </div>
  );
}
