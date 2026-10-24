import { formatUsdFlexible } from "../lib/money";

export interface ExpenseRow {
  label: string;
  amount: number;
  note?: string;
}

interface Props {
  caption: string;
  rows: ExpenseRow[];
  totalLabel?: string;
  total?: number;
}

export function ExpenseTable({ caption, rows, totalLabel, total }: Props) {
  return (
    <div className="table-wrap">
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Line</th>
            <th scope="col">Amount</th>
            <th scope="col">Note</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td data-label="Line">{row.label}</td>
              <td className="num" data-label="Amount">{formatUsdFlexible(row.amount)}</td>
              <td className="muted" data-label="Note">{row.note ?? "—"}</td>
            </tr>
          ))}
        </tbody>
        {total !== undefined ? (
          <tfoot>
            <tr>
              <th scope="row">{totalLabel ?? "Total"}</th>
              <td className="num">{formatUsdFlexible(total)}</td>
              <td />
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}
