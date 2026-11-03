import { useEffect, useState } from "react";

type SaveState = "checking" | "saved" | "unavailable";

// The installable copy of this app. It saves itself on the phone for use with no signal.
export const INSTALL_URL = "https://dzimmy89.github.io/Winter-At-The-Canyons/";

function isInstalled(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia?.("(display-mode: standalone)").matches === true || nav.standalone === true;
}

// Tells you whether the plan is saved on this phone, and how to get it there.
export function OfflineCard() {
  const [online, setOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));
  const [saved, setSaved] = useState<SaveState>("checking");
  const installed = isInstalled();

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    let cancelled = false;
    if ("serviceWorker" in navigator && window.isSecureContext) {
      const timer = window.setTimeout(() => {
        if (!cancelled) setSaved((state) => (state === "checking" ? "unavailable" : state));
      }, 8000);
      navigator.serviceWorker.ready
        .then(() => {
          if (!cancelled) setSaved("saved");
        })
        .catch(() => {
          if (!cancelled) setSaved("unavailable");
        })
        .finally(() => window.clearTimeout(timer));
    } else {
      setSaved("unavailable");
    }
    return () => {
      cancelled = true;
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  let status: string;
  if (!online && saved === "saved") {
    status = "No signal right now. You are using the copy saved on this phone, so everything here still works.";
  } else if (saved === "saved" && installed) {
    status = "Saved on this phone. It opens and works with no signal.";
  } else if (saved === "saved") {
    status = "Saved on this phone. Add it to your Home Screen so it opens like an app.";
  } else if (saved === "checking") {
    status = "Saving the plan on this phone…";
  } else {
    status = "This copy needs signal. Install the offline version from the link below.";
  }

  return (
    <details className={`offline-card offline-${saved}`} open={!installed}>
      <summary>
        <span className="offline-dot" aria-hidden="true" />
        <span>{status}</span>
      </summary>
      <div className="offline-body">
        <h3>Put it on your phone</h3>
        {saved === "unavailable" && (
          <p className="offline-link">
            Installable version: <a href={INSTALL_URL}>{INSTALL_URL.replace("https://", "")}</a>
          </p>
        )}
        <ol>
          <li>
            <strong>iPhone:</strong> open {saved === "unavailable" ? "that link" : "this page"} in Safari, tap Share, then <em>Add to Home Screen</em>.
          </li>
          <li>
            <strong>Android:</strong> open {saved === "unavailable" ? "that link" : "this page"} in Chrome, tap the ⋮ menu, then <em>Install app</em> or <em>Add to Home screen</em>.
          </li>
          <li>Open it once from the Home Screen while you have signal. That saves every day, map and note.</li>
          <li>Test it: turn on Airplane Mode and open it again.</li>
        </ol>
        <h3>What works with no signal</h3>
        <ul>
          <li>Every day's timeline, leg maps, turn-by-turn highway directions, times, stop and hotel notes, and your check-offs.</li>
          <li>
            The <em>Navigate</em> buttons hand off to Google Maps, which needs signal unless you save offline maps first. In Google Maps,
            tap your profile picture, then <em>Offline maps</em>, then <em>Select your own map</em>, and save an area for each day's
            drive before you leave. Turn-by-turn driving then works with no signal.
          </li>
          <li>Road and weather checks (UDOT, DriveTexas, AZ 511) need signal. Do them at the hotel before you leave.</li>
        </ul>
      </div>
    </details>
  );
}
