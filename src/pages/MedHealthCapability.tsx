import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Search, Download, Loader2, Home, ShoppingBag, Mail, Phone } from "lucide-react";
import {
  CATEGORIES,
  buildKits,
  downloadCsv,
  fetchProducts,
  money,
  groupOf,
  normaliseCategory,
  toCsv,
  type Product,
} from "@/lib/medhealth-catalogue";
import { MedHealthLogo, SupplyMinistryLogo, PartnerLockup } from "@/components/medhealth-catalogue/Brand";
import { PARTNER, HOUSE } from "@/partners/medhealth";
import { ProductCard } from "@/components/medhealth-catalogue/ProductCard";
import { KitsRow } from "@/components/medhealth-catalogue/KitsRow";
import { KitSheet, type Kit } from "@/components/medhealth-catalogue/KitSheet";
import { ReviewSheet, type Line } from "@/components/medhealth-catalogue/ReviewSheet";
import { SourcingCallout } from "@/components/medhealth-catalogue/SourcingCallout";

const PARTNER_NAME = PARTNER.name;
const FONT = "Raleway, system-ui, sans-serif";

/**
 * Pick a column count that leaves the last row looking intentional rather than
 * like a broken four-up grid. Prefers an exact fit, then a near-full last row.
 */
const colsFor = (n: number) => {
  for (const c of [4, 3, 2]) if (n % c === 0) return c;
  for (const c of [4, 3, 2]) if (n % c >= c - 1) return c;
  return 3;
};
const COL_CLASS: Record<number, string> = {
  4: "lg:grid-cols-3 xl:grid-cols-4",
  3: "lg:grid-cols-3",
  2: "lg:grid-cols-2",
};

/** Every partner-specific value comes from src/partners/medhealth.ts. */
const theme = {
  "--sm": HOUSE.violet,
  "--sm-hover": HOUSE.violetHover,
  "--sm-cream": HOUSE.cream,
  "--sm-cream-2": HOUSE.cream2,
  "--p-ink": PARTNER.ink,
  "--p-accent": PARTNER.accent,
  "--p-accent-pale": PARTNER.accentPale,
  "--p-rule": PARTNER.rule,
} as React.CSSProperties;

