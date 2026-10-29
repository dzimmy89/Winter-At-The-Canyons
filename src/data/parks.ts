export interface ParkImage {
  src: string;
  alt: string;
  credit: string;
  sourceUrl: string;
}

export interface ParkStop {
  stopId: string;
  name: string;
  visit: string;
  activities: string[];
  pets: string;
  url: string;
  image: ParkImage | null;
}

// Kolob Canyons is not on the plan: Sunday is the longest day, and the Utah stretch needs every hour of daylight.
export const parkStops: ParkStop[] = [];

export function parkForStop(stopId: string): ParkStop | undefined {
  return parkStops.find((park) => park.stopId === stopId);
}
