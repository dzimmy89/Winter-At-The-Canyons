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

export const parkStops: ParkStop[] = [
  {
    stopId: "kingman",
    name: "Zion National Park · Kolob Canyons",
    visit: "Sunday morning, about 4 hours north of Kingman at I-15 exit 40. It is the Zion district right on the interstate.",
    activities: [
      "Open year-round: the 5-mile Kolob Canyons Road to the Timber Creek overlook at about 6,200 feet, seen from the car and the pullouts.",
      "Snow can close the upper road for a few hours. If it is closed, the view from the visitor center lot is still the canyon walls.",
      "One adult stays with the cats if the other walks to an overlook rail.",
      "Closed to cats: every trail, including the Timber Creek Overlook Trail.",
    ],
    pets: "NPS: pets are allowed on roads, in parking areas, and in the car. They are not allowed on trails or in the wilderness.",
    url: "https://www.nps.gov/zion/planyourvisit/pets.htm",
    image: null,
  },
];

export function parkForStop(stopId: string): ParkStop | undefined {
  return parkStops.find((park) => park.stopId === stopId);
}
