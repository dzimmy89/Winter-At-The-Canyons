import { useEffect, useState } from "react";

// Shape of src/data/generated/leg-maps.json, written by scripts/seed-leg-maps.ts.
// Every coordinate is already projected into the map's own SVG units.
type Anchor = "start" | "end" | "middle";

export interface LegMapData {
  width: number;
  height: number;
  land: string;
  mexico: string;
  water: string;
  rivers: string;
  states: string;
  roads: { interstate: string; us: string; state: string };
  route: string[];
  connectors: string;
  shields: { x: number; y: number; text: string; kind: string }[];
  places: { x: number; y: number; x0: number; y0: number; text: string; anchor: Anchor; main: boolean }[];
  stateNames: { x: number; y: number; text: string; anchor: Anchor }[];
  crossings: { x: number; y: number; text: string; anchor: Anchor; lx: number; ly: number }[];
  markers: {
    x: number;
    y: number;
    kind: "start" | "end" | "stop";
    label: string;
    n?: number;
    lx: number;
    ly: number;
    anchor: Anchor;
  }[];
  scale: { units: number; miles: number };
  routeMiles: number;
}

type MapsById = Record<string, LegMapData>;

// The map data is about 400 KB, so it loads as its own chunk after the guide shows.
let mapsPromise: Promise<MapsById> | null = null;
function loadMaps(): Promise<MapsById> {
  mapsPromise ??= import("../data/generated/leg-maps.json").then((mod) => mod.default.maps as unknown as MapsById);
  return mapsPromise;
}

function useMap(id: string): LegMapData | null | undefined {
  const [maps, setMaps] = useState<MapsById | null>(null);
  useEffect(() => {
    let live = true;
    loadMaps().then((loaded) => {
      if (live) setMaps(loaded);
    });
    return () => {
      live = false;
    };
  }, []);
  if (!maps) return undefined;
  return maps[id] ?? null;
}

export function LegMap({ id, title, caption }: { id: string; title: string; caption?: string }) {
  const map = useMap(id);
  if (map === null) {
    return null;
  }
  if (!map) {
    return <div className="leg-map leg-map-loading" aria-hidden="true" />;
  }
  const { width, height } = map;
  const stops = map.markers.filter((m) => m.kind === "stop");
  const sx = 14;
  const sy = height - 16;
  return (
    <figure className="leg-map">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        <rect className="lm-sea" width={width} height={height} />
        <path className="lm-mexico" d={map.mexico} />
        <path className="lm-land" d={map.land} fillRule="evenodd" />
        <path className="lm-water" d={map.water} fillRule="evenodd" />
        <path className="lm-river" d={map.rivers} />
        <path className="lm-state-line" d={map.states} />
        <path className="lm-road lm-road-state" d={map.roads.state} />
        <path className="lm-road lm-road-us" d={map.roads.us} />
        <path className="lm-road lm-road-i" d={map.roads.interstate} />
        {map.stateNames.map((s) => (
          <text key={s.text} className="lm-state-name" x={s.x} y={s.y} textAnchor={s.anchor}>
            {s.text}
          </text>
        ))}
        {map.route.map((d, i) => (
          <path key={`c${i}`} className="lm-route-casing" d={d} />
        ))}
        <path className="lm-connector" d={map.connectors} />
        {map.route.map((d, i) => (
          <path key={`r${i}`} className={i % 2 ? "lm-route lm-route-alt" : "lm-route"} d={d} />
        ))}
        {map.crossings.map((c) => (
          <g key={c.text} className="lm-crossing">
            <circle cx={c.x} cy={c.y} r={4} />
            <text x={c.lx} y={c.ly} textAnchor={c.anchor}>
              {c.text}
            </text>
          </g>
        ))}
        {map.places.map((p) => (
          <g key={p.text} className={p.main ? "lm-place" : "lm-place lm-place-minor"}>
            <circle cx={p.x0} cy={p.y0} r={3.6} />
            <text x={p.x} y={p.y} textAnchor={p.anchor}>
              {p.text}
            </text>
          </g>
        ))}
        {map.shields.map((s, i) => {
          const w = 16 + s.text.length * 12;
          return (
            <g key={`${s.text}-${i}`} className={`lm-shield lm-shield-${s.kind}`} transform={`translate(${s.x} ${s.y})`}>
              <rect x={-w / 2} y={-13} width={w} height={26} rx={s.kind === "interstate" ? 9 : 4} />
              <text y={6.5} textAnchor="middle">
                {s.text}
              </text>
            </g>
          );
        })}
        {map.markers.map((m) => (
          <g key={`${m.kind}-${m.n ?? 0}-${m.label}`} className={`lm-marker lm-marker-${m.kind}`}>
            <circle cx={m.x} cy={m.y} r={m.kind === "stop" ? 11 : 10} />
            {m.kind === "stop" ? (
              <text className="lm-marker-n" x={m.x} y={m.y + 6} textAnchor="middle">
                {m.n}
              </text>
            ) : (
              <circle className="lm-marker-core" cx={m.x} cy={m.y} r={4} />
            )}
            {m.label && m.kind !== "stop" ? (
              <text className="lm-marker-label" x={m.lx} y={m.ly} textAnchor={m.anchor}>
                {m.label}
              </text>
            ) : null}
          </g>
        ))}
        <g className="lm-scale" transform={`translate(${sx} ${sy})`}>
          <path d={`M0 -6V0H${map.scale.units.toFixed(1)}V-6`} />
          <text x={map.scale.units + 6} y={1}>
            {map.scale.miles} mi
          </text>
        </g>
        <g className="lm-north" transform={`translate(${width - 22} 30)`}>
          <path d="M0 -16L7 4L0 0L-7 4Z" />
          <text y={20} textAnchor="middle">
            N
          </text>
        </g>
      </svg>
      {stops.length > 0 ? (
        <ol className="lm-legend">
          {stops.map((m) => (
            <li key={m.n}>
              <span className="lm-legend-n">{m.n}</span>
              {m.label}
            </li>
          ))}
        </ol>
      ) : null}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
