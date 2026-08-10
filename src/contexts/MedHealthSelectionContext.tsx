import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Selection = Record<string, number>;

interface Ctx {
  selection: Selection;
  setSelection: React.Dispatch<React.SetStateAction<Selection>>;
  toggle: (code: string) => void;
  bumpQty: (code: string, delta: number) => void;
  removeItem: (code: string) => void;
  addMany: (codes: string[]) => void;
  /** Adds codes at quantity one, leaving anything already selected untouched. */
  addUnique: (codes: string[]) => void;
  clear: () => void;
}

const KEY = "medhealth-selection";

const MedHealthSelectionContext = createContext<Ctx | null>(null);

/** Keeps the catalogue selection alive while moving to a product page and back. */
export function MedHealthSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<Selection>(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Selection) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(selection));
    } catch {
      /* storage unavailable, selection simply will not persist */
    }
  }, [selection]);

  const value = useMemo<Ctx>(
    () => ({
      selection,
      setSelection,
      toggle: (code) =>
        setSelection((s) => {
          const next = { ...s };
          if (next[code]) delete next[code];
          else next[code] = 1;
          return next;
        }),
      bumpQty: (code, delta) =>
        setSelection((s) => {
          const q = (s[code] ?? 0) + delta;
          const next = { ...s };
          if (q <= 0) delete next[code];
          else next[code] = q;
          return next;
        }),
      removeItem: (code) =>
        setSelection((s) => {
          const next = { ...s };
          delete next[code];
          return next;
        }),
      addMany: (codes) =>
        setSelection((s) => {
          const next = { ...s };
          for (const c of codes) next[c] = (next[c] ?? 0) + 1;
          return next;
        }),
      addUnique: (codes) =>
        setSelection((s) => {
          const next = { ...s };
          for (const c of codes) if (!next[c]) next[c] = 1;
          return next;
        }),
      clear: () => setSelection({}),
    }),
    [selection],
  );

  return (
    <MedHealthSelectionContext.Provider value={value}>
      {children}
    </MedHealthSelectionContext.Provider>
  );
}

export function useMedHealthSelection() {
  const ctx = useContext(MedHealthSelectionContext);
  if (!ctx) throw new Error("useMedHealthSelection must be used inside MedHealthSelectionProvider");
  return ctx;
}
