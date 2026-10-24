import { corridorBrief } from "../data/catalog";

export function CorridorSources() {
  const { results, retrievedAt } = corridorBrief;

  return (
    <div className="table-wrap">
      <table>
        <caption>Winter road sources · Gainesville to Park City</caption>
        <thead>
          <tr>
            <th scope="col">Source</th>
            <th scope="col">Relevance</th>
          </tr>
        </thead>
        <tbody>
          {results.map((source) => (
            <tr key={source.url}>
              <td>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.title || source.url}
                </a>
                {source.description ? <div className="muted tight">{source.description}</div> : null}
              </td>
              <td>{source.relevance}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="disclaimer">
        Official pages filed {retrievedAt}. These are the winter-road, chain-law, and pass sources for the Gainesville
        to Kimball Junction drive. The Drive section reads this file. It does not call the API.
      </p>
    </div>
  );
}
