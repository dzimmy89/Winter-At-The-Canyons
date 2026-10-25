import { useEffect } from "react";
import { destination, origin } from "../data/towns";
import type { HotelNight, Listing, MapFeature } from "../data/types";
import { a2LeaseDates, gainesvilleProperty, mortgageMonthly } from "../data/gainesville";
import { parkForStop, type ParkStop } from "../data/parks";
import { priorPublicListing, signedLease } from "../data/parkCity";
import { usMainlandRing } from "../data/usMainlandRing";
import { arriveParkCity, isStayHotel, leaveGainesville, type DriveStop } from "../lib/drive";
import { segmentForLeg } from "../lib/mapRoute";
import { mapViewBox, projectLngLat, ringToPath } from "../lib/geo";
import { formatPoints, formatUsd } from "../lib/money";
import { assertNever } from "../lib/money";

interface Props {
  listing: Listing;
  stops: DriveStop[];
  hotels: HotelNight[];
  selected: MapFeature | null;
  onSelect: (next: MapFeature | null) => void;
}

const stopNudge: Record<string, { dx: number; dy: number }> = {
  covington: { dx: 8, dy: 12 },
  kerrville: { dx: 8, dy: 12 },
  deming: { dx: 8, dy: 12 },
  kingman: { dx: 8, dy: 12 },
};

function markPoint(lng: number, lat: number, place: string): { x: number; y: number } {
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    throw new Error(`Missing lat/lng for ${place}`);
  }
  return projectLngLat(lng, lat);
}

function hotelForStop(hotels: HotelNight[], stop: DriveStop): HotelNight | undefined {
  return (
    hotels.find((h) => h.city.toLowerCase() === stop.city.toLowerCase() && h.state === stop.state) ??
    hotels.find((h) => h.id.includes(stop.id))
  );
}

export function UsMap({ listing, stops, hotels, selected, onSelect }: Props) {
  const path = ringToPath(usMainlandRing);
  const gnv = markPoint(origin.lng, origin.lat, "Gainesville");
  const destPt = markPoint(listing.lng ?? destination.lng, listing.lat ?? destination.lat, listing.address);
  const stopPts = stops.map((stop) => markPoint(stop.lng, stop.lat, stop.id));
  const routePoints = [gnv, ...stopPts, destPt];
  const routePath = routePoints.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(" ");
  const nodeIds = ["origin", ...stops.map((s) => s.id), "dest"];
  const stopNames = stops.map((stop) => stop.shortLabel).join(" → ");

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onSelect(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSelect]);

  return (
    <div className="map-block">
      <p className="lede">
        Leave {origin.label} {leaveGainesville}. Pins: {stopNames || "none"}. Last pin is Apartment E17 on{" "}
        {arriveParkCity}. Click a pin or a corridor. Esc or click the land to clear.
      </p>
      <div className="map-shell">
        <svg
          className="us-map"
          viewBox={`0 0 ${mapViewBox.width} ${mapViewBox.height}`}
          role="img"
          aria-label={`Continental United States with Gainesville, overnight stops, and ${listing.address}`}
          onClick={() => onSelect(null)}
        >
          <title>{`Gainesville to ${listing.address} via ${stopNames}`}</title>
          <path className="us-map-land" d={path} />
          {routePath ? <path className="us-map-route" d={routePath} /> : null}
          {routePoints.slice(0, -1).map((from, index) => {
            const to = routePoints[index + 1];
            const fromId = nodeIds[index];
            const toId = nodeIds[index + 1];
            const seg = segmentForLeg(fromId, toId);
            const active = selected?.kind === "segment" && selected.segmentId === seg.id;
            return (
              <path
                key={`${fromId}-${toId}`}
                className={active ? "us-map-segment is-active" : "us-map-segment"}
                d={`M${from.x.toFixed(1)} ${from.y.toFixed(1)} L${to.x.toFixed(1)} ${to.y.toFixed(1)}`}
                role="button"
                tabIndex={0}
                aria-label={seg.title}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect({ kind: "segment", segmentId: seg.id });
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect({ kind: "segment", segmentId: seg.id });
                  }
                }}
              />
            );
          })}
          <g
            className={selected?.kind === "origin" ? "us-map-origin is-active" : "us-map-origin"}
            transform={`translate(${gnv.x} ${gnv.y})`}
          >
            <circle
              r="7"
              role="button"
              tabIndex={0}
              aria-label="4922 NW 81st Ave, Gainesville"
              aria-pressed={selected?.kind === "origin"}
              onClick={(event) => {
                event.stopPropagation();
                onSelect({ kind: "origin" });
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect({ kind: "origin" });
                }
              }}
            />
            <text x="10" y="4">
              Gainesville
            </text>
          </g>
          {stops.map((stop, index) => {
            const pt = stopPts[index];
            const nudge = stopNudge[stop.id] ?? { dx: 8, dy: 4 };
            const active = selected?.kind === "stop" && selected.stopId === stop.id;
            return (
              <g
                key={stop.id}
                className={active ? "us-map-stop is-active" : "us-map-stop"}
                transform={`translate(${pt.x} ${pt.y})`}
              >
                <circle
                  r="5"
                  role="button"
                  tabIndex={0}
                  aria-label={stop.label}
                  aria-pressed={active}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelect({ kind: "stop", stopId: stop.id });
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect({ kind: "stop", stopId: stop.id });
                    }
                  }}
                />
                <text x={nudge.dx} y={nudge.dy}>
                  {index + 1} {stop.shortLabel}
                </text>
              </g>
            );
          })}
          <g
            className={selected?.kind === "dest" ? "us-map-dest is-active" : "us-map-dest"}
            transform={`translate(${destPt.x} ${destPt.y})`}
          >
            <circle
              r="7"
              role="button"
              tabIndex={0}
              aria-label={listing.address}
              aria-pressed={selected?.kind === "dest"}
              onClick={(event) => {
                event.stopPropagation();
                onSelect({ kind: "dest" });
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect({ kind: "dest" });
                }
              }}
            />
            <text x="-18" y="16">
              E17 Bitner
            </text>
          </g>
        </svg>
        <MapPanel stops={stops} hotels={hotels} selected={selected} onClear={() => onSelect(null)} />
      </div>
    </div>
  );
}

