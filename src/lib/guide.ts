import { endAddress, hotelAddresses, legGuides, stopPlaces, startAddress, type LegGuide } from "../data/driveGuide";
import type { DriveDay, DriveLeg, DriveStopEvent, HotelNight } from "../data/types";

export type TimelineItem =
  | { kind: "depart"; clock: string; label: string; address: string }
  | { kind: "leg"; leg: DriveLeg; guide: LegGuide; from: string; to: string }
  | { kind: "stop"; stop: DriveStopEvent; place: string }
  | { kind: "arrive"; clock: string; label: string; address: string; hotel: HotelNight | null };

export interface DayGuide {
  timeline: TimelineItem[];
  evening: { stop: DriveStopEvent; place: string }[];
  inCar: DriveStopEvent[];
  start: string;
  end: string;
  roadStops: string[];
}

function guideFor(leg: DriveLeg): LegGuide {
  const guide = legGuides[leg.id];
  if (!guide) {
    throw new Error(`No directions for leg ${leg.id}`);
  }
  return guide;
}

function placeFor(stop: DriveStopEvent): string {
  return stopPlaces[stop.id] ?? stop.place;
}

function nightAddress(hotel: HotelNight | null): string {
  if (!hotel) {
    return endAddress;
  }
  return hotelAddresses[hotel.id] ?? `${hotel.propertyName}, ${hotel.city}, ${hotel.state}`;
}

// Builds the order the day is actually driven: leave, leg, stop, leg, stop, ..., arrive.
export function buildDayGuide(day: DriveDay, previous: DriveDay | null): DayGuide {
  const start = previous ? nightAddress(previous.hotel) : startAddress;
  const end = nightAddress(day.hotel);
  const stopsById = new Map(day.stops.map((stop) => [stop.id, stop]));
  const usedStops = new Set<string>();
  const timeline: TimelineItem[] = [
    { kind: "depart", clock: day.departClock, label: day.fromLabel, address: start },
  ];
  const roadStops: string[] = [];
  let from = start;
  day.legs.forEach((leg) => {
    const guide = guideFor(leg);
    const stop = guide.endStopId ? stopsById.get(guide.endStopId) : undefined;
    if (guide.endStopId && !stop) {
      throw new Error(`Leg ${leg.id} ends at unknown stop ${guide.endStopId}`);
    }
    const to = stop ? placeFor(stop) : (guide.navTo ?? end);
    timeline.push({ kind: "leg", leg, guide, from, to });
    if (stop) {
      usedStops.add(stop.id);
      roadStops.push(to);
      timeline.push({ kind: "stop", stop, place: to });
    }
    from = to;
  });
  timeline.push({ kind: "arrive", clock: day.arriveClock, label: day.toLabel, address: end, hotel: day.hotel });
  const rest = day.stops.filter((stop) => !usedStops.has(stop.id));
  return {
    timeline,
    evening: rest.filter((stop) => stop.place !== "In the car").map((stop) => ({ stop, place: placeFor(stop) })),
    inCar: rest.filter((stop) => stop.place === "In the car"),
    start,
    end,
    roadStops,
  };
}

export function formatMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) {
    return `${m} min`;
  }
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export function dayDrivingMinutes(day: DriveDay): number {
  return day.legs.reduce((sum, leg) => sum + guideFor(leg).minutes, 0);
}

export function mapsDayUrl(guide: DayGuide): string {
  const params = new URLSearchParams({ api: "1", origin: guide.start, destination: guide.end, travelmode: "driving" });
  if (guide.roadStops.length > 0) {
    params.set("waypoints", guide.roadStops.join("|"));
  }
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
