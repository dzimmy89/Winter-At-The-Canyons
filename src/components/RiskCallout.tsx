interface Item {
  title: string;
  body: string;
}

interface Props {
  items: Item[];
}

export function RiskCallout({ items }: Props) {
  return (
    <div className="risk-stack">
      {items.map((item) => (
        <aside key={item.title} className="risk">
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </aside>
      ))}
    </div>
  );
}
