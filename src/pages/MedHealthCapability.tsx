import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Search, Download, Loader2, AlertCircle, Home } from "lucide-react";
import {
  CATEGORIES,
  buildKits,
  downloadCsv,
  fetchProducts,
  money,
  groupOf,
  toCsv,
  type Product,
} from "@/lib/medhealth-catalogue";
import { MedHealthLogo, SupplyMinistryLogo } from "@/components/medhealth-catalogue/Brand";
import { ProductCard } from "@/components/medhealth-catalogue/ProductCard";
import { KitsRow } from "@/components/medhealth-catalogue/KitsRow";
import { KitSheet, type Kit } from "@/components/medhealth-catalogue/KitSheet";
import { ReviewSheet, type Line } from "@/components/medhealth-catalogue/ReviewSheet";

const PARTNER_NAME = "MedHealth";

const theme = {
  "--sm": "#3D2D9E",
  "--sm-hover": "#2E2178",
  "--sm-cream": "#F4EFE6",
  "--sm-cream-2": "#FBF8F2",
  "--p-ink": "#231F20",
  "--p-ink-soft": "#4C6B77",
  "--p-accent": "#2A5263",
  "--p-accent-pale": "#E3EEF1",
  "--blend": "#33456B",
  "--mh-amber": "#FCB040",
  "--mh-red": "#EC1C24",
} as React.CSSProperties;

const MedHealthCapability = () => {
  const [tab, setTab] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState<Record<string, number>>({});
  const [reviewing, setReviewing] = useState(false);
  const [viewingKit, setViewingKit] = useState<Kit | null>(null);

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
      style={theme}
      className="min-h-screen bg-background font-[Outfit,system-ui,sans-serif] text-[#231F20] antialiased"
    >
      <Helmet>
        <title>Dedicated catalogue | Supply Ministry</title>
        <meta name="description" content="Private assistive technology ordering catalogue." />
        <meta name="robots" content="noindex, nofollow" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="h-1.5 w-full" style={{ backgroundImage: "linear-gradient(90deg, #3D2D9E 0%, #33456B 38%, #2A5263 72%, #FCB040 100%)" }} />

      {/* Masthead */}
      <header style={{ backgroundColor: "#F4EFE6" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={goHome}
            aria-label="Back to catalogue home"
            className="rounded-lg transition-opacity hover:opacity-80"
          >
            <SupplyMinistryLogo />
          </button>
          <span
            className="rounded-full border px-3 py-1 text-xs font-medium"
            style={{ borderColor: "rgba(61,45,158,0.3)", color: "#3D2D9E" }}
          >
            Dedicated catalogue
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <h1
          className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
          style={{ fontFamily: "Outfit, system-ui, sans-serif" }}
        >
          Assistive technology catalogue for{" "}
          <MedHealthLogo className="text-3xl sm:text-4xl" />
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          A dedicated selection for the {PARTNER_NAME} injury-rehabilitation and OT team. Select
          items or a clinical kit, then send through for a formal quote.
        </p>
      </div>

      {/* Sticky toolbar */}
      <div
        className="sticky top-0 z-30 mt-6 border-b border-border backdrop-blur-md"
        style={{ backgroundColor: "rgba(255,255,255,0.85)" }}
      >
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={goHome}
              className="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#33456B" }}
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
                className="min-h-11 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-base outline-none focus:border-[#33456B]"
              />
            </div>
            <button
              type="button"
              onClick={exportVisible}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors hover:bg-[rgba(51,69,107,0.1)]"
              style={{ borderColor: "rgba(51,69,107,0.4)", color: "#33456B" }}
            >
              <Download className="h-4 w-4" aria-hidden="true" /> Export
            </button>
          </div>

          <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            {["All", ...CATEGORIES].map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={tab === c}
                onClick={() => setTab(c)}
                className="min-h-11 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors"
                style={{
                  borderColor: tab === c ? "#33456B" : "hsl(var(--border))",
                  backgroundColor: tab === c ? "#33456B" : "transparent",
                  color: tab === c ? "#F4EFE6" : "#231F20",
                }}
              >
                {c} <span className="opacity-70">({counts[c] ?? 0})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 pb-40 pt-6 sm:px-6">
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
                <section key={group} className="mb-10" aria-labelledby={`g-${group}`}>
                  <h2
                    id={`g-${group}`}
                    className="mb-3 text-sm font-semibold uppercase tracking-wide"
                    style={{ color: "#33456B", fontFamily: "Outfit, system-ui, sans-serif" }}
                  >
                    {group}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border" style={{ backgroundColor: "#F4EFE6" }}>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <SupplyMinistryLogo compact />
            <span className="text-border">|</span>
            <MedHealthLogo className="text-xl" />
          </div>
          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            Supply Ministry Pty Ltd, a Dignitech brand. Prepared for the MedHealth team, August
            2026. Not a statement of partnership, endorsement or approval by MedHealth. GST-free
            status on eligible items confirmed on quote.
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
                Indicative total {money(total)}
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