function MapPanel({
  stops,
  hotels,
  selected,
  onClear,
}: {
  stops: DriveStop[];
  hotels: HotelNight[];
  selected: MapFeature | null;
  onClear: () => void;
}) {
  return (
    <aside className="map-panel" aria-live="polite">
      <div className="map-panel-head">
        <p className="kicker">On the map</p>
        {selected ? (
          <button type="button" className="linkish" onClick={onClear}>
            Clear
          </button>
        ) : null}
      </div>
      <MapPanelBody stops={stops} hotels={hotels} selected={selected} />
    </aside>
  );
}

function MapPanelBody({
  stops,
  hotels,
  selected,
}: {
  stops: DriveStop[];
  hotels: HotelNight[];
  selected: MapFeature | null;
}) {
  if (selected == null) {
    return (
      <>
        <h3>Click a pin or a corridor</h3>
        <p>
          Gainesville is the house Tanya Chappell at Secure Investments Realty is managing. Covington, Kerrville,
          Deming, and Kingman are the Hilton nights, all smaller towns. E17 is the signed lease in Kimball Junction.
        </p>
      </>
    );
  }
  switch (selected.kind) {
    case "origin":
      return (
        <>
          <h3>{gainesvilleProperty.address}</h3>
          <p>
            Landlord house. Tanya Chappell at Secure Investments Realty is the hired manager. Default lease{" "}
            {a2LeaseDates}. Rent covers the {formatUsd(mortgageMonthly)} mortgage only. Electric and wifi come from
            other income.
          </p>
          <p>
            <a href="#florida">Open the Florida playbook</a>
          </p>
        </>
      );
    case "dest":
      return (
        <>
          <h3>{signedLease.address}</h3>
          <p>
            Signed lease {signedLease.dates}. {formatUsd(signedLease.allInMonthly)}/month. Confirm what that includes.
            Canyon Creek Club, Kimball Junction.
          </p>
          <p>
            <a href={priorPublicListing.url} target="_blank" rel="noreferrer">
              Prior public listing
            </a>
            {" · "}
            <a href="#hunt">Open the signed lease</a>
          </p>
        </>
      );
    case "stop": {
      const stop = stops.find((row) => row.id === selected.stopId);
      if (!stop) {
        return <p>Unknown stop.</p>;
      }
      const hotel = hotelForStop(hotels, stop);
      const park = parkForStop(stop.id);
      if (!hotel || !isStayHotel(hotel)) {
        return (
          <>
            <h3>{stop.label}</h3>
            <p>
              No Hilton Honors hotel here quotes two cats allowed. Night unassigned. Do not book Marriott, Motel 6, or
              an indie.
            </p>
            <p>
              <a href="#drive">Open the drive itinerary</a>
            </p>
          </>
        );
      }
      return (
        <>
          <h3>
            {hotel.brand} · {hotel.propertyName}
          </h3>
          <p>{hotel.petPolicyQuote}</p>
          <p>
            {hotel.awardPointsPerNight == null ? "Award points not quoted" : `${formatPoints(hotel.awardPointsPerNight)} points / night`}.
            Call the desk, say two cats, confirm the award night.
          </p>
          {park ? <ParkDetail park={park} /> : <p>Transit night. No national park on this stop.</p>}
          <p>
            <a href={hotel.sourceUrl} target="_blank" rel="noreferrer">
              Hilton page
            </a>
            {" · "}
            <a href="#drive">Open the drive itinerary</a>
          </p>
        </>
      );
    }
    case "segment": {
      const nodeIds = ["origin", ...stops.map((s) => s.id), "dest"];
      const match = nodeIds
        .slice(0, -1)
        .map((fromId, i) => segmentForLeg(fromId, nodeIds[i + 1] ?? "dest"))
        .find((seg) => seg.id === selected.segmentId);
      if (!match) {
        return <p>Unknown corridor.</p>;
      }
      return (
        <>
          <h3>{match.title}</h3>
          <p>{match.body}</p>
          <p>
            <a href="#drive">Open the drive itinerary</a>
          </p>
        </>
      );
    }
    default:
      return assertNever(selected);
  }
}

function ParkDetail({ park }: { park: ParkStop }) {
  return (
    <>
      {park.image ? (
        <img className="park-photo" src={park.image.src} alt={park.image.alt} />
      ) : (
        <p>No public-domain photo is stored for this park.</p>
      )}
      <p>
        <strong>{park.name}.</strong> {park.visit}
      </p>
      <ul>
        {park.activities.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>
        {park.pets}{" "}
        <a href={park.url} target="_blank" rel="noreferrer">
          Park pet rules
        </a>
      </p>
      {park.image ? (
        <p className="muted tight">
          {park.image.credit}{" "}
          <a href={park.image.sourceUrl} target="_blank" rel="noreferrer">
            Source
          </a>
        </p>
      ) : null}
    </>
  );
}

