import {
  hotelProfiles,
  hotelTown,
  routeTownOrder,
  stopStories,
  townProfiles,
  type HotelProfile,
  type TownProfile,
} from "../data/placeNotes";

export function StopStoryBlock({ stopId }: { stopId: string }) {
  const story = stopStories[stopId];
  if (!story) {
    return null;
  }
  const town = story.townId ? townProfiles[story.townId] : undefined;
  return (
    <div className="stop-story">
      <p className="story-hook">{story.hook}</p>
      <h4>What it is</h4>
      {story.what.map((line) => (
        <p key={line}>{line}</p>
      ))}
      {story.cats ? (
        <p className="muted tight">
          <strong>With the cats:</strong> {story.cats}
        </p>
      ) : null}
      {town ? <TownDetails town={town} /> : null}
    </div>
  );
}

export function StayNotes({ hotelId }: { hotelId: string | null }) {
  const key = hotelId ?? "dest";
  const hotel = hotelId ? hotelProfiles[hotelId] : undefined;
  const townId = hotelTown[key];
  const town = townId ? townProfiles[townId] : undefined;
  if (!hotel && !town) {
    return null;
  }
  return (
    <div className="stop-story">
      {town ? <p className="story-hook">{town.tagline}</p> : null}
      {hotel ? (
        <details className="place-more" open>
          <summary>About the hotel</summary>
          <HotelBody hotel={hotel} />
        </details>
      ) : null}
      {town ? <TownDetails town={town} open={!hotel} /> : null}
    </div>
  );
}

function TownDetails({ town, open = false }: { town: TownProfile; open?: boolean }) {
  return (
    <details className="place-more" open={open}>
      <summary>About {town.name}</summary>
      <TownBody town={town} />
    </details>
  );
}

function TownBody({ town }: { town: TownProfile }) {
  return (
    <>
      <dl className="town-facts">
        {town.facts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
      {town.about.map((line) => (
        <p key={line}>{line}</p>
      ))}
      <h4>Good to know</h4>
      <ul className="plain-list tight">
        {town.goodToKnow.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </>
  );
}

function HotelBody({ hotel }: { hotel: HotelProfile }) {
  return (
    <>
      <p className="muted tight">
        <strong>{hotel.name}</strong> · {hotel.address}
      </p>
      {hotel.about.map((line) => (
        <p key={line}>{line}</p>
      ))}
      <h4>Tips</h4>
      <ul className="plain-list tight">
        {hotel.tips.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </>
  );
}

// Every town on the route in driving order, with its hotel when it is a night.
export function RouteTownsIndex() {
  const hotelByTown = new Map<string, HotelProfile>();
  for (const [hotelId, townId] of Object.entries(hotelTown)) {
    const hotel = hotelProfiles[hotelId];
    if (hotel && hotelId !== "st_george") {
      hotelByTown.set(townId, hotel);
    }
  }
  return (
    <div className="town-index">
      {routeTownOrder.map((id) => {
        const town = townProfiles[id];
        if (!town) {
          throw new Error(`No town profile for ${id}`);
        }
        const hotel = hotelByTown.get(id);
        return (
          <article key={id} className="town-card">
            <p className="stop-kind">{hotel ? "Overnight" : id === "kimball-junction" ? "Home" : "Stop"}</p>
            <h3>{town.name}</h3>
            <p className="story-hook">{town.tagline}</p>
            <TownBody town={town} />
            {hotel ? (
              <>
                <h4>The hotel</h4>
                <HotelBody hotel={hotel} />
              </>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
