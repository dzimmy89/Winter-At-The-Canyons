import { parkCityConfirmChecklist, priorPublicListing, signedLease } from "../data/parkCity";
import type { Listing } from "../data/types";
import { formatUsd } from "../lib/money";
import { Checklist } from "./Checklist";

interface Props {
  listing: Listing;
}

export function ParkCityLease({ listing }: Props) {
  return (
    <section id="lease" className="section">
      <p className="eyebrow">Lease</p>
      <h1>Signed. Not the old listing.</h1>
      <dl className="fact-strip">
        <div>
          <dt>Address</dt>
          <dd>{signedLease.address}</dd>
        </div>
        <div>
          <dt>Term</dt>
          <dd>{signedLease.dates}</dd>
        </div>
        <div>
          <dt>Rent</dt>
          <dd>{formatUsd(signedLease.allInMonthly)} / month</dd>
        </div>
      </dl>
      <p className="lede">
        You are the tenant here. The drive ends at {signedLease.address}, Canyon Creek Club, Kimball Junction. 4922 NW
        81st Ave is the Gainesville house a property manager lists. Do not mix the two. The signed term is{" "}
        {signedLease.dates} at {formatUsd(signedLease.allInMonthly)} a month through May 15, 2027. Confirm what that
        includes.
      </p>

      <article className="listing-card dossier-card band-qualifying is-active">
        <div className="listing-identity">
          <span className="kicker">Park City, UT · Signed lease</span>
          <strong>{listing.name}</strong>
          <span className="muted tight">
            {signedLease.complex} · {signedLease.dates}
          </span>
        </div>
        <p className="listing-rent">
          <span className="metric">{formatUsd(listing.allInMonthly)} / month</span>
          <span className="muted tight">
            {listing.bedrooms} bd / {listing.bathrooms} ba on the prior public listing · confirm the signed lease
          </span>
        </p>
        <p className="source-row">
          <a href={priorPublicListing.url} target="_blank" rel="noreferrer">
            {priorPublicListing.sourceLabel}
          </a>
        </p>
      </article>

      <div className="unknown-grid">
        <article className="panel">
          <h3>Signed</h3>
          <dl className="fact-list">
            <div>
              <dt>Address</dt>
              <dd>{signedLease.address}</dd>
            </div>
            <div>
              <dt>Term</dt>
              <dd>
                {signedLease.start} through {signedLease.end}
              </dd>
            </div>
            <div>
              <dt>Rent</dt>
              <dd>{formatUsd(signedLease.allInMonthly)} a month through May 15, 2027</dd>
            </div>
          </dl>
        </article>
        <article className="panel">
          <h3>Prior public listing — not this lease</h3>
          <p>{priorPublicListing.note}</p>
          <dl className="fact-list">
            <div>
              <dt>That season</dt>
              <dd>
                {priorPublicListing.season} at {priorPublicListing.rentThen}
              </dd>
            </div>
            <div>
              <dt>Unit then</dt>
              <dd>
                {priorPublicListing.beds} bed / {priorPublicListing.baths} bath · {priorPublicListing.sqft.toLocaleString()}{" "}
                sqft · furnished
              </dd>
            </div>
            <div>
              <dt>Pets then</dt>
              <dd>{priorPublicListing.pets}</dd>
            </div>
            <div>
              <dt>Utilities then</dt>
              <dd>{priorPublicListing.utilities}</dd>
            </div>
            <div>
              <dt>Parking then</dt>
              <dd>{priorPublicListing.parking}</dd>
            </div>
            <div>
              <dt>Listed by</dt>
              <dd>{priorPublicListing.manager}</dd>
            </div>
          </dl>
        </article>
      </div>

      <Checklist title="Confirm against the lease you signed" items={parkCityConfirmChecklist} />
    </section>
  );
}
