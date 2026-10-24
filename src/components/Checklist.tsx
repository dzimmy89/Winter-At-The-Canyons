import { useMemo } from "react";
import { useChecklistState } from "../hooks/useChecklistState";

interface Item {
  id: string;
  label: string;
}

interface Props {
  title: string;
  items: Item[];
}

export function Checklist({ title, items }: Props) {
  const ids = useMemo(() => items.map((i) => i.id), [items]);
  const { checked, toggle } = useChecklistState(ids);

  return (
    <section className="panel">
      <h3>{title}</h3>
      <ul className="checklist">
        {items.map((item) => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={Boolean(checked[item.id])}
                onChange={() => toggle(item.id)}
              />
              <span>{item.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
