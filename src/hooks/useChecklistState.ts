import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "winter-expedition-checks";

function readStore(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

export function useChecklistState(ids: string[]): {
  checked: Record<string, boolean>;
  toggle: (id: string) => void;
} {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stored = readStore();
    const next: Record<string, boolean> = {};
    for (const id of ids) {
      next[id] = Boolean(stored[id]);
    }
    setChecked(next);
  }, [ids]);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      const stored = { ...readStore(), [id]: next[id] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      return next;
    });
  }, []);

  return { checked, toggle };
}