const MedHealthCapability = () => {
  const [tab, setTab] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState<Record<string, number>>({});
  const [reviewing, setReviewing] = useState(false);
  const [viewingKit, setViewingKit] = useState<Kit | null>(null);
  /** Purely visual scroll indicator. Never affects filtering. */
  const [spyGroup, setSpyGroup] = useState<string | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef(new Map<string, HTMLElement>());
  const pillStripRef = useRef<HTMLDivElement | null>(null);
  const pillRefs = useRef(new Map<string, HTMLButtonElement>());
  const [puck, setPuck] = useState<{ left: number; width: number } | null>(null);
  const [puckReady, setPuckReady] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["microsite_products", "medhealth"],
    queryFn: fetchProducts,
  });

  const products = useMemo(() => data ?? [], [data]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: products.length };
    for (const c of CATEGORIES) map[c] = 0;
    for (const p of products) {
      const c = groupOf(p);
      map[c] = (map[c] ?? 0) + 1;
    }
    return map;
  }, [products]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (tab !== "All" && groupOf(p) !== tab) return false;
      if (!q) return true;
      return `${p.product_name} ${p.key_specifications ?? ""} ${p.product_code}`
        .toLowerCase()
        .includes(q);
    });
  }, [products, tab, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, Product[]>();
    for (const p of visible) {
      const g = p.clinical_group || "Other";
      map.set(g, [...(map.get(g) ?? []), p]);
    }
    return [...map.entries()];
  }, [visible]);

  const kits = useMemo(() => buildKits(products), [products]);

  const groupKeys = useMemo(() => grouped.map(([g]) => g).join("|"), [grouped]);

  // Scroll-spy: highlights the pill for the section under the sticky bars.
  useEffect(() => {
    if (tab !== "All" || query.trim()) {
      setSpyGroup(null);
      return;
    }
    const entriesMap = sectionRefs.current;
    if (entriesMap.size === 0) return;

    const headerH = stickyRef.current?.offsetHeight ?? 120;
    const visible = new Set<string>();

    const pick = () => {
      let best: string | null = null;
      let bestTop = Infinity;
      for (const key of visible) {
        const el = entriesMap.get(key);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top < bestTop) {
          bestTop = top;
          best = key;
        }
      }
      setSpyGroup(best);
    };

    const observer = new IntersectionObserver(
      (obsEntries) => {
        for (const e of obsEntries) {
          const key = (e.target as HTMLElement).dataset.group;
          if (!key) continue;
          if (e.isIntersecting) visible.add(key);
          else visible.delete(key);
        }
        pick();
      },
      { rootMargin: `-${headerH}px 0px -55% 0px`, threshold: 0 },
    );

    for (const el of entriesMap.values()) observer.observe(el);
    return () => observer.disconnect();
  }, [tab, query, groupKeys]);

  const lines: Line[] = useMemo(
    () =>
      products
        .filter((p) => (selection[p.product_code] ?? 0) > 0)
        .map((p) => ({ product: p, qty: selection[p.product_code]! })),
    [products, selection],
  );
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + (l.product.price_rrp ?? 0) * l.qty, 0);

  const toggle = (code: string) =>
    setSelection((s) => {
      const next = { ...s };
      if (next[code]) delete next[code];
      else next[code] = 1;
      return next;
    });

  const bumpQty = (code: string, delta: number) =>
    setSelection((s) => {
      const q = (s[code] ?? 0) + delta;
      const next = { ...s };
      if (q <= 0) delete next[code];
      else next[code] = q;
      return next;
    });

  const addKit = (items: Product[]) =>
    setSelection((s) => {
      const next = { ...s };
      for (const p of items) next[p.product_code] = (next[p.product_code] ?? 0) + 1;
      return next;
    });

  const removeItem = (code: string) =>
    setSelection((s) => {
      const next = { ...s };
      delete next[code];
      return next;
    });

  const goHome = () => {
    setTab("All");
    setQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const exportVisible = () =>
    downloadCsv(
      "supply-ministry-catalogue.csv",
      toCsv(
        visible.map((p) => ({
          Category: p.category,
          Product: p.product_name,
          Code: p.product_code,
          Price: p.price_rrp ?? "",
        })),
        ["Category", "Product", "Code", "Price"],
      ),
    );

  return (
    <div
      style={{ ...theme, fontFamily: FONT }}
      className="min-h-screen bg-background text-[#231F20] antialiased"
    >
      <Helmet>
        <title>Dedicated catalogue | Supply Ministry</title>
        <meta name="description" content="Private assistive technology ordering catalogue." />
        <meta name="robots" content="noindex, nofollow" />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      {/* One continuous rule: house violet, through partner ink, into partner accent. */}
      <div
        className="h-1.5 w-full"
        style={{
          backgroundImage: `linear-gradient(90deg, ${HOUSE.violet} 0%, ${PARTNER.ink} 55%, ${PARTNER.accent} 100%)`,
        }}
      />

      {/* Masthead and toolbar share one sticky container so they can never mismatch. */}
      <div ref={stickyRef} className="sticky top-0 z-40">
      <header
        style={{ backgroundColor: HOUSE.cream, borderBottom: `1px solid ${PARTNER.rule}` }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <PartnerLockup onHome={goHome} />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => itemCount > 0 && setReviewing(true)}
              className="flex min-h-11 min-w-[7.5rem] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-100"
              disabled={itemCount === 0}
              style={
                itemCount === 0
                  ? { backgroundColor: "rgba(61,45,158,0.12)", color: HOUSE.violet }
                  : { backgroundColor: HOUSE.violet, color: "#F4EFE6" }
              }
              aria-label={`Review selection, ${itemCount} item${itemCount === 1 ? "" : "s"}, ${money(total)}`}
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              <span className="hidden whitespace-nowrap sm:inline">
                {itemCount} item{itemCount === 1 ? "" : "s"}
              </span>
              <span className="sm:hidden">{itemCount}</span>
              <span className="whitespace-nowrap opacity-80">{money(total)}</span>
            </button>
            <span
              className="hidden whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium lg:inline-block"
              style={{ borderColor: PARTNER.rule, color: PARTNER.ink }}
            >
              {PARTNER.badge}
            </span>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div
        className="border-b border-border backdrop-blur-md"
        style={{ backgroundColor: "rgba(255,255,255,0.97)" }}
      >
        <div className="mx-auto max-w-6xl px-4 py-2.5 sm:px-6">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={goHome}
              className="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: HOUSE.violet }}
            >
              <Home className="h-4 w-4" aria-hidden="true" /> Catalogue home
            </button>
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, spec or code"
                aria-label="Search products"
                className="min-h-11 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-[#3D2D9E] focus:ring-2 focus:ring-[#3D2D9E]/25"
              />
            </div>
            <button
              type="button"
              onClick={exportVisible}
              className="flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors hover:bg-[rgba(61,45,158,0.08)]"
              style={{ borderColor: HOUSE.violet, color: HOUSE.violet }}
            >
              <Download className="h-4 w-4" aria-hidden="true" /> Export
            </button>
          </div>

          <div className="-mx-4 mt-2.5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            {["All", ...CATEGORIES].map((c) => {
              const selected = tab === c;
              const spied =
                !selected && tab === "All" && spyGroup != null && normaliseCategory(spyGroup) === c;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setTab(c);
                    setSpyGroup(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="min-h-11 shrink-0 rounded-full border px-3.5 text-xs font-semibold transition-colors"
                  style={{
                    borderColor: selected || spied ? HOUSE.violet : "hsl(var(--border))",
                    backgroundColor: selected
                      ? HOUSE.violet
                      : spied
                        ? "rgba(61,45,158,0.10)"
                        : "transparent",
                    color: selected ? "#F4EFE6" : spied ? HOUSE.violet : "#231F20",
                  }}
                >
                  {c} <span className="opacity-70">({counts[c] ?? 0})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-1 pt-5 sm:px-6">
        <h1
          className="text-balance text-lg font-bold leading-tight tracking-tight sm:text-2xl"
          style={{ color: PARTNER.ink }}
        >
          Assistive technology catalogue for the {PARTNER_NAME} team
        </h1>
        <p
          className="text-pretty pt-1.5 text-xs leading-relaxed sm:text-sm"
          style={{ color: "rgba(1,10,22,0.68)" }}
        >
          Select individual items or a clinical kit, then review and send your request.
        </p>
      </div>

      <main
        className={`mx-auto max-w-6xl px-4 pt-5 sm:px-6 ${lines.length > 0 ? "pb-56" : "pb-24"}`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading catalogue…
          </div>
        ) : isError ? (
          <p role="alert" className="rounded-2xl p-4 text-sm" style={{ backgroundColor: "rgba(236,28,36,0.1)", color: "#EC1C24" }}>
            We couldn't load the catalogue just now. Please refresh to try again.
          </p>
        ) : (
          <>
            {tab === "All" && !query && (
              <KitsRow kits={kits} onAdd={addKit} onView={(k) => setViewingKit(k)} />
            )}

            {grouped.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                No products match that search.
              </p>
            ) : (
              grouped.map(([group, items]) => (
                <section
                  key={group}
                  data-group={group}
                  ref={(el) => {
                    if (el) sectionRefs.current.set(group, el);
                    else sectionRefs.current.delete(group);
                  }}
                  className="mb-8"
                  aria-labelledby={`g-${group}`}
                >
                  <h2
                    id={`g-${group}`}
                    className="mb-2.5 text-xs font-semibold uppercase tracking-[0.12em]"
                    style={{ color: "#010A16" }}
                  >
                    {group}
                  </h2>
                  <div className={`grid gap-3 sm:grid-cols-2 ${COL_CLASS[colsFor(items.length)]}`}>
                    {items.map((p) => (
                      <ProductCard
                        key={p.product_code}
                        product={p}
                        qty={selection[p.product_code] ?? 0}
                        onToggle={() => toggle(p.product_code)}
                        onQty={(d) => bumpQty(p.product_code, d)}
                      />
                    ))}
                  </div>
                </section>
              ))
            )}

            <SourcingCallout />
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: HOUSE.cream, borderTop: `1px solid ${PARTNER.rule}` }}>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <SupplyMinistryLogo compact />
            <span aria-hidden="true" className="h-6 w-px" style={{ backgroundColor: PARTNER.rule }} />
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: "rgba(1,10,22,0.55)" }}
            >
              {PARTNER.preparedFor}
            </span>
            <MedHealthLogo className="text-xl" />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <a
              href="tel:0404593090"
              aria-label="Call Supply Ministry on 0404 593 090"
              className="flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors hover:bg-[rgba(61,45,158,0.08)]"
              style={{ borderColor: HOUSE.violet, color: HOUSE.violet }}
            >
              <Phone className="h-4 w-4" aria-hidden="true" /> 0404 593 090
            </a>
            <a
              href="mailto:hello@supplyministry.com.au"
              aria-label="Email Supply Ministry at hello@supplyministry.com.au"
              className="flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors hover:bg-[rgba(61,45,158,0.08)]"
              style={{ borderColor: HOUSE.violet, color: HOUSE.violet }}
            >
              <Mail className="h-4 w-4" aria-hidden="true" /> hello@supplyministry.com.au
            </a>
          </div>

          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            {PARTNER.disclaimer}
          </p>
        </div>
      </footer>

      {/* Selection bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${
          itemCount > 0 ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={itemCount === 0}
      >
        <div className="mx-auto max-w-6xl p-3 sm:p-4">
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl"
            style={{ backgroundColor: "#231F20" }}
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold" style={{ color: "#F4EFE6" }}>
                {itemCount} item{itemCount === 1 ? "" : "s"} selected
              </p>
              <p className="text-xs" style={{ color: "rgba(244,239,230,0.7)" }}>
                Product subtotal {money(total)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelection({})}
              className="min-h-11 rounded-xl px-3 text-sm font-medium transition-colors hover:text-white"
              style={{ color: "rgba(244,239,230,0.8)" }}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setReviewing(true)}
              className="min-h-11 rounded-xl px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#3D2D9E" }}
            >
              Review & send
            </button>
          </div>
        </div>
      </div>

      {reviewing && (
        <ReviewSheet
          lines={lines}
          total={total}
          onQty={bumpQty}
          onRemove={removeItem}
          onClose={() => setReviewing(false)}
          onComplete={() => {
            setSelection({});
            setReviewing(false);
          }}
        />
      )}

      {viewingKit && (
        <KitSheet kit={viewingKit} onClose={() => setViewingKit(null)} onAdd={addKit} />
      )}
    </div>
  );
};

export default MedHealthCapability;
