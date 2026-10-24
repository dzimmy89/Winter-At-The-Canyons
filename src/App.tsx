import { useEffect, useMemo, useState, type ReactNode } from "react";
import { DriveSection, type DriveTownRow } from "./components/DriveSection";
import { GainesvilleSection } from "./components/GainesvilleSection";
import { NowBoard } from "./components/NowBoard";
import { ParkCityLease } from "./components/ParkCityLease";
import { UsMap } from "./components/UsMap";
import { hotels, listings as catalogListings, routes } from "./data/catalog";
import type { BudgetTierId, MapFeature } from "./data/types";
import {
  DESTINATION_TOWN_ID,
  destinationLabelFor,
  planDrive,
  routeForTown,
  tierById,
  tripBudget,
} from "./lib/drive";
import { assertNever } from "./lib/money";

type JobId = "now" | "drive" | "lease" | "house";

const nav = [
  ["#now", "Now"],
  ["#drive", "Drive"],
  ["#lease", "Lease"],
  ["#house", "House"],
] as const;

function jobFromHash(raw: string): JobId {
  switch (raw) {
    case "#now":
    case "":
      return "now";
    case "#drive":
    case "#map":
      return "drive";
    case "#lease":
    case "#hunt":
      return "lease";
    case "#house":
    case "#florida":
      return "house";
    default:
      return "now";
  }
}

function canonicalHash(raw: string): string {
  return `#${jobFromHash(raw)}`;
}

export default function App() {
  const listing = catalogListings[0];
  if (!listing) {
    throw new Error("Catalog must include 900 Bitner Road, Apartment E17");
  }

  const [tierId, setTierId] = useState<BudgetTierId>("realistic");
  const [mapFeature, setMapFeature] = useState<MapFeature | null>(null);
  const [hash, setHash] = useState(() =>
    typeof window === "undefined" ? "#now" : canonicalHash(window.location.hash),
  );

  useEffect(() => {
    function applyHash() {
      const next = canonicalHash(window.location.hash);
      if (window.location.hash !== next) {
        window.location.hash = next;
      }
      setHash(next);
      window.scrollTo(0, 0);
    }
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const rates = tierById(tierId);
  const destLabel = destinationLabelFor(DESTINATION_TOWN_ID, [listing]);
  const route = routeForTown(routes, DESTINATION_TOWN_ID);

  const driveRow = useMemo((): DriveTownRow => {
    const plan = planDrive(
      DESTINATION_TOWN_ID,
      route,
      hotels,
      rates.gallonUsd,
      rates.foodPerDay,
      rates.contingency,
      destLabel,
    );
    return {
      destLabel,
      plan,
      budget: tripBudget(plan, tierId),
    };
  }, [destLabel, rates.contingency, rates.foodPerDay, rates.gallonUsd, route, tierId]);

  const job = jobFromHash(hash);
  let screen: ReactNode;
  switch (job) {
    case "now":
      screen = <NowBoard />;
      break;
    case "drive":
      screen = (
        <DriveSection
          row={driveRow}
          tierId={tierId}
          onTier={setTierId}
          map={
            <UsMap
              listing={listing}
              stops={driveRow.plan.stops}
              hotels={hotels}
              selected={mapFeature}
              onSelect={setMapFeature}
            />
          }
        />
      );
      break;
    case "lease":
      screen = <ParkCityLease listing={listing} />;
      break;
    case "house":
      screen = <GainesvilleSection />;
      break;
    default:
      screen = assertNever(job);
  }

  return (
    <div className="app">
      <a className="skip-link" href="#now">
        Skip to content
      </a>
      <a className="brand" href="#now">
        Winter Season
      </a>
      <nav className="job-nav" aria-label="Jobs">
        {nav.map(([href, label]) => (
          <a key={href} href={href} aria-current={hash === href ? "page" : undefined}>
            {label}
          </a>
        ))}
      </nav>
      <main>{screen}</main>
      <footer className="colophon">
        Florida rent pays the mortgage only. 900 Bitner E17 is the signed winter lease. Tanya Chappell at Secure
        Investments manages 4922.
      </footer>
    </div>
  );
}
