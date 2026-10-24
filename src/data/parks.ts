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
    stopId: "pigeon_forge",
    name: "Great Smoky Mountains National Park",
    visit:
      "Off the Thursday November 12 clock. The drive stays on I-75 and I-40 to Cookeville.",
    activities: [
      "Open in November: Cades Cove Loop Road from the car, picnic areas, and park roads.",
      "Newfound Gap Road is usually open and closes when it ices. Check the park road status that morning.",
      "Leashed pets are allowed on the Gatlinburg Trail and the Oconaluftee River Trail only.",
      "Closed to cats: every other trail and the backcountry. Do not leave them in the car.",
    ],
    pets: "NPS: leashed pets on roads, campgrounds, picnic areas, the Gatlinburg Trail, and the Oconaluftee River Trail. Most trails are closed to pets.",
    url: "https://www.nps.gov/grsm/planyourvisit/pets.htm",
    image: null,
  },
  {
    stopId: "grand_junction",
    name: "Colorado National Monument",
    visit: "Off the Sunday clock. Rim Rock Drive is not a stop on the way to E17.",
    activities: [
      "Open when the road is open: Rim Rock Drive and the overlooks, seen from the car or a parking area.",
      "Snow and ice close Rim Rock Drive. If it is closed, the visit is the visitor center area only.",
      "Pets are not allowed on monument trails. One adult stays with the cats if the other steps to an overlook.",
      "Closed to cats: every trail, including Serpents Trail.",
    ],
    pets: "Pets are not allowed on monument trails. Parking areas and the scenic drive are the visit.",
    url: "https://www.nps.gov/colm/planyourvisit/pets.htm",
    image: null,
  },
];

export function parkForStop(stopId: string): ParkStop | undefined {
  return parkStops.find((park) => park.stopId === stopId);
}
